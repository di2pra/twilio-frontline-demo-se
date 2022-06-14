import { NextFunction, Request, Response } from "express";
import Configuration from "../models/configuration.js";
import Template from "../models/template.js";
import fs from "fs";
import tmp from "tmp";
import { Validator } from 'jsonschema';
import Setting from "../models/setting.js";
import Language from "../models/language.js";
import { ErrorHandler } from "../../../helpers.js";

const ImportFileSchema = {
  "id": "/ImportFileSchema",
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "data": {
      "type": "object",
      "properties": {
        "lang": { "type": "string" },
        "configuration": {
          "type": "object",
          "properties": {
            "selectedPollyVoice": { "type": "string" },
            "companyNameShort": { "type": "string" },
            "companyNameLong": { "type": "string" }
          },
          "required": ["selectedPollyVoice", "companyNameShort", "companyNameLong"]
        },
        "template": {
          "type": "array",
          "items": {
            "properties": {
              "display_name": { "type": "string" },
              "templates": {
                "type": "array",
                "items": {
                  "properties": {
                    "content": { "type": "string" },
                    "whatsAppApproved": { "type": "boolean" }
                  },
                  "required": ["content", "whatsAppApproved"]
                }
              }
            },
            "required": ["display_name", "templates"]
          }
        }
      },
      "required": ["lang", "configuration", "template"]
    }
  },
  "required": ["version", "data"]
};

export default class CustomizationController {

  static export = async (_: Request, res: Response, next: NextFunction) => {

    try {

      const setting = await Setting.get();
      const configuration = await Configuration.get();
      const template = await Template.get();

      const jsonContent = JSON.stringify({
        version: "1.0",
        data: {
          lang: setting?.lang,
          configuration: configuration,
          template: template
        }
      });

      tmp.file(function (err, path, _, cleanupCallback) {
        if (err) throw err;
        fs.writeFileSync(path, jsonContent);
        res.download(path, "twilio-fronline-demo-customization.json");
        cleanupCallback();
      });


    } catch (error) {
      next(error)
    }

  };

  static import = async (req: Request, res: Response, next: NextFunction) => {

    try {

      if (!req.files) {
        res.json({
          status: false,
          message: 'No file uploaded'
        });
      } else {


        const jsonRawData = req.files.import_file as any;
        const json = JSON.parse(jsonRawData.data);

        const v = new Validator();

        const result = v.validate(json, ImportFileSchema);

        if (result.errors.length > 0) {
          throw Error('Invalid File content');
        }

        const languages = await Language.getAll();

        const selectedLanguage = languages.find(item => { return item.lang === String(json.data.lang) });

        if (selectedLanguage) {

          await Setting.set(selectedLanguage.setting);
          await Configuration.set(json.data.configuration);
          await Template.set(json.data.template);

          res.status(200).json({
            selectedSetting: selectedLanguage.setting,
            settings: languages.map(item => item.setting)
          });

        } else {
          throw new ErrorHandler(400, 'File Corrupted');
        }

        res.json({});

      }

    } catch (error) {
      next(error)
    }

  };

}
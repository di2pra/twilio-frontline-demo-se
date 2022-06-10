import { NextFunction, Request, Response } from "express";
import Configuration from "../models/configuration.js";
import Template from "../models/template.js";
import fs from "fs";
import tmp from "tmp";
import { Validator } from 'jsonschema';

const ImportFileSchema = {
  "id": "/ImportFileSchema",
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "data": {
      "type": "object",
      "properties": {
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
      "required": ["configuration", "template"]
    }
  },
  "required": ["version", "data"]
};

export default class CustomizationController {

  export = async (_: Request, res: Response, next: NextFunction) => {

    try {

      const configuration = await Configuration.get();
      const template = await Template.get();

      const jsonContent = JSON.stringify({
        version: "1.0",
        data: {
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

  import = async (req: Request, res: Response, next: NextFunction) => {

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

        if(result.errors.length > 0) {
          throw Error('Invalid File content');
        }

        res.json({});

        /*console.log(`version : ${json.version}`);
        console.log(`data : ${json.data}`);*/

      }

      /*const configuration = await Configuration.get();
      const template = await Template.get();

      const jsonContent = JSON.stringify({
        version: "1.0",
        data: {
          configuration: configuration,
          template: template
        }
      });

      tmp.file(function (err, path, fd, cleanupCallback) {
        if (err) throw err;
        fs.writeFileSync(path, jsonContent);
        res.download(path, "twilio-fronline-demo-customization.json");

        cleanupCallback();
      });*/


    } catch (error) {
      next(error)
    }

  };

}
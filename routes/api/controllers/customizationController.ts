import { NextFunction, Request, Response } from "express";
import Configuration from "../models/configuration.js";
import Template from "../models/template.js";
import fs from "fs";
import tmp from "tmp";

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

      tmp.file(function (err, path, fd, cleanupCallback) {
        if (err) throw err;
        fs.writeFileSync(path, jsonContent);
        res.download(path, "twilio-fronline-demo-customization.json");

        cleanupCallback();
      });


    } catch (error) {
      next(error)
    }

  };

  import = async (_: Request, res: Response, next: NextFunction) => {

    try {

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

  /*setSelectedSetting = async (req: Request, res: Response, next: NextFunction) => {

    try {

      if (typeof req.body.lang === "undefined") {
        throw new ErrorHandler(400, 'Bad Request : lang not defined');
      }

      const languages = await Language.getAll();

      const selectedLanguage = languages.find(item => { return item.lang === String(req.body.lang) });

      if (typeof selectedLanguage === "undefined") {
        throw new ErrorHandler(400, 'Bad Request : lang unknown');
      } else {

        await Setting.set(selectedLanguage.setting);
        await Configuration.set(selectedLanguage.configuration);
        await Template.set(selectedLanguage.template);

        res.status(200).json({
          selectedSetting: selectedLanguage.setting,
          settings: languages.map(item => item.setting)
        });

      }

    } catch (error) {
      next(error)
    }

  };*/

}
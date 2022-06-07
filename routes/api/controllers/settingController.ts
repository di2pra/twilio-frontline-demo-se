import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../helpers.js";
import Configuration from "../models/configuration.js";
import Conversation from "../models/conversation.js";
import Language from "../models/language.js";
import Setting from "../models/setting.js";
import Template from "../models/template.js";

export default class SettingController {

  get = async (_: Request, res: Response, next: NextFunction) => {

    try {

      const languages = await Language.getAll();

      let selectedSetting = await Setting.get();

      if(selectedSetting === null) {
        selectedSetting = languages[0].setting;
        await Setting.set(languages[0].setting);
        await Configuration.set(languages[0].configuration);
        await Template.set(languages[0].template);
      }

      res.status(200).json({
        selectedSetting: selectedSetting,
        settings: languages.map(item => item.setting)
      });


    } catch (error) {
      next(error)
    }

  };

  setSelectedSetting = async (req: Request, res: Response, next: NextFunction) => {

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
        await Conversation.deleteAll();

        res.status(200).json({
          selectedSetting: selectedLanguage.setting,
          settings: languages.map(item => item.setting)
        });

      }

    } catch (error) {
      next(error)
    }

  };

}
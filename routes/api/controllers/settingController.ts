import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../helpers.js";
import Configuration from "../models/configuration.js";
import Conversation from "../models/conversation.js";
import Language from "../models/language.js";
import Setting from "../models/setting.js";
import Template from "../models/template.js";

export default class SettingController {

  static setSelectedSetting = async (req: Request, res: Response, next: NextFunction) => {

    try {

      if (typeof req.body.lang === "undefined") {
        throw new ErrorHandler(400, 'Bad Request : lang not defined');
      }

      const languages = await Language.getAll();

      const selectedLanguage = languages.find(item => { return item.lang === String(req.body.lang) });

      if (selectedLanguage) {

        await Setting.set(selectedLanguage.setting);
        await Configuration.set(selectedLanguage.configuration);
        await Template.set(selectedLanguage.template);
        await Conversation.deleteAll();

        res.status(200).json({
          selectedSetting: selectedLanguage.setting,
          settings: languages.map(item => item.setting)
        });

      } else {
        throw new ErrorHandler(400, 'Bad Request : lang unknown');
      }

    } catch (error) {
      next(error)
    }

  };

}
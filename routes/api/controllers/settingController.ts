import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../helpers.js";
import Claim from "../models/claim.js";
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

        const data = await Promise.all([Claim.get(), Configuration.get(), Template.getWithContent()]);

        const claim = data[0];
        const configuration = data[1];
        const template = data[2];

        const setting = {
          selectedSetting: selectedLanguage.setting,
          settings: languages.map(item => item.setting)
        };

        res.status(200).json({
          claim: claim,
          configuration: configuration,
          setting: setting,
          template: template,
          conversationList: []
        });

      } else {
        throw new ErrorHandler(400, 'Bad Request : lang unknown');
      }

    } catch (error) {
      next(error)
    }

  };

}
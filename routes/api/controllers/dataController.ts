import { NextFunction, Request, Response } from "express";
import Claim from "../models/claim.js";
import Configuration from "../models/configuration.js";
import Conversation from "../models/conversation.js";
import Language from "../models/language.js";
import Setting from "../models/setting.js";
import Template from "../models/template.js";

export default class DataController {

  static get = async (_: Request, res: Response, next: NextFunction) => {

    try {

      const data = await Promise.all([Claim.get(), Configuration.get(), Setting.get(), Template.get(), Conversation.getAll(), Language.getAll()]);

      const claim = data[0];
      const configuration = data[1];
      let selectedSetting = data[2];
      const template = data[3];
      const conversationList = data[4];
      const languages = data[5];

      if (selectedSetting === null) {
        selectedSetting = languages[0].setting;
        await Setting.set(languages[0].setting);
        await Configuration.set(languages[0].configuration);
        await Template.set(languages[0].template);
      }

      const setting = {
        selectedSetting: selectedSetting,
        settings: languages.map(item => item.setting)
      };

      res.status(200).json({
        claim: claim,
        configuration: configuration,
        setting: setting,
        template: template,
        conversationList: conversationList
      });

    } catch (error) {
      next(error)
    }

  };

}
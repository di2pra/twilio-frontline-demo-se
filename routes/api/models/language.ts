import { ErrorHandler } from "../../../helpers.js";
import Postgres from "../../providers/postgres.js";
import { IConfiguration } from "./configuration.js";
import { ITemplate } from "./template.js";

export interface ISetting {
  lang: string;
  friendly_name: string;
  pollyVoice: string[];
  phoneNumberSMS: string;
  phoneNumberWA: string;
  phoneNumberVoice: string;
}

export interface ILanguage {
  id: number;
  lang: string;
  friendly_name: string;
  setting: ISetting;
  configuration: IConfiguration;
  template: ITemplate[];
  updated_on: Date;
  updated_by: string;
}

export default class Language {

  static getAll = async () => {
    try {
      const request = await Postgres.getClient().query('SELECT * FROM language');

      const values = request.rows.map(item => {
        return {
          ...item,
          ...{
            setting: {
              ...item.setting,
              ...{
                lang: item.lang,
                friendly_name: item.friendly_name
              }
            }
          }
        }
      });

      return values as ILanguage[];

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal DB Error : ${error.message}`)
    }
  };

}
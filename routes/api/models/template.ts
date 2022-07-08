import { ErrorHandler } from "../../../helpers.js";
import Redis from "../../providers/redis.js";
import Content from "./content.js";


export interface ITemplate {
  display_name: string;
  templates: string[]
}

export interface ITemplateWithContent {
  display_name: string;
  templates: {
    contentApiSid: string;
    language: string;
    friendly_name: string;
    body: string;
    variables: {
      [key: string]: string
    };
    whatsappStatus: string | null
  }[]
}

export default class Template {

  static set: (template: ITemplate[]) => Promise<void> = async (template: ITemplate[]) => {
    try {

      const redisClient = await Redis.getClient();

      await redisClient.set('template', JSON.stringify(template));

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  };

  static get: () => Promise<ITemplate[]> = async () => {
    try {

      const redisClient = await Redis.getClient();

      const templateRaw = await redisClient.get('template');

      if (templateRaw) {
        return JSON.parse(templateRaw);
      } else {
        return null;
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  }

  static getWithContent: () => Promise<ITemplateWithContent[]> = async () => {
    try {

      const redisClient = await Redis.getClient();
      const templateRaw = await redisClient.get('template');

      if (templateRaw) {
        const templateCat = JSON.parse(templateRaw) as ITemplate[];

        const data = await Promise.all(templateCat.map(async templateCatItem => {

          const templatesWithContent = await Promise.all(templateCatItem.templates.map(async item => {

            const contentData = await Content.getById(item);
            const contentWAStatus = await Content.getWAApprovalStatus(item);

            return {
              contentApiSid: item,
              language: contentData.language,
              friendly_name: contentData.friendly_name,
              body: contentData.types["twilio/text"].body,
              variables: contentData.variables,
              whatsappStatus: contentWAStatus ? contentWAStatus.whatsapp.status : null
            }
          }));

          return { ...templateCatItem, templates: templatesWithContent }

        }));

        return data as ITemplateWithContent[];

      }

      throw new ErrorHandler(500, `Internal Error`)

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  }

}
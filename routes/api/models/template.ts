import { ErrorHandler } from "../../../helpers.js";
import Redis from "../../providers/redis.js";


export interface ITemplate {
  display_name: string;
  templates: {
    content: string;
    whatsappApproved: boolean;
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

      if(templateRaw) {
        return JSON.parse(templateRaw); 
      } else {
        return null;
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  }

}
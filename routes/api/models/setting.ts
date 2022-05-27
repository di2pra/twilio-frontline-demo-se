import { ErrorHandler } from "../../../helpers.js";
import Redis from "../../providers/redis.js";
import { ISetting } from "./language.js";

export default class Setting {

  static set: (setting: ISetting) => Promise<void> = async (setting: ISetting) => {
    try {

      const redisClient = await Redis.getClient();

      await redisClient.set('setting', JSON.stringify(setting));

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  };

  static get: () => Promise<ISetting | null> = async () => {
    try {
      
      const redisClient = await Redis.getClient();

      const settingRaw = await redisClient.get('setting');

      if(settingRaw) {
        return JSON.parse(settingRaw); 
      } else {
        return null;
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  }

}
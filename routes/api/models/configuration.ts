import { ErrorHandler } from "../../../helpers.js";
import Redis from "../../providers/redis.js";

export interface IConfiguration {
  selectedPollyVoice: string;
  companyNameShort: string;
  companyNameLong: string;
  companyUrl: string;
  welcomeKnownContact: string;
  welcomeUnknownContact: string;
  agentBusyAnswer: string;
  agentNotFoundAnswer: string
}

export default class Configuration {

  static set: (configuration: IConfiguration) => Promise<void> = async (configuration: IConfiguration) => {
    try {

      const redisClient = await Redis.getClient();

      await redisClient.set('configuration', JSON.stringify(configuration));

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  };

  static get: () => Promise<IConfiguration> = async () => {
    try {

      const redisClient = await Redis.getClient();

      const configurationRaw = await redisClient.get('configuration');

      if (configurationRaw) {
        return JSON.parse(configurationRaw);
      } else {
        return null;
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Redis Error : ${error.message}`)
    }
  }

}
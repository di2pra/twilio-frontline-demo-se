import fetch from "node-fetch";
import { ErrorHandler } from "../../../helpers.js";
import twilioClient from "../../providers/twilioClient.js";

type ICreateContentResponse = {
  sid: string;
  friendly_name: string;
  account_sid: string;
}

export default class Content {

  static add : (body: object) => Promise<ICreateContentResponse> = async (body: object) => {
    try {

      const result = await fetch('https://content.twilio.com/v1/Content', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_API_KEY + ":" + process.env.TWILIO_API_SECRET).toString('base64')
        },
        body: JSON.stringify(body)
      });

      const responseBody = await result.json() as ICreateContentResponse;

      if(result.ok) {
        return responseBody;
      } else {
        throw new ErrorHandler(500, `Internal Error : Content API Error`)
      }
      
    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };

  static requestWAApproval : (content_sid: string, body: object) => Promise<object> = async (content_sid: string, body: object) => {
    try {

      const result = await fetch(`https://content.twilio.com/v1/Content/${content_sid}/ApprovalRequests/whatsapp`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_API_KEY + ":" + process.env.TWILIO_API_SECRET).toString('base64')
        },
        body: JSON.stringify(body)
      });

      const responseBody = await result.json();

      if(result.ok) {
        return responseBody as object;
      } else {
        throw new ErrorHandler(500, `Internal Error : Content API Error`)
      }
      
    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };



  static deleteAll = async () => {
    try {

      const conversationService = await twilioClient.conversations.services(process.env.TWILIO_CONVERSATION_SERVICE_SID || '').fetch();

      const conversations = await conversationService.conversations().list();

      for (const conversation of conversations) {
        await conversation.remove();
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };

}
import fetch from "node-fetch";
import { ErrorHandler } from "../../../helpers.js";

type IContentResponse = {
  sid: string;
  friendly_name: string;
  account_sid: string;
  language: string;
  variables: {
    [key: string]: string
  };
  types: {
    [key: string]: {
      body: string
    }
  }
}

type IWAApprovalStatusResponse = {
  sid: string;
  whatsapp: {
    category: string;
    status: string
  }
}

export default class Content {

  static add: (body: object) => Promise<IContentResponse> = async (body: object) => {
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

      const responseBody = await result.json() as IContentResponse;

      if (result.ok) {
        return responseBody;
      } else {
        throw new ErrorHandler(500, `Internal Error : Content API Error`)
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };

  static requestWAApproval: (content_sid: string, body: object) => Promise<object> = async (content_sid: string, body: object) => {
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

      if (result.ok) {
        return responseBody as object;
      } else {
        throw new ErrorHandler(500, `Internal Error : Content API Error`)
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };


  static getById: (sid: string) => Promise<IContentResponse> = async (sid: string) => {
    try {

      const result = await fetch(`https://content.twilio.com/v1/Content/${sid}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_API_KEY + ":" + process.env.TWILIO_API_SECRET).toString('base64')
        }
      });

      const responseBody = await result.json() as IContentResponse;

      if (result.ok) {
        return responseBody;
      } else {
        throw new ErrorHandler(500, `Internal Error : Content API Error`)
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };

  static getList: ({ pageUrl, PageSize }: { pageUrl?: string, PageSize?: number }) => Promise<object> = async ({ pageUrl, PageSize }: { pageUrl?: string, PageSize?: number }) => {
    try {

      let params = new URLSearchParams();

      if (PageSize) {
        params.append('PageSize', PageSize.toString());
      }

      const url = pageUrl ? pageUrl : `https://content.twilio.com/v1/Content?${params.toString()}`;

      const result = await fetch(url, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_API_KEY + ":" + process.env.TWILIO_API_SECRET).toString('base64')
        }
      });

      const responseBody = await result.json();

      if (result.ok) {
        return responseBody as object;
      } else {
        throw new ErrorHandler(500, `Internal Error : Content API Error`)
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };

  static getWAApprovalStatus: (sid: string) => Promise<IWAApprovalStatusResponse | null> = async (sid: string) => {
    try {

      const result = await fetch(`https://content.twilio.com/v1/Content/${sid}/ApprovalRequests`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_API_KEY + ":" + process.env.TWILIO_API_SECRET).toString('base64')
        }
      });

      const responseBody = await result.json() as IWAApprovalStatusResponse;

      if (result.status === 404) {
        return null;
      } else {
        if (result.ok) {
          return responseBody;
        } else {
          throw new ErrorHandler(500, `Internal Error : Content API Error`)
        }
      }



    } catch (error: any) {
      throw new ErrorHandler(500, `Internal Error : ${error.message}`)
    }
  };

}
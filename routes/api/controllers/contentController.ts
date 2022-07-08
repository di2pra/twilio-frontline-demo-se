import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../helpers.js";
import Content from "../models/content.js";
import Setting from "../models/setting.js";

export default class ContentController {

  static get = async (req: Request, res: Response, next: NextFunction) => {

    try {

      let response;

      if (req.params.sid) {

        response = await Content.getById(req.params.sid);

      } else {

        response = await Content.getList({ pageUrl: req.query.pageUrl as string | undefined, PageSize: req.query.pageSize as number | undefined || undefined });

      }

      res.status(200).json(response);

    } catch (error) {
      next(error)
    }



  }

  static add = async (req: Request, res: Response, next: NextFunction) => {

    try {

      if (typeof req.body === "undefined" || typeof req.body.friendly_name === "undefined" || typeof req.body.content === "undefined" || typeof req.body.variables === "undefined" || typeof req.body.requestWAApproval === "undefined") {
        throw new ErrorHandler(400, 'Bad Request');
      }

      if (req.body.requestWAApproval === true && typeof req.body.WACategory === "undefined") {
        throw new ErrorHandler(400, 'Bad Request');
      }

      // initiate the content request body
      const setting = await Setting.get();
      const lang = setting?.lang.slice(0, 2)!;

      const createContentRequestBody = {
        friendly_name: req.body.friendly_name,
        variables: req.body.variables,
        language: lang,
        types: {
          "twilio/text": {
            body: req.body.content
          }
        }
      }

      // create the content
      const createContentResponse = await Content.add(createContentRequestBody);

      // if wa approvel is requested, send the request
      if (req.body.requestWAApproval) {

        const WAApprovalRequestBody = {
          name: req.body.friendly_name,
          content_sid: createContentResponse.sid,
          category: req.body.WACategory,
          types: "whatsapp"
        }

        await Content.requestWAApproval(createContentResponse.sid, WAApprovalRequestBody)

      }

      res.status(200).json({});

    } catch (error) {
      next(error)
    }

  };

}
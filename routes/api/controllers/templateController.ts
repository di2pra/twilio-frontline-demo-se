import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../helpers.js";
import Template from "../models/template.js";

export default class TemplateController {

  static get = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const data = await Template.get();

      res.status(200).json(data);

    } catch (error) {
      next(error)
    }

  };

  static addContentToTemplate = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const contentSid = req.body.contentSid as string | undefined;
      const index = req.body.index as number | undefined;

      if (typeof index === "undefined" || typeof contentSid === "undefined") {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const currentTemplate = await Template.get();
      const newTemplate = [...currentTemplate.slice(0, index), { ...currentTemplate[index], ...{ templates: [...new Set([...currentTemplate[index].templates, contentSid])] } }, ...currentTemplate.slice(index + 1)]

      await Template.set(newTemplate);

      const data = await Template.getWithContent();

      res.status(200).json(data);

    } catch (error) {
      next(error)
    }

  };

  static deleteContentFromTemplate = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const contentSid = req.body.contentSid as string | undefined;
      const index = req.body.index as number | undefined;

      if (typeof index === "undefined" || typeof contentSid === "undefined") {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const currentTemplate = await Template.get();

      const newList = currentTemplate[index].templates.filter(item => item !== contentSid);

      const newTemplate = [...currentTemplate.slice(0, index), { ...currentTemplate[index], ...{ templates: newList } }, ...currentTemplate.slice(index + 1)]

      await Template.set(newTemplate);

      const data = await Template.getWithContent();

      res.status(200).json(data);

    } catch (error) {
      next(error)
    }

  };


}
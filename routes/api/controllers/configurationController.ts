import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../helpers.js";
import Configuration from "../models/configuration.js";

export default class ConfigurationController {

  static add = async (req: Request, res: Response, next: NextFunction) => {

    try {

      if (typeof req.body === "undefined") {
        throw new ErrorHandler(400, 'Bad Request');
      }

      await Configuration.set(req.body);

      const newConfiguration = await Configuration.get();

      res.status(200).json(newConfiguration);

    } catch (error) {
      next(error)
    }

  };

}
import { NextFunction, Request, Response } from "express";
import Conversation from "../models/conversation.js";

export default class ConversationController {

  static get = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const data = await Conversation.getAll();

      res.status(200).json(data);

    } catch (error) {
      next(error)
    }

  };

  static deleteAll = async (req: Request, res: Response, next: NextFunction) => {

    try {

      await Conversation.deleteAll();

      res.status(200).json({});

    } catch (error) {
      next(error)
    }

  };

}
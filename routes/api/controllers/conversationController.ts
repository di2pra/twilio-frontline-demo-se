import { NextFunction, Request, Response } from "express";
import Conversation from "../models/conversation.js";

export default class ConversationController {

  static deleteAll = async (req: Request, res: Response, next: NextFunction) => {

    try {

      await Conversation.deleteAll();

      res.status(200).json({});

    } catch (error) {
      next(error)
    }

  };

}
import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../../helpers.js";
import Claim from "../models/claim.js";
import Conversation from "../models/conversation.js";

export default class ClaimController {

  static add = async (_: Request, res: Response, next: NextFunction) => {

    try {

      if (typeof res.locals.jwt.claims.sub === "undefined") {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const newClaim = await Claim.add(res.locals.jwt.claims.sub);

      res.status(200).json(newClaim);

    } catch (error) {
      next(error)
    }

  };


  static close = async (req: Request, res: Response, next: NextFunction) => {

    try {

      if (!req.params.id) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      await Conversation.deleteAll();

      const claim = Claim.close(Number(req.params.id));

      res.status(200).json(claim);

    } catch (error) {
      next(error)
    }

  };

  static validateClaim = async (req: Request, res: Response, next: NextFunction) => {

    try {

      const claim = await Claim.get();

      if (claim != null && claim.ended_at === null && (claim.user === res.locals.jwt.claims.sub)) {
        next()
      } else {
        throw new ErrorHandler(500, 'Unauthorized');
      }
    } catch (error) {
      next(error)
    }

  }

}
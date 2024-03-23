import { Response } from "express";

import { reasonPhrases, statusCodes } from "./httpStatusCode";
import { ISuccessFunc, ISuccessReponse } from "../interfaces/response.interface";

class SuccessBase {
  constructor(
    public message = reasonPhrases.OK,
    public status = statusCodes.OK,
    public metadata = {},
    public options = {},
    public link = {}
  ) {}

  send(res: Response) {
    res.status(this.status).json({
      status: this.status,
      message: this.message,
      metadata: this.metadata,
      options: this.options,
      _link: this.link,
    } as ISuccessReponse);
  }
}

const OK: ISuccessFunc = ({ res, message, metadata, options, link }) => {
  new SuccessBase(message, statusCodes.OK, metadata, options, link).send(res);
};

const CREATED: ISuccessFunc = ({ res, message, metadata, options, link }) => {
  new SuccessBase(message, statusCodes.CREATED, metadata, options, link).send(res);
};

export { OK, CREATED };

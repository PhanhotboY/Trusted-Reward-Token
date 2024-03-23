import { NextFunction, Request, Response } from "express";

import { ErrorBase, NotFoundError, InternalServerError } from "../core/errors";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Not found:::: ${req.method.toUpperCase()} ${req.url}`);
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorBase) {
    return res.status(err.status).json(err.serializeError());
  }

  const internalServerError = new InternalServerError(err.message);

  return res.status(internalServerError.status).json(internalServerError.serializeError());
};

export { notFoundHandler, errorHandler };

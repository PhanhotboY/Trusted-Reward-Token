import { Response } from "express";

interface ISuccessReponse {
  status?: number;
  message: string;
  metadata: Object | string;
  options?: Object;
  _link: Object;
}

interface ISuccessFunc {
  (args: Omit<ISuccessReponse, "_link"> & { res: Response; link: Object }): void;
}

export { ISuccessReponse, ISuccessFunc };

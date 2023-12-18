import { IResponseError } from "../../interfaces/error.interface";

export abstract class ErrorBase extends Error {
  abstract status: number;
  abstract message: string;
  abstract isOperation: boolean;

  serializeError() {
    return {
      status: this.status,
      message: this.message,
      stack: this.stack,
      isOperation: this.isOperation,
    } as IResponseError;
  }
}

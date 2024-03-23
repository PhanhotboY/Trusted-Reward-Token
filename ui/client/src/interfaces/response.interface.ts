export interface IServerReponse<T> {
  status: number;
  message: string;
  metadata: T;
  options?: Object;
  _link: Object;
}

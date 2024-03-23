import { IRequest } from "../interfaces/request.interface";
import fetcher from "./api";

const getRequests = async () => {
  return fetcher.get<Array<IRequest>>("/requests");
};

const getRequest = async (requestId: string) => {
  return fetcher.get<IRequest>(`/requests/${requestId}`);
};

const createTransferRequest = async (data: any) => {
  return fetcher.post<IRequest>("/requests/transfer", data);
};

const handleRequest = async (requestId: string, data: any) => {
  return fetcher.post<IRequest>(`/requests/${requestId}`, data);
};

const withdrawRequest = async (requestId: string) => {
  return fetcher.delete<boolean>(`/requests/${requestId}`);
};

export { getRequests, getRequest, createTransferRequest, handleRequest, withdrawRequest };

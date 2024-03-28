import { IReason } from "../interfaces/reason.interface";
import fetcher from "./api";

const getReasons = async () => {
  return fetcher.get<Array<IReason>>("/reasons");
};

const getReason = async (reasonId: string) => {
  return fetcher.get<IReason>(`/reasons/${reasonId}`);
};

const submitReason = async (reasonId: string, message?: string) => {
  return fetcher.post<string>(`/reasons/${reasonId}`, { message });
};

const subscribeReason = async (reasonId: string) => {
  return fetcher.post<string>(`/reasons/${reasonId}/subscribe`);
};

const unsubscribeReason = async (reasonId: string) => {
  return fetcher.post<string>(`/reasons/${reasonId}/unsubscribe`);
};

const createReason = async (data: any) => {
  return fetcher.post<IReason>("/reasons", data);
};

const deleteReason = async (reasonId: string) => {
  return fetcher.delete<number>(`/reasons/${reasonId}`);
};

export {
  getReasons,
  getReason,
  submitReason,
  subscribeReason,
  unsubscribeReason,
  createReason,
  deleteReason,
};

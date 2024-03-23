import { ISwag } from "../interfaces/swag.interface";
import fetcher from "./api";

const getSwags = async () => {
  return fetcher.get<Array<ISwag>>("/swags");
};

const getSwag = async (swagId: string) => {
  return fetcher.get<ISwag>(`/swags/${swagId}`);
};

const redeemSwag = async (swagId: string) => {
  return fetcher.post<string>(`/swags/${swagId}`);
};

const createSwag = async (data: any) => {
  return fetcher.post<ISwag>("/swags", data);
};

const deleteSwag = async (swagId: string) => {
  return fetcher.delete<number>(`/swags/${swagId}`);
};

export { getSwags, getSwag, redeemSwag, createSwag, deleteSwag };

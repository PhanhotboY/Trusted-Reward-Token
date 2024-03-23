import { IAuthResponseData, IUserDetails } from "../interfaces/user.interface";
import fetcher from "./api";

const login = async (credentials: Record<string, string>) => {
  return fetcher.post<IAuthResponseData>("/auth/login", credentials);
};

const register = async (credentials: Record<string, string>) => {
  return fetcher.post<IAuthResponseData>("/auth/register", credentials);
};

const logout = async () => {
  return fetcher.post<number>("/auth/logout");
};

const getCurrUser = async () => {
  return fetcher.get<IUserDetails>("/users/me");
};

export { login, register, logout, getCurrUser };

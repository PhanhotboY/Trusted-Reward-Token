import { USER, MEMBER } from "../constant";

declare global {
  type Unionize<T> = T[keyof T];
  type Paths<T> = T extends object
    ? {
        [K in keyof T]: `${Exclude<K, symbol>}${
          | ""
          | `:${string}`
          | `||${string}`
          | `.${Paths<T[K]>}`}`;
      }[keyof T]
    : never;
}

export interface IJWTPayload {
  exp: number;
  iat: number;
  userId: IUserDetails["id"];
  email: IUserDetails["email"];
  role: IUserDetails["role"];
}

export interface IUserDetails {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: Unionize<typeof USER.ROLE>;
  orgId?: string;
  createdAt: string;
  updatedAt: string;
  balance?: {
    rewardToken: number;
    penaltyToken: number;
    reputationToken: number;
  };
}

export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface IRegisterCredentials {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export interface IAuthResponseData {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: IUserDetails;
}

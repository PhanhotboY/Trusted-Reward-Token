"use client";

import { Dispatch, SetStateAction, createContext, use, useEffect, useState } from "react";
import { IUserDetails } from "../interfaces/user.interface";
import { getCurrUser } from "../services/user.service";
import { getLocalItem } from "../utils/";
import { isExpired } from "react-jwt";

export const AuthContext = createContext<{
  refreshToken: string | null;
  accessToken: string | null;
  login: (user: IUserDetails, refreshToken: string, accessToken: string) => void;
  logout: VoidFunction;
}>({
  refreshToken: null,
  accessToken: null,
  login: () => {},
  logout: () => {},
});

export const UserContext = createContext<{
  user: IUserDetails | null;
  setUser: Dispatch<SetStateAction<IUserDetails | null>>;
}>({
  user: null,
  setUser: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUserDetails | null>(getLocalItem("user"));
  const [refreshToken, setRefreshToken] = useState<string | null>(getLocalItem("refreshToken"));
  const [accessToken, setAccessToken] = useState<string | null>(getLocalItem("accessToken"));

  function login(user: IUserDetails, refreshToken: string, accessToken: string) {
    setUser(user);
    setRefreshToken(refreshToken);
    setAccessToken(accessToken);
    localStorage.setItem("refreshToken", refreshToken || "");
    localStorage.setItem("accessToken", accessToken || "");
    localStorage.setItem("user", JSON.stringify(user));
  }

  async function logout() {
    setUser(null);
    setRefreshToken(null);
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  if (accessToken && refreshToken) {
    isExpired(accessToken) && logout();

    if (!user?.role) {
      try {
        const res = use(getCurrUser());
        login(res.metadata, refreshToken, accessToken);
      } catch (error) {
        console.log("logging out with error: ", error);
        logout();
      }
    }
  }

  useEffect(() => {
    isExpired(accessToken || "") && logout();
  });

  return (
    <AuthContext.Provider value={{ refreshToken, accessToken, login, logout }}>
      <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
    </AuthContext.Provider>
  );
}

export function useUser() {
  return use(UserContext);
}

export function useAuth() {
  return use(AuthContext);
}

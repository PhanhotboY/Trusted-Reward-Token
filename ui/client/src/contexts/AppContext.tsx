"use client";

import React, { Dispatch, createContext, use, useEffect, useState } from "react";

import { ISwag } from "../interfaces/swag.interface";
import { IReason } from "../interfaces/reason.interface";
import { IRequest } from "../interfaces/request.interface";
import { IUserDetails } from "../interfaces/user.interface";
import { IMemberDetails } from "../interfaces/member.interface";
import { getRequests } from "../services/request.service";
import { getMembers, getMyRequests } from "../services/member.service";
import { getReasons } from "../services/reason.service";
import { getSwags } from "../services/swag.service";
import { useUser } from ".";
import { USER } from "../constant";

const MemberContext = createContext<{
  members: IMemberDetails[];
  setMembers: Dispatch<React.SetStateAction<IMemberDetails[]>>;
}>({
  members: [],
  setMembers: () => {},
});

export const useMember = () => {
  return use(MemberContext);
};

const EmployeeContext = createContext<{
  employees: IUserDetails[];
  setEmployees: Dispatch<React.SetStateAction<IUserDetails[]>>;
}>({
  employees: [],
  setEmployees: () => {},
});

export const useEmployee = () => {
  return use(EmployeeContext);
};

const RequestContext = createContext<{
  requests: IRequest[];
  setRequests: Dispatch<React.SetStateAction<IRequest[]>>;
}>({
  requests: [],
  setRequests: () => {},
});

export const useRequest = () => {
  return use(RequestContext);
};

const ReasonContext = createContext<{
  reasons: IReason[];
  setReasons: Dispatch<React.SetStateAction<IReason[]>>;
}>({
  reasons: [],
  setReasons: () => {},
});

export const useReason = () => {
  return use(ReasonContext);
};

const SwagContext = createContext<{
  swags: ISwag[];
  setSwags: Dispatch<React.SetStateAction<ISwag[]>>;
}>({
  swags: [],
  setSwags: () => {},
});

export const useSwag = () => {
  return use(SwagContext);
};

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Array<IMemberDetails>>([]);
  const [employees, setEmployees] = useState<Array<IUserDetails>>([]);
  const [requests, setRequests] = useState<Array<IRequest>>([]);
  const [reasons, setReasons] = useState<Array<IReason>>([]);
  const [swags, setSwags] = useState<Array<ISwag>>([]);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      try {
        const fetchMembers = async () => {
          const res = await getMembers();
          setMembers(res.metadata);
        };

        const fetchRequests = async () => {
          if (!user?.role || !(user?.role === USER.ROLE.EMPLOYEE)) {
            const res = await (user?.role === USER.ROLE.ADMIN ? getRequests() : getMyRequests());
            setRequests(res.metadata);
          }
        };

        const fetchReasons = async () => {
          const res = await getReasons();
          setReasons(res.metadata);
        };

        const fetchSwags = async () => {
          const res = await getSwags();
          setSwags(res.metadata);
        };

        fetchMembers();
        fetchRequests();
        fetchReasons();
        fetchSwags();
      } catch (e) {
        console.log("Error fetching data: ", e);
      }
    }
  }, [user]);

  return (
    <MemberContext.Provider value={{ members, setMembers }}>
      <EmployeeContext.Provider value={{ employees, setEmployees }}>
        <RequestContext.Provider value={{ requests, setRequests }}>
          <ReasonContext.Provider value={{ reasons, setReasons }}>
            <SwagContext.Provider value={{ swags, setSwags }}>{children}</SwagContext.Provider>
          </ReasonContext.Provider>
        </RequestContext.Provider>
      </EmployeeContext.Provider>
    </MemberContext.Provider>
  );
}

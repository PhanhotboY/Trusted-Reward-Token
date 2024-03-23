import { IMemberDetails } from "../interfaces/member.interface";
import { IReason } from "../interfaces/reason.interface";
import { IRequest } from "../interfaces/request.interface";
import { IUserDetails } from "../interfaces/user.interface";
import fetcher from "./api";

const getMembers = () => {
  return fetcher.get<Array<IMemberDetails>>("/members");
};

const getMember = (id: string) => {
  return fetcher.get<IMemberDetails>(`/members/${id}`);
};

const getMyEmployees = () => {
  return fetcher.get<Array<IUserDetails>>("/members/me/employees");
};

const getMemberEmployees = (memberId: string) => {
  return fetcher.get<Array<IUserDetails>>(`/members/${memberId}/employees`);
};

const getMyRequests = () => {
  return fetcher.get<Array<IRequest>>("/members/me/requests");
};

const getMySubscribedReasons = (isCommitted = false) => {
  return fetcher.get<Array<IReason>>(`/members/me/subscriptions?isCommitted=${isCommitted}`);
};

const registerMember = (data: any) => {
  return fetcher.post<IMemberDetails>("/members", data);
};

const deleteMember = (memberId: string) => {
  return fetcher.delete<IMemberDetails>(`/members/${memberId}`);
};

const registerEmployee = (data: any) => {
  return fetcher.post<IUserDetails>("/members/me/employees", data);
};

const fireEmployee = (employeeId: string) => {
  return fetcher.delete<IUserDetails>(`/members/me/employees/${employeeId}`);
};

export {
  getMembers,
  getMember,
  registerMember,
  deleteMember,
  registerEmployee,
  fireEmployee,
  getMyEmployees,
  getMemberEmployees,
  getMyRequests,
  getMySubscribedReasons,
};

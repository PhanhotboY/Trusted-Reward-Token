import { REQUEST } from "../constant";
import { IMemberDetails } from "./member.interface";
import { IReason } from "./reason.interface";
import { ISwag } from "./swag.interface";
import { IUserDetails } from "./user.interface";

export interface IRequest {
  id: string;
  amount: number;
  type: Unionize<typeof REQUEST.TYPE>;
  requesterId: string;
  receiverId: string;
  swagId: string;
  reasonId: string;
  status: Unionize<typeof REQUEST.STATUS>;
  message: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  requester: IMemberDetails;
  receiver?: IUserDetails;
  swag?: ISwag;
  reason?: IReason;
}

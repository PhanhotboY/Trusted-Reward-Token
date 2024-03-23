import { IReason } from "./reason.interface";
import { IUserDetails } from "./user.interface";

export interface ISubscription {
  subscriber: IUserDetails;
  reason: IReason;
  isCommitted: boolean;
  description: string;
  reasonId: string;
  userId: string;
  deadline: Date;
  committedAt: Date;
  createdAt: Date;
}

import { IReason } from "./reason.interface";
import { IMemberDetails } from "./member.interface";

export interface ISubscription {
  subscriber: IMemberDetails;
  reason: IReason;
  isCommitted: boolean;
  description: string;
  reasonId: string;
  userId: string;
  deadline: Date;
  committedAt: Date;
  createdAt: Date;
}

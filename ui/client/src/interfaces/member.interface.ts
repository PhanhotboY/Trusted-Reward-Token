import { MEMBER } from "../constant";
import { IUserDetails } from "./user.interface";

export interface IMemberDetails extends IUserDetails {
  organization: {
    id: string;
    name: string;
    size: Unionize<typeof MEMBER.SIZE>;
    location: string;
    createdAt: Date;
    updatedAt: Date;
  };
  balance: {
    rewardToken: number;
    penaltyToken: number;
    reputationToken: number;
  };
}

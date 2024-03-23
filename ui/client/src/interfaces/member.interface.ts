import { MEMBER } from "../constant";
import { IUserDetails } from "./user.interface";

export interface IMemberDetails extends IUserDetails {
  name: string;
  size: Unionize<typeof MEMBER.SIZE>;
  location: string;
  balance: {
    rewardToken: number;
    penaltyToken: number;
    reputationToken: number;
  };
}

import { USER } from "../constants";
import { Unionize } from "../utils";

export interface IQueryOptions {
  page?: string | number;
  limit?: string | number;
  orderBy?: string;
  order?: string;
  exclude?: string[];
  /**
   * @description
   * Only for retrieve organizations
   * If true, join the organization table to the user query
   */
  includeOrganization?: boolean;
  /**
   * @description
   * Only for find user
   * If true, return only verified users
   */
  isVerified?: boolean;
  /**
   * @description
   * Only for find user when login
   * If true, return user password
   */
  password?: boolean;
  /**
   * @description
   * Only for find user (not organization)
   * If specified, return user with the specified role
   */
  role?: Unionize<typeof USER.ROLE>;
}

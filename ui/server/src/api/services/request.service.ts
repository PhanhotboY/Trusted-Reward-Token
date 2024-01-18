import { getRequestList } from "../models/repositories";
import { IQueryOptions } from "../interfaces/query.interface";

export async function getRequestListOfOrganization(
  filter: {
    orgId: string;
    status?: string;
    type?: string;
  },
  options?: IQueryOptions
) {
  return await getRequestList(filter, options);
}

export const RequestService = {
  getRequestListOfOrganization,
};

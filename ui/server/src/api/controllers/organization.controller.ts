import { Request, Response } from "express";

import { OK } from "../core/success.response";
import { OrgService } from "../services";

const API_PATH = process.env.API_PATH || "/api/v1";

// organizationRouter.get("organizations", organizationController.getOrganizationList);
async function getOrganizationList(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization list successfully!",
    metadata: await OrgService.getOrgList(
      {},
      {
        page: <string>req.query.page,
        limit: <string>req.query.limit,
        orderBy: <string>req.query.orderBy,
        order: <string>req.query.order,
      }
    ),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      me: {
        href: `${API_PATH}/organizations/me`,
        method: "GET",
      },
      details: {
        href: `${API_PATH}/organizations/:orgId`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/organizations/:orgId/employees`,
        method: "GET",
      },
    },
  });
}

// organizationRouter.get("organizations/me", organizationController.getOrganizationDetail);
async function getOrganizationDetail(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization detail successfully!",
    metadata: await OrgService.getOrgDetails(req.user.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      requests: {
        href: `${API_PATH}/organizations/me/requests`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/organizations/me/employees`,
        method: "GET",
      },
    },
  });
}

// organizationRouter.get("organizations/me/requests", organizationController.getRequestList);
async function getRequestList(req: Request, res: Response) {
  const filter = {
    orgId: <string>req.user.userId,
    type: <string>req.query.type,
    status: <string>req.query.status,
  };
  return OK({
    res,
    message: "Get organization request list successfully!",
    metadata: await OrgService.getOrgRequestList(filter, req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      me: {
        href: `${API_PATH}/organizations/me`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/organizations/me/employees`,
        method: "GET",
      },
    },
  });
}

// organizationRouter.get("organizations/me/employees", organizationController.getEmployeeList);
async function getEmployeeList(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization employee list successfully!",
    metadata: await OrgService.getOrgEmployeeList(req.user.userId, req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      me: {
        href: `${API_PATH}/organizations/me`,
        method: "GET",
      },
      requests: {
        href: `${API_PATH}/organizations/me/requests`,
        method: "GET",
      },
    },
  });
}

// organizationRouter.get("organizations/unverified", organizationController.getUnverifedOrganizationList);
async function getUnverifedOrganizationList(req: Request, res: Response) {
  return OK({
    res,
    message: "Get unverified organization list successfully!",
    metadata: await OrgService.getOrgList({ isVerified: false }, req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      verify: {
        href: `${API_PATH}/organizations/verify`,
        method: "POST",
      },
    },
  });
}

// organizationRouter.get("organizations/:orgId", organizationController.getOrganization);
async function getOrganization(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization successfully!",
    metadata: await OrgService.getOrganization(req.params.orgId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/organizations`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/organizations/:orgId/employees`,
        method: "GET",
      },
    },
  });
}
// organizationRouter.get("organizations/:orgId/employees", organizationController.getEmployeeListOfOrganization);
async function getEmployeeListOfOrganization(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization employee list successfully!",
    metadata: await OrgService.getOrgEmployeeList(req.params.orgId, req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/organizations`,
        method: "GET",
      },
      details: {
        href: `${API_PATH}/organizations/:orgId`,
        method: "GET",
      },
    },
  });
}
// organizationRouter.get("organizations/:orgId/requests", organizationController.getRequestListOfOrganization);
async function getRequestListOfOrganization(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization request list successfully!",
    metadata: await OrgService.getOrgRequestList(
      { orgId: req.params.orgId, type: <string>req.query.type, status: <string>req.query.status },
      req.query
    ),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/organizations`,
        method: "GET",
      },
      details: {
        href: `${API_PATH}/organizations/:orgId`,
        method: "GET",
      },
    },
  });
}

// organizationRouter.post("organizations", organizationController.registerOrganization);
async function registerOrganization(req: Request, res: Response) {
  return OK({
    res,
    message: "Register organization successfully!",
    metadata: await OrgService.registerOrganization(req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      login: {
        href: `${API_PATH}/auth/login`,
        method: "POST",
      },
      register_employee: {
        href: `${API_PATH}/organizations/employees`,
        method: "POST",
      },
    },
  });
}
// organizationRouter.post("organizations/employees", organizationController.registerEmployee);
async function registerEmployee(req: Request, res: Response) {
  return OK({
    res,
    message: "Register employee successfully!",
    metadata: await OrgService.registerEmployee(req.user.userId, req.body.employeeId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      delete_employee: {
        href: `${API_PATH}/organizations/me/employees/:empId`,
        method: "POST",
      },
      employees: {
        href: `${API_PATH}/organizations/me/employees`,
        method: "GET",
      },
    },
  });
}
// organizationRouter.post("organizations/vesting", organizationController.requestVesting);
async function requestVesting(req: Request, res: Response) {
  res.send("requestVesting");
}
// organizationRouter.post("organizations/granting", organizationController.requestGranting);
async function requestGranting(req: Request, res: Response) {
  res.send("requestGranting");
}
// organizationRouter.post("organizations/transfer", organizationController.requestTransfer);
async function requestTransfer(req: Request, res: Response) {
  res.send("requestTransfer");
}
// organizationRouter.post("organizations/redeem", organizationController.requestRedeem);
async function requestRedeem(req: Request, res: Response) {
  res.send("requestRedeem");
}

// organizationRouter.post("organizations/verify", organizationController.verifyOrganization);
async function verifyOrganization(req: Request, res: Response) {
  return OK({
    res,
    message: "Verify organization successfully!",
    metadata: await OrgService.verifyOrg(req.params.orgId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/organizations`,
        method: "GET",
      },
      details: {
        href: `${API_PATH}/organizations/:orgId`,
        method: "GET",
      },
    },
  });
}

// organizationRouter.put("organizations/me", organizationController.updateOrganization);
async function updateOrganization(req: Request, res: Response) {
  res.send("updateOrganization");
}

// organizationRouter.delete("organizations/me", organizationController.deleteOrganization);
async function deleteOrganization(req: Request, res: Response) {
  res.send("deleteOrganization");
}
// organizationRouter.delete("organizations/me/employees/:orgId", organizationController.deleteEmployee);
async function removeEmployee(req: Request, res: Response) {
  return OK({
    res,
    message: "Delete employee successfully!",
    metadata: await OrgService.removeEmployee(req.user.userId, req.params.empId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      employees: {
        href: `${API_PATH}/organizations/me/employees`,
        method: "GET",
      },
      register_employee: {
        href: `${API_PATH}/organizations/employees`,
        method: "POST",
      },
    },
  });
}

export const organizationController = {
  getOrganizationList,
  getUnverifedOrganizationList,
  getOrganizationDetail,
  getRequestList,
  getEmployeeList,
  getOrganization,
  getEmployeeListOfOrganization,
  getRequestListOfOrganization,
  registerOrganization,
  registerEmployee,
  requestVesting,
  requestGranting,
  requestTransfer,
  requestRedeem,
  verifyOrganization,
  updateOrganization,
  deleteOrganization,
  removeEmployee,
};

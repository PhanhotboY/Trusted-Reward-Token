import { Request, Response } from "express";

import { CREATED, OK } from "../core/success.response";
import { MemberService, getMemberSubscriptionList } from "../services";

const API_PATH = process.env.API_PATH || "/api/v1";

// memberRouter.get("members", memberController.getMemberList);
async function getMemberList(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization list successfully!",
    metadata: await MemberService.getMemberList(
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
        href: `${API_PATH}/members/me`,
        method: "GET",
      },
      details: {
        href: `${API_PATH}/members/:memberId`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/members/:memberId/employees`,
        method: "GET",
      },
    },
  });
}

// memberRouter.get("members/me", memberController.getMemberDetail);
async function getMemberDetail(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization detail successfully!",
    metadata: await MemberService.getMemberDetails(req.user.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      requests: {
        href: `${API_PATH}/members/me/requests`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/members/me/employees`,
        method: "GET",
      },
    },
  });
}

// memberRouter.get("members/me/requests", memberController.getRequestList);
async function getRequestList(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization request list successfully!",
    metadata: await MemberService.getMemberRequestList({
      requesterId: req.user.userId,
      ...req.query,
    }),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      me: {
        href: `${API_PATH}/members/me`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/members/me/employees`,
        method: "GET",
      },
    },
  });
}

// memberRouter.get("members/me/employees", memberController.getEmployeeList);
async function getEmployeeList(req: Request, res: Response) {
  const member = await MemberService.getMemberDetails(req.user.userId);

  return OK({
    res,
    message: "Get organization employee list successfully!",
    metadata: await MemberService.getMemberEmployeeList(member.orgId || "", req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      me: {
        href: `${API_PATH}/members/me`,
        method: "GET",
      },
      requests: {
        href: `${API_PATH}/members/me/requests`,
        method: "GET",
      },
    },
  });
}

// memberRouter.get("members/:memberId", memberController.getMember);
async function getMember(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization successfully!",
    metadata: await MemberService.getMember(req.params.memberId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/members`,
        method: "GET",
      },
      employees: {
        href: `${API_PATH}/members/:memberId/employees`,
        method: "GET",
      },
    },
  });
}
// memberRouter.get("members/:memberId/employees", memberController.getEmployeeListOfMember);
async function getEmployeeListOfMember(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization employee list successfully!",
    metadata: await MemberService.getMemberEmployeeList(req.params.memberId, req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/members`,
        method: "GET",
      },
      details: {
        href: `${API_PATH}/members/:memberId`,
        method: "GET",
      },
    },
  });
}
// memberRouter.get("members/:memberId/requests", memberController.getRequestListOfMember);
async function getRequestListOfMember(req: Request, res: Response) {
  return OK({
    res,
    message: "Get organization request list successfully!",
    metadata: await MemberService.getMemberRequestList({
      requesterId: req.params.memberId,
      ...req.query,
    }),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/members`,
        method: "GET",
      },
      details: {
        href: `${API_PATH}/members/:memberId`,
        method: "GET",
      },
    },
  });
}

// memberRouter.get("/me/subscriptions", onlyMember, memberController.getSubsribedReasonList);
async function getSubsribedReasonList(req: Request, res: Response) {
  return OK({
    res,
    message: "Get subscribed reasons successfully!",
    metadata: await getMemberSubscriptionList(req.user.userId, req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      reasons: {
        href: "/reasons",
        method: "GET",
      },
    },
  });
}

// memberRouter.post("members", memberController.registerMember);
async function registerMember(req: Request, res: Response) {
  console.log("request body: ", req.body);
  return CREATED({
    res,
    message: "Register member successfully!",
    metadata: await MemberService.registerMember(req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      login: {
        href: `${API_PATH}/auth/login`,
        method: "POST",
      },
      verify: {
        href: `${API_PATH}/requests/member`,
        method: "POST",
      },
    },
  });
}
// memberRouter.post("members/employees", memberController.registerEmployee);
async function registerEmployee(req: Request, res: Response) {
  return OK({
    res,
    message: "Register employee successfully!",
    metadata: await MemberService.registerEmployee(req.user.userId, req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      delete_employee: {
        href: `${API_PATH}/members/me/employees/:empId`,
        method: "POST",
      },
      employees: {
        href: `${API_PATH}/members/me/employees`,
        method: "GET",
      },
    },
  });
}
// memberRouter.put("members/me", memberController.updateMember);
async function updateMember(req: Request, res: Response) {
  res.send("updateMember");
}

// memberRouter.delete("members/me", memberController.deleteMember);
async function deleteMember(req: Request, res: Response) {
  return OK({
    res,
    message: "Delete member successfully!",
    metadata: await MemberService.removeMember(req.params.memberId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/members`,
        method: "GET",
      },
      register: {
        href: `${API_PATH}/members`,
        method: "POST",
      },
    },
  });
}
// memberRouter.delete("members/me/employees/:memberId", memberController.deleteEmployee);
async function removeEmployee(req: Request, res: Response) {
  return OK({
    res,
    message: "Delete employee successfully!",
    metadata: await MemberService.removeEmployee(req.user.userId, req.params.empId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      employees: {
        href: `${API_PATH}/members/me/employees`,
        method: "GET",
      },
      register_employee: {
        href: `${API_PATH}/members/employees`,
        method: "POST",
      },
    },
  });
}

export const memberController = {
  getRequestList,
  getRequestListOfMember,
  getSubsribedReasonList,

  getMemberList,
  getMemberDetail,
  registerMember,
  updateMember,
  deleteMember,
  getMember,

  removeEmployee,
  getEmployeeList,
  registerEmployee,
  getEmployeeListOfMember,
};

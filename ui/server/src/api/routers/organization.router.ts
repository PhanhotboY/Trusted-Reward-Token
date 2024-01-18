import { Router } from "express";

import { organizationController } from "../controllers";
import {
  authentication,
  onlyAdmin,
  onlyAuthUser,
  onlyOrganization,
  onlySecretary,
} from "../middlewares/auth.middleware";

const organizationRouter = Router();

organizationRouter.post("/", organizationController.registerOrganization);

organizationRouter.use(authentication);

organizationRouter.get("/me", onlyOrganization, organizationController.getOrganizationDetail);
organizationRouter.get("/me/requests", onlyOrganization, organizationController.getRequestList);
organizationRouter.get("/me/employees", onlyOrganization, organizationController.getEmployeeList);
organizationRouter.get(
  "/unverified",
  onlySecretary,
  organizationController.getUnverifedOrganizationList
);

organizationRouter.get(
  "/:orgId/requests",
  onlySecretary,
  organizationController.getRequestListOfOrganization
);

organizationRouter.get(
  "/:orgId/employees",
  onlyAuthUser,
  organizationController.getEmployeeListOfOrganization
);
organizationRouter.get("/:orgId", onlyAuthUser, organizationController.getOrganization);
organizationRouter.get("/", onlyAuthUser, organizationController.getOrganizationList);

organizationRouter.post("/employees", onlyOrganization, organizationController.registerEmployee);
organizationRouter.post("/vesting", organizationController.requestVesting);
organizationRouter.post("/granting", organizationController.requestGranting);
organizationRouter.post("/transfer", organizationController.requestTransfer);
organizationRouter.post("/redeem", organizationController.requestRedeem);

organizationRouter.patch(
  "/verify/:orgId",
  onlySecretary,
  organizationController.verifyOrganization
);
organizationRouter.put("/me", onlyOrganization, organizationController.updateOrganization);

organizationRouter.delete("/me", onlyAdmin, organizationController.deleteOrganization);
organizationRouter.delete(
  "/me/employees/:empId",
  onlyOrganization,
  organizationController.removeEmployee
);

export default organizationRouter;

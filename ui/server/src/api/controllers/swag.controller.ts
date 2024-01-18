import { formatEther, getAddress } from "ethers";
import { NextFunction, Request, Response } from "express";
// import { RewardToken, PenaltyToken, ReputationToken } from "../contracts";s

// import {
//   getSwagList,
//   getEmployeeList,
//   getAchievements,
//   getRequestsListForEmployee,
//   getUserByAddress,
//   getUserById,
//   getSwagById,
//   addRedeemRequest,
//   updateTokenBalance,
// } from '../utils/database';

const apiUrl = process.env.API_URL || "http://localhost:3000";

async function getBalance(req: Request, res: Response) {
  // const { balance } = req.user;
  // return res.json(balance);
}

async function requestRedeemSwag(req: Request, res: Response) {
  // const { employeeId, swagId } = req.body;

  // // fetch swag from database
  // const swag = await getSwagById(swagId);
  // if (!swag) throw new Error('Swag does not exists');

  // await addRedeemRequest({ employeeId, swagId });

  return res.redirect("/employee");
}

async function getRequestList(req: Request, res: Response) {
  // const requestList = await getRequestsListForEmployee(req.params.employeeId);

  // res.render('employee/list', {
  //   data: requestList,
  //   type: 'requests',
  //   balance: req.user.balance,
  // });
  res.send("getRequestList");
}

async function getRequest(req: Request, res: Response) {}

async function getSwagList(req: Request, res: Response) {
  // const swagList = await getSwagList();

  // res.render('employee/list', {
  //   data: swagList,
  //   type: 'swags',
  //   employeeId: req.params.employeeId,
  //   balance: req.user.balance,
  // });
  res.send("getSwagList");
}

async function getSwag(req: Request, res: Response) {}

async function getAchievementList(req: Request, res: Response) {
  // const achievementList = await getAchievements();

  // res.render('employee/list', {
  //   data: achievementList,
  //   type: 'achievements',
  //   balance: req.user.balance,
  // });
  res.send("getAchievementList");
}

async function getAchievement(req: Request, res: Response) {}

async function getEmployeeList(req: Request, res: Response) {
  // const employeeList = await getEmployeeList();

  // res.render('employee/list', {
  //   data: employeeList,
  //   type: 'employees',
  //   balance: req.user.balance,
  // });
  res.send("getEmployeeList");
}

async function refreshBalance(req: Request, res: Response, next: NextFunction) {
  // const { employeeId } = req.params;

  // const employee = await getUserById(employeeId);

  // req.user = {
  //   balance: {
  //     rewardToken: employee.reward_token || 0,
  //     penaltyToken: employee.penalty_token || 0,
  //     reputationToken: employee.reputation_token || 0,
  //   };
  // };
  // console.log(req.user);
  next("route");
}

export const swagController = {
  getBalance,
  requestRedeemSwag,
  getRequestList,
  getRequest,
  getSwagList,
  getSwag,
  getAchievementList,
  getAchievement,
  getEmployeeList,
  refreshBalance,
};

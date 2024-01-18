// const { formatEther, getAddress, parseEther } = require('ethers');

import { Request, Response } from "express";

// const { TokenOperator } = require('../contracts');
// const {
//   getUserByAddress,
//   updateTokenBalance,
//   completeRedeemRequest,
//   getActiveRedeemRequestList,
//   getAchievements,
//   getEmployeeList,
//   getRedeemRequestById,
//   getUserById,
// } = require('../utils/database');

async function getEmployeeList(req: Request, res: Response) {
  // const employeeList = await getEmployeeList();
  // res.render('secretary/list', {
  //   data: employeeList,
  //   type: 'employees',
  //   balance: {};
  // });
}

async function updateTokenBalance(req: Request, res: Response) {
  // const employeeList = await getEmployeeList();
  // const tokenOperator = await TokenOperator(process.env.DEFAULT_DEPLOYER_ADDRESS);

  // const balanceList = await Promise.all(
  //   employeeList.map((emp) => tokenOperator.balance(getAddress(emp.address.toLowerCase())))
  // );
  // console.log(balanceList);

  // await Promise.all(
  //   employeeList.map((emp, index) =>
  //     updateTokenBalance({
  //       userId: emp.id,
  //       balance: {
  //         rewardToken: formatEther(balanceList[index][0] || 0),
  //         penaltyToken: formatEther(balanceList[index][1] || 0),
  //         reputationToken: formatEther(balanceList[index][2] || 0),
  //       };
  //     })
  //   )
  // );

  res.redirect("/secretary/employees");
}

async function processRedeemRequest(req: Request, res: Response) {
  // const { requestId } = req.body;
  // const tokenOperator = await TokenOperator(process.env.DEFAULT_DEPLOYER_ADDRESS);
  // const request = await getRedeemRequestById(requestId);
  // const balance = await tokenOperator.balance(getAddress(request.address.toLowerCase()));
  // const [rewardToken, penaltyToken, reputationToken] = balance.map((token) => formatEther(token));
  // const tokenBalance = rewardToken - penaltyToken;

  // // compare tokenBalance with swag price
  // if (tokenBalance < request.value) {
  //   await completeRedeemRequest(requestId, false);
  // } else {
  //   await tokenOperator.burnRewards(
  //     getAddress(request.address.toLowerCase()),
  //     parseEther(request.value.toString())
  //   );
  //   await updateTokenBalance({
  //     userId: request.employee_id,
  //     balance: { rewardToken: rewardToken - request.value, penaltyToken, reputationToken };
  //   });
  //   await completeRedeemRequest(requestId, true);
  // }

  return res.redirect("/secretary/requests");
}

async function getRequestList(req: Request, res: Response) {
  // const requestList = await getActiveRedeemRequestList();
  // return res.render('secretary/list', { data: requestList, type: 'requests', balance: {} });
}

async function getRequest(req: Request, res: Response) {}

async function renewal(req: Request, res: Response) {
  // const tokenOperator = await TokenOperator(process.env.DEFAULT_DEPLOYER_ADDRESS);
  // const employeeList = await getEmployeeList();
  // const employeeAddressList = employeeList.map((emp) => getAddress(emp.address.toLowerCase()));
  // await tokenOperator.batchBurnAllTokens(employeeAddressList);
  // return res.redirect('/secretary/employees');
}

async function getAchievementList(req: Request, res: Response) {
  // const achievementList = await getAchievements();
  // return res.render('secretary/list', {
  //   data: achievementList,
  //   type: 'achievements',
  //   balance: {};
  // });
}

async function issueTokenForm(req: Request, res: Response) {
  //     const employeeList = await getEmployeeList();
  //     return res.render('secretary/form', {
  //       data: employeeList,
  //       type: 'issue-token',
  //       balance: {};
  //     });
}

async function issueToken(req: Request, res: Response) {
  //     const { employeeId, tokenType, amount } = req.body;
  //     const tokenOperator = await TokenOperator(process.env.DEFAULT_DEPLOYER_ADDRESS);
  //     const employee = await getUserById(employeeId);

  //     const mapTokenMethod = {
  //       rewardToken: 'batchMintReward',
  //       penaltyToken: 'batchMintPenalties',
  //     };

  //     await tokenOperator[mapTokenMethod[tokenType]](
  //       [getAddress(employee.address.toLowerCase())],
  //       [parseEther(amount.toString())]
  // );

  return res.redirect("/secretary/employees");
}

export const requestController = {
  getEmployeeList,
  updateTokenBalance,
  processRedeemRequest,
  getRequestList,
  getRequest,
  renewal,
  getAchievementList,
  issueTokenForm,
  issueToken,
};

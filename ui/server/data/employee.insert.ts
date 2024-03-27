require("dotenv").config({ path: ".env.server" });

import { readFileSync } from "fs-extra";

import { registerMember, registerEmployee, getMemberList } from "../src/api/services";
import path from "path";

export default async function insertMember() {
  const data = readFileSync(path.resolve(__dirname + "/employee.csv"), "utf-8")
    .split("\n")
    .map((line) => line.split(","));
  const header = data.shift();

  const members = await getMemberList();

  let rowIndex = 0;
  for (const member of members) {
    for (let i = 0; i < 3; i++) {
      const employee = header?.reduce((acc, cur, i) => ({ ...acc, [cur]: data[rowIndex][i] }), {});
      rowIndex++;

      console.log("inserting employee: ", employee);
      await registerEmployee(member.id, employee as any);
    }
  }
}

insertMember();

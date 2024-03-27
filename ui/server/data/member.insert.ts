require("dotenv").config({ path: ".env.server" });

import { readFileSync } from "fs-extra";

import { registerMember } from "../src/api/services";
import path from "path";

export default async function insertMember() {
  const data = readFileSync(path.resolve(__dirname + "/member.csv"), "utf-8")
    .split("\n")
    .map((line) => line.split(","));
  const header = data.shift();

  for (const row of data) {
    const member = header?.reduce((acc, cur, i) => ({ ...acc, [cur]: row[i] }), {});

    console.log("inserting member: ", member);
    await registerMember(member as any);
  }
}

insertMember();

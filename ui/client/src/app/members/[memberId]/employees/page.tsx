"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import { ViewPopup } from "@/src/components/popup";
import { IUserDetails } from "@/src/interfaces/user.interface";
import { getMemberEmployees } from "@/src/services/member.service";
import { useEmployee } from "@/src/contexts/AppContext";

export default function EmployeePage() {
  const [employee2Show, setEmployee2Show] = useState<IUserDetails | null>(null);

  const { employees, setEmployees } = useEmployee();

  const params = useParams();

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await getMemberEmployees(params.memberId as string);
      setEmployees(res.metadata);
    };

    fetchEmployees();
  }, []);

  return (
    <div className="px-5 py-3 relative min-h-full">
      <PageTitle>Employees</PageTitle>

      <List<IUserDetails>
        data={employees}
        fields={["fullName:full name", "balance.reputationToken:reputation"]}
        showHandler={setEmployee2Show}
      />

      {employee2Show && (
        <ViewPopup
          title="Employee Detail"
          data={employee2Show}
          fields={["fullName", "id", "email", "createdAt"]}
          closeHandler={() => {
            setEmployee2Show(null);
          }}
        />
      )}
    </div>
  );
}

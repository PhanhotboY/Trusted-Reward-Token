"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import AddButton from "@/src/components/buttons/AddButton";
import { IUserDetails } from "@/src/interfaces/user.interface";
import { ConfirmPopup, ViewPopup, AddPopup } from "@/src/components/popup";
import {
  fireEmployee,
  getMemberEmployees,
  getMyEmployees,
  registerEmployee,
} from "@services/member.service";
import { useEmployee } from "@/src/contexts/AppContext";
import { useUser } from "@/src/contexts";
import { USER } from "@/src/constant";

export default function EmployeePage() {
  const [employee2Show, setEmployee2Show] = useState<IUserDetails | null>(null);
  const [isAddEmployee, setIsAddEmployee] = useState(false);

  const [employee2Delete, setEmployee2Delete] = useState<Array<string>>([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { employees, setEmployees } = useEmployee();
  const { user, setUser } = useUser();

  const data = { username, password, fullName, email };
  const setData = {
    username: setUsername,
    password: setPassword,
    fullName: setFullName,
    email: setEmail,
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await (user?.role === USER.ROLE.MEMBER
          ? getMyEmployees()
          : getMemberEmployees(user?.orgId!));
        setEmployees(res.metadata);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
  }, [user?.role, user?.orgId, setEmployees]);

  return (
    <div className="px-5 py-3 relative min-h-full">
      <PageTitle>Employees</PageTitle>

      <List<IUserDetails>
        data={employees}
        fields={["fullName:full name", "balance.reputationToken:reputation"]}
        showHandler={(item) => {
          setEmployee2Show(item);
        }}
        deletable={user?.role === USER.ROLE.MEMBER}
        selected2Delete={employee2Delete}
        selectHandler={(id) => {
          employee2Delete.includes(id)
            ? setEmployee2Delete(employee2Delete.filter((item) => item !== id))
            : setEmployee2Delete([...employee2Delete, id]);
        }}
        deleteHandler={() => {
          setIsDelete(true);
        }}
      />

      <AddButton clickHandler={() => setIsAddEmployee(true)} />

      {employee2Show && (
        <ViewPopup<IUserDetails>
          title="Request Detail"
          data={employee2Show}
          fields={["id", "fullName", "email", "createdAt"]}
          closeHandler={setEmployee2Show}
        />
      )}
      {isAddEmployee && (
        <AddPopup
          title="Register Employee"
          data={data}
          dataSetter={setData}
          actionText="Register"
          actionHandler={async (data) => {
            setIsAddEmployee(false);
            try {
              const res = await toast.promise(registerEmployee(data), {
                pending: "Registering employee",
                success: "Employee registered successfully",
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              });

              setEmployees([...employees, res.metadata]);
            } catch (error) {
              console.log(error);
            }
          }}
          closeHandler={() => setIsAddEmployee(false)}
        />
      )}

      {isDelete && !!employee2Delete.length && (
        <ConfirmPopup
          title="Confirm Delete"
          alert={`Are you sure to delete ${employee2Delete.length} employee(s)?`}
          closeHandler={() => {
            setIsDelete(false);
          }}
          actionText="Delete:red"
          actionHandler={async () => {
            setIsDelete(false);
            try {
              const toastMessage = {
                pending: "Deleting employee(s)",
                success: "Employee(s) deleted successfully",
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              };

              await Promise.all(
                employee2Delete.map((id) => toast.promise(fireEmployee(id), toastMessage))
              );

              setEmployees(employees.filter((item) => !employee2Delete.includes(item.id)));
              setEmployee2Delete([]);
            } catch (error) {
              console.log(error);
            }
          }}
        />
      )}
    </div>
  );
}

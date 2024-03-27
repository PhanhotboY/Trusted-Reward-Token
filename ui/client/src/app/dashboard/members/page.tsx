"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import AddButton from "@/src/components/buttons/AddButton";
import { RegisterPopup, ConfirmPopup, ViewPopup } from "@/src/components/popup";
import { deleteMember, registerMember } from "@services/member.service";
import { IMemberDetails } from "@/src/interfaces/member.interface";
import { useMember } from "@/src/contexts/AppContext";

export default function MemberAdminPage() {
  const router = useRouter();
  const { members, setMembers } = useMember();

  const [member2Show, setMember2Show] = useState<IMemberDetails | null>(null);
  const [isAddMember, setIsAddMember] = useState(false);

  const [member2Delete, setMember2Delete] = useState<Array<string>>([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const registerMemberHandler = async (data: any) => {
    setIsAddMember(false);
    const res = await toast.promise(registerMember(data), {
      pending: "Registering member...",
      success: "Member registered",
      error: {
        render({ data }: { data: Error }) {
          return data.message;
        },
      },
    });
    console.log("registed member: ", res);
    setMembers([...members, res.metadata]);
  };

  return (
    <div className="px-5 py-3 relative min-h-full">
      <PageTitle>Members</PageTitle>

      <List<IMemberDetails>
        data={members}
        fields={["organization.name", "balance.reputationToken:reputation", "createdAt"]}
        showHandler={(item) => {
          setMember2Show(item);
        }}
        selected2Delete={member2Delete}
        selectHandler={(id) => {
          member2Delete.includes(id)
            ? setMember2Delete(member2Delete.filter((item) => item !== id))
            : setMember2Delete([...member2Delete, id]);
        }}
        deletable={true}
        deleteHandler={() => {
          setIsDelete(true);
        }}
      />

      <AddButton clickHandler={() => setIsAddMember(true)} />

      {isAddMember && (
        <RegisterPopup
          actionText="register"
          actionHandler={registerMemberHandler}
          closeHandler={() => setIsAddMember(false)}
        />
      )}

      {member2Show && (
        <ViewPopup<IMemberDetails>
          title="Member Detail"
          data={member2Show}
          fields={["organization.name", "email", "location", "organization.size", "createdAt"]}
          closeHandler={() => {
            setMember2Show(null);
          }}
          actionText="View Employees"
          actionHandler={async () => {
            router.push(`/dashboard/members/${member2Show.orgId}/employees`);
          }}
        />
      )}

      {isDelete && !!member2Delete.length && (
        <ConfirmPopup
          title="Confirm Delete"
          alert={`Are you sure to delete ${member2Delete.length} member(s)?`}
          closeHandler={() => {
            setIsDelete(false);
          }}
          actionText="Delete:red"
          actionHandler={async () => {
            setIsDelete(false);
            try {
              for (const memberId of member2Delete) {
                await toast.promise(deleteMember(memberId), {
                  pending: "Deleting member...",
                  success: "Member deleted",
                  error: {
                    render({ data }: { data: Error }) {
                      return data.message;
                    },
                  },
                });
              }

              setMembers(members.filter((item) => !member2Delete.includes(item.id)));
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}
    </div>
  );
}

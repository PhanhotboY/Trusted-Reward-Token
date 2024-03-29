"use client";

import { useRouter } from "next/navigation";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import { useMember } from "@/src/contexts/AppContext";
import { IMemberDetails } from "@/src/interfaces/member.interface";
import { useUser } from "@/src/contexts";

export default function MemberPage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const { members, setMembers } = useMember();

  return (
    <div className="page-container">
      <PageTitle>Members</PageTitle>

      <List<IMemberDetails>
        data={members.filter((m) => m.orgId !== user?.orgId)}
        fields={[
          "organization.name:name",
          "organization.location",
          "balance.reputationToken:reputation",
          "createdAt:joined",
        ]}
        showHandler={(item) => {
          router.push(`/members/${item.orgId}/employees`);
        }}
      />
    </div>
  );
}

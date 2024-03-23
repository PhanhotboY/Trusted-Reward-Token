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
    <div className="px-5 py-3 relative min-h-full">
      <PageTitle>Members</PageTitle>

      <List<IMemberDetails>
        data={members.filter((m) => m.orgId !== user?.orgId)}
        fields={[
          "organization.name:organization",
          "balance.rewardToken:reward",
          "balance.penaltyToken:penalty",
          "balance.reputationToken:reputation",
        ]}
        showHandler={(item) => {
          router.push(`/members/${item.orgId}/employees`);
        }}
      />
    </div>
  );
}

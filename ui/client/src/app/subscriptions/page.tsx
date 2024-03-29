"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import { ViewPopup, ConfirmPopup } from "@/src/components/popup";
import { submitReason, unsubscribeReason } from "@/src/services/reason.service";
import { getMySubscribedReasons } from "@/src/services/member.service";
import { ISubscription } from "@/src/interfaces/subscription.interface";

export default function SubscriptionPage() {
  const [subscribedReasons, setSubscribedReasons] = useState<any[]>([]);
  const [reason2Show, setReason2Show] = useState<ISubscription | null>(null);
  const [isConfirm, setIsConfirm] = useState<"unsubscribe" | "submit" | null>(null);

  const actionHandler = async (action: "unsubscribe" | "submit", message?: string) => {
    setIsConfirm(null);
    if (!reason2Show) {
      toast.error("No reason to unsubscribe");
      return;
    }

    try {
      await toast.promise(
        action === "unsubscribe"
          ? unsubscribeReason(reason2Show.reasonId)
          : submitReason(reason2Show.reasonId, message),
        {
          pending: `${isConfirm} Reason...`,
          success: `${isConfirm} reason successfully!`,
          error: {
            render({ data }: { data: Error }) {
              return data.message;
            },
          },
        }
      );

      setReason2Show(null);
      setSubscribedReasons(
        subscribedReasons.filter((subscription) => subscription.reasonId !== reason2Show.reasonId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchSubscribedReasons() {
      const res = await getMySubscribedReasons();

      setSubscribedReasons(res.metadata);
    }

    fetchSubscribedReasons();
  }, []);

  return (
    <div className="page-container">
      <PageTitle>Subscriptions</PageTitle>

      <List<ISubscription>
        data={subscribedReasons}
        fields={["reason.title", "deadline"]}
        showHandler={setReason2Show}
      />

      {reason2Show && (
        <ViewPopup<ISubscription>
          title="Reason Detail"
          data={reason2Show}
          fields={[
            "subscriber.organization.name:organization",
            "reason.title",
            "createdAt:subscribed",
            "deadline",
            "committedAt:committed",
            "reason.description",
          ]}
          closeHandler={() => {
            setReason2Show(null);
          }}
          actionText={["Unsubscribe:red", "Submit"]}
          actionHandler={[
            async () => setIsConfirm("unsubscribe"),
            async () => setIsConfirm("submit"),
          ]}
        />
      )}

      {isConfirm && (
        <ConfirmPopup<ISubscription>
          title={`Confirm ${isConfirm} Reason`}
          alert={`Are you sure you want to ${isConfirm} this reason?`}
          closeHandler={() => setIsConfirm(null)}
          includeMessage={isConfirm === "submit"}
          actionText={isConfirm + (isConfirm === "unsubscribe" ? ":red" : "")}
          actionHandler={async (message?: string) => await actionHandler(isConfirm, message)}
        />
      )}
    </div>
  );
}

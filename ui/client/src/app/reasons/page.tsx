"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import { ViewPopup } from "@/src/components/popup";
import { subscribeReason } from "@/src/services/reason.service";
import { useReason } from "@/src/contexts/AppContext";
import { useUser } from "@/src/contexts";
import { IReason } from "@/src/interfaces/reason.interface";
import { USER } from "@/src/constant";

export default function ReasonPage() {
  const [reason2Show, setReason2Show] = useState<IReason | null>(null);

  const { reasons, setReasons } = useReason();
  const { user, setUser } = useUser();

  return (
    <div className="px-5 py-3 relative min-h-full">
      <PageTitle>Reasons</PageTitle>

      <List<any> data={reasons} fields={["title", "value"]} showHandler={setReason2Show} />

      {reason2Show && (
        <ViewPopup<IReason>
          title="Reason Detail"
          data={reason2Show}
          fields={["id", "value", "title", "description"]}
          closeHandler={() => {
            setReason2Show(null);
          }}
          actionText={user?.role === USER.ROLE.MEMBER ? "Subscribe" : ""}
          actionHandler={async () => {
            setReason2Show(null);
            try {
              await toast.promise(subscribeReason(reason2Show.id), {
                pending: "Subscribing Reason...",
                success: "Reason Subscribed!",
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              });
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}
    </div>
  );
}

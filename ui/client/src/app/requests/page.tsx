"use client";

import { Suspense, useEffect, useState } from "react";

import { ConfirmPopup, ViewPopup } from "@components/popup";
import PageTitle from "@/src/components/PageTitle";
import List from "@components/List";
import { getMyRequests } from "@/src/services/member.service";
import { useRequest } from "@/src/contexts/AppContext";
import { IRequest } from "@/src/interfaces/request.interface";
import { toast } from "react-toastify";
import { withdrawRequest } from "@/src/services/request.service";

export default function RequestPage() {
  const [request2Show, setRequest2Show] = useState<IRequest | null>(null);
  const [isWithdraw, setIsWithdraw] = useState<boolean>(false);
  const { requests, setRequests } = useRequest();

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await getMyRequests();
      setRequests(res.metadata);
    };
    fetchRequests();
  }, [setRequests]);

  return (
    <div className="px-5 py-3 relative min-h-full">
      <PageTitle>Requests</PageTitle>

      <List<IRequest>
        data={requests}
        fields={["swag.name||reason.title", "type", "status"]}
        showHandler={setRequest2Show}
      />

      {request2Show && (
        <ViewPopup<IRequest>
          title="Request Detail"
          data={request2Show}
          fields={["id", "status", "requester.organization.name", "type"]}
          closeHandler={setRequest2Show}
          actionText="Withdraw:red"
          actionHandler={async () => {
            setIsWithdraw(true);
          }}
        />
      )}

      {isWithdraw && (
        <ConfirmPopup<IRequest>
          title="Withdraw Request"
          alert="Are you sure you want to withdraw this request?"
          closeHandler={() => setIsWithdraw(false)}
          actionText="Withdraw:red"
          actionHandler={async () => {
            try {
              const withdrawRes = await toast.promise(withdrawRequest(request2Show!.id), {
                pending: "Withdrawing request...",
                success: "Request withdrawn successfully!",
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              });

              setRequests(requests.filter((req) => req.id !== request2Show!.id));
            } catch (error) {
              console.error(error);
            }
            setIsWithdraw(false);
            setRequest2Show(null);
          }}
        />
      )}
    </div>
  );
}

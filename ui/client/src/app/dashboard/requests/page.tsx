"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { ConfirmPopup, ViewPopup } from "@components/popup";
import PageTitle from "@/src/components/PageTitle";
import List from "@components/List";
import { getRequests, handleRequest } from "@/src/services/request.service";
import { useRequest } from "@/src/contexts/AppContext";
import { IRequest } from "@/src/interfaces/request.interface";

export default function RequestAdminPage() {
  const [request2Show, setRequest2Show] = useState<IRequest | null>(null);
  const [isConfirm, setIsConfirm] = useState("");
  const { requests, setRequests } = useRequest();

  const requestHandler = async (requestId: string, op: string, action: "approve" | "reject") => {
    setIsConfirm("");
    try {
      await toast.promise(handleRequest(requestId, { op, options: { action } }), {
        pending: "Handling request...",
        success: "handle request successfully!",
        error: {
          render({ data }: { data: Error }) {
            return data.message;
          },
        },
      });
      const res = await getRequests();

      setRequests(res.metadata);
      setRequest2Show(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      <PageTitle>Requests</PageTitle>

      <List<IRequest>
        data={requests}
        fields={["requester.organization.name:member", "type", "status", "completedAt:completed"]}
        showHandler={setRequest2Show}
      />

      {request2Show && (
        <ViewPopup<IRequest>
          title="Request Detail"
          data={request2Show}
          fields={[
            "reason.title:name||swag.name",
            "type",
            "requester.organization.name:member",
            "amount:value",
            "status",
            "completedAt:completed",
            "message",
          ]}
          closeHandler={setRequest2Show}
          actionText={["Reject:red", "Approve"]}
          actionHandler={[async () => setIsConfirm("reject"), async () => setIsConfirm("approve")]}
        />
      )}

      {isConfirm && (
        <ConfirmPopup
          title={`Confirm ${isConfirm}`}
          alert={`Are you sure to ${isConfirm} this request?`}
          actionText={isConfirm + (isConfirm === "reject" ? ":red" : "")}
          actionHandler={() =>
            requestHandler(
              request2Show!.id,
              request2Show?.swagId ? "redeem" : "granting",
              isConfirm as "approve" | "reject"
            )
          }
          closeHandler={() => setIsConfirm("")}
        />
      )}
    </div>
  );
}

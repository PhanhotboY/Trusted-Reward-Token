"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import { ConfirmPopup, ViewPopup } from "@/src/components/popup";
import { redeemSwag } from "@/src/services/swag.service";
import { useSwag } from "@/src/contexts/AppContext";
import { useUser } from "@/src/contexts";
import { ISwag } from "@/src/interfaces/swag.interface";
import { USER } from "@/src/constant";

export default function SwagPage() {
  const [swag2Show, setSwag2Show] = useState<ISwag | null>(null);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const { user, setUser } = useUser();
  const { swags, setSwags } = useSwag();

  return (
    <div className="page-container">
      <PageTitle>Swags</PageTitle>

      <List<any> data={swags} fields={["name", "value"]} showHandler={setSwag2Show} />

      {swag2Show && (
        <ViewPopup<ISwag>
          title="Swag Detail"
          data={swag2Show}
          fields={["id", "value", "name", "description"]}
          closeHandler={() => {
            setSwag2Show(null);
          }}
          actionText={user?.role === USER.ROLE.MEMBER ? "Redeem" : ""}
          actionHandler={async () => setIsConfirm(true)}
        />
      )}

      {isConfirm && (
        <ConfirmPopup
          title="Redeem Swag"
          alert="Are you sure you want to redeem this swag?"
          closeHandler={() => {
            setIsConfirm(false);
          }}
          actionText="Redeem"
          actionHandler={async () => {
            setIsConfirm(false);
            setSwag2Show(null);
            try {
              const res = await toast.promise(redeemSwag(swag2Show!.id), {
                pending: "Redeeming Swag...",
                success: "Swag Redeemed!",
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              });
              console.log("member: ", res.metadata);
              setUser(res.metadata);
            } catch (error) {
              console.error(error);
            }
          }}
        />
      )}
    </div>
  );
}

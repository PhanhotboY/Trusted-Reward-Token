"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import { ViewPopup } from "@/src/components/popup";
import { redeemSwag } from "@/src/services/swag.service";
import { useSwag } from "@/src/contexts/AppContext";
import { useUser } from "@/src/contexts";
import { ISwag } from "@/src/interfaces/swag.interface";
import { USER } from "@/src/constant";

export default function SwagPage() {
  const [swag2Show, setSwag2Show] = useState<ISwag | null>(null);

  const { user, setUser } = useUser();
  const { swags, setSwags } = useSwag();

  return (
    <div className="px-5 py-3 relative min-h-full">
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
          actionHandler={async () => {
            setSwag2Show(null);
            try {
              await toast.promise(redeemSwag(swag2Show.id), {
                pending: "Redeeming Swag...",
                success: "Swag Redeemed!",
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

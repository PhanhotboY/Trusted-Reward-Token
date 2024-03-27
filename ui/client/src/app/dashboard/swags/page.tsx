"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import AddButton from "@/src/components/buttons/AddButton";
import { ConfirmPopup, ViewPopup, AddPopup } from "@/src/components/popup";
import { createSwag, deleteSwag, getSwags } from "@/src/services/swag.service";
import { useSwag } from "@/src/contexts/AppContext";
import { ISwag } from "@/src/interfaces/swag.interface";

export default function SwagAdminPage() {
  const [swag2Show, setSwag2Show] = useState<any | null>(null);
  const [isAddSwag, setIsAddSwag] = useState(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [swag2Delete, setSwag2Delete] = useState<Array<string>>([]);

  const [name, setTitle] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  const { swags, setSwags } = useSwag();

  const data = { name, value, description };
  const setData = { name: setTitle, value: setValue, description: setDescription };

  return (
    <div className="px-5 py-3 relative min-h-full">
      <PageTitle>Swags</PageTitle>

      <List<any>
        data={swags}
        fields={["name", "value"]}
        showHandler={setSwag2Show}
        selected2Delete={swag2Delete}
        selectHandler={(id) => {
          swag2Delete.includes(id)
            ? setSwag2Delete(swag2Delete.filter((item) => item !== id))
            : setSwag2Delete([...swag2Delete, id]);
        }}
        deletable={true}
        deleteHandler={() => {
          setIsDelete(true);
        }}
      />

      <AddButton clickHandler={() => setIsAddSwag(true)} />

      {swag2Show && (
        <ViewPopup<ISwag>
          title="Swag Detail"
          data={swag2Show}
          fields={["id", "value", "name", "description"]}
          closeHandler={() => {
            setSwag2Show(null);
          }}
        />
      )}

      {isAddSwag && (
        <AddPopup
          title="Add Swag"
          data={data}
          dataSetter={setData}
          actionText="Add Swag"
          actionHandler={async (data) => {
            setIsAddSwag(false);
            try {
              const { metadata: newSwag } = await toast.promise(createSwag(data), {
                pending: "Adding swag...",
                success: "Swag added!",
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              });

              setSwags([...swags, newSwag]);
              setTitle("");
              setValue(0);
              setDescription("");
            } catch (error) {
              console.log(error);
            }
          }}
          closeHandler={() => setIsAddSwag(false)}
        />
      )}

      {isDelete && !!swag2Delete.length && (
        <ConfirmPopup<ISwag>
          title="Confirm Delete"
          alert={`Are you sure to delete ${swag2Delete.length} swag(s)`}
          closeHandler={() => {
            setIsDelete(false);
          }}
          actionText="Delete:red"
          actionHandler={async () => {
            setIsDelete(false);
            try {
              const toastMessage = {
                pending: "Deleting swag(s)",
                success: "Swag(s) deleted successfully",
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              };

              await Promise.all(
                swag2Delete.map((id) => toast.promise(deleteSwag(id), toastMessage))
              );

              setSwags(swags.filter((swag) => !swag2Delete.includes(swag.id)));
            } catch (error) {
              console.log(error);
            }
          }}
        />
      )}
    </div>
  );
}

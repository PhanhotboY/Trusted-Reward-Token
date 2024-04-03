"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import List from "@/src/components/List";
import PageTitle from "@/src/components/PageTitle";
import AddButton from "@/src/components/buttons/AddButton";
import { ConfirmPopup, ViewPopup, AddPopup } from "@/src/components/popup";
import { createReason, deleteReason, getReasons } from "@/src/services/reason.service";
import { useReason } from "@/src/contexts/AppContext";
import { IReason } from "@/src/interfaces/reason.interface";
import { durationStringToSeconds, secondsToDurationString } from "@/src/utils";

export default function ReasonAdminPage() {
  const [reason2Show, setReason2Show] = useState<any | null>(null);
  const [isAddReason, setIsAddReason] = useState(false);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [reason2Delete, setReason2Delete] = useState<Array<string>>([]);

  const [title, setTitle] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const { reasons, setReasons } = useReason();

  const data = { title, value, description, duration };
  const setData = {
    title: setTitle,
    value: setValue,
    description: setDescription,
    duration: setDuration,
  };

  return (
    <div className="page-container">
      <PageTitle>Reasons</PageTitle>

      <List<IReason>
        data={reasons}
        fields={["title", "value"]}
        showHandler={setReason2Show}
        selected2Delete={reason2Delete}
        selectHandler={(id) => {
          reason2Delete.includes(id)
            ? setReason2Delete(reason2Delete.filter((item) => item !== id))
            : setReason2Delete([...reason2Delete, id]);
        }}
        deletable={true}
        deleteHandler={() => {
          setIsDelete(true);
        }}
      />

      <AddButton clickHandler={() => setIsAddReason(true)} />

      {reason2Show && (
        <ViewPopup
          title="Reason Detail"
          data={{ ...reason2Show, duration: secondsToDurationString(reason2Show.duration) }}
          fields={["title", "value", "duration", "description"]}
          closeHandler={() => {
            setReason2Show(null);
          }}
        />
      )}

      {isAddReason && (
        <AddPopup
          title="Add Reason"
          data={data}
          dataSetter={setData}
          actionText="Add Reason"
          actionHandler={async (data) => {
            setIsAddReason(false);
            try {
              await toast.promise(
                createReason({ ...data, duration: durationStringToSeconds(data.duration) }),
                {
                  pending: "Adding reason...",
                  success: "Reason added",
                  error: {
                    render({ data }: { data: Error }) {
                      return data.message;
                    },
                  },
                }
              );
              const { metadata: reasons } = await getReasons();
              setReasons(reasons);
              setTitle("");
              setValue(0);
              setDescription("");
              setDuration("");
            } catch (e) {
              console.log(e);
            }
          }}
          closeHandler={() => setIsAddReason(false)}
        />
      )}

      {isDelete && !!reason2Delete.length && (
        <ConfirmPopup<IReason>
          title="Confirm Delete"
          alert={`Are you sure to delete ${reason2Delete.length} reason(s)`}
          closeHandler={() => {
            setIsDelete(false);
          }}
          actionText="Delete:red"
          actionHandler={async () => {
            setIsDelete(false);
            try {
              const toastMessage = {
                pending: `Deleting reason...`,
                success: `Reason deleted`,
                error: {
                  render({ data }: { data: Error }) {
                    return data.message;
                  },
                },
              };
              await Promise.all(
                reason2Delete.map((id) => toast.promise(deleteReason(id), toastMessage))
              );

              setReasons(reasons.filter((reason) => !reason2Delete.includes(reason.id)));
            } catch (e) {
              console.log(e);
            }
          }}
        />
      )}
    </div>
  );
}

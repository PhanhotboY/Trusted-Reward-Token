"use client";

import { FormEvent, useState } from "react";

import BasePopup from "./BasePopup";

export default function AddPopup({
  title,
  data,
  dataSetter,
  actionText,
  actionHandler,
  closeHandler,
}: {
  title: string;
  data: any;
  dataSetter: any;
  actionText: string;
  actionHandler: (data: any) => Promise<void>;
  closeHandler: VoidFunction;
}) {
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");

  const error = { username: usernameError, email: emailError, name: nameError };
  const errorSetter = { username: setUsernameError, email: setEmailError, name: setNameError };

  const fields = Object.keys(data) as Array<Extract<keyof typeof data, string>>;
  const formId = `popup-form-${title}`;

  const onChangeHandler = (field: string) => (e: FormEvent<HTMLInputElement>) => {
    errorSetter[field as keyof typeof error]?.("");
    dataSetter[field](e.currentTarget.value);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await actionHandler(data);
    } catch (error: any) {
      const errMessage = error.message;
      errMessage.match(/username/i) && errorSetter.username(errMessage);
      errMessage.match(/email/i) && errorSetter.email(errMessage);
      errMessage.match(/name/i) && errorSetter.name(errMessage);

      console.log("oh no: ", errMessage);
    }
  };

  return (
    <BasePopup
      title={title}
      closeHandler={closeHandler}
      formId={formId}
      actionText={actionText}
      actionHandler={() => {}}
    >
      <form id={formId} className="grid grid-cols-6 gap-4" onSubmit={submitHandler}>
        {fields.map((field, i) => (
          <div className="mb-3 col-span-3" key={i}>
            <label htmlFor={field} className="block text-sm font-semibold capitalize">
              {field}
            </label>

            <input
              id={field}
              className="w-full p-2 border rounded-md"
              value={data[field]}
              type={field === "value" ? "number" : field === "password" ? "password" : "text"}
              onChange={(e) => onChangeHandler(field)(e)}
            />

            <p className="text-red-500 text-sm w-full truncate tracking-wider">
              {error[field as keyof typeof error]}
            </p>
          </div>
        ))}
      </form>
    </BasePopup>
  );
}

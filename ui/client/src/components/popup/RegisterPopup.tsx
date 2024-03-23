"use client";

import { ChangeEventHandler, FormEvent, useState } from "react";

import BasePopup from "./BasePopup";
import { MEMBER } from "@/src/constant";

const memberFields = ["name", "size", "location"];
const userFields = ["username", "password", "email", "fullName"];

export default function RegisterPopup<T>({
  actionText,
  actionHandler,
  closeHandler,
}: {
  actionText: string;
  actionHandler: (data: any) => Promise<void>;
  closeHandler: VoidFunction;
}) {
  const [name, setName] = useState("");
  const [size, setSize] = useState<string>(MEMBER.SIZE.SMALL);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const error = {
    username: usernameError,
    password: passwordError,
    email: emailError,
  };

  const registerHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await actionHandler(data);
      closeHandler();
    } catch (error: any) {
      const resError = error.response?.data;
      if (resError) {
        if (resError.message.match(/password/gi)) setPasswordError(resError.message);
        else if (resError.message.match(/email/gi)) setEmailError(resError.message);
        else if (resError.message.match(/username/gi)) setUsernameError(resError.message);
      }
      console.log(error);
    }
  };

  const data = {
    name,
    size,
    location,
    email,
    password,
    fullName,
    username,
  };
  const setData = {
    name: setName,
    size: setSize,
    location: setLocation,
    email: setEmail,
    password: setPassword,
    fullName: setFullName,
    username: setUsername,
  };

  const SizeSelector = () => (
    <select
      id="size"
      className="w-full p-2 border rounded-md"
      value={size}
      onChange={(e) => setSize(e.target.value)}
    >
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
    </select>
  );
  const formId = `popup-form-${actionText}`;

  return (
    <BasePopup
      title="Register"
      closeHandler={closeHandler}
      formId={formId}
      actionText={actionText}
      actionHandler={() => {}}
    >
      <form id={formId} className="grid grid-cols-6 gap-4" onSubmit={registerHandler}>
        <h4 className="col-span-6 text-lg font-semibold">Organization Details</h4>

        {memberFields.map((field, i) => (
          <InputWrapper key={i}>
            <Label field={field} />

            {field !== "size" ? (
              <InputBlock
                field={field}
                value={data[field as keyof typeof data]}
                onChange={(e) => setData[field as keyof typeof data](e.target.value)}
              />
            ) : (
              <SizeSelector />
            )}

            <ErrorMessage error={error[field as keyof typeof error]} />
          </InputWrapper>
        ))}

        <h4 className="col-span-6 text-lg font-semibold border-t-2 border-indigo-950/50 pt-3">
          Individual Information
        </h4>

        {userFields.map((field, i) => (
          <InputWrapper key={i}>
            <Label field={field} />

            <InputBlock
              field={field}
              value={data[field as keyof typeof data]}
              onChange={(e) => setData[field as keyof typeof data](e.target.value)}
            />

            <ErrorMessage error={error[field as keyof typeof error]} />
          </InputWrapper>
        ))}
      </form>
    </BasePopup>
  );
}

const Label = ({ field }: { field: string }) => (
  <label htmlFor={field} className="block text-sm font-semibold capitalize">
    {field}
  </label>
);

const ErrorMessage = ({ error }: { error: string }) => (
  <p className="text-red-500 text-sm w-full truncate tracking-wider">{error}</p>
);

const InputWrapper = ({ children }: { children: Array<React.ReactNode> }) => (
  <div className="mb-3 col-span-3">{children}</div>
);

const InputBlock = ({
  field,
  value,
  onChange,
}: {
  field: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => (
  <input
    id={field}
    className="w-full p-2 border rounded-md"
    value={value}
    type={field === "password" ? "password" : field === "email" ? "email" : "text"}
    onChange={onChange}
  />
);

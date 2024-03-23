"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { ChangeEventHandler, FormEvent, useState } from "react";

import { useAuth, useUser } from "@/src/contexts";
import { getCurrUser, register } from "@/src/services/user.service";
import PrimaryButton from "../buttons/PrimaryButton";

export default function RegisterForm() {
  const authContext = useAuth();
  const userContext = useUser();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const stateSetter = {
    fullName: setFullName,
    email: setEmail,
    username: setUsername,
    password: setPassword,
  };

  const inputHandler = (e: FormEvent<HTMLInputElement>) => {
    stateSetter[e.currentTarget.name as keyof typeof stateSetter](e.currentTarget.value);
  };

  const registerHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await toast.promise(
        register({
          fullName,
          email,
          username,
          password,
        }),
        {
          pending: "Registering...",
          success: "Registered successfully!",
          error: {
            render({ data }: { data: Error }) {
              return data.message;
            },
          },
        }
      );
      const { tokens, user } = res.metadata;

      authContext.login(user, tokens.refreshToken, tokens.accessToken);
    } catch (error: any) {
      if (error.message.match(/username/i)) {
        setUsernameError(error.message);
      }
      if (error.message.match(/email/i)) {
        setEmailError(error.message);
      }
      console.log(error);
    }
  };

  return (
    <form
      id="register-form"
      className="flex flex-col items-center justify-center gap-4 w-2/3"
      onSubmit={registerHandler}
    >
      <h1 className="text-3xl font-bold text-white">Welcome!</h1>

      <div className="border-b border-gray-900/10 pb-12 w-full">
        <div className="mt-10 grid grid-cols-6 gap-x-6 gap-y-8 sm:grid-cols-6 w-full">
          <CustomInput
            name="username"
            type="text"
            value={username}
            label="Username"
            col={"col-span-3"}
            error={usernameError}
            onChange={inputHandler}
          />

          <CustomInput
            name="password"
            type="password"
            value={password}
            label="Password"
            col={"col-span-3"}
            onChange={inputHandler}
          />
          <CustomInput
            name="fullName"
            type="text"
            value={fullName}
            label="Full name"
            col={"col-span-3"}
            onChange={inputHandler}
          />

          <CustomInput
            name="email"
            type="email"
            value={email}
            label="Email"
            col={"col-span-3"}
            error={emailError}
            onChange={inputHandler}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <PrimaryButton
          className="bg-violet-950 w-full active:bg-violet-900"
          form="register-form"
          type="submit"
        >
          Register
        </PrimaryButton>

        <Link
          href="/login"
          className="no-underline hover:underline text-white text-center active:no-underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
}

const CustomInput = ({
  name,
  type,
  value,
  label,
  col,
  error,
  onChange,
}: {
  name: string;
  type: string;
  value: string;
  label: string;
  col: string;
  error?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className={`relative ${col}`}>
      <label
        htmlFor={`register-${name}`}
        className="block text-sm font-medium leading-6 text-white"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={`register-${name}`}
          type={type}
          name={name}
          value={value}
          autoComplete={name}
          placeholder={name}
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={onChange}
        />

        {error && (
          <p className="absolute inset-x-0 pl-1 bottom-[-1.25rem] text-xs text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};

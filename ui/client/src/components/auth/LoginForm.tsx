"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { ChangeEventHandler, FormEvent, useState } from "react";

import { useAuth } from "@/src/contexts";
import { login } from "@/src/services/user.service";
import PrimaryButton from "../buttons/PrimaryButton";

export default function LoginForm() {
  const authContext = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const stateSetter = {
    username: setUsername,
    password: setPassword,
  };

  const errorSetter = {
    username: setUsernameError,
    password: setPasswordError,
  };

  const inputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    errorSetter[e.target.name as keyof typeof errorSetter]("");

    stateSetter[e.target.name as keyof typeof stateSetter](e.target.value);
  };

  const loginHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return !username
        ? setUsernameError("Please fill in your user name!")
        : setPasswordError("Password cannot be blank!");
    }

    try {
      const res = await toast.promise(login({ username, password }), {
        pending: "Logging in...",
        success: "Logged in successfully!",
        error: {
          render({ data }: { data: Error }) {
            return data.message;
          },
        },
      });

      authContext.login(
        res?.metadata.user,
        res?.metadata.tokens.refreshToken,
        res?.metadata.tokens.accessToken
      );
    } catch (error: any) {
      const errMessage = error.message;

      errMessage.match(/password/gi) ? setPasswordError(errMessage) : setUsernameError(errMessage);

      console.log(error);
    }
  };

  return (
    <form
      id="login-form"
      className="flex flex-col items-center justify-center gap-4 w-80"
      onSubmit={loginHandler}
    >
      <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
      <p className="text-white">Log in with your data that you entered during your registration.</p>

      <div className="flex flex-col w-full">
        <CustomInput
          name="username"
          type="text"
          value={username}
          placeholder="Username"
          error={usernameError}
          onChange={inputHandler}
        />
        <CustomInput
          name="password"
          type="password"
          value={password}
          placeholder="Password"
          error={passwordError}
          onChange={inputHandler}
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        <PrimaryButton
          className="bg-violet-950 w-full active:bg-violet-900"
          form="login-form"
          type="submit"
        >
          Log in
        </PrimaryButton>

        <Link
          href="/register"
          className="no-underline hover:underline text-white text-center active:no-underline"
        >
          Register
        </Link>
      </div>
    </form>
  );
}

const CustomInput = ({
  name,
  type,
  value,
  placeholder,
  error,
  onChange,
}: {
  name: string;
  type: string;
  value: string;
  placeholder: string;
  error: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  const inputClasses =
    "w-full px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-fuchsia-500";

  return (
    <label htmlFor={`login-${name}`} className="flex flex-col">
      <input
        id={`login-${name}`}
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        className={inputClasses}
        onChange={onChange}
      />
      <span className="text-red-400 text-sm mx-3 mt-2 mb-3 tracking-wider">{error}</span>
    </label>
  );
};

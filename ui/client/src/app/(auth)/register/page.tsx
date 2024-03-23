import RegisterForm from "@/src/components/auth/RegisterForm";
import Link from "next/link";

export default function Register() {
  return (
    <main className="h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className="form-container bg-violet-700 h-[150%] aspect-square rounded-full flex items-center justify-center px-28 py-52">
        <RegisterForm />
      </div>
    </main>
  );
}

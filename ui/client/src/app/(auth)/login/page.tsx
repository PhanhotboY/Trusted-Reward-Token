import LoginForm from "@/src/components/auth/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <main className="h-screen w-screen flex items-center relative overflow-hidden">
      <div className="w-1/2 text-center">
        <Link href="/">
          <h1 className="text-5xl font-bold p-4 text-pretty tracking-wider leading-normal">
            Xây dựng hệ thống trả thưởng bằng blockchain
          </h1>
        </Link>
      </div>

      <div className="form-container bg-violet-700 h-[200%] aspect-square rounded-full absolute right-0 translate-x-1/2 flex items-center justify-evenly">
        <LoginForm />
        <div className="w-1/3"></div>
      </div>
    </main>
  );
}

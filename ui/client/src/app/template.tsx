"use client";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";

import "react-toastify/dist/ReactToastify.css";
import Balance from "../components/Balance";
import { NAV_LINK, USER } from "../constant";
import { useUser, useAuth } from "../contexts";
import { logout as logoutService } from "../services/user.service";

const ignoreTemplateRoutes = ["/login", "/register"];

export default function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { logout, accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken && !ignoreTemplateRoutes.includes(pathname)) {
      router.push("/login");
    }
    if (accessToken && ignoreTemplateRoutes.includes(pathname)) {
      router.push(user?.role === USER.ROLE.ADMIN ? "/dashboard/requests" : "/employees");
    }

    switch (user?.role) {
      case USER.ROLE.ADMIN:
        document.title = "Admin Dashboard";
        break;
      case USER.ROLE.MEMBER:
        document.title = "Member Dashboard";
        break;
      default:
        document.title = "Employee Dashboard";
    }
  }, [pathname, router, user?.role, accessToken]);

  const logoutHandler = async () => {
    await toast.promise(
      (async () => {
        await logoutService();
        await logout();
      })(),
      {
        pending: "Logging out...",
        success: "Logged out successfully!",
        error: {
          render({ data }: { data: Error }) {
            return data.message;
          },
        },
      }
    );
  };

  return ignoreTemplateRoutes.includes(pathname) ? (
    children
  ) : (
    <>
      <header className="h-20 fixed top-0 inset-x-0 flex justify-between px-10 bg-violet-950 text-white items-center z-50">
        <Link
          className="block h-full text-2xl text-center p-5 font-bold"
          href={user?.role === USER.ROLE.ADMIN ? "/dashboard/requests" : "/"}
        >
          {pathname.split("/").reverse()[0].toUpperCase() || "DASHBOARD"}
        </Link>

        <div className="flex">
          {user?.role !== USER.ROLE.ADMIN && (
            <Balance rewardToken={0} penaltyToken={0} reputationToken={0} />
          )}

          <div className="account relative overflow-hidden hover:overflow-visible">
            <Image
              className="aspect-square rounded-full border border-slate-400"
              src="https://avatars.githubusercontent.com/u/1?v=4"
              width="40"
              height="40"
              alt="avatar"
            />

            <div className="absolute top-full right-0 pt-4">
              <div className="bg-slate-100 text-slate-700 w-48 p-2 rounded-lg shadow-lg">
                <ul>
                  <li>
                    <button
                      className="inline-block w-full hover:bg-slate-200 py-1 text-start"
                      onClick={logoutHandler}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="h-screen flex box-border pt-20 z-10">
        <nav className="h-full w-1/5 flex flex-column justify-between bg-violet-950 text-white items-start">
          <ul className="w-full">
            {NAV_LINK[user?.role || USER.ROLE.EMPLOYEE].map((link, index) => (
              <li className="border-t border-slate-300/50" key={index}>
                <Link
                  className="inline-block border-b border-slate-300/50 w-full py-3 px-8 text-left"
                  href={link.href}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="h-full grow overflow-auto">{children}</div>

        <ToastContainer position="top-center" autoClose={2000} className="capitalize" />
      </main>
    </>
  );
}

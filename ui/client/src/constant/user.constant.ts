export const USER = {
  ROLE: {
    ADMIN: "qtv-93h8cg" as const,
    MEMBER: "tctv-4kjdfo" as const,
    EMPLOYEE: "nv-d8kj4h" as const,
  },
};

export const MEMBER = {
  SIZE: {
    SMALL: "small" as const,
    MEDIUM: "medium" as const,
    LARGE: "large" as const,
  },
};

export const NAV_LINK = {
  [USER.ROLE.ADMIN]: [
    { title: "Members", href: "/dashboard/members" },
    { title: "Requests", href: "/dashboard/requests" },
    { title: "Reasons", href: "/dashboard/reasons" },
    { title: "Swags", href: "/dashboard/swags" },
  ],
  [USER.ROLE.MEMBER]: [
    { title: "Employees", href: "/employees" },
    { title: "Members", href: "/members" },
    // { title: "Employees", href: "/members/[memberId]/employees" },
    { title: "Requests", href: "/requests" },
    { title: "Swags", href: "/swags" },
    { title: "Reasons", href: "/reasons" },
    { title: "Subscriptions", href: "/subscriptions" },
  ],
  [USER.ROLE.EMPLOYEE]: [
    { title: "Employees", href: "/employees" },
    // { title: "Employees", href: "/members/[memberId]/employees" },
    { title: "Members", href: "/members" },
    { title: "Swags", href: "/swags" },
    { title: "Reasons", href: "/reasons" },
  ],
};

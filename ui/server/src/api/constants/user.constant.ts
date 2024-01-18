export const USER = {
  TABLE_NAME: "users",
  MODEL_NAME: "User",
  ROLE: {
    ADMIN: "qtv-93h8cg" as const,
    SECRETARY: "ctk-8h3g9c" as const,
    ORGANIZATION: "tctv-4kjdfo" as const,
    EMPLOYEE: "nv-d8kj4h" as const,
  },
};

export const ORGANIZATION = {
  TABLE_NAME: "organizations",
  MODEL_NAME: "Organization",
  SIZE: {
    SMALL: "small" as const,
    MEDIUM: "medium" as const,
    LARGE: "large" as const,
  },
};

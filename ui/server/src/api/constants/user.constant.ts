export const USER = {
  TABLE_NAME: "users",
  MODEL_NAME: "User",
  ROLE: {
    ADMIN: "qtv-93h8cg" as const,
    MEMBER: "tctv-4kjdfo" as const,
    EMPLOYEE: "nv-d8kj4h" as const,
  },
};

export const MEMBER = {
  TABLE_NAME: "organizations",
  MODEL_NAME: "Organization",
  SIZE: {
    SMALL: "small" as const,
    MEDIUM: "medium" as const,
    LARGE: "large" as const,
  },
  // keccak256(Buffer.from('employee'))
  DID_DELEGATE_TYPE: "0x863480501959a73cc3fea35fb3cf3402b6489ac34f0a59336a628ff703cd693e" as const,
};

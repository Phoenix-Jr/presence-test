import type { AuthUser } from "@/types";

export const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: "u-001",
    name: "Pastor Daniel Osei",
    email: "admin@gracechurch.org",
    password: "admin123",
    role: "admin",
    church: "Grace Community Church",
    avatarUrl: undefined,
  },
  {
    id: "u-002",
    name: "Sister Mary Adjei",
    email: "staff@gracechurch.org",
    password: "staff123",
    role: "staff",
    church: "Grace Community Church",
    avatarUrl: undefined,
  },
];

export type CurrentUser = {
  id?: number;
  name?: string;
  lastName?: string;
  email?: string;
  business?: string;
  role?: string;
};

export function parseCurrentUser(raw: string | null): CurrentUser | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}

export function isAdminUser(user: CurrentUser | null): boolean {
  if (!user) return false;

  const role = (user.role ?? "").trim().toLowerCase();
  const business = (user.business ?? "").trim().toLowerCase();
  const email = (user.email ?? "").trim().toLowerCase();

  return role === "admin" || business === "admin" || email.includes("@admin");
}

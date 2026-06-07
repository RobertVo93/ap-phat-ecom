import { auth } from "@/auth";

export interface RequestUser {
  id: string;
}

export async function getUserFromRequest(): Promise<RequestUser | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  return { id: userId };
}

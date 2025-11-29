import "server-only";
import { adminAuth } from "@/lib/firebase/admin";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role?: string;
  createdAt: string;
  lastSignInTime: string;
}

export async function getAllUsers(): Promise<UserData[]> {
  try {
    const listUsersResult = await adminAuth.listUsers(1000); // Fetch up to 1000 users

    const users: UserData[] = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email || "",
      displayName: userRecord.displayName || "No Name",
      phoneNumber: userRecord.phoneNumber,
      role: (userRecord.customClaims?.role as string) || "user",
      createdAt: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    }));

    return users;
  } catch (error) {
    console.error("Error listing users:", error);
    throw new Error("Failed to fetch users");
  }
}

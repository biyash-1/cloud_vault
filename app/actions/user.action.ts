"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionedClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";

// Get user by email
export const getUserByEmail = async (email: string) => {
  const { databases } = createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", email)]
  );

  return result.total > 0 ? result.documents[0] : null;
};


 export const sendEmailOTP = async ({ email, accountId }: { email: string; accountId?: string }) => {
  const { account } = await createAdminClient();

  try {
    const id = accountId || ID.unique(); 
    const session = await account.createEmailToken(id, email);
    return session.userId;
  } catch (error) {
    console.error("Failed to send email OTP:", error);
    throw new Error("Failed to send email OTP");
  }
};


export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email format. Please enter a valid email.");
  }
  // --------------------------------------

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered. Please log in instead.");
  }

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        username: fullName,
        email,
        Avatar: null,
        accountId,
      }
    );
  }

  return accountId;
};


export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return  session.$id ;
  } catch (error) {
    console.error("OTP verification failed:", error);
    throw new Error("OTP verification failed");
  }
};


export const logoutUser = async () => {
  const { account } = await createSessionedClient();
  try {
    // Delete session from Appwrite
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error deleting Appwrite session:", error);
  } finally {
    // Ensure cookie is deleted with same options it was set with
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", "", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(0), 
      maxAge: 0, 
    });
    
    redirect("/sign-in");
  }
};
export const getCurrentUser = async () => {
  try {
    //  Get user session from cookie
    const sessionedClient = await createSessionedClient().catch(() => null);
    if (!sessionedClient) return null;
    
    const { account } = sessionedClient;
    
    //  Get logged-in Appwrite account info
    const sessionUser = await account.get().catch(() => null);
    if (!sessionUser) return null;
    
    //  Use admin client to fetch user record from your database
    const { databases } = createAdminClient();
    const userQuery = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", sessionUser.$id)]
    );
    
    if (userQuery.total <= 0) return null;
    return userQuery.documents[0]; // return user record from your DB
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};




export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return {
        success: false,
        message: "This email is not registered.",
      };
    }

    // Send OTP
    await sendEmailOTP({
      email,
      accountId: existingUser.accountId,
    });

    return {                                                                                                        
      success: true,
      message: "OTP has been sent to your email.",
      accountId: existingUser.accountId,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
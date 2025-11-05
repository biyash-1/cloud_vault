
import { Client, Databases, Storage, Account, Avatars } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers"; 
// ✅ For sessioned client (user session)
// lib/appwrite.ts
export const createSessionedClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appwrite-session");

    if (sessionCookie?.value) {
      client.setSession(sessionCookie.value);
    } else {
      console.warn("No Appwrite session found.");
      // Return client without session - don't throw error
    }

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
      get storage() {
        return new Storage(client);
      },
      get avatars() {
        return new Avatars(client);
      },
    };
  } catch (error) {
    console.error("Error creating sessioned client:", error);
    // Return a basic client without session
    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
      get storage() {
        return new Storage(client);
      },
      get avatars() {
        return new Avatars(client);
      },
    };
  }
};

// ✅ For admin client (server-side operations)
export const createAdminClient = () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.appwriteSecret); 

  return {
    get databases() {
      return new Databases(client);
    },
    get account() {
      return new Account(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars(){
        return new Avatars(client);
    }
  };
};

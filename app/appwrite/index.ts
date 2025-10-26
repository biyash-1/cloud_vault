
import { Client, Databases, Storage, Account, Avatars } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers"; 
// ✅ For sessioned client (user session)
export const createSessionedClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);


  const session = (await cookies()).get("appwrite-session");

  if (session) {
    client.setSession(session.value);
  } else {
    throw new Error("No Appwrite session found");
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
  };
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

export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "",
    fileCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILE_COLLECTION_ID || "",
    folderCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FOLDER_COLLECTION_ID || "",
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "",
    appwriteSecret: process.env.APPWRITE_SECRET || "",
}
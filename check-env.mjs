import 'dotenv/config';

const keys = [
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  'NEXT_PUBLIC_APPWRITE_PROJECT_NAME',
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
  'NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID',
  'NEXT_PUBLIC_APPWRITE_FILE_COLLECTION_ID',
  'NEXT_PUBLIC_APPWRITE_BUCKET_ID',
  'APPWRITE_SECRET'
];

console.log('🔍 Checking Appwrite environment variables:\n');

let allGood = true;

for (const key of keys) {
  const value = process.env[key];
  if (!value) {
    console.log(`❌ Missing or undefined: ${key}`);
    allGood = false;
  } else {
    console.log(`✅ ${key} = ${value}`);
  }
}

if (allGood) {
  console.log('\n🎉 All Appwrite environment variables are loaded correctly!');
} else {
  console.log('\n⚠️ Some variables are missing or incorrectly formatted. Check your .env file!');
}

CloudVault 🌐☁️
CloudVault is a secure, fast, and modern cloud storage platform built with Next.js and Appwrite. It allows users to store, manage, share, and access files from anywhere with a sleek, interactive, and mobile-responsive interface.

🚀 Features
| Feature                    | Description                                |
|----------------------------|--------------------------------------------|
| Upload & Manage Files      | Images, videos, documents, and more       |
| Folder System              | Create folders and organize files easily  |
| Share Files                | Easily share files with others            |
| Edit & Delete              | Rename, move, delete files                |
| Download Files             | Secure and fast file downloads            |
| Secure Authentication      | OTP login for safe access                  |
| Interactive Dashboard      | Clean, responsive, mobile-friendly UI     |
| Backend Powered by Appwrite| Handles DB, storage, and authentication   |


🎯 Goal
To build a secure, efficient, and user-friendly cloud storage platform that allows users to manage their files effortlessly, with a modern and responsive design.

## 🛠️ Tech Stack

| Layer      | Technology / Tools                     |
|-----------|----------------------------------------|
| Frontend   | Next.js, TypeScript, Tailwind CSS      |
| Backend    | Appwrite (Database, Storage, Auth, OTP)|
| Deployment | Vercel                                  |


Backend: Appwrite (Database, Storage, Auth, OTP)

Deployment: Vercel

/app                # Next.js pages and components
/components         # Reusable UI components
/lib                # Utility functions
/appwrite           # Appwrite client setup
/public             # Static assets

⚡ Live Demo
Try the platform live: CloudVault Demo
It’s fully deployed and free to use.

📌 Installation & Setup (for local development)
Clone the repository:

Copy code
```bash

git clone https://github.com/biyash-1/cloud_vault.git
cd cloud_vault
Install dependencies:
```

Copy code
```bash

npm install
```

Set up environment variables in .env.local:


Copy code
```bash

NEXT_PUBLIC_APPWRITE_ENDPOINT=<your_appwrite_endpoint>
NEXT_PUBLIC_APPWRITE_PROJECT=<your_appwrite_project_id>
NEXT_PUBLIC_APPWRITE_DATABASE_ID=<your_database_id>
NEXT_PUBLIC_APPWRITE_BUCKET_ID=<your_storage_bucket_id>
Run the development server:
```


bash
Copy code
```bash

npm run dev
```

Open http://localhost:3000 to view your app.

📝 Usage
Login with your email (OTP login)

Upload files (images, videos, documents)

Create folders and move files into them

Share, edit, download, or delete files

Use the responsive dashboard on desktop or mobile

🔒 Security
Uses Appwrite Authentication with OTP login

All files are securely stored in Appwrite Storage

User data is managed safely in Appwrite Database

📂 Contributing
Contributions are welcome! If you want to improve CloudVault:

Fork the repository

Create a new branch: git checkout -b feature/your-feature

Commit your changes: git commit -m "Add your feature"

Push to the branch: git push origin feature/your-feature

Open a Pull Request

📜 License
This project is MIT licensed.

🙌 Connect
GitHub: biyash-1/cloud_vault

Live Demo: cloud-vault-omega-dun.vercel.app

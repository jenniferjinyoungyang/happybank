# **Happy Bank**

Happy Bank is a **single-page application** developed by [Jennifer Yang](https://github.com/jenniferjinyoungyang) and [Yuri Yang](https://github.com/itsyurika) as a personal hobby project. It allows users to **save their happy memories** and **randomly revisit** them, encouraging appreciation of the good moments in life.

![Login Page](https://res.cloudinary.com/dujcvkecm/image/upload/v1741314689/happybank_screenshot_01_abqmgv.png)

## **Table of Contents**

- [About](#about)
- [Features](#features)
- [Future Features](#future-features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Public URL](#public-url)
- [Contributing](#contributing)

## **About**

Happy Bank is a **simple and uplifting web app** designed to help users **capture and relive memorable moments**. Inspired by the tradition of writing happy notes and saving them in a jar, this app lets users create **small memos** with a title, message, and image. Over time, Happy Bank **randomly resurfaces past entries**, bringing moments of joy and nostalgia when least expected.

### **Features**

✅ **Write & save** short memos with a title and message  
📸 **Attach an image** to each memory  
🔄 **Randomly rediscover** past moments  
💾 **A digital alternative** to the classic memory jar

![Dashboard Page](https://res.cloudinary.com/dujcvkecm/image/upload/v1741314688/happybank_screenshot_02_plliry.png)

Whether it's a **personal achievement, a funny moment, or a heartwarming experience**, Happy Bank helps you **collect and relive life's little joys**.

### **Future Features**

🔖 **Hashtags** – Categorize memorable moments  
🔍 **Memory Search** – Search memories by **date range** or **hashtags**

## **Technologies Used**

### **Key Features**

- 🔐 **Authentication with [NextAuth.js](https://next-auth.js.org/)**
  - Sign up & sign in with **Google**
- 🌤️ **Image management via [Cloudinary](https://cloudinary.com/)**
- 🗄️ **Database management with [Prisma](https://www.prisma.io/)**

### **Tech Stack**

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Cloudinary](https://cloudinary.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

## **Installation**

To set up the project, follow these steps.

### **Prerequisites**

Ensure you have the following installed:

- [Node.js (LTS version)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### **Clone the Repository**

```bash
git clone https://github.com/your-username/my-nextjs-app.git
cd my-nextjs-app
```

### **Install dependencies**

```bash
npm install
```

### **Set up NextAuth.js**

1. Create a `.env` file in the project root.
2. Add the following environment variables:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-next-auth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **Set up Cloudinary**

1. Sign up at [Cloudinary](https://cloudinary.com/).

2. In the Cloudinary dashboard, find your Cloud Name, API Key, and API Secret.

3. Add them to `.env`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_URL=cloudinary://your-cloudinary-api-key:your-cloudinary-api-secret@your-cloudinary-cloud-name
```

### **Set up Prisma & PostgreSQL**

1. Configure the database connection in `.env`:

```bash
POSTGRES_DATABASE=your-postgres-database
POSTGRES_HOST=your-postgres-host
POSTGRES_USER=your-postgres-user
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_URL=postgres://your-postgres-user:your-postgres-password@your-postgres-host/your-postgres-database?sslmode=require
POSTGRES_PRISMA_URL=postgres://your-postgres-user:your-postgres-password@your-postgres-host/your-postgres-database?pgbouncer=true&connect_timeout=15&sslmode=require
POSTGRES_URL_NO_SSL=postgres://your-postgres-user:your-postgres-password@your-postgres-host/your-postgres-database
```

2. Apply database migrations:

```bash
npx prisma migrate dev
```

3. Generate Prisma client:

```bash
npx prisma generate
```

## **Running Locally**

To start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000.

## **Public URL**

You can access Happy Bank here:
</br>
🔗 https://happybank-black.vercel.app/

## **Contributing**

Want to contribute? Follow these steps:

1. **Fork** the repository.
2. Create a **new branch**

```bash
git checkout -b feature-branch
```

3. Make your changes and **commit**

```bash
git commit -am 'Add new feature'
```

4. **Push** to GitHub

```bash
git push origin feature-branch
```

5. Open a **pull request**.

Not sure what to work on? Check out [open issues](https://github.com/jenniferjinyoungyang/happybank/issues) and pick one!

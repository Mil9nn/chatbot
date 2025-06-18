# NOTABOT 🤖

A modern AI-powered chat application with real-time messaging, voice input, and image analysis capabilities. NOTABOT presents itself as a friendly, human-like conversational partner powered by OpenAI's GPT models.

## ✨ Features

- **Real-time Chat**: Instant messaging with WebSocket support
- **Voice Input**: Speech-to-text functionality for hands-free interaction
- **Image Analysis**: AI-powered image scanning and description using GPT-4 Vision
- **User Authentication**: Secure signup/login with JWT tokens
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Message History**: Persistent chat history with ability to clear conversations

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Socket.io** - Real-time communication
- **OpenAI API** - AI chat completions and image analysis
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** with **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Markdown** - Markdown rendering
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Mil9nn/chatbot
cd chatbot
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/notabot
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notabot

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Start the backend server
```bash
npm run dev
```
The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to frontend directory (new terminal)
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Create environment file (if needed)
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start the frontend development server
```bash
npm run dev
```
The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Getting API Keys

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up/login to your account
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste it into your `.env` file

#### Cloudinary Setup
1. Visit [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your Dashboard
4. Copy your Cloud Name, API Key, and API Secret
5. Add them to your `.env` file

#### MongoDB Setup
**Option 1: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/notabot`

**Option 2: MongoDB Atlas (Recommended)**
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and database name

## 📁 Project Structure

```
notabot/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── message.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── message.model.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── message.route.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── lib/
│   │   │   ├── db.js
│   │   │   ├── jwt.js
│   │   │   ├── openai.js
│   │   │   └── cloudinary.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── lib/
│   │   └── types/
│   ├── package.json
│   └── .env
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `POST /api/messages/send` - Send a message
- `GET /api/messages/all/:userId` - Get all messages for a user
- `DELETE /api/messages/delete/:userId` - Delete all messages for a user
- `POST /api/messages/analyze-image` - Analyze an image with AI


## 🧪 Usage

1. **Sign up/Login**: Create an account or login with existing credentials
2. **Chat**: Start conversing with NOTABOT using text or voice input
3. **Voice Input**: Click the microphone icon to use speech-to-text
4. **Image Analysis**: Navigate to "Scan Image" to analyze images with AI
5. **Theme Toggle**: Switch between light and dark themes

**Happy Chatting with NOTABOT! 🤖✨**
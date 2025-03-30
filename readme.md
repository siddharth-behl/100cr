# Business Growth Simulator

A gamified business growth simulator that transforms entrepreneurial learning into an immersive, interactive experience. Progress through a dynamic journey of skill acquisition and business development, visualizing your path from startup to a ₹100Cr enterprise.

## Features

- **Level-based progression** with 5 distinct stages of business growth
- **Interactive 3D visualizations** showing your business progress
- **Skill tree system** for unlocking and managing entrepreneurial skills
- **Mission completion tracker** with visual feedback
- **Star celebration effects** when accomplishing tasks
- **Responsive design** for multiple devices

## Technologies Used

- React frontend with TypeScript
- Three.js / React Three Fiber for 3D graphics
- Express backend
- MongoDB database with in-memory fallback
- Tailwind CSS for styling

## Installation Instructions

1. **Download the project zip file** from Replit
2. **Extract the zip file** to your local machine
3. **Navigate to the project directory** in your terminal
4. **Set up environment variables**:
   - Rename `.env.example` to `.env`
   - Update the MongoDB connection string in the `.env` file with your credentials
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```
5. **Install dependencies**:
   ```
   npm install
   ```
6. **Start the development server**:
   ```
   npm run dev
   ```
7. **Access the application** at http://localhost:5000

> **Note:** If you don't provide a MongoDB connection, the application will automatically use in-memory storage as a fallback.

## How to Play

1. **Start at Level 1** (Rookie) as a beginner entrepreneur
2. **Complete missions** by clicking on them in the Missions tab
3. **Unlock skills** in the Skills tab to enhance your business knowledge
4. **Watch your business tower grow** as you progress through levels
5. **Experience celebration effects** as you complete tasks
6. **Progress is automatically saved** to the database

## Game Controls

- **Click on missions** to mark them as complete/incomplete
- **Click on skills** to unlock them
- **Use the trash icon** to remove previously unlocked skills
- **Navigate the 3D scene** using the mouse to orbit and zoom

## Database Information

- The application uses MongoDB for data storage
- If MongoDB connection fails, the system automatically falls back to in-memory storage
- No data loss will occur during normal gameplay

## Support

For any issues or questions, please reach out for support.

Enjoy building your virtual business empire!
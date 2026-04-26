import mongoose from "mongoose";

const connectDB = async () => {
  // If already connected, do not connect again
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully!");
  console.log("DB Name:", mongoose.connection.name);
};

export default connectDB;
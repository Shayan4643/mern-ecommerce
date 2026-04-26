import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");
    console.log("DB Name:", mongoose.connection.name); // 👈 ADD THIS

  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

export default connectDB;
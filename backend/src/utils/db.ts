import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Avoid silent buffering when the connection isn't ready.
    // This prevents long hangs / "buffering timed out" style errors.
    mongoose.set('bufferCommands', false);

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in backend/.env');
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      dbName: process.env.MONGODB_DB_NAME,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

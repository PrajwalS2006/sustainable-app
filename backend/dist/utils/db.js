// backend/src/utils/db.ts
import mongoose from 'mongoose';
/**
 * Connects to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sustainable_app';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map
import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async () => {
  try {
    // Fix querySrv ECONNREFUSED issues commonly encountered on Windows / ISP routers
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};


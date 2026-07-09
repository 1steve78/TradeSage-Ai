import mongoose from 'mongoose';

const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to server/.env before starting the server.');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

export default connectMongo;
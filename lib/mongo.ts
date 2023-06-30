import mongoose from 'mongoose'

if (!process.env.MONGODB_URI)
  throw new Error('Invalid environment variable: "MONGODB_URI"')
const connectMongo = mongoose.connect(process.env.MONGODB_URI as string)
export default connectMongo

import mongoose from "mongoose";

const connectToDb = async () => {
  await mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("database connected....");
  });
};

export default connectToDb;

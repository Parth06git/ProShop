import mongoose from "mongoose";

const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDB is successfully connected");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

export default connectToMongo;

import mongoose from "mongoose";

export const db = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Oktay1299:Oktay1299@learningvue.yznfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    );
    console.log("Mongo.db connected");
  } catch (error) {
    console.log("Error in mongo.db connection", error);
  }
};

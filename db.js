import mongoose from "mongoose";

export function db() {
  mongoose
    .connect(
      "mongodb+srv://Oktay1299:Oktay1299@learningvue.yznfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      { useNewUrlParser: true }
    )
    .then(() => console.log("DB connected"))
    .catch((err) => console.error(err));
}

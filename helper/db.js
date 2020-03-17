const mongoose = require("mongoose");
//mongodb+srv://recep:12345@movie-p4qkm.gcp.mongodb.net/test?retryWrites=true&w=majority
//mongodb://localhost/udemy
module.exports = () => {
  mongoose.connect(
    "mongodb+srv://recep:12345@movie-p4qkm.gcp.mongodb.net/nbr?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  );
  mongoose.connection.on("open", () => {
    console.log("MongoDB: Connected");
  });
  mongoose.connection.on("error", err => {
    console.log("MongoDB: Error", err);
  });

  mongoose.Promise = global.Promise;
};

const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose
    .connect(process.env.Database_Url)
    .then(() => console.log("Connected To Database"))
    .catch((err) => console.log("Not Connected To Database " + err));
};

module.exports = connectToDatabase;

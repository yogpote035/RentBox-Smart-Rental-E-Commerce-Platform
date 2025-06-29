if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./ConnectToDatabase");

const app = express();
const port = process.env.port || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors("*"));

connectToDatabase();

app.use("/api/auth", require("./routes/UserRoutes"));
app.use("/api/product", require("./routes/ProductRoutes"));

app.listen(port, () => console.log(`App Started On ${port} Port`));

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

app.use(cors("*", { Credential: true }));

connectToDatabase();

// checkup route
// Health check for GET (browser & manual)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Health check for HEAD (UptimeRobot Free Plan)
app.head("/health", (req, res) => {
  res.sendStatus(200);
});

app.use("/api/auth", require("./routes/UserRoutes"));
app.use("/api/product", require("./routes/ProductRoutes"));
app.use("/api/cart", require("./routes/CartRoutes"));
app.use("/api/order", require("./routes/OrderRoutes"));

app.listen(port, () => console.log(`App Started On ${port} Port`));

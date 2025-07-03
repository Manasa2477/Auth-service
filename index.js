const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { APIS } = require("./config/constants");
const authRoutes = require("./routes/authRoutes");
const app = express();
const port = 6000;
const corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("<h1>Welcome to API Gateway!</h1><p>Your trusted API service.</p>");
});
app.use(APIS.AUTH.SERVICE_NAME, authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port} mode`);
});

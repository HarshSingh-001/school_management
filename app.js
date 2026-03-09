import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import schoolRoutes from "./route/schoolRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", schoolRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





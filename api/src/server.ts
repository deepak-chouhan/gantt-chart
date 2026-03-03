import app from "./app.js";
import { env } from "./api/v1/config/env.js";
import { connectDB } from "./api/v1/config/db.js";

await connectDB()
  .then(() => {
    console.log("Connected to DB");

    app.listen(env.port, () => {
      console.log("Server running...");
    });
  })
  .catch((err) => console.log(err));

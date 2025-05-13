import { app } from "./app";
import "dotenv/config";
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server is running at: http://localhost:8080");
});

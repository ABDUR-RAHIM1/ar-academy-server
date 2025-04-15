
import { connectDb } from "./config/connectDb.js";
import { port } from "./config/constans.js";
import { app } from "./app.js";

// export const app = express();


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    connectDb()
});


import { connectDb } from "./config/connectDb.js";
import { port } from "./config/constans.js";
import { app } from "./app.js";

// export const app = express();

const myPort = port || 9000

app.listen(myPort, () => {
    console.log(`Server running on port ${myPort}`)
    connectDb()
});

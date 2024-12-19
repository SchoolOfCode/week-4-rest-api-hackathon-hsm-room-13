//imported express
import express from "express";
const app = express();
// Middleware to parse JSON bodies
 app.use(express.json());





// console.log("Hello");
app.get("/", function (req, res) {
    res.send("hello world");
  });




const PORT = process.env.PORT || 3001;
// // Start the server and listen on the defined port
app.listen(PORT, () => {
// Log a message to the console when the server is successfully running
console.log(`App listening at http://localhost:${PORT}`);
});


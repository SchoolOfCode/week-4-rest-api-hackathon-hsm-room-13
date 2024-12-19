/* 
INITIAL PLAN

1. Get working connection with postman ✅
2. We want to get all of the dinosaur data on postman & test connection
    a. Store the raw data from database in a variable that we can import and use in our functions
    b. We need to figure out how to read the data from our database (also can edit/write file) ✅
        - use fs module to read data from database
    c. use express libray to write the api endpoints 
        - listen for a get request from the client, and send back relevant data to display on postman
*/

// Import express
import express from "express";
const app = express();

// Middleware to parse JSON bodies
 app.use(express.json());

// Import fs module
import fs from 'fs/promises';

const dataBasePath = './resource.json'

// USE FS MODULE TO READ DATA FROM DATABASE
    // import fs module
    // get readFile from the fs module and pass in our data file to read the data (built-in Node.js function for reading files asynchronously)
    // => store this data in a variable
    // parse the data to javascript array/object so we can use it 

async function readDinoData(){
    const data = await fs.readFile(dataBasePath, 'utf8');
    return JSON.parse(data);
};

const dinoData = await readDinoData();
console.log(dinoData)








// LISTEN FOR PORT CONNECTION

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});


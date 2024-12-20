/* 
INITIAL PLAN

1. Get working connection with postman ✅
2. We want to get all of the dinosaur data on postman & test connection
    a. Store the raw data from database in a variable that we can import and use in our functions
    b. We need to figure out how to read the data from our database (also can edit/write file) ✅
        - use fs module to read data from database
    c. use express libray to write the api endpoints ✅
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

// 1. USE FS MODULE TO READ DATA FROM DATABASE
    // import fs module
    // get readFile from the fs module and pass in our data file to read the data (built-in Node.js function for reading files asynchronously)
    // => store this data in a variable
    // parse the data to javascript array/object so we can use it 

async function readDinoData(){
    const data = await fs.readFile(dataBasePath, 'utf8');
    return JSON.parse(data);
};

// const dinoData = await readDinoData();

// 2. GET REQUEST FOR DATA API ENDPOINT
    // listen for incoming GET requests on the root ('/') route
    // when a GET request is made, use the helper function readDinoData() get the data from database
    // after fetching the data, send it back to client as JSON response with 200 status response
    // if catch error with 400 status

app.get("/", async function (req, res) {
    try {
    const allDinos = await readDinoData();
    return res.status(200).json(allDinos);
    }
    catch(error){
    return res.status(400)("error");
    }
});

app.get("/:id", async function (req, res) {
    try {

    const dinoID = Number(req.params.id);
    const matchingDino = await getAllDinoObjectByID(dinoID);

    return res.status(200).json(matchingDino);

    }
    catch(error){
    return res.status(400)("error");
    }
});
 
async function getAllDinoObjectByID(dinoID){

    const allDinos = await readDinoData();
    const dinoObject = allDinos.find(dinoObject => dinoObject._id === dinoID);

    return dinoObject;

};

// LISTEN FOR PORT CONNECTION

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});


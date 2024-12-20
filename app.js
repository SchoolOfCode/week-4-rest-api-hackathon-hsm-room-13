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
    // get readFile from the fs module and pass in our data file to read the data
    // => store this data in a variable
    // parse the data to javascript array/object so we can use it 

async function readDinoData(){
    const data = await fs.readFile(dataBasePath, 'utf8');
    return JSON.parse(data);
};

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



// 3. GET REQUEST FOR SPECIFIC DINO BY ID
    // listen for GET request on '/:id' route
    // extract the 'id' from the request parameters and convert it to a number
    // call the helper function getDinoObjectByID(dinoID) to get the matching dinosaur object
    // if a matching dinosaur is found, send it back as a JSON response with 200 status
    // if an error occurs, send a 400 status with an error message

    // a. HELPER FUNCTION TO GET DINO OBJECT BY ID
        // call readDinoData() to fetch all dinosaur data
        // search for a dinosaur object with the matching ID using .find()
        // return the matching dinosaur object

async function getDinoObjectByID(dinoID){
    const allDinos = await readDinoData();
    const matchingDinoObject = allDinos.find(dinoObject => dinoObject._id === dinoID);

    return matchingDinoObject;
};

app.get("/:id", async function (req, res) {
    try {

    const dinoID = Number(req.params.id);
    const matchingDino = await getDinoObjectByID(dinoID);

    return res.status(200).json(matchingDino);

    }
    catch(error){
    return res.status(400)("error");
    }
});



// 4. GET REQUEST FOR SPECIMEN IMAGES BY DINO ID
    // listen for GET on '/:id/specimen-images'
    // extract 'id' and fetch dino data with getDinoObjectByID(dinoID)
    // if no dino or images, return 404
    // filter and map specimen images, redirect to first URL
    // handle errors with 500 response
  
// b. FUNCTION TO FILTER SPECIMEN IMAGES
    // check if associatedMedia exists and is an array
    // filter the associatedMedia array for items with category "Specimen"
    // return the filtered array of specimen images (or an empty array if no images found)

    function getSpecimenImages(matchingDinoObject) {
        return matchingDinoObject.associatedMedia.filter(media => media.category === "Specimen");
    }

    app.get("/:id/specimen-images", async (req, res) => {
        try {
            const dinoID = Number(req.params.id);
            const matchingDinoObject = await getDinoObjectByID(dinoID);

            if (!matchingDinoObject) {
                return res.status(404).json({ error: "Dinosaur not found" });
            }

            const specimenImages = getSpecimenImages(matchingDinoObject);
            if (!specimenImages.length) {
                return res.status(404).json({ error: "No Specimen images found for this dinosaur" });
            }

            const specimenURLs = specimenImages.map(media => media.identifier);
            const redirectToSpecimenURL = res.redirect(specimenURLs[0]); 

            return  redirectToSpecimenURL
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Failed to retrieve specimen images" });
        }
    });



// LISTEN FOR PORT CONNECTION

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});


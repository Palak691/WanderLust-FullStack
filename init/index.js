// const mongoose = require('mongoose');
// const Listing = require('../models/listing');
// const initData = require('./data');

// const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

// async function main(){
//     await mongoose.connect(MONGO_URL);
//      await initDb();
//      mongoose.connection.close();

// }

// main()
// .then(()=>{
//     console.log("mongoDb connected")
// })
// .catch((err)=>{
// console.log(err)
// });

// const initDb = async ()=>{
//     await Listing.deleteMany({});
//      initData.data = initData.data.map((obj)=>(
//         {...obj, owner : "699e7f47025e09540645908a"}
//     ));
//     await Listing.insertMany(initData.data);
//     console.log("data is initailized");
// }
// //node init/index.js ---> run file



const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data');

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

//coordinates (Longitude, Latitude)
const cityCoordinates = {
  "New York City, United States": [-74.0060, 40.7128],
  "Aspen, United States": [-106.8370, 39.1911],
  "Florence, Italy": [11.2558, 43.7696],
  "Portland, United States": [-122.6784, 45.5152],
  "Cancun, Mexico": [-86.8515, 21.1619],
  "Lake Tahoe, United States": [-120.0440, 39.0968],
  "Los Angeles, United States": [-118.2437, 34.0522],
  "Verbier, Switzerland": [7.2283, 46.0969],
  "Serengeti National Park, Tanzania": [34.6857, -2.3333],
  "Amsterdam, Netherlands": [4.9041, 52.3676],
  "Fiji, Fiji": [178.0650, -17.7134],
  "Cotswolds, United Kingdom": [-1.8433, 51.8330],
  "Boston, United States": [-71.0589, 42.3601],
  "Bali, Indonesia": [115.1889, -8.4095],
  "Banff, Canada": [-115.5708, 51.1784],
  "Miami, United States": [-80.1918, 25.7617],
  "Phuket, Thailand": [98.3381, 7.8804],
  "Scottish Highlands, United Kingdom": [-4.2026, 57.1200],
  "Dubai, United Arab Emirates": [55.2708, 25.2048],
  "Montana, United States": [-110.3626, 46.8797],
  "Mykonos, Greece": [25.3289, 37.4467],
  "Costa Rica, Costa Rica": [-83.7534, 9.7489],
  "Charleston, United States": [-79.9311, 32.7765],
  "Tokyo, Japan": [139.6917, 35.6895],
  "New Hampshire, United States": [-71.5724, 43.1939],
  "Maldives, Maldives": [73.2207, 3.2028],
  "Malibu, United States": [-118.7798, 34.0259]
};

async function main(){
    await mongoose.connect(MONGO_URL);
    await initDb();
    mongoose.connection.close();
}

main()
.then(()=>{
    console.log("MongoDB connected");
})
.catch((err)=>{
    console.log(err);
});

const initDb = async ()=>{
    await Listing.deleteMany({});

    const updatedData = initData.data.map((obj)=>{

        const key = `${obj.location}, ${obj.country}`;
        const coords = cityCoordinates[key];

        return {
            ...obj,
            owner: "699e7f47025e09540645908a",
            geometry: coords ? {
                type: "Point",
                coordinates: coords
            } : undefined
        };
    });

    await Listing.insertMany(updatedData);

    console.log("Data initialized with geometry!");
};



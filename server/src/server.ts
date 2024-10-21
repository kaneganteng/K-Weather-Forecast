import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

// console.log(process.env);

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static('../client/dist')); 
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json()); // all data will be parsed in JSON format
app.use(express.urlencoded({ extended: true })); // lets us use req.body in routes to grab data
// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

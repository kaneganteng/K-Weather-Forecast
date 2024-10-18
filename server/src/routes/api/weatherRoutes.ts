import { Router, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
console.log(process.env);
console.log("start");
console.log(process.env.API_KEY);
console.log(process.env.API_BASE_URL);
console.log("end");

// TODO: POST Request with city name to retrieve weather data
router.post('/', (_req: Request, _res: Response) => {
  _res.status(418).send("This hasn't been implemented yet.");
  // TODO: GET weather data from city name
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (_req: Request, _res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {});

export default router;

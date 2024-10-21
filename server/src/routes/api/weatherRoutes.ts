import { Router, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// WeatherService.baseURL = process.env.API_BASE_URL;
// WeatherService.apiKey = process.env.API_KEY;

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.cityName;
    if (!cityName) {
      res.status(400).send({ error: "Provide a city!" });
    }
    const weatherWithForecast = await WeatherService.getWeatherWithForecast(cityName);
    
    if (!weatherWithForecast) {
      res.status(404).send({ error: 'Could not find city or weather data' });
    }

    // Save the city to search history
    await HistoryService.addCity(cityName);

    // Send combined current weather and forecast data
    // return res.status(200).json(weatherWithForecast);
    res.send(weatherWithForecast);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Error fetching weather data');
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getCities();
    return res.status(200).json(searchHistory);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving search history.' });
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;

  try {
    await HistoryService.removeCity(cityId);
    return res.status(200).json({ message: 'City removed from search history.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing city from history.' });
  }
});

export default router;

import { Router, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

WeatherService.apiKey  = process.env.API_KEY;
WeatherService.baseURL = process.env.API_BASE_URL;


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const cityName = req.body.cityName;

  if (!cityName) {
    return res.status(400).json({ message: 'City name is required.' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log(weatherData);
    if (!weatherData) {
      return res.status(404).json({ message: 'Weather data not found for the specified city.' });
    }

    // Save the city to search history
    await HistoryService.addCity(cityName);

    return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching weather data.'});
  }
});
// TODO: GET 5-day forecast for a city
router.get('/forecast', async (req: Request, res: Response) => {
  const cityName = req.query.cityName as string;

  if (!cityName) {
    return res.status(400).json({ message: 'City name is required.' });
  }

  try {
    const forecastData = await WeatherService.getForecastForCity(cityName);
    if (!forecastData) {
      return res.status(404).json({ message: 'Forecast data not found for the specified city.' });
    }

    return res.status(200).json(forecastData);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching forecast data.'});
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getCities();
    return res.status(200).json(searchHistory);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving search history.'});
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;

  try {
    await HistoryService.removeCity(cityId);
    return res.status(200).json({ message: 'City removed from search history.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing city from history.'});
  }
});

export default router;

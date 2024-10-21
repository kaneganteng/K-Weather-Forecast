// import fs from 'node:fs/promises'; // not sure if this is correct
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

class Weather {
  city: string;
  id: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    id: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
  ) {
    this.city = city;
    this.id = id;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// TODO: Define an interface for the Coordinates object
// interface Location {
//   id: string;
// }
// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;
  cityName!: string;

  private buildWeatherQuery(city: string): string {
    return `${this.baseURL}weather?q=${city}&appid=${this.apiKey}&units=imperial`;
  }
  private buildForecastQuery(city: string): string {
    return `${this.baseURL}forecast?q=${city}&appid=${this.apiKey}&units=imperial`;
  }


  private async fetchWeatherData(city: string): Promise<any> {
    const query = this.buildWeatherQuery(city);
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${city}`);
    }

    const data = await response.json();
    // console.log('Weather API response:', data); //log the entire response for debugging
    return data;

  }

  private async fetchForecastData(city: string): Promise<any> {
    const query = this.buildForecastQuery(city);
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch forecast data for ${city}`);
    }
    const data = await response.json();
    // console.log("Forecast API response:", data); // log the raw forecast data
    return data;
  }
  private parseCurrentWeather(response: any): Weather {
    // check if the response has the expected structure
    if (!response || !response.name || !response.weather || !response.main) {
      throw new Error('Invalid weather data structure');
    }

    const city = response.name;
    const id = uuidv4();
    const date = new Date(response.dt * 1000).toString();
    const icon = response.weather[0].icon;
    const iconDescription = response.weather[0].description;
    const tempF = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;

    return new Weather(city, id, date, icon, iconDescription, tempF, windSpeed, humidity);
  }
  private parseForecast(response: any): Weather[] {
    const forecast: Weather[] = []
    const seenDays = new Set<string>(); // Keep track of unique dates

    console.log('Full forecast response:', response);

    for (const data of response.list) {
      const date = new Date(data.dt * 1000);
      const hours = String(date.getHours()).padStart(2, '0');

      console.log(`Processing entry with time: ${date} and hours: ${hours}`);

      if (hours !== '02') {
        // console.log(`Skipping entry for ${date} (hours: ${hours}), not 02:00`);
        continue;
      } //skipp entries taht are not at 02:00:00

      const formattedDate = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      },
      );

      // Skip if we already processed this date (ensure unique days)
      if (seenDays.has(formattedDate)) continue;
      seenDays.add(formattedDate);

      if (!response.city?.name || !data.weather || !data.main) {
        console.error(`Invalid data structure for entry on ${formattedDate}`);
        continue;
      }
      const city = response.city.name;
      const icon = data.weather[0].icon;
      const iconDescription = data.weather[0].description;
      const tempF = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      const id = uuidv4();

      // Log the valid entries being added to the forecast
      console.log(`Adding forecast for ${formattedDate} 02:00:00`, {
        city,
        icon,
        iconDescription,
        tempF,
        windSpeed,
        humidity
      });

      // Create a Weather object and add to forecast array
      forecast.push(
        new Weather(
          city,
          id,
          `${formattedDate} 02:00:00`,
          icon,
          iconDescription,
          tempF,
          windSpeed,
          humidity
        )
      );

      // Stop once we have 5 days
      if (forecast.length === 5) break;
    }

    console.log('Final forecast array:', forecast);
    return forecast;
  }

  private buildForecastArray(currentWeather: Weather, forecast: Weather[]): Weather[] {
    const forecastObject: { [key: string]: any } = {};
    forecast.forEach(item => {
      const dateKey =  item.date.split(' ')[0];
      forecastObject[dateKey] = {
        city: currentWeather.city,
        tempF: item.tempF,
        windSpeed: item.windSpeed,
        humidity: item.humidity,
        icon: item.icon,
        iconDescription: item.iconDescription,
        id: item.id
      };
    });

    forecast.unshift(currentWeather);

    return forecast;
  }


  public async getWeatherForCity(city: string): Promise<Weather | null> {
    try {
      const weatherData = await this.fetchWeatherData(city);
     
      // console.log(weatherData);
      return this.parseCurrentWeather(weatherData);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getForecastForCity(city: string): Promise<Weather[] | null> {
    try {
      const forecastData = await this.fetchForecastData(city);
      return this.parseForecast(forecastData);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  public async getWeatherWithForecast(city: string): Promise<any> {
    const currentWeather = await this.getWeatherForCity(city);
    const forecastWeather = await this.getForecastForCity(city);
    
    if (!currentWeather || !forecastWeather) {
      return null;
    }

    return this.buildForecastArray(currentWeather, forecastWeather);
  }
}

export default new WeatherService();

// TODO: Define the baseURL, API key, and city name properties

// TODO: Create buildWeatherQuery method
// private buildWeatherQuery(coordinates: Coordinates): string {}

// TODO: Create fetchWeatherData method
// private async fetchWeatherData(coordinates: Coordinates) {}
// TODO: Build parseCurrentWeather method
// private parseCurrentWeather(response: any) {}
// TODO: Complete buildForecastArray method
// private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
// TODO: Complete getWeatherForCity method
// async getWeatherForCity(city: string) {}





// TODO: Create fetchLocationData method *disregard
// private async fetchLocationData(query: string) {} *disregard
// TODO: Create destructureLocationData method *disregard
// private destructureLocationData(locationData: Coordinates): Coordinates {} *disregard
// TODO: Create buildGeocodeQuery method *disregard
// private buildGeocodeQuery(): string {} *disregard
// TODO: Create fetchAndDestructureLocationData method *disregard
// private async fetchAndDestructureLocationData() {} *disregard
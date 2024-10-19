// import fs from 'node:fs/promises'; // not sure if this is correct
import dotenv from 'dotenv';
dotenv.config();

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// TODO: Define an interface for the Coordinates object

// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
class WeatherService {
   baseURL: string | undefined;
   apiKey: string | undefined;
  cityName: string = "";
 

  private buildWeatherQuery(city: string): string {
    return `${this.baseURL}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=imperial`;
  }
  private buildForecastQuery(city: string): string {
    return `${this.baseURL}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=imperial`;
  }
  private async fetchWeatherData(city: string): Promise<any> {
    const query = this.buildWeatherQuery(city);
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${city}`);
    }
    return response.json();
  }

  private async fetchForecastData(city: string): Promise<any> {
    const query = this.buildForecastQuery(city);
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch forecast data for ${city}`);
    }
    return response.json();
  }
  private parseCurrentWeather(response: any): Weather {
    const city = response.name;
    const date = new Date(response.dt * 1000).toISOString();
    const icon = response.weather[0].icon;
    const iconDescription = response.weather[0].description;
    const tempF = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;

    return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
  } 
  private parseForecast(response: any): Weather[] {
    // Assuming the API returns an array of forecast data in response.list
    return response.list.slice(0, 5).map((data: any) => {
      const city = response.city.name; // Get the city name from the response
      const date = new Date(data.dt * 1000).toISOString();
      const icon = data.weather[0].icon;
      const iconDescription = data.weather[0].description;
      const tempF = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;

      return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
    });
  }
  public async getWeatherForCity(city: string): Promise<Weather | null> {
    try {
      const weatherData = await this.fetchWeatherData(city);
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
}

export default new WeatherService();
//   private parseCurrentWeather(response: any): Weather {
//     const city = response.name;
//     const date = new Date(response.dt * 1000).toISOString();
//     const icon = response.weather[0].icon;
//     const iconDescription = response.weather[0].description;
//     const tempF = response.main.temp;
//     const windSpeed = response.wind.speed;
//     const humidity = response.main.humidity;
  
//     return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
//   }
  
//   private buildForecastArray(weatherData: any[]): Weather[] {
//     return weatherData.map((data: any) => this.parseCurrentWeather(data));
//   }
//   public async getWeatherForCity(city: string): Promise<Weather | null> {
//     try {
//       const weatherData = await this.fetchWeatherData(city);
//       return this.parseCurrentWeather(weatherData);
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }
// }
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
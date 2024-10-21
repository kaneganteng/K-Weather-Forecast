import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';


// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = uuidv4();
  }
}

// History Service class with async read method
class HistoryService {
  private async read(): Promise<City[] | null> {
    try {
      const data = await fs.readFile('searchHistory.json', 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error('Error reading searchHistory.json:', error);
      return null;
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile('searchHistory.json', data, 'utf-8');
    } catch (error) {
      console.error('Error writing to searchHistory.json', error);
    }
  }

  // Get all cities from the seacrhHistory.json file
  public async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities || []; //return an empty array if null
  }

  // Add a city to the search history
  public async addCity(name: string): Promise<void> {
    const cities = await this.getCities();
    const newCity = new City(name); //create a new City object with a generated ID
    cities.push(newCity); // Add the new city to the  array
    await this.write(cities); // Write the updated array back to the file
  }

  // Remove a city from the search history by its id
  public async removeCity(id: string): Promise<void> {
    let cities = await this.getCities();
    cities = cities.filter(city => city.id !== id); // Filter out the city with the matching ID
    await this.write(cities); //write the updated array back to the file
  }

}

export default new HistoryService();

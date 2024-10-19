import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid'; // not sure if this is right


// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = uuidv4() ;
  }
}
// TODO: Complete the HistoryService class
//History Service class with async read method
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

  //Get all cities from the seacrhHistory.json file
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
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();

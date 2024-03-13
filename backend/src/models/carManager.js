// // Importing the AbstractManager class
const AbstractManager = require("./AbstractManager");

// Defining the CarManager class that extends AbstractManager
class CarManager extends AbstractManager {
  // Constructor initializes the class and sets the table name to "car"
  constructor() {
    // Calling the constructor of the parent class (AbstractManager) with the table name
    super({ table: "car" });
  }

  async readCar(id) {
    // Performing a database query to select all records from the charging station table
    const [rows] = await this.database.query(
      `select car.id,car_image,brand.model,brand.Marque,plug.type from ${this.table}
      JOIN brand ON car.brand_id = brand.id 
      JOIN plug ON car.plug_id = plug.id where car.user_id = ?`,
      [id]
    );
    // Returning all rows
    return rows;
  }
  async browseStatistics() {
    const [rows] = await this.database.query(`select id from ${this.table}`);
    return rows;
  }
}
module.exports = CarManager;

// Importing the AbstractManager class
const AbstractManager = require("./AbstractManager");

// Defining the chargingStationManager class that extends AbstractManager
class ChargingStationManager extends AbstractManager {
  // Constructor initializes the class and sets the table name to "charging_station"
  constructor() {
    // Calling the constructor of the parent class (AbstractManager) with the table name
    super({ table: "charging_station" });
  }
  async readAllPosition() {
    // Performing a database query to select all records from the charging station table
    const [rows] = await this.database
      .query(`select charging_station.consolidated_latitude,charging_station.consolidated_longitude,charging_station.id
    from ${this.table} WHERE prise_type_ef = "TRUE"OR prise_type_2 = "TRUE" OR prise_type_combo_ccs = "TRUE" OR prise_type_chademo = "TRUE" OR prise_type_autre = "TRUE" OR prise_type_ef = TRUE OR prise_type_2 = TRUE OR prise_type_combo_ccs = TRUE OR prise_type_chademo = TRUE OR prise_type_autre = TRUE
     `);
    return rows;
  }
  async readAllStatistic() {
    const [rows] = await this.database.query(`select id from ${this.table}`);
    return rows;
  }

  async readAll() {
    const [rows] = await this.database.query(`select *
from ${this.table}`);
    return rows;
  }
}

// Exporting the ChargingStationManager class
module.exports = ChargingStationManager;

// Importing the AbstractManager class
const AbstractManager = require("./AbstractManager");

// Defining the chargingStationManager class that extends AbstractManager
class contactManager extends AbstractManager {
  // Constructor initializes the class and sets the table name to "charging_station"
  constructor() {
    // Calling the constructor of the parent class (AbstractManager) with the table name
    super({ table: "contact" });
  }

  async readAllContactStatistic() {
    const [rows] = await this.database.query(
      `select id from ${this.table} WHERE answer ='' or answer is null;`
    );
    return rows;
  }
}

// Exporting the ChargingStationManager class
module.exports = contactManager;

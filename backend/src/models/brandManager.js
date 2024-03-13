// Importing the AbstractManager class
const AbstractManager = require("./AbstractManager");

// Defining the chargingStationManager class that extends AbstractManager
class brandManager extends AbstractManager {
  // Constructor initializes the class and sets the table name to "charging_station"
  constructor() {
    // Calling the constructor of the parent class (AbstractManager) with the table name
    super({ table: "brand" });
  }
}

// Exporting the ChargingStationManager class
module.exports = brandManager;

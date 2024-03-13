// // Importing the AbstractManager class
const AbstractManager = require("./AbstractManager");

// Defining the ReservaManager class that extends AbstractManager
class ReservaManager extends AbstractManager {
  // Constructor initializes the class and sets the table name to "reservation"
  constructor() {
    // Calling the constructor of the parent class (AbstractManager) with the table name
    super({ table: "user_has_charging_station" });
  }

  async readAllReservation() {
    // Performing a database query to select all records from the reservation table
    const [rows] = await this.database.query(
      `select id, user_id, charging_station_id,DATE_FORMAT(reservation_date, '%Y-%m-%d') AS reservation_date, reservation_heure, amount_paid from ${this.table}`
    );
    // Returning all rows
    return rows;
  }

  async readAllReservationStatistic() {
    const [rows] = await this.database.query(`select id from ${this.table}`);
    return rows;
  }
  async readReservation(id) {
    // Performing a database query to select a record with the given ID
    const [row] = await this.database.query(
      `select id, user_id, charging_station_id,DATE_FORMAT(reservation_date, '%Y-%m-%d') AS reservation_date, reservation_heure, amount_paid from ${this.table} where id = ?`,
      [id]
    );
    // Returning the first row (assuming there is only one result)
    return row[0];
  }

  async readReservationByUser(id) {
    const [row] = await this.database.query(
      `select user_has_charging_station.id, user_has_charging_station.user_id AS userId, user_has_charging_station.charging_station_id AS chargingStationId, DATE_FORMAT(reservation_date, '%Y-%m-%d') AS reservationDate, user_has_charging_station.reservation_heure AS reservationHeure, user_has_charging_station.amount_paid AS amountPaid, charging_station.nom_enseigne AS nomEnseigne from ${this.table} 
        inner join charging_station on charging_station.id = user_has_charging_station.charging_station_id
        where user_id = ?`,
      [id]
    );
    return row; // No need to access row[0] here
  }
}
module.exports = ReservaManager;

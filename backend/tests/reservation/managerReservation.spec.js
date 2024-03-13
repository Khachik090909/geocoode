const { database, tables } = require("../setup");
const { reservationCreate, reservationUpdate } = require("../testdata");

describe("Create Reservation", () => {
  it("should create an Reservation successfully", async () => {
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );
    const [rows] = await database.query(
      `select * from ${tables.user_has_charging_station.table} where id = ?`,
      [result]
    );
    expect(rows.length).toBe(1);
    return rows;
  });

  it("should read a charging Reservation successfully", async () => {
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );
    const [Reservation] = await database.query(
      `select * from ${tables.user_has_charging_station.table} where id = ?`,
      [result]
    );

    expect(Reservation[0].id).toEqual(result);
  });

  it("should update a charging Reservation successfully", async () => {
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );
    await tables.user_has_charging_station.edit(reservationUpdate, result);

    const [updatedReservation] = await database.query(
      `select * from ${tables.user_has_charging_station.table} where id = ?`,
      [result]
    );

    expect(updatedReservation.someProperty).toEqual(
      reservationUpdate.someProperty
    );
  });

  it("should delete a charging Reservation successfully", async () => {
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );
    await tables.user_has_charging_station.delete(result);
    const [deletedReservation] = await database.query(
      `select * from ${tables.user_has_charging_station.table} where id = ?`,
      [result]
    );

    expect(deletedReservation).toEqual([]);
  });
});

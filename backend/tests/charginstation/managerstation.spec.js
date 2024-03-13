// Import required dependencies
const { database, tables } = require("../setup");
const {
  chargingStationToCreate,
  chargingStationUpdateData,
} = require("../testdata");

let persistentData = {};
describe("Create station", () => {
  it("should create an station successfully", async () => {
    persistentData = await tables.charging_station.add(chargingStationToCreate);
    const [rows] = await database.query(
      `select * from ${tables.charging_station.table} where id = ?`,
      [persistentData]
    );
    expect(rows.length).toBe(1);
    return rows;
  });

  it("should read a charging station successfully", async () => {
    const [station] = await database.query(
      `select * from ${tables.charging_station.table} where id = ?`,
      [persistentData]
    );

    expect(station[0].id).toEqual(persistentData);
  });

  it("should update a charging station successfully", async () => {
    await tables.charging_station.edit(
      chargingStationUpdateData,
      persistentData
    );

    const [updatedStation] = await database.query(
      `select * from ${tables.charging_station.table} where id = ?`,
      [persistentData]
    );

    expect(updatedStation.someProperty).toEqual(
      chargingStationUpdateData.someProperty
    );
  });

  it("should delete a charging station successfully", async () => {
    await tables.charging_station.delete(persistentData);
    const [deletedStation] = await database.query(
      `select * from ${tables.charging_station.table} where id = ?`,
      [persistentData]
    );

    expect(deletedStation).toEqual([]);
  });
});

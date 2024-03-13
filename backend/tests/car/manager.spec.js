// Import required dependencies
const { database, tables } = require("../setup");
const { carCreate, carUpdate } = require("../testdata");

describe("Create Car", () => {
  it("should create an Car successfully", async () => {
    const result = await tables.car.add(carCreate);
    const [rows] = await database.query(
      `select * from ${tables.car.table} where id = ?`,
      [result]
    );
    expect(rows.length).toBe(1);
    return rows;
  });

  it("should read a charging Car successfully", async () => {
    const result = await tables.car.add(carCreate);
    const [Car] = await database.query(
      `select * from ${tables.car.table} where id = ?`,
      [result]
    );

    expect(Car[0].id).toEqual(result);
  });

  it("should update a charging Car successfully", async () => {
    const result = await tables.car.add(carCreate);
    await tables.car.edit(carUpdate, result);

    const [updatedCar] = await database.query(
      `select * from ${tables.car.table} where id = ?`,
      [result]
    );

    expect(updatedCar.someProperty).toEqual(carUpdate.someProperty);
  });

  it("should delete a charging Car successfully", async () => {
    const result = await tables.car.add(carCreate);
    await tables.car.delete(result);
    const [deletedCar] = await database.query(
      `select * from ${tables.car.table} where id = ?`,
      [result]
    );

    expect(deletedCar).toEqual([]);
  });
});

// Import required dependencies
const { database, tables } = require("../setup");
const {
  createUserWithHashedPassword,
  updateUserWithHashedPassword,
} = require("../testdata");

describe("Create user", () => {
  let persistentUser = {};

  it("should create an user successfully", async () => {
    const userCreate = await createUserWithHashedPassword();
    persistentUser = await tables.user.add(userCreate);
    const [rows] = await database.query(
      `select * from ${tables.user.table} where id = ?`,
      [persistentUser]
    );
    expect(rows.length).toBe(1);
    return rows;
  });

  it("should read a charging user successfully", async () => {
    const [user] = await database.query(
      `select * from ${tables.user.table} where id = ?`,
      [persistentUser]
    );

    expect(user[0].id).toEqual(persistentUser);
  });

  it("should update a charging user successfully", async () => {
    const userUpdate = await updateUserWithHashedPassword();
    await tables.user.edit(userUpdate, persistentUser);
    const [updateduser] = await database.query(
      `select * from ${tables.user.table} where id = ?`,
      [persistentUser]
    );

    expect(updateduser.someProperty).toEqual(userUpdate.someProperty);
  });

  it("should delete a charging user successfully", async () => {
    await tables.user.delete(persistentUser);
    const [deleteduser] = await database.query(
      `select * from ${tables.user.table} where id = ?`,
      [persistentUser]
    );

    expect(deleteduser).toEqual([]);
  });
});

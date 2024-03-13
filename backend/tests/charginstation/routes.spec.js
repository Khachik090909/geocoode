// Import required dependencies
const { app, request, tables } = require("../setup");
const {
  chargingStationToCreate,
  chargingStationUpdateData,
} = require("../testdata");

let persistentDatas = {};

// Test suite for the GET /api/items route
describe("GET /api/charging_station", () => {
  it("should fetch items successfully", async () => {
    // Create a sample item in the database
    persistentDatas = await tables.charging_station.add(
      chargingStationToCreate
    );

    // Send a GET request to the /api/items endpoint
    const response = await request(app).get("/api/charging-stations");
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    // Check if the created item is present in the response
    const foundItem = response.body.find((item) => item.id === persistentDatas);

    // Assertions
    expect(foundItem).toBeInstanceOf(Object);
  });
});

// Test suite for the GET /api/items/:id route
describe("GET /api/charging_stations/:id", () => {
  it("should fetch a single item successfully", async () => {
    // Send a GET request to the /api/items/:id endpoint
    const response = await request(app).get(
      `/api/charging-stations/${persistentDatas}`
    );

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(persistentDatas);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should return 404 for non-existent item", async () => {
    // Send a GET request to the /api/items/:id endpoint with an invalid ID
    const response = await request(app).get("/api/charging-stations/0");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// Test suite for the POST /api/items route
// Doesn't pass: maybe something to change in app config :/
// Hint: enabling log could help ;)
describe("POST /api/charging_stations", () => {
  it("should add a new item successfully", async () => {
    // Send a POST request to the /api/items endpoint with a test item
    const response = await request(app)
      .post("/api/charging-stations")
      .send(chargingStationToCreate);

    // Assertions
    expect(response.status).toBe(201);
    // expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual(expect.any(Number));

    // Check if the newly added item exists in the database
    const foundItem = await tables.charging_station.read(response.body);

    // Assertions
    expect(foundItem).toBeDefined();
  });
});

// // TODO: implement PUT and DELETE routes

// // Test suite for the PUT /api/items/:id route
describe("PUT /api/charging-stations/:id", () => {
  it("should update an existing item successfully", async () => {
    // Send a PUT request to the /api/items/:id endpoint with updated data
    const response = await request(app)
      .put(`/api/charging-stations/${persistentDatas}`)
      .send(chargingStationUpdateData);

    // Assertions
    expect(response.status).toBe(204);

    // Check if the item has been updated in the database
    const foundItem = await tables.charging_station.read(persistentDatas);

    delete foundItem.id;

    // Assertions
    expect(foundItem).toBeDefined();
    expect(foundItem).toEqual(chargingStationUpdateData);
  });
});

// // Test suite for the DELETE /api/items/:id route
describe("DELETE /api/charging_stations/:id", () => {
  it("should delete an existing item successfully", async () => {
    // Send a DELETE request to the /api/items/:id endpoint
    const response = await request(app).delete(
      `/api/charging-stations/${persistentDatas}`
    );

    // Assertions
    expect(response.status).toBe(204);

    // Check if the item has been deleted from the database
    const foundItem = await tables.charging_station.read(persistentDatas);

    // Assertions
    expect(foundItem).toBeUndefined();
    persistentDatas = "";
  });
});

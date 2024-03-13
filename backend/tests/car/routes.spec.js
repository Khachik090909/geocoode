// Import required dependencies
const { app, request, tables } = require("../setup");
const { carCreate, carUpdate, carKeys } = require("../testdata");
const { validateTableProperties, findTable } = require("../utils");

// Test suite for the GET /api/cars route

describe("GET /api/cars", () => {
  it("should fetch cars successfully", async () => {
    // Create a sample car in the database
    const insertedId = await tables.car.add(carCreate);

    // Send a GET request to the /api/cars endpoint
    const response = await request(app).get("/api/cars");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // Validation plus détaillée de la réponse
    const cars = response.body;
    expect(cars.length).toBeGreaterThan(0);

    cars.forEach((car) => validateTableProperties(car, carKeys));

    const foundCar = findTable(cars, {
      ...carCreate,
      id: insertedId,
    });
    // Assertions
    expect(foundCar).toBeDefined();
  });
});

// Test suite for the GET /api/cars/:id route
describe("GET /api/cars/:id", () => {
  let sampleCar;
  beforeAll(async () => {
    // Créer une voiture de test pour le test
    const result = await tables.car.add(carCreate);
    sampleCar = await tables.car.read(result);
  });
  it("should fetch a single cars successfully", async () => {
    // Envoyer une requête GET à l'endpoint /api/cars/:id avec l'ID de la voiture de test
    const response = await request(app).get(`/api/cars/${sampleCar.id}`);
    // Assertions

    expect(response.status).toBe(200);

    const returnedCar = response.body;

    expect(returnedCar).toEqual(sampleCar);
  });

  it("should return 404 for non-existent cars", async () => {
    // Send a GET request to the /api/cars/:id endpoint with an invalid ID
    const response = await request(app).get("/api/cars/0");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// // Test suite for the POST /api/cars route
// Doesn't pass: maybe something to change in app config :/
// Hint: enabling log could help ;)
describe("POST /api/cars", () => {
  it("should add a new cars successfully", async () => {
    // Send a POST request to the /api/cars endpoint with a test car
    const response = await request(app).post("/api/cars").send(carCreate);
    // Assertions
    expect(response.status).toBe(201);
    // expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual(expect.any(Number));

    // Check if the newly added car exists in the database
    const foundCar = await tables.car.read(response.body);

    // Assertions
    expect(foundCar).toBeDefined();
    expect(foundCar).toEqual(expect.objectContaining(carCreate));
  });
});

// // // TODO: implement PUT and DELETE routes

// // // Test suite for the PUT /api/cars/:id route
describe("PUT /api/cars/:id", () => {
  it("should update an existing cars successfully", async () => {
    // Send a PUT request to the /api/cars/:id endpoint with updated data
    const result = await tables.car.add(carCreate);
    const id = result;
    const response = await request(app).put(`/api/cars/${id}`).send(carUpdate);
    // Assertions
    expect(response.status).toBe(204);

    // Check if the car has been updated in the database
    const foundCar = await tables.car.read(id);

    // Assertions
    expect(foundCar).toBeDefined();
    expect(foundCar).toEqual(expect.objectContaining(carUpdate));
  });
});

// // // Test suite for the DELETE /api/cars/:id route
describe("DELETE /api/cars/:id", () => {
  it("should delete an existing cars successfully", async () => {
    // Send a DELETE request to the /api/cars/:id endpoint
    const result = await tables.car.add(carCreate);
    const id = result;
    const response = await request(app).delete(`/api/cars/${id}`);

    // Assertions
    expect(response.status).toBe(204);

    // Check if the car has been deleted from the database
    const foundcar = await tables.car.read(id);

    // Assertions
    expect(foundcar).toBeUndefined();
  });
  it("should return 404 for non-existent cars", async () => {
    // Envoyer une requête DELETE à l'endpoint /api/cars/:id avec un ID qui n'existe pas
    const response = await request(app).delete("/api/cars/0");

    // Assertions
    expect(response.status).toBe(404);
  });
});

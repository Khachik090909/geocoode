// Import required dependencies
const { app, request, tables } = require("../setup");
const { reservationCreate, reservationUpdate } = require("../testdata");

// Test suite for the GET /api/reservations route

describe("GET /api/reservations", () => {
  it("should fetch reservations successfully", async () => {
    // Create a sample reservation in the database
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );
    const response = await request(app).get("/api/reservations");
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // Check if the created user is present in the response
    const foundUser = response.body.find(
      (reservation) => reservation.id === result
    );
    // Assertions
    expect(foundUser).toBeInstanceOf(Object);
  });
});

// Test suite for the GET /api/reservations/:id route
describe("GET /api/reservations/:id", () => {
  let sampleReservation;
  beforeAll(async () => {
    // Créer une voiture de test pour le test
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );
    sampleReservation = await tables.user_has_charging_station.readReservation(
      result
    );
  });
  it("should fetch a single reservations successfully", async () => {
    // Envoyer une requête GET à l'endpoint /api/reservations/:id avec l'ID de la voiture de test
    const response = await request(app).get(
      `/api/reservations/${sampleReservation.id}`
    );
    // Assertions

    expect(response.status).toBe(200);

    const returnedReservation = response.body;

    expect(returnedReservation).toEqual(sampleReservation);
  });

  it("should return 404 for non-existent reservations", async () => {
    // Send a GET request to the /api/reservations/:id endpoint with an invalid ID
    const response = await request(app).get("/api/reservations/0");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// Test suite for the POST /api/reservations route
// // Doesn't pass: maybe something to change in app config :/
// // Hint: enabling log could help ;)
describe("POST /api/reservations", () => {
  it("should add a new reservations successfully", async () => {
    // Send a POST request to the /api/reservations endpoint with a test reservation
    const response = await request(app)
      .post("/api/reservations")
      .send(reservationCreate);

    // Assertions
    expect(response.status).toBe(201);
    // expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual(expect.any(Number));

    // Check if the newly added reservation exists in the database
    const foundReservation =
      await tables.user_has_charging_station.readReservation(response.body);

    // Assertions
    expect(foundReservation).toBeDefined();
    expect(foundReservation).toEqual(
      expect.objectContaining(reservationCreate)
    );
  });
});

// // // // TODO: implement PUT and DELETE routes

// // // // Test suite for the PUT /api/reservations/:id route
describe("PUT /api/reservations/:id", () => {
  it("should update an existing reservations successfully", async () => {
    // Send a PUT request to the /api/reservations/:id endpoint with updated data
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );
    const id = result;
    const response = await request(app)
      .put(`/api/reservations/${id}`)
      .send(reservationUpdate);
    // Assertions
    expect(response.status).toBe(204);

    // Check if the reservation has been updated in the database
    const foundReservation =
      await tables.user_has_charging_station.readReservation(id);

    // Assertions
    expect(foundReservation).toBeDefined();
    expect(foundReservation).toEqual(
      expect.objectContaining(reservationUpdate)
    );
  });
});

// // // // Test suite for the DELETE /api/reservations/:id route
describe("DELETE /api/reservations/:id", () => {
  it("should delete an existing reservations successfully", async () => {
    // Send a DELETE request to the /api/reservations/:id endpoint
    const result = await tables.user_has_charging_station.add(
      reservationCreate
    );

    const id = result;
    const response = await request(app).delete(`/api/reservations/${id}`);

    // Assertions
    expect(response.status).toBe(204);

    // Check if the reservation has been deleted from the database
    const foundReservation =
      await tables.user_has_charging_station.readReservation(id);

    // Assertions
    expect(foundReservation).toBeUndefined();
  });
  it("should return 404 for non-existent reservations", async () => {
    // Envoyer une requête DELETE à l'endpoint /api/reservations/:id avec un ID qui n'existe pas
    const response = await request(app).delete("/api/reservations/0");

    // Assertions
    expect(response.status).toBe(404);
  });
});

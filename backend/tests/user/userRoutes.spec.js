// Import required dependencies
const { app, request, tables } = require("../setup");
const {
  createUserWithHashedPassword,
  userUpdate,
  userCreate,
} = require("../testdata");

let token = {};
let insertedId = {};

// Test suite for the GET /api/users route

describe("GET /api/users", () => {
  it("should fetch users successfully", async () => {
    // Log user
    const newUser = await createUserWithHashedPassword();

    insertedId = await tables.user.add(newUser);

    token = await request(app).post("/api/users/login").send({
      email: "wXnJt@examplexs.com",
      password: "1234567890",
    });

    // Send a GET request to the /api/users endpoint
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token.body.token}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // Check if the created user is present in the response
    const foundUser = response.body.find((user) => user.id === insertedId);
    // Assertions
    expect(foundUser).toBeInstanceOf(Object);
  });
});

// Test suite for the GET /api/users/:id route
describe("GET /api/users/:id", () => {
  let sampleUser;
  beforeAll(async () => {
    sampleUser = await tables.user.readUser(insertedId);
  });
  it("should fetch a single user successfully", async () => {
    // Envoyer une requête GET à l'endpoint /api/users/:id avec l'ID de la voiture de test
    const response = await request(app)
      .get(`/api/users/${sampleUser.id}`)
      .set("Authorization", `Bearer ${token.body.token}`);
    // Assertions

    expect(response.status).toBe(200);

    const returnedUser = response.body;

    expect(returnedUser).toEqual(sampleUser);
  });

  it("should return 404 for non-existent user", async () => {
    // Send a GET request to the /api/users/:id endpoint with an invalid ID
    const response = await request(app)
      .get("/api/users/0")
      .set("Authorization", `Bearer ${token.body.token}`);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// Test suite for the POST /api/users route
describe("POST /api/users", () => {
  it("should add a new users successfully", async () => {
    const userCreatePassword = await { ...userCreate, password: "1234567890" };
    // Send a POST request to the /api/users endpoint with a test user
    const response = await request(app)
      .post("/api/users")
      .send(userCreatePassword);

    // Assertions
    expect(response.status).toBe(201);
    // expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual(expect.any(Number));

    // Check if the newly added user exists in the database
    const foundUser = await tables.user.readUser(response.body);
    delete foundUser.hashed_password;
    delete foundUser.id;
    // Assertions
    expect(foundUser).toBeDefined();
    expect(foundUser).toEqual(expect.objectContaining(userCreate));
  });
});

// Test suite for the PUT /api/users/:id route
describe("PUT /api/users/:id", () => {
  it("should update an existing users successfully", async () => {
    // Send a PUT request to the /api/users/:id endpoint with updated data
    const userUpdatePassword = await {
      ...userUpdate,
      password: "1234567890",
    };
    const response = await request(app)
      .put(`/api/users/${insertedId}`)
      .send(userUpdatePassword)
      .set("Authorization", `Bearer ${token.body.token}`);
    // Assertions
    expect(response.status).toBe(204);

    // Check if the user has been updated in the database
    const foundUser = await tables.user.readUser(insertedId);
    delete foundUser.hashed_password;
    delete foundUser.id;
    // Assertions
    expect(foundUser).toBeDefined();
    expect(foundUser).toEqual(expect.objectContaining(userUpdate));
  });
});

// Test suite for the DELETE /api/users/:id route
describe("DELETE /api/users/:id", () => {
  it("should delete an existing users successfully", async () => {
    // Send a DELETE request to the /api/users/:id endpoint

    const response = await request(app)
      .delete(`/api/users/${insertedId}`)
      .set("Authorization", `Bearer ${token.body.token}`);

    // Assertions
    expect(response.status).toBe(204);

    // Check if the user has been deleted from the database
    const foundUser = await tables.user.readUser(insertedId);

    // Assertions
    expect(foundUser).toBeUndefined();
  });
  it("should return 404 for non-existent users", async () => {
    // Envoyer une requête DELETE à l'endpoint /api/users/:id avec un ID qui n'existe pas
    const response = await request(app)
      .delete("/api/users/0")
      .set("Authorization", `Bearer ${token.body.token}`);

    // Assertions
    expect(response.status).toBe(404);
  });
});

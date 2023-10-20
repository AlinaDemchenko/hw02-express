const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app");
const gravatar = require("gravatar");
const { User } = require("../models/user");

const { DB_HOST_TEST, PORT } = process.env;

describe("test route", () => {
  let server = null;
  beforeAll(async () => {
    server = app.listen(PORT);
    await mongoose.connect(DB_HOST_TEST);
  });
  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });
  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test login route", async () => {
    const password = await bcrypt.hash("qwertyuio", 10);
    const avatarURL = gravatar.url("test@example.com");

    const newUser = {
      email: "test@example.com",
      password,
      subscription: "starter",
      avatarURL,
    };
   const user = await User.create(newUser);
    const loginUser = {
      email: "test@example.com",
      password: "qwertyuio"
    };
    const res = await request(app).post("api/users/login").send(loginUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    const {token} = await User.findById(user._id);
    expect(res.body.token).toBe(token);
  });
});

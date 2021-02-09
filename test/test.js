const request = require("supertest");
const app = require("../index");
describe("GET /", () => {
  it("respond with Hello World", (done) => {
    request(app).get("/").expect("if you can see this, you're really awesome", done);
  })
});
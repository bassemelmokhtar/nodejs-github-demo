const request = require("supertest");
const app = require("../index");
describe("GET /", () => {
  it("respond with Hello World", (done) => {
    request(app).get("/").expect("If you can see this, the deployment pipeline is working :)", done);
  })
});
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

beforeAll(async () => {
  await mongoose.connect("mongodb://mongo-db:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

afterAll(async () => {
  await removeAllCollections();
});

describe("Test purchase endpoint => POST /api/v1/purchase", () => {
  const payload = {
    quantity: 2,
    product: {
      title: "Scrubbing sponges",
    },
  };
  it("Should create a new purchase order", function (done) {
    request(app)
      .post("/api/v1/purchase")
      .set("Content-Type", "application/json")
      .send(payload)
      .expect(200)
      .then((response) => {
        expect(response.body.data.dueDate).toBeDefined();
        expect(response.body.data._id).toBeDefined();
        expect(response.body.data.isExecuted).toBeTruthy();
        expect(response.body.data.quantity).toEqual(payload.quantity);
        expect(response.body.data.product).toBeDefined();
        expect(response.body.data.orderType).toEqual("Purchase");
        done();
      });
  });
});

describe("Test sale endpoint => POST /api/v1/sale", () => {
  const payload = {
    quantity: 1,
    product: {
      title: "Scrubbing sponges",
    },
  };
  it("Should create a new sale order", function (done) {
    request(app)
      .post("/api/v1/sale")
      .set("Content-Type", "application/json")
      .send(payload)
      .expect(200)
      .then((response) => {
        expect(response.body.data.dueDate).toBeDefined();
        expect(response.body.data._id).toBeDefined();
        expect(response.body.data.isExecuted).toBeTruthy();
        expect(response.body.data.quantity).toEqual(payload.quantity);
        expect(response.body.data.product).toBeDefined();
        expect(response.body.data.orderType).toEqual("Sale");
        done();
      });
  });
});

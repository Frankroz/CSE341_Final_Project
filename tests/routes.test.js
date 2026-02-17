const request = require("supertest");
const express = require("express");
const router = require("../routes/index");
const mongodb = require("../data/database");

// 1. Mock the database connection
jest.mock("../data/database", () => ({
  getDb: jest.fn().mockReturnValue({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
        findOne: jest.fn().mockResolvedValue({}),
      }),
    }),
  }),
}));

// 2. Mock Authentication to always pass
jest.mock("../middleware/auth", () => ({
  isAuthenticated: (req, res, next) => {
    req.user = { _id: "6981c87064967cbac0fdd278", displayName: "Test User" };
    next();
  },
}));

// 3. Mock Validations to avoid "TypeError: argument handler must be a function"
jest.mock("../middleware/validate", () => ({
  recipeValidation: () => (req, res, next) => next(),
  mealPlanValidation: () => (req, res, next) => next(),
  groceryListValidation: () => (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
// Mock session middleware for routes that check req.session
app.use((req, res, next) => {
  req.user = { _id: "6981c87064967cbac0fdd278", displayName: "Test User" };
  next();
});
app.use("/", router);

describe("MealPlanner API GET Routes", () => {
  // --- RECIPES ---
  describe("Recipes Endpoints", () => {
    it("GET /recipes should return all recipes", async () => {
      const res = await request(app).get("/recipes");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("GET /recipes/:id should return a recipe object", async () => {
      const res = await request(app).get("/recipes/6981cc4b459bfb29ae444596");
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body).toBe("object");
    });
  });

  // --- INGREDIENTS ---
  describe("Ingredients Endpoints", () => {
    it("GET /ingredients should return all ingredients", async () => {
      const res = await request(app).get("/ingredients");
      expect(res.statusCode).toEqual(200);
    });
  });

  // --- MEAL PLANS ---
  describe("MealPlans Endpoints", () => {
    it("GET /mealplans should return user's meal plans", async () => {
      const res = await request(app).get("/mealplans");
      expect(res.statusCode).toEqual(200);
    });

    it("GET /mealplans/:id should return a specific meal plan", async () => {
      const res = await request(app).get("/mealplans/699464db374d676c63551c4f");
      expect(res.statusCode).toEqual(200);
    });
  });

  // --- GROCERY LISTS ---
  describe("GroceryLists Endpoints", () => {
    it("GET /grocerylists should return all lists for the user", async () => {
      const res = await request(app).get("/grocerylists");
      expect(res.statusCode).toEqual(200);
    });

    it("GET /grocerylists/:id should return a single grocery list", async () => {
      const res = await request(app).get(
        "/grocerylists/69945029f5e1eb657f800890",
      );
      expect(res.statusCode).toEqual(200);
    });
  });
});

const router = require("express").Router();
const controller = require("../controllers/mealplan");
const { isAuthenticated } = require("../middleware/auth");
const { mealPlanValidation } = require("../middleware/validate");

router.get("/", isAuthenticated, controller.getUserMealPlans);
router.post("/", isAuthenticated, mealPlanValidation, controller.createMealPlan);
router.put("/:id", isAuthenticated, mealPlanValidation, controller.updateMealPlan);
router.delete("/:id", isAuthenticated, controller.deleteMealPlan);

module.exports = router;

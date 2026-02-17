const router = require("express").Router();
const controller = require("../controllers/recipe");
const { isAuthenticated } = require("../middleware/auth");
const { recipeValidation } = require("../middleware/validate");

router.get("/", controller.getAllRecipes);
router.get("/:id", controller.getRecipesById);
router.post("/", isAuthenticated, recipeValidation(), controller.createRecipe);
router.put("/:id", isAuthenticated, recipeValidation(), controller.updateRecipe);
router.delete("/:id", isAuthenticated, controller.deleteRecipe);

module.exports = router;

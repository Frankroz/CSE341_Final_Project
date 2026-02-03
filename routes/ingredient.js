const router = require("express").Router();
const controller = require("../controllers/ingredient");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", controller.getAll);

router.post("/", isAuthenticated, controller.createIngredient);
router.delete("/:id", isAuthenticated, controller.deleteIngredient);

module.exports = router;

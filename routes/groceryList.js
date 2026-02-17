const router = require("express").Router();
const controller = require("../controllers/groceryList");
const { isAuthenticated } = require("../middleware/auth");
const { groceryListValidation } = require("../middleware/validate");

router.get("/", isAuthenticated, controller.getAll);
router.get("/:id", isAuthenticated, controller.getSingle);
router.post("/", isAuthenticated, groceryListValidation(), controller.createList);
router.put(
  "/:id",
  isAuthenticated,
  groceryListValidation(),
  controller.updateList,
);
router.delete("/:id", isAuthenticated, controller.deleteList);

module.exports = router;

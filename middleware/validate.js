const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

const recipeValidation = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("instructions").notEmpty().withMessage("Instructions are required"),
    body("ingredients")
      .isArray({ min: 1 })
      .withMessage("Ingredients must be an array with at least one item"),
    validate,
  ];
};

const mealPlanValidation = () => {
  return [
    body("weekNumber").isNumeric().withMessage("Week number must be a number"),
    body("schedule").isArray().withMessage("Schedule must be an array"),
    validate,
  ];
};

const groceryListValidation = () => {
  return [
    body("listName").notEmpty().withMessage("List name is required"),
    body("weekNumber").isNumeric().withMessage("Week number must be a number"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("Items must be an array and cannot be empty"),
    body("items.*.name").notEmpty().withMessage("Each item must have a name"),
    validate,
  ];
};

module.exports = {
  recipeValidation,
  mealPlanValidation,
  groceryListValidation,
};

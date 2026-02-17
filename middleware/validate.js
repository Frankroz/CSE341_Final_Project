const { body, validationResult } = require('express-validator');

const recipeValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('instructions').notEmpty(),
    body('ingredients').isArray({ min: 1 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

const mealPlanValidation = [
    body('weekNumber').isNumeric().withMessage('Week number must be a number'),
    body('schedule').isArray(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

const groceryListValidation = [
    body('listName').notEmpty().withMessage('List name is required'),
    body('weekNumber').isNumeric().withMessage('Week number must be a number'),
    body('items').isArray({ min: 1 }).withMessage('Items must be an array and cannot be empty'),
    body('items.*.name').notEmpty().withMessage('Each item must have a name'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { recipeValidation, mealPlanValidation, groceryListValidation };
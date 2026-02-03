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

module.exports = { recipeValidation, mealPlanValidation };
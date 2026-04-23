import { body, validationResult } from 'express-validator'


//parsing provider form data
export const parseProviderData = (req, res, next) => {
    try {
        Object.assign(req.body, JSON.parse(req.body.data));
        next();
    } catch {
        res.status(400).json({ error: 'Malformed request data' });
    }
};

//validate provider fields from body
export const providerRules = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 chars'),

    body('email').trim().isEmail().withMessage('Valid email required')
        .normalizeEmail(),

    body('password').isLength({ min: 8 }).withMessage('Min 8 characters'),

    body('area').trim().notEmpty().withMessage('Area is required'),

    body('bio').optional().isLength({ max: 500 }).withMessage('Max 500 chars'),

    body('services').isArray({ min: 1 }).withMessage('At least one service required'),

];

export const userRules = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 chars'),

    body('email').trim().isEmail().withMessage('Valid email required')
        .normalizeEmail(),

    body('phone').trim().notEmpty().withMessage('Phone is required'),

    body('password').isLength({ min: 8 }).withMessage('Min 8 characters'),

    body('address.area').trim().notEmpty().withMessage('Area is required'),

    body('address.street').trim().notEmpty().withMessage('Street is required'),

    body('address.landmark').optional().trim(),

];

//checking errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};
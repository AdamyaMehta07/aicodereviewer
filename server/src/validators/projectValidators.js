import { body } from 'express-validator';

export const projectValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),

  body('githubUrl')
    .trim()
    .notEmpty().withMessage('GitHub URL is required')
    .matches(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/)
    .withMessage('Enter a valid GitHub repository URL (https://github.com/username/repo)'),

  body('techStack')
    .notEmpty().withMessage('Tech stack is required'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data/ML', 'Other'])
    .withMessage('Invalid category'),
];

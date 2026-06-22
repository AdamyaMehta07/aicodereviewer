import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ── Register ──────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered. Please log in.', 400);
    }

    // Create user (password is hashed in pre-save hook)
    const user = await User.create({ name, email, password });

    // Create empty portfolio for user
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + user._id.toString().slice(-4);
    await Portfolio.create({ userId: user._id, publicSlug: slug });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(
      res,
      { user, token },
      'Account created successfully.',
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Login ─────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password (select: false by default so we add it back)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    return successResponse(res, { user, token }, 'Logged in successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Get current user ──────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, { user }, 'User fetched successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Update profile ────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, role },
      { new: true, runValidators: true }
    );

    return successResponse(res, { user }, 'Profile updated successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ── Change password ───────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect.', 400);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, null, 'Password changed successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

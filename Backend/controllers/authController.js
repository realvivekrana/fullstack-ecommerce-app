import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';
import sendTokenResponse from '../utils/sendTokenResponse.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone });

  sendTokenResponse(user, 201, res, 'Account created successfully');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Logout user (clears auth cookie)
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  sendResponse(res, 200, null, 'Logged out successfully');
});

// @desc    Get current logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendResponse(res, 200, user, 'Profile fetched successfully');
});

// @desc    Update current user's profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  const updatedUser = await user.save();

  sendResponse(res, 200, updatedUser, 'Profile updated successfully');
});

// @desc    Add a new address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;

  if (isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  // First address added is automatically the default
  const shouldBeDefault = isDefault || user.addresses.length === 0;

  user.addresses.push({ label, fullName, phone, line1, line2, city, state, pincode, isDefault: shouldBeDefault });
  await user.save();

  sendResponse(res, 201, user.addresses, 'Address added successfully');
});

// @desc    Update an existing address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;

  if (isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, {
    ...(label !== undefined && { label }),
    ...(fullName !== undefined && { fullName }),
    ...(phone !== undefined && { phone }),
    ...(line1 !== undefined && { line1 }),
    ...(line2 !== undefined && { line2 }),
    ...(city !== undefined && { city }),
    ...(state !== undefined && { state }),
    ...(pincode !== undefined && { pincode }),
    ...(isDefault !== undefined && { isDefault }),
  });

  await user.save();

  sendResponse(res, 200, user.addresses, 'Address updated successfully');
});

// @desc    Delete an address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  const wasDefault = address.isDefault;
  address.deleteOne();

  // Promote another address to default if the deleted one was the default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  sendResponse(res, 200, user.addresses, 'Address deleted successfully');
});
const User = require('../models/User');
const Task = require('../models/Task');

/**
 * @desc    Get all users
 * @route   GET /api/v1/admin/users
 * @access  Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle user active status
 * @route   PATCH /api/v1/admin/users/:id/toggle
 * @access  Admin
 */
const toggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get dashboard stats
 * @route   GET /api/v1/admin/stats
 * @access  Admin
 */
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTasks, tasksByStatus] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({
      success: true,
      data: { totalUsers, totalTasks, tasksByStatus },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, toggleUser, getStats };

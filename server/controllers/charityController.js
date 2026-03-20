import Charity from "../models/Charity.js";
import User from "../models/User.js";

// @desc    Get all active charities
// @route   GET /api/charities
// @access  Public or Private (Let's make it Private so only logged-in users see them)
export const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ isActive: true });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching charities" });
  }
};

// @desc    Update user's selected charity & percentage
// @route   PUT /api/charities/select
// @access  Private
export const updateUserCharity = async (req, res) => {
  const { charityId, contributionPercentage } = req.body;

  if (contributionPercentage < 10) {
    return res.status(400).json({ message: "Minimum contribution is 10%" });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.charityPreferences.selectedCharity = charityId;
    user.charityPreferences.contributionPercentage = contributionPercentage;

    await user.save();

    res.json({
      message: "Charity preferences updated successfully",
      charityPreferences: user.charityPreferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating charity" });
  }
};

// @desc    Create a new charity (Temp Admin Route for seeding your database)
// @route   POST /api/charities
// @access  Private
export const createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json(charity);
  } catch (error) {
    res.status(500).json({ message: "Error creating charity" });
  }
};

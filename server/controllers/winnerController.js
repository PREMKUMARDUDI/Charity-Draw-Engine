import Winner from "../models/Winner.js";

// @desc    Get logged-in user's winnings
// @route   GET /api/winners/my-winnings
// @access  Private
export const getUserWinnings = async (req, res) => {
  try {
    const winnings = await Winner.find({ user: req.user._id })
      .populate("draw", "drawMonth winningNumbers")
      .sort({ createdAt: -1 });
    res.json(winnings);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching winnings" });
  }
};

// @desc    User submits proof of score (Screenshot URL)
// @route   PUT /api/winners/:id/proof
// @access  Private
export const submitProof = async (req, res) => {
  const { proofImageUrl } = req.body;

  if (!proofImageUrl) {
    return res.status(400).json({ message: "Please provide an image URL" });
  }

  try {
    const winner = await Winner.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!winner) {
      return res.status(404).json({ message: "Winning record not found" });
    }

    winner.verification.proofImageUrl = proofImageUrl;
    winner.verification.status = "under_review";

    const updatedWinner = await winner.save();
    res.json(updatedWinner);
  } catch (error) {
    res.status(500).json({ message: "Server error submitting proof" });
  }
};

// @desc    Get all winners for admin review
// @route   GET /api/winners
// @access  Private/Admin
export const getAdminWinners = async (req, res) => {
  try {
    const winners = await Winner.find({})
      .populate("user", "name email")
      .populate("draw", "drawMonth")
      .sort({ createdAt: -1 });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching admin winners" });
  }
};

// @desc    Admin updates verification and payment status
// @route   PUT /api/winners/:id/status
// @access  Private/Admin
export const updateWinnerStatus = async (req, res) => {
  const { verificationStatus, paymentStatus } = req.body;

  try {
    const winner = await Winner.findById(req.params.id);

    if (!winner) {
      return res.status(404).json({ message: "Winning record not found" });
    }

    if (verificationStatus) winner.verification.status = verificationStatus;
    if (paymentStatus) winner.paymentStatus = paymentStatus;

    const updatedWinner = await winner.save();
    res.json(updatedWinner);
  } catch (error) {
    res.status(500).json({ message: "Server error updating winner status" });
  }
};

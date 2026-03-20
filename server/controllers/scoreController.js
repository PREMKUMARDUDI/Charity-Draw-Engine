import Score from "../models/Score.js";

// @desc    Add a new score and enforce the Rolling 5 rule
// @route   POST /api/scores
// @access  Private
export const addScore = async (req, res) => {
  const { value, datePlayed } = req.body;

  // 1. Validate Input
  if (!value || value < 1 || value > 45) {
    return res.status(400).json({ message: "Score must be between 1 and 45" });
  }

  try {
    // 2. Create the new score
    await Score.create({
      user: req.user._id,
      value,
      datePlayed: datePlayed || Date.now(),
    });

    // 3. Enforce the "Rolling 5" Logic
    // Find all scores for this user, sorted by date (oldest first)
    const userScores = await Score.find({ user: req.user._id }).sort({
      datePlayed: 1,
    });

    // If there are more than 5 scores, delete the oldest one(s)
    if (userScores.length > 5) {
      const scoresToDelete = userScores.length - 5;

      // Get the IDs of the oldest scores
      const oldScoreIds = userScores
        .slice(0, scoresToDelete)
        .map((score) => score._id);

      // Delete them from the database
      await Score.deleteMany({ _id: { $in: oldScoreIds } });
    }

    // 4. Return the updated list (newest first, as requested by PRD)
    const updatedScores = await Score.find({ user: req.user._id }).sort({
      datePlayed: -1,
    });

    res.status(201).json(updatedScores);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Server error while adding score",
        error: error.message,
      });
  }
};

// @desc    Get user's latest scores
// @route   GET /api/scores
// @access  Private
export const getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({
      datePlayed: -1,
    });
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching scores" });
  }
};

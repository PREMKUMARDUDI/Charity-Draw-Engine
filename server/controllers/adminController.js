import { executeMonthlyDraw } from "../services/drawEngine.js";

// @desc    Run the monthly draw simulation (Admin only)
// @route   POST /api/admin/run-draw
// @access  Private/Admin
export const runDraw = async (req, res) => {
  try {
    const drawResults = await executeMonthlyDraw();

    // In a full production app, you would save these results to a `DrawHistory` collection here
    // before returning them to the admin dashboard.

    res.status(200).json({
      success: true,
      message: "Draw executed successfully",
      data: drawResults,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error executing draw", error: error.message });
  }
};

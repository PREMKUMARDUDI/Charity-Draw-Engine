import User from "../models/User.js";
import Score from "../models/Score.js";
import Draw from "../models/Draw.js";
import Winner from "../models/Winner.js";

export const executeMonthlyDraw = async () => {
  // 1. Generate 5 random winning numbers (Testing range: 1-20)
  const winningNumbers = [];
  while (winningNumbers.length < 5) {
    let r = Math.floor(Math.random() * 20) + 1;
    if (winningNumbers.indexOf(r) === -1) winningNumbers.push(r);
  }

  // 2. Fetch ACTIVE subscribers
  const activeUsers = await User.find({ "subscription.status": "active" });
  const totalSubscribers = activeUsers.length;

  // 3. Define the financial pools
  const totalRevenue = totalSubscribers * 10;
  const totalPrizePool = totalRevenue * 0.5;

  const prizeTiers = {
    match5: totalPrizePool * 0.4,
    match4: totalPrizePool * 0.35,
    match3: totalPrizePool * 0.25,
  };

  const winners = { match5: [], match4: [], match3: [] };

  // 4. Evaluate each user's latest 5 scores
  for (const user of activeUsers) {
    const userScores = await Score.find({ user: user._id })
      .sort({ datePlayed: -1 })
      .limit(5);

    const scoreValues = userScores.map((s) => s.value);
    const matches = scoreValues.filter((score) =>
      winningNumbers.includes(score),
    ).length;

    if (matches === 5) winners.match5.push(user._id);
    if (matches === 4) winners.match4.push(user._id);
    if (matches === 3) winners.match3.push(user._id);
  }

  // 5. Calculate payout per user
  const payouts = {
    match5PerUser:
      winners.match5.length > 0 ? prizeTiers.match5 / winners.match5.length : 0,
    match4PerUser:
      winners.match4.length > 0 ? prizeTiers.match4 / winners.match4.length : 0,
    match3PerUser:
      winners.match3.length > 0 ? prizeTiers.match3 / winners.match3.length : 0,
  };

  // ==========================================
  // THE MISSING LOGIC: SAVE TO MONGODB
  // ==========================================

  // A. Save the Draw Record
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const newDraw = await Draw.create({
    drawMonth: currentMonth,
    winningNumbers,
    status: "published",
    financials: {
      totalPrizePool,
      match5PayoutPerUser: payouts.match5PerUser,
      match4PayoutPerUser: payouts.match4PerUser,
      match3PayoutPerUser: payouts.match3PerUser,
      rolledOverAmount: winners.match5.length === 0 ? prizeTiers.match5 : 0,
    },
  });

  // B. Save the Winner Records
  const winnerDocs = [];

  winners.match5.forEach((userId) =>
    winnerDocs.push({
      user: userId,
      draw: newDraw._id,
      matchTier: 5,
      prizeAmount: payouts.match5PerUser,
    }),
  );
  winners.match4.forEach((userId) =>
    winnerDocs.push({
      user: userId,
      draw: newDraw._id,
      matchTier: 4,
      prizeAmount: payouts.match4PerUser,
    }),
  );
  winners.match3.forEach((userId) =>
    winnerDocs.push({
      user: userId,
      draw: newDraw._id,
      matchTier: 3,
      prizeAmount: payouts.match3PerUser,
    }),
  );

  // Bulk insert all winners into the database
  if (winnerDocs.length > 0) {
    await Winner.insertMany(winnerDocs);
  }

  // ==========================================

  return {
    winningNumbers,
    financials: { totalPrizePool, prizeTiers },
    payouts,
    winnerCounts: {
      match5: winners.match5.length,
      match4: winners.match4.length,
      match3: winners.match3.length,
    },
  };
};

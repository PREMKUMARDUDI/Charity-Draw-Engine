import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trophy, AlertCircle } from "lucide-react";
import api from "../services/api";
import Button from "./Button";
import Input from "./Input";

const ScoreManager = () => {
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchScores = async () => {
    try {
      const response = await api.get("/scores");
      setScores(response.data);
    } catch (err) {
      console.error("Failed to fetch scores", err);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleAddScore = async (e) => {
    e.preventDefault();
    setError("");
    const scoreValue = parseInt(newScore);

    if (isNaN(scoreValue) || scoreValue < 1 || scoreValue > 45) {
      setError("Score must be a number between 1 and 45.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/scores", { value: scoreValue });
      setScores(response.data);
      setNewScore("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add score");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // FULL HEIGHT CONTAINER, locked in by the parent Grid
    <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-slate-200 h-full flex flex-col">
      {/* HEADER - Fixed at top */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
          <Trophy className="text-accent" size={22} />
          Your Recent Scores
        </h2>
        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
          {scores.length}/5 Rolling
        </span>
      </div>

      {/* INPUT FORM - Fixed at top */}
      <form onSubmit={handleAddScore} className="mb-4 flex gap-3 flex-shrink-0">
        <div className="flex-1">
          <Input
            label="New Stableford Score"
            id="score"
            type="number"
            min="1"
            max="45"
            placeholder="e.g., 36"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
          />
        </div>
        <div className="mt-[28px] w-14">
          <Button type="submit" disabled={isLoading || !newScore}>
            <Plus size={24} strokeWidth={3} />
          </Button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 font-medium rounded-lg text-sm flex items-center gap-2 border border-red-200 flex-shrink-0">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* LIST AREA - Flexible height, internal scrolling ONLY */}
      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {scores.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <p className="font-semibold text-lg">No scores entered yet.</p>
            <p className="text-sm mt-1">
              Enter your first score to start the rolling window.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 pb-2">
            <AnimatePresence>
              {scores.map((score, index) => (
                <motion.li
                  key={score._id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  layout
                  // HIGH CONTRAST LIST ITEMS
                  className={`p-4 rounded-xl flex items-center justify-between transition-colors ${
                    index === 0
                      ? "bg-blue-50/50 border-2 border-accent shadow-sm"
                      : "bg-white border-2 border-slate-300 shadow-sm hover:border-slate-400"
                  }`}
                >
                  <div>
                    <span className="block text-3xl font-black text-primary">
                      {score.value}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {new Date(score.datePlayed).toLocaleDateString()}
                    </span>
                  </div>
                  {index === 0 && (
                    <span className="text-xs font-black text-accent uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm">
                      Latest
                    </span>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScoreManager;

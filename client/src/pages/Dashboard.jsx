import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  CreditCard,
  Gift,
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import ScoreManager from "../components/ScoreManager";
import Button from "../components/Button";
import Input from "../components/Input";

const Dashboard = () => {
  const { user } = useAuthStore();
  const [winnings, setWinnings] = useState([]);
  const [proofUrl, setProofUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWinnings = async () => {
      try {
        const { data } = await api.get("/winners/my-winnings");
        setWinnings(data);
      } catch (error) {
        console.error("Error fetching winnings", error);
      }
    };
    fetchWinnings();
  }, []);

  const handleProofSubmit = async (winnerId) => {
    if (!proofUrl) return;
    setIsSubmitting(true);
    try {
      await api.put(`/winners/${winnerId}/proof`, { proofImageUrl: proofUrl });
      // Refresh winnings to update UI state
      const { data } = await api.get("/winners/my-winnings");
      setWinnings(data);
      setProofUrl("");
    } catch (error) {
      console.error("Error submitting proof", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Calculate total won from paid winnings
  const totalWon = winnings
    .filter((w) => w.paymentStatus === "paid")
    .reduce((acc, curr) => acc + curr.prizeAmount, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col"
    >
      <header className="mb-6 flex items-center gap-4 flex-shrink-0">
        <div className="p-3 bg-white rounded-xl shadow-md border-2 border-slate-200">
          <LayoutDashboard className="text-accent" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Your Dashboard
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your scores and impact.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 h-full min-h-0"
        >
          <ScoreManager />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar"
        >
          {/* WINNER VERIFICATION ALERT (Only shows if they have a pending upload) */}
          {winnings.map(
            (win) =>
              win.verification.status === "pending_upload" && (
                <div
                  key={win._id}
                  className="bg-amber-50 p-6 rounded-2xl shadow-md border-2 border-amber-200 flex-shrink-0"
                >
                  <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-2">
                    <AlertCircle size={20} /> Action Required: You Won!
                  </h3>
                  <p className="text-sm text-amber-700 mb-4 font-medium">
                    You matched {win.matchTier} numbers and won $
                    {win.prizeAmount.toFixed(2)}. Please provide a link to a
                    screenshot of your scores to claim your prize.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Input
                      placeholder="Paste image URL here (e.g. Imgur link)"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                    />
                    <Button
                      onClick={() => handleProofSubmit(win._id)}
                      disabled={isSubmitting || !proofUrl}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Proof"}
                    </Button>
                  </div>
                </div>
              ),
          )}

          {winnings.map(
            (win) =>
              win.verification.status === "under_review" && (
                <div
                  key={win._id}
                  className="bg-blue-50 p-5 rounded-2xl shadow-sm border-2 border-blue-200 flex-shrink-0"
                >
                  <h3 className="text-md font-bold text-blue-800 flex items-center gap-2">
                    <CheckCircle2 size={18} /> Proof under review
                  </h3>
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    Your screenshot for the ${win.prizeAmount.toFixed(2)} prize
                    is being verified by our team.
                  </p>
                </div>
              ),
          )}

          {/* ... Keep your existing Subscription Card ... */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-slate-200 flex-shrink-0">
            {/* Same code from the previous Dashboard.jsx */}
            <h3 className="text-lg font-bold text-primary flex items-center gap-2.5 mb-4">
              <CreditCard className="text-slate-400" size={20} /> Subscription
              Status
            </h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Status
                </p>
                <p className="font-extrabold text-lg capitalize text-primary">
                  {user?.subscriptionStatus || "Inactive"}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
          </div>

          {/* ... Keep your existing Charity Impact Card ... */}
          <div className="bg-gradient-to-br from-charity to-rose-600 p-6 rounded-2xl shadow-lg border-2 border-rose-500 text-white flex-shrink-0">
            <h3 className="text-lg font-bold flex items-center gap-2.5 mb-3">
              <Heart className="text-white" size={20} /> Monthly Impact
            </h3>
            <p className="text-5xl font-black mb-1 tracking-tight">10%</p>
            <p className="text-white/90 mb-5 font-medium text-sm">
              of your subscription goes to charity.
            </p>
            <Link
              to="/impact"
              className="w-full py-2.5 bg-white/20 hover:bg-white/30 transition-colors rounded-xl text-sm font-bold backdrop-blur-md flex items-center justify-center border border-white/30"
            >
              Manage Preferences
            </Link>
          </div>

          {/* Winnings Overview Card - NOW DYNAMIC */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-slate-200 flex-1 flex flex-col justify-center min-h-[160px]">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2.5 mb-4">
              <Gift className="text-slate-400" size={20} /> Winnings Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl text-center border-2 border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Total Won
                </p>
                <p className="font-black text-2xl text-primary">
                  ${totalWon.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center border-2 border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Next Draw
                </p>
                <p className="font-black text-2xl text-accent">
                  12<span className="text-sm text-slate-400"> Days</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

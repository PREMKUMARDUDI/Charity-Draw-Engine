import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, PlayCircle, Users, Trophy, DollarSign } from "lucide-react";
import api from "../services/api";
import Button from "../components/Button";

const AdminDashboard = () => {
  // --- DRAW ENGINE STATE ---
  const [isDrawing, setIsDrawing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  // --- VERIFICATION CENTER STATE ---
  const [winnersList, setWinnersList] = useState([]);

  // Fetch all winners when the admin dashboard loads
  useEffect(() => {
    const fetchAdminWinners = async () => {
      try {
        const { data } = await api.get("/winners");
        setWinnersList(data);
      } catch (error) {
        console.error("Failed to fetch winners", error);
      }
    };
    fetchAdminWinners();
  }, []);

  // --- DRAW ENGINE LOGIC ---
  const handleRunDraw = async () => {
    setIsDrawing(true);
    setError("");
    setResults(null);

    try {
      const { data } = await api.post("/admin/run-draw");
      // Adding a slight delay just so the user sees the "Calculating" animation
      setTimeout(() => {
        setResults(data.data);
        setIsDrawing(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Simulation failed.");
      setIsDrawing(false);
    }
  };

  // --- VERIFICATION STATUS LOGIC ---
  const handleStatusUpdate = async (id, vStatus, pStatus) => {
    try {
      await api.put(`/winners/${id}/status`, {
        verificationStatus: vStatus,
        paymentStatus: pStatus,
      });
      // Refresh list to instantly show the new status badge
      const { data } = await api.get("/winners");
      setWinnersList(data);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-12"
    >
      {/* HEADER */}
      <header className="mb-10 flex items-center gap-4">
        <div className="p-3 bg-slate-800 text-white rounded-xl shadow-md border-2 border-slate-700">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-slate-500 font-medium">
            Manage platform operations, draws, and payouts.
          </p>
        </div>
      </header>

      {/* ========================================== */}
      {/* SECTION 1: THE DRAW ENGINE                 */}
      {/* ========================================== */}
      <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-slate-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <PlayCircle className="text-accent" /> Monthly Draw Engine
            </h2>
            <p className="text-slate-500 mt-1 font-medium">
              Run the simulation to generate winning numbers and calculate
              payouts.
            </p>
          </div>
          <div className="w-48">
            <Button onClick={handleRunDraw} disabled={isDrawing}>
              {isDrawing ? "Calculating..." : "Run Simulation"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 font-bold rounded-xl border-2 border-red-200 mb-6">
            {error}
          </div>
        )}

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t-2 border-slate-100">
                <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest mb-6">
                  Winning Numbers
                </h3>

                {/* Animated Lottery Balls */}
                <div className="flex justify-center gap-4 mb-10">
                  {results.winningNumbers.map((num, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: i * 0.15,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-accent/30 border-4 border-white"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 text-center">
                    <Trophy className="mx-auto text-amber-500 mb-2" size={32} />
                    <h4 className="font-bold text-primary text-lg">
                      5 Matches (Jackpot)
                    </h4>
                    <p className="text-3xl font-black text-slate-800 my-2">
                      {results.winnerCounts.match5}{" "}
                      <span className="text-sm text-slate-500 font-medium">
                        Winners
                      </span>
                    </p>
                    <p className="text-emerald-600 font-bold">
                      ${results.payouts.match5PerUser.toFixed(2)} / each
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 text-center">
                    <Users className="mx-auto text-slate-400 mb-2" size={32} />
                    <h4 className="font-bold text-primary text-lg">
                      4 Matches
                    </h4>
                    <p className="text-3xl font-black text-slate-800 my-2">
                      {results.winnerCounts.match4}{" "}
                      <span className="text-sm text-slate-500 font-medium">
                        Winners
                      </span>
                    </p>
                    <p className="text-emerald-600 font-bold">
                      ${results.payouts.match4PerUser.toFixed(2)} / each
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200 text-center">
                    <DollarSign
                      className="mx-auto text-slate-400 mb-2"
                      size={32}
                    />
                    <h4 className="font-bold text-primary text-lg">
                      3 Matches
                    </h4>
                    <p className="text-3xl font-black text-slate-800 my-2">
                      {results.winnerCounts.match3}{" "}
                      <span className="text-sm text-slate-500 font-medium">
                        Winners
                      </span>
                    </p>
                    <p className="text-emerald-600 font-bold">
                      ${results.payouts.match3PerUser.toFixed(2)} / each
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================== */}
      {/* SECTION 2: VERIFICATION CENTER             */}
      {/* ========================================== */}
      <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Users className="text-accent" /> Verification Center
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Review winner submissions and process payouts.
          </p>
        </div>

        {winnersList.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-lg bg-slate-50">
            No winners recorded in the database yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 uppercase text-xs font-bold tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Prize</th>
                  <th className="p-4">Proof</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 bg-white">
                {winnersList.map((winner) => (
                  <tr
                    key={winner._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-bold text-primary">
                      {winner.user?.name}
                    </td>
                    <td className="p-4 font-bold text-emerald-600">
                      ${winner.prizeAmount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {winner.verification.proofImageUrl ? (
                        <a
                          href={winner.verification.proofImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline font-semibold text-sm"
                        >
                          View Image
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm font-semibold">
                          Awaiting
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${
                          winner.verification.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : winner.verification.status === "under_review"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {winner.verification.status
                          .replace("_", " ")
                          .toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${
                          winner.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {winner.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {/* Show Approve/Reject ONLY if under review */}
                      {winner.verification.status === "under_review" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                winner._id,
                                "approved",
                                winner.paymentStatus,
                              )
                            }
                            className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 shadow-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                winner._id,
                                "rejected",
                                winner.paymentStatus,
                              )
                            }
                            className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 shadow-sm transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {/* Show Pay ONLY if approved and not yet paid */}
                      {winner.verification.status === "approved" &&
                        winner.paymentStatus === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                winner._id,
                                winner.verification.status,
                                "paid",
                              )
                            }
                            className="px-3 py-1.5 bg-accent text-white text-xs font-bold rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

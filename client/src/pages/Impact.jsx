import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import Button from "../components/Button";
import useAuthStore from "../store/authStore";

// Curated list of background gradients for charities without images
const fallbackGradients = [
  "from-rose-100 to-rose-200 text-rose-800",
  "from-sky-100 to-sky-200 text-sky-800",
  "from-emerald-100 to-emerald-200 text-emerald-800",
  "from-amber-100 to-amber-200 text-amber-800",
  "from-violet-100 to-violet-200 text-violet-800",
];

// Helper to get a stable gradient based on the charity name
const getGradient = (name) => {
  const index = name.length % fallbackGradients.length;
  return fallbackGradients[index];
};

const Impact = () => {
  const [charities, setCharities] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const { data } = await api.get("/charities");
        setCharities(data);
        if (user?.charityPreferences?.selectedCharity) {
          setSelectedId(user.charityPreferences.selectedCharity);
          setPercentage(user.charityPreferences.contributionPercentage || 10);
        }
      } catch (error) {
        console.error("Failed to fetch charities", error);
      }
    };
    fetchCharities();
  }, [user]);

  const handleSave = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    setMessage("");
    try {
      await api.put("/charities/select", {
        charityId: selectedId,
        contributionPercentage: percentage,
      });
      setMessage("Impact preferences updated successfully!");
      // Update local state is crucial so placeholder update instantly
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4 tracking-tight">
          Choose Your Impact
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Every swing counts. Select a cause you care about, and we'll
          automatically route a portion of your subscription to them every
          month.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {charities.map((charity) => (
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            key={charity._id}
            onClick={() => setSelectedId(charity._id)}
            // ELEVATED CARD STYLING:
            className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
              selectedId === charity._id
                ? "border-charity shadow-xl shadow-charity/10 bg-white"
                : "border-slate-200/70 shadow-sm shadow-slate-100/50 bg-white hover:border-slate-300 hover:shadow-lg"
            }`}
          >
            <div className="h-48 bg-slate-100 relative overflow-hidden">
              {charity.imageUrl ? (
                <img
                  src={charity.imageUrl}
                  alt={charity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Critical fix: If external image fails, kill it and let fallback handle it
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}

              {/* FALLBACK PLACEHOLDER (Shows if imageUrl is null OR if img onError fires) */}
              <div
                style={{ display: charity.imageUrl ? "none" : "flex" }}
                className={`w-full h-full flex items-center justify-center p-6 text-center font-semibold text-lg bg-gradient-to-br ${getGradient(charity.name)}`}
              >
                {charity.name}
              </div>

              {selectedId === charity._id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-white rounded-full p-1 text-charity shadow-md"
                >
                  <CheckCircle2 fill="currentColor" size={28} />
                </motion.div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2 text-primary">
                {charity.name}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                {charity.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            // ELEVATED SETTING CARD STYLING:
            className="bg-white p-8 md:p-10 rounded-3xl shadow-lg shadow-slate-100 border border-slate-200 max-w-3xl mx-auto text-center mb-16"
          >
            <h3 className="text-2xl font-bold text-primary mb-5 flex items-center justify-center gap-3">
              <Heart className="text-charity" fill="currentColor" size={24} />{" "}
              Set Your Monthly Contribution
            </h3>
            <p className="text-slate-500 mb-8 max-w-lg mx-auto">
              Choose what percentage of your subscription fee goes to your
              selected charity (Minimum 10%).
            </p>

            <div className="flex items-center justify-center gap-6 mb-10 bg-slate-50 border border-slate-100 p-6 rounded-2xl">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full max-w-md h-3 accent-charity cursor-pointer"
              />
              <span className="text-4xl font-extrabold text-charity w-24 tabular-nums">
                {percentage}%
              </span>
            </div>

            <Button variant="charity" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving Impact..." : "Lock in my Contribution"}
            </Button>

            {message && (
              <p className="mt-5 text-sm font-semibold text-accent">
                {message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Impact;

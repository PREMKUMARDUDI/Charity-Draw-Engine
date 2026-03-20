import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import useAuthStore from "../store/authStore";
import api from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError("");

    try {
      // 1. Register the user via backend API
      await api.post("/auth/register", { name, email, password });

      // 2. Immediately log them in using Zustand store
      await login(email, password);

      // 3. Redirect
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Make an Impact
          </h1>
          <p className="text-slate-500">
            Join the platform to play and give back.
          </p>
        </div>

        {localError && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm text-center">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="mt-6">
            <Button type="submit" variant="charity" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

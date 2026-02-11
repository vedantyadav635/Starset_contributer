import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { User, MapPin, CreditCard, Calendar, Users } from "lucide-react";

interface CompleteProfileProps {
  onComplete: () => void;
  isDark: boolean;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ onComplete, isDark }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!age || !gender || !city || !state || !upiId) {
      setError("Please fill in all fields");
      return;
    }

    if (Number(age) < 18 || Number(age) > 100) {
      setError("Age must be between 18 and 100");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        console.error("User error:", userError);
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      console.log("Updating profile for user:", user.id);
      console.log("Data to update:", {
        age_int: Number(age),
        age: Number(age),
        gender_text: gender,
        gender: gender,
        city_text: city,
        city: city,
        state_text: state,
        state: state,
        upi_id_text: upiId,
        upi_id: upiId,
        profile_completed: true,
      });

      const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({
          age_int: Number(age),
          age: Number(age),
          gender_text: gender,
          gender: gender,
          city_text: city,
          city: city,
          state_text: state,
          state: state,
          upi_id_text: upiId,
          upi_id: upiId,
          profile_completed: true,
        })
        .eq("id", user.id)
        .select(); // Add .select() to return the updated data

      console.log("Update result:", { data: updateData, error: updateError });

      setLoading(false);

      if (updateError) {
        console.error("Update error:", updateError);
        setError(updateError.message);
        return;
      }

      if (!updateData || updateData.length === 0) {
        console.error("No rows were updated!");
        setError("Failed to update profile. No matching record found.");
        return;
      }

      console.log("Profile updated successfully:", updateData);
      onComplete();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF9F7] dark:bg-[#0a0a0a]">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#121212] dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg">
            Just a few more details to get you started
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-stone-200 dark:border-white/10 p-8 md:p-10 animate-in slide-in-from-bottom duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm animate-in fade-in duration-300">
                {error}
              </div>
            )}

            {/* Age & Gender Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  className="w-full px-4 py-3.5 border border-stone-300 dark:border-white/20 rounded-xl bg-stone-50 dark:bg-white/5 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-base text-zinc-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="100"
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                  <Users className="h-4 w-4 text-teal-500" />
                  Gender
                </label>
                <select
                  className="w-full px-4 py-3.5 border border-stone-300 dark:border-white/20 rounded-xl bg-stone-50 dark:bg-white/5 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-400 transition-all outline-none text-base text-zinc-900 dark:text-white"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* City & State Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* City */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-3.5 border border-stone-300 dark:border-white/20 rounded-xl bg-stone-50 dark:bg-white/5 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all outline-none text-base text-zinc-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  State
                </label>
                <input
                  type="text"
                  placeholder="e.g., Maharashtra"
                  className="w-full px-4 py-3.5 border border-stone-300 dark:border-white/20 rounded-xl bg-stone-50 dark:bg-white/5 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all outline-none text-base text-zinc-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* UPI ID */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                <CreditCard className="h-4 w-4 text-purple-500" />
                UPI ID
              </label>
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full px-4 py-3.5 border border-stone-300 dark:border-white/20 rounded-xl bg-stone-50 dark:bg-white/5 focus:bg-white dark:focus:bg-black/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all outline-none text-base text-zinc-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 ml-1">
                This will be used for payment processing
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Complete Profile"
              )}
            </button>
          </form>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-white/10">
            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
              🔒 Your information is secure and will only be used for verification and payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;

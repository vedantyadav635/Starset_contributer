import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { Button } from '../components/Button';
import { Download, CreditCard, Wallet, Plus, X, Smartphone, Landmark, Check, Inbox, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: EASE },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const Earnings: React.FC = () => {
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [addMethodTab, setAddMethodTab] = useState<'upi' | 'bank'>('upi');
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch real submission-based transactions for this user
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile for UPI/payment info
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
        }

        // Fetch submissions as transactions
        const { data: submissions, error } = await supabase
          .from("submissions")
          .select("id, task_id, status, submitted_at")
          .eq("user_id", user.id)
          .order("submitted_at", { ascending: false });

        if (!error && submissions) {
          // Map submissions to transaction format
          const txns: Transaction[] = submissions.map((sub, i) => ({
            id: sub.id,
            date: new Date(sub.submitted_at).toLocaleDateString('en-CA'),
            amount: 0, // Will be calculated if task compensation is available
            currency: 'INR',
            description: `Task Submission #${sub.task_id?.substring(0, 8) || i + 1}`,
            status: sub.status === 'accepted' || sub.status === 'validated' || sub.status === 'approved'
              ? 'Processed'
              : sub.status === 'pending_validation'
                ? 'Pending'
                : 'Pending' as 'Pending' | 'Processed' | 'Failed',
          }));
          setTransactions(txns);
        }
      } catch (err) {
        console.error("Error fetching earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const totalEarned = transactions
    .filter(tx => tx.status === 'Processed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleWithdraw = () => {
    setIsWithdrawLoading(true);
    setTimeout(() => {
      setIsWithdrawLoading(false);
      alert("Transfer request initiated.");
    }, 1500);
  };

  const upiId = userProfile?.upi_id || 'Not set';
  const userName = userProfile?.full_name || 'Contributor';

  return (
    <motion.div
      className="space-y-8 relative pb-24 md:pb-0 perspective-1000"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Compensation & Settlement</h1>
          <p className="text-zinc-500 mt-1 text-sm md:text-base">View accrued compensation for accepted data contributions.</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-transparent text-slate-700 dark:text-white border-slate-300 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all">
          <Download className="h-4 w-4 mr-2" /> Tax Invoice
        </Button>
      </motion.div>



      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Balance Card */}
        <motion.div variants={cardVariants} className="relative group perspective-1000 h-auto md:h-full min-h-[280px]">
          <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
          <motion.div
            whileHover={{ scale: 1.02, rotateX: 2 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-gradient-to-br from-black to-zinc-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-black/50 flex flex-col justify-between relative overflow-hidden border border-zinc-800 h-full glass-shine">

            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none z-20"></div>
            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none z-0"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                    <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-300" />
                  </div>
                  <span className="text-zinc-300 text-[10px] md:text-sm font-medium tracking-widest uppercase">Balance</span>
                </div>
                <div className="h-6 w-10 bg-white/10 rounded-md border border-white/5 relative overflow-hidden">
                  <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-black/30"></div>
                </div>
              </div>

              <div className="space-y-1 mb-8 transform-style-3d group-hover:translate-z-10 transition-transform">
                <div className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
                  ₹{totalEarned.toLocaleString('en-IN')}<span className="text-2xl text-zinc-500">.00</span>
                </div>
                <div className="text-emerald-400 text-xs md:text-sm font-mono flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {totalEarned > 0 ? 'Liquidated & Ready' : 'Awaiting Settlement'}
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <Button
                  className="w-full bg-white text-black hover:bg-zinc-200 border-none shadow-[0_0_20px_rgba(255,255,255,0.3)] h-12 md:h-14 text-base md:text-lg font-black disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                  onClick={handleWithdraw}
                  isLoading={isWithdrawLoading}
                  disabled={true}
                >
                  Initiate Payout
                </Button>
                <div className="flex items-center gap-2 justify-center px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
                  Security Lockdown: Manual Settlement Mode
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>{userName}</span>
                  <span>{transactions.length} Records</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div variants={cardVariants} className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-white/5 dark:to-white/5 rounded-[32px] border border-blue-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 flex flex-col h-full relative overflow-hidden glass-shine">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none z-0" />

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center justify-between relative z-10">
            <span>Transfer Accounts</span>
            {upiId !== 'Not set' && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-900/30">Active</span>
            )}
          </h2>

          <div className="space-y-4 flex-1 relative z-10">
            {/* UPI Method from profile */}
            {upiId !== 'Not set' ? (
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-blue-500 bg-blue-900/10 rounded-2xl transition-all cursor-pointer group gap-4 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex items-center">
                  <div className="h-14 w-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 mr-5 shadow-sm group-hover:scale-110 transition-transform">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">UPI ID (VPA)</p>
                    <p className="text-sm text-stone-500 font-mono">{upiId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:ml-auto">
                  <span className="text-xs font-bold px-3 py-1.5 bg-black text-blue-400 rounded-lg border border-blue-900 shadow-sm flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Verified
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 border border-dashed border-white/10 rounded-2xl text-center">
                <Smartphone className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-500 text-sm">No UPI ID configured</p>
                <p className="text-zinc-400 text-xs mt-1">Add your UPI ID in your profile settings</p>
              </div>
            )}

            {/* Add New Button */}
            <button
              onClick={() => setShowAddMethod(true)}
              className="w-full border-2 border-dashed border-white/10 rounded-2xl p-4 flex items-center justify-center text-stone-500 hover:border-blue-400 hover:text-blue-400 hover:bg-white/5 transition-all font-bold mt-auto text-base h-16 group"
            >
              <div className="bg-white/10 p-1 rounded-full mr-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Plus className="h-4 w-4" />
              </div>
              Connect New Account
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-white/5 dark:to-white/5 rounded-[32px] border border-blue-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative glass-shine"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 dark:bg-blue-500/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none z-0" />
        <div className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 dark:bg-white/5 gap-4 relative z-10">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settlement Ledger</h2>
            <select className="text-xs border-slate-200 dark:border-white/10 rounded-lg py-1.5 px-3 bg-white dark:bg-black focus:ring-blue-600 focus:border-blue-600 text-slate-700 dark:text-white shadow-sm">
              <option>All Entries</option>
              <option>Processed</option>
              <option>Pending</option>
            </select>
          </div>
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Recent Activity</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-zinc-500 relative z-10">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center relative z-10">
            <Inbox className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-slate-900 dark:text-zinc-500 font-medium">No transactions yet</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Complete tasks to see your earnings here</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-black/20 text-stone-500 font-bold border-b border-white/5 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Description</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group cursor-default">
                    <td className="px-8 py-5 text-stone-500 font-mono text-xs">{tx.date}</td>
                    <td className="px-8 py-5 text-slate-900 dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tx.description}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${tx.status === 'Processed' ? 'bg-teal-900/30 text-teal-300 border border-teal-800' :
                        tx.status === 'Pending' ? 'bg-amber-900/30 text-amber-300 border border-amber-800' :
                          'bg-red-900/30 text-red-300'
                        }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddMethod && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-md perspective-1000"
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="bg-zinc-900 rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10 transform-style-3d"
          >
            <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-xl text-white">Add Account</h3>
              <button onClick={() => setShowAddMethod(false)} className="text-stone-400 hover:text-red-400 p-2 hover:bg-red-900/20 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8">
              {/* Tabs */}
              <div className="flex p-1.5 bg-black rounded-xl mb-8">
                <button
                  onClick={() => setAddMethodTab('upi')}
                  className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${addMethodTab === 'upi' ? 'bg-zinc-800 text-white shadow-md transform scale-[1.02]' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  <Smartphone className="h-4 w-4 mr-2" /> UPI
                </button>
                <button
                  onClick={() => setAddMethodTab('bank')}
                  className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${addMethodTab === 'bank' ? 'bg-zinc-800 text-white shadow-md transform scale-[1.02]' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  <Landmark className="h-4 w-4 mr-2" /> Bank Transfer
                </button>
              </div>

              {addMethodTab === 'upi' ? (
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">UPI ID (VPA)</label>
                    <input type="text" placeholder="username@bank" className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-black/30 text-white text-lg font-medium" />
                    <p className="text-xs text-stone-400 mt-2">Supported apps: GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">Confirm UPI ID</label>
                    <input type="text" placeholder="username@bank" className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-black/30 text-white text-lg font-medium" />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">Account Number</label>
                    <input type="text" className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-black/30 text-white text-lg font-medium" />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">IFSC Code</label>
                    <input type="text" placeholder="ABCD0123456" className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all uppercase bg-black/30 text-white text-lg font-medium" />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">Account Holder Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-black/30 text-white text-lg font-medium" />
                  </div>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-white/10 flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setShowAddMethod(false)}>Cancel</Button>
                <Button className="flex-1 h-12 text-base shadow-lg" onClick={() => { setShowAddMethod(false); alert("Account added successfully!"); }}>Save Details</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

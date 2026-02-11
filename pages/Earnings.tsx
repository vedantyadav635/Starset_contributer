import React, { useState } from 'react';
import { Transaction } from '../types';
import { Button } from '../components/Button';
import { Download, Building2, CreditCard, Wallet, Plus, X, Smartphone, Landmark, Check } from 'lucide-react';

const mockTransactions: Transaction[] = [
  { id: 'tx-1', date: '2023-10-24', amount: 1250.00, currency: 'INR', description: 'Monthly Settlement - Batch #88A', status: 'Processed' },
  { id: 'tx-2', date: '2023-10-23', amount: 120.00, currency: 'INR', description: 'Data Contribution: Voice Set #882', status: 'Pending' },
  { id: 'tx-3', date: '2023-10-23', amount: 150.00, currency: 'INR', description: 'Data Contribution: Voice Set #881', status: 'Pending' },
  { id: 'tx-4', date: '2023-10-22', amount: 45.00, currency: 'INR', description: 'Data Contribution: Text Set #102', status: 'Processed' },
  { id: 'tx-5', date: '2023-10-21', amount: 60.00, currency: 'INR', description: 'Data Contribution: Image Set #442', status: 'Processed' },
];

export const Earnings: React.FC = () => {
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [addMethodTab, setAddMethodTab] = useState<'upi' | 'bank'>('upi');
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  const handleWithdraw = () => {
    setIsWithdrawLoading(true);
    setTimeout(() => {
      setIsWithdrawLoading(false);
      alert("Transfer request of ₹3,585.00 initiated.");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-24 md:pb-0 perspective-1000">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#121212] dark:text-white tracking-tight">Compensation & Settlement</h1>
          <p className="text-stone-500 mt-1 text-sm md:text-base">View accrued compensation for accepted data contributions.</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-white dark:bg-transparent text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all">
          <Download className="h-4 w-4 mr-2" /> Tax Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Balance Card - 3D Effect */}
        <div className="relative group perspective-1000 h-full min-h-[300px]">
           <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-3xl transform group-hover:scale-105 transition-transform duration-500"></div>
           <div className="bg-gradient-to-br from-[#1c1917] to-black dark:from-black dark:to-zinc-900 rounded-3xl p-8 text-white shadow-2xl shadow-black/50 flex flex-col justify-between relative overflow-hidden border border-zinc-800 h-full transform transition-transform duration-500 group-hover:rotate-x-2 group-hover:scale-[1.02] transform-style-3d">
             
             {/* Dynamic Shine */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none z-20"></div>
             
             <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none z-0"></div>
             <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none z-0"></div>
             
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                      <CreditCard className="h-6 w-6 text-blue-300" />
                    </div>
                    <span className="text-zinc-300 text-sm font-medium tracking-widest uppercase">Balance</span>
                 </div>
                 <div className="h-8 w-12 bg-white/10 rounded-md border border-white/5 relative overflow-hidden">
                    <div className="absolute top-2 left-0 right-0 h-1 bg-black/30"></div>
                 </div>
               </div>
               
               <div className="space-y-1 mb-10 transform-style-3d group-hover:translate-z-10 transition-transform">
                  <div className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">₹3,585<span className="text-3xl text-zinc-500">.00</span></div>
                  <div className="text-emerald-400 text-sm font-mono flex items-center gap-2">
                     <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     Available for withdrawal
                  </div>
               </div>
               
               <div className="mt-auto space-y-4">
                  <Button 
                    className="w-full bg-white text-black hover:bg-zinc-200 border-none shadow-[0_0_20px_rgba(255,255,255,0.3)] h-12 text-lg font-bold"
                    onClick={handleWithdraw}
                    isLoading={isWithdrawLoading}
                  >
                    Initiate Transfer
                  </Button>
                  <div className="flex justify-between text-xs text-zinc-500 font-mono">
                     <span>ID: 8829-X</span>
                     <span>VALID: 10/25</span>
                  </div>
               </div>
             </div>
           </div>
        </div>

        {/* Payment Methods */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-white/5 shadow-xl p-8 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <h2 className="text-xl font-bold text-[#121212] dark:text-white mb-8 flex items-center justify-between relative z-10">
            <span>Transfer Accounts</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Active</span>
          </h2>
          
          <div className="space-y-4 flex-1 relative z-10">
            {/* Existing UPI Method */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-[#0f766e] dark:border-teal-500 bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl transition-all cursor-pointer group gap-4 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1 duration-300">
              <div className="flex items-center">
                 <div className="h-14 w-14 bg-white dark:bg-black border border-stone-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-[#0f766e] dark:text-teal-400 mr-5 shadow-sm group-hover:scale-110 transition-transform">
                    <Smartphone className="h-7 w-7" />
                 </div>
                 <div>
                   <p className="font-bold text-[#121212] dark:text-white text-lg">UPI ID (VPA)</p>
                   <p className="text-sm text-stone-500 font-mono">contributor@okhdfcbank</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 sm:ml-auto">
                <span className="text-xs font-bold px-3 py-1.5 bg-white dark:bg-black text-teal-700 dark:text-teal-400 rounded-lg border border-teal-100 dark:border-teal-900 shadow-sm flex items-center">
                  <Check className="h-3 w-3 mr-1" /> Verified
                </span>
              </div>
            </div>

            {/* Existing Bank Method */}
            <div className="flex items-center justify-between p-5 border border-stone-200 dark:border-white/10 rounded-2xl hover:border-stone-300 dark:hover:border-white/30 hover:bg-stone-50 dark:hover:bg-white/5 transition-all cursor-pointer group opacity-80 hover:opacity-100 hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="flex items-center">
                 <div className="h-14 w-14 bg-white dark:bg-black border border-stone-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-stone-600 dark:text-stone-400 mr-5 shadow-sm group-hover:scale-110 transition-transform">
                    <Landmark className="h-7 w-7" />
                 </div>
                 <div>
                   <p className="font-bold text-[#121212] dark:text-white text-lg">HDFC Bank</p>
                   <p className="text-sm text-stone-500">Savings •••• 8832</p>
                 </div>
              </div>
            </div>

            {/* Add New Button */}
            <button 
              onClick={() => setShowAddMethod(true)}
              className="w-full border-2 border-dashed border-stone-200 dark:border-white/10 rounded-2xl p-4 flex items-center justify-center text-stone-500 hover:border-[#0f766e] dark:hover:border-teal-400 hover:text-[#0f766e] dark:hover:text-teal-400 hover:bg-teal-50/10 transition-all font-bold mt-auto text-base h-16 group"
            >
              <div className="bg-stone-100 dark:bg-white/10 p-1 rounded-full mr-2 group-hover:bg-[#0f766e] group-hover:text-white transition-colors">
                 <Plus className="h-4 w-4" />
              </div>
              Connect New Account
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-white/10 shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
        <div className="px-8 py-6 border-b border-stone-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-stone-50/50 dark:bg-white/5 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
             <h2 className="text-xl font-bold text-[#121212] dark:text-white">Settlement Ledger</h2>
             <select className="text-xs border-stone-200 dark:border-white/10 rounded-lg py-1.5 px-3 bg-white dark:bg-black focus:ring-[#0f766e] focus:border-[#0f766e] text-zinc-900 dark:text-white shadow-sm">
               <option>All Entries</option>
               <option>Transfers</option>
               <option>Contributions</option>
             </select>
          </div>
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">Recent Activity</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-white dark:bg-black/20 text-stone-500 font-bold border-b border-stone-100 dark:border-white/5 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Compensation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-white/5">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-blue-50/50 dark:hover:bg-white/5 transition-colors group cursor-default">
                  <td className="px-8 py-5 text-stone-500 font-mono text-xs">{tx.date}</td>
                  <td className="px-8 py-5 text-[#121212] dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tx.description}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${
                      tx.status === 'Processed' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' : 
                      tx.status === 'Pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-[#121212] dark:text-white text-base">
                    <span className={tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : ""}>
                       {tx.amount > 0 ? '+' : ''}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Method Modal Overlay */}
      {showAddMethod && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 perspective-1000">
          <div className="bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-20 md:zoom-in-95 duration-300 border border-white/10 transform-style-3d">
            <div className="px-8 py-5 border-b border-stone-100 dark:border-white/10 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
              <h3 className="font-bold text-xl text-[#121212] dark:text-white">Add Account</h3>
              <button onClick={() => setShowAddMethod(false)} className="text-stone-400 hover:text-red-500 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8">
              {/* Tabs */}
              <div className="flex p-1.5 bg-stone-100 dark:bg-black rounded-xl mb-8">
                <button 
                  onClick={() => setAddMethodTab('upi')}
                  className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${addMethodTab === 'upi' ? 'bg-white dark:bg-zinc-800 text-[#0f766e] dark:text-white shadow-md transform scale-[1.02]' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  <Smartphone className="h-4 w-4 mr-2" /> UPI
                </button>
                <button 
                  onClick={() => setAddMethodTab('bank')}
                  className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${addMethodTab === 'bank' ? 'bg-white dark:bg-zinc-800 text-[#0f766e] dark:text-white shadow-md transform scale-[1.02]' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  <Landmark className="h-4 w-4 mr-2" /> Bank Transfer
                </button>
              </div>

              {/* Form Content */}
              {addMethodTab === 'upi' ? (
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">UPI ID (VPA)</label>
                    <input type="text" placeholder="username@bank" className="w-full px-4 py-3 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white dark:bg-black/30 text-zinc-900 dark:text-white text-lg font-medium" />
                    <p className="text-xs text-stone-400 mt-2">Supported apps: GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">Confirm UPI ID</label>
                    <input type="text" placeholder="username@bank" className="w-full px-4 py-3 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white dark:bg-black/30 text-zinc-900 dark:text-white text-lg font-medium" />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">Account Number</label>
                    <input type="text" className="w-full px-4 py-3 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white dark:bg-black/30 text-zinc-900 dark:text-white text-lg font-medium" />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">IFSC Code</label>
                    <input type="text" placeholder="ABCD0123456" className="w-full px-4 py-3 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all uppercase bg-white dark:bg-black/30 text-zinc-900 dark:text-white text-lg font-medium" />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 group-focus-within:text-blue-500 transition-colors">Account Holder Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-stone-200 dark:border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white dark:bg-black/30 text-zinc-900 dark:text-white text-lg font-medium" />
                  </div>
                </div>
              )}
              
              <div className="mt-10 pt-6 border-t border-stone-100 dark:border-white/10 flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setShowAddMethod(false)}>Cancel</Button>
                <Button className="flex-1 h-12 text-base shadow-lg" onClick={() => { setShowAddMethod(false); alert("Account added successfully!"); }}>Save Details</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Users,
  LayoutList,
  ArrowLeft
} from 'lucide-react';

interface AccountingProps {
  transactions: Transaction[];
  language: 'ta' | 'en';
  onEdit: (txn: Transaction) => void;
  onClear: () => void;
}

const Accounting: React.FC<AccountingProps> = ({ transactions, language, onEdit }) => {
  const [view, setView] = useState<'TRANSACTIONS' | 'LEDGER'>('TRANSACTIONS');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  // Calculate Totals
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  // Prepare Transactions with Running Balance
  const transactionsWithBalance = useMemo(() => {
    // Sort by date ascending to calculate running balance
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let balance = 0;
    return sorted.map(t => {
      balance += t.type === 'INCOME' ? t.amount : -t.amount;
      return { ...t, runningBalance: balance };
    }).reverse(); // Reverse to show newest first
  }, [transactions]);

  // Filter and Search
  const filteredTransactions = useMemo(() => {
    return transactionsWithBalance.filter(t => {
      const matchesType = filterType === 'ALL' || t.type === filterType;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (t.category?.toLowerCase().includes(searchLower) || '') ||
        (t.description?.toLowerCase().includes(searchLower) || '') ||
        (t.partyName?.toLowerCase().includes(searchLower) || '');
      return matchesType && matchesSearch;
    });
  }, [transactionsWithBalance, filterType, searchQuery]);

  // Group by Month
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof filteredTransactions } = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const key = date.toLocaleString(language === 'ta' ? 'ta-IN' : 'en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTransactions, language]);

  // Ledger Logic
  const parties = Array.from(new Set(transactions.map(t => t.partyName).filter(Boolean)));
  const getPartyTransactions = (party: string) => {
    return transactionsWithBalance.filter(t => t.partyName === party);
  };
  const getPartyBalance = (party: string) => {
    const txns = transactions.filter(t => t.partyName === party);
    return txns.reduce((acc, t) => acc + (t.type === 'INCOME' ? t.amount : -t.amount), 0);
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-300 font-sans">
      
      {/* Top Card */}
      <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-indigo-200 text-sm font-medium mb-1">{language === 'ta' ? 'மொத்த இருப்பு' : 'Total Balance'}</p>
                    <h1 className="text-4xl font-black tracking-tight">₹{totalBalance.toLocaleString()}</h1>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <Calendar className="text-white" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-indigo-200">
                        <div className="p-1.5 bg-green-400/20 rounded-lg">
                            <TrendingUp size={16} className="text-green-300" />
                        </div>
                        <span className="text-xs font-bold">{language === 'ta' ? 'வரவு' : 'Income'}</span>
                    </div>
                    <p className="text-xl font-bold">₹{totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-indigo-200">
                        <div className="p-1.5 bg-red-400/20 rounded-lg">
                            <TrendingDown size={16} className="text-red-300" />
                        </div>
                        <span className="text-xs font-bold">{language === 'ta' ? 'செலவு' : 'Expense'}</span>
                    </div>
                    <p className="text-xl font-bold">₹{totalExpense.toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex">
        <button 
            onClick={() => { setView('TRANSACTIONS'); setSelectedParty(null); }}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${view === 'TRANSACTIONS' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            <LayoutList size={18} />
            {language === 'ta' ? 'பரிவர்த்தனைகள்' : 'Transactions'}
        </button>
        <button 
            onClick={() => setView('LEDGER')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${view === 'LEDGER' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            <Users size={18} />
            {language === 'ta' ? 'பேரேடு (Ledger)' : 'Ledger'}
        </button>
      </div>

      {view === 'TRANSACTIONS' ? (
        <>
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ta' ? 'தேடவும் (வகை, குறிப்பு, பெயர்...)' : 'Search (Category, Note, Name...)'}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl">
                {(['ALL', 'INCOME', 'EXPENSE'] as const).map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${filterType === type ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {type === 'ALL' ? (language === 'ta' ? 'எல்லாம்' : 'All') : 
                         type === 'INCOME' ? (language === 'ta' ? 'வரவு' : 'Income') : 
                         (language === 'ta' ? 'செலவு' : 'Expense')}
                    </button>
                ))}
            </div>

            {/* Transaction List */}
            <div className="space-y-6">
                {Object.entries(groupedTransactions).map(([month, txns]) => (
                    <div key={month}>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 ml-2">{month}</h3>
                        <div className="space-y-3">
                            {txns.map(txn => (
                                <div key={txn.id} onClick={() => onEdit(txn)} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition cursor-pointer">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${txn.type === 'INCOME' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {txn.type === 'INCOME' ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-black text-gray-800 truncate text-base">{txn.category}</h4>
                                            {txn.partyName && (
                                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-lg ml-2 flex-shrink-0 max-w-[80px] truncate">
                                                    {txn.partyName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-end mt-1">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400">
                                                    {new Date(txn.date).getDate()} {new Date(txn.date).toLocaleString(language === 'ta' ? 'ta-IN' : 'en-US', { month: 'short' })}
                                                    {txn.description && <span className="font-medium text-gray-300"> • {txn.description}</span>}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 bg-gray-50 inline-block px-2 py-0.5 rounded-md">
                                                    {language === 'ta' ? 'இருப்பு: ' : 'Bal: '} ₹{txn.runningBalance.toLocaleString()}
                                                </p>
                                            </div>
                                            <p className={`font-black text-lg ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                {txn.type === 'INCOME' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {filteredTransactions.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p className="font-bold">{language === 'ta' ? 'பரிவர்த்தனைகள் இல்லை' : 'No transactions found'}</p>
                    </div>
                )}
            </div>
        </>
      ) : (
        // Ledger View
        <div className="space-y-4">
            {selectedParty ? (
                // Individual Party View
                <div className="animate-in slide-in-from-right duration-300">
                    <button onClick={() => setSelectedParty(null)} className="mb-4 flex items-center gap-2 text-gray-500 font-bold hover:text-indigo-600 transition">
                        <ArrowLeft size={20} /> {language === 'ta' ? 'பின்செல்க' : 'Back'}
                    </button>
                    
                    <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-200 mb-6">
                        <p className="text-indigo-200 text-xs font-bold uppercase mb-1">{selectedParty}</p>
                        <h3 className="text-4xl font-black">₹{getPartyBalance(selectedParty).toLocaleString()}</h3>
                        <p className="text-indigo-200 text-xs font-bold mt-1">{language === 'ta' ? 'மொத்த மீதம்' : 'Net Balance'}</p>
                    </div>

                    <div className="space-y-3">
                        {getPartyTransactions(selectedParty).map(txn => (
                            <div key={txn.id} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${txn.type === 'INCOME' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {txn.type === 'INCOME' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-black text-gray-800 text-sm">{txn.description || txn.category}</h4>
                                        <p className={`font-black text-sm ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'INCOME' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <p className="text-xs font-bold text-gray-400">{new Date(txn.date).toLocaleDateString()}</p>
                                        <p className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                            {language === 'ta' ? 'இருப்பு: ' : 'Bal: '} ₹{txn.runningBalance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Parties List
                <div className="grid gap-3">
                    {parties.length === 0 ? (
                         <div className="text-center py-10 text-gray-400">
                            <p className="font-bold">{language === 'ta' ? 'லெட்ஜர் இல்லை' : 'No ledgers found'}</p>
                        </div>
                    ) : (
                        parties.map(party => {
                            const balance = getPartyBalance(party as string);
                            return (
                                <div key={party as string} onClick={() => setSelectedParty(party as string)} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-indigo-200 transition group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-500">
                                            {party?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-800 text-lg mb-0.5">{party}</h3>
                                            <p className="text-xs font-bold text-gray-400">{getPartyTransactions(party as string).length} {language === 'ta' ? 'பரிவர்த்தனைகள்' : 'Transactions'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{language === 'ta' ? 'மீதம்' : 'Balance'}</p>
                                        <p className={`font-black text-xl ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {balance >= 0 ? '+' : ''}₹{balance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Accounting;

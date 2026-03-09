import React from 'react';
import { StockItem, Transaction, User } from '../types';

interface DashboardProps {
  stocks: StockItem[];
  transactions: Transaction[];
  language: 'ta' | 'en';
  user: User | null;
  onNavigate: (tab: 'dashboard' | 'stock' | 'accounts' | 'profile' | 'settings') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stocks, transactions, language, user, onNavigate }) => {
  // Sort transactions by date descending to get the most recent ones
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-black text-gray-800 tamil-font">{language === 'ta' ? 'முகப்பு' : 'Dashboard'}</h2>
      
      <div className="grid gap-4">
        {/* Welcome Card */}
        <div className="bg-indigo-600 p-6 rounded-[1.5rem] text-white shadow-lg shadow-indigo-200">
           <p className="text-indigo-200 text-sm font-bold mb-1">{language === 'ta' ? 'வணக்கம்' : 'Welcome'}</p>
           <h3 className="text-2xl font-black truncate">{user?.name || (language === 'ta' ? 'விருந்தினர்' : 'Guest')}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Total Stocks Card */}
            <div 
                onClick={() => onNavigate('stock')}
                className="bg-indigo-600 p-6 rounded-[1.5rem] text-white shadow-lg shadow-indigo-200 cursor-pointer hover:bg-indigo-700 transition active:scale-95"
            >
               <p className="text-indigo-200 text-xs font-bold mb-1">{language === 'ta' ? 'மொத்த சரக்கு' : 'Total Stocks'}</p>
               <h3 className="text-3xl font-black">{stocks.length}</h3>
            </div>

            {/* Total Transactions Card */}
            <div 
                onClick={() => onNavigate('accounts')}
                className="bg-indigo-600 p-6 rounded-[1.5rem] text-white shadow-lg shadow-indigo-200 cursor-pointer hover:bg-indigo-700 transition active:scale-95"
            >
               <p className="text-indigo-200 text-xs font-bold mb-1">{language === 'ta' ? 'மொத்த பரிவர்த்தனை' : 'Total Transactions'}</p>
               <h3 className="text-3xl font-black">{transactions.length}</h3>
            </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-black text-gray-800 mb-3">{language === 'ta' ? 'சமீபத்திய பரிவர்த்தனைகள்' : 'Recent Transactions'}</h3>
        <div className="space-y-3">
            {recentTransactions.map(txn => (
                <div key={txn.id} className="bg-white p-4 rounded-[1.5rem] border-2 border-indigo-100 shadow-sm flex justify-between items-center">
                    <div>
                        <p className="font-bold text-gray-800 text-sm">{txn.description || txn.category}</p>
                        <p className="text-xs text-gray-400 font-bold">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-black ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'INCOME' ? '+' : '-'} ₹{txn.amount}
                    </p>
                </div>
            ))}
            {recentTransactions.length === 0 && (
                <div className="text-center text-gray-400 text-sm font-bold py-8 bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
                    {language === 'ta' ? 'பரிவர்த்தனைகள் இல்லை' : 'No transactions yet'}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

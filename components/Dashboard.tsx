import React from 'react';
import { StockItem, Transaction, User } from '../types';

interface DashboardProps {
  stocks: StockItem[];
  transactions: Transaction[];
  language: 'ta' | 'en';
  user: User | null;
  onSetupServer: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stocks, transactions, language, user, onSetupServer }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{language === 'ta' ? 'முகப்பு' : 'Dashboard'}</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <p>Welcome, {user?.name}</p>
        <p>Total Stocks: {stocks.length}</p>
        <p>Total Transactions: {transactions.length}</p>
      </div>
      <button onClick={onSetupServer} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Setup Server</button>
    </div>
  );
};

export default Dashboard;

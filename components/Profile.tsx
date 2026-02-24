import React from 'react';
import { User, StockItem, Transaction } from '../types';

interface ProfileProps {
  user: User | null;
  updateUser: (user: User | null) => void;
  stocks: StockItem[];
  transactions: Transaction[];
  onLogout: () => void;
  onRestore: (data: any) => void;
  language: 'ta' | 'en';
  onLanguageChange: (lang: 'ta' | 'en') => void;
  onClearTransactions: () => void;
  onResetApp: () => void;
  onSetupServer: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, language, onSetupServer }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{language === 'ta' ? 'சுயவிவரம்' : 'Profile'}</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <p className="font-bold text-lg">{user?.name}</p>
        <p className="text-gray-500">{user?.email}</p>
      </div>
      
      <div className="space-y-2">
        <button onClick={onSetupServer} className="w-full bg-gray-100 p-3 rounded-xl text-left font-bold">
          Setup Cloud Database
        </button>
        <button onClick={onLogout} className="w-full bg-red-50 text-red-600 p-3 rounded-xl text-left font-bold">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

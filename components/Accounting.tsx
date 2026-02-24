import React from 'react';
import { Transaction } from '../types';

interface AccountingProps {
  transactions: Transaction[];
  language: 'ta' | 'en';
  onEdit: (txn: Transaction) => void;
  onClear: () => void;
}

const Accounting: React.FC<AccountingProps> = ({ transactions, language, onEdit, onClear }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{language === 'ta' ? 'கணக்கு' : 'Accounting'}</h2>
        <button onClick={onClear} className="text-red-500 text-sm">Clear All</button>
      </div>
      {transactions.map(txn => (
        <div key={txn.id} className="bg-white p-4 rounded-xl shadow-sm mb-2 flex justify-between items-center">
          <div>
            <h3 className="font-bold">{txn.partyName || txn.category}</h3>
            <p className="text-sm text-gray-500">{txn.description}</p>
          </div>
          <div className="text-right">
            <p className={`font-bold ${txn.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
              {txn.type === 'INCOME' ? '+' : '-'} ₹{txn.amount}
            </p>
            <button onClick={() => onEdit(txn)} className="text-xs text-blue-500 mt-1">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accounting;

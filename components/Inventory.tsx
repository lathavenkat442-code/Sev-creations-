import React, { useState } from 'react';
import { StockItem } from '../types';
import { Edit, Trash2, AlertTriangle, Package, ChevronDown, ChevronUp, Palette } from 'lucide-react';

interface InventoryProps {
  stocks: StockItem[];
  onDelete: (id: string) => void;
  onEdit: (stock: StockItem) => void;
  language: 'ta' | 'en';
}

const Inventory: React.FC<InventoryProps> = ({ stocks, onDelete, onEdit, language }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  
  const getStockLevel = (stock: StockItem) => {
    return stock.variants?.reduce((acc, v) => acc + v.sizeStocks.reduce((sAcc, s) => sAcc + s.quantity, 0), 0) || 0;
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setSelectedVariantIndex(null);
    }
  };

  return (
    <div className="p-4 pb-24 space-y-4 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-gray-800 tamil-font">{language === 'ta' ? 'சரக்கு' : 'Inventory'}</h2>
        <div className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-black">
            {stocks.length} {language === 'ta' ? 'பொருட்கள்' : 'Items'}
        </div>
      </div>

      {stocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={64} className="mb-4 opacity-20" />
            <p className="font-bold text-sm">{language === 'ta' ? 'சரக்கு இல்லை' : 'No items found'}</p>
            <p className="text-xs mt-1">{language === 'ta' ? '+ ஐ அழுத்தி சேர்க்கவும்' : 'Tap + to add items'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {stocks.map(stock => {
            const totalQty = getStockLevel(stock);
            const isLowStock = totalQty < 5;
            const firstImage = stock.variants?.[0]?.imageUrl;
            const isExpanded = expandedId === stock.id;

            return (
                <div key={stock.id} className={`bg-white rounded-[1.5rem] shadow-sm border-2 border-indigo-100 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-indigo-100' : ''}`}>
                  <div className="p-4 flex gap-4 items-start cursor-pointer" onClick={() => toggleExpand(stock.id)}>
                      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden relative">
                        {firstImage ? (
                            <img src={firstImage} className="w-full h-full object-cover" alt={stock.name} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package size={24} />
                            </div>
                        )}
                        {stock.variants.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold backdrop-blur-sm">
                                +{stock.variants.length - 1}
                            </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-black text-gray-800 truncate text-lg leading-tight mb-1">{stock.name}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stock.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-indigo-600 text-lg">₹{stock.price}</p>
                            </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black w-fit ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {isLowStock && <AlertTriangle size={12} />}
                                    {language === 'ta' ? 'இருப்பு:' : 'Stock:'} {totalQty}
                                </div>
                                {/* Visual Stock Indicator */}
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${totalQty < 5 ? 'bg-red-500' : totalQty < 20 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                        style={{ width: `${Math.min(100, (totalQty / 50) * 100)}%` }}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 items-center">
                                <button onClick={(e) => { e.stopPropagation(); onEdit(stock); }} className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition">
                                    <Edit size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(stock.id); }} className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition">
                                    <Trash2 size={16} />
                                </button>
                                <div className="text-gray-300 ml-1">
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>

                  {/* Expanded Details View */}
                  {isExpanded && (
                    <div className="bg-gray-50/50 border-t border-gray-100 p-4 animate-in slide-in-from-top-2">
                        {/* Image Gallery */}
                        {stock.variants.length > 0 && stock.variants.some(v => v.imageUrl) && (
                            <div className="mb-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{language === 'ta' ? 'புகைப்படங்கள்' : 'Photos'}</h4>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {stock.variants.map((v, idx) => (
                                        v.imageUrl && (
                                            <div 
                                                key={idx} 
                                                onClick={() => setSelectedVariantIndex(selectedVariantIndex === idx ? null : idx)}
                                                className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border bg-white shadow-sm cursor-pointer transition-all ${selectedVariantIndex === idx ? 'border-indigo-500 ring-2 ring-indigo-200 scale-105' : 'border-gray-200 hover:border-indigo-300'}`}
                                            >
                                                <img src={v.imageUrl} className="w-full h-full object-cover" alt={`Variant ${idx + 1}`} />
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Breakdown */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{language === 'ta' ? 'இருப்பு விவரங்கள்' : 'Stock Details'}</h4>
                            <div className="grid gap-2">
                                {stock.variants.map((v, vIdx) => {
                                    // Filter by selected variant if one is selected
                                    if (selectedVariantIndex !== null && selectedVariantIndex !== vIdx) return null;

                                    return v.sizeStocks.map((s, sIdx) => (
                                        <div key={`${vIdx}-${sIdx}`} className="bg-white p-3 rounded-xl border-2 border-indigo-100 flex justify-between items-center shadow-sm animate-in fade-in duration-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
                                                    {v.imageUrl ? (
                                                        <img src={v.imageUrl} className="w-full h-full object-cover" alt="Variant" />
                                                    ) : (
                                                        <Palette size={14} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{s.color || 'No Color'}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{s.size} {s.sleeve ? `• ${s.sleeve}` : ''}</p>
                                                </div>
                                            </div>
                                            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black text-sm">
                                                {s.quantity}
                                            </div>
                                        </div>
                                    ));
                                })}
                                {selectedVariantIndex !== null && stock.variants[selectedVariantIndex]?.sizeStocks.length === 0 && (
                                    <p className="text-sm text-gray-400 italic text-center py-2">No stock details for this variant.</p>
                                )}
                            </div>
                        </div>
                    </div>
                  )}
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inventory;

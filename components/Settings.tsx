import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { Save, Building, Phone, MapPin, DollarSign, Type, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface SettingsProps {
  language: 'ta' | 'en';
  onLanguageChange: (lang: 'ta' | 'en') => void;
}

const Settings: React.FC<SettingsProps> = ({ language, onLanguageChange }) => {
  const [businessName, setBusinessName] = useState(localStorage.getItem('viyabaari_business_name') || '');
  const [address, setAddress] = useState(localStorage.getItem('viyabaari_address') || '');
  const [contact, setContact] = useState(localStorage.getItem('viyabaari_contact') || '');
  const [currencySymbol, setCurrencySymbol] = useState(localStorage.getItem('viyabaari_currency_symbol') || '₹');
  const [currencyCode, setCurrencyCode] = useState(localStorage.getItem('viyabaari_currency_code') || 'INR');
  const [toast, setToast] = useState<{ msg: string, show: boolean }>({ msg: '', show: false });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('viyabaari_business_name', businessName);
    localStorage.setItem('viyabaari_address', address);
    localStorage.setItem('viyabaari_contact', contact);
    localStorage.setItem('viyabaari_currency_symbol', currencySymbol);
    localStorage.setItem('viyabaari_currency_code', currencyCode);
    
    setToast({ msg: t.settingsSaved || 'Settings Saved!', show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setToast({ msg: language === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Please enter password', show: true });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ msg: language === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match', show: true });
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return;
    }

    if (newPassword.length < 6) {
        setToast({ msg: language === 'ta' ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்' : 'Password must be at least 6 characters', show: true });
        setTimeout(() => setToast({ ...toast, show: false }), 3000);
        return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      setToast({ msg: language === 'ta' ? 'கடவுச்சொல் மாற்றப்பட்டது' : 'Password updated successfully', show: true });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setToast({ msg: error.message || (language === 'ta' ? 'பிழை ஏற்பட்டது' : 'Error updating password'), show: true });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setToast({ ...toast, show: false }), 3000);
    }
  };

  return (
    <div className="p-6 pb-24 space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-gray-800 tamil-font">{t.settings || 'Settings'}</h2>
      </div>

      {toast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-500">
            <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border backdrop-blur-md text-white ${toast.msg.includes('Error') || toast.msg.includes('பிழை') || toast.msg.includes('match') || toast.msg.includes('பொருந்தவில்லை') ? 'bg-red-600 border-red-500' : 'bg-green-600 border-green-500'}`}>
                <span className="font-bold text-sm tamil-font whitespace-nowrap">{toast.msg}</span>
            </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* App Preferences */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
                <Type size={20} className="text-indigo-600" />
                {t.language || 'Language'}
            </h3>
            <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button type="button" onClick={() => onLanguageChange('ta')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${language === 'ta' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500'}`}>தமிழ்</button>
                <button type="button" onClick={() => onLanguageChange('en')} className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${language === 'en' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500'}`}>English</button>
            </div>
        </div>

        {/* Business Details */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
                <Building size={20} className="text-indigo-600" />
                {t.businessName || 'Business Details'}
            </h3>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.businessName || 'Business Name'}</label>
                <div className="relative">
                    <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold outline-none border border-gray-100 focus:border-indigo-200" placeholder="My Shop" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.address || 'Address'}</label>
                <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={address} onChange={e => setAddress(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold outline-none border border-gray-100 focus:border-indigo-200" placeholder="123 Main St, City" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.contact || 'Contact Number'}</label>
                <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={contact} onChange={e => setContact(e.target.value)} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold outline-none border border-gray-100 focus:border-indigo-200" placeholder="+91 9876543210" />
                </div>
            </div>
        </div>

        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
                <DollarSign size={20} className="text-indigo-600" />
                {t.currencySymbol || 'Currency'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.currencySymbol || 'Symbol'}</label>
                    <input value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border border-gray-100 focus:border-indigo-200 text-center" placeholder="₹" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.currencyCode || 'Code'}</label>
                    <input value={currencyCode} onChange={e => setCurrencyCode(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border border-gray-100 focus:border-indigo-200 text-center" placeholder="INR" />
                </div>
            </div>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
                <Lock size={20} className="text-indigo-600" />
                {language === 'ta' ? 'கடவுச்சொல்லை மாற்ற' : 'Change Password'}
            </h3>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">{language === 'ta' ? 'புதிய கடவுச்சொல்' : 'New Password'}</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="password"
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold outline-none border border-gray-100 focus:border-indigo-200" 
                        placeholder="******" 
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">{language === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm Password'}</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="password"
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        className="w-full p-4 pl-12 bg-gray-50 rounded-2xl font-bold outline-none border border-gray-100 focus:border-indigo-200" 
                        placeholder="******" 
                    />
                </div>
            </div>

            <button 
                type="button" 
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="w-full py-4 bg-gray-900 text-white font-black rounded-[1.5rem] shadow-lg active:scale-[0.98] transition text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {passwordLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                {language === 'ta' ? 'கடவுச்சொல்லை மாற்றவும்' : 'Update Password'}
            </button>
        </div>

        <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-100 active:scale-[0.98] transition text-lg flex items-center justify-center gap-2">
            <Save size={20} />
            {t.saveSettings || 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;

import React, { useState, useId } from 'react';
import { X, Save, AlertCircle, CreditCard, Phone, User, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { VoterRecord, QualificationOption, RoleOption } from '../types/voter';
import { updateVoter, findVoterByVoterNumber, normalizeDigits } from '../services/storage';

interface EditVoterModalProps {
  voter: VoterRecord;
  onClose: () => void;
  onUpdated: (updated: VoterRecord) => void;
}

const COMMON_QUALIFICATIONS: QualificationOption[] = [
  'نەخوێندەوار',
  'سەرەتایی',
  'ناوەندی',
  'ئامادەیی',
  'پەیمانگا (دبلۆم)',
  'بەکالۆریۆس',
  'دیپلۆمی باڵا',
  'ماستەر',
  'دکتۆرا',
];

const COMMON_ROLES: RoleOption[] = [
  'دەنگدەر',
  'سەرپەرشتیاری بنکە',
  'بەرپرسی وێستگە',
  'چاودێری سیاسی',
  'نوێنەری قەوارە',
  'چاودێری کۆمسیۆن',
  'پەیوەندییەکان و گەیاندن',
  'کارگێڕی و لۆجستی',
  'سەرپەرشتیاری گشتی',
];

export const EditVoterModal: React.FC<EditVoterModalProps> = ({ voter, onClose, onUpdated }) => {
  const formId = useId();

  const [fullName, setFullName] = useState(voter.fullName);
  const [age, setAge] = useState(voter.age.toString());
  const [voterNumber, setVoterNumber] = useState(voter.voterNumber);
  const [qualification, setQualification] = useState(voter.qualification);
  const [customQualification, setCustomQualification] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(voter.phoneNumber);
  const [role, setRole] = useState(voter.role);
  const [customRole, setCustomRole] = useState('');
  const [notes, setNotes] = useState(voter.notes || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanVoterNumber = normalizeDigits(voterNumber);
  const cleanPhone = normalizeDigits(phoneNumber);

  const existingWithVoterNumber = cleanVoterNumber.length === 8 
    ? findVoterByVoterNumber(cleanVoterNumber, voter.id) 
    : undefined;

  const handleVoterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = normalizeDigits(e.target.value);
    if (clean.length <= 8) {
      setVoterNumber(clean);
      if (errorMsg) setErrorMsg(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = normalizeDigits(e.target.value);
    if (clean.length <= 11) {
      setPhoneNumber(clean);
      if (errorMsg) setErrorMsg(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || fullName.trim().split(/\s+/).length < 2) {
      setErrorMsg('تکایە ناوی سیانی بە دروستی بنووسە.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (!parsedAge || parsedAge < 18 || parsedAge > 125) {
      setErrorMsg('تەمەن دەبێت ژمارەیەکی دروست بێت لە نێوان ١٨ بۆ ١٢٥ ساڵ.');
      return;
    }

    if (cleanVoterNumber.length !== 8) {
      setErrorMsg(`ژمارەی دەنگدەر دەبێت بە تەواوی ٨ ژمارە بێت (ئێستا: ${cleanVoterNumber.length} ژمارەیە).`);
      return;
    }

    if (existingWithVoterNumber) {
      setErrorMsg(`ئەم ژمارەی دەنگدەرە پێشتر بە ناوی "${existingWithVoterNumber.fullName}" تۆمارکراوە!`);
      return;
    }

    if (cleanPhone.length !== 11) {
      setErrorMsg(`ژمارەی مۆبایل دەبێت بە تەواوی ١١ ژمارە بێت (ئێستا: ${cleanPhone.length} ژمارەیە).`);
      return;
    }

    const finalQualification = qualification === 'هیتر' 
      ? (customQualification.trim() || 'دیاری نەکراوە')
      : qualification;

    const finalRole = role.trim();
    if (!finalRole) {
      setErrorMsg('تکایە ئەرک و بەرپرسیارێتی بنووسە.');
      return;
    }

    const res = updateVoter(voter.id, {
      fullName: fullName.trim(),
      age: parsedAge,
      voterNumber: cleanVoterNumber,
      qualification: finalQualification,
      phoneNumber: cleanPhone,
      role: finalRole,
      notes: notes.trim(),
    });

    if (!res.success || !res.voter) {
      setErrorMsg(res.error || 'هەڵەیەک ڕوویدا لە نوێکردنەوەدا.');
      return;
    }

    onUpdated(res.voter);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">دەستکاریکردنی زانیاری دەنگدەر</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable form content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor={`${formId}-edit-name`} className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                ناوی سیانی:
              </label>
              <input
                id={`${formId}-edit-name`}
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor={`${formId}-edit-age`} className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                تەمەن:
              </label>
              <input
                id={`${formId}-edit-age`}
                type="text"
                inputMode="numeric"
                required
                value={age}
                onChange={(e) => setAge(normalizeDigits(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Voter Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={`${formId}-edit-voterNumber`} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  ژمارەی دەنگدەر:
                </label>
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  cleanVoterNumber.length === 8 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {cleanVoterNumber.length} / ٨ ژمارە
                </span>
              </div>
              <input
                id={`${formId}-edit-voterNumber`}
                type="text"
                inputMode="numeric"
                maxLength={8}
                required
                value={voterNumber}
                onChange={handleVoterNumberChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono tracking-wider"
              />
              {existingWithVoterNumber && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  ئەم ژمارەیە پێشتر بە ناوی ({existingWithVoterNumber.fullName}) تۆمارکراوە!
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={`${formId}-edit-phone`} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  ژمارە مۆبایل:
                </label>
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  cleanPhone.length === 11 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {cleanPhone.length} / ١١ ژمارە
                </span>
              </div>
              <input
                id={`${formId}-edit-phone`}
                type="text"
                inputMode="numeric"
                maxLength={11}
                required
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono tracking-wider"
              />
            </div>

            {/* Qualification */}
            <div>
              <label htmlFor={`${formId}-edit-qualification`} className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                بڕوانامە:
              </label>
              <select
                id={`${formId}-edit-qualification`}
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden font-medium"
              >
                {COMMON_QUALIFICATIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
                <option value="هیتر">بڕوانامەی تر...</option>
              </select>
              {qualification === 'هیتر' && (
                <input
                  type="text"
                  value={customQualification}
                  onChange={(e) => setCustomQualification(e.target.value)}
                  placeholder="ناوی بڕوانامە بنووسە..."
                  className="w-full mt-2 px-3 py-1.5 text-sm rounded-lg border border-slate-300"
                />
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor={`${formId}-edit-role`} className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                ئەرک و بەرپرسیارێتی:
              </label>
              <input
                id={`${formId}-edit-role`}
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="ئەرک و بەرپرسیارێتی بنووسە..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor={`${formId}-edit-notes`} className="block text-xs font-semibold text-slate-700 mb-1">
              تێبینییەکان:
            </label>
            <input
              id={`${formId}-edit-notes`}
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              پاشگەزبوونەوە
            </button>
            <button
              type="submit"
              disabled={cleanVoterNumber.length !== 8 || Boolean(existingWithVoterNumber) || cleanPhone.length !== 11}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>پاشەکەوتکردنی گۆڕانکارییەکان</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

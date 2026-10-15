import React, { useState, useId } from 'react';
import { 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Phone, 
  CreditCard, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  User,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { VoterRecord, QualificationOption, RoleOption } from '../types/voter';
import { addVoter, findVoterByVoterNumber, normalizeDigits } from '../services/storage';

interface VoterFormProps {
  onSuccess: (newVoter: VoterRecord) => void;
  votersCount: number;
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

export const VoterForm: React.FC<VoterFormProps> = ({ onSuccess, votersCount }) => {
  const formId = useId();

  // Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<string>('');
  const [voterNumber, setVoterNumber] = useState('');
  const [qualification, setQualification] = useState<string>('بەکالۆریۆس');
  const [customQualification, setCustomQualification] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<string>('');
  const [notes, setNotes] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived normalized numbers
  const cleanVoterNumber = normalizeDigits(voterNumber);
  const cleanPhone = normalizeDigits(phoneNumber);

  // Duplicate checks
  const existingWithVoterNumber = cleanVoterNumber.length === 8 
    ? findVoterByVoterNumber(cleanVoterNumber) 
    : undefined;

  // Handlers for restricted typing
  const handleVoterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = normalizeDigits(raw);
    // ڕێگە مەدە زیاتر لە ٨ ژمارە بنووسرێت
    if (clean.length <= 8) {
      setVoterNumber(clean);
      if (errorMsg) setErrorMsg(null);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = normalizeDigits(raw);
    // ڕێگە مەدە زیاتر لە ١١ ژمارە بنووسرێت
    if (clean.length <= 11) {
      setPhoneNumber(clean);
      if (errorMsg) setErrorMsg(null);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizeDigits(e.target.value);
    setAge(raw);
    if (errorMsg) setErrorMsg(null);
  };

  const handleReset = () => {
    setFullName('');
    setAge('');
    setVoterNumber('');
    setQualification('بەکالۆریۆس');
    setCustomQualification('');
    setPhoneNumber('');
    setRole('');
    setNotes('');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. پشکنینی ناوی سیانی
    if (!fullName.trim() || fullName.trim().split(/\s+/).length < 2) {
      setErrorMsg('تکایە ناوی سیانی بە دروستی بنووسە (لانیکەم ناو و باوک و باپیر).');
      return;
    }

    // 2. پشکنینی تەمەن
    const parsedAge = parseInt(age, 10);
    if (!parsedAge || parsedAge < 18 || parsedAge > 125) {
      setErrorMsg('تەمەن دەبێت ژمارەیەکی دروست بێت لە نێوان ١٨ بۆ ١٢٥ ساڵ.');
      return;
    }

    // 3. پشکنینی ژمارەی دەنگدەر: بە تەواوی ٨ ژمارە و بێ دووبارەبوونەوە
    if (cleanVoterNumber.length !== 8) {
      setErrorMsg(`ژمارەی دەنگدەر دەبێت بە تەواوی ٨ ژمارە بێت (ئێستا: ${cleanVoterNumber.length} ژمارەیە).`);
      return;
    }

    if (existingWithVoterNumber) {
      setErrorMsg(`ئەم ژمارەی دەنگدەرە (${cleanVoterNumber}) پێشتر تۆمارکراوە بە ناوی "${existingWithVoterNumber.fullName}". دووبارەبوونەوە ڕێگەپێدراو نییە!`);
      return;
    }

    // 4. پشکنینی ژمارەی مۆبایل: بە تەواوی ١١ ژمارە
    if (cleanPhone.length !== 11) {
      setErrorMsg(`ژمارەی مۆبایل دەبێت بە تەواوی ١١ ژمارە بێت (ئێستا: ${cleanPhone.length} ژمارەیە).`);
      return;
    }

    // دیاریکردنی بڕوانامە و ئەرک
    const finalQualification = qualification === 'هیتر' 
      ? (customQualification.trim() || 'دیاری نەکراوە')
      : qualification;

    const finalRole = role.trim();
    if (!finalRole) {
      setErrorMsg('تکایە ئەرک و بەرپرسیارێتی بنووسە.');
      return;
    }

    // تۆمارکردن لە داتابەیس
    const res = addVoter({
      fullName: fullName.trim(),
      age: parsedAge,
      voterNumber: cleanVoterNumber,
      qualification: finalQualification,
      phoneNumber: cleanPhone,
      role: finalRole,
      notes: notes.trim(),
    });

    if (!res.success || !res.voter) {
      setErrorMsg(res.error || 'هەڵەیەک ڕوویدا لە تۆمارکردندا.');
      return;
    }

    // پاککردنەوەی فۆرم
    handleReset();

    // ناردنی بۆ کۆنتێنەر بۆ پیشاندانی سەرکەوتن و بژاردەی ئێکسڵ
    onSuccess(res.voter);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header bar of form */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">فۆرمی داخلکردنی زانیاری دەنگدەر و ستاف</h2>
            <p className="text-xs text-slate-300">
              تکایە هەموو خانەکان بە دروستی پڕبکەرەوە (مەرجەکانی ژمارەی دەنگدەر و مۆبایل جێبەجێ کراون)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            پشکنینی توندی داتابەیس چالاکە
          </span>
        </div>
      </div>

      {/* Error banner if any */}
      {errorMsg && (
        <div className="mx-6 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium leading-relaxed">
            {errorMsg}
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. ناوی سیانی */}
          <div className="space-y-2">
            <label htmlFor={`${formId}-fullName`} className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                ناوی سیانی <span className="text-red-500">*</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">وەک: ئاراس ئەحمەد علی</span>
            </label>
            <input
              id={`${formId}-fullName`}
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="ناوی سیانی بە تەواوی بنووسە..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>

          {/* 2. تەمەن */}
          <div className="space-y-2">
            <label htmlFor={`${formId}-age`} className="block text-sm font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                تەمەن <span className="text-red-500">*</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">١٨ ساڵ یان زیاتر</span>
            </label>
            <div className="relative">
              <input
                id={`${formId}-age`}
                type="text"
                inputMode="numeric"
                required
                value={age}
                onChange={handleAgeChange}
                placeholder="تەمەن بنووسە، وەک: 28"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition text-slate-800 font-medium placeholder:text-slate-400"
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 select-none">
                ساڵ
              </span>
            </div>
          </div>

          {/* 3. ژمارەی دەنگدەر (بە تەواوی ٨ ژمارە و بێ دووبارەبوونەوە) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={`${formId}-voterNumber`} className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                ژمارەی دەنگدەر <span className="text-red-500">*</span>
              </label>
              
              {/* Dynamic counter badge */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className={`px-2 py-0.5 rounded-md text-xs font-mono transition-colors ${
                  cleanVoterNumber.length === 8 
                    ? (existingWithVoterNumber ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300') 
                    : cleanVoterNumber.length > 0 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {cleanVoterNumber.length} / ٨ ژمارە
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                id={`${formId}-voterNumber`}
                type="text"
                inputMode="numeric"
                maxLength={8}
                required
                value={voterNumber}
                onChange={handleVoterNumberChange}
                placeholder="٨ ژمارەی دەنگدەر بنووسە..."
                className={`w-full px-4 py-2.5 rounded-xl border font-mono tracking-wider outline-hidden transition ${
                  cleanVoterNumber.length === 8
                    ? existingWithVoterNumber 
                      ? 'border-red-500 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-500/20'
                      : 'border-emerald-500 bg-emerald-50/30 text-emerald-950 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />

              {cleanVoterNumber.length === 8 && !existingWithVoterNumber && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute left-3 top-2.5 pointer-events-none" />
              )}
              {existingWithVoterNumber && (
                <AlertCircle className="w-5 h-5 text-red-600 absolute left-3 top-2.5 pointer-events-none" />
              )}
            </div>

            {/* Helper explanation & duplicate warning */}
            {existingWithVoterNumber ? (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ئەم ژمارەیە پێشتر بە ناوی ({existingWithVoterNumber.fullName}) تۆمارکراوە!
              </p>
            ) : cleanVoterNumber.length > 0 && cleanVoterNumber.length < 8 ? (
              <p className="text-xs text-amber-600 font-medium mt-1">
                {8 - cleanVoterNumber.length} ژمارەی تر پێویستە بۆ تەواوکردنی ٨ ژمارە
              </p>
            ) : cleanVoterNumber.length === 8 ? (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ژمارەی دەنگدەر دروستە و دووبارە نەبووەتەوە
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                نابێت لە ٨ ژمارە کەمتر یان زیاتر بێت و ناشبێت دووبارە ببێتەوە.
              </p>
            )}
          </div>

          {/* 4. ژمارە مۆبایل (بە تەواوی ١١ ژمارە) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={`${formId}-phoneNumber`} className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                ژمارە مۆبایل <span className="text-red-500">*</span>
              </label>

              {/* Dynamic counter badge */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className={`px-2 py-0.5 rounded-md text-xs font-mono transition-colors ${
                  cleanPhone.length === 11 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : cleanPhone.length > 0 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {cleanPhone.length} / ١١ ژمارە
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                id={`${formId}-phoneNumber`}
                type="text"
                inputMode="numeric"
                maxLength={11}
                required
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="وەک: 07501234567"
                className={`w-full px-4 py-2.5 rounded-xl border font-mono tracking-wider outline-hidden transition ${
                  cleanPhone.length === 11
                    ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />

              {cleanPhone.length === 11 && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute left-3 top-2.5 pointer-events-none" />
              )}
            </div>

            {cleanPhone.length > 0 && cleanPhone.length < 11 ? (
              <p className="text-xs text-amber-600 font-medium mt-1">
                {11 - cleanPhone.length} ژمارەی تر ماوە تا دەبێتە ١١ ژمارە (0750xxxxxxx)
              </p>
            ) : cleanPhone.length === 11 ? (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ژمارەی مۆبایل دروستە (١١ ژمارەی تەواو)
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                دەبێت بە تەواوی ١١ ژمارە بێت بەبێ کەم و زیاد.
              </p>
            )}
          </div>

          {/* 5. بڕوانامە */}
          <div className="space-y-2">
            <label htmlFor={`${formId}-qualification`} className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              بڕوانامە <span className="text-red-500">*</span>
            </label>

            <select
              id={`${formId}-qualification`}
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition text-slate-800 font-medium cursor-pointer"
            >
              {COMMON_QUALIFICATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="هیتر">بڕوانامەی تر (بە دەست بنووسە)...</option>
            </select>

            {qualification === 'هیتر' && (
              <input
                type="text"
                value={customQualification}
                onChange={(e) => setCustomQualification(e.target.value)}
                placeholder="ناوی بڕوانامەکە بنووسە..."
                className="w-full mt-2 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
              />
            )}
          </div>

          {/* 6. ئەرک و بەرپرسیارێتی */}
          <div className="space-y-2">
            <label htmlFor={`${formId}-role`} className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              ئەرک و بەرپرسیارێتی <span className="text-red-500">*</span>
            </label>

            <input
              id={`${formId}-role`}
              type="text"
              required
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="ئەرک و بەرپرسیارێتی بنووسە (وەک: سەرپەرشتیاری بنکە، دەنگدەر، چاودێر...)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* 7. تێبینییەکان (ئارەزوومەندانە) */}
        <div className="space-y-2">
          <label htmlFor={`${formId}-notes`} className="block text-xs font-semibold text-slate-600">
            تێبینی و شوێنی بنکە / وێستگە (ئارەزوومەندانە):
          </label>
          <input
            id={`${formId}-notes`}
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="وەک: ناوی بنکەی دەنگدان، ناوی قوتابخانە، ناوی وێستگە یان هەر تێبینییەکی گرنگ..."
            className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Submit & Reset Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>داتاکان لە داتابەیسی لۆکاڵی سەلامەت پاشەکەوت دەبن و کاتی خۆی دەتوانی ئێکسڵ دابەزێنیت.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>پاککردنەوە</span>
            </button>

            <button
              type="submit"
              disabled={cleanVoterNumber.length !== 8 || Boolean(existingWithVoterNumber) || cleanPhone.length !== 11}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>تۆمارکردن لە داتابەیس</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

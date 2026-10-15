import React from 'react';
import { X, Smartphone, Share2, PlusSquare, CheckCircle, ExternalLink, Copy } from 'lucide-react';

interface IOSInstallGuideModalProps {
  onClose: () => void;
  appUrl: string;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({ onClose, appUrl }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in text-right">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
            <Smartphone className="w-6 h-6 text-emerald-200" />
          </div>

          <h3 className="text-xl font-bold">چۆن لە ئایفۆنەکەت بیکەیتەوە؟</h3>
          <p className="text-xs text-emerald-100 mt-1">
            دەتوانیت وەک ئەپڵیکەیشنێکی سەربەخۆ لەسەر شاشەی ئایفۆنەکەت دایبنێیت
          </p>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              ١
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">لینکی ڕاستەوخۆ لە سەفاری بکەرەوە</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                لە وێبگەڕی سەفاری (Safari) یان کڕۆمی ئایفۆنەکەت لینکەکە پەیست (Paste) بکە.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copied ? 'لینکەکە کۆپی کرا!' : 'کۆپیکردنی لینکی سایت'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              ٢
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>کلیک لە دوگمەی بەشکردن بکە</span>
                <Share2 className="w-4 h-4 text-blue-600" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                لە خوارەوەی وێبگەڕی سەفاری کلیک لەسەر ئەو دوگمەیە بکە کە وێنەی چوارگۆشە و تیرێکی بەرەو سەرەوەیە.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              ٣
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Add to Home Screen هەڵبژێرە</span>
                <PlusSquare className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                لە لیستەکە کەمێک وەرە خوارەوە و کلیک بکە لەسەر: <strong>Add to Home Screen</strong> (زیادکردن بۆ سەر شاشە)، پاشان کلیک لەسەر <strong>Add</strong> بکە.
              </p>
            </div>
          </div>

          {/* Result */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ئیتر وەک ئەپێک بە لۆگۆی تایبەت لەسەر شاشەی ئایفۆنەکەت دەمێنێتەوە و هەرکات ویستت دەتوانیت زانیاری تۆماربکەیت و ئێکسڵ دەربهێنیت!</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            تێگەیشتم / داخستن
          </button>
        </div>
      </div>
    </div>
  );
};

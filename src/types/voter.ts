export interface VoterRecord {
  id: string;
  fullName: string;          // ناوی سیانی
  age: number;               // تەمەن
  voterNumber: string;       // ژمارەی دەنگدەر (بە تەواوی ٨ ژمارە بێ دووبارەبوونەوە)
  qualification: string;     // بڕوانامە
  phoneNumber: string;       // ژمارە مۆبایل (بە تەواوی ١١ ژمارە)
  role: string;              // ئەرک و بەرپرسیارێتی
  notes?: string;            // تێبینی زیاتر
  createdAt: string;         // ڕێکەوتی داخلکردن
  updatedAt?: string;
}

export type QualificationOption = 
  | 'نەخوێندەوار'
  | 'سەرەتایی'
  | 'ناوەندی'
  | 'ئامادەیی'
  | 'پەیمانگا (دبلۆم)'
  | 'بەکالۆریۆس'
  | 'دیپلۆمی باڵا'
  | 'ماستەر'
  | 'دکتۆرا'
  | 'هیتر';

export type RoleOption = 
  | 'دەنگدەر'
  | 'سەرپەرشتیاری بنکە'
  | 'بەرپرسی وێستگە'
  | 'چاودێری سیاسی'
  | 'نوێنەری قەوارە'
  | 'چاودێری کۆمسیۆن'
  | 'پەیوەندییەکان و گەیاندن'
  | 'کارگێڕی و لۆجستی'
  | 'سەرپەرشتیاری گشتی'
  | 'هیتر';

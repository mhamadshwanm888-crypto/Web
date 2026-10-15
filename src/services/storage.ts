import { VoterRecord } from '../types/voter';

const STORAGE_KEY = 'kurdish_voters_database_v1';

/**
 * گۆڕینی ژمارەی کوردی/عەرەبی بۆ ژمارەی ستاندارد (0-9)
 * بۆ ئەوەی ئەگەر بە کیبۆردی کوردی یان عەرەبی نووسی، بە دروستی بخوێندرێتەوە
 */
export function normalizeDigits(input: string): string {
  if (!input) return '';
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persianNumerals = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = input;
  for (let i = 0; i < 10; i++) {
    result = result.replaceAll(arabicNumerals[i], i.toString());
    result = result.replaceAll(persianNumerals[i], i.toString());
  }
  return result.replace(/\D/g, ''); // تەنها ژمارەکان بهێڵەرەوە
}

/**
 * هێنانەوەی سەرجەم داتاکان لە داتابەیسی لۆکاڵ
 */
export function getVoters(): VoterRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // ئەگەر داتابەیس بەتاڵ بوو، چەند نموونەیەکی یارمەتیدەر دابنێ بۆ پێشاندانی سیستەمەکە
      const defaultSamples: VoterRecord[] = [
        {
          id: 'voter-sample-1',
          fullName: 'ئاراس ئەحمەد حەمەساڵح',
          age: 34,
          voterNumber: '84920153',
          qualification: 'بەکالۆریۆس',
          phoneNumber: '07501234567',
          role: 'سەرپەرشتیاری بنکە',
          notes: 'بنکەی ئامادەیی هەڵگورد',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'voter-sample-2',
          fullName: 'شیلان عەلی مەحموود',
          age: 28,
          voterNumber: '76194208',
          qualification: 'ماستەر',
          phoneNumber: '07709876543',
          role: 'بەرپرسی وێستگە',
          notes: 'وێستگەی ژمارە ٢',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'voter-sample-3',
          fullName: 'دیار ڕەئووف عەبدوڵڵا',
          age: 42,
          voterNumber: '31057482',
          qualification: 'پەیمانگا (دبلۆم)',
          phoneNumber: '07514455667',
          role: 'دەنگدەر',
          notes: 'ناوچەی هەولێر',
          createdAt: new Date().toISOString(),
        }
      ];
      saveVoters(defaultSamples);
      return defaultSamples;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading voter database:', error);
    return [];
  }
}

/**
 * پاشەکەوتکردنی داتاکان لە لۆکاڵ ستۆریج
 */
export function saveVoters(voters: VoterRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
  } catch (error) {
    console.error('Error saving voter database:', error);
  }
}

/**
 * پشکنینی دووبارە نەبوونەوەی ژمارەی دەنگدەر
 */
export function findVoterByVoterNumber(voterNumber: string, excludeId?: string): VoterRecord | undefined {
  const voters = getVoters();
  const normalized = normalizeDigits(voterNumber);
  return voters.find(v => v.voterNumber === normalized && v.id !== excludeId);
}

/**
 * پشکنینی دووبارە نەبوونەوەی ژمارە مۆبایل (ئارەزوومەندانە ئاگاداری دەدات)
 */
export function findVoterByPhoneNumber(phoneNumber: string, excludeId?: string): VoterRecord | undefined {
  const voters = getVoters();
  const normalized = normalizeDigits(phoneNumber);
  return voters.find(v => v.phoneNumber === normalized && v.id !== excludeId);
}

/**
 * زیادکردنی دەنگدەری نوێ لەگەڵ پشکنینی توند
 */
export function addVoter(data: Omit<VoterRecord, 'id' | 'createdAt'>): { success: boolean; voter?: VoterRecord; error?: string } {
  const voters = getVoters();

  const cleanVoterNumber = normalizeDigits(data.voterNumber);
  const cleanPhone = normalizeDigits(data.phoneNumber);

  // پشکنینی درێژی ژمارەی دەنگدەر (بە تەواوی ٨ ژمارە)
  if (cleanVoterNumber.length !== 8) {
    return {
      success: false,
      error: `ژمارەی دەنگدەر دەبێت بە تەواوی ٨ ژمارە بێت، بەڵام ئێستا ${cleanVoterNumber.length} ژمارەیە.`
    };
  }

  // پشکنینی دووبارە نەبوونەوەی ژمارەی دەنگدەر
  const existingVoter = voters.find(v => v.voterNumber === cleanVoterNumber);
  if (existingVoter) {
    return {
      success: false,
      error: `ئەم ژمارەی دەنگدەرە (${cleanVoterNumber}) پێشتر تۆمارکراوە بە ناوی "${existingVoter.fullName}"!`
    };
  }

  // پشکنینی درێژی ژمارەی مۆبایل (بە تەواوی ١١ ژمارە)
  if (cleanPhone.length !== 11) {
    return {
      success: false,
      error: `ژمارەی مۆبایل دەبێت بە تەواوی ١١ ژمارە بێت، بەڵام ئێستا ${cleanPhone.length} ژمارەیە.`
    };
  }

  // پشکنینی تەمەن
  if (!data.age || data.age < 18 || data.age > 125) {
    return {
      success: false,
      error: 'تکایە تەمەنێکی گونجاو دیاریبکە (دەبێت ١٨ ساڵ یان زیاتر بێت).'
    };
  }

  // پشکنینی ناوی سیانی
  if (!data.fullName || data.fullName.trim().split(/\s+/).length < 2) {
    return {
      success: false,
      error: 'تکایە ناوی سیانی بە تەواوی بنووسە.'
    };
  }

  const newRecord: VoterRecord = {
    ...data,
    id: 'voter_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    voterNumber: cleanVoterNumber,
    phoneNumber: cleanPhone,
    fullName: data.fullName.trim(),
    qualification: data.qualification.trim(),
    role: data.role.trim(),
    notes: data.notes?.trim() || '',
    createdAt: new Date().toISOString()
  };

  const updated = [newRecord, ...voters];
  saveVoters(updated);

  return { success: true, voter: newRecord };
}

/**
 * نوێکردنەوەی داتای دەنگدەر
 */
export function updateVoter(id: string, data: Partial<Omit<VoterRecord, 'id' | 'createdAt'>>): { success: boolean; voter?: VoterRecord; error?: string } {
  const voters = getVoters();
  const index = voters.findIndex(v => v.id === id);
  if (index === -1) {
    return { success: false, error: 'دەنگدەر نەدۆزرایەوە.' };
  }

  const existing = voters[index];
  const newVoterNumber = data.voterNumber ? normalizeDigits(data.voterNumber) : existing.voterNumber;
  const newPhone = data.phoneNumber ? normalizeDigits(data.phoneNumber) : existing.phoneNumber;

  if (newVoterNumber.length !== 8) {
    return { success: false, error: 'ژمارەی دەنگدەر دەبێت بە تەواوی ٨ ژمارە بێت.' };
  }

  // پشکنینی دووبارەنەبوونەوە لەگەڵ کەسانی تر
  const duplicate = voters.find(v => v.voterNumber === newVoterNumber && v.id !== id);
  if (duplicate) {
    return {
      success: false,
      error: `ئەم ژمارەی دەنگدەرە پێشتر تۆمارکراوە بە ناوی "${duplicate.fullName}"!`
    };
  }

  if (newPhone.length !== 11) {
    return { success: false, error: 'ژمارەی مۆبایل دەبێت بە تەواوی ١١ ژمارە بێت.' };
  }

  const updatedRecord: VoterRecord = {
    ...existing,
    ...data,
    voterNumber: newVoterNumber,
    phoneNumber: newPhone,
    updatedAt: new Date().toISOString()
  };

  voters[index] = updatedRecord;
  saveVoters(voters);

  return { success: true, voter: updatedRecord };
}

/**
 * سڕینەوەی دەنگدەر
 */
export function deleteVoter(id: string): boolean {
  const voters = getVoters();
  const filtered = voters.filter(v => v.id !== id);
  if (filtered.length !== voters.length) {
    saveVoters(filtered);
    return true;
  }
  return false;
}

/**
 * سڕینەوەی دەستەجەمعی
 */
export function deleteMultipleVoters(ids: string[]): number {
  const voters = getVoters();
  const idSet = new Set(ids);
  const filtered = voters.filter(v => !idSet.has(v.id));
  saveVoters(filtered);
  return voters.length - filtered.length;
}

/**
 * پاککردنەوەی هەموو داتاکان
 */
export function clearAllVoters(): void {
  saveVoters([]);
}

/**
 * هێنانەوەی سەرلەنوێی نموونەکان
 */
export function resetSampleVoters(): VoterRecord[] {
  localStorage.removeItem(STORAGE_KEY);
  return getVoters();
}

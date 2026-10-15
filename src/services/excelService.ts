import * as XLSX from 'xlsx';
import { VoterRecord } from '../types/voter';

/**
 * ڕێکخستنی کاتی کوردی بۆ ناوی فایل و داتا
 */
export function formatKurdishDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('ckb-IQ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * ڕاکێشان و دابەزاندنی فایلی ئێکسڵ بە فۆرماتی .xlsx
 */
export function exportVotersToExcel(voters: VoterRecord[], customFileName?: string): boolean {
  try {
    if (!voters || voters.length === 0) {
      alert('هیچ داتایەک نییە بۆ ڕاکێشانی ئێکسڵ!');
      return false;
    }

    // گۆڕینی داتاکان بۆ ڕیزبەندی کوردی بە کۆڵۆمی ڕێکخراو
    const rows = voters.map((voter, index) => ({
      'ڕیزبەندی': index + 1,
      'ناوی سیانی': voter.fullName,
      'تەمەن': voter.age,
      'ژمارەی دەنگدەر': voter.voterNumber,
      'بڕوانامە': voter.qualification,
      'ژمارە مۆبایل': voter.phoneNumber,
      'ئەرک و بەرپرسیارێتی': voter.role,
      'تێبینییەکان': voter.notes || '',
      'ڕێکەوتی تۆمارکردن': formatKurdishDate(voter.createdAt),
    }));

    // دروستکردنی پەڕەی کار (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // دیاریکردنی ئاراستەی پەڕەکە بە ڕاست بۆ چەپ (RTL) لە ناو ئێکسڵ
    if (!worksheet['!views']) {
      worksheet['!views'] = [];
    }
    worksheet['!views'].push({ RTL: true });

    // دیاریکردنی پانی کۆڵۆمەکان بە شێوەیەکی خۆکار بۆ ئەوەی دەقەکان نەبڕدرێن
    worksheet['!cols'] = [
      { wch: 8 },  // ڕیزبەندی
      { wch: 28 }, // ناوی سیانی
      { wch: 10 }, // تەمەن
      { wch: 18 }, // ژمارەی دەنگدەر
      { wch: 18 }, // بڕوانامە
      { wch: 18 }, // ژمارە مۆبایل
      { wch: 24 }, // ئەرک و بەرپرسیارێتی
      { wch: 25 }, // تێبینییەکان
      { wch: 22 }, // ڕێکەوت
    ];

    // دروستکردنی کتێبی کار (Workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'لیستی دەنگدەران');

    // ناوی فایلی دابەزێنراو
    const today = new Date().toISOString().slice(0, 10);
    const fileName = customFileName || `لیستی_دەنگدەران_${today}.xlsx`;

    // نووسین و دابەزاندنی فایلەکە لە براوزەردا
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    alert('هەڵەیەک ڕوویدا لە کاتی ڕاکێشانی ئێکسڵدا.');
    return false;
  }
}

/**
 * هەناردەکردنی تەنها یەک دەنگدەر بە شێوەی فایلی ئێکسڵ
 */
export function exportSingleVoterToExcel(voter: VoterRecord): boolean {
  const safeName = voter.fullName.replace(/\s+/g, '_');
  return exportVotersToExcel([voter], `زانیاری_${safeName}_${voter.voterNumber}.xlsx`);
}

/**
 * هەناردەکردنی داتا بە فۆرماتی JSON بۆ باکئەپ و پاراستنی سەلامەتی داتاکان
 */
export function exportBackupJSON(voters: VoterRecord[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(voters, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `voters_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

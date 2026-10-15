/**
 * دروستکردنی فایلی تەواو سەربەخۆ (.html) بۆ ئەوەی بەکارهێنەر لەسەر کۆمپیوتەرەکەی دایبەزێنێت
 * و بەبێ هیچ کێشەیەک بە دوو کلیک لە Chrome یان Edge یان Firefox بیکاتەوە، تەنانەت بێ ئینتەرنێتیش!
 */
export function downloadOfflineHTML(): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>سیستەمی تۆماری دەنگدەران و ستاف</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Vazirmatn', system-ui, sans-serif; }
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">

  <!-- Header -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md text-xl font-bold">
          ✓
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-900">سیستەمی تۆماری دەنگدەران و ستاف</h1>
          <p class="text-xs text-slate-500">فایلی سەربەخۆی کۆمپیوتەر - تۆمارکردنی ناوخۆیی و ڕاکێشانی ئێکسڵ</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="exportAllExcel()" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer transition">
          📊 ڕاکێشانی هەموو بە ئێکسڵ
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8 space-y-8">
    
    <!-- Banner -->
    <div class="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="space-y-1">
        <h2 class="text-base font-bold text-emerald-400">مەرجە سەرەکییەکان بە تەواوی کاران:</h2>
        <p class="text-xs text-slate-300">
          • ژمارەی دەنگدەر: بە تەواوی ٨ ژمارە بێ دووبارەبوونەوە &nbsp;|&nbsp; • مۆبایل: بە تەواوی ١١ ژمارە &nbsp;|&nbsp; • ڕاکێشانی ئێکسڵ
        </p>
      </div>
      <div class="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono">
        کۆی دەنگدەران: <span id="voterCountBadge" class="font-bold text-white">0</span> کەس
      </div>
    </div>

    <!-- Entry Form -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="px-6 py-4 bg-slate-900 text-white font-bold text-base flex items-center justify-between">
        <span>فۆرمی داخلکردنی زانیاری</span>
        <span class="text-xs font-normal text-emerald-400">تکایە هەموو خانەکان پڕبکەرەوە</span>
      </div>

      <form id="voterForm" onsubmit="handleFormSubmit(event)" class="p-6 space-y-6">
        <div id="errorAlert" class="hidden p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">ناوی سیانی <span class="text-red-500">*</span></label>
            <input id="fullName" type="text" required placeholder="ناوی سیانی بە تەواوی..." class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-medium">
          </div>

          <!-- Age -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">تەمەن <span class="text-red-500">*</span></label>
            <input id="age" type="number" min="18" max="120" required placeholder="وەک: 30" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-medium">
          </div>

          <!-- Voter Number (8 digits unique) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-sm font-semibold text-slate-700">ژمارەی دەنگدەر (٨ ژمارە) <span class="text-red-500">*</span></label>
              <span id="voterNumCounter" class="text-xs font-mono font-bold text-slate-400">0 / 8</span>
            </div>
            <input id="voterNumber" type="text" maxlength="8" required oninput="checkVoterNumberInput()" placeholder="٨ ژمارە بنووسە..." class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-mono tracking-wider font-bold">
            <p id="voterNumMsg" class="text-xs mt-1 text-slate-400">دەبێت بە تەواوی ٨ ژمارە بێت و دووبارە نەبێتەوە.</p>
          </div>

          <!-- Mobile (11 digits) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-sm font-semibold text-slate-700">ژمارە مۆبایل (١١ ژمارە) <span class="text-red-500">*</span></label>
              <span id="phoneCounter" class="text-xs font-mono font-bold text-slate-400">0 / 11</span>
            </div>
            <input id="phoneNumber" type="text" maxlength="11" required oninput="checkPhoneInput()" placeholder="0750xxxxxxx" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-mono tracking-wider font-bold">
            <p id="phoneMsg" class="text-xs mt-1 text-slate-400">دەبێت بە تەواوی ١١ ژمارە بێت.</p>
          </div>

          <!-- Qualification -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">بڕوانامە <span class="text-red-500">*</span></label>
            <select id="qualification" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium outline-hidden">
              <option value="نەخوێندەوار">نەخوێندەوار</option>
              <option value="سەرەتایی">سەرەتایی</option>
              <option value="ناوەندی">ناوەندی</option>
              <option value="ئامادەیی">ئامادەیی</option>
              <option value="پەیمانگا (دبلۆم)">پەیمانگا (دبلۆم)</option>
              <option value="بەکالۆریۆس" selected>بەکالۆریۆس</option>
              <option value="ماستەر">ماستەر</option>
              <option value="دکتۆرا">دکتۆرا</option>
            </select>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">ئەرک و بەرپرسیارێتی <span class="text-red-500">*</span></label>
            <input id="role" type="text" required placeholder="ئەرک و بەرپرسیارێتی بنووسە..." class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-medium">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">تێبینی و ناوی بنکە (ئارەزوومەندانە):</label>
          <input id="notes" type="text" placeholder="ناوی قوتابخانە یان بنکەی دەنگدان..." class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 outline-hidden">
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button type="reset" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer">
            پاککردنەوە
          </button>
          <button type="submit" class="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer">
            ➕ تۆمارکردن لە داتابەیس
          </button>
        </div>
      </form>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <input id="searchInput" oninput="renderTable()" type="text" placeholder="گەڕان بەپێی ناو، ٨ ژمارەی دەنگدەر، مۆبایل..." class="w-full sm:w-80 px-4 py-2 text-sm bg-white rounded-xl border border-slate-300 outline-hidden font-medium">
        <div class="flex items-center gap-2">
          <button onclick="exportAllExcel()" class="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer">
            📊 داگرتنی هەموو بە ئێکسڵ
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right text-sm">
          <thead class="bg-slate-100 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
            <tr>
              <th class="py-3 px-4 text-center">#</th>
              <th class="py-3 px-4">ناوی سیانی</th>
              <th class="py-3 px-4 text-center">تەمەن</th>
              <th class="py-3 px-4">ژمارەی دەنگدەر</th>
              <th class="py-3 px-4">ژمارە مۆبایل</th>
              <th class="py-3 px-4">بڕوانامە</th>
              <th class="py-3 px-4">ئەرک</th>
              <th class="py-3 px-4 text-center">کردارەکان</th>
            </tr>
          </thead>
          <tbody id="voterTableBody" class="divide-y divide-slate-100"></tbody>
        </table>
      </div>
    </div>
  </main>

  <script>
    const STORAGE_KEY = 'offline_kurdish_voters_db';
    let voters = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
      renderTable();
    }

    function cleanDigits(str) {
      if (!str) return '';
      const ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
      const fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
      let res = str;
      for(let i=0; i<10; i++){
        res = res.replaceAll(ar[i], i).replaceAll(fa[i], i);
      }
      return res.replace(/\\D/g, '');
    }

    function checkVoterNumberInput() {
      const el = document.getElementById('voterNumber');
      el.value = cleanDigits(el.value);
      document.getElementById('voterNumCounter').innerText = el.value.length + ' / 8';
      const existing = voters.find(v => v.voterNumber === el.value);
      const msg = document.getElementById('voterNumMsg');
      if (existing) {
        msg.innerText = 'ئەم ژمارەیە پێشتر تۆمارکراوە بە ناوی (' + existing.fullName + ')!';
        msg.className = 'text-xs mt-1 text-red-600 font-bold';
      } else if (el.value.length === 8) {
        msg.innerText = 'ژمارەی دەنگدەر دروستە و دووبارە نییە.';
        msg.className = 'text-xs mt-1 text-emerald-600 font-semibold';
      } else {
        msg.innerText = 'دەبێت بە تەواوی ٨ ژمارە بێت.';
        msg.className = 'text-xs mt-1 text-slate-400';
      }
    }

    function checkPhoneInput() {
      const el = document.getElementById('phoneNumber');
      el.value = cleanDigits(el.value);
      document.getElementById('phoneCounter').innerText = el.value.length + ' / 11';
      const msg = document.getElementById('phoneMsg');
      if (el.value.length === 11) {
        msg.innerText = 'ژمارەی مۆبایل دروستە.';
        msg.className = 'text-xs mt-1 text-emerald-600 font-semibold';
      } else {
        msg.innerText = 'دەبێت بە تەواوی ١١ ژمارە بێت.';
        msg.className = 'text-xs mt-1 text-slate-400';
      }
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const errBox = document.getElementById('errorAlert');
      errBox.classList.add('hidden');

      const fullName = document.getElementById('fullName').value.trim();
      const age = parseInt(document.getElementById('age').value);
      const voterNumber = cleanDigits(document.getElementById('voterNumber').value);
      const phoneNumber = cleanDigits(document.getElementById('phoneNumber').value);
      const qualification = document.getElementById('qualification').value;
      const role = document.getElementById('role').value;
      const notes = document.getElementById('notes').value.trim();

      if (voterNumber.length !== 8) {
        showError('ژمارەی دەنگدەر دەبێت بە تەواوی ٨ ژمارە بێت!');
        return;
      }

      const dup = voters.find(v => v.voterNumber === voterNumber);
      if (dup) {
        showError('ئەم ژمارەی دەنگدەرە پێشتر تۆمارکراوە بە ناوی: ' + dup.fullName);
        return;
      }

      if (phoneNumber.length !== 11) {
        showError('ژمارەی مۆبایل دەبێت بە تەواوی ١١ ژمارە بێت!');
        return;
      }

      const newVoter = {
        id: 'v_' + Date.now(),
        fullName,
        age,
        voterNumber,
        phoneNumber,
        qualification,
        role,
        notes,
        createdAt: new Date().toLocaleDateString('ckb-IQ')
      };

      voters.unshift(newVoter);
      save();
      document.getElementById('voterForm').reset();
      document.getElementById('voterNumCounter').innerText = '0 / 8';
      document.getElementById('phoneCounter').innerText = '0 / 11';

      if (confirm('بە سەرکەوتوویی تۆمارکرا! ئایا دەتەوێت ئێستا فایلی ئێکسڵ (Excel) بۆ ئەم کەسە دابەزێنیت؟')) {
        exportSingleExcel(newVoter);
      }
    }

    function showError(msg) {
      const errBox = document.getElementById('errorAlert');
      errBox.innerText = msg;
      errBox.classList.remove('hidden');
    }

    function deleteVoter(id) {
      if (confirm('ئایا دڵنیایت لە سڕینەوە؟')) {
        voters = voters.filter(v => v.id !== id);
        save();
      }
    }

    function exportSingleExcel(v) {
      exportArrayToExcel([v], 'زانیاری_' + v.fullName.replace(/\\s+/g, '_') + '.xlsx');
    }

    function exportAllExcel() {
      if (voters.length === 0) {
        alert('هیچ داتایەک لە داتابەیسدا نییە!');
        return;
      }
      exportArrayToExcel(voters, 'لیستی_دەنگدەران_' + new Date().toISOString().slice(0,10) + '.xlsx');
    }

    function exportArrayToExcel(list, filename) {
      const rows = list.map((v, i) => ({
        'زنجیرە': i + 1,
        'ناوی سیانی': v.fullName,
        'تەمەن': v.age,
        'ژمارەی دەنگدەر': v.voterNumber,
        'بڕوانامە': v.qualification,
        'ژمارە مۆبایل': v.phoneNumber,
        'ئەرک و بەرپرسیارێتی': v.role,
        'تێبینییەکان': v.notes || ''
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!views'] = [{ RTL: true }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'دەنگدەران');
      XLSX.writeFile(wb, filename);
    }

    function renderTable() {
      const tbody = document.getElementById('voterTableBody');
      const term = (document.getElementById('searchInput').value || '').trim().toLowerCase();
      document.getElementById('voterCountBadge').innerText = voters.length;

      const filtered = voters.filter(v => 
        !term || 
        v.fullName.toLowerCase().includes(term) ||
        v.voterNumber.includes(term) ||
        v.phoneNumber.includes(term) ||
        v.qualification.includes(term) ||
        v.role.includes(term)
      );

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-slate-400">هیچ داتایەک نەدۆزرایەوە</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map((v, idx) => \`
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-4 text-center text-slate-400 font-mono">\${idx + 1}</td>
          <td class="py-3 px-4 font-bold text-slate-900">\${v.fullName}</td>
          <td class="py-3 px-4 text-center">\${v.age}</td>
          <td class="py-3 px-4"><span class="font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">\${v.voterNumber}</span></td>
          <td class="py-3 px-4 font-mono font-semibold" dir="ltr">\${v.phoneNumber}</td>
          <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">\${v.qualification}</span></td>
          <td class="py-3 px-4"><span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">\${v.role}</span></td>
          <td class="py-3 px-4 text-center">
            <button onclick='exportSingleExcel(\${JSON.stringify(v)})' class="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer mr-1" title="ئێکسڵ">📊</button>
            <button onclick="deleteVoter('\${v.id}')" class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer" title="سڕینەوە">🗑️</button>
          </td>
        </tr>
      \`).join('');
    }

    renderTable();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'سیستەمی_تۆماری_دەنگدەران.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

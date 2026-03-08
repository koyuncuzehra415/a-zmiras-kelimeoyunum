// Ankara Ağzı Kelime Veritabanı
const ankaraData = [
    {w: "Abdaslık", m: "Abdest alınan ve el yüz yıkanan yer."},
    {w: "Alamuk", m: "Yıkılmış veya yarım bırakılmış ev."},
    {w: "Almazlık", m: "Oda içinde banyo için ayrılan yer, gusülhane."},
    {w: "Asma oda", m: "İki üç basamak merdivenle çıkılan oda."},
    {w: "Atanak", m: "Misafirlerin palto asması için duvara uzatılan ağaç."},
    {w: "Avla", m: "Bahçelerin etrafına dallardan yapılan çit."},
    {w: "Avlum", m: "Ayakyolu, hela."},
    {w: "Köhle", m: "Evlerdeki baca."},
    {w: "Yuvak", m: "Toprak damı düzlemek için kullanılan silindir taş."},
    {w: "Iza", m: "Kabuklu buğday."},
    {w: "Etlik", m: "Sucuk, pastırma gibi kışlık yiyecekler."},
    {w: "Hüyük", m: "Tarladaki taş yığınları."},
    {w: "Irgatlık", m: "Hasat mevsimi, ekin biçme zamanı."},
    {w: "Höşmelim", m: "Mısır unundan yapılan bir çeşit tepsi böreği."},
    {w: "Ağıl", m: "Küçükbaş hayvanların gecelediği barınak."},
    {w: "Çambardak", m: "Çam ağacı oyularak yapılan su kabı."},
    {w: "Abartma", m: "Değirmen çöreği."},
    {w: "Cıba", m: "Tüyü yeni kırkılmış koyun veya keçi."},
    {w: "Büğek", m: "Buzağıların emmesini engellemek için takılan araç."}
];

let mistakes = [];
let currentSelectedWord = null;

// Uygulamayı Başlatan Fonksiyon
function unlockApp() {
    const key = document.getElementById('explore-key');
    if (key) key.classList.add('hidden');
    
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('top-bar').classList.remove('hidden');
    document.getElementById('top-bar').classList.add('flex');
}

// Sayfa Değiştirme Fonksiyonu
function showPage(pageId) {
    document.querySelectorAll('main > div').forEach(div => {
        div.classList.remove('active-page');
        div.classList.add('hidden');
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active-page');
    }

    // Sayfa içeriğini yükle
    if (pageId === 'game') startMatchGame();
    if (pageId === 'dictionary') loadDict();
    if (pageId === 'daily') loadDaily();
}

// Kelime Eşleştirme Oyunu
function startMatchGame() {
    const wCol = document.getElementById('words-col');
    const mCol = document.getElementById('meanings-col');
    wCol.innerHTML = ''; 
    mCol.innerHTML = '';
    
    // Rastgele 6 kelime seç
    const roundData = [...ankaraData].sort(() => 0.5 - Math.random()).slice(0, 6);
    const shuffledMeanings = [...roundData].sort(() => 0.5 - Math.random());

    // Kelimeleri Sütuna Ekle
    roundData.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'glass-card p-4 rounded-xl cursor-pointer hover:bg-orange-50 border-2 border-transparent font-bold transition-all';
        btn.innerText = item.w;
        btn.onclick = () => {
            document.querySelectorAll('#words-col div').forEach(d => d.classList.remove('border-orange-500', 'bg-orange-50'));
            btn.classList.add('border-orange-500', 'bg-orange-50');
            currentSelectedWord = item;
        };
        wCol.appendChild(btn);
    });

    // Anlamları Sütuna Ekle
    shuffledMeanings.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'glass-card p-4 rounded-xl cursor-pointer hover:bg-blue-50 text-sm leading-tight transition-all';
        btn.innerText = item.m;
        btn.onclick = () => {
            if (!currentSelectedWord) return;

            if (currentSelectedWord.m === item.m) {
                btn.classList.add('bg-emerald-500', 'text-white', 'pointer-events-none');
                btn.innerText = "✓ Doğru";
                // Eşleşen kelimeyi bul ve pasif yap
                document.querySelectorAll('#words-col div').forEach(d => {
                    if (d.innerText === currentSelectedWord.w) {
                        d.classList.replace('hover:bg-orange-50', 'bg-slate-200');
                        d.classList.add('pointer-events-none', 'opacity-50');
                    }
                });
            } else {
                // Yanlış cevap
                if (!mistakes.some(x => x.w === currentSelectedWord.w)) {
                    mistakes.push(currentSelectedWord);
                    updateMistakesUI();
                }
                btn.classList.add('bg-red-200');
                setTimeout(() => btn.classList.remove('bg-red-200'), 500);
            }
            currentSelectedWord = null;
            document.querySelectorAll('#words-col div').forEach(d => d.classList.remove('border-orange-500', 'bg-orange-50'));
        };
        mCol.appendChild(btn);
    });
}

// Hataları Güncelle
function updateMistakesUI() {
    const list = document.getElementById('mistakes-list');
    if (mistakes.length === 0) return;
    
    list.innerHTML = mistakes.map(item => `
        <div class="bg-white p-5 rounded-3xl border-l-4 border-red-500 shadow-sm text-left">
            <h4 class="font-bold text-red-600 uppercase text-sm">${item.w}</h4>
            <p class="text-slate-600 text-xs mt-1">${item.m}</p>
        </div>
    `).join('');
}

// Sözlüğü Yükle
function loadDict() {
    const list = document.getElementById('dict-list');
    list.innerHTML = ankaraData.map(item => `
        <div class="glass-card p-4 rounded-2xl text-left">
            <h4 class="font-bold text-blue-700 uppercase text-sm mb-1">${item.w}</h4>
            <p class="text-slate-500 text-xs italic">${item.m}</p>
        </div>
    `).join('');
}

// Günün Kelimesini Yükle
function loadDaily() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const item = ankaraData[dayOfYear % ankaraData.length];
    document.getElementById('daily-word').innerText = item.w;
    document.getElementById('daily-mean').innerText = item.m;
}
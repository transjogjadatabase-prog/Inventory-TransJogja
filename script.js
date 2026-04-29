// CAT COLORS & IOS
var CAT_COLORS={
  'semua':'linear-gradient(145deg,#003F88,#00306A)',
  '_kantor':'linear-gradient(145deg,#1565C0,#0D47A1)',
  '_halte':'linear-gradient(145deg,#E65100,#BF360C)',
  'ATK':'linear-gradient(145deg,#4A90E2,#1565C0)',
  'Elektronik':'linear-gradient(145deg,#5E35B1,#311B92)',
  'Furniture':'linear-gradient(145deg,#FF8F00,#E65100)',
  'Kebersihan':'linear-gradient(145deg,#00ACC1,#006064)',
  'Fasilitas':'linear-gradient(145deg,#43A047,#1B5E20)',
  'Perawatan':'linear-gradient(145deg,#E53935,#B71C1C)',
};
var CAT_EMOJIS={'semua':'📦','_kantor':'🏢','_halte':'🚌','ATK':'📋','Elektronik':'💻','Furniture':'🪑','Kebersihan':'🧹','Fasilitas':'⭐','Perawatan':'🔧'};


// =========== DATA ===========
var barang = [
  {id:1,nama:'Kertas A4',lokasi:'Kantor',kat:'ATK',sat:'rim',stok:25,min:5,emoji:'📄'},
  {id:2,nama:'Pulpen Ballpoint',lokasi:'Kantor',kat:'ATK',sat:'pcs',stok:50,min:10,emoji:'🖊️'},
  {id:3,nama:'Toner Printer',lokasi:'Kantor',kat:'ATK',sat:'unit',stok:3,min:2,emoji:'🖨️'},
  {id:4,nama:'Laptop Dell',lokasi:'Kantor',kat:'Elektronik',sat:'unit',stok:8,min:1,emoji:'💻'},
  {id:5,nama:'Mouse Wireless',lokasi:'Kantor',kat:'Elektronik',sat:'unit',stok:12,min:3,emoji:'⌨️'},
  {id:6,nama:'Kursi Kerja',lokasi:'Kantor',kat:'Furniture',sat:'unit',stok:15,min:2,emoji:'🪑'},
  {id:7,nama:'Lemari Arsip',lokasi:'Kantor',kat:'Furniture',sat:'unit',stok:4,min:1,emoji:'🗄️'},
  {id:8,nama:'Cairan Pembersih',lokasi:'Kantor',kat:'Kebersihan',sat:'botol',stok:20,min:5,emoji:'🧴'},
  {id:9,nama:'Kabel HDMI',lokasi:'Kantor',kat:'Elektronik',sat:'pcs',stok:2,min:3,emoji:'🔌'},
  {id:10,nama:'Tempat Sampah',lokasi:'Halte',kat:'Kebersihan',sat:'unit',stok:6,min:2,emoji:'🗑️'},
  {id:11,nama:'Sapu',lokasi:'Halte',kat:'Kebersihan',sat:'unit',stok:4,min:2,emoji:'🧹'},
  {id:12,nama:'Lampu LED',lokasi:'Halte',kat:'Elektronik',sat:'unit',stok:18,min:4,emoji:'💡'},
  {id:13,nama:'Papan Informasi',lokasi:'Halte',kat:'Fasilitas',sat:'unit',stok:2,min:1,emoji:'🪧'},
  {id:14,nama:'Ember',lokasi:'Halte',kat:'Kebersihan',sat:'unit',stok:3,min:2,emoji:'🪣'},
  {id:15,nama:'Cat Tembok',lokasi:'Halte',kat:'Perawatan',sat:'kaleng',stok:8,min:3,emoji:'🔧'},
  {id:16,nama:'Clipboard',lokasi:'Halte',kat:'ATK',sat:'pcs',stok:10,min:3,emoji:'📋'},
];
var transaksi = [
  {id:1,bid:1,tipe:'masuk',jml:50,tgl:'2025-01-05',ket:'Pengadaan awal',lok:'Kantor'},
  {id:2,bid:2,tipe:'masuk',jml:100,tgl:'2025-01-05',ket:'Pengadaan awal',lok:'Kantor'},
  {id:3,bid:1,tipe:'keluar',jml:25,tgl:'2025-01-10',ket:'Pemakaian',lok:'Kantor'},
  {id:4,bid:10,tipe:'masuk',jml:10,tgl:'2025-01-06',ket:'Pengadaan halte',lok:'Halte'},
  {id:5,bid:10,tipe:'keluar',jml:4,tgl:'2025-01-15',ket:'Rusak diganti',lok:'Halte'},
  {id:6,bid:12,tipe:'masuk',jml:24,tgl:'2025-01-07',ket:'Pengadaan lampu',lok:'Halte'},
  {id:7,bid:12,tipe:'keluar',jml:6,tgl:'2025-01-20',ket:'Penggantian mati',lok:'Halte'},
];
var nextId=17,nextTrxId=8;
var activeCat='semua',searchQ='',activeBarangId=null;
var rhTab='semua',rhSearch='';

// =========== HELPERS ===========
function getB(id){return barang.find(b=>b.id==id)}
function stockStatus(b){if(b.stok<=0)return'out';if(b.stok<=b.min)return'low';return'ok'}
function statusLabel(s){return s==='ok'?'Aman':s==='low'?'Menipis':'Habis'}
function todayStr(){var d=new Date(),m=String(d.getMonth()+1).padStart(2,'0'),dd=String(d.getDate()).padStart(2,'0');return d.getFullYear()+'-'+m+'-'+dd}
function getCategories(){return['semua',...new Set(barang.map(b=>b.kat))]}
function getLokCount(l){return barang.filter(b=>b.lokasi===l).length}
function getCatCount(c){return c==='semua'?barang.length:barang.filter(b=>b.kat===c).length}
function toast(msg,type){var t=document.getElementById('toast');t.textContent=msg;t.className='toast '+(type||'');t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2800)}
function focusSearch(){document.getElementById('search-input').focus()}

// =========== CATBAR ===========
function buildCatbar(){
  var cats=getCategories();
  var defs=[
    {val:'semua',name:'Semua',cnt:barang.length},
    {val:'_kantor',name:'Kantor',cnt:getLokCount('Kantor')},
    {val:'_halte',name:'Halte',cnt:getLokCount('Halte')},
  ];
  cats.filter(c=>c!=='semua').forEach(c=>defs.push({val:c,name:c,cnt:getCatCount(c)}));
  document.getElementById('catbar-inner').innerHTML=defs.map(def=>{
    var active=activeCat===def.val;
    var bg=CAT_COLORS[def.val]||CAT_COLORS[def.name]||'linear-gradient(145deg,#78909C,#37474F)';
    var em=CAT_EMOJIS[def.val]||CAT_EMOJIS[def.name]||'📦';
    return '<div class="cat-item'+(active?' active':'')+'" onclick="setCat(\''+def.val+'\',this)">'
      +'<div class="cat-circle" style="'+(active?'background:'+bg+';border-color:transparent':'')+'"><span style="font-size:22px;'+(active?'':'filter:grayscale(1) opacity(.45)')+'">'+em+'</span></div>'
      +'<div class="cat-name">'+def.name+'</div>'
      +'<div class="cat-count">'+def.cnt+'</div></div>';
  }).join('');
}
function catItem(val,icon,name,cnt,active){return '';}
function setCat(val,el){
  activeCat=val;
  document.querySelectorAll('.cat-item').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  renderGrid();
}

// =========== GRID ===========
function getFilteredBarang(){
  return barang.filter(b=>{
    if(activeCat==='_kantor'&&b.lokasi!=='Kantor')return false;
    if(activeCat==='_halte'&&b.lokasi!=='Halte')return false;
    if(activeCat!=='semua'&&activeCat!=='_kantor'&&activeCat!=='_halte'&&b.kat!==activeCat)return false;
    if(searchQ&&!b.nama.toLowerCase().includes(searchQ.toLowerCase())&&!b.kat.toLowerCase().includes(searchQ.toLowerCase()))return false;
    return true;
  });
}
function renderGrid(){
  var list=getFilteredBarang();
  document.getElementById('item-count').textContent=list.length+' BARANG';
  var g=document.getElementById('products-grid');
  if(!list.length){g.innerHTML='<div class="empty"><div class="empty-icon">🔍</div><p>Tidak ada barang ditemukan</p></div>';return;}
  g.innerHTML=list.map((b,i)=>{
    var st=stockStatus(b),pct=Math.min(100,b.min?Math.round(b.stok/(b.min*5)*100):40);
    var trxB=transaksi.filter(t=>t.bid===b.id);
    var tm=trxB.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
    var tk=trxB.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
    var imgSection;
    if(b.foto){
      imgSection='<div class="pcard-img-wrap">'
        +'<img class="pcard-photo" src="'+b.foto+'" alt="'+b.nama+'" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">'
        +'<div class="pcard-img lokasi-'+b.lokasi.toLowerCase()+'" style="display:none">'
        +'<span class="pcard-emoji" style="animation:float 3s ease-in-out '+(i*0.3).toFixed(1)+'s infinite">'+b.emoji+'</span>'
        +'</div>'
        +'<span class="pcard-weight">'+b.sat+'</span>'
        +'<button class="photo-upload-btn" onclick="event.stopPropagation();openPhotoModal('+b.id+')">📷 Edit</button>'
        +'<span class="loc-badge '+b.lokasi.toLowerCase()+'">'+b.lokasi+'</span>'
        +'</div>';
    } else {
      imgSection='<div class="pcard-img lokasi-'+b.lokasi.toLowerCase()+'">'
        +'<span class="pcard-emoji" style="animation:float 3s ease-in-out '+(i*0.3).toFixed(1)+'s infinite">'+b.emoji+'</span>'
        +'<span class="pcard-weight">'+b.sat+'</span>'
        +'<button class="photo-upload-btn" onclick="event.stopPropagation();openPhotoModal('+b.id+')">📷</button>'
        +'<span class="loc-badge '+b.lokasi.toLowerCase()+'">'+b.lokasi+'</span>'
        +'</div>';
    }
    return '<div class="pcard" style="animation-delay:'+(i*0.055).toFixed(2)+'s" onclick="openTrxModal('+b.id+')">'
      +imgSection
      +'<div class="pcard-body">'
      +'<div class="pcard-name">'+b.nama+'</div>'
      +'<div class="pcard-cat">'+b.kat+'</div>'
      // Editable minimum stock row
      +'<div class="pcard-min-row" onclick="event.stopPropagation()">'
        +'<span class="pcard-min-label">Stok Min</span>'
        +'<div class="pcard-min-val">'
          +'<span class="pcard-min-num" id="min-num-'+b.id+'">'+b.min+' '+b.sat+'</span>'
          +'<button class="btn-min-edit" onclick="openMinEdit('+b.id+')" title="Edit minimum stok">✏</button>'
        +'</div>'
      +'</div>'
      +'<div class="min-edit-inline" id="min-edit-'+b.id+'">'
        +'<input class="min-edit-input" type="number" id="min-input-'+b.id+'" value="'+b.min+'" min="0" placeholder="Min" onclick="event.stopPropagation()" onkeydown="if(event.key===\'Enter\')saveMin('+b.id+')">'
        +'<button class="btn-min-save" onclick="saveMin('+b.id+')">Simpan</button>'
        +'<button class="btn-min-cancel" onclick="cancelMin('+b.id+')">✕</button>'
      +'</div>'
      +'<div class="stock-bar-wrap"><div class="stock-bar-track"><div class="stock-bar-fill '+st+'" style="width:'+pct+'%"></div></div></div>'
      +'<div class="pcard-foot">'
      +'<div class="pcard-stock"><span class="pcard-stok-num '+st+'">'+b.stok+'</span><span class="pcard-unit"> '+b.sat+'</span></div>'
      +'<div class="action-btns">'
      +'<button class="btn-keluar" onclick="quickTrx(event,'+b.id+',\'keluar\')">− Keluar</button>'
      +'<button class="btn-masuk" onclick="quickTrx(event,'+b.id+',\'masuk\')">+ Masuk</button>'
      +'</div></div></div></div>';
  }).join('');
  updateLowCount();
}
function doSearch(v){searchQ=v;renderGrid()}

// =========== QUICK TRX ===========
function quickTrx(e,id,tipe){
  e.stopPropagation();
  openTrxModal(id);
}

// =========== TRX MODAL ===========
function openTrxModal(id){
  activeBarangId=id;
  var b=getB(id);
  var trxB=transaksi.filter(t=>t.bid===id);
  var tm=trxB.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
  var tk=trxB.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
  var icBg2=CAT_COLORS[b.kat]||'linear-gradient(145deg,#78909C,#37474F)';
  var mimg=document.getElementById('mimg');mimg.style.background=icBg2;mimg.textContent=b.emoji;
  document.getElementById('mtitle').textContent=b.nama;
  document.getElementById('mcat').textContent=b.kat+' — '+b.lokasi;
  document.getElementById('md-masuk').textContent=tm;
  document.getElementById('md-keluar').textContent=tk;
  document.getElementById('md-sisa').textContent=b.stok;
  document.getElementById('mf-jumlah').value='';
  document.getElementById('mf-tanggal').value=todayStr();
  document.getElementById('mf-ket').value='';
  document.getElementById('mf-pemohon').value='';
  document.getElementById('mf-pemohon-group').style.display='none';
  document.getElementById('modal-trx').classList.add('open');
}
function doTrx(tipe){
  var b=getB(activeBarangId);
  var jml=parseInt(document.getElementById('mf-jumlah').value)||0;
  var tgl=document.getElementById('mf-tanggal').value;
  var ket=document.getElementById('mf-ket').value||'-';
  var pemohon=document.getElementById('mf-pemohon').value.trim();
  if(!jml||!tgl){toast('⚠️ Jumlah dan tanggal wajib diisi','err');return}
  if(tipe==='keluar'&&!pemohon){toast('⚠️ Nama pemohon wajib diisi untuk barang keluar','err');return}
  if(tipe==='keluar'&&jml>b.stok){toast('❌ Stok tidak cukup! Tersisa '+b.stok+' '+b.sat,'err');return}
  if(tipe==='masuk')b.stok+=jml;else b.stok-=jml;
  transaksi.push({id:nextTrxId++,bid:b.id,tipe:tipe,jml:jml,tgl:tgl,ket:ket,lok:b.lokasi,pemohon:tipe==='keluar'?pemohon:''});
  document.getElementById('md-masuk').textContent=transaksi.filter(t=>t.bid===b.id&&t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
  document.getElementById('md-keluar').textContent=transaksi.filter(t=>t.bid===b.id&&t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
  document.getElementById('md-sisa').textContent=b.stok;
  document.getElementById('mf-jumlah').value='';
  document.getElementById('mf-ket').value='';
  document.getElementById('mf-pemohon').value='';
  document.getElementById('mf-pemohon-group').style.display='none';
  closeModal('modal-trx');
  renderGrid();buildCatbar();
  toast(tipe==='masuk'?'✅ Barang masuk berhasil dicatat':'✅ Barang keluar berhasil dicatat','ok');
}

// =========== ADD MODAL ===========
function openAddModal(){
  selectedEmoji='📦';
  document.getElementById('a-emoji').value='📦';
  document.getElementById('ipt-emoji-preview').textContent='📦';
  document.getElementById('ipt-name-preview').textContent='Kardus / Umum';
  document.getElementById('modal-add').classList.add('open');
  updateAddPreview();
}
function updateAddPreview(){
  var lok=document.getElementById('a-lokasi').value;
  var em=document.getElementById('a-emoji').value;
  var kat=document.getElementById('a-kat').value.trim();
  var prev=document.getElementById('add-preview');
  var bg=CAT_COLORS[kat]||(lok==='Kantor'?'linear-gradient(145deg,#4A90E2,#1565C0)':'linear-gradient(145deg,#FF8F00,#E65100)');
  prev.style.background=bg;
  prev.textContent=em;
}
function simpanBarang(){
  var nama=document.getElementById('a-nama').value.trim();
  var lok=document.getElementById('a-lokasi').value;
  var kat=document.getElementById('a-kat').value.trim();
  var sat=document.getElementById('a-sat').value.trim();
  var stok=parseInt(document.getElementById('a-stok').value)||0;
  var min=parseInt(document.getElementById('a-min').value)||5;
  var emoji=document.getElementById('a-emoji').value;
  if(!nama||!kat||!sat){toast('⚠️ Nama, kategori & satuan wajib diisi','err');return}
  barang.push({id:nextId++,nama,lokasi:lok,kat,sat,stok,min,emoji});
  closeModal('modal-add');
  document.getElementById('a-nama').value='';document.getElementById('a-kat').value='';document.getElementById('a-sat').value='';document.getElementById('a-stok').value='';
  buildCatbar();renderGrid();
  toast('✅ Barang "'+nama+'" berhasil ditambahkan','ok');
}

// =========== MIN STOCK EDIT ===========
function openMinEdit(id){
  var el=document.getElementById('min-edit-'+id);
  var inp=document.getElementById('min-input-'+id);
  var b=getB(id);
  if(!el)return;
  document.querySelectorAll('.min-edit-inline').forEach(function(e){e.classList.remove('visible');});
  el.classList.add('visible');
  inp.value=b.min;
  inp.focus();inp.select();
}
function saveMin(id){
  var inp=document.getElementById('min-input-'+id);
  var val=parseInt(inp.value);
  if(isNaN(val)||val<0){toast('⚠️ Nilai minimum tidak valid','err');return}
  var b=getB(id);
  b.min=val;
  document.getElementById('min-edit-'+id).classList.remove('visible');
  document.getElementById('min-num-'+id).textContent=val+' '+b.sat;
  renderGrid();updateStats();
  toast('✅ Stok minimum "'+b.nama+'" diubah ke '+val+' '+b.sat,'ok');
}
function cancelMin(id){
  document.getElementById('min-edit-'+id).classList.remove('visible');
}

// =========== PEMOHON ===========
function setPemohon(name){
  var inp=document.getElementById('mf-pemohon');
  if(inp){inp.value=name;inp.focus();}
}
function showPemohonField(show){
  var g=document.getElementById('mf-pemohon-group');
  if(g)g.style.display=show?'block':'none';
}

// =========== ICON PICKER ===========
var ICON_DB=[
  // ATK
  {em:'📄',name:'Kertas',cat:'ATK'},{em:'🖊️',name:'Pulpen',cat:'ATK'},{em:'✏️',name:'Pensil',cat:'ATK'},
  {em:'📎',name:'Klip Kertas',cat:'ATK'},{em:'📌',name:'Pushpin',cat:'ATK'},{em:'📋',name:'Clipboard',cat:'ATK'},
  {em:'📓',name:'Buku Catatan',cat:'ATK'},{em:'📔',name:'Agenda',cat:'ATK'},{em:'📒',name:'Buku Tulis',cat:'ATK'},
  {em:'📁',name:'Map Berkas',cat:'ATK'},{em:'📂',name:'Folder',cat:'ATK'},{em:'🗂️',name:'Arsip',cat:'ATK'},
  {em:'✂️',name:'Gunting',cat:'ATK'},{em:'📏',name:'Penggaris',cat:'ATK'},{em:'📐',name:'Segitiga',cat:'ATK'},
  {em:'🖍️',name:'Crayon',cat:'ATK'},{em:'🖋️',name:'Pena Tinta',cat:'ATK'},{em:'🗒️',name:'Notepad',cat:'ATK'},
  // Elektronik
  {em:'💻',name:'Laptop',cat:'Elektronik'},{em:'🖥️',name:'Monitor',cat:'Elektronik'},{em:'⌨️',name:'Keyboard',cat:'Elektronik'},
  {em:'🖱️',name:'Mouse',cat:'Elektronik'},{em:'📱',name:'Smartphone',cat:'Elektronik'},{em:'🖨️',name:'Printer',cat:'Elektronik'},
  {em:'📷',name:'Kamera',cat:'Elektronik'},{em:'🔌',name:'Kabel Adaptor',cat:'Elektronik'},{em:'🔋',name:'Baterai',cat:'Elektronik'},
  {em:'💡',name:'Lampu',cat:'Elektronik'},{em:'📡',name:'Antena',cat:'Elektronik'},{em:'🔦',name:'Senter',cat:'Elektronik'},
  {em:'📠',name:'Fax',cat:'Elektronik'},{em:'☎️',name:'Telepon',cat:'Elektronik'},{em:'📺',name:'TV',cat:'Elektronik'},
  // Furniture
  {em:'🪑',name:'Kursi',cat:'Furniture'},{em:'🛋️',name:'Sofa',cat:'Furniture'},{em:'🗄️',name:'Lemari Arsip',cat:'Furniture'},
  {em:'🚪',name:'Pintu',cat:'Furniture'},{em:'🪞',name:'Cermin',cat:'Furniture'},{em:'🛏️',name:'Tempat Tidur',cat:'Furniture'},
  {em:'🪟',name:'Jendela',cat:'Furniture'},{em:'🧱',name:'Partisi',cat:'Furniture'},
  // Kebersihan
  {em:'🧹',name:'Sapu',cat:'Kebersihan'},{em:'🧴',name:'Sabun Cair',cat:'Kebersihan'},{em:'🪣',name:'Ember',cat:'Kebersihan'},
  {em:'🧽',name:'Spons',cat:'Kebersihan'},{em:'🗑️',name:'Tempat Sampah',cat:'Kebersihan'},{em:'🚿',name:'Shower',cat:'Kebersihan'},
  {em:'🧻',name:'Tisu',cat:'Kebersihan'},{em:'🧼',name:'Sabun Batang',cat:'Kebersihan'},{em:'🫧',name:'Sabun Cuci',cat:'Kebersihan'},
  {em:'🪠',name:'Penguras',cat:'Kebersihan'},{em:'🪤',name:'Perangkap',cat:'Kebersihan'},
  // Fasilitas & Halte
  {em:'🚌',name:'Halte',cat:'Fasilitas'},{em:'🪧',name:'Papan Info',cat:'Fasilitas'},{em:'⭐',name:'Umum',cat:'Fasilitas'},
  {em:'🏷️',name:'Label',cat:'Fasilitas'},{em:'🔑',name:'Kunci',cat:'Fasilitas'},{em:'🪓',name:'Kapak',cat:'Fasilitas'},
  {em:'🛡️',name:'Safety',cat:'Fasilitas'},{em:'🎽',name:'Seragam',cat:'Fasilitas'},{em:'🧯',name:'Pemadam',cat:'Fasilitas'},
  {em:'⛑️',name:'Helm Safety',cat:'Fasilitas'},{em:'🦺',name:'Rompi',cat:'Fasilitas'},
  // Perawatan & Teknik
  {em:'🔧',name:'Kunci Pas',cat:'Perawatan'},{em:'🔨',name:'Palu',cat:'Perawatan'},{em:'🪛',name:'Obeng',cat:'Perawatan'},
  {em:'🧰',name:'Toolbox',cat:'Perawatan'},{em:'⚙️',name:'Roda Gigi',cat:'Perawatan'},{em:'🪚',name:'Gergaji',cat:'Perawatan'},
  {em:'🔩',name:'Baut',cat:'Perawatan'},{em:'🪝',name:'Pengait',cat:'Perawatan'},{em:'🔗',name:'Rantai',cat:'Perawatan'},
  // Konsumsi & Lainnya
  {em:'📦',name:'Kardus',cat:'Lainnya'},{em:'🎁',name:'Hadiah',cat:'Lainnya'},{em:'🧃',name:'Minuman',cat:'Lainnya'},
  {em:'☕',name:'Kopi',cat:'Lainnya'},{em:'🍵',name:'Teh',cat:'Lainnya'},{em:'💊',name:'Obat',cat:'Lainnya'},
  {em:'🩺',name:'P3K',cat:'Lainnya'},{em:'🩹',name:'Plester',cat:'Lainnya'},{em:'🧪',name:'Lab',cat:'Lainnya'},
  {em:'📮',name:'Pos',cat:'Lainnya'},{em:'🎨',name:'Cat',cat:'Lainnya'},{em:'🖼️',name:'Gambar',cat:'Lainnya'},
];
var iconCatActive='Semua';
var selectedEmoji='📦';
function buildIconPicker(){
  var cats=['Semua',...new Set(ICON_DB.map(x=>x.cat))];
  document.getElementById('ipd-cats').innerHTML=cats.map(c=>
    '<button class="ipd-cat-btn'+(c===iconCatActive?' active':'')+'" onclick="setIconCat(\''+c+'\')">'+(c==='Semua'?'🔠 Semua':c)+'</button>'
  ).join('');
  renderIconGrid('');
}
function setIconCat(cat){
  iconCatActive=cat;
  buildIconPicker();
}
function renderIconGrid(search){
  var list=ICON_DB.filter(x=>{
    if(iconCatActive!=='Semua'&&x.cat!==iconCatActive)return false;
    if(search&&!x.name.toLowerCase().includes(search.toLowerCase())&&!x.em.includes(search))return false;
    return true;
  });
  var grid=document.getElementById('ipd-grid');
  if(!list.length){grid.innerHTML='<div class="ipd-empty">Ikon tidak ditemukan</div>';return;}
  grid.innerHTML=list.map(x=>
    '<div class="ipd-item'+(x.em===selectedEmoji?' selected':'')+'" onclick="selectIcon(\''+x.em+'\',\''+x.name+'\')" title="'+x.name+'">'
      +'<span class="ipd-em">'+x.em+'</span>'
      +'<span class="ipd-lbl">'+x.name+'</span>'
    +'</div>'
  ).join('');
}
function filterIcons(v){
  renderIconGrid(v);
}
function selectIcon(em,name){
  selectedEmoji=em;
  document.getElementById('a-emoji').value=em;
  document.getElementById('ipt-emoji-preview').textContent=em;
  document.getElementById('ipt-name-preview').textContent=name;
  document.getElementById('icon-picker-dropdown').classList.remove('open');
  updateAddPreview();
  renderIconGrid(document.getElementById('ipd-search').value);
}
function toggleIconPicker(){
  var dd=document.getElementById('icon-picker-dropdown');
  dd.classList.toggle('open');
  if(dd.classList.contains('open')){
    buildIconPicker();
    setTimeout(()=>{var s=document.getElementById('ipd-search');if(s){s.value='';s.focus();}},80);
  }
}
// Close icon picker on outside click
document.addEventListener('click',function(e){
  var wrap=document.getElementById('icon-picker-wrap');
  if(wrap&&!wrap.contains(e.target)){
    var dd=document.getElementById('icon-picker-dropdown');
    if(dd)dd.classList.remove('open');
  }
});

// =========== LAPORAN ===========
function renderLaporan(){
  var lok=document.getElementById('f-lokasi').value;
  var kat=document.getElementById('f-kategori').value;
  var sts=document.getElementById('f-status').value;
  // fill kategori options
  var cats=[...new Set(barang.map(b=>b.kat))];
  var rkat=document.getElementById('f-kategori');
  var curKat=rkat.value;
  rkat.innerHTML='<option value="">Semua Kategori</option>'+cats.map(c=>'<option '+(c===curKat?'selected':'')+'>'+c+'</option>').join('');
  var list=barang.filter(b=>(!lok||b.lokasi===lok)&&(!kat||b.kat===kat)&&(!sts||stockStatus(b)===sts));
  var tM=0,tK=0,tS=0;
  var rows=list.map(b=>{
    var trxB=transaksi.filter(t=>t.bid===b.id);
    var m=trxB.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
    var k=trxB.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
    var st=stockStatus(b);
    tM+=m;tK+=k;tS+=b.stok;
    return '<tr><td>'+b.emoji+' '+b.nama+'</td>'
      +'<td><span class="tbadge '+b.lokasi.toLowerCase()+'">'+b.lokasi+'</span></td>'
      +'<td>'+b.kat+'</td>'
      +'<td style="color:var(--green);font-weight:500">'+m+'</td>'
      +'<td style="color:var(--red);font-weight:500">'+k+'</td>'
      +'<td style="font-weight:600">'+b.stok+' '+b.sat+'</td>'
      +'<td>Min: '+b.min+'</td>'
      +'<td><span class="tbadge '+st+'">'+statusLabel(st)+'</span></td></tr>';
  }).join('');
  document.getElementById('r-masuk').textContent=tM;
  document.getElementById('r-keluar').textContent=tK;
  document.getElementById('r-sisa').textContent=tS;
  document.getElementById('tbl-laporan').innerHTML='<table><thead><tr><th>Barang</th><th>Lokasi</th><th>Kategori</th><th>Masuk</th><th>Keluar</th><th>Stok</th><th>Minimum</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table>';
}

// =========== RIWAYAT ===========
function setRtab(val,el){
  rhTab=val;
  document.querySelectorAll('.rtab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  renderRiwayat();
}
function renderRiwayat(){
  var list=getFilteredRiwayat();
  if(!list.length){document.getElementById('tbl-riwayat').innerHTML='<div class="empty"><div class="empty-icon">📋</div><p>Belum ada riwayat transaksi</p></div>';return;}
  var rows=list.slice().reverse().map((t,i)=>{
    var b=getB(t.bid)||{nama:'?',emoji:'?',sat:''};
    var pemohonCell='—';
    if(t.tipe==='keluar'&&t.pemohon){
      var initials=t.pemohon.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
      pemohonCell='<div class="pemohon-cell"><div class="pemohon-avatar">'+initials+'</div><span class="pemohon-name">'+t.pemohon+'</span></div>';
    }
    return '<tr><td style="color:var(--muted);font-size:11px">'+(i+1)+'</td>'
      +'<td>'+t.tgl+'</td>'
      +'<td>'+b.emoji+' '+b.nama+'</td>'
      +'<td><span class="tbadge '+t.lok.toLowerCase()+'">'+t.lok+'</span></td>'
      +'<td><span class="tbadge '+(t.tipe==='masuk'?'mk':'kl')+'">'+(t.tipe==='masuk'?'📥 Masuk':'📤 Keluar')+'</span></td>'
      +'<td style="font-weight:600;color:'+(t.tipe==='masuk'?'var(--green)':'var(--red)')+'">'+t.jml+' '+b.sat+'</td>'
      +'<td>'+pemohonCell+'</td>'
      +'<td style="color:var(--muted)">'+t.ket+'</td></tr>';
  }).join('');
  document.getElementById('tbl-riwayat').innerHTML='<table><thead><tr><th>#</th><th>Tanggal</th><th>Barang</th><th>Lokasi</th><th>Tipe</th><th>Jumlah</th><th>Pemohon</th><th>Keterangan</th></tr></thead><tbody>'+rows+'</tbody></table>';
}

// =========== NAV ===========
var curPage='barang';
function gotoPage(p){
  curPage=p;
  var allPages=['barang','laporan','riwayat','permintaan','users'];
  allPages.forEach(pg=>{
    var el=document.getElementById('page-'+pg);
    if(el)el.style.display=pg===p?'block':'none';
    var n=document.getElementById('nav-'+pg);
    if(n)n.className=pg===p?'active':'';
  });
  var bcMap={barang:'Data Barang',laporan:'Laporan',riwayat:'Riwayat Transaksi',permintaan:'Permintaan Barang',users:'Manajemen Pengguna'};
  document.getElementById('bc-page').textContent=bcMap[p]||p;
  var catVis=p==='barang';
  document.getElementById('catbar').style.display=catVis?'block':'none';
  document.getElementById('toolbar-el').style.display=catVis?'flex':'none';
  if(p==='laporan'){renderLaporan();renderRekap();setTimeout(renderMainChart,100);}
  if(p==='riwayat')renderRiwayat();
  if(p==='permintaan')renderPermintaan();
  if(p==='users')renderUsers();
}
function toggleFilter(){toast('🔧 Filter panel akan segera tersedia','');}

// =========== LOGIN ===========
var USERS=[
  {username:'admin',password:'admin123',nama:'Administrator',role:'admin',avatar:'👨‍💼'},
  {username:'staff',password:'staff123',nama:'Staff Gudang',role:'staff',avatar:'👷'},
  {username:'viewer',password:'viewer123',nama:'Viewer',role:'viewer',avatar:'👁️'},
];
var currentUser=null;
function doLogin(){
  var u=document.getElementById('l-user').value.trim();
  var p=document.getElementById('l-pass').value;
  var found=USERS.find(x=>x.username===u&&x.password===p);
  if(!found){
    document.getElementById('login-err').style.display='block';
    return;
  }
  currentUser=found;
  document.getElementById('login-screen').style.display='none';
  document.getElementById('app-shell').classList.add('visible');
  document.getElementById('nav-username').textContent=found.nama;
  toast('👋 Selamat datang, '+found.nama+'!','ok');
}
function doLogout(){
  currentUser=null;
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('app-shell').classList.remove('visible');
  document.getElementById('l-user').value='';
  document.getElementById('l-pass').value='';
  document.getElementById('login-err').style.display='none';
}
function toggleUserDropdown(){
  document.getElementById('user-dropdown').classList.toggle('open');
}
document.addEventListener('click',function(e){
  var btn=document.getElementById('user-btn');
  var dd=document.getElementById('user-dropdown');
  if(dd&&btn&&!btn.contains(e.target))dd.classList.remove('open');
});

// =========== PERMINTAAN ===========
var permintaan=[];
var nextReqId=1;
function renderPermintaanBarangSelect(){
  var sel=document.getElementById('req-barang');
  if(!sel)return;
  sel.innerHTML=barang.map(b=>'<option value="'+b.id+'">'+b.emoji+' '+b.nama+' ('+b.stok+' '+b.sat+')</option>').join('');
}
function submitPermintaan(){
  var bid=parseInt(document.getElementById('req-barang').value);
  var jml=parseInt(document.getElementById('req-jml').value)||0;
  var ket=document.getElementById('req-ket').value.trim();
  if(!jml){toast('⚠️ Jumlah harus diisi','err');return}
  var b=getB(bid);
  permintaan.push({id:nextReqId++,bid:bid,jml:jml,ket:ket||'-',tgl:todayStr(),status:'pending',user:currentUser?currentUser.nama:'Staff'});
  document.getElementById('req-jml').value='';
  document.getElementById('req-ket').value='';
  renderPermintaan();
  toast('✅ Permintaan "'+b.nama+'" berhasil dikirim','ok');
}
function setPermintaanStatus(id,status){
  var p=permintaan.find(x=>x.id===id);
  if(p){
    if(status==='approved'){
      var b=getB(p.bid);
      if(b){b.stok+=p.jml;transaksi.push({id:nextTrxId++,bid:b.id,tipe:'masuk',jml:p.jml,tgl:todayStr(),ket:'Dari permintaan #'+id,lok:b.lokasi});}
    }
    p.status=status;
    renderPermintaan();renderGrid();buildCatbar();
    toast(status==='approved'?'✅ Permintaan disetujui & stok bertambah':'❌ Permintaan ditolak','ok');
  }
}
function renderPermintaan(){
  renderPermintaanBarangSelect();
  var tbl=document.getElementById('tbl-permintaan');
  if(!tbl)return;
  if(!permintaan.length){tbl.innerHTML='<div class="empty"><div class="empty-icon">📋</div><p>Belum ada permintaan barang</p></div>';return;}
  var rows=permintaan.slice().reverse().map(p=>{
    var b=getB(p.bid)||{nama:'?',emoji:'?',sat:''};
    var stLabel={'pending':'Menunggu','approved':'Disetujui','rejected':'Ditolak'};
    var actions=p.status==='pending'?
      '<button onclick="setPermintaanStatus('+p.id+',\'approved\')" style="padding:4px 10px;background:var(--green);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px;margin-right:4px">✓ Setuju</button>'+
      '<button onclick="setPermintaanStatus('+p.id+',\'rejected\')" style="padding:4px 10px;background:var(--red);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:11px">✗ Tolak</button>':
      '—';
    return '<tr><td>'+b.emoji+' '+b.nama+'</td><td style="font-weight:600">'+p.jml+' '+b.sat+'</td><td>'+p.ket+'</td><td>'+p.tgl+'</td><td>'+p.user+'</td>'
      +'<td><span class="status-badge '+p.status+'">'+stLabel[p.status]+'</span></td>'
      +'<td>'+actions+'</td></tr>';
  }).join('');
  tbl.innerHTML='<table><thead><tr><th>Barang</th><th>Jumlah</th><th>Keterangan</th><th>Tanggal</th><th>Pemohon</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'+rows+'</tbody></table>';
}

// =========== USERS ===========
function renderUsers(){
  var grid=document.getElementById('user-grid');
  if(!grid)return;
  var roleLabel={admin:'Admin',staff:'Staff',viewer:'Viewer'};
  grid.innerHTML=USERS.map(u=>'<div class="user-card">'
    +'<div class="user-avatar">'+u.avatar+'</div>'
    +'<div class="user-name">'+u.nama+'</div>'
    +'<div class="user-role">@'+u.username+'</div>'
    +'<span class="role-badge '+u.role+'">'+roleLabel[u.role]+'</span>'
    +'</div>').join('');
}

// =========== REKAP BULANAN ===========
function initRekapTahun(){
  var sel=document.getElementById('rekap-tahun');
  if(!sel)return;
  var years=[...new Set(transaksi.map(t=>t.tgl.slice(0,4)))].sort().reverse();
  if(!years.length)years=[new Date().getFullYear().toString()];
  sel.innerHTML=years.map(y=>'<option value="'+y+'">'+y+'</option>').join('');
}
var BULAN_NAMES=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function renderRekap(){
  var tbl=document.getElementById('tbl-rekap');
  if(!tbl)return;
  var tahun=document.getElementById('rekap-tahun')?document.getElementById('rekap-tahun').value:'';
  var lok=document.getElementById('rekap-lokasi')?document.getElementById('rekap-lokasi').value:'';
  var data=Array.from({length:12},(_,mi)=>{
    var bulanStr=tahun+'-'+String(mi+1).padStart(2,'0');
    var trxBulan=transaksi.filter(t=>t.tgl.startsWith(bulanStr)&&(!lok||t.lok===lok));
    var masuk=trxBulan.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
    var keluar=trxBulan.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
    return {bulan:BULAN_NAMES[mi],masuk,keluar,trx:trxBulan.length};
  });
  var rows=data.map(d=>'<tr><td><b>'+d.bulan+'</b></td>'
    +'<td style="color:var(--green);font-weight:600">'+d.masuk+'</td>'
    +'<td style="color:var(--red);font-weight:600">'+d.keluar+'</td>'
    +'<td>'+d.trx+' transaksi</td></tr>').join('');
  var tM=data.reduce((a,d)=>a+d.masuk,0),tK=data.reduce((a,d)=>a+d.keluar,0);
  tbl.innerHTML='<table><thead><tr><th>Bulan</th><th>Total Masuk</th><th>Total Keluar</th><th>Transaksi</th></tr></thead><tbody>'
    +rows+'<tr style="background:var(--light)"><td style="font-weight:600">TOTAL '+tahun+'</td><td style="color:var(--green);font-weight:700">'+tM+'</td><td style="color:var(--red);font-weight:700">'+tK+'</td><td>'+data.reduce((a,d)=>a+d.trx,0)+' transaksi</td></tr></tbody></table>';
}

// =========== EXPORT EXCEL LAPORAN ===========
function exportExcel(){
  var lok=document.getElementById('f-lokasi').value;
  var kat=document.getElementById('f-kategori').value;
  var sts=document.getElementById('f-status').value;
  var list=barang.filter(b=>(!lok||b.lokasi===lok)&&(!kat||b.kat===kat)&&(!sts||stockStatus(b)===sts));
  var wsData=[['No','Nama Barang','Lokasi','Kategori','Total Masuk','Total Keluar','Stok Saat Ini','Satuan','Status']];
  list.forEach((b,i)=>{
    var trxB=transaksi.filter(t=>t.bid===b.id);
    var m=trxB.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
    var k=trxB.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
    wsData.push([i+1,b.nama,b.lokasi,b.kat,m,k,b.stok,b.sat,statusLabel(stockStatus(b))]);
  });
  var wb=XLSX.utils.book_new();
  var ws=XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols']=[{wch:5},{wch:25},{wch:12},{wch:15},{wch:12},{wch:12},{wch:14},{wch:10},{wch:12}];
  XLSX.utils.book_append_sheet(wb,ws,'Laporan Stok');
  // Rekap bulanan sheet
  var tahun=new Date().getFullYear().toString();
  var rekapData=[['Bulan','Total Masuk','Total Keluar','Jumlah Transaksi']];
  Array.from({length:12},(_,mi)=>{
    var bulanStr=tahun+'-'+String(mi+1).padStart(2,'0');
    var trxBulan=transaksi.filter(t=>t.tgl.startsWith(bulanStr));
    var masuk=trxBulan.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
    var keluar=trxBulan.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
    rekapData.push([BULAN_NAMES[mi]+' '+tahun,masuk,keluar,trxBulan.length]);
  });
  var ws2=XLSX.utils.aoa_to_sheet(rekapData);
  XLSX.utils.book_append_sheet(wb,ws2,'Rekap Bulanan');
  XLSX.writeFile(wb,'Laporan_ATK_Pool_Purosani_'+todayStr()+'.xlsx');
  toast('✅ File Excel berhasil diunduh','ok');
}

// =========== EXPORT PDF LAPORAN ===========
function exportPDF(){
  var {jsPDF}=window.jspdf;
  var doc=new jsPDF('l','mm','a4');
  var pw=doc.internal.pageSize.getWidth();
  // Header
  doc.setFillColor(0,63,136);
  doc.rect(0,0,pw,22,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(16);doc.setFont('helvetica','bold');
  doc.text('ATK POOL PUROSANI',14,10);
  doc.setFontSize(9);doc.setFont('helvetica','normal');
  doc.text('Sistem Inventory Kantor & Halte — Laporan Stok',14,16);
  doc.text('Dicetak: '+todayStr(),pw-14,16,{align:'right'});
  doc.text('Perengkembang, Balecatur, Kec. Gamping, Kab. Sleman, DIY 55295',pw-14,10,{align:'right'});
  doc.setTextColor(30,30,28);
  // Summary
  var tM=parseInt(document.getElementById('r-masuk').textContent)||0;
  var tK=parseInt(document.getElementById('r-keluar').textContent)||0;
  var tS=parseInt(document.getElementById('r-sisa').textContent)||0;
  doc.setFontSize(10);doc.setFont('helvetica','bold');
  doc.text('Total Masuk: '+tM,14,30);doc.text('Total Keluar: '+tK,80,30);doc.text('Sisa Stok: '+tS,150,30);
  // Table
  var lok=document.getElementById('f-lokasi').value;
  var kat=document.getElementById('f-kategori').value;
  var sts=document.getElementById('f-status').value;
  var list=barang.filter(b=>(!lok||b.lokasi===lok)&&(!kat||b.kat===kat)&&(!sts||stockStatus(b)===sts));
  var body=list.map((b,i)=>{
    var trxB=transaksi.filter(t=>t.bid===b.id);
    var m=trxB.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0);
    var k=trxB.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0);
    return [i+1,b.nama,b.lokasi,b.kat,m,k,b.stok+' '+b.sat,statusLabel(stockStatus(b))];
  });
  doc.autoTable({head:[['#','Nama Barang','Lokasi','Kategori','Masuk','Keluar','Stok','Status']],body:body,startY:35,styles:{fontSize:9},headStyles:{fillColor:[0,63,136],textColor:255,fontStyle:'bold'},alternateRowStyles:{fillColor:[242,245,250]},margin:{left:14,right:14}});
  doc.save('Laporan_ATK_Pool_Purosani_'+todayStr()+'.pdf');
  toast('✅ File PDF berhasil diunduh','ok');
}

// =========== EXPORT EXCEL RIWAYAT ===========
function exportRiwayatExcel(){
  var list=getFilteredRiwayat();
  var wsData=[['No','Tanggal','Nama Barang','Lokasi','Tipe','Jumlah','Pemohon','Keterangan']];
  list.slice().reverse().forEach((t,i)=>{
    var b=getB(t.bid)||{nama:'?',sat:''};
    wsData.push([i+1,t.tgl,b.nama,t.lok,t.tipe==='masuk'?'Masuk':'Keluar',t.jml,t.pemohon||'—',t.ket]);
  });
  var wb=XLSX.utils.book_new();
  var ws=XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols']=[{wch:5},{wch:12},{wch:25},{wch:12},{wch:10},{wch:10},{wch:18},{wch:25}];
  XLSX.utils.book_append_sheet(wb,ws,'Riwayat Transaksi');
  XLSX.writeFile(wb,'Riwayat_ATK_Pool_Purosani_'+todayStr()+'.xlsx');
  toast('✅ Riwayat Excel berhasil diunduh','ok');
}

// =========== EXPORT PDF RIWAYAT ===========
function exportRiwayatPDF(){
  var {jsPDF}=window.jspdf;
  var doc=new jsPDF('l','mm','a4');
  var pw=doc.internal.pageSize.getWidth();
  doc.setFillColor(0,63,136);
  doc.rect(0,0,pw,22,'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(16);doc.setFont('helvetica','bold');
  doc.text('ATK POOL PUROSANI',14,10);
  doc.setFontSize(9);doc.setFont('helvetica','normal');
  doc.text('Riwayat Transaksi — Dicetak: '+todayStr(),14,16);
  doc.setTextColor(30,30,28);
  var list=getFilteredRiwayat().slice().reverse();
  var body=list.map((t,i)=>{var b=getB(t.bid)||{nama:'?',sat:''};return[i+1,t.tgl,b.nama,t.lok,t.tipe==='masuk'?'Masuk':'Keluar',t.jml,t.pemohon||'—',t.ket];});
  doc.autoTable({head:[['#','Tanggal','Barang','Lokasi','Tipe','Jumlah','Pemohon','Keterangan']],body:body,startY:28,styles:{fontSize:8.5},headStyles:{fillColor:[0,63,136],textColor:255,fontStyle:'bold'},alternateRowStyles:{fillColor:[242,245,250]},margin:{left:14,right:14}});
  doc.save('Riwayat_ATK_Pool_Purosani_'+todayStr()+'.pdf');
  toast('✅ Riwayat PDF berhasil diunduh','ok');
}

function getFilteredRiwayat(){
  var lok=document.getElementById('rh-lokasi').value;
  var dari=document.getElementById('rh-dari').value;
  var sampai=document.getElementById('rh-sampai').value;
  return transaksi.filter(t=>{
    if(rhTab!=='semua'&&t.tipe!==rhTab)return false;
    if(lok&&t.lok!==lok)return false;
    if(dari&&t.tgl<dari)return false;
    if(sampai&&t.tgl>sampai)return false;
    var b=getB(t.bid);
    if(rhSearch&&b&&!b.nama.toLowerCase().includes(rhSearch.toLowerCase()))return false;
    return true;
  });
}
function resetDateFilter(){
  document.getElementById('rh-dari').value='';
  document.getElementById('rh-sampai').value='';
  renderRiwayat();
}

// =========== UTILS ===========
function closeModal(id){document.getElementById(id).classList.remove('open')}
function updateLowCount(){var c=barang.filter(b=>stockStatus(b)!=='ok').length;document.getElementById('low-count').textContent=c}
function updateStats(){
  document.getElementById('stat-total').textContent=barang.length;
  document.getElementById('stat-aman').textContent=barang.filter(b=>stockStatus(b)==='ok').length;
  document.getElementById('stat-menipis').textContent=barang.filter(b=>stockStatus(b)==='low').length;
  document.getElementById('stat-habis').textContent=barang.filter(b=>stockStatus(b)==='out').length;
  updateLowCount();
}

// Click overlay to close
document.getElementById('modal-trx').addEventListener('click',function(e){if(e.target===this)closeModal('modal-trx')});
document.getElementById('modal-add').addEventListener('click',function(e){if(e.target===this)closeModal('modal-add')});

// =========== DATE ===========
function setDateDisplay(){
  var d=new Date();
  var days=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  var months=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  document.getElementById('date-display').textContent=days[d.getDay()]+', '+d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
}

// =========== LOCALSTORAGE PERSISTENCE ===========
var LS_KEY_BARANG='atk_barang_v1';
var LS_KEY_TRX='atk_transaksi_v1';
var LS_KEY_PERMINTAAN='atk_permintaan_v1';
var LS_KEY_IDS='atk_ids_v1';
var _saveTimeout=null;

function saveData(){
  try{
    localStorage.setItem(LS_KEY_BARANG,JSON.stringify(barang));
    localStorage.setItem(LS_KEY_TRX,JSON.stringify(transaksi));
    localStorage.setItem(LS_KEY_PERMINTAAN,JSON.stringify(permintaan));
    localStorage.setItem(LS_KEY_IDS,JSON.stringify({nextId,nextTrxId,nextReqId}));
    showSaveIndicator();
  }catch(e){console.warn('localStorage full or unavailable',e);}
}

function loadData(){
  try{
    var b=localStorage.getItem(LS_KEY_BARANG);
    var t=localStorage.getItem(LS_KEY_TRX);
    var p=localStorage.getItem(LS_KEY_PERMINTAAN);
    var ids=localStorage.getItem(LS_KEY_IDS);
    if(b)barang=JSON.parse(b);
    if(t)transaksi=JSON.parse(t);
    if(p)permintaan=JSON.parse(p);
    if(ids){var o=JSON.parse(ids);nextId=o.nextId||nextId;nextTrxId=o.nextTrxId||nextTrxId;nextReqId=o.nextReqId||nextReqId;}
    return !!(b||t);
  }catch(e){console.warn('Error loading data',e);return false;}
}

function debounceSave(){
  clearTimeout(_saveTimeout);
  _saveTimeout=setTimeout(saveData,600);
}

function showSaveIndicator(){
  var el=document.getElementById('save-indicator');
  if(!el)return;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.classList.remove('show'),2000);
}

function clearAllData(){
  if(!confirm('⚠️ Hapus SEMUA data tersimpan? Aksi ini tidak bisa dibatalkan!\n\nData akan kembali ke data demo awal.'))return;
  localStorage.removeItem(LS_KEY_BARANG);
  localStorage.removeItem(LS_KEY_TRX);
  localStorage.removeItem(LS_KEY_PERMINTAAN);
  localStorage.removeItem(LS_KEY_IDS);
  location.reload();
}

// Patch doTrx, simpanBarang, saveMin, setPermintaanStatus to auto-save
var _origDoTrx=doTrx;
doTrx=function(tipe){_origDoTrx(tipe);debounceSave();};
var _origSimpan=simpanBarang;
simpanBarang=function(){_origSimpan();debounceSave();};
var _origSaveMin=saveMin;
saveMin=function(id){_origSaveMin(id);debounceSave();};
var _origSetPStatus=setPermintaanStatus;
setPermintaanStatus=function(id,s){_origSetPStatus(id,s);debounceSave();};

// =========== CHART ===========
var mainChart=null;
var chartTab='bulanan';

function setChartTab(tab,el){
  chartTab=tab;
  document.querySelectorAll('.chart-tab').forEach(t=>t.classList.remove('active'));
  if(el)el.classList.add('active');
  renderMainChart();
}

function renderMainChart(){
  var canvas=document.getElementById('main-chart');
  if(!canvas)return;
  if(mainChart){mainChart.destroy();mainChart=null;}
  var ctx=canvas.getContext('2d');
  if(chartTab==='bulanan'){
    var tahun=document.getElementById('rekap-tahun')?document.getElementById('rekap-tahun').value:new Date().getFullYear().toString();
    var masukData=[],keluarData=[];
    BULAN_NAMES.forEach((_,mi)=>{
      var bs=tahun+'-'+String(mi+1).padStart(2,'0');
      var bt=transaksi.filter(t=>t.tgl.startsWith(bs));
      masukData.push(bt.filter(t=>t.tipe==='masuk').reduce((a,t)=>a+t.jml,0));
      keluarData.push(bt.filter(t=>t.tipe==='keluar').reduce((a,t)=>a+t.jml,0));
    });
    mainChart=new Chart(ctx,{type:'bar',data:{
      labels:BULAN_NAMES,
      datasets:[
        {label:'Masuk',data:masukData,backgroundColor:'rgba(13,122,62,0.8)',borderColor:'#0D7A3E',borderWidth:1.5,borderRadius:4},
        {label:'Keluar',data:keluarData,backgroundColor:'rgba(192,57,43,0.8)',borderColor:'#C0392B',borderWidth:1.5,borderRadius:4}
      ]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},usePointStyle:true}},tooltip:{mode:'index',intersect:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10}}},y:{beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10}}}}}});
  } else if(chartTab==='barang'){
    var top=barang.slice().sort((a,b)=>b.stok-a.stok).slice(0,10);
    var colors=top.map(b=>stockStatus(b)==='ok'?'rgba(13,122,62,0.8)':stockStatus(b)==='low'?'rgba(192,120,0,0.8)':'rgba(192,57,43,0.8)');
    mainChart=new Chart(ctx,{type:'bar',data:{
      labels:top.map(b=>b.nama.length>14?b.nama.slice(0,13)+'…':b.nama),
      datasets:[{label:'Stok Saat Ini',data:top.map(b=>b.stok),backgroundColor:colors,borderRadius:4}]
    },options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(c)=>' '+c.parsed.x+' '+top[c.dataIndex].sat}}},scales:{x:{beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{size:10}}},y:{ticks:{font:{size:10}}}}}});
  } else {
    var ok=barang.filter(b=>stockStatus(b)==='ok').length;
    var low=barang.filter(b=>stockStatus(b)==='low').length;
    var out=barang.filter(b=>stockStatus(b)==='out').length;
    mainChart=new Chart(ctx,{type:'doughnut',data:{
      labels:['Stok Aman','Stok Menipis','Stok Habis'],
      datasets:[{data:[ok,low,out],backgroundColor:['rgba(13,122,62,0.85)','rgba(192,120,0,0.85)','rgba(192,57,43,0.85)'],borderWidth:2,borderColor:'#fff'}]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},usePointStyle:true,padding:16}},tooltip:{callbacks:{label:(c)=>' '+c.label+': '+c.parsed+' barang'}}}}});
  }
}

// =========== NOTIFICATION PANEL ===========
function toggleNotifPanel(){
  var p=document.getElementById('notif-panel');
  if(p.classList.contains('open')){p.classList.remove('open');return;}
  renderNotifList();
  p.classList.add('open');
}
function closeNotifPanel(){document.getElementById('notif-panel').classList.remove('open');}

function renderNotifList(){
  var low=barang.filter(b=>stockStatus(b)!=='ok');
  var list=document.getElementById('notif-list');
  if(!low.length){list.innerHTML='<div class="notif-empty">✅ Semua stok dalam kondisi aman!</div>';return;}
  list.innerHTML=low.map(b=>{
    var st=stockStatus(b);
    var icon=st==='out'?'❌':'⚠️';
    var desc=st==='out'?'HABIS — segera lakukan pengadaan':'Menipis — tersisa '+b.stok+' '+b.sat+' (min '+b.min+')';
    return '<div class="notif-item" onclick="openTrxModal('+b.id+');closeNotifPanel()">'
      +'<div class="notif-dot '+st+'">'+icon+'</div>'
      +'<div class="notif-info"><div class="notif-name">'+b.emoji+' '+b.nama+'</div><div class="notif-desc">'+b.lokasi+' — '+desc+'</div></div>'
      +'</div>';
  }).join('');
}

function getLowStockMessage(){
  var low=barang.filter(b=>stockStatus(b)!=='ok');
  if(!low.length)return null;
  var lines=low.map(b=>{
    var st=stockStatus(b)==='out'?'HABIS':'Menipis ('+b.stok+'/'+b.min+' '+b.sat+')';
    return '• '+b.nama+' ['+b.lokasi+']: '+st;
  });
  return '🚨 *Notifikasi Stok ATK Pool Purosani*\n\n'+lines.join('\n')+'\n\nHarap segera lakukan pengadaan.\n_Sistem Inventory ATK Pool Purosani_';
}

function sendWANotif(){
  var msg=getLowStockMessage();
  if(!msg){toast('✅ Semua stok aman, tidak ada notifikasi','ok');return;}
  var waNum=prompt('Masukkan nomor WhatsApp tujuan (contoh: 08123456789):','');
  if(!waNum)return;
  var clean=waNum.replace(/\D/g,'');
  if(clean.startsWith('0'))clean='62'+clean.slice(1);
  var url='https://wa.me/'+clean+'?text='+encodeURIComponent(msg);
  window.open(url,'_blank');
  toast('📤 Membuka WhatsApp...','ok');
}

function sendEmailNotif(){
  var msg=getLowStockMessage();
  if(!msg){toast('✅ Semua stok aman, tidak ada notifikasi','ok');return;}
  var to=prompt('Masukkan alamat email tujuan:','inventory@purosani.go.id');
  if(!to)return;
  var subj=encodeURIComponent('[ATK Purosani] Notifikasi Stok Menipis');
  var body=encodeURIComponent(msg.replace(/\*/g,'').replace(/_/g,''));
  window.location.href='mailto:'+to+'?subject='+subj+'&body='+body;
  toast('📧 Membuka email client...','ok');
}

document.addEventListener('click',function(e){
  var panel=document.getElementById('notif-panel');
  var notifBtn=document.querySelector('.notif-btn');
  if(panel&&panel.classList.contains('open')&&!panel.contains(e.target)&&notifBtn&&!notifBtn.contains(e.target)){
    panel.classList.remove('open');
  }
});

// =========== BARCODE SCANNER ===========
var barcodeScanning=false;
var barcodeFoundId=null;

function openBarcodeModal(){
  barcodeFoundId=null;
  document.getElementById('barcode-result-box').textContent='Menunggu deteksi barcode...';
  document.getElementById('barcode-result-box').className='barcode-result-box';
  document.getElementById('barcode-found-info').style.display='none';
  document.getElementById('barcode-manual-input').value='';
  document.getElementById('modal-barcode').classList.add('open');
  startBarcodeScanner();
}

function closeBarcodeModal(){
  stopBarcodeScanner();
  document.getElementById('modal-barcode').classList.remove('open');
}

function startBarcodeScanner(){
  if(typeof Quagga==='undefined'){
    document.getElementById('barcode-result-box').textContent='Library scanner tidak tersedia. Gunakan input manual.';
    return;
  }
  var viewport=document.getElementById('barcode-viewport');
  Quagga.init({
    inputStream:{name:'Live',type:'LiveStream',target:viewport,constraints:{width:320,height:240,facingMode:'environment'}},
    decoder:{readers:['code_128_reader','ean_reader','ean_8_reader','code_39_reader','upc_reader']},
    locate:true
  },function(err){
    if(err){
      document.getElementById('barcode-result-box').textContent='Kamera tidak tersedia. Gunakan input manual di bawah.';
      return;
    }
    barcodeScanning=true;
    Quagga.start();
  });
  Quagga.onDetected(function(data){
    var code=data.codeResult.code;
    stopBarcodeScanner();
    searchBarcode(code);
    document.getElementById('barcode-manual-input').value=code;
  });
}

function stopBarcodeScanner(){
  if(typeof Quagga!=='undefined'&&barcodeScanning){
    try{Quagga.stop();}catch(e){}
    barcodeScanning=false;
  }
}

function searchBarcode(code){
  code=(code||'').trim();
  if(!code)return;
  // Search by barcode field or by name partial match
  var found=barang.find(b=>b.barcode===code)||barang.find(b=>b.nama.toLowerCase().includes(code.toLowerCase()));
  var box=document.getElementById('barcode-result-box');
  var info=document.getElementById('barcode-found-info');
  if(found){
    box.textContent='✅ Barang ditemukan: '+found.nama;
    box.className='barcode-result-box found';
    barcodeFoundId=found.id;
    document.getElementById('bfi-nama').textContent=found.emoji+' '+found.nama;
    document.getElementById('bfi-detail').textContent=found.lokasi+' · '+found.kat+' · Stok: '+found.stok+' '+found.sat;
    info.style.display='block';
    toast('✅ Barang ditemukan: '+found.nama,'ok');
  } else {
    box.textContent='❌ Barang dengan kode "'+code+'" tidak ditemukan';
    box.className='barcode-result-box';
    info.style.display='none';
    barcodeFoundId=null;
    toast('❌ Barang tidak ditemukan','err');
  }
}

function openFromBarcode(tipe){
  if(!barcodeFoundId)return;
  closeBarcodeModal();
  openTrxModal(barcodeFoundId);
  // pre-select tipe
  if(tipe==='keluar')showPemohonField(true);
}

// =========== PHOTO FEATURE ===========
var photoData={};
var addPhotoTemp=null;
var photoModalBid=null;

function openPhotoModal(id){
  photoModalBid=id;
  var b=getB(id);
  document.getElementById('photo-modal-icon').textContent=b.emoji;
  document.getElementById('photo-modal-title').textContent='Foto: '+b.nama;
  document.getElementById('photo-modal-sub').textContent=b.lokasi+' — '+b.kat;
  document.getElementById('photo-modal-bid').value=id;
  var prev=document.getElementById('photo-preview-large');
  var ph=document.getElementById('photo-placeholder');
  var delBtn=document.getElementById('photo-delete-btn');
  document.getElementById('photo-file-input').value='';
  if(b.foto){
    prev.src=b.foto;prev.style.display='block';
    ph.style.display='none';delBtn.style.display='block';
  } else {
    prev.style.display='none';ph.style.display='flex';delBtn.style.display='none';
  }
  document.getElementById('modal-photo').classList.add('open');
}

function handlePhotoUpload(e){
  var file=e.target.files[0];
  if(!file)return;
  if(file.size>2*1024*1024){toast('⚠️ Ukuran file terlalu besar (maks 2MB)','err');return;}
  var reader=new FileReader();
  reader.onload=function(ev){
    var dataUrl=ev.target.result;
    var id=parseInt(document.getElementById('photo-modal-bid').value);
    var b=getB(id);
    if(b){
      b.foto=dataUrl;
      var prev=document.getElementById('photo-preview-large');
      prev.src=dataUrl;prev.style.display='block';
      document.getElementById('photo-placeholder').style.display='none';
      document.getElementById('photo-delete-btn').style.display='block';
      debounceSave();
      renderGrid();
      toast('✅ Foto berhasil diunggah','ok');
    }
  };
  reader.readAsDataURL(file);
}

function deletePhoto(){
  var id=parseInt(document.getElementById('photo-modal-bid').value);
  var b=getB(id);
  if(b&&confirm('Hapus foto barang ini?')){
    delete b.foto;
    document.getElementById('photo-preview-large').style.display='none';
    document.getElementById('photo-placeholder').style.display='flex';
    document.getElementById('photo-delete-btn').style.display='none';
    debounceSave();renderGrid();
    toast('🗑 Foto dihapus','ok');
  }
}

function openCameraCapture(){
  var input=document.getElementById('photo-file-input');
  input.setAttribute('capture','environment');
  input.click();
}

function handleAddPhoto(e){
  var file=e.target.files[0];
  if(!file)return;
  if(file.size>2*1024*1024){toast('⚠️ Ukuran file terlalu besar (maks 2MB)','err');return;}
  var reader=new FileReader();
  reader.onload=function(ev){
    addPhotoTemp=ev.target.result;
    var prev=document.getElementById('add-photo-preview');
    prev.src=addPhotoTemp;prev.style.display='block';
    document.getElementById('add-photo-placeholder').style.display='none';
    document.getElementById('add-photo-actions').style.display='flex';
  };
  reader.readAsDataURL(file);
}

function clearAddPhoto(){
  addPhotoTemp=null;
  var prev=document.getElementById('add-photo-preview');
  prev.style.display='none';prev.src='';
  document.getElementById('add-photo-placeholder').style.display='flex';
  document.getElementById('add-photo-actions').style.display='none';
  document.getElementById('add-photo-input').value='';
}

// Patch simpanBarang to include photo
var _origSimpan2=simpanBarang;
simpanBarang=function(){
  var nama=document.getElementById('a-nama').value.trim();
  var lok=document.getElementById('a-lokasi').value;
  var kat=document.getElementById('a-kat').value.trim();
  var sat=document.getElementById('a-sat').value.trim();
  var stok=parseInt(document.getElementById('a-stok').value)||0;
  var min=parseInt(document.getElementById('a-min').value)||5;
  var emoji=document.getElementById('a-emoji').value;
  if(!nama||!kat||!sat){toast('⚠️ Nama, kategori & satuan wajib diisi','err');return;}
  var obj={id:nextId++,nama,lokasi:lok,kat,sat,stok,min,emoji};
  if(addPhotoTemp)obj.foto=addPhotoTemp;
  barang.push(obj);
  closeModal('modal-add');
  document.getElementById('a-nama').value='';document.getElementById('a-kat').value='';
  document.getElementById('a-sat').value='';document.getElementById('a-stok').value='';
  clearAddPhoto();
  buildCatbar();renderGrid();debounceSave();
  toast('✅ Barang "'+nama+'" berhasil ditambahkan','ok');
};

// =========== OVERRIDE INIT TO LOAD DATA ===========
// Load persisted data first
loadData();
// Add overlay close listeners for new modals
document.getElementById('modal-barcode').addEventListener('click',function(e){if(e.target===this)closeBarcodeModal();});
document.getElementById('modal-photo').addEventListener('click',function(e){if(e.target===this)closeModal('modal-photo');});
// Init
buildCatbar();
renderGrid();
updateStats();
setDateDisplay();
document.getElementById('mf-tanggal').value=todayStr();
initRekapTahun();
// Show data source toast
setTimeout(function(){
  var had=localStorage.getItem(LS_KEY_BARANG);
  if(had)toast('💾 Data tersimpan berhasil dimuat','ok');
},800);
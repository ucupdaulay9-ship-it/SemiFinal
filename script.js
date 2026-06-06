// ==========================================
// 1. UTILITY UTAMA & ENGINE TOAST NOTIFIKASI
// ==========================================
function formatRupiah(angka) { return 'Rp ' + angka.toLocaleString('id-ID'); }

let riwayatPesananProduk = [];
let riwayatPesananJasa = [];
let keranjangBelanja = []; 

// Fungsi Desain Toast Pengganti Alert Kaku
function tampilkanToast(pesan, tipe = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', tipe);
    
    const iconClass = tipe === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${pesan}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 50);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Fungsi Mengontrol Pop-up Nota Sukses Transaksi
function bukaSuccessModal(htmlKonten) {
    document.getElementById('success-details-box').innerHTML = htmlKonten;
    document.getElementById('success-modal').classList.add('active');
    document.getElementById('success-overlay').classList.add('active');
}
function tutupSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    document.getElementById('success-overlay').classList.remove('active');
}

// ==========================================
// 2. LOGIKA KERANJANG & CHECKOUT PRODUK
// ==========================================
function tambahKeKeranjang(namaProduk, harga) {
    let index = keranjangBelanja.findIndex(item => item.nama === namaProduk);
    if (index !== -1) {
        keranjangBelanja[index].kuantitas += 1;
        keranjangBelanja[index].totalHarga = keranjangBelanja[index].kuantitas * keranjangBelanja[index].hargaDasar;
    } else {
        keranjangBelanja.push({ nama: namaProduk, hargaDasar: harga, kuantitas: 1, totalHarga: harga });
    }
    perbaruiTampilanKeranjang();
    tampilkanToast(`${namaProduk} berhasil masuk keranjang!`);
}

function tambahKuantitas(index) {
    keranjangBelanja[index].kuantitas += 1;
    keranjangBelanja[index].totalHarga = keranjangBelanja[index].kuantitas * keranjangBelanja[index].hargaDasar;
    perbaruiTampilanKeranjang();
}

function kurangKuantitas(index) {
    if (keranjangBelanja[index].kuantitas > 1) {
        keranjangBelanja[index].kuantitas -= 1;
        keranjangBelanja[index].totalHarga = keranjangBelanja[index].kuantitas * keranjangBelanja[index].hargaDasar;
        perbaruiTampilanKeranjang();
    } else { hapusItem(index); }
}

// Variabel untuk menyimpan indeks item yang sedang dipilih untuk dihapus
let itemYangAkanDihapus = null;

// Memunculkan Modal Konfirmasi Modern
function hapusItem(index) {
    itemYangAkanDihapus = index;
    
    // Ubah teks agar sesuai dengan nama item yang akan dihapus
    const namaItem = keranjangBelanja[index].nama;
    document.getElementById('konfirmasi-teks').innerHTML = `Hapus <strong>"${namaItem}"</strong> dari keranjang?`;
    
    // Tampilkan modal
    document.getElementById('konfirmasi-overlay').classList.add('active');
    document.getElementById('konfirmasi-modal').classList.add('active');
}

// Menutup Modal Konfirmasi
function tutupKonfirmasi() {
    itemYangAkanDihapus = null;
    document.getElementById('konfirmasi-overlay').classList.remove('active');
    document.getElementById('konfirmasi-modal').classList.remove('active');
}

// Eksekusi penghapusan jika tombol "Ya, Hapus" ditekan
function prosesHapusItem() {
    if (itemYangAkanDihapus !== null) {
        keranjangBelanja.splice(itemYangAkanDihapus, 1);
        perbaruiTampilanKeranjang();
        tutupKonfirmasi(); // Tutup modal konfirmasinya
        tampilkanToast("Item berhasil dihapus.", "info");
    }
}

function perbaruiTampilanKeranjang() {
    const daftar = document.getElementById('daftar-keranjang-modal');
    const totalEl = document.getElementById('total-harga-modal');
    const totalCOProduk = document.getElementById('co-produk-total-bayar');
    
    daftar.innerHTML = '';
    let totalHargaKeranjang = 0;

    if (keranjangBelanja.length === 0) {
        daftar.innerHTML = '<p style="text-align: center; color: #94A3B8; margin-top: 20px;">Keranjang kosong.</p>';
    } else {
        keranjangBelanja.forEach((item, index) => {
            totalHargaKeranjang += item.totalHarga;
            daftar.innerHTML += `
                <div class="item-keranjang-dinamis">
                    <div class="info-atas"><span>${item.nama}</span><span style="color: #64748B;">${formatRupiah(item.hargaDasar)}</span></div>
                    <div class="info-bawah">
                        <div class="kontrol-kuantitas">
                            <button class="btn-qty" onclick="kurangKuantitas(${index})">-</button>
                            <span class="angka-qty">${item.kuantitas}</span>
                            <button class="btn-qty" onclick="tambahKuantitas(${index})">+</button>
                            <button class="btn-hapus" onclick="hapusItem(${index})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <div class="harga-subtotal">${formatRupiah(item.totalHarga)}</div>
                    </div>
                </div>`;
        });
    }
    const teksTotal = formatRupiah(totalHargaKeranjang);
    totalEl.innerText = teksTotal;
    if(totalCOProduk) totalCOProduk.innerText = teksTotal;
}

function bukaKeranjang() { document.getElementById('cart-modal').classList.add('active'); document.getElementById('cart-overlay').classList.add('active'); }
function tutupKeranjang() { document.getElementById('cart-modal').classList.remove('active'); document.getElementById('cart-overlay').classList.remove('active'); }
function bukaCheckoutProduk() { if(keranjangBelanja.length === 0) { tampilkanToast("Keranjang Anda masih kosong!", "info"); return; } tutupKeranjang(); document.getElementById('checkout-produk-modal').classList.add('active'); document.getElementById('checkout-produk-overlay').classList.add('active'); }
function tutupCheckoutProduk() { document.getElementById('checkout-produk-modal').classList.remove('active'); document.getElementById('checkout-produk-overlay').classList.remove('active'); }

// Selesaikan Pesanan Produk Hasil Tani (Bypass Armada)
function prosesCheckoutSayur() {
    const nama = document.getElementById('co-produk-nama').value;
    const hp = document.getElementById('co-produk-hp').value;
    const alamat = document.getElementById('co-produk-alamat').value;
    const metodeEl = document.querySelector('input[name="metode-produk"]:checked');
    const metode = metodeEl ? metodeEl.value : "Belum dipilih";
    
    if(!nama || !hp || !alamat) { 
        tampilkanToast("Mohon lengkapi seluruh formulir!", "info"); 
        return; 
    }
    
    let totalAkhir = keranjangBelanja.reduce((sum, item) => sum + item.totalHarga, 0);
    let rincianTextHTML = keranjangBelanja.map(item => `• ${item.kuantitas}x ${item.nama} (${formatRupiah(item.totalHarga)})`).join("<br>");
    let orderId = "TNG-P-" + Math.floor(Math.random() * 100000);

    let pesananBaru = { id: orderId, tanggal: new Date().toLocaleString('id-ID'), items: rincianTextHTML, total: totalAkhir, status: "Dikemas" };
    riwayatPesananProduk.unshift(pesananBaru);
    
    let notaHTML = `
        <div class="invoice-success-box">
            <h4>ID Pesanan: ${orderId}</h4>
            <p><strong>Penerima:</strong> ${nama} (${hp})</p>
            <p><strong>Alamat:</strong> ${alamat}</p>
            <p style="margin-top:8px; margin-bottom:4px;"><strong>Rincian Item & Pengiriman:</strong></p>
            <p style="color:var(--text-muted); line-height:1.4;">${rincianTextHTML}</p>
            <p style="margin-top:8px;"><strong>Metode Bayar:</strong> ${metode}</p>
            <p style="margin-top:10px; font-weight:bold; color:var(--brand-green); font-size:1.05rem;">Total Akhir: ${formatRupiah(totalAkhir)}</p>
        </div>`;
    
    tutupCheckoutProduk();
    bukaSuccessModal(notaHTML); 

    keranjangBelanja = []; perbaruiTampilanKeranjang();
    document.getElementById('co-produk-nama').value = ''; document.getElementById('co-produk-hp').value = ''; document.getElementById('co-produk-alamat').value = '';
}

// ==========================================
// 3. LOGIKA REAL PETA (STABIL & OFFLINE)
// ==========================================
let map, markerJemput, markerTujuan, garisRute;
let jarakGlobalKm = 0; let waktuGlobalMenit = 0; let transaksiJasaAktif = null;

window.addEventListener('load', function() {
    map = L.map('map-interaktif').setView([5.1805, 97.1507], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

    const ikonBiru = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', iconSize: [25, 41], iconAnchor: [12, 41] });
    const ikonMerah = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41] });

    markerJemput = L.marker([3.3223367, 99.1622936], { draggable: true, icon: ikonBiru }).addTo(map).bindPopup("Lokasi A: Jemput").openPopup();
    markerTujuan = L.marker([3.3213557, 99.1645828], { draggable: true, icon: ikonMerah }).addTo(map).bindPopup("Lokasi B: Tujuan");
    garisRute = L.polyline([markerJemput.getLatLng(), markerTujuan.getLatLng()], { color: '#3B82F6', weight: 4, dashArray: '5, 10' }).addTo(map);

    markerJemput.on('drag', kalkulasiJarakLangsung);
    markerTujuan.on('drag', kalkulasiJarakLangsung);
    kalkulasiJarakLangsung();
});

function kalkulasiJarakLangsung() {
    let latlngA = markerJemput.getLatLng();
    let latlngB = markerTujuan.getLatLng();
    garisRute.setLatLngs([latlngA, latlngB]);
    
    let jarakMeter = latlngA.distanceTo(latlngB);
    jarakGlobalKm = Math.ceil((jarakMeter * 1.3) / 1000);
    if(jarakGlobalKm === 0) jarakGlobalKm = 1;
    
    document.getElementById('global-teks-jarak').innerText = jarakGlobalKm + " km";
    perbaruiDaftarTarifArmada(jarakGlobalKm);
}

function cariLokasi(tipe) {
    const idInput = tipe === 'jemput' ? 'alamat-jemput' : 'alamat-tujuan';
    const query = document.getElementById(idInput).value;
    if(!query) { tampilkanToast("Ketikkan alamat yang dicari!", "info"); return; }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if(data && data.length > 0) {
                const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon);
                if(tipe === 'jemput') { markerJemput.setLatLng([lat, lon]); map.setView([lat, lon], 13); } 
                else { markerTujuan.setLatLng([lat, lon]); map.setView([lat, lon], 13); }
                kalkulasiJarakLangsung();
                tampilkanToast("Lokasi berhasil dipetakan!");
            } else { tampilkanToast("Alamat tidak ditemukan!", "info"); }
        }).catch(err => { tampilkanToast("Gagal memuat peta internet.", "info"); });
}

function perbaruiDaftarTarifArmada(jarakKm) {
    waktuGlobalMenit = jarakKm * 1;
    const durasiWaktuTeks = (waktuGlobalMenit >= 60) ? `${Math.floor(waktuGlobalMenit / 60)} jam ${waktuGlobalMenit % 60} mnt` : `${waktuGlobalMenit} menit`;
    
    const tarifPickup = 22000 + (jarakKm * 3000); const tarifBox = 28000 + (jarakKm * 5000); const tarifTruk = 33000 + (jarakKm * 7000);

    document.getElementById('tarif-pickup').innerText = formatRupiah(tarifPickup); document.getElementById('waktu-pickup').innerText = durasiWaktuTeks;
    document.getElementById('tarif-box').innerText = formatRupiah(tarifBox); document.getElementById('waktu-box').innerText = durasiWaktuTeks;
    document.getElementById('tarif-truk').innerText = formatRupiah(tarifTruk); document.getElementById('waktu-truk').innerText = durasiWaktuTeks;
}

// ==========================================
// 4. CHECKOUT JASA LOGISTIK
// ==========================================
function bukaPembayaranJasa(namaJasa, hargaDasar, tarifPerKm) {
    let tarifAkhir = hargaDasar + (jarakGlobalKm * tarifPerKm);
    transaksiJasaAktif = { nama: namaJasa, jarak: jarakGlobalKm + " km", waktu: document.getElementById('waktu-pickup').innerText, totalBiaya: tarifAkhir };

    document.getElementById('pay-nama-jasa').innerText = transaksiJasaAktif.nama;
    document.getElementById('pay-jarak').innerText = transaksiJasaAktif.jarak;
    document.getElementById('pay-waktu').innerText = transaksiJasaAktif.waktu;
    document.getElementById('pay-total-harga').innerText = formatRupiah(transaksiJasaAktif.totalBiaya);

    document.getElementById('payment-modal').classList.add('active');
    document.getElementById('payment-overlay').classList.add('active');
}
function tutupPembayaranJasa() { document.getElementById('payment-modal').classList.remove('active'); document.getElementById('payment-overlay').classList.remove('active'); }

function prosesPembayaranLangsung() {
    const nama = document.getElementById('jasa-nama-pemesan').value;
    const hp = document.getElementById('jasa-hp-pemesan').value;
    const metode = document.querySelector('input[name="metode-opsi"]:checked').value;
    
    if(!nama || !hp) { tampilkanToast("Isi Nama Pemesan dan No HP dahulu!", "info"); return; }
    
    let orderId = "TNG-J-" + Math.floor(Math.random() * 100000);
    let pesananBaru = { id: orderId, tanggal: new Date().toLocaleString('id-ID'), layanan: transaksiJasaAktif.nama, jarak: transaksiJasaAktif.jarak, total: transaksiJasaAktif.totalBiaya, status: "Menunggu Driver" };
    riwayatPesananJasa.unshift(pesananBaru);
    
    let notaJasaHTML = `
        <div class="invoice-success-box">
            <h4>ID Logistik: ${orderId}</h4>
            <p><strong>Nama Pemesan:</strong> ${nama}</p>
            <p><strong>No HP Klien:</strong> ${hp}</p>
            <p style="margin-top:6px; border-top:1px dashed #CBD5E1; padding-top:6px;"><strong>Jenis Armada:</strong> ${transaksiJasaAktif.nama}</p>
            <p><strong>Jarak Distribusi:</strong> ${transaksiJasaAktif.jarak}</p>
            <p><strong>Estimasi Perjalanan:</strong> ${transaksiJasaAktif.waktu}</p>
            <p><strong>Metode Pembayaran:</strong> ${metode}</p>
            <p style="margin-top:10px; font-weight:bold; color:var(--brand-green); font-size:1.05rem;">Total Biaya: ${formatRupiah(transaksiJasaAktif.totalBiaya)}</p>
        </div>`;
    
    tutupPembayaranJasa();
    bukaSuccessModal(notaJasaHTML); 

    document.getElementById('jasa-nama-pemesan').value = ''; document.getElementById('jasa-hp-pemesan').value = '';
}

// ==========================================
// 5. NAVIGASI TAB PESANAN SAYA
// ==========================================
function bukaPesananSaya() { renderRiwayatPesanan(); document.getElementById('riwayat-modal').classList.add('active'); document.getElementById('riwayat-overlay').classList.add('active'); }
function tutupPesananSaya() { document.getElementById('riwayat-modal').classList.remove('active'); document.getElementById('riwayat-overlay').classList.remove('active'); }

function gantiTabPesanan(tab) {
    document.getElementById('tab-produk-btn').classList.remove('active');
    document.getElementById('tab-jasa-btn').classList.remove('active');
    document.getElementById('konten-riwayat-produk').style.display = 'none';
    document.getElementById('konten-riwayat-jasa').style.display = 'none';

    if (tab === 'produk') {
        document.getElementById('tab-produk-btn').classList.add('active');
        document.getElementById('konten-riwayat-produk').style.display = 'block';
    } else {
        document.getElementById('tab-jasa-btn').classList.add('active');
        document.getElementById('konten-riwayat-jasa').style.display = 'block';
    }
}

function renderRiwayatPesanan() {
    const listProduk = document.getElementById('konten-riwayat-produk');
    const listJasa = document.getElementById('konten-riwayat-jasa');

    if (riwayatPesananProduk.length === 0) {
        listProduk.innerHTML = '<p style="text-align: center; color: #94A3B8; margin-top: 20px;">Belum ada riwayat pesanan produk.</p>';
    } else {
        listProduk.innerHTML = riwayatPesananProduk.map(order => `
            <div class="kartu-riwayat">
                <div class="kartu-riwayat-header"><span><i class="fa-solid fa-hashtag"></i> ${order.id}</span><span class="status-badge">${order.status}</span></div>
                <div class="kartu-riwayat-body"><div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 5px;">${order.tanggal}</div><div>${order.items}</div></div>
                <div class="kartu-riwayat-footer">Total Belanja <span>${formatRupiah(order.total)}</span></div>
            </div>`).join('');
    }

    if (riwayatPesananJasa.length === 0) {
        listJasa.innerHTML = '<p style="text-align: center; color: #94A3B8; margin-top: 20px;">Belum ada riwayat pesanan armada.</p>';
    } else {
        listJasa.innerHTML = riwayatPesananJasa.map(order => `
            <div class="kartu-riwayat">
                <div class="kartu-riwayat-header"><span><i class="fa-solid fa-hashtag"></i> ${order.id}</span><span class="status-badge" style="background:#DBEAFE; color:#2563EB;">${order.status}</span></div>
                <div class="kartu-riwayat-body"><div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 5px;">${order.tanggal}</div><div style="font-weight:bold;">${order.layanan}</div><div style="color:#64748B; font-size:0.85rem;">Jarak: ${order.jarak}</div></div>
                <div class="kartu-riwayat-footer">Tarif Layanan <span>${formatRupiah(order.total)}</span></div>
            </div>`).join('');
    }
}

// ==========================================
// 6. FUNGSI DROPDOWN CARD & LOGIKA PEMBELIAN BARU
// ==========================================
function toggleDropdown(button) {
    const menu = button.nextElementSibling;
    document.querySelectorAll('.dd-menu').forEach(m => { 
        if(m !== menu) m.style.display = 'none'; 
    });
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function selectOption(optionElement, type, text, price) {
    const card = optionElement.closest('.kartu-produk');
    const container = optionElement.closest('.dd-container');
    const btnText = container.querySelector('.dd-btn span');
    const menu = container.querySelector('.dd-menu');

    btnText.innerText = text;
    menu.style.display = 'none';

    if (type === 'produk') {
        card.dataset.priceProduk = price;
        const jasaBtn = card.querySelectorAll('.dd-btn span')[1]; 
        if(jasaBtn) jasaBtn.innerText = '-- Pilih Layanan --';
        card.dataset.priceJasa = 0;
    } else if (type === 'jasa') {
        card.dataset.priceJasa = price;
        const produkBtn = card.querySelectorAll('.dd-btn span')[0]; 
        if(produkBtn) produkBtn.innerText = '-- Pilih Produk --';
        card.dataset.priceProduk = 0;
    } else if (type === 'pengiriman') {
        card.dataset.pricePengiriman = price;
    }

    calculateTotal(card);
}

function changeQuantity(btn, val) {
    const card = btn.closest('.kartu-produk');
    const qtySpan = card.querySelector('.qty-val');
    
    let currentQty = parseInt(qtySpan.innerText) || 1;
    currentQty = Math.max(1, currentQty + val); 
    
    qtySpan.innerText = currentQty;
    card.dataset.qty = currentQty;
    
    calculateTotal(card);
}

function calculateTotal(card) {
    const priceProduk = parseInt(card.dataset.priceProduk) || 0;
    const priceJasa = parseInt(card.dataset.priceJasa) || 0;
    const pricePengiriman = parseInt(card.dataset.pricePengiriman) || 0;
    const qty = parseInt(card.dataset.qty) || 1;

    let hargaDasar = (priceJasa > 0) ? priceJasa : priceProduk;
    let total = (hargaDasar * qty) + pricePengiriman;

    const priceDisplay = card.querySelector('.harga-total');
    priceDisplay.innerText = formatRupiah(total);
}

// Fungsi untuk membaca data dari card dan mengecek status kelengkapannya
function getDataDariCard(tombol) {
    const card = tombol.closest('.kartu-produk');
    const spanDropdowns = card.querySelectorAll('.dd-btn span');
    
    const produkPilihan = spanDropdowns[0] ? spanDropdowns[0].innerText : '';
    const jasaPilihan = spanDropdowns[1] ? spanDropdowns[1].innerText : '';
    const pengirimanPilihan = spanDropdowns[2] ? spanDropdowns[2].innerText : '';
    
    let namaItem = card.querySelector('h4').innerText; 
    let adaProduk = false;
    let adaPengiriman = false;
    
    // Cek apakah Produk / Layanan sudah dipilih
    if (produkPilihan !== '-- Pilih Produk --' && produkPilihan !== '-- Batalkan Pilihan --') {
        namaItem = produkPilihan;
        adaProduk = true;
    } else if (jasaPilihan !== '-- Pilih Layanan --' && jasaPilihan !== '-- Batalkan Pilihan --') {
        namaItem = jasaPilihan;
        adaProduk = true;
    }

    // Cek apakah Pengiriman sudah dipilih
    if (pengirimanPilihan !== '-- Pilih Pengiriman --' && pengirimanPilihan !== '-- Batalkan Pilihan --') {
        namaItem += ` (+ ${pengirimanPilihan})`;
        adaPengiriman = true;
    }

    const qty = parseInt(card.dataset.qty) || 1;
    if(qty > 1) {
        namaItem += ` (x${qty})`;
    }

    const priceProduk = parseInt(card.dataset.priceProduk) || 0;
    const priceJasa = parseInt(card.dataset.priceJasa) || 0;
    const pricePengiriman = parseInt(card.dataset.pricePengiriman) || 0;
    
    let hargaDasar = (priceJasa > 0) ? priceJasa : priceProduk;
    let totalHarga = (hargaDasar * qty) + pricePengiriman;

    return { 
        nama: namaItem, 
        harga: totalHarga, 
        adaProduk: adaProduk, 
        adaPengiriman: adaPengiriman 
    };
}

// Fungsi Pusat untuk Validasi (Peringatan Dua Arah)
function validasiPilihanCard(data) {
    if (!data.adaProduk && !data.adaPengiriman) {
        tampilkanToast('Pilih Produk dan Pengiriman terlebih dahulu!', 'warning');
        return false;
    }
    if (!data.adaProduk && data.adaPengiriman) {
        tampilkanToast('Anda belum memilih Produk atau Layanan Packing!', 'warning');
        return false;
    }
    if (data.adaProduk && !data.adaPengiriman) {
        tampilkanToast('Anda belum memilih metode Pengiriman!', 'warning');
        return false;
    }
    return true; // Lolos semua pengecekan
}

// Tombol Masukkan Ke Keranjang
function masukkanKeKeranjang(tombol) {
    const data = getDataDariCard(tombol);
    
    // Cek validasi sebelum masuk keranjang
    if (!validasiPilihanCard(data)) return;
    
    tambahKeKeranjang(data.nama, data.harga);
}

// Tombol Beli Sekarang (Langsung Checkout)
function prosesBeliSekarang(tombol) {
    const data = getDataDariCard(tombol);
    
    // Cek validasi sebelum lanjut checkout
    if (!validasiPilihanCard(data)) return;
    
    keranjangBelanja = [{ 
        nama: data.nama, 
        hargaDasar: data.harga, 
        kuantitas: 1, 
        totalHarga: data.harga 
    }];
    
    perbaruiTampilanKeranjang();
    bukaCheckoutProduk(); 

    
    // Set item langsung (kuantitas 1 karena kalkulasi harga qty & pengiriman sudah beres di dalam data.harga)
    keranjangBelanja = [{ 
        nama: data.nama, 
        hargaDasar: data.harga, 
        kuantitas: 1, 
        totalHarga: data.harga 
    }];
    
    perbaruiTampilanKeranjang();
    bukaCheckoutProduk(); 
}

// ==========================================
// 7. SISTEM PENILAIAN & ULASAN PELANGGAN
// ==========================================

// Data Ulasan Palsu (Pemanis)
let dataUlasan = [
    { nama: "Bapak Supardi (Pemilik Warung)", layanan: "Kantong Karton", rating: 5, teks: "Packingannya sangat bagus, rapi, dan sudah pastinya aman. Saat sampai di rumah barang aman sentosa!" },
    { nama: "Rumah Makan Padang", layanan: "Jasa Logistik (Sewa Mobil Box)", rating: 4, teks: "Sopirnya ramah dan tepat waktu. Sayangnya kemarin sempat telat 10 menit karena macet, tapi barang tetap aman terjaga." },
    { nama: "Ibu Siti Aminah", layanan: "Kantong Plastik", rating: 5, teks: "Walaupun packingnya kantong plastik tetapi sangat dijaga semuanya, jadi semua barang-barangnya aman sampai tujuan. Langganan terus di TaniGo!" }
];

// Menjalankan fitur saat web dimuat
document.addEventListener('DOMContentLoaded', function() {
    inisialisasiBintang();
    renderUlasan();
});

// Fitur Animasi Bintang saat di-klik & di-hover
function inisialisasiBintang() {
    const stars = document.querySelectorAll('#star-rating i');
    const scoreInput = document.getElementById('review-score');

    stars.forEach(star => {
        // Saat mouse lewat (hover)
        star.addEventListener('mouseover', function() {
            let val = this.getAttribute('data-value');
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= val) s.classList.add('hover');
                else s.classList.remove('hover');
            });
        });

        // Saat mouse keluar
        star.addEventListener('mouseout', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });

        // Saat di-klik
        star.addEventListener('click', function() {
            let val = this.getAttribute('data-value');
            scoreInput.value = val;
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= val) s.classList.add('active');
                else s.classList.remove('active');
            });
        });
    });
}

// Menampilkan Data Ulasan ke HTML
function renderUlasan() {
    const wadah = document.getElementById('daftar-ulasan');
    if (!wadah) return;
    
    wadah.innerHTML = ''; // Bersihkan dulu

    dataUlasan.forEach(ulasan => {
        // Buat ikon bintang sesuai rating
        let bintangHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= ulasan.rating) {
                bintangHtml += '<i class="fa-solid fa-star"></i>';
            } else {
                bintangHtml += '<i class="fa-regular fa-star" style="color:#CBD5E1"></i>';
            }
        }

        // Cetak kartu HTML
        wadah.innerHTML += `
            <div class="kartu-ulasan">
                <div class="ulasan-header">
                    <div>
                        <div class="ulasan-nama">${ulasan.nama}</div>
                        <div class="ulasan-layanan">${ulasan.layanan}</div>
                    </div>
                    <div class="ulasan-bintang">${bintangHtml}</div>
                </div>
                <div class="ulasan-teks">"${ulasan.teks}"</div>
            </div>
        `;
    });
}

// Fungsi tombol Kirim Ulasan
function kirimUlasan() {
    const layanan = document.getElementById('review-service').value;
    const rating = parseInt(document.getElementById('review-score').value);
    const teks = document.getElementById('review-text').value;

    // Validasi
    if (layanan === "") {
        if(typeof tampilkanToast === "function") tampilkanToast("Silakan pilih Layanan/Produk terlebih dahulu!", "warning");
        else alert("Silakan pilih Layanan/Produk!");
        return;
    }
    if (rating === 0) {
        if(typeof tampilkanToast === "function") tampilkanToast("Silakan klik bintang untuk memberi rating!", "warning");
        else alert("Silakan beri rating bintang!");
        return;
    }
    if (teks.trim() === "") {
        if(typeof tampilkanToast === "function") tampilkanToast("Komentar ulasan tidak boleh kosong!", "warning");
        else alert("Komentar tidak boleh kosong!");
        return;
    }

    // Masukkan data baru ke urutan Paling Atas (unshift)
    dataUlasan.unshift({
        nama: "Anda (Pelanggan Baru)",
        layanan: layanan,
        rating: rating,
        teks: teks
    });

    // Reset Form
    document.getElementById('review-text').value = '';
    document.getElementById('review-score').value = '0';
    document.getElementById('review-service').value = ''; // Reset nilai input hidden
    document.getElementById('review-service-text').innerText = '-- Pilih Layanan/Produk --'; // Reset teks dropdown
    document.querySelectorAll('#star-rating i').forEach(s => s.classList.remove('active'));

    // Tampilkan Ulang & Beri Notifikasi
    renderUlasan();
    if(typeof tampilkanToast === "function") tampilkanToast("Terima kasih! Ulasan Anda berhasil dikirim.");
}

// Fungsi baru untuk menangani pilihan pada dropdown ulasan
function pilihLayananUlasan(element, nilai) {
    // Ubah teks yang tampil di tombol dropdown
    document.getElementById('review-service-text').innerText = nilai;
    // Simpan nilai ke dalam hidden input untuk dikirim
    document.getElementById('review-service').value = nilai;
    
    // Tutup menu dropdown setelah dipilih
    element.closest('.dd-menu').style.display = 'none';
}
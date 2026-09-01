// Ambil elemen-elemen yang dibutuhkan
const form = document.getElementById("form-tugas");
const inputTugas = document.getElementById("input-tugas");
const daftarTugas = document.getElementById("daftar-tugas");
const kosong = document.getElementById("kosong");
const sisaTugas = document.getElementById("sisa-tugas");
const hapusSelesaiBtn = document.getElementById("hapus-selesai");
const filterBtns = document.querySelectorAll(".filter-btn");

// Ambil data tugas dari localStorage (kalau ada), kalau tidak mulai dari array kosong
let tugas = JSON.parse(localStorage.getItem("tugas")) || [];
let filterAktif = "semua";

// Simpan array "tugas" ke localStorage supaya tidak hilang saat halaman di-refresh
function simpan() {
  localStorage.setItem("tugas", JSON.stringify(tugas));
}

// Tampilkan ulang daftar tugas ke halaman, sesuai filter yang aktif
function tampilkan() {
  daftarTugas.innerHTML = "";

  let tugasTampil = tugas.filter((item) => {
    if (filterAktif === "aktif") return !item.selesai;
    if (filterAktif === "selesai") return item.selesai;
    return true; // filter "semua"
  });

  kosong.style.display = tugasTampil.length === 0 ? "block" : "none";

  tugasTampil.forEach((item) => {
    const li = document.createElement("li");
    li.className = "tugas" + (item.selesai ? " selesai" : "");

    li.innerHTML = `
      <input type="checkbox" ${item.selesai ? "checked" : ""} />
      <span>${item.teks}</span>
      <button class="hapus" title="Hapus tugas">✕</button>
    `;

    // Checkbox: tandai selesai / belum selesai
    li.querySelector("input").addEventListener("change", () => {
      item.selesai = !item.selesai;
      simpan();
      tampilkan();
    });

    // Tombol hapus
    li.querySelector(".hapus").addEventListener("click", () => {
      tugas = tugas.filter((t) => t.id !== item.id);
      simpan();
      tampilkan();
    });

    daftarTugas.appendChild(li);
  });

  const jumlahAktif = tugas.filter((item) => !item.selesai).length;
  sisaTugas.textContent = jumlahAktif + " tugas tersisa";
}

// Tambah tugas baru saat form di-submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const teks = inputTugas.value.trim();
  if (teks === "") return;

  tugas.push({
    id: Date.now(), // id unik pakai timestamp
    teks: teks,
    selesai: false,
  });

  inputTugas.value = "";
  simpan();
  tampilkan();
});

// Ganti filter (Semua / Aktif / Selesai)
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filterAktif = btn.dataset.filter;
    tampilkan();
  });
});

// Hapus semua tugas yang sudah selesai
hapusSelesaiBtn.addEventListener("click", () => {
  tugas = tugas.filter((item) => !item.selesai);
  simpan();
  tampilkan();
});

// Tampilkan daftar tugas pertama kali saat halaman dibuka
tampilkan();

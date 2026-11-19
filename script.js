
const tanggalWaktu = document.getElementById("tanggal-waktu");

function tampilkanWaktu() {
    if (!tanggalWaktu) return;

    const sekarang = new Date();

    const formatTanggal = sekarang.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const formatWaktu = sekarang.toLocaleTimeString("id-ID");

    tanggalWaktu.textContent =
        formatTanggal + " | " + formatWaktu;
}

tampilkanWaktu();

setInterval(tampilkanWaktu, 1000);

const pemainSquad = [

    { nama: "Bruno Fernandes" },
    { nama: "Kobbie Mainoo" },
    { nama: "Harry Maguire" },
    { nama: "Senne Lammens" },
    { nama: "Carlos Baleba" },
    { nama: "Youri Tielemans" },
    { nama: "Andrey Santos" },
    { nama: "Amad Diallo" },
    { nama: "Matheus Cunha" },
    { nama: "Bryan Mbeumo" },
    { nama: "Benjamin Sesko" },
    { nama: "Joshua Zirkzee" },
    { nama: "Marcus Rashford" },
    { nama: "Noussair Mazraoui" },
    { nama: "Matthijs de Ligt" },
    { nama: "Leny Yoro" },
    { nama: "Mason Mount" },
    { nama: "Diogo Dalot" },
    { nama: "Luke Shaw" },
    { nama: "Patrick Dorgu" },
    { nama: "Karl Darlow" },
    { nama: "Tom Heaton" },
    { nama: "Lisandro Martinez" }
];
const API_KEY = "123";

const URL_API =
    "https://www.thesportsdb.com/api/v1/json/" +
    API_KEY +
    "/searchplayers.php?p=";

const musimSquad = document.getElementById("musim-squad");

function dapatkanMusimBerjalan() {
    const sekarang = new Date();

    let tahunAwal = sekarang.getFullYear();
    if (sekarang.getMonth() < 6) {
        tahunAwal--;
    }

    return tahunAwal + "/" + (tahunAwal + 1);
}

if (musimSquad) {
    musimSquad.textContent =
        "Musim " + dapatkanMusimBerjalan();
}


async function cariPemain(nama) {
    const response = await fetch(
        URL_API + encodeURIComponent(nama)
    );

    if (!response.ok) {
        throw new Error("Gagal mengambil data " + nama);
    }

    const data = await response.json();

    if (!data.player) {
        return null;
    }
    const pemainManchesterUnited = data.player.filter(function (pemain) {
        return (pemain.strTeam || "").trim().toLowerCase() ===
            "manchester united";
    });

    if (pemainManchesterUnited.length === 0) {
        return null;
    }

    const namaDicari = nama.trim().toLowerCase();

    return pemainManchesterUnited.find(function (pemain) {
        return (pemain.strPlayer || "").trim().toLowerCase() ===
            namaDicari;
    }) || pemainManchesterUnited[0];
}

function tentukanKategori(posisi) {
    const posisiLower = (posisi || "").toLowerCase();

    if (
        posisiLower.includes("goalkeeper") ||
        posisiLower.includes("goal keeper")
    ) {
        return "Goalkeeper";
    }

    if (
        posisiLower.includes("defender") ||
        posisiLower.includes("back")
    ) {
        return "Defender";
    }

    if (posisiLower.includes("midfield")) {
        return "Midfielder";
    }

    if (
        posisiLower.includes("forward") ||
        posisiLower.includes("striker") ||
        posisiLower.includes("winger") ||
        posisiLower.includes("wing")
    ) {
        return "Forward";
    }

    return "Lainnya";
}

function buatKartuPemain(pemain) {
    const card = document.createElement("article");
    card.className = "pemain-card";
    const figure = document.createElement("figure");
    figure.className = "pemain-foto";

    const foto = pemain.strCutout || pemain.strThumb;

    if (foto) {
        const img = document.createElement("img");

        img.src = foto;
        img.alt = "Foto " + pemain.strPlayer;
        img.loading = "lazy";

        img.onerror = function () {
            const placeholder = document.createElement("span");
            placeholder.className = "foto-tidak-tersedia";
            placeholder.textContent = "Foto tidak tersedia";

            figure.replaceChildren(placeholder);
        };

        figure.appendChild(img);
    } else {
        const placeholder = document.createElement("span");
        placeholder.className = "foto-tidak-tersedia";
        placeholder.textContent = "Foto tidak tersedia";

        figure.appendChild(placeholder);
    }


    const nama = document.createElement("h4");
    nama.textContent = pemain.strPlayer || "Nama tidak tersedia";
    card.appendChild(figure);
    card.appendChild(nama);

    if (pemain.strNumber) {
        const nomor = document.createElement("p");
        nomor.className = "pemain-nomor";
        nomor.textContent = "Nomor: " + pemain.strNumber;

        card.appendChild(nomor);
    }
    const detail = document.createElement("p");
    detail.className = "pemain-detail";

    const posisi = pemain.strPosition || "Posisi tidak tersedia";
    const negara = pemain.strNationality || "Negara tidak tersedia";

    detail.textContent = posisi + " | " + negara;

    card.appendChild(detail);

    return card;
}

function tampilkanKategori(namaKategori, daftarPemain, container) {
    const section = document.createElement("section");
    section.className = "kategori-squad";

    const heading = document.createElement("h3");
    heading.textContent = namaKategori;

    const grid = document.createElement("div");
    grid.className = "pemain-grid";

    daftarPemain.forEach(function (pemain) {
        grid.appendChild(buatKartuPemain(pemain));
    });

    section.appendChild(heading);
    section.appendChild(grid);

    container.appendChild(section);
}

async function tampilkanSquad() {
    const daftarSquad = document.getElementById("daftar-squad");

    if (!daftarSquad) return;

    if (pemainSquad.length === 0) {
        daftarSquad.replaceChildren();

        const pesan = document.createElement("p");
        pesan.className = "status-pemain";
        pesan.textContent =
            "Belum ada nama pemain. Tambahkan nama pemain pada array pemainSquad di script.js.";

        daftarSquad.appendChild(pesan);
        return;
    }

    try {
        const hasil = await Promise.all(
            pemainSquad.map(async function (pemain) {
                try {
                    const dataApi = await cariPemain(pemain.nama);

                    return {
                        namaDicari: pemain.nama,
                        data: dataApi
                    };
                } catch (error) {
                    console.error(
                        "Gagal mencari " + pemain.nama + ":",
                        error
                    );

                    return {
                        namaDicari: pemain.nama,
                        data: null
                    };
                }
            })
        );
        const kategori = {
            "Goalkeeper": [],
            "Defender": [],
            "Midfielder": [],
            "Forward": [],
            "Lainnya": []
        };

        const pemainTidakDitemukan = [];

        hasil.forEach(function (hasilPencarian) {
            if (!hasilPencarian.data) {
                pemainTidakDitemukan.push(
                    hasilPencarian.namaDicari
                );
                return;
            }

            const posisi = hasilPencarian.data.strPosition;
            const namaKategori = tentukanKategori(posisi);

            kategori[namaKategori].push(hasilPencarian.data);
        });

        daftarSquad.replaceChildren();

        const urutanKategori = [
            "Goalkeeper",
            "Defender",
            "Midfielder",
            "Forward",
            "Lainnya"
        ];

        urutanKategori.forEach(function (namaKategori) {
            if (kategori[namaKategori].length > 0) {
                tampilkanKategori(
                    namaKategori,
                    kategori[namaKategori],
                    daftarSquad
                );
            }
        });
        if (pemainTidakDitemukan.length > 0) {
            const pesan = document.createElement("p");
            pesan.className = "status-pemain";

            pesan.textContent =
                "Data tidak ditemukan di TheSportsDB untuk: " +
                pemainTidakDitemukan.join(", ");

            daftarSquad.appendChild(pesan);
        }

        const jumlahPemainDitemukan = urutanKategori.reduce(
            function (total, namaKategori) {
                return total + kategori[namaKategori].length;
            },
            0
        );

        if (jumlahPemainDitemukan === 0) {
            const pesan = document.createElement("p");
            pesan.className = "status-pemain";
            pesan.textContent =
                "Tidak ada data pemain Manchester United yang berhasil ditemukan.";

            daftarSquad.prepend(pesan);
        }

    } catch (error) {
        console.error("Kesalahan mengambil data squad:", error);

        daftarSquad.replaceChildren();

        const pesan = document.createElement("p");
        pesan.className = "status-pemain";
        pesan.textContent =
            "Gagal memuat data squad. Periksa koneksi internet dan coba muat ulang halaman.";

        daftarSquad.appendChild(pesan);
    }
}

tampilkanSquad();

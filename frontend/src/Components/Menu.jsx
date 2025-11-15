import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "../lib/axios";

const fallbackMenus = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    price: 15000,
    image_url: "./menu/nasiGoreng.png",
    description: "Nasi goreng khas RungJa dengan topping lengkap.",
  },
  {
    id: 2,
    name: "Mie Ayam Original",
    price: 12000,
    image_url: "./menu/miAyam.png",
    description: "Mie ayam gurih dengan pangsit renyah.",
  },
  {
    id: 3,
    name: "Es Teh Manis",
    price: 5000,
    image_url: "./menu/esteh.png",
    description: "Kesegaran es teh manis yang pas untuk setiap menu.",
  },
  {
    id: 4,
    name: "Es Jeruk Segar",
    price: 8000,
    image_url: "./menu/esjeruk.png",
    description: "Jeruk pilihan yang diperas langsung setiap hari.",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function Menu() {
  const [menus, setMenus] = useState(fallbackMenus);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const { data } = await axios.get("/menus", { params: { per_page: 8 } });
        const items = data.data.data;
        if (items.length) {
          setMenus(items);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  return (
    <section id="menu" className="relative py-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-orange-500">
          Menu Unggulan
        </p>
        <h1 className="font-montserrat text-4xl font-bold text-gray-900 md:text-5xl">
          Rasa otentik dalam setiap gigitan
        </h1>
        <p className="max-w-2xl text-gray-500">
          Kami menyiapkan setiap menu dengan bahan segar dan resep turun temurun.
          Mulai dari makanan berat hingga minuman segar, semuanya ada di sini.
        </p>
        <Link
          to="/store"
          className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5"
        >
          Lihat Semua Menu
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {menus.map((menu) => (
          <article
            key={menu.id}
            className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-4 shadow-lg shadow-orange-200/30 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            {menu.image_url && (
              <img
                src={menu.image_url}
                alt={menu.name}
                className="h-48 w-full rounded-2xl object-cover"
              />
            )}
            <div className="mt-4 flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-orange-500">
                  Favorit
                </span>
                <span className="text-sm text-gray-400">
                  {menu.category ?? "RungJa"}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                {menu.name}
              </h3>
              <p className="mt-2 flex-1 text-sm text-gray-500">
                {menu.description ?? "Menu favorit pelanggan RungJa."}
              </p>
              <p className="mt-4 text-2xl font-bold text-gray-900">
                {formatCurrency(menu.price)}
              </p>
              <Link
                to="/store"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Pesan Sekarang
              </Link>
            </div>
          </article>
        ))}
      </div>

      {loading && (
        <p className="mt-8 text-center text-sm text-gray-500">
          Memuat menu spesial kami...
        </p>
      )}
    </section>
  );
}

export default Menu;

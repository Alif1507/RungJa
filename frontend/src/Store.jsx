import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FaCartPlus, FaSearch } from "react-icons/fa";
import axios from "./lib/axios";
import { handleSnapPayment } from "./lib/handlePay";
import { AuthContext } from "./context/AuthContextValue";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const categories = [
  { label: "Semua Kategori", value: "all" },
  { label: "Makanan", value: "makanan" },
  { label: "Minuman", value: "minuman" },
];

export default function Store() {
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({ q: "", category: "all" });
  const [menus, setMenus] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");

  const fetchMenus = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          per_page: 12,
        };

        if (filters.q.trim()) {
          params.q = filters.q.trim();
        }

        if (filters.category !== "all") {
          params.category = filters.category;
        }

        const { data } = await axios.get("/menus", { params });
        const payload = data.data;
        setMenus(payload.data);
        setPagination(payload);
      } catch (err) {
        setError(err.response?.data?.message ?? "Gagal memuat daftar menu.");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }

    setCartLoading(true);
    setCartError("");
    try {
      const { data } = await axios.get("/cart");
      setCart(data.data);
    } catch (err) {
      setCartError(err.response?.data?.message ?? "Gagal memuat keranjang.");
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMenus(1);
  }, [fetchMenus]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (menuId) => {
    if (!user) {
      setCartError("Silakan masuk terlebih dahulu untuk menambahkan ke keranjang.");
      return;
    }

    setCartLoading(true);
    setCartError("");
    setMessage("");

    try {
      const { data } = await axios.post("/cart/items", {
        menu_id: menuId,
        quantity: 1,
      });
      setCart(data.data);
      setMessage("Menu berhasil ditambahkan ke keranjang.");
    } catch (err) {
      setCartError(err.response?.data?.message ?? "Gagal menambah ke keranjang.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleUpdateItem = async (itemId, quantity) => {
    if (quantity < 1) {
      return handleRemoveItem(itemId);
    }

    setCartLoading(true);
    setCartError("");

    try {
      const { data } = await axios.put(`/cart/items/${itemId}`, { quantity });
      setCart(data.data);
    } catch (err) {
      setCartError(err.response?.data?.message ?? "Gagal memperbarui jumlah.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setCartLoading(true);
    setCartError("");

    try {
      const { data } = await axios.delete(`/cart/items/${itemId}`);
      setCart(data.data);
    } catch (err) {
      setCartError(err.response?.data?.message ?? "Gagal menghapus item.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!cart?.items?.length) {
      setCartError("Keranjang masih kosong.");
      return;
    }

    setCartLoading(true);
    setCartError("");
    setMessage("");

    try {
      const { data } = await axios.post("/checkout");
      setMessage("Pesanan berhasil dibuat, selesaikan pembayaran di Midtrans.");

      if (data.isMock && data.redirectUrl) {
        window.open(data.redirectUrl, "_blank", "noopener");
      } else if (data.snapToken) {
        try {
          await handleSnapPayment(data.snapToken);
        } catch (snapError) {
          console.warn("Snap payment did not complete:", snapError);
        }
      } else if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank", "noopener");
      }

      fetchCart();
    } catch (err) {
      setCartError(err.response?.data?.message ?? "Checkout gagal. Coba lagi.");
    } finally {
      setCartLoading(false);
    }
  };

  const goToPage = (url) => {
    if (!url) return;
    const params = new URL(url, window.location.origin).searchParams;
    const page = Number(params.get("page") ?? 1);
    fetchMenus(page);
  };

  const cartItemsCount = cart?.items?.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const cartTotal = useMemo(
    () =>
      cart?.items?.reduce(
        (total, item) => total + item.quantity * Number(item.price),
        0
      ) ?? 0,
    [cart]
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <header className="mb-6">
            <p className="text-sm uppercase tracking-widest text-orange-500">
              Menu Pilihan
            </p>
            <h1 className="text-4xl font-bold text-gray-900">
              Temukan menu favorit kamu 🍜
            </h1>
            <p className="mt-2 text-gray-500">
              Cari makanan atau minuman, filter berdasarkan kategori, dan
              tambahkan ke keranjang hanya dengan sekali klik.
            </p>
          </header>

          <div className="mb-6 flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-lg shadow-orange-500/5">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4">
              <FaSearch className="text-gray-400" />
              <input
                type="search"
                value={filters.q}
                onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                placeholder="Cari menu atau deskripsi..."
                className="w-full border-0 bg-transparent py-3 text-sm outline-none"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-40 items-center justify-center text-gray-500">
              Memuat menu terbaik untukmu...
            </div>
          ) : menus.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white/60 p-10 text-center text-gray-500">
              Tidak ada menu yang cocok dengan pencarianmu. Coba ubah kata kunci
              atau kategori lain.
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2">
                {menus.map((menu) => (
                  <article
                    key={menu.id}
                    className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                          {menu.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stok: {menu.stock}
                        </span>
                      </div>
                      <h2 className="mt-3 text-xl font-semibold text-gray-900">
                        {menu.name}
                      </h2>
                      <p className="mt-2 flex-1 text-sm text-gray-500">
                        {menu.description ?? "Menu favorit pelanggan kami."}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(menu.price)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(menu.id)}
                          disabled={menu.stock < 1 || cartLoading}
                          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaCartPlus />
                          Tambah
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {pagination?.links?.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  {pagination.links.map((link) => {
                    const label = link.label
                      .replace("&laquo;", "«")
                      .replace("&raquo;", "»");

                    return (
                      <button
                        key={link.label}
                        type="button"
                        disabled={!link.url}
                        onClick={() => goToPage(link.url)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          link.active
                            ? "bg-gray-900 text-white"
                            : "border border-gray-200 text-gray-600 hover:border-gray-300"
                        } ${!link.url ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <aside className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-2xl shadow-orange-500/10">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Keranjang
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {user ? `Pesanan ${user.name}` : "Masuk untuk belanja"}
            </h2>
            <p className="text-sm text-gray-500">
              {user
                ? "Kelola pesanan kamu sebelum checkout."
                : "Login untuk menambahkan menu ke keranjang."}
            </p>
          </div>

          {message && (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {cartError && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {cartError}
            </div>
          )}

          {user ? (
            cartLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                Memuat keranjang...
              </div>
            ) : !cart?.items?.length ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-gray-500">
                Keranjang masih kosong. Tambahkan menu favoritmu sekarang!
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.menu?.name ?? "Menu"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)} x {item.quantity}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-sm font-semibold text-red-500"
                        >
                          Hapus
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(item.id, item.quantity - 1)
                            }
                            className="px-2 text-lg text-gray-600"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateItem(item.id, item.quantity + 1)
                            }
                            className="px-2 text-lg text-gray-600"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-gray-900 px-6 py-5 text-white">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total item</span>
                    <span>{cartItemsCount ?? 0}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-4 rounded-full bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:-translate-y-0.5"
                >
                  Lanjutkan Pembayaran
                </button>
                <Link
                  to="/orders"
                  className="text-center text-sm font-semibold text-gray-500 hover:text-gray-800"
                >
                  Lihat riwayat pesanan →
                </Link>
              </>
            )
          ) : (
            <Link
              to="/signin"
              className="rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:-translate-y-0.5"
            >
              Masuk untuk mulai belanja
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}

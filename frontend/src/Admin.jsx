import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import SidebarAdmin from "./Components/SidebarAdmin";
import { AuthContext } from "./context/AuthContextValue";
import axios from "./lib/axios";

const initialForm = {
  name: "",
  description: "",
  category: "makanan",
  price: "",
  stock: "",
  image_url: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(null);
  const [menus, setMenus] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderPagination, setOrderPagination] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    menus: true,
    metrics: true,
    orders: true,
    submitting: false,
  });

  const fetchMenus = async () => {
    setLoading((prev) => ({ ...prev, menus: true }));
    setError("");
    try {
      const { data } = await axios.get("/menus", { params: { per_page: 50 } });
      setMenus(data.data.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal memuat data menu.");
    } finally {
      setLoading((prev) => ({ ...prev, menus: false }));
    }
  };

  const fetchMetrics = async () => {
    setLoading((prev) => ({ ...prev, metrics: true }));
    try {
      const { data } = await axios.get("/admin/metrics");
      setMetrics(data.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal memuat ringkasan dashboard.");
    } finally {
      setLoading((prev) => ({ ...prev, metrics: false }));
    }
  };

  const fetchOrders = async (page = 1) => {
    setLoading((prev) => ({ ...prev, orders: true }));
    try {
      const { data } = await axios.get("/admin/orders", { params: { page } });
      setOrders(data.data.data);
      setOrderPagination(data.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal memuat data pesanan.");
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchMetrics();
    fetchOrders();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setError("");
    setLoading((prev) => ({ ...prev, submitting: true }));

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (isEditing) {
        await axios.put(`/menus/${isEditing}`, payload);
        setStatusMessage("Menu berhasil diperbarui.");
      } else {
        await axios.post("/menus", payload);
        setStatusMessage("Menu baru berhasil ditambahkan.");
      }

      setForm(initialForm);
      setIsEditing(null);
      fetchMenus();
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "Terjadi kesalahan saat menyimpan data menu."
      );
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleEdit = (menu) => {
    setForm({
      name: menu.name,
      description: menu.description ?? "",
      category: menu.category,
      price: menu.price,
      stock: menu.stock,
      image_url: menu.image_url ?? "",
    });
    setIsEditing(menu.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus menu ini?")) return;
    setError("");
    try {
      await axios.delete(`/menus/${id}`);
      setStatusMessage("Menu berhasil dihapus.");
      fetchMenus();
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal menghapus menu.");
    }
  };

  const goToOrdersPage = (url) => {
    if (!url) return;
    const params = new URL(url, window.location.origin).searchParams;
    const page = Number(params.get("page") ?? 1);
    fetchOrders(page);
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <SidebarAdmin />
      <main className="ml-64 min-h-screen bg-gray-50 px-10 py-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-orange-500">
              Admin Dashboard
            </p>
            <h1 className="text-4xl font-bold text-gray-900">
              Halo, {user?.name ?? "Admin"} 👋
            </h1>
            <p className="mt-2 text-gray-500">
              Kelola menu, pantau pesanan, dan lihat performa toko kamu di sini.
            </p>
          </div>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5"
          >
            Lihat Storefront
          </Link>
        </header>

        {statusMessage && (
          <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Ringkasan</h2>
          {loading.metrics ? (
            <div className="rounded-3xl bg-white p-6 text-gray-500 shadow">
              Mengambil data...
            </div>
          ) : metrics ? (
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-3xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Total Pesanan</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.totals.total_orders}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-amber-500">
                  {metrics.totals.pending_orders}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Lunas</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {metrics.totals.paid_orders}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">Pendapatan</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(metrics.totals.revenue)}
                </p>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mb-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl bg-white p-8 shadow">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Menu" : "Tambah Menu Baru"}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setForm(initialForm);
                  }}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-800"
                >
                  Batalkan
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Nama</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Kategori</label>
                <select
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-2"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Harga</label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-2"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Stok</label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-2"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  URL Gambar
                </label>
                <input
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-2"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Deskripsi
                </label>
                <textarea
                  className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-2"
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading.submitting}
              >
                <FaPlus />
                {isEditing ? "Perbarui Menu" : "Tambah Menu"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Menu Terlaris</h3>
            <ul className="space-y-3">
              {metrics?.topMenus?.length ? (
                metrics.topMenus.map((item) => (
                  <li
                    key={item.menu_id}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3"
                  >
                    <span className="font-medium text-gray-800">
                      {item.menu?.name ?? "Menu"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.total_quantity} terjual
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada data.</p>
              )}
            </ul>
          </div>
        </section>

        <section className="mb-12 rounded-3xl bg-white p-8 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Daftar Menu</h2>
            <span className="text-sm text-gray-500">{menus.length} menu</span>
          </div>
          {loading.menus ? (
            <div className="text-gray-500">Memuat data menu...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3">Stok</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr
                      key={menu.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {menu.name}
                      </td>
                      <td className="px-4 py-3">{menu.category}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(menu.price)}
                      </td>
                      <td className="px-4 py-3">{menu.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleEdit(menu)}
                          className="mr-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-500"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(menu.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-500"
                        >
                          <FaTrash /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Pesanan Terbaru
          </h2>
          {loading.orders ? (
            <div className="text-gray-500">Memuat data pesanan...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead>
                    <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                      <th className="px-4 py-3">Kode</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {order.order_code}
                        </td>
                        <td className="px-4 py-3">{order.user?.name}</td>
                        <td className="px-4 py-3 capitalize">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.status === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(order.created_at).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orderPagination?.links?.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {orderPagination.links.map((link) => (
                    <button
                      key={link.label}
                      type="button"
                      disabled={!link.url}
                      onClick={() => goToOrdersPage(link.url)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        link.active
                          ? "bg-gray-900 text-white"
                          : "border border-gray-200 text-gray-600 hover:border-gray-300"
                      } ${!link.url ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </section>
  );
};

export default Admin;

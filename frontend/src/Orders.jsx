import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import axios from "./lib/axios";
import { AuthContext } from "./context/AuthContextValue";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/orders", { params: { page } });
      const payload = data.data;
      setOrders(payload.data);
      setPagination(payload);
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Gagal mengambil data pesanan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
    [orders]
  );

  const goToPage = (url) => {
    if (!url) return;
    const params = new URL(url, window.location.origin).searchParams;
    const page = Number(params.get("page") ?? 1);
    fetchOrders(page);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white px-6 py-8 shadow-xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">
              Order History
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Hai, {user?.name ?? "Customer"} 👋
            </h1>
            <p className="text-gray-500">
              Pantau status pesanan dan riwayat transaksi kamu di sini.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 text-right">
            <p className="text-sm text-gray-500">Total yang sudah dibelanjakan</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/store"
            className="inline-flex items-center rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Belanja Lagi
          </Link>
          <span className="text-sm text-gray-500">
            {orders.length} pesanan ditemukan
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-48 items-center justify-center text-lg font-medium text-gray-500">
            Mengambil data pesanan...
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 px-8 py-16 text-center text-gray-500">
            <p className="text-lg font-semibold text-gray-700">
              Kamu belum memiliki pesanan 💡
            </p>
            <p className="mt-2 text-sm">
              Coba jelajahi menu kami dan buat pesanan pertama kamu.
            </p>
            <Link
              to="/store"
              className="mt-6 rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-gray-400">
                      Kode Pesanan
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {order.order_code}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString("id-ID", {
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold capitalize ${
                        order.status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "failed" ||
                            order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="mt-2 text-sm text-gray-500">
                      Metode: {order.payment_type ?? "Midtrans"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {order.items?.map((item) => (
                    <li
                      key={`${order.id}-${item.id}`}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.menu?.name ?? "Menu"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.quantity * item.price)}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}

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
      </div>
    </section>
  );
};

export default Orders;

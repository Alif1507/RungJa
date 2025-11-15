import React, { useState } from "react";

export default function SignInCard({ onSubmit, loading = false, error = "" }) {
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <div className="flex min-h-[450px] items-center justify-center p-4">
      <div className="w-full rounded-3xl border border-black/10 bg-white p-6 shadow-[0_10px_50px_rgba(0,0,0,0.08)] sm:p-8">
        <h1 className="mb-2 text-center text-3xl font-extrabold tracking-tight">
          Masuk ke Akun
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-500">
          Gunakan email dan password yang sudah terdaftar.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="kamu@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Field>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#2F3E4B] px-5 py-3 text-base font-extrabold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sedang memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ children }) {
  return <div className="space-y-2">{children}</div>;
}

function Label(props) {
  return <label {...props} className="block text-sm text-neutral-600" />;
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border-b border-neutral-300 bg-transparent px-0 py-2 outline-none focus:border-neutral-600 focus:ring-0"
    />
  );
}

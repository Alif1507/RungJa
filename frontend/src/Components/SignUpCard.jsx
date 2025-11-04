import React, { useState } from "react";

export default function SignUpCard({ onSubmit }) {
  const [form, setForm] = useState({ email: "", username: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    onSubmit?.(form);
  }

  return (
    <div className="min-h-dvh  flex items-center justify-center p-4">
      <div className="w-full max-w-[28rem] rounded-3xl border border-black/20 bg-white shadow-[0_0_0_6px_rgba(0,0,0,0.05)] p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder=""
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </Field>

          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
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

          <Field>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </Field>

          <p className="text-sm text-neutral-500">Sudah Punya Akun?</p>

          {error && (
            <div className="text-sm text-red-600 -mt-3">{error}</div>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#2F3E4B] px-5 py-3 text-base sm:text-lg font-extrabold text-white tracking-wide disabled:opacity-60"
          >
            Sign Up
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
      className="w-full bg-transparent outline-none border-0 border-b border-neutral-300 focus:border-neutral-600 focus:ring-0 px-0 py-2"
    />
  );
}

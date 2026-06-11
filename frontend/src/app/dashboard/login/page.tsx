"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cf-purple-lighter px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-cf-gray-light bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <h1 className="mb-1 text-center text-lg font-bold text-foreground">หน้าผู้ดูแลระบบ</h1>
        <p className="mb-6 text-center text-sm text-cf-gray">CF BOT Feedback</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-foreground">
              ชื่อผู้ใช้งาน
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-cf-gray-light bg-white px-4 py-3 text-base text-foreground focus:border-cf-purple focus:outline-none focus:ring-2 focus:ring-cf-purple"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-cf-gray-light bg-white px-4 py-3 text-base text-foreground focus:border-cf-purple focus:outline-none focus:ring-2 focus:ring-cf-purple"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-cf-purple px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cf-purple-dark disabled:opacity-60"
          >
            {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}

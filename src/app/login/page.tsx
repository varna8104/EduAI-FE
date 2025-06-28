"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import apiUtils from "@/utils/api";

export default function LoginPage() {
  const [parentMobile, setParentMobile] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!parentMobile || !password) {
      setFormError("Both fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await apiUtils.login({
        parent_mobile: parentMobile,
        password,
      });
      
      if (data.success) {
        setSubmitting(false);
        // Save children and parentName to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('children', JSON.stringify(data.children));
          localStorage.setItem('parentName', data.parent_name);
        }
        router.push("/profiles");
      } else {
        setSubmitting(false);
        setFormError(data.error || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setSubmitting(false);
      const errorMessage = apiUtils.handleApiError(err);
      setFormError(errorMessage);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Lexend:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900" />
      </Head>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6edf4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0c151d]">
            <div className="size-6">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[#0c151d] text-lg font-bold leading-tight tracking-[-0.015em]">EduAI</span>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#0c151d] text-sm font-medium leading-normal" href="/">Home</a>
              <a className="text-[#0c151d] text-sm font-medium leading-normal" href="#about">About</a>
              <a className="text-[#0c151d] text-sm font-medium leading-normal" href="#courses">Courses</a>
              <a className="text-[#0c151d] text-sm font-medium leading-normal" href="#contact">Contact</a>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e6edf4] text-[#0c151d] text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Register</span>
            </button>
          </div>
        </header>
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] w-full bg-slate-50">
          <div className="bg-white rounded-2xl shadow-md w-full max-w-[512px] p-0 flex flex-col">
            <main className="flex flex-1 items-center justify-center min-h-0">
              <div className="layout-content-container flex flex-col w-full max-w-[512px] py-5 max-w-[960px] flex-1">
                <h2 className="text-[#0c151d] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Log In to Your Account</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full px-4 pb-8 pt-2">
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="tel" placeholder="Parent's Mobile Number" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={parentMobile} onChange={e => setParentMobile(e.target.value)} maxLength={10} required />
                    </label>
                  </div>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="password" placeholder="Password" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={password} onChange={e => setPassword(e.target.value)} required />
                    </label>
                  </div>
                  {formError && <div className="text-xs text-red-600 mt-1 text-center">{formError}</div>}
                  <div className="flex px-0 py-3">
                    <button
                      type="submit"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#359dff] text-[#0c151d] text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                      disabled={submitting || !parentMobile || !password}
                    >
                      {submitting ? "Logging in..." : "Log In"}
                    </button>
                  </div>
                  <p className="text-[#4574a1] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">Don't have an account? <a href="/register" className="underline">Register</a></p>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
} 
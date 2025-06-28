"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import apiUtils from "@/utils/api";

export default function RegisterPage() {
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [childAge, setChildAge] = useState<number | null>(null);
  const [childGroup, setChildGroup] = useState<string>("");
  const [parentName, setParentName] = useState("");
  const [parentDob, setParentDob] = useState("");
  const [parentAge, setParentAge] = useState<number | null>(null);
  const [parentMobile, setParentMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [childGender, setChildGender] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (childDob) {
      const age = getAge(childDob);
      setChildAge(age);
      if (age >= 2 && age <= 4) setChildGroup("2-4");
      else if (age >= 5 && age <= 7) setChildGroup("5-7");
      else if (age >= 8 && age <= 12) setChildGroup("8-12");
      else setChildGroup("");
    } else {
      setChildAge(null);
      setChildGroup("");
    }
  }, [childDob]);
  useEffect(() => {
    if (parentDob) setParentAge(getAge(parentDob));
    else setParentAge(null);
  }, [parentDob]);
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);
  useEffect(() => {
    // Check if logged in by looking for children in localStorage
    const childrenData = typeof window !== 'undefined' ? localStorage.getItem("children") : null;
    if (childrenData) {
      setIsLoggedIn(true);
      const children = JSON.parse(childrenData);
      if (children.length > 0) {
        setProfileName(children[0].name);
        setProfileAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=child${children[0].id}`);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!childName || !childGender || !childDob || !parentName || !parentDob || !parentMobile || !password || !confirmPassword) {
      setFormError("All fields are required.");
      return;
    }
    if (parentAge !== null && parentAge < 18) {
      setFormError("Parent must be at least 18 years old.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await apiUtils.register({
        child_name: childName,
        child_dob: childDob,
        child_group: childGroup,
        parent_name: parentName,
        parent_dob: parentDob,
        parent_mobile: parentMobile,
        password,
      });
      
      if (data.success) {
        setSubmitting(false);
        // Save children and parentName to localStorage (simulate one child just registered)
        if (typeof window !== 'undefined') {
          localStorage.setItem('children', JSON.stringify([{ id: 1, name: childName, gender: childGender }]));
          localStorage.setItem('parentName', parentName);
        }
        router.push("/profiles");
      } else {
        setSubmitting(false);
        setFormError(data.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setSubmitting(false);
      const errorMessage = apiUtils.handleApiError(err);
      if (errorMessage.toLowerCase().includes('already')) {
        setFormError('Account already exists. Please log in.');
      } else {
        setFormError(errorMessage);
      }
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
          <div className="flex flex-1 justify-end gap-4">
            <Link className="text-[#0c151d] text-sm font-medium leading-normal" href="/">Home</Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/profiles')}>
                <img src={profileAvatar} alt="profile" className="w-10 h-10 rounded-full border-2 border-[#3d98f4]" />
                <span className="text-[#0c151d] text-sm font-bold leading-normal">{profileName}</span>
              </div>
            ) : (
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e6edf4] text-[#0c151d] text-sm font-bold leading-normal tracking-[0.015em]" onClick={() => router.push('/login')}>
                <span className="truncate">Log In</span>
              </button>
            )}
          </div>
        </header>
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] w-full bg-slate-50">
          <div className="bg-white rounded-2xl shadow-md w-full max-w-[512px] p-0 flex flex-col">
            <main className="flex flex-1 items-center justify-center min-h-0">
              <div className="layout-content-container flex flex-col w-full max-w-[512px] py-5 max-w-[960px] flex-1">
                <h2 className="text-[#0c151d] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create Your Account</h2>
                <p className="text-red-600 text-center mb-2 text-sm font-semibold">Registration must be strictly done by parents.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full px-4 pb-8 pt-2">
                  {/* Child's Name */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="text" placeholder="Child's Name" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={childName} onChange={e => setChildName(e.target.value)} required />
                    </label>
                  </div>
                  {/* Child's Gender */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <select className="form-select flex w-full min-w-0 flex-1 rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] h-14 p-4 text-base font-normal leading-normal" value={childGender} onChange={e => setChildGender(e.target.value)} required>
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                  </div>
                  {/* Child's DOB */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="date" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={childDob} onChange={e => setChildDob(e.target.value)} required />
                      {childAge !== null && <div className="text-xs mt-1">Age: {childAge} {childGroup ? `(Group: ${childGroup})` : <span className="text-red-600">(Not eligible)</span>}</div>}
                    </label>
                  </div>
                  {/* Parent's Name */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="text" placeholder="Parent's Name" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={parentName} onChange={e => setParentName(e.target.value)} required />
                    </label>
                  </div>
                  {/* Parent's DOB */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="date" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={parentDob} onChange={e => setParentDob(e.target.value)} required />
                      {parentAge !== null && <div className="text-xs mt-1">Parent Age: {parentAge} {parentAge < 18 && <span className="text-red-600">(Must be 18+)</span>}</div>}
                    </label>
                  </div>
                  {/* Parent's Mobile Number */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="tel" placeholder="Parent's Mobile Number" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={parentMobile} onChange={e => setParentMobile(e.target.value)} maxLength={10} required />
                    </label>
                  </div>
                  {/* Passwords */}
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="password" placeholder="Password" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={password} onChange={e => setPassword(e.target.value)} required />
                    </label>
                  </div>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-1">
                    <label className="flex flex-col min-w-40 flex-1">
                      <input type="password" placeholder="Confirm Password" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0c151d] focus:outline-0 focus:ring-0 border-none bg-[#e6edf4] focus:border-none h-14 placeholder:text-[#4574a1] p-4 text-base font-normal leading-normal" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                {passwordError && <div className="text-xs text-red-600 mt-1">{passwordError}</div>}
                    </label>
                  </div>
                  {formError && <div className="text-xs text-red-600 mt-1 text-center">{formError}
                    {formError.includes('already exists') && (
                      <button className="ml-2 underline text-blue-600" type="button" onClick={() => router.push('/login')}>Log In</button>
          )}
                  </div>}
                  <div className="flex px-0 py-3">
          <button
            type="submit"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#359dff] text-[#0c151d] text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
            disabled={
              submitting ||
              !childName ||
                        !childGender ||
              !childDob ||
              !parentName ||
              !parentDob ||
              !parentMobile ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              (parentAge !== null && parentAge < 18)
            }
          >
                      {submitting ? "Registering..." : "Register"}
          </button>
                  </div>
                  <p className="text-[#4574a1] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">Already have an account? <Link href="/login" className="underline">Log In</Link></p>
        </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
} 
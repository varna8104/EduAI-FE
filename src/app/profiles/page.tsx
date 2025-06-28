"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { FaTrash, FaEdit } from 'react-icons/fa';

// Example cartoon avatars (replace with your own or use DiceBear)
const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDH1xyQ-x2OlKoEHAN3f3B5imvH2omld5GkRqWCPrybG0i4wji6jn14GdMP6x9rr1wiWVwd7nlpFjSjLE_hmCtt4ipsED-ZjOUV6atY0REn8eT8qtUL9dCSCI3QwjvRG6HJXbFHlixD8XVQJ6QYqKvNVyQZHC6g_bVorStFX1ocURcMbJx2zt_sNWJIBT4BiddPKveAjupLxnJmyOrYyVZxx66Vi7vqLpWCFUTTbtzrokXanw-YeUNx7mbqIo2R58nlG7Se8EfPZc9_",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBWx_KT3apOOJzNmEWRdMkzEI7ZB8YkziJS3Z0Bgvt2yoNeMKSI4MFmytKoEH33mjDblVxftSfIFgCpGk5XgAOwkHSnh8hOzF-gx098YAQfUuaIi8stwHGAffF3Jn9KeegFzB-3iQP46NlB0CeFIwiOY7_oof05AIzMNP-kofVQ5wxpP8FZrX38fu13x6VmvKNJIGqnE4OzeAQsE4hAsiK0WF68oY-ERcUE2FKQmx6LceVaUkuYGcSgkRioRvSD3Q3weu23Wk20X8i0",
];
const parentAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAkVCHKAlGa4VYxvj6tyBS5uOtqLDuH3SDrJellodUz5ifeezTq8lwpBohZ1W_oNYUiqMRgywf0SR67vIQrOlq3w_Lw7Y843xFY5WUP5fgexhKxFfiD5QOy9vuxJN6-40b2db20iq25WMAaXD_Wa_wO-YANk8n_i_MYR3a6sF8GiEA2u1avacmt5rTCRJjysCs080dsWiTjVbO4RE2cZ024lgk33MhVzoTLw8a_ddOcnba2kO9kImZeMC_XIFT07AzbzXXSw1VP8geR";

export default function ProfilesPage() {
  const [children, setChildren] = useState<{id: number, name: string, gender: string}[]>([]);
  const [parentName, setParentName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Get children and parent name from localStorage (set after login)
    const childrenData = localStorage.getItem("children");
    const parent = localStorage.getItem("parentName");
    if (childrenData) setChildren(JSON.parse(childrenData));
    if (parent) setParentName(parent);
  }, []);

  // Add click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDelete = (id: number) => {
    const updated = children.filter(child => child.id !== id);
    setChildren(updated);
    localStorage.setItem('children', JSON.stringify(updated));
  };

  const handleEdit = (id: number) => {
    const child = children.find(c => c.id === id);
    if (!child) return;
    const name = prompt('Edit name:', child.name);
    const gender = prompt('Edit gender (male/female):', child.gender);
    if (name && gender) {
      const updated = children.map(c => c.id === id ? { ...c, name, gender } : c);
      setChildren(updated);
      localStorage.setItem('children', JSON.stringify(updated));
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Lexend:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900" />
      </Head>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e9edf1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101519]">
            <div className="size-6">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[#101519] text-lg font-bold leading-tight tracking-[-0.015em]">EduAI</span>
            <a className="text-[#101519] text-sm font-medium leading-normal cursor-pointer ml-6" onClick={() => router.push('/')}>Home</a>
          </div>
          <div className="flex flex-1 justify-end gap-4">
            <div ref={avatarRef} className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDropdown(v => !v)}>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#3d98f4]" style={{ backgroundImage: `url('${parentAvatar}')` }}></div>
                <span className="text-[#101519] text-sm font-bold leading-normal">{parentName}</span>
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button className="block w-full text-left px-4 py-2 text-[#e53e3e] hover:bg-gray-100" onClick={() => {
                    localStorage.clear();
                    window.location.href = '/';
                  }}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-[#101519] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Who's learning?</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {children.map((child, idx) => {
                let avatarUrl = avatars[idx % avatars.length];
                if (child.gender === 'female') {
                  avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWx_KT3apOOJzNmEWRdMkzEI7ZB8YkziJS3Z0Bgvt2yoNeMKSI4MFmytKoEH33mjDblVxftSfIFgCpGk5XgAOwkHSnh8hOzF-gx098YAQfUuaIi8stwHGAffF3Jn9KeegFzB-3iQP46NlB0CeFIwiOY7_oof05AIzMNP-kofVQ5wxpP8FZrX38fu13x6VmvKNJIGqnE4OzeAQsE4hAsiK0WF68oY-ERcUE2FKQmx6LceVaUkuYGcSgkRioRvSD3Q3weu23Wk20X8i0';
                } else if (child.gender === 'male') {
                  avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH1xyQ-x2OlKoEHAN3f3B5imvH2omld5GkRqWCPrybG0i4wji6jn14GdMP6x9rr1wiWVwd7nlpFjSjLE_hmCtt4ipsED-ZjOUV6atY0REn8eT8qtUL9dCSCI3QwjvRG6HJXbFHlixD8XVQJ6QYqKvNVyQZHC6g_bVorStFX1ocURcMbJx2zt_sNWJIBT4BiddPKveAjupLxnJmyOrYyVZxx66Vi7vqLpWCFUTTbtzrokXanw-YeUNx7mbqIo2R58nlG7Se8EfPZc9_';
                }
                return (
                  <div key={child.id} className="flex flex-col gap-3 text-center pb-3 group cursor-pointer relative" onClick={e => {
                    // Prevent navigation if edit/delete is clicked
                    if ((e.target as HTMLElement).closest('button')) return;
                    router.push(`/hobbies/${child.id}`);
                  }}>
                    <div className="absolute top-2 right-6 flex gap-2 z-10">
                      <button onClick={e => {e.stopPropagation(); handleEdit(child.id);}} className="text-blue-500 hover:text-blue-700"><FaEdit size={16} /></button>
                      <button onClick={e => {e.stopPropagation(); handleDelete(child.id);}} className="text-red-500 hover:text-red-700"><FaTrash size={16} /></button>
                    </div>
                    <div className="px-4">
                      <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full transition-all duration-300 group-hover:ring-4 group-hover:ring-[#3d98f4]" style={{ backgroundImage: `url('${avatarUrl}')` }}></div>
                    </div>
                    <p className="text-[#101519] text-base font-medium leading-normal">{child.name}</p>
                  </div>
                );
              })}
              {/* Add Profile Card */}
              <div className="flex flex-col gap-3 text-center pb-3 cursor-pointer" onClick={() => router.push('/register')}>
                <div className="px-4">
                  <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgPTLAP8BOjLHt3fHXFFJKDZsA81tjluhtYuFc5YmEyQWfcYDBwy7HoFOBayx35epZ4N_gagT-x34XXMTZOJK1tnO6p_oLOlDiSvyBJWDrlO3k6cEeAgOXj4IgJZ3XNdpt20xJH9PqZk_uM-5UZrq2-PSCoxIK2TEICjC7NocQShXsV6nxi6O5A6V2LioICKKr90T8iT9NKnd-7mWbO3QPIfG55YhQbTwxIzRwy-k6W0o9NlgZBvuA2UEg1vYBB56RhavbgONwUFST')` }}></div>
                </div>
                <p className="text-[#101519] text-base font-medium leading-normal">Add Profile</p>
              </div>
            </div>
            <p className="text-[#57748e] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline cursor-pointer">Manage Profiles</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
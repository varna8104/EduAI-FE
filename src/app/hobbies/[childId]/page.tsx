"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const hobbies = [
  { title: "Drawing", description: "Unleash your imagination with colors and sketches", icon: "🖍️" },
  { title: "Coding Games", description: "Build your own games and bring ideas to life", icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 256 256'><path d='M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z'/></svg>" },
  { title: "Reading", description: "Travel to new worlds through captivating stories", icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 256 256'><path d='M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z'/></svg>" },
  { title: "Musical Instruments", description: "Play melodies and discover the magic of music", icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 256 256'><path d='M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM88,216a32,32,0,1,1,32-32A32,32,0,0,1,88,216ZM200,101.25l-64-19.2V50.75L200,70Z'/></svg>" },
  { title: "Sports", description: "Get active, play fair, and have a blast outdoors", icon: "⚽" },
  { title: "Video Games", description: "Challenge your mind with fun digital adventures", icon: "🎮" },
  { title: "Writing", description: "Express your thoughts through creative writing", icon: "✍️" },
  { title: "Science Experiments", description: "Discover the wonders of science with hands-on fun", icon: "🧪" },
  { title: "Photo/Videography", description: "Capture memories and tell stories with your camera", icon: "📷" },
  { title: "Video Editing", description: "Transform raw clips into awesome movies", icon: "🎬" },
];

export default function HobbiesPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId;
  const [child, setChild] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [parentName, setParentName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const parentAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAkVCHKAlGa4VYxvj6tyBS5uOtqLDuH3SDrJellodUz5ifeezTq8lwpBohZ1W_oNYUiqMRgywf0SR67vIQrOlq3w_Lw7Y843xFY5WUP5fgexhKxFfiD5QOy9vuxJN6-40b2db20iq25WMAaXD_Wa_wO-YANk8n_i_MYR3a6sF8GiEA2u1avacmt5rTCRJjysCs080dsWiTjVbO4RE2cZ024lgk33MhVzoTLw8a_ddOcnba2kO9kImZeMC_XIFT07AzbzXXSw1VP8geR";

  useEffect(() => {
    const children = JSON.parse(localStorage.getItem("children") || "[]");
    const found = children.find((c: any) => String(c.id) === String(childId));
    setChild(found);
    const parent = localStorage.getItem("parentName");
    if (parent) setParentName(parent);
  }, [childId]);

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

  if (!child) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101518]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em]">EduAI</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/">Home</a>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={parentAvatar} alt="profile" className="w-10 h-10 rounded-full border-2 border-[#3d98f4]" />
              <span className="text-[#101518] text-sm font-bold leading-normal">{parentName}</span>
            </div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-[#0f151a] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">What are your interests?</h2>
            <p className="text-[#0f151a] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">Select your child's hobbies to help us tailor their learning experience.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {hobbies.map((hobby: { title: string; description: string; icon: string }, idx: number) => (
                <div
                  key={idx}
                  className={`flex flex-1 flex-col items-center gap-3 rounded-lg border border-[#d2dce4] bg-gray-50 p-4 cursor-pointer transition-all duration-200 ${selected.includes(hobby.title) ? 'ring-2 ring-[#3182cd] bg-white' : ''}`}
                  onClick={() => {
                    setSelected(sel =>
                      sel.includes(hobby.title)
                        ? sel.filter(h => h !== hobby.title)
                        : [...sel, hobby.title]
                    );
                  }}
                >
                  <div className="text-[#0f151a] mb-2 flex justify-center w-full" dangerouslySetInnerHTML={{ __html: hobby.icon }} />
                  <div className="flex flex-col gap-1 items-center text-center">
                    <h2 className="text-[#0f151a] text-base font-bold leading-tight">{hobby.title}</h2>
                    <p className="text-[#56748f] text-sm font-normal leading-normal">{hobby.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex px-4 py-3 justify-center">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3182cd] text-gray-50 text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={() => {
                  // Save selected hobbies to localStorage for this child
                  const children = JSON.parse(localStorage.getItem("children") || "[]");
                  const updated = children.map((c: any) => c.id === child.id ? { ...c, hobbies: selected } : c);
                  localStorage.setItem("children", JSON.stringify(updated));
                  router.push(`/hobbies/${child.id}/mode`);
                }}
              >
                <span className="truncate">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
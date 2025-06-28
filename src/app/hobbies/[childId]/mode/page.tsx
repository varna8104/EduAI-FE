"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ModePage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId;
  const [child, setChild] = useState<any>(null);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("");

  useEffect(() => {
    const children = JSON.parse(localStorage.getItem("children") || "[]");
    const found = children.find((c: any) => String(c.id) === String(childId));
    setChild(found);
    setSelectedHobbies(found?.hobbies || []);
  }, [childId]);

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
              <a className="text-[#101518] text-sm font-medium leading-normal" href="#">Home</a>
            </div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-[#101518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Choose Your Learning Path</h2>
            <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Select the mode that best fits your current learning goals. Each mode offers a tailored experience to help you achieve your objectives.
            </p>
            <div className="flex flex-row gap-6 justify-center mb-6">
              <div
                className={`flex flex-1 min-w-[200px] max-w-[260px] cursor-pointer items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-4 rounded-xl border transition-all duration-200 ${selectedMode === 'academics' ? 'border-[#699dcd] ring-2 ring-[#699dcd] bg-white' : 'border-transparent'}`}
                onClick={() => router.push(`/hobbies/${childId}/academics`)}
              >
                <div className="text-[#101518] flex items-center justify-center rounded-lg bg-[#eaedf1] shrink-0 size-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#101518]">Academics</span>
                  <span className="text-xs text-[#56748f]">Subjects & AI Tutoring</span>
                </div>
              </div>
              <div
                className={`flex flex-1 min-w-[200px] max-w-[260px] cursor-pointer items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-4 rounded-xl border transition-all duration-200 ${selectedMode === 'hobbies' ? 'border-[#699dcd] ring-2 ring-[#699dcd] bg-white' : 'border-transparent'}`}
                onClick={() => router.push(`/hobbies/${childId}/hobby-zone`)}
              >
                <div className="text-[#101518] flex items-center justify-center rounded-lg bg-[#eaedf1] shrink-0 size-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#101518]">Hobby Mode</span>
                  <span className="text-xs text-[#56748f]">Fun & Creative Activities</span>
                </div>
              </div>
              <div
                className={`flex flex-1 min-w-[200px] max-w-[260px] cursor-pointer items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-4 rounded-xl border transition-all duration-200 ${selectedMode === 'story' ? 'border-[#699dcd] ring-2 ring-[#699dcd] bg-white' : 'border-transparent'}`}
                onClick={() => router.push(`/hobbies/${childId}/story-mode`)}
              >
                <div className="text-[#101518] flex items-center justify-center rounded-lg bg-[#eaedf1] shrink-0 size-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#101518]">Story Mode</span>
                  <span className="text-xs text-[#56748f]">Stories & Fairytales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
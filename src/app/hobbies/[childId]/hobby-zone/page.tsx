"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { apiUtils, API_ENDPOINTS } from '@/utils/api';

const hobbies = [
  { title: "Drawing", description: "Unleash your imagination with colors and sketches", icon: "🖍️" },
  { title: "Coding Games", description: "Build your own games and bring ideas to life", icon: "💻" },
  { title: "Reading", description: "Travel to new worlds through captivating stories", icon: "📖" },
  { title: "Musical Instruments", description: "Play melodies and discover the magic of music", icon: "🎸" },
  { title: "Sports", description: "Get active, play fair, and have a blast outdoors", icon: "⚽" },
  { title: "Video Games", description: "Challenge your mind with fun digital adventures", icon: "🎮" },
  { title: "Writing", description: "Express your thoughts through creative writing", icon: "✍️" },
  { title: "Science Experiments", description: "Discover the wonders of science with hands-on fun", icon: "🧪" },
  { title: "Photo/Videography", description: "Capture memories and tell stories with your camera", icon: "📷" },
  { title: "Video Editing", description: "Transform raw clips into awesome movies", icon: "🎬" },
];

const YT_API_KEY = "AIzaSyCOM4hcoVvd4I5DVDY6JrOg6z5hWMh8QDc";

function getHobbyMeta(title: any) {
  return hobbies.find((h: any) => h.title === title) || { title, description: "", icon: "🎲" };
}

function getYoutubeQuery(hobby: any) {
  return encodeURIComponent(hobby + " for kids");
}

export default function HobbyZonePage() {
  const params = useParams();
  const childId = params.childId;
  const [child, setChild] = useState<any>(null);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [activeHobby, setActiveHobby] = useState<string>("");

  // All chat state, input, loading, videos, refs by hobby
  const [messagesByHobby, setMessagesByHobby] = useState<{[hobby: string]: {role: string, content: string, fileName?: string, fileType?: string}[]}>({});
  const [inputByHobby, setInputByHobby] = useState<{[hobby: string]: string}>({});
  const [loadingByHobby, setLoadingByHobby] = useState<{[hobby: string]: boolean}>({});
  const [videosByHobby, setVideosByHobby] = useState<{[hobby: string]: any[]}>({});
  const [filesByHobby, setFilesByHobby] = useState<{[hobby: string]: File | null}>({});
  const [filePreviewsByHobby, setFilePreviewsByHobby] = useState<{[hobby: string]: string | null}>({});
  const chatEndRefsByHobby = useRef<{[hobby: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    const children = JSON.parse(localStorage.getItem("children") || "[]");
    const found = children.find((c: any) => String(c.id) === String(childId));
    setChild(found);
    setSelectedHobbies(found?.hobbies || []);
    // Set the first hobby as active by default
    if (found?.hobbies && found.hobbies.length > 0) setActiveHobby(found.hobbies[0]);
  }, [childId]);

  // Initialize chat state for each hobby
  useEffect(() => {
    if (!selectedHobbies.length) return;
    const newMessages: {[hobby: string]: {role: string, content: string, fileName?: string, fileType?: string}[]} = {};
    const newInputs: {[hobby: string]: string} = {};
    const newLoading: {[hobby: string]: boolean} = {};
    const newVideos: {[hobby: string]: any[]} = {};
    const newFiles: {[hobby: string]: File | null} = {};
    const newFilePreviews: {[hobby: string]: string | null} = {};
    selectedHobbies.forEach(hobby => {
      // Load chat history
      const key = `hobby_chat_${childId}_${hobby}`;
      const saved = localStorage.getItem(key);
      newMessages[hobby] = saved ? JSON.parse(saved) : [];
      newInputs[hobby] = "";
      newLoading[hobby] = false;
      newVideos[hobby] = [];
      newFiles[hobby] = null;
      newFilePreviews[hobby] = null;
    });
    setMessagesByHobby(newMessages);
    setInputByHobby(newInputs);
    setLoadingByHobby(newLoading);
    setVideosByHobby(newVideos);
    setFilesByHobby(newFiles);
    setFilePreviewsByHobby(newFilePreviews);
  }, [selectedHobbies, childId]);

  // Fetch videos for each hobby
  useEffect(() => {
    selectedHobbies.forEach(hobby => {
      fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${getYoutubeQuery(hobby)}&type=video&maxResults=4&key=${YT_API_KEY}`)
        .then(res => res.json())
        .then(data => setVideosByHobby(v => ({ ...v, [hobby]: data.items || [] })));
    });
  }, [selectedHobbies]);

  // Save chat history and scroll for each hobby
  useEffect(() => {
    selectedHobbies.forEach(hobby => {
      const key = `hobby_chat_${childId}_${hobby}`;
      localStorage.setItem(key, JSON.stringify(messagesByHobby[hobby] || []));
      chatEndRefsByHobby.current[hobby]?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messagesByHobby, selectedHobbies, childId]);

  if (!child) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  // File input change handler
  const handleFileChange = (hobby: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFilesByHobby(files => ({ ...files, [hobby]: f }));
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = ev => setFilePreviewsByHobby(previews => ({ ...previews, [hobby]: ev.target?.result as string }));
        reader.readAsDataURL(f);
      } else {
        setFilePreviewsByHobby(previews => ({ ...previews, [hobby]: null }));
      }
    }
  };

  // Chat send handler
  const sendMessage = (hobby: string) => async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputByHobby[hobby]?.trim() && !filesByHobby[hobby]) return;
    let userMsg;
    if (filesByHobby[hobby]) {
      userMsg = { role: "user", content: inputByHobby[hobby] ? inputByHobby[hobby] : "[File uploaded]", fileName: filesByHobby[hobby]?.name, fileType: filesByHobby[hobby]?.type };
    } else {
      userMsg = { role: "user", content: inputByHobby[hobby] };
    }
    setMessagesByHobby(msgs => ({ ...msgs, [hobby]: [...(msgs[hobby] || []), userMsg] }));
    setInputByHobby(inputs => ({ ...inputs, [hobby]: "" }));
    setFilesByHobby(files => ({ ...files, [hobby]: null }));
    setFilePreviewsByHobby(previews => ({ ...previews, [hobby]: null }));
    setLoadingByHobby(loads => ({ ...loads, [hobby]: true }));
    try {
      if (!apiUtils.isGroqApiKeyAvailable()) {
        throw new Error('API key not configured');
      }

      const res = await fetch(API_ENDPOINTS.GROQ_CHAT, {
        method: "POST",
        headers: apiUtils.getGroqHeaders(),
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: `You are a friendly hobby tutor for kids. Help with ${hobby}, use fun emojis, simple language, and make it exciting!` },
            ...(messagesByHobby[hobby] || []),
            userMsg
          ],
          max_tokens: 512,
          temperature: 0.3
        })
      });
      const data = await res.json();
      const aiMsg = { role: "assistant", content: data.choices?.[0]?.message?.content || "Sorry, I couldn't help with that. Try rephrasing your question!" };
      setMessagesByHobby(msgs => ({ ...msgs, [hobby]: [...(msgs[hobby] || []), aiMsg] }));
    } catch (err) {
      setMessagesByHobby(msgs => ({ ...msgs, [hobby]: [...(msgs[hobby] || []), { role: "assistant", content: `Sorry, there was a problem connecting to the ${hobby} tutor. Please try again.` }] }));
    }
    setLoadingByHobby(loads => ({ ...loads, [hobby]: false }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 px-2" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      <h2 className="text-3xl font-bold mb-4 text-[#0f151a]">Welcome to Your Hobby Zone</h2>
      <p className="text-[#56748f] text-lg mb-6">Choose a hobby to explore, chat, and learn more!</p>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {selectedHobbies.map((hobby, idx) => (
          <button
            key={idx}
            className={`rounded-full px-6 py-2 text-lg font-bold border-2 transition-all duration-200 ${activeHobby === hobby ? 'bg-[#3182cd] text-white border-[#3182cd]' : 'bg-white text-[#3182cd] border-[#3182cd] hover:bg-[#e9f2fc]'}`}
            onClick={() => setActiveHobby(hobby)}
          >
            {hobby}
          </button>
        ))}
      </div>
      {activeHobby && (() => {
        const meta = getHobbyMeta(activeHobby);
        return (
          <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg border border-[#d2dce4] p-6 w-full max-w-5xl">
            {/* Chatbot */}
            <div className="flex-1 flex flex-col mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{meta.icon}</span>
                <h3 className="text-lg font-bold text-[#0f151a]">{meta.title}</h3>
              </div>
              <div className="text-[#56748f] mb-4">{meta.description}</div>
              <div className="font-semibold text-[#0f151a] mb-2">Ask about {meta.title}</div>
              <div className="w-full bg-[#f7fafc] rounded-xl border border-[#e9edf2] mb-2 flex-1" style={{ minHeight: 180, maxHeight: 320, overflowY: 'auto' }}>
                <div className="flex flex-col gap-2 px-4 py-3">
                  {(messagesByHobby[activeHobby]?.length === 0) && (
                    <div className="text-gray-400 text-center">Ask me anything about {meta.title}!</div>
                  )}
                  {(messagesByHobby[activeHobby] || []).map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`rounded-xl px-4 py-2 mb-1 max-w-[80%] text-lg font-semibold ${msg.role === "user" ? "bg-blue-100 text-blue-900" : "bg-[#f0f6fc] text-[#0f151a]"}`}>
                        {msg.role === "user" ? <b>You:</b> : <b>Assistant:</b>} {msg.content}
                        {msg.fileName && (
                          <div className="mt-1 text-sm text-[#2563a6]">
                            <span>📎 {msg.fileName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={el => { chatEndRefsByHobby.current[activeHobby] = el; return undefined; }} />
                </div>
              </div>
              <form onSubmit={sendMessage(activeHobby)} className="flex gap-2 mt-2 items-center">
                <input
                  className="flex-1 rounded-lg border border-[#3182cd] bg-gray-50 px-4 py-2 text-lg font-semibold text-[#101518] focus:outline-none focus:ring-2 focus:ring-[#3182cd] placeholder:text-[#56748f] placeholder:font-semibold placeholder:text-opacity-100"
                  type="text"
                  placeholder={`Type your ${meta.title} question...`}
                  value={inputByHobby[activeHobby] || ""}
                  onChange={e => setInputByHobby(inputs => ({ ...inputs, [activeHobby]: e.target.value }))}
                  disabled={loadingByHobby[activeHobby]}
                />
                <label className="cursor-pointer flex items-center">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleFileChange(activeHobby)}
                    disabled={loadingByHobby[activeHobby]}
                  />
                  <span className="inline-block px-3 py-2 bg-[#e9f2fc] text-[#3182cd] rounded-lg font-semibold text-sm hover:bg-[#d2e6fa] transition ml-1">📎</span>
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-[#3182cd] text-gray-50 px-6 py-2 text-base font-bold hover:bg-[#2563a6] transition-all disabled:opacity-60"
                  disabled={loadingByHobby[activeHobby] || (!inputByHobby[activeHobby]?.trim() && !filesByHobby[activeHobby])}
                >
                  {loadingByHobby[activeHobby] ? "Sending..." : "Send"}
                </button>
              </form>
              {filesByHobby[activeHobby] && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#2563a6]">
                  <span>Selected: <b>{filesByHobby[activeHobby]?.name}</b></span>
                  <button type="button" className="ml-2 text-red-500 hover:underline" onClick={() => { 
                    setFilesByHobby(files => ({ ...files, [activeHobby]: null })); 
                    setFilePreviewsByHobby(previews => ({ ...previews, [activeHobby]: null })); 
                  }}>Remove</button>
                </div>
              )}
              {filePreviewsByHobby[activeHobby] && (
                <div className="mt-2"><img src={filePreviewsByHobby[activeHobby] || ""} alt="Preview" className="max-h-32 rounded" /></div>
              )}
            </div>
            {/* YouTube Videos */}
            <div className="flex-1 flex flex-col">
              <h4 className="text-base font-bold mb-2 text-[#0f151a]">Explore {meta.title} Videos</h4>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {(videosByHobby[activeHobby] || []).map((vid, i) => (
                  <a key={vid.id.videoId} href={`https://www.youtube.com/watch?v=${vid.id.videoId}`} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl shadow border border-[#d2dce4] p-3 hover:shadow-md transition">
                    <img src={vid.snippet.thumbnails.medium.url} alt={vid.snippet.title} className="rounded mb-2 w-full" />
                    <div className="font-semibold text-[#0f151a] mb-1">{vid.snippet.title}</div>
                    <div className="text-sm text-[#56748f]">{vid.snippet.channelTitle}</div>
                  </a>
                ))}
              </div>
              <a href={`https://www.youtube.com/results?search_query=${getYoutubeQuery(activeHobby)}`} target="_blank" rel="noopener noreferrer">
                <button className="mt-6 w-full rounded-full bg-[#3182cd] text-white font-bold py-3 text-lg hover:bg-[#2563a6] transition">Explore More on YouTube</button>
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  );
} 
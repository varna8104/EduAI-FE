"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const YT_API_KEY = "AIzaSyCOM4hcoVvd4I5DVDY6JrOg6z5hWMh8QDc";
const YT_QUERY = "history for kids";

interface Message {
  role: string;
  content: string;
  fileName?: string;
  fileType?: string;
}

interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: { url: string };
    };
  };
}

export default function HistoryChatPage() {
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const key = `history_chat_${params.childId}`;
    const saved = localStorage.getItem(key);
    if (saved) setMessages(JSON.parse(saved));
  }, [params.childId]);

  // Save chat history to localStorage
  useEffect(() => {
    const key = `history_chat_${params.childId}`;
    localStorage.setItem(key, JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, params.childId]);

  // Fetch YouTube videos
  useEffect(() => {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(YT_QUERY)}&type=video&maxResults=4&key=${YT_API_KEY}`)
      .then(res => res.json())
      .then(data => setVideos(data.items || []));
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    let userMsg: Message;
    if (file) {
      userMsg = { role: "user", content: input ? input : "[File uploaded]", fileName: file.name, fileType: file.type };
    } else {
      userMsg = { role: "user", content: input };
    }
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    setFile(null);
    setFilePreview(null);
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are a friendly history and social studies tutor for kids. Explain concepts with fun emojis, simple language, and make history exciting!" },
            ...messages,
            userMsg
          ],
          max_tokens: 512,
          temperature: 0.3
        })
      });
      const data = await res.json();
      const aiMsg: Message = { role: "assistant", content: data.choices?.[0]?.message?.content || "Sorry, I couldn't help with that. Try rephrasing your question!" };
      setMessages(msgs => [...msgs, aiMsg]);
    } catch {
      setMessages(msgs => [...msgs, { role: "assistant", content: "Sorry, there was a problem connecting to the history tutor. Please try again." }]);
    }
    setLoading(false);
  };

  // File input change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = ev => setFilePreview(ev.target?.result as string);
        reader.readAsDataURL(f);
      } else {
        setFilePreview(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-lg border border-[#d2dce4]">
        {/* Chatbot */}
        <div className="flex-1 flex flex-col p-6">
          <header className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🌍</span>
            <h2 className="text-lg font-bold text-[#0f151a]">Social Studies/History Chat</h2>
          </header>
          <div className="flex-1 flex flex-col gap-2 mb-2">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center">Ask me any history or social studies question!</div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-xl px-4 py-2 mb-1 max-w-[80%] text-lg font-semibold ${msg.role === "user" ? "bg-blue-100 text-blue-900" : "bg-[#f0f6fc] text-[#0f151a]"}`}>
                  {msg.role === "user" ? <b>You:</b> : <b>Edu me AI:</b>} {msg.content}
                  {msg.fileName && (
                    <div className="mt-1 text-sm text-[#2563a6]">
                      <span>📎 {msg.fileName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 mt-2 items-center">
            <input
              className="flex-1 rounded-lg border border-[#3182cd] bg-gray-50 px-4 py-2 text-lg font-semibold text-[#101518] focus:outline-none focus:ring-2 focus:ring-[#3182cd] placeholder:text-[#56748f] placeholder:font-semibold placeholder:text-opacity-100"
              type="text"
              placeholder="Type your history question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <label className="cursor-pointer flex items-center">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />
              <span className="inline-block px-3 py-2 bg-[#e9f2fc] text-[#3182cd] rounded-lg font-semibold text-sm hover:bg-[#d2e6fa] transition ml-1">📎</span>
            </label>
            <button
              type="submit"
              className="rounded-full bg-[#3182cd] text-gray-50 px-6 py-2 text-base font-bold hover:bg-[#2563a6] transition-all disabled:opacity-60"
              disabled={loading || (!input.trim() && !file)}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
          {file && (
            <div className="mt-2 flex items-center gap-2 text-sm text-[#2563a6]">
              <span>Selected: <b>{file.name}</b></span>
              <button type="button" className="ml-2 text-red-500 hover:underline" onClick={() => { setFile(null); setFilePreview(null); }}>Remove</button>
            </div>
          )}
          {filePreview && (
            <div className="mt-2">
              <Image src={filePreview} alt="Preview" width={128} height={128} className="max-h-32 rounded object-contain" />
            </div>
          )}
        </div>
        {/* YouTube Videos */}
        <div className="flex-1 flex flex-col p-6">
          <h3 className="text-xl font-bold mb-4 text-[#0f151a]">Explore History Videos</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {videos.map((vid) => (
              <a key={vid.id.videoId} href={`https://www.youtube.com/watch?v=${vid.id.videoId}`} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl shadow border border-[#d2dce4] p-3 hover:shadow-md transition">
                <Image src={vid.snippet.thumbnails.medium.url} alt={vid.snippet.title} width={320} height={180} className="rounded mb-2 w-full" />
                <div className="font-semibold text-[#0f151a] mb-1">{vid.snippet.title}</div>
                <div className="text-sm text-[#56748f]">{vid.snippet.channelTitle}</div>
              </a>
            ))}
          </div>
          <a href="https://www.youtube.com/results?search_query=history+for+kids" target="_blank" rel="noopener noreferrer">
            <button className="mt-6 w-full rounded-full bg-[#3182cd] text-white font-bold py-3 text-lg hover:bg-[#2563a6] transition">Explore More on YouTube</button>
          </a>
        </div>
      </div>
    </div>
  );
} 
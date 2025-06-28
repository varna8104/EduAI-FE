"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";

const stories = {
  goldilocks: {
    title: "Goldilocks and the Three Bears",
    yt: "https://www.youtube.com/results?search_query=goldilocks+and+the+three+bears+animation",
    lines: [
      "Once upon a time, in a cozy little house in the forest, there lived three bears:",
      "Papa Bear, who was big and strong,",
      "Mama Bear, who was gentle and kind,",
      "and Baby Bear, who was small and curious.",
      "One morning, Mama Bear made some delicious porridge for breakfast. But it was too hot to eat, so the bears decided to take a walk in the forest while it cooled down.",
      "While they were gone, a little girl named Goldilocks came wandering through the woods. She saw the house and, curious as ever, knocked on the door. When no one answered, she walked right in!",
      "Inside, she saw the three bowls of porridge on the table.",
      "She tasted Papa Bear's porridge: 'Too hot!'",
      "She tried Mama Bear's porridge: 'Too cold!'",
      "She tasted Baby Bear's porridge: 'Just right!' So she ate it all up.",
      "Next, she saw three chairs.",
      "She sat in Papa Bear's chair: 'Too hard!'",
      "She tried Mama Bear's chair: 'Too soft!'",
      "She sat in Baby Bear's chair: 'Just right!' But… CRASH! It broke!",
      "Then she went upstairs and found three beds.",
      "She lay on Papa Bear's bed: 'Too big!'",
      "She tried Mama Bear's bed: 'Too lumpy!'",
      "She curled up in Baby Bear's bed: 'Just right!' And soon, she fell fast asleep.",
      "Soon, the three bears came home.",
      "'Someone's been eating my porridge!' growled Papa Bear.",
      "'Someone's been sitting in my chair!' said Mama Bear.",
      "'Someone broke my chair!' cried Baby Bear.",
      "They went upstairs.",
      "'Someone's been lying in my bed!' said Papa Bear.",
      "'Someone's been in my bed too!' said Mama Bear.",
      "'Someone is still in my bed!' squeaked Baby Bear.",
      "Goldilocks woke up, saw the three bears staring at her, screamed 'Aaaah!', jumped out of bed, and ran out of the house as fast as she could! She never went into someone else's house again without permission.",
      "And the three bears lived happily ever after… with a new chair for Baby Bear. 😊"
    ],
    images: [
      "/story/goldilocks-1.jpg",
      "/story/goldilocks-2.jpg",
      "/story/goldilocks-3.jpg",
      "/story/goldilocks-4.jpg",
      "/story/goldilocks-5.jpg",
      "/story/goldilocks-6.jpg"
    ]
  },
  threeLittlePigs: {
    title: "The Three Little Pigs",
    yt: "https://www.youtube.com/results?search_query=three+little+pigs+animation",
    lines: [
      "Once upon a time, there were three little pigs who lived with their mother.",
      "One day, she said, 'You're all grown up now. It's time you went out into the world and built homes of your own.'",
      "So the three little pigs packed their things, said goodbye, and set off to build their houses.",
      "🐷 The First Little Pig",
      "He was lazy and didn't want to work hard.",
      "'I'll build my house out of straw. It's quick and easy!'",
      "And so he did. It was done in no time, and he spent the rest of the day relaxing.",
      "🐷 The Second Little Pig",
      "He wasn't too lazy, but he didn't want to work too hard either.",
      "'I'll build my house out of sticks. It's stronger than straw but still fast.'",
      "And so he built his stick house and then went to play.",
      "🐷 The Third Little Pig",
      "He was wise and hardworking.",
      "'I'll build my house out of bricks. It will take longer, but it will be strong and safe.'",
      "He worked hard for many days and finally built a solid brick house.",
      "🐺 Enter the Big Bad Wolf",
      "One day, a hungry wolf came by. He saw the first little pig's straw house and licked his lips.",
      "He knocked on the door and said: 'Little pig, little pig, let me in!'",
      "But the pig replied: 'Not by the hair on my chinny chin chin!'",
      "So the wolf growled, 'Then I'll huff, and I'll puff, and I'll blow your house in!'",
      "And he did! The straw house flew apart, and the first little pig ran to his brother's stick house.",
      "The wolf followed and came to the stick house.",
      "'Little pigs, little pigs, let me in!'",
      "'Not by the hair on our chinny chin chins!'",
      "So the wolf huffed and puffed — and blew the stick house down!",
      "The two pigs ran to the brick house.",
      "Now all three pigs were inside the strong brick house. The wolf came and said:",
      "'Little pigs, little pigs, let me in!'",
      "'Not by the hair on our chinny chin chins!'",
      "The wolf huffed… and puffed… and puffed harder… but he couldn't blow the brick house down!",
      "He was furious. He climbed onto the roof and tried to go down the chimney.",
      "But the smart third pig had already lit a big pot of boiling water in the fireplace.",
      "As the wolf slid down the chimney — SPLASH!",
      "He fell right into the boiling pot and yelped in pain!",
      "He shot back up the chimney and ran away into the woods, never to be seen again.",
      "The three little pigs danced with joy.",
      "The first pig learned to not be lazy.",
      "The second pig promised to work harder.",
      "And the third pig? He smiled, knowing his hard work saved them all.",
      "And they lived happily ever after in the safe, warm, strong brick house."
    ],
    images: [
      "/story/pigs-1.jpg",
      "/story/pigs-2.jpg",
      "/story/pigs-3.jpg",
      "/story/pigs-4.jpg",
      "/story/pigs-5.jpg",
      "/story/pigs-6.jpg"
    ]
  }
};

export default function StoryModePage() {
  const params = useParams();
  const [selectedStory, setSelectedStory] = useState<string>("goldilocks");
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const ttsRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const ttsActiveRef = useRef(false);

  const currentStory = stories[selectedStory as keyof typeof stories];

  // Play TTS and slideshow
  const handlePlay = async () => {
    setPlaying(true);
    setCurrentLine(0);
    setCurrentImage(0);
    ttsActiveRef.current = true;
    let idx = 0;
    function speakLine() {
      if (!ttsActiveRef.current) return;
      if (idx >= currentStory.lines.length) {
        setPlaying(false);
        setCurrentLine(currentStory.lines.length - 1);
        clearInterval(intervalRef.current);
        return;
      }
      setCurrentLine(idx);
      setCurrentImage(Math.floor(idx / (currentStory.lines.length / currentStory.images.length)));
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance(currentStory.lines[idx]);
        utter.onend = () => {
          idx++;
          setTimeout(speakLine, 800);
        };
        window.speechSynthesis.speak(utter);
      } else {
        idx++;
        setTimeout(speakLine, 1200);
      }
    }
    speakLine();
    intervalRef.current = setInterval(() => {
      setCurrentImage(img => (img + 1) % currentStory.images.length);
    }, 4000);
  };

  // Stop TTS and slideshow
  const handleStop = () => {
    setPlaying(false);
    ttsActiveRef.current = false;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    clearInterval(intervalRef.current);
  };

  React.useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      <h2 className="text-3xl font-bold mb-4 text-[#0f151a]">Story Mode</h2>
      
      {/* Story Selection */}
      <div className="flex gap-4 mb-6 items-center">
        {Object.entries(stories).map(([key, story], idx, arr) => (
          <React.Fragment key={key}>
            <button
              key={key}
              className={`rounded-full px-6 py-3 text-lg font-bold border-2 transition-all duration-200 ${
                selectedStory === key 
                  ? 'bg-[#3182cd] text-white border-[#3182cd]' 
                  : 'bg-white text-[#3182cd] border-[#3182cd] hover:bg-[#e9f2fc]'
              }`}
              onClick={() => {
                setSelectedStory(key);
                setPlaying(false);
                setCurrentLine(0);
                setCurrentImage(0);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                clearInterval(intervalRef.current);
              }}
            >
              {story.title}
            </button>
            {idx === arr.length - 1 && (
              <span className="ml-4 text-[#56748f] text-base font-medium">more stories coming soon...</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-4 text-[#0f151a] flex items-center gap-4">
        {currentStory.title}
        <button
          className={`rounded-full bg-[#3182cd] text-white font-bold py-2 px-6 text-lg hover:bg-[#2563a6] transition flex items-center gap-2 ${playing ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={handlePlay}
          disabled={playing}
        >
          ▶ Play
        </button>
        <button
          className={`rounded-full bg-[#e53e3e] text-white font-bold py-2 px-6 text-lg hover:bg-[#b91c1c] transition flex items-center gap-2 ${!playing ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={handleStop}
          disabled={!playing}
        >
          ■ Stop
        </button>
      </h3>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl bg-white rounded-xl shadow-lg border border-[#d2dce4] p-6 items-center">
        {/* Slideshow */}
        <div className="flex-1 flex flex-col items-center">
          <img
            src={currentStory.images[currentImage]}
            alt={`${currentStory.title} scene ${currentImage + 1}`}
            className="rounded-xl w-full max-w-md mb-4 border border-[#e9edf2]"
            style={{ minHeight: 240, objectFit: 'cover' }}
          />
        </div>
        {/* Story Text */}
        <div className="flex-1 flex flex-col gap-2">
          {currentStory.lines.map((line, idx) => (
            <div
              key={idx}
              className={`text-lg mb-1 px-2 py-1 rounded transition-all duration-200 ${idx === currentLine ? 'bg-[#e0f0ff] text-[#2563a6] font-bold' : 'text-[#101518]'}`}
              style={{ fontSize: idx === currentLine ? '1.25rem' : '1.1rem' }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
      <a href={currentStory.yt} target="_blank" rel="noopener noreferrer">
        <button className="mt-8 w-full max-w-md rounded-full bg-[#3182cd] text-white font-bold py-3 text-lg hover:bg-[#2563a6] transition">Watch Animation on YouTube</button>
      </a>
    </div>
  );
} 
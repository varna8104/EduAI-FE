"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentAvatar, setParentAvatar] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuBWx_KT3apOOJzNmEWRdMkzEI7ZB8YkziJS3Z0Bgvt2yoNeMKSI4MFmytKoEH33mjDblVxftSfIFgCpGk5XgAOwkHSnh8hOzF-gx098YAQfUuaIi8stwHGAffF3Jn9KeegFzB-3iQP46NlB0CeFIwiOY7_oof05AIzMNP-kofVQ5wxpP8FZrX38fu13x6VmvKNJIGqnE4OzeAQsE4hAsiK0WF68oY-ERcUE2FKQmx6LceVaUkuYGcSgkRioRvSD3Q3weu23Wk20X8i0");

  useEffect(() => {
    // Intersection Observer for scroll animations (toggle on enter/exit)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          } else {
            entry.target.classList.remove('fade-in-up');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe all sections
    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    // Observer for the subheading
    const subheading = document.getElementById('courses-subheading');
    if (subheading) {
      const subheadingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              subheading.classList.add('fade-in-up');
              subheading.classList.remove('opacity-0', 'translate-y-4');
            } else {
              subheading.classList.remove('fade-in-up');
              subheading.classList.add('opacity-0', 'translate-y-4');
            }
          });
        },
        {
          threshold: 0.1,
        }
      );
      subheadingObserver.observe(subheading);
      return () => subheadingObserver.disconnect();
    }

    // Check if logged in by looking for parentName in localStorage
    const parent = typeof window !== 'undefined' ? localStorage.getItem("parentName") : null;
    if (parent) {
      setIsLoggedIn(true);
      setParentName(parent);
      setParentAvatar("https://lh3.googleusercontent.com/aida-public/AB6AXuBWx_KT3apOOJzNmEWRdMkzEI7ZB8YkziJS3Z0Bgvt2yoNeMKSI4MFmytKoEH33mjDblVxftSfIFgCpGk5XgAOwkHSnh8hOzF-gx098YAQfUuaIi8stwHGAffF3Jn9KeegFzB-3iQP46NlB0CeFIwiOY7_oof05AIzMNP-kofVQ5wxpP8FZrX38fu13x6VmvKNJIGqnE4OzeAQsE4hAsiK0WF68oY-ERcUE2FKQmx6LceVaUkuYGcSgkRioRvSD3Q3weu23Wk20X8i0");
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 group/design-root" style={{fontFamily: 'Lexend, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf4] px-10 py-3 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-4 text-[#0d141c]">
            <div className="size-6">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em]">EduAI</span>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a 
                className="text-[#0d141c] text-sm font-medium leading-normal hover:text-[#3d98f4] transition-colors cursor-pointer" 
                onClick={() => scrollToSection('about')}
              >
                About
              </a>
              <a 
                className="text-[#0d141c] text-sm font-medium leading-normal hover:text-[#3d98f4] transition-colors cursor-pointer" 
                onClick={() => scrollToSection('courses')}
              >
                Courses
          </a>
          <a
                className="text-[#0d141c] text-sm font-medium leading-normal hover:text-[#3d98f4] transition-colors cursor-pointer" 
                onClick={() => scrollToSection('resources')}
              >
                Resources
          </a>
        </div>
            {isLoggedIn ? (
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                if (window.confirm('Do you want to log out?')) {
                  localStorage.clear();
                  setIsLoggedIn(false);
                  window.location.href = '/';
                }
              }}>
                <img src={parentAvatar} alt="profile" className="w-10 h-10 rounded-full border-2 border-[#3d98f4]" />
                <span className="text-[#0d141c] text-sm font-bold leading-normal">Welcome Parent<br />{parentName}</span>
              </div>
            ) : (
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#3d98f4] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2d7dd2] transition-all duration-300 hover:scale-105" onClick={() => router.push('/register')}>
                <span className="truncate">Get Started</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center pt-5 pb-0">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                {/* Hero Section */}
                <div
                  className="flex min-h-[420px] flex-col gap-4 bg-cover bg-center bg-no-repeat @[480px]:gap-6 @[480px]:rounded-xl items-center justify-center p-4 fade-in-up"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSO3gG3Ow6wO7azM8X5ZoPPzLwwE5Lh29-XuGiZRY-iN9vBTKFQkDgTasBkU-QwoNuGIHlm3l3CzTGSveJ31S4wWx7zZGGNNdpTcCGSZOoV3vXEejPisNlHmkx6eZGB9MHickUvMYzl2o8XmZMxcZfJr_oDowvp2WTH_FmxkDgZpHADTcJKsaG68MKsFivAhK7wbsCtbu0XwAcj_BvXgH07bvDnFSuRwKwWxgdXFFxIYJRfF9GNWdPL6Cke0q2ISgkQv89pyaL9Olj")'
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Empowering Kids with AI Tutors, Stories & Creativity
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal max-w-2xl mx-auto text-center">
                      From friendly AI chatbots to magical storytime and hands-on hobbies, our platform makes learning fun, personal, and inspiring for every child.
                    </h2>
                  </div>
                  <button 
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#3d98f4] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#2d7dd2] transition-all duration-300 hover:scale-105"
                    onClick={() => scrollToSection('courses')}
                  >
                    <span className="truncate">Explore Our Courses</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <section 
              id="courses" 
              ref={(el) => { sectionsRef.current[0] = el; }}
              className="pt-10 pb-20 opacity-0 transform translate-y-8 transition-all duration-700"
            >
              <div className="text-center mb-16">
                {/* <h2 className="text-4xl font-bold text-[#0d141c] mb-4">
                  Why Choose Edu me AI?
                </h2> */}
                {/* Subheading will fade in separately */}
                <div
                  id="courses-subheading"
                  className="text-xl text-gray-600 max-w-2xl mx-auto opacity-0 translate-y-4 transition-all duration-700"
                  style={{ pointerEvents: 'none' }}
                >
                  Our AI-powered platform provides personalized learning experiences that adapt to each child's unique needs.
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e7edf4] hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-[#3d98f4] rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#0d141c] mb-4">AI Chat Tutors</h3>
                  <p className="text-gray-600">
                    Unlock learning with friendly AI chatbots for every subject and hobby. Kids get instant help, fun explanations, and interactive support—anytime, anywhere.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e7edf4] hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-[#3d98f4] rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#0d141c] mb-4">Story Mode</h3>
                  <p className="text-gray-600">
                    Bring classic tales to life! Kids can listen, read along, and enjoy animated stories with voice narration and images, making reading magical and memorable.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e7edf4] hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-[#3d98f4] rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#0d141c] mb-4">Hobby Zone</h3>
                  <p className="text-gray-600">
                    Explore, create, and discover! From drawing to coding, our Hobby Zone inspires creativity and skill-building with hands-on activities and smart guidance.
                  </p>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section 
              id="about" 
              ref={(el) => { sectionsRef.current[1] = el; }}
              className="py-20 bg-white rounded-xl border border-[#e7edf4] p-8 opacity-0 transform translate-y-8 transition-all duration-700"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-[#0d141c] mb-6">
                    Building the Next Generation of AI Leaders
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    At Edu me AI, we believe that every child deserves the opportunity to thrive in an AI-powered world. 
                    Our mission is to democratize AI education and make it accessible, engaging, and safe for children.
                  </p>
                  <p className="text-lg text-gray-600 mb-8">
                    We combine cutting-edge AI technology with proven educational methodologies to create 
                    learning experiences that are not only effective but also enjoyable and inspiring.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-[#3d98f4] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                      AI-Ready Kids
                    </div>
                    <div className="bg-[#3d98f4] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                      Quantum Leaders
                    </div>
                    <div className="bg-[#3d98f4] text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                      Future Innovators
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-[#3d98f4] p-8 rounded-xl text-white hover:scale-105 transition-transform">
                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-lg mb-6">
                      A world where every child has the opportunity to develop the skills, knowledge, 
                      and ethical framework necessary to thrive in an increasingly AI-powered society.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span>Personalized learning paths</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span>AI ethics and responsibility</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span>Future-ready skills development</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Resources Section */}
            <section 
              id="resources" 
              ref={(el) => { sectionsRef.current[2] = el; }}
              className="py-20 opacity-0 transform translate-y-8 transition-all duration-700"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#0d141c] mb-4">
                  Learning Resources
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Access a comprehensive library of AI learning materials designed specifically for children.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e7edf4] hover:shadow-md transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-semibold text-[#0d141c] mb-4">AI Chat Help</h3>
                  <p className="text-gray-600 mb-4">
                    Get instant answers and friendly explanations from our smart AI tutors—whenever you're stuck, just ask!
                  </p>
                  <button className="text-[#3d98f4] font-semibold hover:underline">Try Chat Tutors →</button>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e7edf4] hover:shadow-md transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-semibold text-[#0d141c] mb-4">Creative Playground</h3>
                  <p className="text-gray-600 mb-4">
                    Draw, code, write, and explore! Discover hands-on activities and fun challenges to spark your imagination.
                  </p>
                  <button className="text-[#3d98f4] font-semibold hover:underline">Explore Activities →</button>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section 
              ref={(el) => { sectionsRef.current[3] = el; }}
              className="py-20 opacity-0 transform translate-y-8 transition-all duration-700"
            >
              <div className="bg-[#3d98f4] p-12 rounded-xl text-center hover:scale-105 transition-transform">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Shape the Future?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of families who are already preparing their children for the AI-driven future.
                </p>
                <button className="bg-white text-[#3d98f4] px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105" onClick={() => router.push('/register')}>
                  Start Your Child's AI Journey Today
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

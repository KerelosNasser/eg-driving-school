'use client';

import { useState } from 'react';

// List of YouTube video links - Add your YouTube links here freely
const youtubeVideos = [
  'https://youtu.be/P4lPmo9o-GY',
  'https://youtu.be/cDMyhDQJDxU',
  'https://youtu.be/vmAKc2SLvwg',
  'https://youtu.be/43omAQcTA-c',
  'https://youtu.be/I7yYikzTBsA',
  'https://youtu.be/mXmqnSNRWQo',
  'https://youtu.be/L4UeuUVirYg',
  'https://youtu.be/YfGIoAiml7w',
  'https://youtu.be/OFKG8PmoJHg',
  'https://youtu.be/HazPDnZsrcQ',
  'https://youtu.be/ZOW8kTUF9Ys',
  'https://youtu.be/GQoJsOpw5bg',
  'https://youtu.be/vMLL4vu7Wn0',
  'https://youtu.be/lkNjM4gfV9k',
];

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function DrivingEducationRules() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-20 text-center border-b-4 border-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Driving Education Rules
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
            Learn essential driving skills from our YouTube channel
          </p>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Driving Lessons Library
            </h2>
            <p className="text-gray-600 text-lg">
              Watch our comprehensive collection of driving tutorials
            </p>
          </div>

          {/* Grid Container with Separators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {youtubeVideos.map((url, index) => {
              const videoId = getYouTubeVideoId(url);
              const isLastInRow = index % 2 === 1;
              const isLastRow = index >= youtubeVideos.length - 2;

              return (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Video Container */}
                  <div className="p-6 md:p-8 bg-white">
                    <div
                      className={`
                        relative overflow-hidden rounded-2xl shadow-lg
                        transition-all duration-500 ease-out
                        ${hoveredIndex === index 
                          ? 'scale-105 shadow-2xl ring-4 ring-blue-400/50' 
                          : 'scale-100 shadow-lg'
                        }
                      `}
                    >
                      {/* Video Embed */}
                      {videoId ? (
                        <div className="aspect-video bg-gray-900 relative">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`Driving Lesson ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center px-4">
                            <svg
                              className="w-16 h-16 mx-auto mb-3 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            <p className="text-white font-semibold text-sm">
                              Lesson {index + 1}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Invalid YouTube URL
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Overlay on Hover */}
                      <div
                        className={`
                          absolute inset-0 bg-gradient-to-t from-blue-600/80 via-blue-500/20 to-transparent
                          flex items-end justify-center pb-6
                          transition-opacity duration-300 pointer-events-none
                          ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                        `}
                      >
                        <span className="text-white font-bold text-lg drop-shadow-lg">
                          Lesson {index + 1}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Vertical Separator (between columns on desktop) */}
                  {!isLastInRow && (
                    <div className="hidden md:block absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                  )}

                  {/* Horizontal Separator (between rows) */}
                  {!isLastRow && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-12">
            <h4 className="text-3xl font-bold text-gray-900 mb-4">
              Master the Road with Confidence
            </h4>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our comprehensive video library covers everything from basic vehicle control to advanced driving techniques. 
              Each lesson is designed to build your skills progressively and ensure you become a safe, confident driver.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h4 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Learning?
            </h4>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Subscribe to our YouTube channel for the latest driving tutorials, road safety tips, and expert guidance. 
              Join thousands of learners who have achieved their driving goals with EG Driving School.
            </p>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-8 py-4 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Visit Our YouTube Channel
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

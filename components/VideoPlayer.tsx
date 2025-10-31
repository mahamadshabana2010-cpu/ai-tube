
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-light-text">Your Video is Ready!</h2>
      <div className="aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-dark-border">
        <video src={videoUrl} controls autoPlay loop className="w-full h-full">
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={videoUrl}
          download="ai_generated_video.mp4"
          className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Download Video
        </a>
        <button
          onClick={onReset}
          className="bg-dark-border hover:bg-gray-600 text-light-text font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Create Another Video
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;

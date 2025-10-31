
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';
import { VideoIcon } from './icons/VideoIcon';

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const [dynamicMessage, setDynamicMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setDynamicMessage(LOADING_MESSAGES[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <div className="relative">
        <VideoIcon className="w-24 h-24 text-brand-purple animate-pulse-fast" />
      </div>
      <h2 className="text-2xl font-bold mt-8 text-light-text">{message}</h2>
      <p className="text-medium-text mt-2 transition-opacity duration-500">{dynamicMessage}</p>
      <p className="text-sm text-yellow-400 mt-8 max-w-md">
        Video generation can take a few minutes. Please don't close this window. Grab a coffee while our AI director works on your masterpiece!
      </p>
    </div>
  );
};

export default LoadingScreen;

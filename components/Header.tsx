
import React from 'react';
import { VideoIcon } from './icons/VideoIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-card/50 backdrop-blur-sm border-b border-dark-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <VideoIcon className="h-8 w-8 text-brand-purple" />
        <h1 className="text-2xl font-bold text-light-text tracking-tight">
          AI Video Editor
        </h1>
      </div>
    </header>
  );
};

export default Header;

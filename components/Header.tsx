import React from 'react';
import { PlusIcon, SparklesIcon } from './icons';

interface HeaderProps {
  onNewPost: () => void;
  onGoHome: () => void;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNewPost, onGoHome, isAdmin }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={onGoHome}
          >
            <SparklesIcon className="h-8 w-8 text-blue-600 group-hover:animate-pulse" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Landry's Log</h1>
          </div>
          {isAdmin && (
            <button
              onClick={onNewPost}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Post
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

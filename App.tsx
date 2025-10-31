import React, { useState, useCallback, useEffect } from 'react';
import { generateVideo } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import VideoEditorForm from './components/VideoEditorForm';
import LoadingScreen from './components/LoadingScreen';
import VideoPlayer from './components/VideoPlayer';
import ApiKeySelector from './components/ApiKeySelector';
import { GenerateVideoParams } from './types';

// Fix: Removed conflicting global declaration for `window.aistudio` to resolve TypeScript errors.
// The necessary types are expected to be available in the global scope of the execution environment.

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing video creation...');
  const [isKeyChecked, setIsKeyChecked] = useState<boolean>(false);
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setIsKeySelected(hasKey);
        } catch (e) {
          console.error("Error checking for API key:", e);
          setIsKeySelected(false);
        }
      }
      setIsKeyChecked(true);
    };
    checkApiKey();
  }, []);

  const handleGenerateVideo = useCallback(async (params: GenerateVideoParams) => {
    setIsLoading(true);
    setVideoUrl(null);
    setError(null);
    setLoadingMessage('Warming up the AI director...');

    try {
      const url = await generateVideo(params, setLoadingMessage);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err.message) {
        errorMessage = err.message;
        if (err.message.includes('Requested entity was not found')) {
            errorMessage = "API Key not found or invalid. Please select a valid API key.";
            setIsKeySelected(false); 
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleKeySelected = () => {
    setIsKeySelected(true);
    setError(null);
  };

  const renderContent = () => {
    if (!isKeyChecked) {
      return <div className="flex justify-center items-center h-screen text-light-text">Checking API Key...</div>;
    }

    if (!isKeySelected) {
      return <ApiKeySelector onKeySelected={handleKeySelected} />;
    }

    if (isLoading) {
      return <LoadingScreen message={loadingMessage} />;
    }
    if (error) {
      return (
        <div className="text-center p-8 animate-fade-in">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setVideoUrl(null);
            }}
            className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (videoUrl) {
      return (
        <VideoPlayer
          videoUrl={videoUrl}
          onReset={() => {
            setVideoUrl(null);
            setError(null);
          }}
        />
      );
    }
    return <VideoEditorForm onGenerate={handleGenerateVideo} />;
  };

  return (
    <div className="min-h-screen bg-dark-bg text-light-text flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;

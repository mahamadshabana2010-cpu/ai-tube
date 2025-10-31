
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success and update parent state to re-render the main app
        onKeySelected();
      } catch (e) {
        console.error("Error opening API key selection:", e);
      }
    } else {
      alert("API key selection utility is not available.");
    }
  };

  return (
    <div className="bg-dark-card rounded-lg shadow-2xl p-8 max-w-lg w-full text-center animate-fade-in border border-dark-border">
      <h2 className="text-2xl font-bold mb-4 text-light-text">Welcome to AI Video Editor</h2>
      <p className="text-medium-text mb-6">
        This application uses Google's Veo model for video generation. Please select your API key to continue. Using this service may incur costs.
      </p>
      <button
        onClick={handleSelectKey}
        className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-brand-blue"
      >
        Select API Key
      </button>
      <a
        href="https://ai.google.dev/gemini-api/docs/billing"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-brand-purple hover:underline"
      >
        Learn more about billing
      </a>
    </div>
  );
};

export default ApiKeySelector;

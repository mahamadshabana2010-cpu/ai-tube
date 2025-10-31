
import React, { useState, useCallback, ChangeEvent } from 'react';
import { YOUTUBE_STYLES } from '../constants';
import { GenerateVideoParams, VideoFormat } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { VideoIcon } from './icons/VideoIcon';

interface VideoEditorFormProps {
  onGenerate: (params: GenerateVideoParams) => void;
}

const VideoEditorForm: React.FC<VideoEditorFormProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(YOUTUBE_STYLES[0]);
  const [customStyle, setCustomStyle] = useState('');
  const [format, setFormat] = useState<VideoFormat>('16:9');
  const [image, setImage] = useState<{ file: File; dataUrl: string; } | null>(null);
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, dataUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please enter a prompt for your video.");
      return;
    }
    
    let imagePayload;
    if (image) {
      const base64Data = image.dataUrl.split(',')[1];
      imagePayload = {
        mimeType: image.file.type,
        data: base64Data,
      };
    }

    onGenerate({
      prompt,
      style,
      customStyle,
      format,
      image: imagePayload,
    });
  }, [prompt, style, customStyle, format, image, onGenerate]);
  
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-dark-card shadow-2xl rounded-xl p-8 space-y-6 border border-dark-border">
        
        {/* Style Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="style-select" className="block text-sm font-medium text-medium-text mb-2">Video Style</label>
            <select
              id="style-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-gray-900 border border-dark-border text-light-text rounded-lg p-2.5 focus:ring-brand-blue focus:border-brand-blue transition"
            >
              {YOUTUBE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {style === 'Custom' && (
            <div className="md:col-span-1 animate-fade-in">
              <label htmlFor="custom-style" className="block text-sm font-medium text-medium-text mb-2">Describe Custom Style</label>
              <input
                id="custom-style"
                type="text"
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                placeholder="e.g., 90s sitcom style"
                className="w-full bg-gray-900 border border-dark-border text-light-text rounded-lg p-2.5 focus:ring-brand-blue focus:border-brand-blue transition"
              />
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-medium-text mb-2">Video Prompt</label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-900 border border-dark-border text-light-text rounded-lg p-2.5 focus:ring-brand-blue focus:border-brand-blue transition"
            placeholder="e.g., A cat learning to skateboard in a futuristic city"
          />
        </div>

        {/* Format & Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
             <label className="block text-sm font-medium text-medium-text mb-2">Format</label>
             <div className="flex gap-4 rounded-lg bg-gray-900 border border-dark-border p-2">
                 <button type="button" onClick={() => setFormat('16:9')} className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${format === '16:9' ? 'bg-brand-blue text-white' : 'text-medium-text hover:bg-dark-border'}`}>YouTube (16:9)</button>
                 <button type="button" onClick={() => setFormat('9:16')} className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${format === '9:16' ? 'bg-brand-blue text-white' : 'text-medium-text hover:bg-dark-border'}`}>Shorts (9:16)</button>
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-medium-text mb-2">Starting Image (Optional)</label>
            <label htmlFor="image-upload" className="cursor-pointer bg-gray-900 border-2 border-dashed border-dark-border rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-brand-purple transition">
                <UploadIcon className="w-8 h-8 text-medium-text mb-2" />
                <span className="text-sm text-medium-text">{image ? image.file.name : 'Click to upload or drag & drop'}</span>
            </label>
            <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-brand-purple hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-brand-purple"
        >
          <VideoIcon className="w-5 h-5" />
          Generate Video
        </button>
      </form>
    </div>
  );
};

export default VideoEditorForm;

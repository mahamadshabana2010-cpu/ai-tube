
import { GoogleGenAI } from "@google/genai";
import { GenerateVideoParams } from '../types';

async function blobToB64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export const generateVideo = async (
  params: GenerateVideoParams,
  setLoadingMessage: (message: string) => void
): Promise<string> => {
  // Create a new instance right before the call to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let fullPrompt = params.prompt;
  if (params.style === 'Custom') {
    fullPrompt = `Create a video in the following style: '${params.customStyle}'. The video should be about: ${params.prompt}`;
  } else {
    fullPrompt = `Create a video in the style of a '${params.style}' YouTube video. The video should be about: ${params.prompt}`;
  }

  setLoadingMessage('Sending request to AI...');

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: fullPrompt,
    image: params.image ? {
      imageBytes: params.image.data,
      mimeType: params.image.mimeType
    } : undefined,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: params.format,
    },
  });

  setLoadingMessage('AI is processing the video...');

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
    try {
      const newAiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
      operation = await newAiInstance.operations.getVideosOperation({ operation: operation });
      setLoadingMessage(`Video generation in progress... Status: ${operation.metadata?.state || 'PROCESSING'}`);
    } catch(err) {
        console.error("Error during polling:", err);
        // Rethrow to be caught by the main handler
        throw err;
    }
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error('Could not retrieve video URI from the generation result.');
  }
  
  setLoadingMessage('Fetching your video...');

  // The API key must be appended to the download URI
  const finalUrl = `${downloadLink}&key=${process.env.API_KEY}`;
  const videoResponse = await fetch(finalUrl);

  if (!videoResponse.ok) {
    throw new Error('Failed to download the generated video file.');
  }

  setLoadingMessage('Video downloaded, preparing for playback...');

  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

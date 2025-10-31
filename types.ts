
export type VideoFormat = '16:9' | '9:16';

export interface GenerateVideoParams {
  prompt: string;
  style: string;
  customStyle: string;
  format: VideoFormat;
  image?: {
    mimeType: string;
    data: string;
  };
}

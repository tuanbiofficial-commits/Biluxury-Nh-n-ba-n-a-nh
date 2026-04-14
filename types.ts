
export interface GeneratedImage {
  url: string;
  aspectRatio: '9:16' | '16:9';
  label: string;
  id: string;
}

export interface StudioState {
  productImage: string | null;
  faceImage: string | null;
  isGenerating: boolean;
  results: GeneratedImage[];
  error: string | null;
  progressMessage: string;
}

export enum PoseType {
  PORTRAIT_FRONT = 'PORTRAIT_FRONT',
  PORTRAIT_3_4 = 'PORTRAIT_3_4',
  LANDSCAPE_CROSSED = 'LANDSCAPE_CROSSED',
  LANDSCAPE_RELAXED = 'LANDSCAPE_RELAXED'
}

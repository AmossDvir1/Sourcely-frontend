import api from './axiosClient';
import type { AnalysisSaveData } from '../pages/analyzer/SaveAnalysisDialog';

// Define the shape of the data coming from the backend

// From: schemas/analysis.py -> AIModel
export interface AiModel {
  id: string;
  name: string;
  description: string;
}

// From: schemas/analysis.py -> AnalysisResponse
export interface AnalysisResponse {
  analysis: string;
  sourceCode: string;
}

// From: schemas/analysis.py -> AnalysisOut
export interface SavedAnalysis {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  repository: string;
  modelUsed: string;
  analysis_content: string;
  sourceCode: string;
  analysisDate: string; // ISO string date
}

/**
 * Fetches the list of file extensions from a repository for masking.
 */
export const getRepoFileExtensions = (githubUrl: string) => {
  return api.post<{ extensions: string[]; repoName: string }>("/code/prepare-analysis", { githubUrl });
};


/**
 * Fetches the list of available AI models from the backend.
 */
export const getModels = () => {
  return api.get<AiModel[]>("/code/models");
};

/**
 * Submits a repository URL and model ID to get an AI analysis.
 */
export const analyzeRepo = (
  githubUrl: string, 
  modelId: string, 
  settings: { contentType: string[]; includedExtensions: string[] | null }
) => {
  // The backend will eventually use contentType, but for now we send the file mask
  return api.post<AnalysisResponse>("/code/analyze", { 
    githubUrl, 
    modelId, 
    includedExtensions: settings.includedExtensions ,
    contentTypes: settings.contentType,
  });
};

/**
 * Saves a completed analysis to the user's account.
 * The backend gets the user ID from the auth token.
 */
export const saveAnalysis = (data: AnalysisSaveData) => {
    const payload = {
        name: data.name,
        description: data.description,
        repository: data.repository,
        modelUsed: data.model,
        analysisContent: data.analysisContent,
        sourceCode: "placeholder", // The Analyzer component will need to provide this.
    };
  return api.post<SavedAnalysis>('/code/analyses', payload);
};

/**
 * Retrieves all saved analyses for the current authenticated user.
 */
export const getUserAnalyses = () => {
  return api.get<SavedAnalysis[]>('/code/analyses');
};

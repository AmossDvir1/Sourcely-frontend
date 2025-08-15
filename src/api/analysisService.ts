import api from './axiosClient';
import type { AnalysisSaveData } from '../pages/analyzer/SaveAnalysisDialog';

// Define the shape of the data coming from the backend

// From: schemas/analysis.py -> AIModel
export interface AiModel {
  id: string;
  name: string;
  description: string;
}

// From: schemas/analysis.py -> StagedAnalysisResponse
export interface StagedAnalysisResponse {
  tempId: string;
}

// From: schemas/analysis.py -> AnalysisOut
export interface SavedAnalysis {
  _id: string;
  user_id: string;
  name: string;
  description?: string;
  repository: string;
  modelUsed: string;
  analysisContent: string;
  sourceCode: string;
  analysisDate: string; // ISO string date
}

/**
 * Fetches a single analysis (staged or saved) by its ID.
 */
export const getAnalysisById = (analysisId: string) => {
  return api.get<SavedAnalysis>(`/code/analyses/${analysisId}`);
};

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
 * Submits for analysis and gets back a tempId.
 */
export const analyzeRepo = (
  githubUrl: string, 
  modelId: string, 
  settings: { contentType: string[]; includedExtensions: string[] | null }
) => {
  return api.post<StagedAnalysisResponse>("/code/analyze", { 
    githubUrl, 
    modelId, 
    includedExtensions: settings.includedExtensions ,
    contentTypes: settings.contentType,
  });
};
/**
 * Saves an analysis. Can now include a tempId to "claim" a staged analysis.
 */
export const saveAnalysis = (data: AnalysisSaveData) => {
    const payload = {
        name: data.name,
        description: data.description,
        repository: data.repository,
        modelUsed: data.model,
        analysisContent: data.analysisContent,
        sourceCode: "placeholder", // This still needs to be handled
        tempId: data.analysisId // Pass the ID to claim the analysis
    };
  return api.post<SavedAnalysis>('/code/analyses', payload);
};

/**
 * Retrieves all saved analyses for the current authenticated user.
 */
export const getUserAnalyses = () => {
  return api.get<SavedAnalysis[]>('/code/analyses');
};

export const prepareChatSession = (githubUrl: string) => {
  return api.post<{ chatSessionId: string }>('/code/chat/prepare', { githubUrl });
};

export const getChatStatus = (sessionId: string) => {
  return api.get<{ status: 'preparing' | 'ready' | 'error' }>(`/code/chat/status/${sessionId}`);
};

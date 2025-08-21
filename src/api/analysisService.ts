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
  analysisDate: string; // ISO string date
}

// PAYLOAD INTERFACE: Data sent TO the '/analyses' endpoint.
// This matches the backend's `AnalysisCreate` Pydantic schema.
export interface AnalysisSavePayload {
  name: string;
  description?: string;
  repository: string;
  modelUsed: string;
  analysisContent: string;
  tempId?: string; // The optional, original tempId from the URL
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
export const getRepoData = (githubUrl: string) => {
  return api.post<{ extensions: string[]; repoName: string; codebase: string }>("/code/prepare-analysis", { githubUrl });
};

/**
 * Deletes a saved analysis by its ID for the authenticated user.
 */
export const deleteAnalysis = (analysisId: string) => {
  return api.delete(`/code/analyses/${analysisId}`);
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
  settings: { contentType: string[]; includedExtensions: string[] | null },
  codebase: string 
) => {
  return api.post<StagedAnalysisResponse>("/code/analyze", { 
    githubUrl, 
    modelId, 
    includedExtensions: settings.includedExtensions,
    contentTypes: settings.contentType,
    codebase: codebase 
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
        modelUsed: data.modelUsed,
        analysisContent: data.analysisContent,
        tempId: data.tempId // Pass the ID to claim the analysis
    };
  return api.post<SavedAnalysis>('/code/analyses', payload);
};

/**
 * Retrieves all saved analyses for the current authenticated user.
 */
export const getUserAnalyses = () => {
  return api.get<SavedAnalysis[]>('/code/analyses');
};

export const prepareChatSession = (githubUrl: string, agentMode: 'smart' | 'fast') => {
  return api.post<{ chatSessionId: string }>('/code/chat/prepare', { githubUrl, agentMode });
};

export const getChatStatus = (sessionId: string) => {
  // Update the return type to include the optional `suggestions` array
  return api.get<{ status: 'preparing' | 'ready' | 'error'; suggestions?: string[] }>(`/code/chat/status/${sessionId}`);
};

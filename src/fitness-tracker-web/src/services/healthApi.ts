import { apiRequest } from './apiClient';

export interface HealthResponse {
    status: string;
    application: string;
}

export async function getHealth(
    signal?: AbortSignal
): Promise<HealthResponse> {
    return apiRequest<HealthResponse>(
        '/api/health',
        {
            signal,
        }
    );
}
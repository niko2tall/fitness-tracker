import {
    apiRequest,
} from './apiClient';

import type {
    CardioSummaryResponse,
} from '../types/cardioSummary';

export async function getCardioSummary(
    signal?: AbortSignal
): Promise<CardioSummaryResponse> {
    return apiRequest<
        CardioSummaryResponse
    >(
        '/api/progress/cardio-summary',
        {
            signal,
        }
    );
}
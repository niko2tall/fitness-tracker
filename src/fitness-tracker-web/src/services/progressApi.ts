import {
    apiRequest,
} from './apiClient';

import type {
    ExerciseHistoryResponse,
} from '../types/progress';

export async function getExerciseHistory(
    exerciseId: string,
    signal?: AbortSignal
): Promise<ExerciseHistoryResponse> {
    return apiRequest<ExerciseHistoryResponse>(
        `/api/progress/exercises/${encodeURIComponent(
            exerciseId
        )}/history`,
        {
            signal,
        }
    );
}
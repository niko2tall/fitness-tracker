import {
    apiRequest,
} from './apiClient';

import type {
    WorkoutSummary,
} from '../types/workout';

export async function getWorkoutFrequencySummaries(
    signal?: AbortSignal
): Promise<WorkoutSummary[]> {
    return apiRequest<
        WorkoutSummary[]
    >(
        '/api/workouts',
        {
            signal,
        }
    );
}
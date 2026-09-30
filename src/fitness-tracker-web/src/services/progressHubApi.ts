import {
    apiRequest,
} from './apiClient';

import type {
    ProgressExerciseOption,
} from '../types/progressHub';

export async function getProgressExerciseOptions(
    signal?: AbortSignal
): Promise<
    ProgressExerciseOption[]
> {
    return apiRequest<
        ProgressExerciseOption[]
    >(
        '/api/exercises',
        {
            signal,
        }
    );
}
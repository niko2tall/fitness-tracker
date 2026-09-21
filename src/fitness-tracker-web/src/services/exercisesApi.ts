import { apiRequest } from './apiClient';

import type {
    CreateExerciseRequest,
    Exercise,
    UpdateExerciseRequest,
} from '../types/exercise';

export async function getExercises(
    includeArchived = false,
    signal?: AbortSignal
): Promise<Exercise[]> {
    const query =
        new URLSearchParams({
            includeArchived:
                includeArchived.toString(),
        });

    return apiRequest<Exercise[]>(
        `/api/exercises?${query.toString()}`,
        {
            signal,
        }
    );
}

export async function getExerciseById(
    id: string,
    signal?: AbortSignal
): Promise<Exercise> {
    return apiRequest<Exercise>(
        `/api/exercises/${encodeURIComponent(id)}`,
        {
            signal,
        }
    );
}

export async function createExercise(
    request: CreateExerciseRequest,
    signal?: AbortSignal
): Promise<Exercise> {
    return apiRequest<Exercise>(
        '/api/exercises',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );
}

export async function updateExercise(
    id: string,
    request: UpdateExerciseRequest,
    signal?: AbortSignal
): Promise<Exercise> {
    return apiRequest<Exercise>(
        `/api/exercises/${encodeURIComponent(id)}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );
}

export async function archiveExercise(
    id: string,
    signal?: AbortSignal
): Promise<void> {
    return apiRequest<void>(
        `/api/exercises/${encodeURIComponent(id)}`,
        {
            method: 'DELETE',
            signal,
        }
    );
}
import type { Exercise } from '../types/exercise';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error(
        'VITE_API_BASE_URL is not configured. Check .env.development.'
    );
}

export interface HealthResponse {
    status: string;
    application: string;
}

export async function getHealth(
    signal?: AbortSignal
): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
        signal,
    });

    if (!response.ok) {
        throw new Error(
            `Health request failed with status ${response.status}.`
        );
    }

    return response.json();
}

export async function getExercises(
    includeArchived = false,
    signal?: AbortSignal
): Promise<Exercise[]> {
    const url = new URL(`${API_BASE_URL}/api/exercises`);

    url.searchParams.set(
        'includeArchived',
        includeArchived.toString()
    );

    const response = await fetch(url, {
        signal,
    });

    if (!response.ok) {
        throw new Error(
            `Exercise request failed with status ${response.status}.`
        );
    }

    return response.json();
}
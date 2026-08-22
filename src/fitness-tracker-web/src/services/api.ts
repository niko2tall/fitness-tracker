import type {
    CreateExerciseRequest,
    Exercise,
    UpdateExerciseRequest,
} from '../types/exercise';

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

interface ApiProblemDetails {
    title?: string;
    detail?: string;
    errors?: Record<string, string[]>;
}

async function getApiErrorMessage(
    response: Response,
    fallbackMessage: string
): Promise<string> {
    try {
        const problem =
            (await response.json()) as ApiProblemDetails;

        if (problem.detail) {
            return problem.detail;
        }

        const validationMessages = Object
            .values(problem.errors ?? {})
            .flat();

        if (validationMessages.length > 0) {
            return validationMessages.join(' ');
        }

        if (problem.title) {
            return problem.title;
        }

        return fallbackMessage;
    } catch {
        return fallbackMessage;
    }
}

export async function getHealth(
    signal?: AbortSignal
): Promise<HealthResponse> {
    const response = await fetch(
        `${API_BASE_URL}/api/health`,
        {
            signal,
        }
    );

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
    const url = new URL(
        `${API_BASE_URL}/api/exercises`
    );

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

export async function getExerciseById(
    id: string,
    signal?: AbortSignal
): Promise<Exercise> {
    const response = await fetch(
        `${API_BASE_URL}/api/exercises/${id}`,
        {
            signal,
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Exercise not found.');
        }

        throw new Error(
            `Exercise request failed with status ${response.status}.`
        );
    }

    return response.json();
}

export async function createExercise(
    request: CreateExerciseRequest,
    signal?: AbortSignal
): Promise<Exercise> {
    const response = await fetch(
        `${API_BASE_URL}/api/exercises`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );

    if (!response.ok) {
        const message = await getApiErrorMessage(
            response,
            `Exercise creation failed with status ${response.status}.`
        );

        throw new Error(message);
    }

    return response.json();
}

export async function updateExercise(
    id: string,
    request: UpdateExerciseRequest,
    signal?: AbortSignal
): Promise<Exercise> {
    const response = await fetch(
        `${API_BASE_URL}/api/exercises/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal,
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Exercise not found.');
        }

        const message = await getApiErrorMessage(
            response,
            `Exercise update failed with status ${response.status}.`
        );

        throw new Error(message);
    }

    return response.json();
}

export async function archiveExercise(
    id: string,
    signal?: AbortSignal
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/exercises/${id}`,
        {
            method: 'DELETE',
            signal,
        }
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Exercise not found.');
        }

        const message = await getApiErrorMessage(
            response,
            `Exercise archiving failed with status ${response.status}.`
        );

        throw new Error(message);
    }
}
const configuredApiBaseUrl =
    import.meta.env.VITE_API_BASE_URL;

if (!configuredApiBaseUrl) {
    throw new Error(
        'VITE_API_BASE_URL is not configured. Check .env.development.'
    );
}

const API_BASE_URL =
    configuredApiBaseUrl.replace(/\/+$/, '');

interface ApiProblemDetails {
    title?: string;
    detail?: string;
    status?: number;
    errors?: Record<string, string[]>;
}

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(
        `${API_BASE_URL}${normalizePath(path)}`,
        options
    );

    if (!response.ok) {
        const message =
            await getApiErrorMessage(response);

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

function normalizePath(path: string): string {
    return path.startsWith('/')
        ? path
        : `/${path}`;
}

async function getApiErrorMessage(
    response: Response
): Promise<string> {
    const fallbackMessage =
        `Request failed with status ${response.status}` +
        `${response.statusText
            ? ` (${response.statusText})`
            : ''}.`;

    try {
        const problem =
            (await response.json()) as ApiProblemDetails;

        if (problem.detail) {
            return problem.detail;
        }

        if (problem.errors) {
            const validationMessages =
                Object.values(problem.errors)
                    .flat()
                    .filter(
                        (message) =>
                            message.trim().length > 0
                    );

            if (validationMessages.length > 0) {
                return validationMessages.join(' ');
            }
        }

        if (problem.title) {
            return problem.title;
        }
    } catch {
        // The API response did not contain a JSON
        // problem-details body.
    }

    return fallbackMessage;
}
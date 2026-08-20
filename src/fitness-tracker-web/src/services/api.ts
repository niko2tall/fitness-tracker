const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('API Base URL:', API_BASE_URL);

export interface HealthResponse {
    status: string;
    application: string;
}

export async function getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
}
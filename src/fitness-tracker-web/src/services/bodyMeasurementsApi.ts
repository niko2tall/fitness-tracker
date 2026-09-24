import {
    apiRequest,
} from './apiClient';

import type {
    BodyMeasurement,
    CreateBodyMeasurementRequest,
    UpdateBodyMeasurementRequest,
} from '../types/bodyMeasurement';

export async function getBodyMeasurements(
    signal?: AbortSignal
): Promise<BodyMeasurement[]> {
    return apiRequest<BodyMeasurement[]>(
        '/api/body-measurements',
        {
            signal,
        }
    );
}

export async function getBodyMeasurementById(
    measurementId: string,
    signal?: AbortSignal
): Promise<BodyMeasurement> {
    return apiRequest<BodyMeasurement>(
        `/api/body-measurements/${encodeURIComponent(
            measurementId
        )}`,
        {
            signal,
        }
    );
}

export async function createBodyMeasurement(
    request: CreateBodyMeasurementRequest
): Promise<BodyMeasurement> {
    return apiRequest<BodyMeasurement>(
        '/api/body-measurements',
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json',
            },

            body:
                JSON.stringify(
                    request
                ),
        }
    );
}

export async function updateBodyMeasurement(
    measurementId: string,
    request: UpdateBodyMeasurementRequest
): Promise<BodyMeasurement> {
    return apiRequest<BodyMeasurement>(
        `/api/body-measurements/${encodeURIComponent(
            measurementId
        )}`,
        {
            method: 'PUT',

            headers: {
                'Content-Type':
                    'application/json',
            },

            body:
                JSON.stringify(
                    request
                ),
        }
    );
}

export async function deleteBodyMeasurement(
    measurementId: string
): Promise<void> {
    await apiRequest<void>(
        `/api/body-measurements/${encodeURIComponent(
            measurementId
        )}`,
        {
            method: 'DELETE',
        }
    );
}
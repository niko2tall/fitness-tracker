import {
    apiRequest,
} from './apiClient';

import type {
    StrengthVolumeResponse,
} from '../types/strengthVolume';

export async function getStrengthVolume(
    signal?: AbortSignal
): Promise<StrengthVolumeResponse> {
    return apiRequest<
        StrengthVolumeResponse
    >(
        '/api/progress/strength-volume',
        {
            signal,
        }
    );
}
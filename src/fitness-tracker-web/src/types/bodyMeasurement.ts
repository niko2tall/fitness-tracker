export interface BodyMeasurement {
    id: string;
    recordedAtUtc: string;
    weightKg: number;
    bodyFatPercentage: number | null;
    notes: string | null;
}

export interface CreateBodyMeasurementRequest {
    recordedAtUtc: string;
    weightKg: number;
    bodyFatPercentage: number | null;
    notes: string | null;
}

export interface UpdateBodyMeasurementRequest {
    recordedAtUtc: string;
    weightKg: number;
    bodyFatPercentage: number | null;
    notes: string | null;
}
export type ExerciseType =
    | 'Strength'
    | 'Cardio';

export type ExerciseTrackingType =
    | 'WeightAndReps'
    | 'RepsOnly'
    | 'Duration'
    | 'DistanceAndDuration';

export interface Exercise {
    id: string;
    name: string;
    exerciseType: ExerciseType;
    trackingType: ExerciseTrackingType;
    primaryMuscleGroup: string | null;
    equipment: string | null;
    isCustom: boolean;
    isArchived: boolean;
    createdAtUtc: string;
}

export interface CreateExerciseRequest {
    name: string;
    exerciseType: ExerciseType;
    trackingType: ExerciseTrackingType;
    primaryMuscleGroup: string | null;
    equipment: string | null;
}

export interface UpdateExerciseRequest {
    name: string;
    exerciseType: ExerciseType;
    trackingType: ExerciseTrackingType;
    primaryMuscleGroup: string | null;
    equipment: string | null;
}
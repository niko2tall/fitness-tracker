import type {
    ExerciseTrackingType,
    ExerciseType,
} from './exercise';

export interface ProgressExerciseOption {
    id: string;
    name: string;

    exerciseType:
    ExerciseType;

    trackingType:
    ExerciseTrackingType;

    isArchived: boolean;
}
import type {
    ExerciseTrackingType,
    ExerciseType,
} from './exercise';

import type {
    SetType,
    WorkoutType,
} from './workout';

export interface ExerciseHistorySet {
    id: string;
    setNumber: number;
    setType: SetType;
    reps: number | null;
    weightKg: number | null;
    durationSeconds: number | null;
    distanceMeters: number | null;
    rpe: number | null;
    notes: string | null;
}

export interface ExerciseHistoryWorkout {
    workoutId: string;
    workoutExerciseId: string;
    workoutName: string;
    workoutType: WorkoutType;
    startedAtUtc: string;
    endedAtUtc: string | null;
    exerciseNotes: string | null;
    sets: ExerciseHistorySet[];
}

export interface ExerciseHistoryResponse {
    exerciseId: string;
    exerciseName: string;
    exerciseType: ExerciseType;
    trackingType: ExerciseTrackingType;
    primaryMuscleGroup: string | null;
    equipment: string | null;
    isCustom: boolean;
    isArchived: boolean;
    entries: ExerciseHistoryWorkout[];
}
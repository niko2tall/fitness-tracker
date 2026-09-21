import type {
    ExerciseTrackingType,
    ExerciseType,
} from './exercise';

export type WorkoutType =
    | 'Strength'
    | 'Cardio'
    | 'Mixed';

export type SetType =
    | 'Warmup'
    | 'Working'
    | 'Drop'
    | 'Failure';

export interface WorkoutSet {
    id: string;
    setNumber: number;
    setType: SetType;
    reps: number | null;
    weightKg: number | null;
    durationSeconds: number | null;
    distanceMeters: number | null;
    rpe: number | null;
    isCompleted: boolean;
    notes: string | null;
}

export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    exerciseName: string;
    exerciseType: ExerciseType;
    trackingType: ExerciseTrackingType;
    orderIndex: number;
    notes: string | null;
    sets: WorkoutSet[];
}

export interface Workout {
    id: string;
    name: string;
    workoutType: WorkoutType;
    startedAtUtc: string;
    endedAtUtc: string | null;
    notes: string | null;
    createdAtUtc: string;
    updatedAtUtc: string;
    exercises: WorkoutExercise[];
}

export interface WorkoutSummary {
    id: string;
    name: string;
    workoutType: WorkoutType;
    startedAtUtc: string;
    endedAtUtc: string | null;
    exerciseCount: number;
}

export interface CreateWorkoutRequest {
    name: string;
    workoutType: WorkoutType;
    notes: string | null;
}

export interface UpdateWorkoutRequest {
    name: string;
    workoutType: WorkoutType;
    notes: string | null;
}

export interface AddWorkoutExerciseRequest {
    exerciseId: string;
    notes: string | null;
}

export interface CreateWorkoutSetRequest {
    setType: SetType;
    reps: number | null;
    weightKg: number | null;
    durationSeconds: number | null;
    distanceMeters: number | null;
    rpe: number | null;
    notes: string | null;
}

export interface UpdateWorkoutSetRequest {
    setType: SetType;
    reps: number | null;
    weightKg: number | null;
    durationSeconds: number | null;
    distanceMeters: number | null;
    rpe: number | null;
    notes: string | null;
}
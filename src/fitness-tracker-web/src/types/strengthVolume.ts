import type {
    WorkoutType,
} from './workout';

export interface StrengthVolumeExercise {
    exerciseId: string;
    exerciseName: string;

    volumeLoadKg: number;

    volumeSetCount: number;
}

export interface StrengthVolumeWorkout {
    workoutId: string;
    workoutName: string;

    workoutType:
    WorkoutType;

    startedAtUtc: string;
    endedAtUtc: string | null;

    totalVolumeLoadKg: number;

    volumeSetCount: number;

    exercises:
    StrengthVolumeExercise[];
}

export interface StrengthVolumeResponse {
    workouts:
    StrengthVolumeWorkout[];
}

export type StrengthVolumeView =
    | 'Weeks'
    | 'Months';

export interface StrengthVolumeBucket {
    key: string;

    label: string;
    shortLabel: string;

    volumeLoadKg: number;

    workoutCount: number;

    volumeSetCount: number;

    topExerciseName:
    string | null;

    topExerciseVolumeLoadKg:
    number;
}

export interface StrengthVolumeAnalytics {
    currentWeekVolumeLoadKg:
    number;

    currentMonthVolumeLoadKg:
    number;

    currentMonthVolumeSetCount:
    number;

    averageWeeklyVolumeLoadKg:
    number;

    weeklyBuckets:
    StrengthVolumeBucket[];

    monthlyBuckets:
    StrengthVolumeBucket[];
}
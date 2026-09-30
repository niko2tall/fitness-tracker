import type {
    ExerciseTrackingType,
} from './exercise';

import type {
    WorkoutType,
} from './workout';

export interface CardioSummaryExercise {
    exerciseId: string;
    exerciseName: string;

    trackingType:
    ExerciseTrackingType;

    distanceMeters: number;

    durationSeconds: number;

    cardioSetCount: number;
}

export interface CardioSummaryWorkout {
    workoutId: string;
    workoutName: string;

    workoutType:
    WorkoutType;

    startedAtUtc: string;
    endedAtUtc: string | null;

    totalDistanceMeters: number;

    totalDurationSeconds: number;

    distanceDurationSeconds: number;

    cardioSetCount: number;

    exercises:
    CardioSummaryExercise[];
}

export interface CardioSummaryResponse {
    workouts:
    CardioSummaryWorkout[];
}

export type CardioSummaryView =
    | 'Weeks'
    | 'Months';

export type CardioSummaryMetric =
    | 'Distance'
    | 'Duration';

export interface CardioSummaryBucket {
    key: string;

    label: string;
    shortLabel: string;

    distanceMeters: number;

    durationSeconds: number;

    distanceDurationSeconds: number;

    sessionCount: number;

    cardioSetCount: number;

    averagePaceSecondsPerKilometer:
    number | null;

    longestSessionName:
    string | null;

    longestSessionDistanceMeters:
    number;
}

export interface CardioLongestSession {
    workoutId: string;
    workoutName: string;

    startedAtUtc: string;

    distanceMeters: number;

    durationSeconds: number;
}

export interface CardioSummaryAnalytics {
    currentWeekDistanceMeters:
    number;

    currentMonthDistanceMeters:
    number;

    currentMonthDurationSeconds:
    number;

    currentMonthSessionCount:
    number;

    currentMonthAveragePaceSecondsPerKilometer:
    number | null;

    longestDistanceSession:
    CardioLongestSession | null;

    weeklyBuckets:
    CardioSummaryBucket[];

    monthlyBuckets:
    CardioSummaryBucket[];
}
export type WorkoutFrequencyView =
    | 'Weeks'
    | 'Months';

export interface WorkoutFrequencyBucket {
    key: string;

    label: string;
    shortLabel: string;

    workoutCount: number;
    trainingDays: number;

    strengthCount: number;
    cardioCount: number;
    mixedCount: number;
}

export interface WorkoutFrequencyAnalytics {
    completedWorkoutCount: number;

    currentWeekCount: number;
    currentMonthCount: number;

    currentMonthTrainingDays:
    number;

    averageWorkoutsPerWeek:
    number;

    weeklyBuckets:
    WorkoutFrequencyBucket[];

    monthlyBuckets:
    WorkoutFrequencyBucket[];
}
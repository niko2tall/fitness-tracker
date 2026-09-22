import type {
    WorkoutSummary,
} from '../types/workout';

export interface WorkoutHistoryMetrics {
    workoutCount: number;
    totalDurationSeconds: number;
    averageDurationSeconds: number | null;
    averageExerciseCount: number | null;
}

export function calculateWorkoutHistoryMetrics(
    workouts: WorkoutSummary[]
): WorkoutHistoryMetrics {
    let totalDurationSeconds = 0;
    let workoutsWithValidDuration = 0;
    let totalExerciseCount = 0;

    for (const workout of workouts) {
        totalExerciseCount +=
            workout.exerciseCount;

        const durationSeconds =
            getWorkoutDurationSeconds(
                workout
            );

        if (
            durationSeconds !== null
        ) {
            totalDurationSeconds +=
                durationSeconds;

            workoutsWithValidDuration += 1;
        }
    }

    return {
        workoutCount:
            workouts.length,

        totalDurationSeconds,

        averageDurationSeconds:
            workoutsWithValidDuration > 0
                ? Math.round(
                    totalDurationSeconds /
                    workoutsWithValidDuration
                )
                : null,

        averageExerciseCount:
            workouts.length > 0
                ? totalExerciseCount /
                workouts.length
                : null,
    };
}

export function getWorkoutDurationSeconds(
    workout: WorkoutSummary
): number | null {
    if (
        workout.endedAtUtc === null
    ) {
        return null;
    }

    const startedAtMilliseconds =
        Date.parse(
            workout.startedAtUtc
        );

    const endedAtMilliseconds =
        Date.parse(
            workout.endedAtUtc
        );

    if (
        !Number.isFinite(
            startedAtMilliseconds
        ) ||
        !Number.isFinite(
            endedAtMilliseconds
        )
    ) {
        return null;
    }

    if (
        endedAtMilliseconds <
        startedAtMilliseconds
    ) {
        return null;
    }

    return Math.round(
        (
            endedAtMilliseconds -
            startedAtMilliseconds
        ) / 1000
    );
}

export function formatWorkoutDuration(
    durationSeconds: number | null
): string {
    if (
        durationSeconds === null
    ) {
        return '—';
    }

    if (
        durationSeconds < 60
    ) {
        return `${durationSeconds}s`;
    }

    const hours =
        Math.floor(
            durationSeconds / 3600
        );

    const minutes =
        Math.floor(
            (
                durationSeconds %
                3600
            ) / 60
        );

    if (hours > 0) {
        if (minutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}

export function formatAverageExerciseCount(
    value: number | null
): string {
    if (value === null) {
        return '—';
    }

    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 1,
        }
    ).format(value);
}
import {
    useMemo,
} from 'react';

import type {
    WorkoutSummary,
} from '../../types/workout';

import {
    calculateWorkoutHistoryMetrics,
    formatAverageExerciseCount,
    formatWorkoutDuration,
} from '../../utils/workoutMetrics';

interface WorkoutHistoryMetricsProps {
    workouts: WorkoutSummary[];
    totalCompletedCount: number;
}

function WorkoutHistoryMetrics({
    workouts,
    totalCompletedCount,
}: WorkoutHistoryMetricsProps) {
    const metrics =
        useMemo(
            () =>
                calculateWorkoutHistoryMetrics(
                    workouts
                ),
            [workouts]
        );

    return (
        <section
            className="workout-history-metrics"
            aria-label="Workout history summary"
        >
            <article className="workout-history-metric-card">
                <span>
                    Total Completed
                </span>

                <strong>
                    {totalCompletedCount}
                </strong>

                <small>
                    All recorded history
                </small>
            </article>

            <article className="workout-history-metric-card">
                <span>
                    Matching Workouts
                </span>

                <strong>
                    {metrics.workoutCount}
                </strong>

                <small>
                    Current filters
                </small>
            </article>

            <article className="workout-history-metric-card">
                <span>
                    Training Time
                </span>

                <strong>
                    {formatWorkoutDuration(
                        metrics.totalDurationSeconds
                    )}
                </strong>

                <small>
                    Current results
                </small>
            </article>

            <article className="workout-history-metric-card">
                <span>
                    Average Duration
                </span>

                <strong>
                    {formatWorkoutDuration(
                        metrics.averageDurationSeconds
                    )}
                </strong>

                <small>
                    Per Workout
                </small>
            </article>

            <article className="workout-history-metric-card">
                <span>
                    Average Exercises
                </span>

                <strong>
                    {formatAverageExerciseCount(
                        metrics.averageExerciseCount
                    )}
                </strong>

                <small>
                    Per Workout
                </small>
            </article>
        </section>
    );
}

export default WorkoutHistoryMetrics;
import type {
    WorkoutSummary,
    WorkoutType,
} from '../types/workout';

import type {
    WorkoutFrequencyAnalytics,
    WorkoutFrequencyBucket,
} from '../types/workoutFrequency';

interface CompletedWorkoutPoint {
    startedAt: Date;
    workoutType: WorkoutType;
}

const weeklyBucketCount = 8;
const monthlyBucketCount = 6;

export function buildWorkoutFrequencyAnalytics(
    workouts: WorkoutSummary[],
    now: Date = new Date()
): WorkoutFrequencyAnalytics {
    const completedWorkouts =
        getCompletedWorkoutPoints(
            workouts
        );

    const currentWeekStart =
        startOfLocalWeek(
            now
        );

    const currentMonthStart =
        startOfLocalMonth(
            now
        );

    const firstWeeklyStart =
        addDays(
            currentWeekStart,
            -7 *
            (
                weeklyBucketCount -
                1
            )
        );

    const firstMonthlyStart =
        addMonths(
            currentMonthStart,
            -(
                monthlyBucketCount -
                1
            )
        );

    const weeklyBuckets =
        Array.from(
            {
                length:
                    weeklyBucketCount,
            },
            (
                _,
                index
            ) => {
                const start =
                    addDays(
                        firstWeeklyStart,
                        index * 7
                    );

                const end =
                    addDays(
                        start,
                        7
                    );

                return buildBucket(
                    completedWorkouts,
                    start,
                    end,
                    formatWeekLabel(
                        start,
                        end
                    ),
                    formatWeekShortLabel(
                        start
                    )
                );
            }
        );

    const monthlyBuckets =
        Array.from(
            {
                length:
                    monthlyBucketCount,
            },
            (
                _,
                index
            ) => {
                const start =
                    addMonths(
                        firstMonthlyStart,
                        index
                    );

                const end =
                    addMonths(
                        start,
                        1
                    );

                return buildBucket(
                    completedWorkouts,
                    start,
                    end,
                    formatMonthLabel(
                        start
                    ),
                    formatMonthShortLabel(
                        start
                    )
                );
            }
        );

    const currentWeek =
        weeklyBuckets[
        weeklyBuckets.length - 1
        ];

    const currentMonth =
        monthlyBuckets[
        monthlyBuckets.length - 1
        ];

    const weeklyWorkoutTotal =
        weeklyBuckets.reduce(
            (
                total,
                bucket
            ) =>
                total +
                bucket.workoutCount,
            0
        );

    return {
        completedWorkoutCount:
            completedWorkouts.length,

        currentWeekCount:
            currentWeek
                .workoutCount,

        currentMonthCount:
            currentMonth
                .workoutCount,

        currentMonthTrainingDays:
            currentMonth
                .trainingDays,

        averageWorkoutsPerWeek:
            weeklyWorkoutTotal /
            weeklyBucketCount,

        weeklyBuckets,
        monthlyBuckets,
    };
}

function getCompletedWorkoutPoints(
    workouts: WorkoutSummary[]
): CompletedWorkoutPoint[] {
    const completedWorkouts:
        CompletedWorkoutPoint[] =
        [];

    for (
        const workout
        of workouts
    ) {
        if (
            workout.endedAtUtc ===
            null
        ) {
            continue;
        }

        const startedAt =
            new Date(
                workout.startedAtUtc
            );

        if (
            Number.isNaN(
                startedAt.getTime()
            )
        ) {
            continue;
        }

        completedWorkouts.push(
            {
                startedAt,

                workoutType:
                    workout.workoutType,
            }
        );
    }

    return completedWorkouts;
}

function buildBucket(
    workouts:
        CompletedWorkoutPoint[],
    start: Date,
    end: Date,
    label: string,
    shortLabel: string
): WorkoutFrequencyBucket {
    const startTimestamp =
        start.getTime();

    const endTimestamp =
        end.getTime();

    const matchingWorkouts =
        workouts.filter(
            (workout) => {
                const timestamp =
                    workout
                        .startedAt
                        .getTime();

                return (
                    timestamp >=
                    startTimestamp &&
                    timestamp <
                    endTimestamp
                );
            }
        );

    const trainingDays =
        new Set(
            matchingWorkouts.map(
                (workout) =>
                    getLocalDateKey(
                        workout.startedAt
                    )
            )
        );

    return {
        key:
            getLocalDateKey(
                start
            ),

        label,
        shortLabel,

        workoutCount:
            matchingWorkouts.length,

        trainingDays:
            trainingDays.size,

        strengthCount:
            countWorkoutType(
                matchingWorkouts,
                'Strength'
            ),

        cardioCount:
            countWorkoutType(
                matchingWorkouts,
                'Cardio'
            ),

        mixedCount:
            countWorkoutType(
                matchingWorkouts,
                'Mixed'
            ),
    };
}

function countWorkoutType(
    workouts:
        CompletedWorkoutPoint[],
    workoutType:
        WorkoutType
): number {
    return workouts.filter(
        (workout) =>
            workout.workoutType ===
            workoutType
    ).length;
}

function startOfLocalDay(
    value: Date
): Date {
    return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
    );
}

function startOfLocalWeek(
    value: Date
): Date {
    const date =
        startOfLocalDay(
            value
        );

    const daysSinceMonday =
        (
            date.getDay() +
            6
        ) % 7;

    date.setDate(
        date.getDate() -
        daysSinceMonday
    );

    return date;
}

function startOfLocalMonth(
    value: Date
): Date {
    return new Date(
        value.getFullYear(),
        value.getMonth(),
        1
    );
}

function addDays(
    value: Date,
    days: number
): Date {
    return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate() +
        days
    );
}

function addMonths(
    value: Date,
    months: number
): Date {
    return new Date(
        value.getFullYear(),
        value.getMonth() +
        months,
        1
    );
}

function getLocalDateKey(
    value: Date
): string {
    return [
        value.getFullYear(),

        padNumber(
            value.getMonth() + 1
        ),

        padNumber(
            value.getDate()
        ),
    ].join('-');
}

function formatWeekLabel(
    start: Date,
    endExclusive: Date
): string {
    const end =
        addDays(
            endExclusive,
            -1
        );

    if (
        start.getFullYear() ===
        end.getFullYear()
    ) {
        return (
            `${formatMonthDay(
                start
            )} – ` +
            `${formatMonthDay(
                end
            )}, ` +
            `${end.getFullYear()}`
        );
    }

    return (
        `${formatMonthDayYear(
            start
        )} – ` +
        `${formatMonthDayYear(
            end
        )}`
    );
}

function formatWeekShortLabel(
    start: Date
): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            month: 'short',
            day: 'numeric',
        }
    ).format(start);
}

function formatMonthLabel(
    value: Date
): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            month: 'long',
            year: 'numeric',
        }
    ).format(value);
}

function formatMonthShortLabel(
    value: Date
): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            month: 'short',
        }
    ).format(value);
}

function formatMonthDay(
    value: Date
): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            month: 'short',
            day: 'numeric',
        }
    ).format(value);
}

function formatMonthDayYear(
    value: Date
): string {
    return new Intl.DateTimeFormat(
        undefined,
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }
    ).format(value);
}

function padNumber(
    value: number
): string {
    return value
        .toString()
        .padStart(
            2,
            '0'
        );
}
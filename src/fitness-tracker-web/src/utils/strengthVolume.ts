import type {
    StrengthVolumeAnalytics,
    StrengthVolumeBucket,
    StrengthVolumeExercise,
    StrengthVolumeWorkout,
} from '../types/strengthVolume';

const weeklyBucketCount = 8;
const monthlyBucketCount = 6;

export function buildStrengthVolumeAnalytics(
    workouts:
        StrengthVolumeWorkout[],
    now: Date = new Date()
): StrengthVolumeAnalytics {
    const validWorkouts =
        workouts.filter(
            (workout) =>
                Number.isFinite(
                    workout
                        .totalVolumeLoadKg
                ) &&
                workout
                    .totalVolumeLoadKg >=
                0 &&
                isValidTimestamp(
                    workout.startedAtUtc
                )
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
                    validWorkouts,
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
                    validWorkouts,
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

    const totalWeeklyVolume =
        weeklyBuckets.reduce(
            (
                total,
                bucket
            ) =>
                total +
                bucket.volumeLoadKg,
            0
        );

    return {
        currentWeekVolumeLoadKg:
            currentWeek
                .volumeLoadKg,

        currentMonthVolumeLoadKg:
            currentMonth
                .volumeLoadKg,

        currentMonthVolumeSetCount:
            currentMonth
                .volumeSetCount,

        averageWeeklyVolumeLoadKg:
            totalWeeklyVolume /
            weeklyBucketCount,

        weeklyBuckets,
        monthlyBuckets,
    };
}

export function formatVolumeLoad(
    value: number
): string {
    const normalized =
        Number.isFinite(value)
            ? value
            : 0;

    return (
        `${new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits:
                    normalized < 1000
                        ? 1
                        : 0,
            }
        ).format(normalized)} ` +
        'kg·reps'
    );
}

function buildBucket(
    workouts:
        StrengthVolumeWorkout[],
    start: Date,
    end: Date,
    label: string,
    shortLabel: string
): StrengthVolumeBucket {
    const startTimestamp =
        start.getTime();

    const endTimestamp =
        end.getTime();

    const matchingWorkouts =
        workouts.filter(
            (workout) => {
                const timestamp =
                    Date.parse(
                        workout.startedAtUtc
                    );

                return (
                    timestamp >=
                    startTimestamp &&
                    timestamp <
                    endTimestamp
                );
            }
        );

    const volumeLoadKg =
        matchingWorkouts.reduce(
            (
                total,
                workout
            ) =>
                total +
                workout
                    .totalVolumeLoadKg,
            0
        );

    const volumeSetCount =
        matchingWorkouts.reduce(
            (
                total,
                workout
            ) =>
                total +
                workout.volumeSetCount,
            0
        );

    const exerciseTotals =
        aggregateExercises(
            matchingWorkouts
        );

    const topExercise =
        exerciseTotals[0] ??
        null;

    return {
        key:
            getLocalDateKey(
                start
            ),

        label,
        shortLabel,

        volumeLoadKg,

        workoutCount:
            matchingWorkouts.length,

        volumeSetCount,

        topExerciseName:
            topExercise
                ?.exerciseName ??
            null,

        topExerciseVolumeLoadKg:
            topExercise
                ?.volumeLoadKg ??
            0,
    };
}

function aggregateExercises(
    workouts:
        StrengthVolumeWorkout[]
): Array<{
    exerciseId: string;
    exerciseName: string;
    volumeLoadKg: number;
}> {
    const totals =
        new Map<
            string,
            {
                exerciseId: string;
                exerciseName: string;
                volumeLoadKg: number;
            }
        >();

    for (
        const workout
        of workouts
    ) {
        for (
            const exercise
            of workout.exercises
        ) {
            addExerciseVolume(
                totals,
                exercise
            );
        }
    }

    return Array.from(
        totals.values()
    ).sort(
        (
            left,
            right
        ) =>
            right.volumeLoadKg -
            left.volumeLoadKg ||
            left.exerciseName
                .localeCompare(
                    right.exerciseName
                )
    );
}

function addExerciseVolume(
    totals:
        Map<
            string,
            {
                exerciseId: string;
                exerciseName: string;
                volumeLoadKg: number;
            }
        >,
    exercise:
        StrengthVolumeExercise
) {
    const existing =
        totals.get(
            exercise.exerciseId
        );

    if (existing) {
        existing.volumeLoadKg +=
            exercise.volumeLoadKg;

        return;
    }

    totals.set(
        exercise.exerciseId,
        {
            exerciseId:
                exercise.exerciseId,

            exerciseName:
                exercise.exerciseName,

            volumeLoadKg:
                exercise.volumeLoadKg,
        }
    );
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

function isValidTimestamp(
    value: string
): boolean {
    return Number.isFinite(
        Date.parse(value)
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
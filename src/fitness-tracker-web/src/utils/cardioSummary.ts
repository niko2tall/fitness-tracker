import type {
    CardioLongestSession,
    CardioSummaryAnalytics,
    CardioSummaryBucket,
    CardioSummaryWorkout,
} from '../types/cardioSummary';

const weeklyBucketCount = 8;
const monthlyBucketCount = 6;

export function buildCardioSummaryAnalytics(
    workouts:
        CardioSummaryWorkout[],
    now: Date = new Date()
): CardioSummaryAnalytics {
    const validWorkouts =
        workouts.filter(
            (workout) =>
                isValidTimestamp(
                    workout.startedAtUtc
                ) &&
                Number.isFinite(
                    workout
                        .totalDurationSeconds
                ) &&
                workout
                    .totalDurationSeconds >
                0
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
        weeklyBuckets.length -
        1
        ];

    const currentMonth =
        monthlyBuckets[
        monthlyBuckets.length -
        1
        ];

    const longestDistanceSession =
        getLongestDistanceSession(
            validWorkouts
        );

    return {
        currentWeekDistanceMeters:
            currentWeek
                .distanceMeters,

        currentMonthDistanceMeters:
            currentMonth
                .distanceMeters,

        currentMonthDurationSeconds:
            currentMonth
                .durationSeconds,

        currentMonthSessionCount:
            currentMonth
                .sessionCount,

        currentMonthAveragePaceSecondsPerKilometer:
            currentMonth
                .averagePaceSecondsPerKilometer,

        longestDistanceSession,

        weeklyBuckets,
        monthlyBuckets,
    };
}

export function formatDistance(
    distanceMeters: number
): string {
    const kilometers =
        distanceMeters /
        1000;

    return (
        `${new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits: 2,
            }
        ).format(kilometers)} km`
    );
}

export function formatCardioDuration(
    durationSeconds: number
): string {
    const totalSeconds =
        Math.max(
            0,
            Math.round(
                durationSeconds
            )
        );

    const hours =
        Math.floor(
            totalSeconds /
            3600
        );

    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );

    const seconds =
        totalSeconds %
        60;

    if (hours > 0) {
        if (minutes > 0) {
            return (
                `${hours}h ` +
                `${minutes}m`
            );
        }

        return `${hours}h`;
    }

    if (minutes > 0) {
        if (
            minutes < 10 &&
            seconds > 0
        ) {
            return (
                `${minutes}m ` +
                `${seconds}s`
            );
        }

        return `${minutes}m`;
    }

    return `${seconds}s`;
}

export function formatAveragePace(
    secondsPerKilometer:
        number | null
): string {
    if (
        secondsPerKilometer ===
        null ||
        !Number.isFinite(
            secondsPerKilometer
        ) ||
        secondsPerKilometer <=
        0
    ) {
        return '—';
    }

    const roundedSeconds =
        Math.round(
            secondsPerKilometer
        );

    const minutes =
        Math.floor(
            roundedSeconds / 60
        );

    const seconds =
        roundedSeconds % 60;

    return (
        `${minutes}:` +
        `${seconds
            .toString()
            .padStart(
                2,
                '0'
            )} /km`
    );
}

function buildBucket(
    workouts:
        CardioSummaryWorkout[],
    start: Date,
    end: Date,
    label: string,
    shortLabel: string
): CardioSummaryBucket {
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

    const distanceMeters =
        matchingWorkouts.reduce(
            (
                total,
                workout
            ) =>
                total +
                workout
                    .totalDistanceMeters,
            0
        );

    const durationSeconds =
        matchingWorkouts.reduce(
            (
                total,
                workout
            ) =>
                total +
                workout
                    .totalDurationSeconds,
            0
        );

    const distanceDurationSeconds =
        matchingWorkouts.reduce(
            (
                total,
                workout
            ) =>
                total +
                workout
                    .distanceDurationSeconds,
            0
        );

    const cardioSetCount =
        matchingWorkouts.reduce(
            (
                total,
                workout
            ) =>
                total +
                workout.cardioSetCount,
            0
        );

    const averagePaceSecondsPerKilometer =
        calculateAveragePace(
            distanceMeters,
            distanceDurationSeconds
        );

    const longestSession =
        getLongestDistanceSession(
            matchingWorkouts
        );

    return {
        key:
            getLocalDateKey(
                start
            ),

        label,
        shortLabel,

        distanceMeters,
        durationSeconds,

        distanceDurationSeconds,

        sessionCount:
            matchingWorkouts.length,

        cardioSetCount,

        averagePaceSecondsPerKilometer,

        longestSessionName:
            longestSession
                ?.workoutName ??
            null,

        longestSessionDistanceMeters:
            longestSession
                ?.distanceMeters ??
            0,
    };
}

function calculateAveragePace(
    distanceMeters: number,
    distanceDurationSeconds:
        number
): number | null {
    if (
        distanceMeters <= 0 ||
        distanceDurationSeconds <=
        0
    ) {
        return null;
    }

    const distanceKilometers =
        distanceMeters /
        1000;

    return (
        distanceDurationSeconds /
        distanceKilometers
    );
}

function getLongestDistanceSession(
    workouts:
        CardioSummaryWorkout[]
): CardioLongestSession | null {
    const candidates =
        workouts.filter(
            (workout) =>
                workout
                    .totalDistanceMeters >
                0
        );

    if (
        candidates.length ===
        0
    ) {
        return null;
    }

    const longest =
        candidates.reduce(
            (
                currentLongest,
                workout
            ) =>
                workout
                    .totalDistanceMeters >=
                    currentLongest
                        .totalDistanceMeters
                    ? workout
                    : currentLongest,
            candidates[0]
        );

    return {
        workoutId:
            longest.workoutId,

        workoutName:
            longest.workoutName,

        startedAtUtc:
            longest.startedAtUtc,

        distanceMeters:
            longest
                .totalDistanceMeters,

        durationSeconds:
            longest
                .distanceDurationSeconds,
    };
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
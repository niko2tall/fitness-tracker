import type {
    ExerciseTrackingType,
} from '../types/exercise';

import type {
    ExerciseHistoryResponse,
    ExerciseHistorySet,
    ExerciseHistoryWorkout,
} from '../types/progress';

export type ExerciseTrendMetric =
    | 'HeaviestWeight'
    | 'MostReps'
    | 'HighestSetVolume'
    | 'LongestDuration'
    | 'LongestDistance'
    | 'FastestPace';

export type ExerciseTrendDirection =
    | 'higher'
    | 'lower';

export interface ExerciseTrendPoint {
    workoutId: string;
    workoutName: string;
    achievedAtUtc: string;

    setNumber: number;
    setType: ExerciseHistorySet['setType'];

    value: number;
}

export interface ExerciseTrendSeries {
    metric: ExerciseTrendMetric;
    label: string;
    unit: string;
    direction: ExerciseTrendDirection;

    points: ExerciseTrendPoint[];

    earliestPoint: ExerciseTrendPoint;
    latestPoint: ExerciseTrendPoint;
    bestPoint: ExerciseTrendPoint;

    absoluteChange: number;
    percentageChange: number | null;
}

interface SessionMetricResult {
    entry: ExerciseHistoryWorkout;
    set: ExerciseHistorySet;
    value: number;
}

const weightAndRepsMetrics:
    readonly ExerciseTrendMetric[] = [
        'HeaviestWeight',
        'MostReps',
        'HighestSetVolume',
    ];

const repsOnlyMetrics:
    readonly ExerciseTrendMetric[] = [
        'MostReps',
    ];

const durationMetrics:
    readonly ExerciseTrendMetric[] = [
        'LongestDuration',
    ];

const distanceAndDurationMetrics:
    readonly ExerciseTrendMetric[] = [
        'LongestDistance',
        'LongestDuration',
        'FastestPace',
    ];

export function getAvailableExerciseTrendMetrics(
    trackingType: ExerciseTrackingType
): readonly ExerciseTrendMetric[] {
    switch (trackingType) {
        case 'WeightAndReps':
            return weightAndRepsMetrics;

        case 'RepsOnly':
            return repsOnlyMetrics;

        case 'Duration':
            return durationMetrics;

        case 'DistanceAndDuration':
            return distanceAndDurationMetrics;

        default:
            return [];
    }
}

export function getExerciseTrendMetricLabel(
    metric: ExerciseTrendMetric
): string {
    switch (metric) {
        case 'HeaviestWeight':
            return 'Heaviest Weight';

        case 'MostReps':
            return 'Most Reps';

        case 'HighestSetVolume':
            return 'Highest Set Volume';

        case 'LongestDuration':
            return 'Longest Duration';

        case 'LongestDistance':
            return 'Longest Distance';

        case 'FastestPace':
            return 'Fastest Pace';

        default:
            return metric;
    }
}

export function getExerciseTrendMetricUnit(
    metric: ExerciseTrendMetric
): string {
    switch (metric) {
        case 'HeaviestWeight':
        case 'HighestSetVolume':
            return 'kg';

        case 'MostReps':
            return 'reps';

        case 'LongestDuration':
            return 'time';

        case 'LongestDistance':
            return 'distance';

        case 'FastestPace':
            return 'min/km';

        default:
            return '';
    }
}

export function getExerciseTrendDirection(
    metric: ExerciseTrendMetric
): ExerciseTrendDirection {
    return metric === 'FastestPace'
        ? 'lower'
        : 'higher';
}

export function buildExerciseTrendSeries(
    history: ExerciseHistoryResponse,
    metric: ExerciseTrendMetric
): ExerciseTrendSeries | null {
    const availableMetrics =
        getAvailableExerciseTrendMetrics(
            history.trackingType
        );

    if (
        !availableMetrics.includes(
            metric
        )
    ) {
        return null;
    }

    const direction =
        getExerciseTrendDirection(
            metric
        );

    const points =
        history.entries
            .map(
                (entry) =>
                    getSessionMetricPoint(
                        entry,
                        metric,
                        direction
                    )
            )
            .filter(
                (
                    point
                ): point is ExerciseTrendPoint =>
                    point !== null
            )
            .sort(
                (
                    left,
                    right
                ) =>
                    getTimestamp(
                        left.achievedAtUtc
                    ) -
                    getTimestamp(
                        right.achievedAtUtc
                    )
            );

    if (
        points.length === 0
    ) {
        return null;
    }

    const earliestPoint =
        points[0];

    const latestPoint =
        points[
        points.length - 1
        ];

    const bestPoint =
        points.reduce(
            (
                best,
                point
            ) =>
                isBetterOrEqual(
                    point.value,
                    best.value,
                    direction
                )
                    ? point
                    : best,
            points[0]
        );

    const absoluteChange =
        latestPoint.value -
        earliestPoint.value;

    const percentageChange =
        earliestPoint.value > 0
            ? (
                absoluteChange /
                earliestPoint.value
            ) * 100
            : null;

    return {
        metric,

        label:
            getExerciseTrendMetricLabel(
                metric
            ),

        unit:
            getExerciseTrendMetricUnit(
                metric
            ),

        direction,

        points,

        earliestPoint,
        latestPoint,
        bestPoint,

        absoluteChange,
        percentageChange,
    };
}

export function formatExerciseTrendValue(
    metric: ExerciseTrendMetric,
    value: number
): string {
    switch (metric) {
        case 'HeaviestWeight':
            return (
                `${formatNumber(
                    value
                )} kg`
            );

        case 'MostReps':
            return (
                `${formatNumber(
                    value
                )} reps`
            );

        case 'HighestSetVolume':
            return (
                `${formatNumber(
                    value
                )} kg`
            );

        case 'LongestDuration':
            return formatDuration(
                value
            );

        case 'LongestDistance':
            return formatDistance(
                value
            );

        case 'FastestPace':
            return formatPace(
                value
            );

        default:
            return formatNumber(
                value
            );
    }
}

export function formatExerciseTrendAxisValue(
    metric: ExerciseTrendMetric,
    value: number
): string {
    switch (metric) {
        case 'HeaviestWeight':
        case 'HighestSetVolume':
        case 'MostReps':
            return formatNumber(
                value
            );

        case 'LongestDuration':
            return formatCompactTime(
                value
            );

        case 'LongestDistance':
            return formatDistance(
                value
            );

        case 'FastestPace':
            return formatPaceCompact(
                value
            );

        default:
            return formatNumber(
                value
            );
    }
}

export function formatExerciseTrendChange(
    metric: ExerciseTrendMetric,
    value: number
): string {
    const prefix =
        value > 0
            ? '+'
            : value < 0
                ? '-'
                : '';

    const absoluteValue =
        Math.abs(value);

    switch (metric) {
        case 'HeaviestWeight':
        case 'HighestSetVolume':
            return (
                `${prefix}` +
                `${formatNumber(
                    absoluteValue
                )} kg`
            );

        case 'MostReps':
            return (
                `${prefix}` +
                `${formatNumber(
                    absoluteValue
                )} reps`
            );

        case 'LongestDuration':
            return (
                `${prefix}` +
                formatDuration(
                    absoluteValue
                )
            );

        case 'LongestDistance':
            return (
                `${prefix}` +
                formatDistance(
                    absoluteValue
                )
            );

        case 'FastestPace':
            return (
                `${prefix}` +
                formatPace(
                    absoluteValue
                )
            );

        default:
            return (
                `${prefix}` +
                formatNumber(
                    absoluteValue
                )
            );
    }
}

function getSessionMetricPoint(
    entry: ExerciseHistoryWorkout,
    metric: ExerciseTrendMetric,
    direction: ExerciseTrendDirection
): ExerciseTrendPoint | null {
    const result =
        getBestSessionMetric(
            entry,
            metric,
            direction
        );

    if (!result) {
        return null;
    }

    return {
        workoutId:
            entry.workoutId,

        workoutName:
            entry.workoutName,

        achievedAtUtc:
            entry.endedAtUtc ??
            entry.startedAtUtc,

        setNumber:
            result.set.setNumber,

        setType:
            result.set.setType,

        value:
            result.value,
    };
}

function getBestSessionMetric(
    entry: ExerciseHistoryWorkout,
    metric: ExerciseTrendMetric,
    direction: ExerciseTrendDirection
): SessionMetricResult | null {
    let best:
        SessionMetricResult | null =
        null;

    for (
        const set of entry.sets
    ) {
        const value =
            getMetricValue(
                set,
                metric
            );

        if (
            value === null ||
            !Number.isFinite(value)
        ) {
            continue;
        }

        if (
            best === null ||
            isBetter(
                value,
                best.value,
                direction
            )
        ) {
            best = {
                entry,
                set,
                value,
            };
        }
    }

    return best;
}

function getMetricValue(
    set: ExerciseHistorySet,
    metric: ExerciseTrendMetric
): number | null {
    switch (metric) {
        case 'HeaviestWeight':
            if (
                set.weightKg === null ||
                set.weightKg < 0
            ) {
                return null;
            }

            return set.weightKg;

        case 'MostReps':
            if (
                set.reps === null ||
                set.reps <= 0
            ) {
                return null;
            }

            return set.reps;

        case 'HighestSetVolume':
            if (
                set.weightKg === null ||
                set.reps === null ||
                set.weightKg < 0 ||
                set.reps <= 0
            ) {
                return null;
            }

            return (
                set.weightKg *
                set.reps
            );

        case 'LongestDuration':
            if (
                set.durationSeconds === null ||
                set.durationSeconds <= 0
            ) {
                return null;
            }

            return set.durationSeconds;

        case 'LongestDistance':
            if (
                set.distanceMeters === null ||
                set.distanceMeters <= 0
            ) {
                return null;
            }

            return set.distanceMeters;

        case 'FastestPace':
            if (
                set.distanceMeters === null ||
                set.durationSeconds === null ||
                set.distanceMeters <= 0 ||
                set.durationSeconds <= 0
            ) {
                return null;
            }

            return (
                set.durationSeconds /
                (
                    set.distanceMeters /
                    1000
                )
            );

        default:
            return null;
    }
}

function isBetter(
    candidate: number,
    current: number,
    direction: ExerciseTrendDirection
): boolean {
    return direction === 'higher'
        ? candidate > current
        : candidate < current;
}

function isBetterOrEqual(
    candidate: number,
    current: number,
    direction: ExerciseTrendDirection
): boolean {
    return direction === 'higher'
        ? candidate >= current
        : candidate <= current;
}

function getTimestamp(
    value: string
): number {
    const timestamp =
        Date.parse(value);

    return Number.isFinite(
        timestamp
    )
        ? timestamp
        : 0;
}

function formatDistance(
    distanceMeters: number
): string {
    if (
        distanceMeters >= 1000
    ) {
        return (
            `${formatNumber(
                distanceMeters /
                1000
            )} km`
        );
    }

    return (
        `${formatNumber(
            distanceMeters
        )} m`
    );
}

function formatDuration(
    durationSeconds: number
): string {
    const roundedSeconds =
        Math.round(
            durationSeconds
        );

    const hours =
        Math.floor(
            roundedSeconds /
            3600
        );

    const minutes =
        Math.floor(
            (
                roundedSeconds %
                3600
            ) / 60
        );

    const seconds =
        roundedSeconds %
        60;

    if (hours > 0) {
        return [
            `${hours}h`,

            minutes > 0
                ? `${minutes}m`
                : null,

            seconds > 0
                ? `${seconds}s`
                : null,
        ]
            .filter(Boolean)
            .join(' ');
    }

    if (minutes > 0) {
        return [
            `${minutes}m`,

            seconds > 0
                ? `${seconds}s`
                : null,
        ]
            .filter(Boolean)
            .join(' ');
    }

    return `${seconds}s`;
}

function formatCompactTime(
    durationSeconds: number
): string {
    const roundedSeconds =
        Math.round(
            durationSeconds
        );

    const hours =
        Math.floor(
            roundedSeconds /
            3600
        );

    const minutes =
        Math.floor(
            (
                roundedSeconds %
                3600
            ) / 60
        );

    const seconds =
        roundedSeconds %
        60;

    if (hours > 0) {
        return (
            `${hours}:` +
            `${minutes
                .toString()
                .padStart(
                    2,
                    '0'
                )}`
        );
    }

    return (
        `${minutes}:` +
        `${seconds
            .toString()
            .padStart(
                2,
                '0'
            )}`
    );
}

function formatPace(
    secondsPerKilometre: number
): string {
    return (
        `${formatPaceCompact(
            secondsPerKilometre
        )} /km`
    );
}

function formatPaceCompact(
    secondsPerKilometre: number
): string {
    const roundedSeconds =
        Math.round(
            secondsPerKilometre
        );

    const minutes =
        Math.floor(
            roundedSeconds /
            60
        );

    const seconds =
        roundedSeconds %
        60;

    return (
        `${minutes}:` +
        `${seconds
            .toString()
            .padStart(
                2,
                '0'
            )}`
    );
}

function formatNumber(
    value: number
): string {
    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 2,
        }
    ).format(value);
}
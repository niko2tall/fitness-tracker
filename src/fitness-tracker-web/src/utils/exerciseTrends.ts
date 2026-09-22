import type {
    ExerciseHistoryResponse,
    ExerciseHistorySet,
    ExerciseHistoryWorkout,
} from '../types/progress';

export type StrengthTrendMetric =
    | 'HeaviestWeight'
    | 'MostReps'
    | 'HighestSetVolume';

export interface StrengthTrendPoint {
    workoutId: string;
    workoutName: string;
    achievedAtUtc: string;

    setNumber: number;
    setType: ExerciseHistorySet['setType'];

    value: number;
}

export interface StrengthTrendSeries {
    metric: StrengthTrendMetric;
    label: string;
    unit: string;

    points: StrengthTrendPoint[];

    earliestPoint: StrengthTrendPoint;
    latestPoint: StrengthTrendPoint;
    bestPoint: StrengthTrendPoint;

    absoluteChange: number;
    percentageChange: number | null;
}

interface SessionMetricResult {
    entry: ExerciseHistoryWorkout;
    set: ExerciseHistorySet;
    value: number;
}

export const strengthTrendMetrics:
    readonly StrengthTrendMetric[] = [
        'HeaviestWeight',
        'MostReps',
        'HighestSetVolume',
    ];

export function getStrengthTrendMetricLabel(
    metric: StrengthTrendMetric
): string {
    switch (metric) {
        case 'HeaviestWeight':
            return 'Heaviest Weight';

        case 'MostReps':
            return 'Most Reps';

        case 'HighestSetVolume':
            return 'Highest Set Volume';

        default:
            return metric;
    }
}

export function getStrengthTrendMetricUnit(
    metric: StrengthTrendMetric
): string {
    switch (metric) {
        case 'HeaviestWeight':
            return 'kg';

        case 'MostReps':
            return 'reps';

        case 'HighestSetVolume':
            return 'kg';

        default:
            return '';
    }
}

export function buildStrengthTrendSeries(
    history: ExerciseHistoryResponse,
    metric: StrengthTrendMetric
): StrengthTrendSeries | null {
    if (
        history.trackingType !==
        'WeightAndReps'
    ) {
        return null;
    }

    const points =
        history.entries
            .map(
                (entry) =>
                    getSessionMetricPoint(
                        entry,
                        metric
                    )
            )
            .filter(
                (
                    point
                ): point is StrengthTrendPoint =>
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
                point.value >=
                    best.value
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
            getStrengthTrendMetricLabel(
                metric
            ),

        unit:
            getStrengthTrendMetricUnit(
                metric
            ),

        points,

        earliestPoint,
        latestPoint,
        bestPoint,

        absoluteChange,
        percentageChange,
    };
}

export function formatStrengthTrendValue(
    metric: StrengthTrendMetric,
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

        default:
            return formatNumber(
                value
            );
    }
}

function getSessionMetricPoint(
    entry: ExerciseHistoryWorkout,
    metric: StrengthTrendMetric
): StrengthTrendPoint | null {
    const result =
        getBestSessionMetric(
            entry,
            metric
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
    metric: StrengthTrendMetric
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
            value > best.value
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
    metric: StrengthTrendMetric
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

        default:
            return null;
    }
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
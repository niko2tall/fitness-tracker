import type {
    ExerciseHistoryResponse,
    ExerciseHistorySet,
    ExerciseHistoryWorkout,
} from '../types/progress';

export type ExercisePersonalRecordKind =
    | 'HeaviestWeight'
    | 'MostReps'
    | 'HighestSetVolume'
    | 'LongestDuration'
    | 'LongestDistance'
    | 'FastestPace';

export interface ExercisePersonalRecord {
    kind: ExercisePersonalRecordKind;
    label: string;
    metricValue: number;
    displayValue: string;
    detail: string | null;

    workoutId: string;
    workoutName: string;
    achievedAtUtc: string;

    setNumber: number;
    setType: ExerciseHistorySet['setType'];
}

interface SetContext {
    entry: ExerciseHistoryWorkout;
    set: ExerciseHistorySet;
}

interface MetricMatch {
    context: SetContext;
    value: number;
}

export function calculateExercisePersonalRecords(
    history: ExerciseHistoryResponse
): ExercisePersonalRecord[] {
    const contexts =
        buildSetContexts(history);

    if (contexts.length === 0) {
        return [];
    }

    switch (history.trackingType) {
        case 'WeightAndReps':
            return calculateWeightAndRepsRecords(
                contexts
            );

        case 'RepsOnly':
            return calculateRepsOnlyRecords(
                contexts
            );

        case 'Duration':
            return calculateDurationRecords(
                contexts
            );

        case 'DistanceAndDuration':
            return calculateDistanceAndDurationRecords(
                contexts
            );

        default:
            return [];
    }
}

function buildSetContexts(
    history: ExerciseHistoryResponse
): SetContext[] {
    const contexts:
        SetContext[] = [];

    for (
        const entry of history.entries
    ) {
        for (
            const set of entry.sets
        ) {
            contexts.push({
                entry,
                set,
            });
        }
    }

    return contexts;
}

function calculateWeightAndRepsRecords(
    contexts: SetContext[]
): ExercisePersonalRecord[] {
    const records:
        ExercisePersonalRecord[] = [];

    const heaviestWeight =
        findMaximum(
            contexts,
            ({ set }) =>
                set.weightKg
        );

    if (heaviestWeight) {
        records.push(
            createRecord(
                'HeaviestWeight',
                'Heaviest Weight',
                heaviestWeight,
                `${formatNumber(
                    heaviestWeight.value
                )} kg`,
                formatWeightAndRepsDetail(
                    heaviestWeight.context.set
                )
            )
        );
    }

    const mostReps =
        findMaximum(
            contexts,
            ({ set }) =>
                set.reps
        );

    if (mostReps) {
        const set =
            mostReps.context.set;

        records.push(
            createRecord(
                'MostReps',
                'Most Reps',
                mostReps,
                `${formatNumber(
                    mostReps.value
                )} reps`,
                set.weightKg !== null
                    ? `${formatNumber(
                        set.weightKg
                    )} kg × ${set.reps ?? '—'}`
                    : null
            )
        );
    }

    const highestSetVolume =
        findMaximum(
            contexts,
            ({ set }) => {
                if (
                    set.weightKg === null ||
                    set.reps === null
                ) {
                    return null;
                }

                return (
                    set.weightKg *
                    set.reps
                );
            }
        );

    if (highestSetVolume) {
        records.push(
            createRecord(
                'HighestSetVolume',
                'Highest Set Volume',
                highestSetVolume,
                `${formatNumber(
                    highestSetVolume.value
                )} kg`,
                formatWeightAndRepsDetail(
                    highestSetVolume
                        .context
                        .set
                )
            )
        );
    }

    return records;
}

function calculateRepsOnlyRecords(
    contexts: SetContext[]
): ExercisePersonalRecord[] {
    const mostReps =
        findMaximum(
            contexts,
            ({ set }) =>
                set.reps
        );

    if (!mostReps) {
        return [];
    }

    return [
        createRecord(
            'MostReps',
            'Most Reps',
            mostReps,
            `${formatNumber(
                mostReps.value
            )} reps`,
            null
        ),
    ];
}

function calculateDurationRecords(
    contexts: SetContext[]
): ExercisePersonalRecord[] {
    const longestDuration =
        findMaximum(
            contexts,
            ({ set }) =>
                set.durationSeconds
        );

    if (!longestDuration) {
        return [];
    }

    return [
        createRecord(
            'LongestDuration',
            'Longest Duration',
            longestDuration,
            formatDuration(
                longestDuration.value
            ),
            null
        ),
    ];
}

function calculateDistanceAndDurationRecords(
    contexts: SetContext[]
): ExercisePersonalRecord[] {
    const records:
        ExercisePersonalRecord[] = [];

    const longestDistance =
        findMaximum(
            contexts,
            ({ set }) =>
                set.distanceMeters
        );

    if (longestDistance) {
        records.push(
            createRecord(
                'LongestDistance',
                'Longest Distance',
                longestDistance,
                formatDistance(
                    longestDistance.value
                ),
                formatDistanceDurationDetail(
                    longestDistance
                        .context
                        .set
                )
            )
        );
    }

    const longestDuration =
        findMaximum(
            contexts,
            ({ set }) =>
                set.durationSeconds
        );

    if (longestDuration) {
        records.push(
            createRecord(
                'LongestDuration',
                'Longest Duration',
                longestDuration,
                formatDuration(
                    longestDuration.value
                ),
                formatDistanceDurationDetail(
                    longestDuration
                        .context
                        .set
                )
            )
        );
    }

    const fastestPace =
        findMinimum(
            contexts,
            ({ set }) => {
                if (
                    set.distanceMeters === null ||
                    set.durationSeconds === null ||
                    set.distanceMeters <= 0 ||
                    set.durationSeconds <= 0
                ) {
                    return null;
                }

                const distanceKm =
                    set.distanceMeters /
                    1000;

                return (
                    set.durationSeconds /
                    distanceKm
                );
            }
        );

    if (fastestPace) {
        records.push(
            createRecord(
                'FastestPace',
                'Fastest Pace',
                fastestPace,
                formatPace(
                    fastestPace.value
                ),
                formatDistanceDurationDetail(
                    fastestPace
                        .context
                        .set
                )
            )
        );
    }

    return records;
}

function findMaximum(
    contexts: SetContext[],
    selector: (
        context: SetContext
    ) => number | null
): MetricMatch | null {
    let best:
        MetricMatch | null =
        null;

    for (
        const context of contexts
    ) {
        const value =
            selector(context);

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
                context,
                value,
            };
        }
    }

    return best;
}

function findMinimum(
    contexts: SetContext[],
    selector: (
        context: SetContext
    ) => number | null
): MetricMatch | null {
    let best:
        MetricMatch | null =
        null;

    for (
        const context of contexts
    ) {
        const value =
            selector(context);

        if (
            value === null ||
            !Number.isFinite(value)
        ) {
            continue;
        }

        if (
            best === null ||
            value < best.value
        ) {
            best = {
                context,
                value,
            };
        }
    }

    return best;
}

function createRecord(
    kind: ExercisePersonalRecordKind,
    label: string,
    match: MetricMatch,
    displayValue: string,
    detail: string | null
): ExercisePersonalRecord {
    const {
        entry,
        set,
    } = match.context;

    return {
        kind,
        label,
        metricValue:
            match.value,
        displayValue,
        detail,

        workoutId:
            entry.workoutId,

        workoutName:
            entry.workoutName,

        achievedAtUtc:
            entry.endedAtUtc ??
            entry.startedAtUtc,

        setNumber:
            set.setNumber,

        setType:
            set.setType,
    };
}

function formatWeightAndRepsDetail(
    set: ExerciseHistorySet
): string | null {
    if (
        set.weightKg === null ||
        set.reps === null
    ) {
        return null;
    }

    return (
        `${formatNumber(
            set.weightKg
        )} kg × ` +
        `${set.reps}`
    );
}

function formatDistanceDurationDetail(
    set: ExerciseHistorySet
): string | null {
    if (
        set.distanceMeters === null &&
        set.durationSeconds === null
    ) {
        return null;
    }

    const values:
        string[] = [];

    if (
        set.distanceMeters !== null
    ) {
        values.push(
            formatDistance(
                set.distanceMeters
            )
        );
    }

    if (
        set.durationSeconds !== null
    ) {
        values.push(
            formatDuration(
                set.durationSeconds
            )
        );
    }

    return values.join(' · ');
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

function formatPace(
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
            )} /km`
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
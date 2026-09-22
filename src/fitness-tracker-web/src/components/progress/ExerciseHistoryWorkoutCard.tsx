import {
    Link,
} from 'react-router-dom';

import type {
    ExerciseTrackingType,
} from '../../types/exercise';

import type {
    ExerciseHistorySet,
    ExerciseHistoryWorkout,
} from '../../types/progress';

import {
    formatDateTime,
} from '../../utils/dateTime';

interface ExerciseHistoryWorkoutCardProps {
    entry: ExerciseHistoryWorkout;
    trackingType: ExerciseTrackingType;
}

function ExerciseHistoryWorkoutCard({
    entry,
    trackingType,
}: ExerciseHistoryWorkoutCardProps) {
    return (
        <article className="exercise-history-workout">
            <header className="exercise-history-workout__header">
                <div>
                    <div className="exercise-history-workout__badges">
                        <span className="workout-status workout-status--completed">
                            Completed
                        </span>

                        <span className="workout-type-badge">
                            {entry.workoutType}
                        </span>
                    </div>

                    <h3>
                        {entry.workoutName}
                    </h3>

                    <p className="exercise-history-workout__date">
                        {entry.endedAtUtc
                            ? formatDateTime(
                                entry.endedAtUtc
                            )
                            : formatDateTime(
                                entry.startedAtUtc
                            )}
                    </p>
                </div>

                <Link
                    to={`/workouts/${entry.workoutId}`}
                    className="exercise-history-workout__link"
                >
                    View Workout
                </Link>
            </header>

            {entry.exerciseNotes && (
                <div className="exercise-history-workout__notes">
                    <span>
                        Exercise Notes
                    </span>

                    <p>
                        {entry.exerciseNotes}
                    </p>
                </div>
            )}

            <div className="exercise-history-workout__sets-header">
                <h4>
                    Recorded Sets
                </h4>

                <span>
                    {entry.sets.length === 1
                        ? '1 set'
                        : `${entry.sets.length} sets`}
                </span>
            </div>

            <div className="exercise-history-set-list">
                {entry.sets.map(
                    (set) => (
                        <div
                            key={set.id}
                            className="exercise-history-set"
                        >
                            <div className="exercise-history-set__number">
                                <strong>
                                    Set {set.setNumber}
                                </strong>

                                <span className="workout-set-type-badge">
                                    {set.setType}
                                </span>
                            </div>

                            <div className="exercise-history-set__performance">
                                {formatSetSummary(
                                    trackingType,
                                    set
                                )}
                            </div>

                            <div className="exercise-history-set__meta">
                                {set.rpe !== null && (
                                    <span>
                                        RPE {set.rpe}
                                    </span>
                                )}
                            </div>

                            {set.notes && (
                                <p className="exercise-history-set__notes">
                                    {set.notes}
                                </p>
                            )}
                        </div>
                    )
                )}
            </div>
        </article>
    );
}

function formatSetSummary(
    trackingType: ExerciseTrackingType,
    set: ExerciseHistorySet
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return (
                `${formatNumber(
                    set.weightKg
                )} kg × ` +
                `${set.reps ?? '—'}`
            );

        case 'RepsOnly':
            return (
                set.reps !== null
                    ? `${set.reps} reps`
                    : '—'
            );

        case 'Duration':
            return formatDuration(
                set.durationSeconds
            );

        case 'DistanceAndDuration':
            return (
                `${formatDistance(
                    set.distanceMeters
                )} · ` +
                `${formatDuration(
                    set.durationSeconds
                )}`
            );

        default:
            return 'Recorded performance';
    }
}

function formatDistance(
    distanceMeters: number | null
): string {
    if (
        distanceMeters === null
    ) {
        return '—';
    }

    if (
        distanceMeters >= 1000
    ) {
        return (
            `${formatNumber(
                distanceMeters / 1000
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
    durationSeconds: number | null
): string {
    if (
        durationSeconds === null
    ) {
        return '—';
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

    const seconds =
        durationSeconds % 60;

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

function formatNumber(
    value: number | null
): string {
    if (
        value === null
    ) {
        return '—';
    }

    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 2,
        }
    ).format(value);
}

export default ExerciseHistoryWorkoutCard;
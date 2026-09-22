import type {
    WorkoutExercise,
    WorkoutSet,
} from '../../types/workout';

interface WorkoutExerciseCardProps {
    exercise: WorkoutExercise;
    isActive: boolean;

    onAddSet: (
        exercise: WorkoutExercise
    ) => void;

    onEditSet: (
        exercise: WorkoutExercise,
        set: WorkoutSet
    ) => void;

    onRemoveSet: (
        exercise: WorkoutExercise,
        set: WorkoutSet
    ) => void;

    onRemove: (
        exercise: WorkoutExercise
    ) => void;
}

function WorkoutExerciseCard({
    exercise,
    isActive,
    onAddSet,
    onEditSet,
    onRemoveSet,
    onRemove,
}: WorkoutExerciseCardProps) {
    return (
        <article className="workout-session-exercise">
            <header className="workout-session-exercise__header">
                <div>
                    <span>
                        Exercise {exercise.orderIndex}
                    </span>

                    <h3>
                        {exercise.exerciseName}
                    </h3>
                </div>

                <div className="workout-exercise-actions">
                    <span className="workout-type-badge">
                        {formatTrackingType(
                            exercise.trackingType
                        )}
                    </span>

                    {isActive && (
                        <button
                            type="button"
                            className="workout-exercise-remove-button"
                            onClick={() =>
                                onRemove(exercise)
                            }
                        >
                            Remove
                        </button>
                    )}
                </div>
            </header>

            {exercise.notes && (
                <p className="workout-session-exercise__notes">
                    {exercise.notes}
                </p>
            )}

            <div className="workout-exercise-set-header">
                <div>
                    <h4>Sets</h4>

                    <span>
                        {exercise.sets.length === 1
                            ? '1 recorded'
                            : `${exercise.sets.length} recorded`}
                    </span>
                </div>

                {isActive && (
                    <button
                        type="button"
                        className="workout-button workout-button--secondary workout-add-set-button"
                        onClick={() =>
                            onAddSet(exercise)
                        }
                    >
                        Add Set
                    </button>
                )}
            </div>

            {exercise.sets.length === 0 ? (
                <p className="workout-session-exercise__empty">
                    No sets recorded.
                </p>
            ) : (
                <div className="workout-session-set-list">
                    {exercise.sets.map(
                        (set) => (
                            <div
                                key={set.id}
                                className="workout-session-set"
                            >
                                <div className="workout-session-set__heading">
                                    <strong>
                                        Set {set.setNumber}
                                    </strong>

                                    <span className="workout-set-type-badge">
                                        {set.setType}
                                    </span>
                                </div>

                                <div className="workout-session-set__performance">
                                    {formatSetSummary(
                                        exercise.trackingType,
                                        set
                                    )}
                                </div>

                                <div className="workout-session-set__right">
                                    <div className="workout-session-set__meta">
                                        {set.rpe !== null && (
                                            <span>
                                                RPE {set.rpe}
                                            </span>
                                        )}

                                        {set.isCompleted && (
                                            <span>
                                                Completed
                                            </span>
                                        )}
                                    </div>

                                    {isActive && (
                                        <div className="workout-session-set__actions">
                                            <button
                                                type="button"
                                                className="workout-set-action-button"
                                                onClick={() =>
                                                    onEditSet(
                                                        exercise,
                                                        set
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="workout-set-action-button workout-set-action-button--danger"
                                                onClick={() =>
                                                    onRemoveSet(
                                                        exercise,
                                                        set
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {set.notes && (
                                    <p className="workout-session-set__notes">
                                        {set.notes}
                                    </p>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </article>
    );
}

function formatSetSummary(
    trackingType:
        WorkoutExercise['trackingType'],
    set: WorkoutSet
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return (
                `${formatNumber(
                    set.weightKg
                )} kg × ` +
                `${set.reps ?? 0}`
            );

        case 'RepsOnly':
            return `${set.reps ?? 0} reps`;

        case 'Duration':
            return formatDuration(
                set.durationSeconds
            );

        case 'DistanceAndDuration':
            return (
                `${formatDistance(
                    set.distanceMeters
                )} · ` +
                formatDuration(
                    set.durationSeconds
                )
            );

        default:
            return 'Recorded set';
    }
}

function formatDistance(
    distanceMeters: number | null
): string {
    if (
        distanceMeters === null
    ) {
        return 'No distance';
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
        return 'No duration';
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
    if (value === null) {
        return '0';
    }

    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 2,
        }
    ).format(value);
}

function formatTrackingType(
    trackingType:
        WorkoutExercise['trackingType']
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return 'Weight + Reps';

        case 'RepsOnly':
            return 'Reps';

        case 'Duration':
            return 'Duration';

        case 'DistanceAndDuration':
            return 'Distance + Duration';

        default:
            return trackingType;
    }
}

export default WorkoutExerciseCard;
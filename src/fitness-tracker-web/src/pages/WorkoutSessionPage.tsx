import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
    useParams,
} from 'react-router-dom';

import {
    getWorkoutById,
} from '../services/api';

import type {
    Workout,
} from '../types/workout';

import {
    formatDateTime,
} from '../utils/dateTime';

import '../styles/workouts.css';

function WorkoutSessionPage() {
    const {
        workoutId,
    } = useParams<{
        workoutId: string;
    }>();

    const [
        workout,
        setWorkout,
    ] = useState<Workout | null>(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    useEffect(() => {
        if (!workoutId) {
            setError(
                'A workout ID was not provided.'
            );

            setIsLoading(false);
            return;
        }

        const controller =
            new AbortController();

        async function loadWorkout() {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getWorkoutById(
                        workoutId!,
                        controller.signal
                    );

                setWorkout(response);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setError(
                    getErrorMessage(
                        error,
                        'Unable to load this workout.'
                    )
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadWorkout();

        return () => {
            controller.abort();
        };
    }, [workoutId]);

    const totalSetCount =
        useMemo(
            () =>
                workout?.exercises.reduce(
                    (
                        total,
                        exercise
                    ) =>
                        total +
                        exercise.sets.length,
                    0
                ) ?? 0,
            [workout]
        );

    if (isLoading) {
        return (
            <main className="app-shell">
                <section className="workout-state-panel">
                    <h1>Loading workout...</h1>

                    <p>
                        Retrieving the workout session.
                    </p>
                </section>
            </main>
        );
    }

    if (error || !workout) {
        return (
            <main className="app-shell">
                <section
                    className="workout-state-panel workout-state-panel--error"
                    role="alert"
                >
                    <h1>
                        Workout couldn't be loaded
                    </h1>

                    <p>
                        {error ??
                            'The workout could not be found.'}
                    </p>

                    <Link
                        to="/workouts"
                        className="workout-text-link"
                    >
                        Return to Workouts
                    </Link>
                </section>
            </main>
        );
    }

    const isActive =
        workout.endedAtUtc === null;

    return (
        <main className="app-shell workout-session">
            <Link
                to="/workouts"
                className="workout-back-link"
            >
                ← Workouts
            </Link>

            <header className="workout-session__header">
                <div>
                    <div className="workout-summary-card__badges">
                        <span
                            className={
                                isActive
                                    ? 'workout-status workout-status--active'
                                    : 'workout-status workout-status--completed'
                            }
                        >
                            {isActive
                                ? 'Active'
                                : 'Completed'}
                        </span>

                        <span className="workout-type-badge">
                            {workout.workoutType}
                        </span>
                    </div>

                    <h1>{workout.name}</h1>

                    {workout.notes && (
                        <p className="workout-session__notes">
                            {workout.notes}
                        </p>
                    )}
                </div>
            </header>

            <section className="workout-session__summary">
                <div>
                    <span>Started</span>

                    <strong>
                        {formatDateTime(
                            workout.startedAtUtc
                        )}
                    </strong>
                </div>

                <div>
                    <span>Exercises</span>

                    <strong>
                        {workout.exercises.length}
                    </strong>
                </div>

                <div>
                    <span>Sets</span>

                    <strong>
                        {totalSetCount}
                    </strong>
                </div>

                {workout.endedAtUtc && (
                    <div>
                        <span>Completed</span>

                        <strong>
                            {formatDateTime(
                                workout.endedAtUtc
                            )}
                        </strong>
                    </div>
                )}
            </section>

            <section className="workout-session__exercises">
                <header className="workout-section__header">
                    <div>
                        <p className="workout-section__eyebrow">
                            Session
                        </p>

                        <h2>Exercises</h2>
                    </div>

                    <span className="workout-section__count">
                        {workout.exercises.length}
                    </span>
                </header>

                {workout.exercises.length === 0 ? (
                    <div className="workout-section__empty">
                        <p>
                            No exercises have been added to
                            this workout yet.
                        </p>

                        {isActive && (
                            <p>
                                Exercise selection and logging
                                controls will be added next.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="workout-session-exercise-list">
                        {workout.exercises.map(
                            (exercise) => (
                                <article
                                    key={exercise.id}
                                    className="workout-session-exercise"
                                >
                                    <header className="workout-session-exercise__header">
                                        <div>
                                            <span>
                                                Exercise{' '}
                                                {exercise.orderIndex}
                                            </span>

                                            <h3>
                                                {exercise.exerciseName}
                                            </h3>
                                        </div>

                                        <span className="workout-type-badge">
                                            {exercise.trackingType}
                                        </span>
                                    </header>

                                    {exercise.notes && (
                                        <p className="workout-session-exercise__notes">
                                            {exercise.notes}
                                        </p>
                                    )}

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
                                                        <strong>
                                                            Set{' '}
                                                            {set.setNumber}
                                                        </strong>

                                                        <span>
                                                            {formatSetSummary(
                                                                exercise.trackingType,
                                                                set
                                                            )}
                                                        </span>

                                                        {set.rpe !== null && (
                                                            <span>
                                                                RPE {set.rpe}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </article>
                            )
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

function formatSetSummary(
    trackingType: Workout['exercises'][number]['trackingType'],
    set: Workout['exercises'][number]['sets'][number]
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return `${set.weightKg ?? 0} kg × ${set.reps ?? 0}`;

        case 'RepsOnly':
            return `${set.reps ?? 0} reps`;

        case 'Duration':
            return formatDuration(
                set.durationSeconds
            );

        case 'DistanceAndDuration':
            return (
                `${set.distanceMeters ?? 0} m · ` +
                formatDuration(
                    set.durationSeconds
                )
            );

        default:
            return 'Recorded set';
    }
}

function formatDuration(
    durationSeconds: number | null
): string {
    if (durationSeconds === null) {
        return 'No duration';
    }

    const minutes =
        Math.floor(durationSeconds / 60);

    const seconds =
        durationSeconds % 60;

    if (minutes === 0) {
        return `${seconds}s`;
    }

    if (seconds === 0) {
        return `${minutes}m`;
    }

    return `${minutes}m ${seconds}s`;
}

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    return error instanceof Error &&
        error.message.trim().length > 0
        ? error.message
        : fallback;
}

export default WorkoutSessionPage;
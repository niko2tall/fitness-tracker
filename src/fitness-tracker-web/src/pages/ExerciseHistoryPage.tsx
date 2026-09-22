import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
    useParams,
} from 'react-router-dom';

import ExerciseHistoryWorkoutCard
    from '../components/progress/ExerciseHistoryWorkoutCard';

import ExercisePersonalRecords
    from '../components/progress/ExercisePersonalRecords';

import {
    getExerciseHistory,
} from '../services/api';

import type {
    ExerciseHistoryResponse,
} from '../types/progress';

import {
    formatDateTime,
} from '../utils/dateTime';

import '../styles/workouts.css';
import '../styles/exerciseHistory.css';

function ExerciseHistoryPage() {
    const {
        exerciseId,
    } = useParams<{
        exerciseId: string;
    }>();

    const [
        history,
        setHistory,
    ] =
        useState<
            ExerciseHistoryResponse | null
        >(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );

    useEffect(() => {
        if (!exerciseId) {
            setError(
                'An exercise ID was not provided.'
            );

            setIsLoading(false);

            return;
        }

        const controller =
            new AbortController();

        async function loadHistory() {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getExerciseHistory(
                        exerciseId!,
                        controller.signal
                    );

                setHistory(response);
            } catch (error) {
                if (
                    error instanceof
                    DOMException &&
                    error.name ===
                    'AbortError'
                ) {
                    return;
                }

                setError(
                    getErrorMessage(
                        error,
                        'Unable to load exercise history.'
                    )
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setIsLoading(false);
                }
            }
        }

        void loadHistory();

        return () => {
            controller.abort();
        };
    }, [exerciseId]);

    const totalSetCount =
        useMemo(
            () =>
                history?.entries.reduce(
                    (
                        total,
                        entry
                    ) =>
                        total +
                        entry.sets.length,
                    0
                ) ?? 0,
            [history]
        );

    const mostRecentEntry =
        history?.entries[0] ??
        null;

    const firstEntry =
        history &&
            history.entries.length > 0
            ? history.entries[
            history.entries.length -
            1
            ]
            : null;

    if (isLoading) {
        return (
            <main className="app-shell">
                <section className="workout-state-panel">
                    <h1>
                        Loading exercise history...
                    </h1>

                    <p>
                        Retrieving completed
                        performance records.
                    </p>
                </section>
            </main>
        );
    }

    if (
        error ||
        !history
    ) {
        return (
            <main className="app-shell">
                <section
                    className="workout-state-panel workout-state-panel--error"
                    role="alert"
                >
                    <h1>
                        Exercise history couldn't
                        be loaded
                    </h1>

                    <p>
                        {error ??
                            'The exercise could not be found.'}
                    </p>

                    <Link
                        to="/exercises"
                        className="workout-text-link"
                    >
                        Return to Exercise Library
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="app-shell exercise-history-page">
            <Link
                to="/exercises"
                className="workout-back-link"
            >
                ← Exercise Library
            </Link>

            <header className="exercise-history-header">
                <div>
                    <div className="exercise-history-header__badges">
                        <span className="workout-type-badge">
                            {history.exerciseType}
                        </span>

                        <span className="exercise-history-tracking-badge">
                            {formatTrackingType(
                                history.trackingType
                            )}
                        </span>

                        {history.isCustom && (
                            <span className="exercise-history-muted-badge">
                                Custom
                            </span>
                        )}

                        {history.isArchived && (
                            <span className="exercise-history-muted-badge">
                                Archived
                            </span>
                        )}
                    </div>

                    <p className="page-header__eyebrow">
                        Progress Tracking
                    </p>

                    <h1>
                        {history.exerciseName}
                    </h1>

                    <p className="page-header__description">
                        Review completed
                        performance history and
                        current personal records
                        for this exercise.
                    </p>
                </div>
            </header>

            <section className="exercise-history-metadata">
                <div>
                    <span>
                        Primary Muscle
                    </span>

                    <strong>
                        {history.primaryMuscleGroup ??
                            'Not specified'}
                    </strong>
                </div>

                <div>
                    <span>
                        Equipment
                    </span>

                    <strong>
                        {history.equipment ??
                            'Not specified'}
                    </strong>
                </div>

                <div>
                    <span>
                        Tracking
                    </span>

                    <strong>
                        {formatTrackingType(
                            history.trackingType
                        )}
                    </strong>
                </div>
            </section>

            {history.isArchived && (
                <section className="exercise-history-archived-notice">
                    <strong>
                        Archived Exercise
                    </strong>

                    <p>
                        This exercise is no longer
                        available for new logging,
                        but its completed performance
                        history is preserved.
                    </p>
                </section>
            )}

            <section
                className="exercise-history-summary"
                aria-label="Exercise history summary"
            >
                <article className="exercise-history-summary-card">
                    <span>
                        Sessions
                    </span>

                    <strong>
                        {history.entries.length}
                    </strong>

                    <small>
                        Completed Workouts
                    </small>
                </article>

                <article className="exercise-history-summary-card">
                    <span>
                        Recorded Sets
                    </span>

                    <strong>
                        {totalSetCount}
                    </strong>

                    <small>
                        Finalized Sets
                    </small>
                </article>

                <article className="exercise-history-summary-card">
                    <span>
                        Most Recent
                    </span>

                    <strong className="exercise-history-summary-card__date">
                        {mostRecentEntry
                            ? formatHistoryDate(
                                mostRecentEntry
                                    .endedAtUtc ??
                                mostRecentEntry
                                    .startedAtUtc
                            )
                            : '—'}
                    </strong>

                    <small>
                        Latest completed session
                    </small>
                </article>

                <article className="exercise-history-summary-card">
                    <span>
                        First Logged
                    </span>

                    <strong className="exercise-history-summary-card__date">
                        {firstEntry
                            ? formatHistoryDate(
                                firstEntry
                                    .endedAtUtc ??
                                firstEntry
                                    .startedAtUtc
                            )
                            : '—'}
                    </strong>

                    <small>
                        Earliest completed session
                    </small>
                </article>
            </section>

            {history.entries.length >
                0 && (
                    <ExercisePersonalRecords
                        history={history}
                    />
                )}

            {history.entries.length ===
                0 ? (
                <section className="exercise-history-empty">
                    <p className="workout-empty-state__eyebrow">
                        No completed history
                    </p>

                    <h2>
                        No finalized performance yet
                    </h2>

                    <p>
                        This exercise has not yet
                        been recorded in a completed
                        Workout. Active Workout data
                        will appear here after the
                        Workout is completed.
                    </p>

                    <Link
                        to="/workouts"
                        className="exercise-history-action-link"
                    >
                        Go to Active Workouts
                    </Link>
                </section>
            ) : (
                <section className="exercise-history-section">
                    <header className="workout-section__header">
                        <div>
                            <p className="workout-section__eyebrow">
                                Performance History
                            </p>

                            <h2>
                                Completed Sessions
                            </h2>
                        </div>

                        <span className="workout-section__count">
                            {history.entries.length}
                        </span>
                    </header>

                    <div className="exercise-history-workout-list">
                        {history.entries.map(
                            (entry) => (
                                <ExerciseHistoryWorkoutCard
                                    key={
                                        entry
                                            .workoutExerciseId
                                    }
                                    entry={entry}
                                    trackingType={
                                        history.trackingType
                                    }
                                />
                            )
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}

function formatTrackingType(
    trackingType:
        ExerciseHistoryResponse['trackingType']
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

function formatHistoryDate(
    value: string
): string {
    const parsed =
        new Date(value);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return formatDateTime(
            value
        );
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }
    ).format(parsed);
}

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    return (
        error instanceof Error &&
            error.message.trim().length >
            0
            ? error.message
            : fallback
    );
}

export default ExerciseHistoryPage;
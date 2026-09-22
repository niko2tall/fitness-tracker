import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import WorkoutSummaryCard
    from '../components/workouts/WorkoutSummaryCard';

import {
    getWorkouts,
} from '../services/api';

import type {
    WorkoutSummary,
} from '../types/workout';

import '../styles/workouts.css';
import '../styles/workoutHistory.css';

function WorkoutHistoryPage() {
    const [
        workouts,
        setWorkouts,
    ] = useState<WorkoutSummary[]>([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    useEffect(() => {
        const controller =
            new AbortController();

        async function loadWorkouts() {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getWorkouts(
                        controller.signal
                    );

                setWorkouts(response);
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
                        'Unable to load workout history.'
                    )
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadWorkouts();

        return () => {
            controller.abort();
        };
    }, []);

    const completedWorkouts =
        useMemo(
            () =>
                workouts.filter(
                    (workout) =>
                        workout.endedAtUtc !== null
                ),
            [workouts]
        );

    return (
        <main className="app-shell workout-history-page">
            <Link
                to="/workouts"
                className="workout-back-link"
            >
                ← Active Workouts
            </Link>

            <header className="page-header workout-history-page__header">
                <div>
                    <p className="page-header__eyebrow">
                        Training History
                    </p>

                    <h1>
                        Workout History
                    </h1>

                    <p className="page-header__description">
                        Review your completed training
                        sessions and open any workout
                        to see its exercises, sets,
                        performance data, and notes.
                    </p>
                </div>
            </header>

            {isLoading && (
                <section
                    className="workout-state-panel"
                    aria-live="polite"
                >
                    <h2>
                        Loading workout history...
                    </h2>

                    <p>
                        Retrieving your completed
                        sessions.
                    </p>
                </section>
            )}

            {!isLoading && error && (
                <section
                    className="workout-state-panel workout-state-panel--error"
                    role="alert"
                >
                    <h2>
                        Workout history couldn't
                        be loaded
                    </h2>

                    <p>
                        {error}
                    </p>
                </section>
            )}

            {!isLoading &&
                !error &&
                completedWorkouts.length === 0 && (
                    <section className="workout-history-empty">
                        <p className="workout-empty-state__eyebrow">
                            No completed workouts
                        </p>

                        <h2>
                            Your history is empty
                        </h2>

                        <p>
                            Completed workouts will
                            appear here after you finish
                            your first session.
                        </p>

                        <Link
                            to="/workouts"
                            className="workout-history-link-button"
                        >
                            Go to Active Workouts
                        </Link>
                    </section>
                )}

            {!isLoading &&
                !error &&
                completedWorkouts.length > 0 && (
                    <>
                        <section className="workout-history-summary">
                            <div className="workout-history-summary-card">
                                <span>
                                    Completed Workouts
                                </span>

                                <strong>
                                    {completedWorkouts.length}
                                </strong>
                            </div>
                        </section>

                        <section className="workout-section">
                            <header className="workout-section__header">
                                <div>
                                    <p className="workout-section__eyebrow">
                                        Completed Sessions
                                    </p>

                                    <h2>
                                        Training History
                                    </h2>
                                </div>

                                <span className="workout-section__count">
                                    {completedWorkouts.length}
                                </span>
                            </header>

                            <div className="workout-card-grid">
                                {completedWorkouts.map(
                                    (workout) => (
                                        <WorkoutSummaryCard
                                            key={workout.id}
                                            workout={workout}
                                        />
                                    )
                                )}
                            </div>
                        </section>
                    </>
                )}
        </main>
    );
}

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    return (
        error instanceof Error &&
            error.message.trim().length > 0
            ? error.message
            : fallback
    );
}

export default WorkoutHistoryPage;
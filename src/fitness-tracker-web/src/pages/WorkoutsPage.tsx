import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
    useNavigate,
} from 'react-router-dom';

import CreateWorkoutDialog
    from '../components/workouts/CreateWorkoutDialog';

import WorkoutSummaryCard
    from '../components/workouts/WorkoutSummaryCard';

import {
    createWorkout,
    getWorkouts,
} from '../services/api';

import type {
    CreateWorkoutRequest,
    WorkoutSummary,
} from '../types/workout';

import '../styles/workouts.css';
import '../styles/workoutHistory.css';

function WorkoutsPage() {
    const navigate =
        useNavigate();

    const [
        workouts,
        setWorkouts,
    ] = useState<WorkoutSummary[]>([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        loadError,
        setLoadError,
    ] = useState<string | null>(null);

    const [
        isCreateDialogOpen,
        setIsCreateDialogOpen,
    ] = useState(false);

    const [
        isCreating,
        setIsCreating,
    ] = useState(false);

    const [
        createError,
        setCreateError,
    ] = useState<string | null>(null);

    useEffect(() => {
        const controller =
            new AbortController();

        async function loadWorkouts() {
            try {
                setIsLoading(true);
                setLoadError(null);

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

                setLoadError(
                    getErrorMessage(
                        error,
                        'Unable to load workouts.'
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

    const activeWorkouts =
        useMemo(
            () =>
                workouts.filter(
                    (workout) =>
                        workout.endedAtUtc === null
                ),
            [workouts]
        );

    function openCreateDialog() {
        setCreateError(null);

        setIsCreateDialogOpen(
            true
        );
    }

    function closeCreateDialog() {
        if (isCreating) {
            return;
        }

        setCreateError(null);

        setIsCreateDialogOpen(
            false
        );
    }

    async function handleCreateWorkout(
        request:
            CreateWorkoutRequest
    ) {
        try {
            setIsCreating(true);
            setCreateError(null);

            const workout =
                await createWorkout(
                    request
                );

            setIsCreateDialogOpen(
                false
            );

            navigate(
                `/workouts/${workout.id}`
            );
        } catch (error) {
            setCreateError(
                getErrorMessage(
                    error,
                    'Unable to start the workout.'
                )
            );
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <>
            <main className="app-shell workouts-page">
                <header className="page-header workouts-page__header">
                    <div>
                        <p className="page-header__eyebrow">
                            Workout Management
                        </p>

                        <h1>
                            Workouts
                        </h1>

                        <p className="page-header__description">
                            Start a new workout or
                            continue one of your active
                            training sessions.
                        </p>
                    </div>

                    <div className="workout-history-actions">
                        <Link
                            to="/history"
                            className="workout-history-link-button workout-history-link-button--secondary"
                        >
                            Workout History
                        </Link>

                        <button
                            type="button"
                            className="workout-button workout-button--primary"
                            onClick={
                                openCreateDialog
                            }
                        >
                            Start Workout
                        </button>
                    </div>
                </header>

                {isLoading && (
                    <section
                        className="workout-state-panel"
                        aria-live="polite"
                    >
                        <h2>
                            Loading workouts...
                        </h2>

                        <p>
                            Retrieving your active
                            training sessions.
                        </p>
                    </section>
                )}

                {!isLoading &&
                    loadError && (
                        <section
                            className="workout-state-panel workout-state-panel--error"
                            role="alert"
                        >
                            <h2>
                                Workouts couldn't
                                be loaded
                            </h2>

                            <p>
                                {loadError}
                            </p>
                        </section>
                    )}

                {!isLoading &&
                    !loadError &&
                    activeWorkouts.length ===
                    0 && (
                        <section className="workout-empty-state">
                            <p className="workout-empty-state__eyebrow">
                                No active workouts
                            </p>

                            <h2>
                                Start a new session
                            </h2>

                            <p>
                                You don't currently
                                have a workout in
                                progress.
                            </p>

                            <div className="workout-history-actions">
                                <button
                                    type="button"
                                    className="workout-button workout-button--primary"
                                    onClick={
                                        openCreateDialog
                                    }
                                >
                                    Start Workout
                                </button>

                                <Link
                                    to="/history"
                                    className="workout-history-link-button workout-history-link-button--secondary"
                                >
                                    View History
                                </Link>
                            </div>
                        </section>
                    )}

                {!isLoading &&
                    !loadError &&
                    activeWorkouts.length > 0 && (
                        <section className="workout-section">
                            <header className="workout-section__header">
                                <div>
                                    <p className="workout-section__eyebrow">
                                        In Progress
                                    </p>

                                    <h2>
                                        Active Workouts
                                    </h2>
                                </div>

                                <span className="workout-section__count">
                                    {
                                        activeWorkouts.length
                                    }
                                </span>
                            </header>

                            <div className="workout-card-grid">
                                {activeWorkouts.map(
                                    (workout) => (
                                        <WorkoutSummaryCard
                                            key={workout.id}
                                            workout={workout}
                                        />
                                    )
                                )}
                            </div>
                        </section>
                    )}
            </main>

            <CreateWorkoutDialog
                isOpen={
                    isCreateDialogOpen
                }
                isSubmitting={
                    isCreating
                }
                error={
                    createError
                }
                onClose={
                    closeCreateDialog
                }
                onSubmit={
                    handleCreateWorkout
                }
            />
        </>
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

export default WorkoutsPage;
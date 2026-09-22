import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import WorkoutHistoryFilters, {
    type WorkoutHistoryDateMode,
    type WorkoutHistoryTypeFilter,
} from '../components/workouts/WorkoutHistoryFilters';

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
    ] = useState<
        WorkoutSummary[]
    >([]);

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

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');

    const [
        workoutTypeFilter,
        setWorkoutTypeFilter,
    ] =
        useState<
            WorkoutHistoryTypeFilter
        >('All');

    const [
        dateMode,
        setDateMode,
    ] =
        useState<
            WorkoutHistoryDateMode
        >('all');

    const [
        selectedMonth,
        setSelectedMonth,
    ] = useState(
        () =>
            startOfMonth(
                new Date()
            )
    );

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
                        'Unable to load workout history.'
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

        void loadWorkouts();

        return () => {
            controller.abort();
        };
    }, []);

    const completedWorkouts =
        useMemo(
            () =>
                [...workouts]
                    .filter(
                        (workout) =>
                            workout.endedAtUtc !==
                            null
                    )
                    .sort(
                        (
                            left,
                            right
                        ) =>
                            getCompletedTimestamp(
                                right
                            ) -
                            getCompletedTimestamp(
                                left
                            )
                    ),
            [workouts]
        );

    const filteredWorkouts =
        useMemo(() => {
            const normalizedSearch =
                searchTerm
                    .trim()
                    .toLowerCase();

            return completedWorkouts.filter(
                (workout) => {
                    if (
                        normalizedSearch &&
                        !workout.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            )
                    ) {
                        return false;
                    }

                    if (
                        workoutTypeFilter !==
                        'All' &&
                        workout.workoutType !==
                        workoutTypeFilter
                    ) {
                        return false;
                    }

                    if (
                        dateMode === 'month' &&
                        !isWorkoutInMonth(
                            workout,
                            selectedMonth
                        )
                    ) {
                        return false;
                    }

                    return true;
                }
            );
        }, [
            completedWorkouts,
            searchTerm,
            workoutTypeFilter,
            dateMode,
            selectedMonth,
        ]);

    const currentMonth =
        useMemo(
            () =>
                startOfMonth(
                    new Date()
                ),
            []
        );

    const canGoNextMonth =
        selectedMonth.getTime() <
        currentMonth.getTime();

    function handlePreviousMonth() {
        setSelectedMonth(
            (current) =>
                moveMonth(
                    current,
                    -1
                )
        );
    }

    function handleNextMonth() {
        setSelectedMonth(
            (current) => {
                const next =
                    moveMonth(
                        current,
                        1
                    );

                if (
                    next.getTime() >
                    currentMonth.getTime()
                ) {
                    return currentMonth;
                }

                return next;
            }
        );
    }

    function handleDateModeChange(
        value:
            WorkoutHistoryDateMode
    ) {
        setDateMode(value);

        if (value === 'month') {
            setSelectedMonth(
                (current) => {
                    if (
                        current.getTime() >
                        currentMonth.getTime()
                    ) {
                        return currentMonth;
                    }

                    return current;
                }
            );
        }
    }

    function handleClearFilters() {
        setSearchTerm('');

        setWorkoutTypeFilter(
            'All'
        );

        setDateMode('all');

        setSelectedMonth(
            currentMonth
        );
    }

    const resultsTitle =
        dateMode === 'month'
            ? formatMonth(
                selectedMonth
            )
            : 'All Completed Sessions';

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
                        Search and filter your
                        completed training sessions,
                        or browse your history
                        month by month.
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

            {!isLoading &&
                error && (
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
                completedWorkouts.length ===
                0 && (
                    <section className="workout-history-empty">
                        <p className="workout-empty-state__eyebrow">
                            No completed workouts
                        </p>

                        <h2>
                            Your history is empty
                        </h2>

                        <p>
                            Completed workouts will
                            appear here after you
                            finish your first
                            session.
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
                completedWorkouts.length >
                0 && (
                    <>
                        <section className="workout-history-summary">
                            <div className="workout-history-summary-card">
                                <span>
                                    Total Completed
                                </span>

                                <strong>
                                    {
                                        completedWorkouts
                                            .length
                                    }
                                </strong>
                            </div>

                            <div className="workout-history-summary-card">
                                <span>
                                    Showing
                                </span>

                                <strong>
                                    {
                                        filteredWorkouts
                                            .length
                                    }
                                </strong>
                            </div>
                        </section>

                        <WorkoutHistoryFilters
                            searchTerm={
                                searchTerm
                            }
                            workoutTypeFilter={
                                workoutTypeFilter
                            }
                            dateMode={
                                dateMode
                            }
                            selectedMonth={
                                selectedMonth
                            }
                            canGoNextMonth={
                                canGoNextMonth
                            }
                            onSearchTermChange={
                                setSearchTerm
                            }
                            onWorkoutTypeFilterChange={
                                setWorkoutTypeFilter
                            }
                            onDateModeChange={
                                handleDateModeChange
                            }
                            onPreviousMonth={
                                handlePreviousMonth
                            }
                            onNextMonth={
                                handleNextMonth
                            }
                            onClearFilters={
                                handleClearFilters
                            }
                        />

                        <section className="workout-section">
                            <header className="workout-section__header">
                                <div>
                                    <p className="workout-section__eyebrow">
                                        Completed Sessions
                                    </p>

                                    <h2>
                                        {resultsTitle}
                                    </h2>
                                </div>

                                <span className="workout-section__count">
                                    {
                                        filteredWorkouts
                                            .length
                                    }
                                </span>
                            </header>

                            <p
                                className="workout-history-results-meta"
                                aria-live="polite"
                            >
                                Showing{' '}
                                {
                                    filteredWorkouts
                                        .length
                                }{' '}
                                of{' '}
                                {
                                    completedWorkouts
                                        .length
                                }{' '}
                                completed workouts.
                            </p>

                            {filteredWorkouts.length ===
                                0 ? (
                                <div className="workout-history-no-results">
                                    <p className="workout-empty-state__eyebrow">
                                        No matches
                                    </p>

                                    <h3>
                                        No workouts match
                                        these filters
                                    </h3>

                                    <p>
                                        Try another Workout
                                        Type, search term,
                                        or date range.
                                    </p>

                                    <button
                                        type="button"
                                        className="workout-history-clear-button"
                                        onClick={
                                            handleClearFilters
                                        }
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="workout-card-grid">
                                    {filteredWorkouts.map(
                                        (workout) => (
                                            <WorkoutSummaryCard
                                                key={
                                                    workout.id
                                                }
                                                workout={
                                                    workout
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}
        </main>
    );
}

function isWorkoutInMonth(
    workout: WorkoutSummary,
    month: Date
): boolean {
    if (
        workout.endedAtUtc === null
    ) {
        return false;
    }

    const completedAt =
        new Date(
            workout.endedAtUtc
        );

    return (
        completedAt.getFullYear() ===
        month.getFullYear() &&
        completedAt.getMonth() ===
        month.getMonth()
    );
}

function getCompletedTimestamp(
    workout: WorkoutSummary
): number {
    if (
        workout.endedAtUtc === null
    ) {
        return 0;
    }

    return new Date(
        workout.endedAtUtc
    ).getTime();
}

function startOfMonth(
    value: Date
): Date {
    return new Date(
        value.getFullYear(),
        value.getMonth(),
        1
    );
}

function moveMonth(
    value: Date,
    amount: number
): Date {
    return new Date(
        value.getFullYear(),
        value.getMonth() +
        amount,
        1
    );
}

function formatMonth(
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

export default WorkoutHistoryPage;
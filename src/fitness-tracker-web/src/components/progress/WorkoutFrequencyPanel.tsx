import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import {
    getWorkoutFrequencySummaries,
} from '../../services/api';

import type {
    ProgressAggregateView,
} from '../../types/progressDashboard';

import type {
    WorkoutSummary,
} from '../../types/workout';

import type {
    WorkoutFrequencyBucket,
} from '../../types/workoutFrequency';

import {
    buildWorkoutFrequencyAnalytics,
} from '../../utils/workoutFrequency';

import '../../styles/workoutFrequency.css';

interface WorkoutFrequencyPanelProps {
    view:
    ProgressAggregateView;

    now:
    Date;
}

function WorkoutFrequencyPanel({
    view,
    now,
}: WorkoutFrequencyPanelProps) {
    const [
        workouts,
        setWorkouts,
    ] =
        useState<
            WorkoutSummary[]
        >([]);

    const [
        isLoading,
        setIsLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );

    const [
        reloadVersion,
        setReloadVersion,
    ] =
        useState(0);

    useEffect(() => {
        const controller =
            new AbortController();

        async function loadWorkouts() {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getWorkoutFrequencySummaries(
                        controller.signal
                    );

                setWorkouts(
                    response
                );
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
                        'Unable to load Workout frequency.'
                    )
                );
            } finally {
                if (
                    !controller
                        .signal
                        .aborted
                ) {
                    setIsLoading(false);
                }
            }
        }

        void loadWorkouts();

        return () => {
            controller.abort();
        };
    }, [reloadVersion]);

    const analytics =
        useMemo(
            () =>
                buildWorkoutFrequencyAnalytics(
                    workouts,
                    now
                ),
            [
                workouts,
                now,
            ]
        );

    const selectedBuckets =
        view === 'Weeks'
            ? analytics.weeklyBuckets
            : analytics.monthlyBuckets;

    const selectedWorkoutCount =
        selectedBuckets.reduce(
            (
                total,
                bucket
            ) =>
                total +
                bucket.workoutCount,
            0
        );

    const maximumWorkoutCount =
        Math.max(
            1,
            ...selectedBuckets.map(
                (bucket) =>
                    bucket.workoutCount
            )
        );

    function handleRetry() {
        setReloadVersion(
            (value) =>
                value + 1
        );
    }

    return (
        <section
            id="workout-frequency"
            className="workout-frequency"
            aria-labelledby="workout-frequency-title"
        >
            <header className="workout-frequency__header">
                <div>
                    <p className="progress-hub-card__eyebrow">
                        Training Consistency
                    </p>

                    <h2 id="workout-frequency-title">
                        Workout Frequency
                    </h2>

                    <p>
                        See how often completed
                        training sessions occur
                        across recent weeks and
                        months.
                    </p>
                </div>

                {!isLoading &&
                    !error && (
                        <span className="workout-frequency__completed-count">
                            {
                                analytics
                                    .completedWorkoutCount
                            }{' '}
                            completed
                        </span>
                    )}
            </header>

            {isLoading && (
                <div
                    className="workout-frequency__state"
                    aria-live="polite"
                >
                    <strong>
                        Loading Workout frequency...
                    </strong>

                    <span>
                        Reviewing completed
                        Workout history.
                    </span>
                </div>
            )}

            {!isLoading &&
                error && (
                    <div
                        className="workout-frequency__state workout-frequency__state--error"
                        role="alert"
                    >
                        <strong>
                            Workout frequency
                            couldn't be loaded
                        </strong>

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            className="progress-hub-secondary-action"
                            onClick={
                                handleRetry
                            }
                        >
                            Try Again
                        </button>
                    </div>
                )}

            {!isLoading &&
                !error &&
                analytics
                    .completedWorkoutCount ===
                0 && (
                    <div className="workout-frequency__empty">
                        <strong>
                            No completed Workouts yet
                        </strong>

                        <p>
                            Complete a Workout to
                            begin building your
                            training-frequency
                            history.
                        </p>

                        <Link
                            to="/workouts"
                            className="progress-hub-secondary-action"
                        >
                            Open Workouts
                        </Link>
                    </div>
                )}

            {!isLoading &&
                !error &&
                analytics
                    .completedWorkoutCount >
                0 && (
                    <>
                        <div className="workout-frequency-summary">
                            <article className="workout-frequency-summary-card">
                                <span>
                                    This Week
                                </span>

                                <strong>
                                    {
                                        analytics
                                            .currentWeekCount
                                    }
                                </strong>

                                <small>
                                    Completed Workouts
                                </small>
                            </article>

                            <article className="workout-frequency-summary-card">
                                <span>
                                    This Month
                                </span>

                                <strong>
                                    {
                                        analytics
                                            .currentMonthCount
                                    }
                                </strong>

                                <small>
                                    Completed Workouts
                                </small>
                            </article>

                            <article className="workout-frequency-summary-card">
                                <span>
                                    Training Days
                                </span>

                                <strong>
                                    {
                                        analytics
                                            .currentMonthTrainingDays
                                    }
                                </strong>

                                <small>
                                    Distinct days this
                                    month
                                </small>
                            </article>

                            <article className="workout-frequency-summary-card">
                                <span>
                                    8-Week Average
                                </span>

                                <strong>
                                    {formatDecimal(
                                        analytics
                                            .averageWorkoutsPerWeek
                                    )}
                                </strong>

                                <small>
                                    Workouts per week
                                </small>
                            </article>
                        </div>

                        <div className="workout-frequency-chart-shell">
                            <div className="workout-frequency-chart__header">
                                <div>
                                    <strong>
                                        {view ===
                                            'Weeks'
                                            ? 'Weekly Frequency'
                                            : 'Monthly Frequency'}
                                    </strong>

                                    <span>
                                        {view ===
                                            'Weeks'
                                            ? 'Last 8 weeks'
                                            : 'Last 6 months'}
                                    </span>
                                </div>

                                <span>
                                    Shared Progress period
                                </span>
                            </div>

                            {selectedWorkoutCount >
                                0 ? (
                                <div
                                    className="workout-frequency-chart"
                                    style={{
                                        gridTemplateColumns:
                                            `repeat(${selectedBuckets.length}, minmax(54px, 1fr))`,
                                    }}
                                    role="img"
                                    aria-label={
                                        view ===
                                            'Weeks'
                                            ? 'Completed Workouts across the last eight weeks'
                                            : 'Completed Workouts across the last six months'
                                    }
                                >
                                    {selectedBuckets.map(
                                        (
                                            bucket
                                        ) => (
                                            <FrequencyBar
                                                key={
                                                    bucket.key
                                                }
                                                bucket={
                                                    bucket
                                                }
                                                maximumWorkoutCount={
                                                    maximumWorkoutCount
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="workout-frequency-chart__empty">
                                    <strong>
                                        No completed
                                        Workouts in this
                                        period
                                    </strong>

                                    <span>
                                        Historical
                                        Workouts outside
                                        the displayed
                                        range remain
                                        unchanged.
                                    </span>
                                </div>
                            )}

                            <p className="workout-frequency-chart__hint">
                                {view ===
                                    'Weeks'
                                    ? 'Weeks start Monday. The current week is a partial period.'
                                    : 'The current month is a partial period.'}
                            </p>
                        </div>

                        <details className="workout-frequency-data">
                            <summary>
                                View frequency data
                            </summary>

                            <div className="workout-frequency-table-scroll">
                                <table className="workout-frequency-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                Period
                                            </th>

                                            <th scope="col">
                                                Workouts
                                            </th>

                                            <th scope="col">
                                                Training Days
                                            </th>

                                            <th scope="col">
                                                Strength
                                            </th>

                                            <th scope="col">
                                                Cardio
                                            </th>

                                            <th scope="col">
                                                Mixed
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedBuckets.map(
                                            (
                                                bucket
                                            ) => (
                                                <tr
                                                    key={
                                                        `table-${bucket.key}`
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            bucket.label
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            bucket
                                                                .workoutCount
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            bucket
                                                                .trainingDays
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            bucket
                                                                .strengthCount
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            bucket
                                                                .cardioCount
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            bucket
                                                                .mixedCount
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </>
                )}
        </section>
    );
}

interface FrequencyBarProps {
    bucket:
    WorkoutFrequencyBucket;

    maximumWorkoutCount:
    number;
}

function FrequencyBar({
    bucket,
    maximumWorkoutCount,
}: FrequencyBarProps) {
    const heightPercentage =
        (
            bucket.workoutCount /
            maximumWorkoutCount
        ) * 100;

    const accessibilityLabel =
        `${bucket.label}: ` +
        `${bucket.workoutCount} ` +
        `${bucket.workoutCount === 1
            ? 'Workout'
            : 'Workouts'
        } across ` +
        `${bucket.trainingDays} ` +
        `${bucket.trainingDays === 1
            ? 'training day'
            : 'training days'
        }.`;

    return (
        <div
            className="workout-frequency-bar-column"
            aria-label={
                accessibilityLabel
            }
        >
            <div className="workout-frequency-bar-area">
                <span className="workout-frequency-bar__count">
                    {bucket.workoutCount}
                </span>

                {bucket.workoutCount >
                    0 ? (
                    <div
                        className="workout-frequency-bar"
                        style={{
                            height:
                                `${heightPercentage}%`,

                            minHeight:
                                '8px',
                        }}
                        aria-hidden="true"
                    />
                ) : (
                    <div
                        className="workout-frequency-bar__zero"
                        aria-hidden="true"
                    />
                )}
            </div>

            <span className="workout-frequency-bar__label">
                {bucket.shortLabel}
            </span>
        </div>
    );
}

function formatDecimal(
    value: number
): string {
    return new Intl.NumberFormat(
        undefined,
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
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

export default WorkoutFrequencyPanel;
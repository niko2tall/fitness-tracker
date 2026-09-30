import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    getCardioSummary,
} from '../../services/api';

import type {
    CardioSummaryBucket,
    CardioSummaryMetric,
    CardioSummaryResponse,
} from '../../types/cardioSummary';

import type {
    ProgressAggregateView,
} from '../../types/progressDashboard';

import {
    buildCardioSummaryAnalytics,
    formatAveragePace,
    formatCardioDuration,
    formatDistance,
} from '../../utils/cardioSummary';

import '../../styles/cardioSummary.css';

interface CardioSummaryPanelProps {
    view:
    ProgressAggregateView;

    now:
    Date;
}

function CardioSummaryPanel({
    view,
    now,
}: CardioSummaryPanelProps) {
    const [
        response,
        setResponse,
    ] =
        useState<
            CardioSummaryResponse | null
        >(null);

    const [
        metric,
        setMetric,
    ] =
        useState<
            CardioSummaryMetric
        >('Distance');

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

        async function loadCardio() {
            try {
                setIsLoading(true);
                setError(null);

                const result =
                    await getCardioSummary(
                        controller.signal
                    );

                setResponse(
                    result
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
                        'Unable to load cardio progress.'
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

        void loadCardio();

        return () => {
            controller.abort();
        };
    }, [reloadVersion]);

    const analytics =
        useMemo(
            () =>
                buildCardioSummaryAnalytics(
                    response?.workouts ??
                    [],
                    now
                ),
            [
                response,
                now,
            ]
        );

    const selectedBuckets =
        view === 'Weeks'
            ? analytics.weeklyBuckets
            : analytics.monthlyBuckets;

    const selectedMaximum =
        Math.max(
            1,
            ...selectedBuckets.map(
                (bucket) =>
                    getMetricValue(
                        bucket,
                        metric
                    )
            )
        );

    const selectedTotal =
        selectedBuckets.reduce(
            (
                total,
                bucket
            ) =>
                total +
                getMetricValue(
                    bucket,
                    metric
                ),
            0
        );

    function handleRetry() {
        setReloadVersion(
            (value) =>
                value + 1
        );
    }

    return (
        <section
            id="cardio-progress"
            className="cardio-summary"
            aria-labelledby="cardio-summary-title"
        >
            <header className="cardio-summary__header">
                <div>
                    <p className="progress-hub-card__eyebrow">
                        Cardio Training
                    </p>

                    <h2 id="cardio-summary-title">
                        Cardio Progress
                    </h2>

                    <p>
                        Review completed cardio
                        distance, duration,
                        session frequency,
                        average pace, and
                        longest-distance sessions.
                    </p>
                </div>

                {!isLoading &&
                    !error &&
                    response && (
                        <span className="cardio-summary__session-count">
                            {
                                response
                                    .workouts
                                    .length
                            }{' '}
                            cardio{' '}
                            {response
                                .workouts
                                .length === 1
                                ? 'session'
                                : 'sessions'}
                        </span>
                    )}
            </header>

            {isLoading && (
                <div
                    className="cardio-summary__state"
                    aria-live="polite"
                >
                    <strong>
                        Loading cardio progress...
                    </strong>

                    <span>
                        Reviewing completed cardio
                        training history.
                    </span>
                </div>
            )}

            {!isLoading &&
                error && (
                    <div
                        className="cardio-summary__state cardio-summary__state--error"
                        role="alert"
                    >
                        <strong>
                            Cardio progress couldn't
                            be loaded
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
                response &&
                response.workouts
                    .length === 0 && (
                    <div className="cardio-summary__empty">
                        <strong>
                            No completed cardio
                            training yet
                        </strong>

                        <p>
                            Complete a Workout with
                            a Cardio Exercise to
                            begin building cardio
                            progress analytics.
                        </p>
                    </div>
                )}

            {!isLoading &&
                !error &&
                response &&
                response.workouts
                    .length > 0 && (
                    <>
                        <div className="cardio-summary-cards">
                            <article className="cardio-summary-card">
                                <span>
                                    This Week Distance
                                </span>

                                <strong>
                                    {formatDistance(
                                        analytics
                                            .currentWeekDistanceMeters
                                    )}
                                </strong>

                                <small>
                                    Completed cardio
                                </small>
                            </article>

                            <article className="cardio-summary-card">
                                <span>
                                    This Month Distance
                                </span>

                                <strong>
                                    {formatDistance(
                                        analytics
                                            .currentMonthDistanceMeters
                                    )}
                                </strong>

                                <small>
                                    Completed cardio
                                </small>
                            </article>

                            <article className="cardio-summary-card">
                                <span>
                                    This Month Duration
                                </span>

                                <strong>
                                    {formatCardioDuration(
                                        analytics
                                            .currentMonthDurationSeconds
                                    )}
                                </strong>

                                <small>
                                    Total cardio time
                                </small>
                            </article>

                            <article className="cardio-summary-card">
                                <span>
                                    Cardio Sessions
                                </span>

                                <strong>
                                    {
                                        analytics
                                            .currentMonthSessionCount
                                    }
                                </strong>

                                <small>
                                    This month
                                </small>
                            </article>

                            <article className="cardio-summary-card">
                                <span>
                                    Average Pace
                                </span>

                                <strong>
                                    {formatAveragePace(
                                        analytics
                                            .currentMonthAveragePaceSecondsPerKilometer
                                    )}
                                </strong>

                                <small>
                                    Distance-bearing
                                    cardio this month
                                </small>
                            </article>

                            <article className="cardio-summary-card">
                                <span>
                                    Longest Session
                                </span>

                                <strong>
                                    {analytics
                                        .longestDistanceSession
                                        ? formatDistance(
                                            analytics
                                                .longestDistanceSession
                                                .distanceMeters
                                        )
                                        : '—'}
                                </strong>

                                <small>
                                    {analytics
                                        .longestDistanceSession
                                        ?.workoutName ??
                                        'No distance history'}
                                </small>
                            </article>
                        </div>

                        <div className="cardio-summary-chart-shell">
                            <div className="cardio-summary-chart__header">
                                <div>
                                    <strong>
                                        {metric ===
                                            'Distance'
                                            ? 'Cardio Distance'
                                            : 'Cardio Duration'}
                                    </strong>

                                    <span>
                                        {view ===
                                            'Weeks'
                                            ? 'Last 8 weeks'
                                            : 'Last 6 months'}
                                    </span>
                                </div>

                                <div className="cardio-summary-chart__controls">
                                    <div
                                        className="cardio-summary-toggle"
                                        role="group"
                                        aria-label="Cardio metric"
                                    >
                                        <button
                                            type="button"
                                            className={
                                                metric ===
                                                    'Distance'
                                                    ? 'cardio-summary-toggle__button cardio-summary-toggle__button--active'
                                                    : 'cardio-summary-toggle__button'
                                            }
                                            aria-pressed={
                                                metric ===
                                                'Distance'
                                            }
                                            onClick={() =>
                                                setMetric(
                                                    'Distance'
                                                )
                                            }
                                        >
                                            Distance
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                metric ===
                                                    'Duration'
                                                    ? 'cardio-summary-toggle__button cardio-summary-toggle__button--active'
                                                    : 'cardio-summary-toggle__button'
                                            }
                                            aria-pressed={
                                                metric ===
                                                'Duration'
                                            }
                                            onClick={() =>
                                                setMetric(
                                                    'Duration'
                                                )
                                            }
                                        >
                                            Duration
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {selectedTotal >
                                0 ? (
                                <div className="cardio-summary-chart-scroll">
                                    <div
                                        className="cardio-summary-chart"
                                        style={{
                                            gridTemplateColumns:
                                                `repeat(${selectedBuckets.length}, minmax(64px, 1fr))`,
                                        }}
                                        role="img"
                                        aria-label={
                                            `${metric} across ` +
                                            `${view ===
                                                'Weeks'
                                                ? 'the last eight weeks'
                                                : 'the last six months'
                                            }`
                                        }
                                    >
                                        {selectedBuckets.map(
                                            (
                                                bucket
                                            ) => (
                                                <CardioBar
                                                    key={
                                                        bucket.key
                                                    }
                                                    bucket={
                                                        bucket
                                                    }
                                                    metric={
                                                        metric
                                                    }
                                                    maximumValue={
                                                        selectedMaximum
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="cardio-summary-chart__empty">
                                    <strong>
                                        No {metric.toLowerCase()}
                                        {' '}data in this
                                        period
                                    </strong>

                                    <span>
                                        Try the other metric
                                        or shared Progress
                                        period.
                                    </span>
                                </div>
                            )}

                            <p className="cardio-summary-chart__hint">
                                {view ===
                                    'Weeks'
                                    ? 'Weeks start Monday. The current week is a partial period.'
                                    : 'The current month is a partial period.'}
                            </p>
                        </div>

                        <details className="cardio-summary-data">
                            <summary>
                                View cardio data
                            </summary>

                            <div className="cardio-summary-table-scroll">
                                <table className="cardio-summary-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                Period
                                            </th>

                                            <th scope="col">
                                                Distance
                                            </th>

                                            <th scope="col">
                                                Duration
                                            </th>

                                            <th scope="col">
                                                Sessions
                                            </th>

                                            <th scope="col">
                                                Avg Pace
                                            </th>

                                            <th scope="col">
                                                Longest Session
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
                                                        {formatDistance(
                                                            bucket
                                                                .distanceMeters
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCardioDuration(
                                                            bucket
                                                                .durationSeconds
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            bucket
                                                                .sessionCount
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatAveragePace(
                                                            bucket
                                                                .averagePaceSecondsPerKilometer
                                                        )}
                                                    </td>

                                                    <td>
                                                        {bucket
                                                            .longestSessionName
                                                            ? (
                                                                <>
                                                                    {
                                                                        bucket
                                                                            .longestSessionName
                                                                    }

                                                                    {' — '}

                                                                    {formatDistance(
                                                                        bucket
                                                                            .longestSessionDistanceMeters
                                                                    )}
                                                                </>
                                                            )
                                                            : '—'}
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

interface CardioBarProps {
    bucket:
    CardioSummaryBucket;

    metric:
    CardioSummaryMetric;

    maximumValue:
    number;
}

function CardioBar({
    bucket,
    metric,
    maximumValue,
}: CardioBarProps) {
    const value =
        getMetricValue(
            bucket,
            metric
        );

    const heightPercentage =
        (
            value /
            maximumValue
        ) * 100;

    return (
        <div className="cardio-summary-bar-column">
            <div className="cardio-summary-bar-area">
                <span className="cardio-summary-bar__count">
                    {metric ===
                        'Distance'
                        ? formatCompactDistance(
                            value
                        )
                        : formatCardioDuration(
                            value
                        )}
                </span>

                {value > 0 ? (
                    <div
                        className="cardio-summary-bar"
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
                        className="cardio-summary-bar__zero"
                        aria-hidden="true"
                    />
                )}
            </div>

            <span className="cardio-summary-bar__label">
                {bucket.shortLabel}
            </span>
        </div>
    );
}

function getMetricValue(
    bucket:
        CardioSummaryBucket,
    metric:
        CardioSummaryMetric
): number {
    return metric ===
        'Distance'
        ? bucket.distanceMeters
        : bucket.durationSeconds;
}

function formatCompactDistance(
    meters: number
): string {
    const kilometers =
        meters /
        1000;

    return (
        `${new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits: 1,
            }
        ).format(kilometers)} km`
    );
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

export default CardioSummaryPanel;
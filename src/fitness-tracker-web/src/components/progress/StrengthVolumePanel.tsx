import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    getStrengthVolume,
} from '../../services/api';

import type {
    StrengthVolumeResponse,
    StrengthVolumeView,
    StrengthVolumeBucket,
} from '../../types/strengthVolume';

import {
    buildStrengthVolumeAnalytics,
    formatVolumeLoad,
} from '../../utils/strengthVolume';

import '../../styles/strengthVolume.css';

function StrengthVolumePanel() {
    const [
        response,
        setResponse,
    ] =
        useState<
            StrengthVolumeResponse | null
        >(null);

    const [
        view,
        setView,
    ] =
        useState<
            StrengthVolumeView
        >('Weeks');

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

        async function loadVolume() {
            try {
                setIsLoading(true);
                setError(null);

                const result =
                    await getStrengthVolume(
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
                        'Unable to load strength volume.'
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

        void loadVolume();

        return () => {
            controller.abort();
        };
    }, [reloadVersion]);

    const analytics =
        useMemo(
            () =>
                buildStrengthVolumeAnalytics(
                    response?.workouts ??
                    []
                ),
            [response]
        );

    const selectedBuckets =
        view === 'Weeks'
            ? analytics.weeklyBuckets
            : analytics.monthlyBuckets;

    const selectedVolume =
        selectedBuckets.reduce(
            (
                total,
                bucket
            ) =>
                total +
                bucket.volumeLoadKg,
            0
        );

    const maximumVolume =
        Math.max(
            1,
            ...selectedBuckets.map(
                (bucket) =>
                    bucket.volumeLoadKg
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
            className="strength-volume"
            aria-labelledby="strength-volume-title"
        >
            <header className="strength-volume__header">
                <div>
                    <p className="progress-hub-card__eyebrow">
                        Strength Workload
                    </p>

                    <h2 id="strength-volume-title">
                        Strength Volume Load
                    </h2>

                    <p>
                        Track completed external
                        load across weighted
                        strength Sets using
                        weight × repetitions.
                    </p>
                </div>

                {!isLoading &&
                    !error &&
                    response && (
                        <span className="strength-volume__workout-count">
                            {
                                response
                                    .workouts
                                    .length
                            }{' '}
                            volume{' '}
                            {response
                                .workouts
                                .length === 1
                                ? 'Workout'
                                : 'Workouts'}
                        </span>
                    )}
            </header>

            {isLoading && (
                <div
                    className="strength-volume__state"
                    aria-live="polite"
                >
                    <strong>
                        Loading strength volume...
                    </strong>

                    <span>
                        Calculating finalized
                        weighted Set history.
                    </span>
                </div>
            )}

            {!isLoading &&
                error && (
                    <div
                        className="strength-volume__state strength-volume__state--error"
                        role="alert"
                    >
                        <strong>
                            Strength volume
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
                response &&
                response.workouts
                    .length === 0 && (
                    <div className="strength-volume__empty">
                        <strong>
                            No weighted strength
                            volume yet
                        </strong>

                        <p>
                            Complete a Workout
                            containing positive-weight
                            Weight + Reps Sets to
                            begin building volume-load
                            history.
                        </p>
                    </div>
                )}

            {!isLoading &&
                !error &&
                response &&
                response.workouts
                    .length > 0 && (
                    <>
                        <div className="strength-volume-summary">
                            <article className="strength-volume-summary-card">
                                <span>
                                    This Week
                                </span>

                                <strong>
                                    {formatVolumeLoad(
                                        analytics
                                            .currentWeekVolumeLoadKg
                                    )}
                                </strong>

                                <small>
                                    Completed volume load
                                </small>
                            </article>

                            <article className="strength-volume-summary-card">
                                <span>
                                    This Month
                                </span>

                                <strong>
                                    {formatVolumeLoad(
                                        analytics
                                            .currentMonthVolumeLoadKg
                                    )}
                                </strong>

                                <small>
                                    Completed volume load
                                </small>
                            </article>

                            <article className="strength-volume-summary-card">
                                <span>
                                    Volume Sets
                                </span>

                                <strong>
                                    {
                                        analytics
                                            .currentMonthVolumeSetCount
                                    }
                                </strong>

                                <small>
                                    Eligible Sets this month
                                </small>
                            </article>

                            <article className="strength-volume-summary-card">
                                <span>
                                    8-Week Average
                                </span>

                                <strong>
                                    {formatVolumeLoad(
                                        analytics
                                            .averageWeeklyVolumeLoadKg
                                    )}
                                </strong>

                                <small>
                                    Volume load per week
                                </small>
                            </article>
                        </div>

                        <div className="strength-volume-chart-shell">
                            <div className="strength-volume-chart__header">
                                <div>
                                    <strong>
                                        {view ===
                                            'Weeks'
                                            ? 'Weekly Volume Load'
                                            : 'Monthly Volume Load'}
                                    </strong>

                                    <span>
                                        {view ===
                                            'Weeks'
                                            ? 'Last 8 weeks'
                                            : 'Last 6 months'}
                                    </span>
                                </div>

                                <div
                                    className="strength-volume-view-toggle"
                                    role="group"
                                    aria-label="Strength volume period"
                                >
                                    <button
                                        type="button"
                                        className={
                                            view ===
                                                'Weeks'
                                                ? 'strength-volume-view-button strength-volume-view-button--active'
                                                : 'strength-volume-view-button'
                                        }
                                        aria-pressed={
                                            view ===
                                            'Weeks'
                                        }
                                        onClick={() =>
                                            setView(
                                                'Weeks'
                                            )
                                        }
                                    >
                                        Weeks
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            view ===
                                                'Months'
                                                ? 'strength-volume-view-button strength-volume-view-button--active'
                                                : 'strength-volume-view-button'
                                        }
                                        aria-pressed={
                                            view ===
                                            'Months'
                                        }
                                        onClick={() =>
                                            setView(
                                                'Months'
                                            )
                                        }
                                    >
                                        Months
                                    </button>
                                </div>
                            </div>

                            {selectedVolume >
                                0 ? (
                                <div className="strength-volume-chart-scroll">
                                    <div
                                        className="strength-volume-chart"
                                        style={{
                                            gridTemplateColumns:
                                                `repeat(${selectedBuckets.length}, minmax(64px, 1fr))`,
                                        }}
                                        role="img"
                                        aria-label={
                                            view ===
                                                'Weeks'
                                                ? 'Strength volume load across the last eight weeks'
                                                : 'Strength volume load across the last six months'
                                        }
                                    >
                                        {selectedBuckets.map(
                                            (
                                                bucket
                                            ) => (
                                                <VolumeBar
                                                    key={
                                                        bucket.key
                                                    }
                                                    bucket={
                                                        bucket
                                                    }
                                                    maximumVolume={
                                                        maximumVolume
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="strength-volume-chart__empty">
                                    <strong>
                                        No strength volume
                                        in this period
                                    </strong>

                                    <span>
                                        Older volume history
                                        outside this range
                                        remains unchanged.
                                    </span>
                                </div>
                            )}

                            <p className="strength-volume-chart__hint">
                                {view ===
                                    'Weeks'
                                    ? 'Weeks start Monday. The current week is a partial period.'
                                    : 'The current month is a partial period.'}
                            </p>
                        </div>

                        <details className="strength-volume-data">
                            <summary>
                                View volume data
                            </summary>

                            <div className="strength-volume-table-scroll">
                                <table className="strength-volume-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                Period
                                            </th>

                                            <th scope="col">
                                                Volume Load
                                            </th>

                                            <th scope="col">
                                                Workouts
                                            </th>

                                            <th scope="col">
                                                Volume Sets
                                            </th>

                                            <th scope="col">
                                                Top Exercise
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
                                                        {formatVolumeLoad(
                                                            bucket
                                                                .volumeLoadKg
                                                        )}
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
                                                                .volumeSetCount
                                                        }
                                                    </td>

                                                    <td>
                                                        {bucket
                                                            .topExerciseName
                                                            ? (
                                                                <>
                                                                    {
                                                                        bucket
                                                                            .topExerciseName
                                                                    }

                                                                    {' — '}

                                                                    {formatVolumeLoad(
                                                                        bucket
                                                                            .topExerciseVolumeLoadKg
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

interface VolumeBarProps {
    bucket:
    StrengthVolumeBucket;

    maximumVolume:
    number;
}

function VolumeBar({
    bucket,
    maximumVolume,
}: VolumeBarProps) {
    const heightPercentage =
        (
            bucket.volumeLoadKg /
            maximumVolume
        ) * 100;

    const label =
        `${bucket.label}: ` +
        `${formatVolumeLoad(
            bucket.volumeLoadKg
        )} across ` +
        `${bucket.workoutCount} ` +
        `${bucket.workoutCount === 1
            ? 'Workout'
            : 'Workouts'
        } and ` +
        `${bucket.volumeSetCount} ` +
        `${bucket.volumeSetCount === 1
            ? 'Set'
            : 'Sets'
        }.`;

    return (
        <div
            className="strength-volume-bar-column"
            aria-label={label}
        >
            <div className="strength-volume-bar-area">
                <span className="strength-volume-bar__count">
                    {formatCompactVolume(
                        bucket.volumeLoadKg
                    )}
                </span>

                {bucket.volumeLoadKg >
                    0 ? (
                    <div
                        className="strength-volume-bar"
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
                        className="strength-volume-bar__zero"
                        aria-hidden="true"
                    />
                )}
            </div>

            <span className="strength-volume-bar__label">
                {bucket.shortLabel}
            </span>
        </div>
    );
}

function formatCompactVolume(
    value: number
): string {
    if (
        value >= 1000000
    ) {
        return (
            `${formatCompactNumber(
                value / 1000000
            )}M`
        );
    }

    if (
        value >= 1000
    ) {
        return (
            `${formatCompactNumber(
                value / 1000
            )}k`
        );
    }

    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 0,
        }
    ).format(value);
}

function formatCompactNumber(
    value: number
): string {
    return new Intl.NumberFormat(
        undefined,
        {
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

export default StrengthVolumePanel;
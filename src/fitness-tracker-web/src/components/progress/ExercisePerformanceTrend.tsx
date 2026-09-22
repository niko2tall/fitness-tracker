import {
    useMemo,
    useState,
} from 'react';

import {
    Link,
} from 'react-router-dom';

import type {
    ExerciseHistoryResponse,
} from '../../types/progress';

import {
    buildExerciseTrendSeries,
    formatExerciseTrendAxisValue,
    formatExerciseTrendChange,
    formatExerciseTrendValue,
    getAvailableExerciseTrendMetrics,
    getExerciseTrendMetricLabel,
    type ExerciseTrendDirection,
    type ExerciseTrendMetric,
    type ExerciseTrendPoint,
} from '../../utils/exerciseTrends';

interface ExercisePerformanceTrendProps {
    history: ExerciseHistoryResponse;
}

interface ChartPoint
    extends ExerciseTrendPoint {
    x: number;
    y: number;
}

function ExercisePerformanceTrend({
    history,
}: ExercisePerformanceTrendProps) {
    const availableMetrics =
        useMemo(
            () =>
                getAvailableExerciseTrendMetrics(
                    history.trackingType
                ),
            [history.trackingType]
        );

    const [
        requestedMetric,
        setRequestedMetric,
    ] =
        useState<ExerciseTrendMetric>(
            () =>
                availableMetrics[0] ??
                'MostReps'
        );

    const selectedMetric =
        availableMetrics.includes(
            requestedMetric
        )
            ? requestedMetric
            : availableMetrics[0];

    const series =
        useMemo(
            () =>
                selectedMetric
                    ? buildExerciseTrendSeries(
                        history,
                        selectedMetric
                    )
                    : null,
            [
                history,
                selectedMetric,
            ]
        );

    if (
        !selectedMetric ||
        !series
    ) {
        return null;
    }

    const chart =
        createChartGeometry(
            series.points,
            series.direction
        );

    return (
        <section
            className="exercise-trend-section"
            aria-labelledby="exercise-trend-title"
        >
            <header className="workout-section__header">
                <div>
                    <p className="workout-section__eyebrow">
                        {getProgressEyebrow(
                            history.trackingType
                        )}
                    </p>

                    <h2 id="exercise-trend-title">
                        Performance Trend
                    </h2>
                </div>

                <span className="workout-section__count">
                    {series.points.length}
                </span>
            </header>

            <p className="exercise-trend-section__description">
                Each point represents the best
                finalized Set for the selected
                metric in one completed Workout.
            </p>

            {availableMetrics.length >
                1 && (
                    <div
                        className="exercise-trend-metric-selector"
                        aria-label="Progress trend metric"
                    >
                        {availableMetrics.map(
                            (metric) => (
                                <button
                                    key={metric}
                                    type="button"
                                    className={
                                        selectedMetric ===
                                            metric
                                            ? 'exercise-trend-metric-button exercise-trend-metric-button--active'
                                            : 'exercise-trend-metric-button'
                                    }
                                    aria-pressed={
                                        selectedMetric ===
                                        metric
                                    }
                                    onClick={() =>
                                        setRequestedMetric(
                                            metric
                                        )
                                    }
                                >
                                    {getExerciseTrendMetricLabel(
                                        metric
                                    )}
                                </button>
                            )
                        )}
                    </div>
                )}

            <div className="exercise-trend-summary">
                <article className="exercise-trend-summary-card">
                    <span>
                        Earliest
                    </span>

                    <strong>
                        {formatExerciseTrendValue(
                            series.metric,
                            series
                                .earliestPoint
                                .value
                        )}
                    </strong>

                    <small>
                        {formatShortDate(
                            series
                                .earliestPoint
                                .achievedAtUtc
                        )}
                    </small>
                </article>

                <article className="exercise-trend-summary-card">
                    <span>
                        Latest
                    </span>

                    <strong>
                        {formatExerciseTrendValue(
                            series.metric,
                            series
                                .latestPoint
                                .value
                        )}
                    </strong>

                    <small>
                        {formatShortDate(
                            series
                                .latestPoint
                                .achievedAtUtc
                        )}
                    </small>
                </article>

                <article className="exercise-trend-summary-card">
                    <span>
                        Best
                    </span>

                    <strong>
                        {formatExerciseTrendValue(
                            series.metric,
                            series
                                .bestPoint
                                .value
                        )}
                    </strong>

                    <small>
                        {
                            series
                                .bestPoint
                                .workoutName
                        }
                    </small>
                </article>

                <article className="exercise-trend-summary-card">
                    <span>
                        Change
                    </span>

                    <strong>
                        {formatExerciseTrendChange(
                            series.metric,
                            series.absoluteChange
                        )}
                    </strong>

                    <small>
                        {formatPercentageChange(
                            series.percentageChange,
                            series.direction
                        )}
                    </small>
                </article>
            </div>

            <div className="exercise-trend-chart-shell">
                <div className="exercise-trend-chart__header">
                    <div>
                        <strong>
                            {series.label}
                        </strong>

                        <span>
                            {series.points.length === 1
                                ? '1 completed session'
                                : `${series.points.length} completed sessions`}
                        </span>
                    </div>

                    <span>
                        {series.unit}
                    </span>
                </div>

                <div className="exercise-trend-chart-scroll">
                    <svg
                        className="exercise-trend-chart"
                        viewBox="0 0 760 320"
                        role="img"
                        aria-label={`${series.label} progress chart for ${history.exerciseName}`}
                    >
                        {chart.yTicks.map(
                            (
                                tick,
                                index
                            ) => (
                                <g
                                    key={
                                        `${tick.value}-${index}`
                                    }
                                >
                                    <line
                                        className="exercise-trend-chart__grid-line"
                                        x1={
                                            chart.plotLeft
                                        }
                                        y1={tick.y}
                                        x2={
                                            chart.plotRight
                                        }
                                        y2={tick.y}
                                    />

                                    <text
                                        className="exercise-trend-chart__axis-label"
                                        x={
                                            chart.plotLeft -
                                            10
                                        }
                                        y={
                                            tick.y + 4
                                        }
                                        textAnchor="end"
                                    >
                                        {formatExerciseTrendAxisValue(
                                            series.metric,
                                            tick.value
                                        )}
                                    </text>
                                </g>
                            )
                        )}

                        <line
                            className="exercise-trend-chart__axis"
                            x1={chart.plotLeft}
                            y1={chart.plotBottom}
                            x2={chart.plotRight}
                            y2={chart.plotBottom}
                        />

                        <line
                            className="exercise-trend-chart__axis"
                            x1={chart.plotLeft}
                            y1={chart.plotTop}
                            x2={chart.plotLeft}
                            y2={chart.plotBottom}
                        />

                        {chart.points.length >
                            1 && (
                                <polyline
                                    className="exercise-trend-chart__line"
                                    points={chart.points
                                        .map(
                                            (point) =>
                                                `${point.x},${point.y}`
                                        )
                                        .join(' ')}
                                />
                            )}

                        {chart.points.map(
                            (point) => (
                                <circle
                                    key={
                                        `${point.workoutId}-${point.setNumber}`
                                    }
                                    className="exercise-trend-chart__point"
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    tabIndex={0}
                                >
                                    <title>
                                        {[
                                            point.workoutName,

                                            formatShortDate(
                                                point
                                                    .achievedAtUtc
                                            ),

                                            formatExerciseTrendValue(
                                                series.metric,
                                                point.value
                                            ),

                                            `Set ${point.setNumber} · ${point.setType}`,
                                        ].join(' — ')}
                                    </title>
                                </circle>
                            )
                        )}

                        {chart.firstDate && (
                            <text
                                className="exercise-trend-chart__date-label"
                                x={
                                    chart.plotLeft
                                }
                                y="302"
                                textAnchor="start"
                            >
                                {chart.firstDate}
                            </text>
                        )}

                        {chart.lastDate && (
                            <text
                                className="exercise-trend-chart__date-label"
                                x={
                                    chart.plotRight
                                }
                                y="302"
                                textAnchor="end"
                            >
                                {chart.lastDate}
                            </text>
                        )}
                    </svg>
                </div>

                <p className="exercise-trend-chart__hint">
                    Hover over or focus on chart
                    points to inspect the source
                    session. The table below
                    contains the same values.
                </p>
            </div>

            <details className="exercise-trend-data">
                <summary>
                    View chart data
                </summary>

                <div className="exercise-trend-table-scroll">
                    <table className="exercise-trend-table">
                        <thead>
                            <tr>
                                <th scope="col">
                                    Date
                                </th>

                                <th scope="col">
                                    Workout
                                </th>

                                <th scope="col">
                                    Set
                                </th>

                                <th scope="col">
                                    {series.label}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {series.points.map(
                                (point) => (
                                    <tr
                                        key={
                                            `table-${point.workoutId}-${point.setNumber}`
                                        }
                                    >
                                        <td>
                                            {formatShortDate(
                                                point
                                                    .achievedAtUtc
                                            )}
                                        </td>

                                        <td>
                                            <Link
                                                to={`/workouts/${point.workoutId}`}
                                                className="exercise-trend-table__link"
                                            >
                                                {
                                                    point
                                                        .workoutName
                                                }
                                            </Link>
                                        </td>

                                        <td>
                                            Set{' '}
                                            {
                                                point
                                                    .setNumber
                                            }
                                            {' · '}
                                            {
                                                point
                                                    .setType
                                            }
                                        </td>

                                        <td>
                                            {formatExerciseTrendValue(
                                                series.metric,
                                                point.value
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </details>
        </section>
    );
}

function createChartGeometry(
    points: ExerciseTrendPoint[],
    direction: ExerciseTrendDirection
) {
    const plotLeft = 70;
    const plotRight = 735;
    const plotTop = 24;
    const plotBottom = 270;

    const plotWidth =
        plotRight -
        plotLeft;

    const plotHeight =
        plotBottom -
        plotTop;

    const values =
        points.map(
            (point) =>
                point.value
        );

    const rawMinimum =
        Math.min(
            ...values
        );

    const rawMaximum =
        Math.max(
            ...values
        );

    const rawRange =
        rawMaximum -
        rawMinimum;

    const padding =
        rawRange > 0
            ? rawRange * 0.12
            : Math.max(
                rawMaximum *
                0.1,
                1
            );

    const minimum =
        Math.max(
            0,
            rawMinimum -
            padding
        );

    const maximum =
        rawMaximum +
        padding;

    const range =
        Math.max(
            maximum -
            minimum,
            1
        );

    const timestamps =
        points.map(
            (point) =>
                getTimestamp(
                    point.achievedAtUtc
                )
        );

    const firstTimestamp =
        Math.min(
            ...timestamps
        );

    const lastTimestamp =
        Math.max(
            ...timestamps
        );

    const timeRange =
        lastTimestamp -
        firstTimestamp;

    const chartPoints:
        ChartPoint[] =
        points.map(
            (
                point,
                index
            ) => {
                const timestamp =
                    getTimestamp(
                        point.achievedAtUtc
                    );

                const x =
                    points.length === 1
                        ? plotLeft +
                        plotWidth / 2
                        : timeRange > 0
                            ? plotLeft +
                            (
                                (
                                    timestamp -
                                    firstTimestamp
                                ) /
                                timeRange
                            ) *
                            plotWidth
                            : plotLeft +
                            (
                                index /
                                Math.max(
                                    points.length -
                                    1,
                                    1
                                )
                            ) *
                            plotWidth;

                const normalizedValue =
                    (
                        point.value -
                        minimum
                    ) /
                    range;

                const y =
                    direction === 'higher'
                        ? plotBottom -
                        normalizedValue *
                        plotHeight
                        : plotTop +
                        normalizedValue *
                        plotHeight;

                return {
                    ...point,
                    x,
                    y,
                };
            }
        );

    const yTickCount = 5;

    const yTicks =
        Array.from(
            {
                length:
                    yTickCount,
            },
            (
                _,
                index
            ) => {
                const ratio =
                    index /
                    (
                        yTickCount -
                        1
                    );

                const value =
                    direction === 'higher'
                        ? maximum -
                        ratio *
                        range
                        : minimum +
                        ratio *
                        range;

                const y =
                    plotTop +
                    ratio *
                    plotHeight;

                return {
                    value,
                    y,
                };
            }
        );

    return {
        plotLeft,
        plotRight,
        plotTop,
        plotBottom,

        points:
            chartPoints,

        yTicks,

        firstDate:
            points.length > 0
                ? formatAxisDate(
                    points[0]
                        .achievedAtUtc
                )
                : null,

        lastDate:
            points.length > 0
                ? formatAxisDate(
                    points[
                        points.length -
                        1
                    ].achievedAtUtc
                )
                : null,
    };
}

function getProgressEyebrow(
    trackingType:
        ExerciseHistoryResponse['trackingType']
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return 'Strength Progress';

        case 'RepsOnly':
            return 'Repetition Progress';

        case 'Duration':
            return 'Duration Progress';

        case 'DistanceAndDuration':
            return 'Cardio Progress';

        default:
            return 'Exercise Progress';
    }
}

function formatPercentageChange(
    value: number | null,
    direction: ExerciseTrendDirection
): string {
    if (value === null) {
        return 'Percentage unavailable';
    }

    if (
        Math.abs(value) <
        0.0001
    ) {
        return 'No change from earliest';
    }

    const formatted =
        new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits: 1,
            }
        ).format(
            Math.abs(value)
        );

    if (
        direction === 'lower'
    ) {
        return value < 0
            ? `${formatted}% faster`
            : `${formatted}% slower`;
    }

    const prefix =
        value > 0
            ? '+'
            : '-';

    return (
        `${prefix}${formatted}%` +
        ' from earliest'
    );
}

function formatShortDate(
    value: string
): string {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }
    ).format(date);
}

function formatAxisDate(
    value: string
): string {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return '';
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            month: 'short',
            day: 'numeric',
        }
    ).format(date);
}

function getTimestamp(
    value: string
): number {
    const timestamp =
        Date.parse(value);

    return Number.isFinite(
        timestamp
    )
        ? timestamp
        : 0;
}

export default ExercisePerformanceTrend;
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
    buildStrengthTrendSeries,
    formatStrengthTrendValue,
    getStrengthTrendMetricLabel,
    strengthTrendMetrics,
    type StrengthTrendMetric,
} from '../../utils/exerciseTrends';

interface ExerciseStrengthTrendProps {
    history: ExerciseHistoryResponse;
}

interface ChartPoint {
    x: number;
    y: number;

    workoutId: string;
    workoutName: string;
    achievedAtUtc: string;
    setNumber: number;
    setType: string;

    value: number;
}

function ExerciseStrengthTrend({
    history,
}: ExerciseStrengthTrendProps) {
    const [
        selectedMetric,
        setSelectedMetric,
    ] =
        useState<StrengthTrendMetric>(
            'HeaviestWeight'
        );

    const series =
        useMemo(
            () =>
                buildStrengthTrendSeries(
                    history,
                    selectedMetric
                ),
            [
                history,
                selectedMetric,
            ]
        );

    if (
        history.trackingType !==
        'WeightAndReps'
    ) {
        return null;
    }

    if (!series) {
        return null;
    }

    const chart =
        createChartGeometry(
            series.points
        );

    return (
        <section
            className="exercise-trend-section"
            aria-labelledby="exercise-trend-title"
        >
            <header className="workout-section__header">
                <div>
                    <p className="workout-section__eyebrow">
                        Strength Progress
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
                Set for the selected metric in
                one completed Workout.
            </p>

            <div
                className="exercise-trend-metric-selector"
                aria-label="Strength trend metric"
            >
                {strengthTrendMetrics.map(
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
                                setSelectedMetric(
                                    metric
                                )
                            }
                        >
                            {getStrengthTrendMetricLabel(
                                metric
                            )}
                        </button>
                    )
                )}
            </div>

            <div className="exercise-trend-summary">
                <article className="exercise-trend-summary-card">
                    <span>
                        Earliest
                    </span>

                    <strong>
                        {formatStrengthTrendValue(
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
                        {formatStrengthTrendValue(
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
                        {formatStrengthTrendValue(
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
                        {formatChange(
                            series.metric,
                            series.absoluteChange
                        )}
                    </strong>

                    <small>
                        {formatPercentageChange(
                            series.percentageChange
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
                            (tick) => (
                                <g
                                    key={
                                        tick.value
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
                                        {formatAxisNumber(
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
                                >
                                    <title>
                                        {[
                                            point.workoutName,
                                            formatShortDate(
                                                point
                                                    .achievedAtUtc
                                            ),
                                            formatStrengthTrendValue(
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
                                            {formatStrengthTrendValue(
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
    points: {
        workoutId: string;
        workoutName: string;
        achievedAtUtc: string;
        setNumber: number;
        setType: string;
        value: number;
    }[]
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

                const y =
                    plotBottom -
                    (
                        (
                            point.value -
                            minimum
                        ) /
                        range
                    ) *
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
                    maximum -
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

function formatChange(
    metric: StrengthTrendMetric,
    value: number
): string {
    const prefix =
        value > 0
            ? '+'
            : '';

    return (
        `${prefix}` +
        formatStrengthTrendValue(
            metric,
            value
        )
    );
}

function formatPercentageChange(
    value: number | null
): string {
    if (value === null) {
        return 'Percentage unavailable';
    }

    const prefix =
        value > 0
            ? '+'
            : '';

    return (
        `${prefix}` +
        `${new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits: 1,
            }
        ).format(value)}%` +
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

function formatAxisNumber(
    value: number
): string {
    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 1,
        }
    ).format(value);
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

export default ExerciseStrengthTrend;
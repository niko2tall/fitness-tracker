import {
    useMemo,
} from 'react';

import type {
    BodyMeasurement,
} from '../../types/bodyMeasurement';

import {
    buildBodyWeightTrendSeries,
    type BodyWeightTrendPoint,
} from '../../utils/bodyMeasurementTrends';

import {
    convertKilogramsToDisplayWeight,
    formatBodyWeight,
    formatBodyWeightChange,
    getBodyWeightUnitAbbreviation,
    type BodyWeightDisplayUnit,
} from '../../utils/bodyMeasurementUnits';

import {
    formatDateTime,
} from '../../utils/dateTime';

interface BodyWeightTrendProps {
    measurements:
    BodyMeasurement[];

    weightUnit:
    BodyWeightDisplayUnit;
}

interface ChartPoint
    extends BodyWeightTrendPoint {
    x: number;
    y: number;
}

function BodyWeightTrend({
    measurements,
    weightUnit,
}: BodyWeightTrendProps) {
    const series =
        useMemo(
            () =>
                buildBodyWeightTrendSeries(
                    measurements
                ),
            [measurements]
        );

    if (!series) {
        return null;
    }

    const chart =
        createChartGeometry(
            series.points
        );

    return (
        <section
            className="body-weight-trend"
            aria-labelledby="body-weight-trend-title"
        >
            <header className="workout-section__header">
                <div>
                    <p className="workout-section__eyebrow">
                        Body Weight Progress
                    </p>

                    <h2 id="body-weight-trend-title">
                        Weight Trend
                    </h2>
                </div>

                <span className="workout-section__count">
                    {series.points.length}
                </span>
            </header>

            <p className="body-weight-trend__description">
                Each point represents one
                recorded body-weight
                measurement. Weight changes
                are shown without treating
                gain or loss as inherently
                positive or negative.
            </p>

            <div className="body-weight-trend__summary">
                <article className="body-weight-trend-summary-card">
                    <span>
                        Earliest
                    </span>

                    <strong>
                        {formatBodyWeight(
                            series
                                .earliestPoint
                                .weightKg,
                            weightUnit
                        )}
                    </strong>

                    <small>
                        {formatShortDate(
                            series
                                .earliestPoint
                                .recordedAtUtc
                        )}
                    </small>
                </article>

                <article className="body-weight-trend-summary-card">
                    <span>
                        Latest
                    </span>

                    <strong>
                        {formatBodyWeight(
                            series
                                .latestPoint
                                .weightKg,
                            weightUnit
                        )}
                    </strong>

                    <small>
                        {formatShortDate(
                            series
                                .latestPoint
                                .recordedAtUtc
                        )}
                    </small>
                </article>

                <article className="body-weight-trend-summary-card">
                    <span>
                        Change
                    </span>

                    <strong>
                        {formatBodyWeightChange(
                            series
                                .absoluteChangeKg,
                            weightUnit
                        )}
                    </strong>

                    <small>
                        {formatPercentageChange(
                            series
                                .percentageChange
                        )}
                    </small>
                </article>

                <article className="body-weight-trend-summary-card">
                    <span>
                        Minimum
                    </span>

                    <strong>
                        {formatBodyWeight(
                            series
                                .minimumPoint
                                .weightKg,
                            weightUnit
                        )}
                    </strong>

                    <small>
                        {formatShortDate(
                            series
                                .minimumPoint
                                .recordedAtUtc
                        )}
                    </small>
                </article>

                <article className="body-weight-trend-summary-card">
                    <span>
                        Maximum
                    </span>

                    <strong>
                        {formatBodyWeight(
                            series
                                .maximumPoint
                                .weightKg,
                            weightUnit
                        )}
                    </strong>

                    <small>
                        {formatShortDate(
                            series
                                .maximumPoint
                                .recordedAtUtc
                        )}
                    </small>
                </article>
            </div>

            <div className="body-weight-trend-chart-shell">
                <div className="body-weight-trend-chart__header">
                    <div>
                        <strong>
                            Body Weight
                        </strong>

                        <span>
                            {series.points.length ===
                                1
                                ? '1 recorded measurement'
                                : `${series.points.length} recorded measurements`}
                        </span>
                    </div>

                    <span>
                        {getBodyWeightUnitAbbreviation(
                            weightUnit
                        )}
                    </span>
                </div>

                <div className="body-weight-trend-chart-scroll">
                    <svg
                        className="body-weight-trend-chart"
                        viewBox="0 0 760 320"
                        role="img"
                        aria-label={`Body weight progress chart in ${getBodyWeightUnitAbbreviation(
                            weightUnit
                        )}`}
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
                                        className="body-weight-trend-chart__grid-line"
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
                                        className="body-weight-trend-chart__axis-label"
                                        x={
                                            chart.plotLeft -
                                            10
                                        }
                                        y={
                                            tick.y + 4
                                        }
                                        textAnchor="end"
                                    >
                                        {formatAxisWeight(
                                            tick.value,
                                            weightUnit
                                        )}
                                    </text>
                                </g>
                            )
                        )}

                        <line
                            className="body-weight-trend-chart__axis"
                            x1={
                                chart.plotLeft
                            }
                            y1={
                                chart.plotBottom
                            }
                            x2={
                                chart.plotRight
                            }
                            y2={
                                chart.plotBottom
                            }
                        />

                        <line
                            className="body-weight-trend-chart__axis"
                            x1={
                                chart.plotLeft
                            }
                            y1={
                                chart.plotTop
                            }
                            x2={
                                chart.plotLeft
                            }
                            y2={
                                chart.plotBottom
                            }
                        />

                        {chart.points.length >
                            1 && (
                                <polyline
                                    className="body-weight-trend-chart__line"
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
                                        point.measurementId
                                    }
                                    className="body-weight-trend-chart__point"
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    tabIndex={0}
                                >
                                    <title>
                                        {buildPointTitle(
                                            point,
                                            weightUnit
                                        )}
                                    </title>
                                </circle>
                            )
                        )}

                        {chart.firstDate && (
                            <text
                                className="body-weight-trend-chart__date-label"
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
                                className="body-weight-trend-chart__date-label"
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

                <p className="body-weight-trend-chart__hint">
                    Hover over or focus on
                    chart points to inspect a
                    measurement. The table below
                    contains the same values.
                </p>
            </div>

            <details className="body-weight-trend-data">
                <summary>
                    View chart data
                </summary>

                <div className="body-weight-trend-table-scroll">
                    <table className="body-weight-trend-table">
                        <thead>
                            <tr>
                                <th scope="col">
                                    Date
                                </th>

                                <th scope="col">
                                    Weight
                                </th>

                                <th scope="col">
                                    Body Fat
                                </th>

                                <th scope="col">
                                    Notes
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {series.points.map(
                                (point) => (
                                    <tr
                                        key={
                                            `table-${point.measurementId}`
                                        }
                                    >
                                        <td>
                                            {formatDateTime(
                                                point
                                                    .recordedAtUtc
                                            )}
                                        </td>

                                        <td>
                                            {formatBodyWeight(
                                                point.weightKg,
                                                weightUnit
                                            )}
                                        </td>

                                        <td>
                                            {point
                                                .bodyFatPercentage !==
                                                null
                                                ? `${point.bodyFatPercentage}%`
                                                : '—'}
                                        </td>

                                        <td>
                                            {point.notes ??
                                                '—'}
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
    points:
        BodyWeightTrendPoint[]
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

    const weights =
        points.map(
            (point) =>
                point.weightKg
        );

    const rawMinimum =
        Math.min(
            ...weights
        );

    const rawMaximum =
        Math.max(
            ...weights
        );

    const rawRange =
        rawMaximum -
        rawMinimum;

    const padding =
        rawRange > 0
            ? rawRange * 0.15
            : Math.max(
                rawMaximum *
                0.02,
                0.5
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
            0.1
        );

    const timestamps =
        points.map(
            (point) =>
                getTimestamp(
                    point.recordedAtUtc
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
                        point
                            .recordedAtUtc
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

                const normalizedWeight =
                    (
                        point.weightKg -
                        minimum
                    ) /
                    range;

                const y =
                    plotBottom -
                    normalizedWeight *
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
                        .recordedAtUtc
                )
                : null,

        lastDate:
            points.length > 0
                ? formatAxisDate(
                    points[
                        points.length -
                        1
                    ].recordedAtUtc
                )
                : null,
    };
}

function buildPointTitle(
    point:
        BodyWeightTrendPoint,
    weightUnit:
        BodyWeightDisplayUnit
): string {
    const values = [
        formatDateTime(
            point.recordedAtUtc
        ),

        formatBodyWeight(
            point.weightKg,
            weightUnit
        ),
    ];

    if (
        point.bodyFatPercentage !==
        null
    ) {
        values.push(
            `${point.bodyFatPercentage}% body fat`
        );
    }

    if (point.notes) {
        values.push(
            point.notes
        );
    }

    return values.join(
        ' — '
    );
}

function formatPercentageChange(
    value: number
): string {
    if (
        Math.abs(value) <
        0.0001
    ) {
        return 'No change from earliest';
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

function formatAxisWeight(
    weightKg: number,
    weightUnit:
        BodyWeightDisplayUnit
): string {
    const displayValue =
        convertKilogramsToDisplayWeight(
            weightKg,
            weightUnit
        );

    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 1,
        }
    ).format(
        displayValue
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

export default BodyWeightTrend;
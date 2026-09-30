import {
    useMemo,
} from 'react';

import type {
    BodyMeasurement,
} from '../../types/bodyMeasurement';

import {
    buildBodyCompositionTrendSeries,
    type BodyCompositionTrendPoint,
    type BodyFatTrendPoint,
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

interface BodyCompositionTrendProps {
    measurements:
    BodyMeasurement[];

    weightUnit:
    BodyWeightDisplayUnit;
}

interface WeightChartPoint
    extends BodyCompositionTrendPoint {
    x: number;
    y: number;
}

interface BodyFatChartPoint
    extends BodyFatTrendPoint {
    x: number;
    y: number;
}

function BodyCompositionTrend({
    measurements,
    weightUnit,
}: BodyCompositionTrendProps) {
    const series =
        useMemo(
            () =>
                buildBodyCompositionTrendSeries(
                    measurements
                ),
            [measurements]
        );

    if (!series) {
        return null;
    }

    const chart =
        createChartGeometry(
            series.points,
            series.bodyFatPoints
        );

    const hasBodyFat =
        series.bodyFatPoints.length >
        0;

    return (
        <section
            className="body-composition-trend"
            aria-labelledby="body-composition-trend-title"
        >
            <header className="workout-section__header">
                <div>
                    <p className="workout-section__eyebrow">
                        Body Composition Progress
                    </p>

                    <h2 id="body-composition-trend-title">
                        Body Composition Trend
                    </h2>
                </div>

                <span className="workout-section__count">
                    {series.points.length}
                </span>
            </header>

            <p className="body-composition-trend__description">
                Weight and recorded body-fat
                measurements share the same
                timeline while keeping their
                own measurement scales.
            </p>

            <div className="body-composition-trend__summary">
                <article className="body-composition-summary-card">
                    <span>
                        Weight Change
                    </span>

                    <strong>
                        {formatBodyWeightChange(
                            series.weightChangeKg,
                            weightUnit
                        )}
                    </strong>

                    <small>
                        {formatBodyWeight(
                            series
                                .earliestWeightPoint
                                .weightKg,
                            weightUnit
                        )}
                        {' → '}
                        {formatBodyWeight(
                            series
                                .latestWeightPoint
                                .weightKg,
                            weightUnit
                        )}
                        {' · '}
                        {formatRelativePercentageChange(
                            series
                                .weightPercentageChange
                        )}
                    </small>
                </article>

                <article className="body-composition-summary-card">
                    <span>
                        Weight Range
                    </span>

                    <strong>
                        {formatBodyWeight(
                            series
                                .minimumWeightPoint
                                .weightKg,
                            weightUnit
                        )}
                        {' – '}
                        {formatBodyWeight(
                            series
                                .maximumWeightPoint
                                .weightKg,
                            weightUnit
                        )}
                    </strong>

                    <small>
                        Minimum to maximum
                    </small>
                </article>

                <article className="body-composition-summary-card">
                    <span>
                        Body Fat Change
                    </span>

                    {series
                        .earliestBodyFatPoint &&
                        series
                            .latestBodyFatPoint &&
                        series
                            .bodyFatChangePercentagePoints !==
                        null ? (
                        <>
                            <strong>
                                {formatPercentagePointChange(
                                    series
                                        .bodyFatChangePercentagePoints
                                )}
                            </strong>

                            <small>
                                {formatBodyFat(
                                    series
                                        .earliestBodyFatPoint
                                        .bodyFatPercentage
                                )}
                                {' → '}
                                {formatBodyFat(
                                    series
                                        .latestBodyFatPoint
                                        .bodyFatPercentage
                                )}
                            </small>
                        </>
                    ) : (
                        <>
                            <strong>
                                —
                            </strong>

                            <small>
                                Not recorded
                            </small>
                        </>
                    )}
                </article>

                <article className="body-composition-summary-card">
                    <span>
                        Body Fat Range
                    </span>

                    {series
                        .minimumBodyFatPoint &&
                        series
                            .maximumBodyFatPoint ? (
                        <>
                            <strong>
                                {formatBodyFat(
                                    series
                                        .minimumBodyFatPoint
                                        .bodyFatPercentage
                                )}
                                {' – '}
                                {formatBodyFat(
                                    series
                                        .maximumBodyFatPoint
                                        .bodyFatPercentage
                                )}
                            </strong>

                            <small>
                                Minimum to maximum
                            </small>
                        </>
                    ) : (
                        <>
                            <strong>
                                —
                            </strong>

                            <small>
                                Not recorded
                            </small>
                        </>
                    )}
                </article>
            </div>

            <div className="body-composition-chart-shell">
                <div className="body-composition-chart__header">
                    <div>
                        <strong>
                            Body Composition
                        </strong>

                        <span>
                            {series.points.length ===
                                1
                                ? '1 recorded measurement'
                                : `${series.points.length} recorded measurements`}
                        </span>
                    </div>

                    <span>
                        {hasBodyFat
                            ? `${getBodyWeightUnitAbbreviation(
                                weightUnit
                            )} / %`
                            : getBodyWeightUnitAbbreviation(
                                weightUnit
                            )}
                    </span>
                </div>

                <div
                    className="body-composition-chart__legend"
                    aria-label="Chart legend"
                >
                    <span className="body-composition-legend-item">
                        <span
                            className="body-composition-legend-line body-composition-legend-line--weight"
                            aria-hidden="true"
                        />

                        Weight
                    </span>

                    {hasBodyFat && (
                        <span className="body-composition-legend-item">
                            <span
                                className="body-composition-legend-line body-composition-legend-line--body-fat"
                                aria-hidden="true"
                            />

                            Body Fat
                        </span>
                    )}
                </div>

                <div className="body-composition-chart-scroll">
                    <svg
                        className="body-composition-chart"
                        viewBox="0 0 760 320"
                        role="img"
                        aria-label="Body weight and body fat percentage progress chart"
                    >
                        {chart.weightTicks.map(
                            (
                                tick,
                                index
                            ) => (
                                <g
                                    key={
                                        `weight-tick-${index}`
                                    }
                                >
                                    <line
                                        className="body-composition-chart__grid-line"
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
                                        className="body-composition-chart__axis-label"
                                        x={
                                            chart.plotLeft -
                                            10
                                        }
                                        y={
                                            tick.y + 4
                                        }
                                        textAnchor="end"
                                    >
                                        {formatWeightAxisValue(
                                            tick.value,
                                            weightUnit
                                        )}
                                    </text>
                                </g>
                            )
                        )}

                        {hasBodyFat &&
                            chart.bodyFatTicks.map(
                                (
                                    tick,
                                    index
                                ) => (
                                    <text
                                        key={
                                            `body-fat-tick-${index}`
                                        }
                                        className="body-composition-chart__axis-label"
                                        x={
                                            chart.plotRight +
                                            10
                                        }
                                        y={
                                            tick.y + 4
                                        }
                                        textAnchor="start"
                                    >
                                        {formatBodyFatAxisValue(
                                            tick.value
                                        )}
                                    </text>
                                )
                            )}

                        <line
                            className="body-composition-chart__axis"
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
                            className="body-composition-chart__axis"
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

                        {hasBodyFat && (
                            <line
                                className="body-composition-chart__axis"
                                x1={
                                    chart.plotRight
                                }
                                y1={
                                    chart.plotTop
                                }
                                x2={
                                    chart.plotRight
                                }
                                y2={
                                    chart.plotBottom
                                }
                            />
                        )}

                        {chart.weightPoints.length >
                            1 && (
                                <polyline
                                    className="body-composition-chart__line body-composition-chart__line--weight"
                                    points={chart.weightPoints
                                        .map(
                                            (point) =>
                                                `${point.x},${point.y}`
                                        )
                                        .join(' ')}
                                />
                            )}

                        {chart.bodyFatPoints.length >
                            1 && (
                                <polyline
                                    className="body-composition-chart__line body-composition-chart__line--body-fat"
                                    points={chart.bodyFatPoints
                                        .map(
                                            (point) =>
                                                `${point.x},${point.y}`
                                        )
                                        .join(' ')}
                                />
                            )}

                        {chart.weightPoints.map(
                            (point) => (
                                <circle
                                    key={
                                        `weight-${point.measurementId}`
                                    }
                                    className="body-composition-chart__point body-composition-chart__point--weight"
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    tabIndex={0}
                                    aria-label={buildWeightPointLabel(
                                        point,
                                        weightUnit
                                    )}
                                >
                                    <title>
                                        {buildWeightPointLabel(
                                            point,
                                            weightUnit
                                        )}
                                    </title>
                                </circle>
                            )
                        )}

                        {chart.bodyFatPoints.map(
                            (point) => (
                                <circle
                                    key={
                                        `body-fat-${point.measurementId}`
                                    }
                                    className="body-composition-chart__point body-composition-chart__point--body-fat"
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    tabIndex={0}
                                    aria-label={buildBodyFatPointLabel(
                                        point,
                                        weightUnit
                                    )}
                                >
                                    <title>
                                        {buildBodyFatPointLabel(
                                            point,
                                            weightUnit
                                        )}
                                    </title>
                                </circle>
                            )
                        )}

                        {chart.firstDate && (
                            <text
                                className="body-composition-chart__date-label"
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
                                className="body-composition-chart__date-label"
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

                <p className="body-composition-chart__hint">
                    Weight uses the left axis.
                    Body fat uses the right axis
                    when recorded. Missing body-fat
                    measurements are not estimated
                    or interpolated.
                </p>
            </div>

            <details className="body-composition-data">
                <summary>
                    View chart data
                </summary>

                <div className="body-composition-table-scroll">
                    <table className="body-composition-table">
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
                                                ? formatBodyFat(
                                                    point
                                                        .bodyFatPercentage
                                                )
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
        BodyCompositionTrendPoint[],
    bodyFatPoints:
        BodyFatTrendPoint[]
) {
    const plotLeft = 70;
    const plotRight = 690;

    const plotTop = 24;
    const plotBottom = 270;

    const plotWidth =
        plotRight -
        plotLeft;

    const plotHeight =
        plotBottom -
        plotTop;

    const weightScale =
        createNumericScale(
            points.map(
                (point) =>
                    point.weightKg
            ),
            plotTop,
            plotBottom,
            0.15,
            0.5
        );

    const bodyFatScale =
        bodyFatPoints.length >
            0
            ? createNumericScale(
                bodyFatPoints.map(
                    (point) =>
                        point
                            .bodyFatPercentage
                ),
                plotTop,
                plotBottom,
                0.15,
                0.5,
                0,
                100
            )
            : null;

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

    const xByMeasurementId =
        new Map<
            string,
            number
        >();

    const weightChartPoints:
        WeightChartPoint[] =
        points.map(
            (
                point,
                index
            ) => {
                const x =
                    getXCoordinate(
                        point.recordedAtUtc,
                        index,
                        points.length,
                        firstTimestamp,
                        timeRange,
                        plotLeft,
                        plotWidth
                    );

                xByMeasurementId.set(
                    point.measurementId,
                    x
                );

                return {
                    ...point,

                    x,

                    y:
                        getYCoordinate(
                            point.weightKg,
                            weightScale.minimum,
                            weightScale.range,
                            plotTop,
                            plotHeight
                        ),
                };
            }
        );

    const bodyFatChartPoints:
        BodyFatChartPoint[] =
        bodyFatPoints.map(
            (point) => {
                const x =
                    xByMeasurementId.get(
                        point.measurementId
                    ) ??
                    plotLeft +
                    plotWidth / 2;

                return {
                    ...point,

                    x,

                    y:
                        bodyFatScale
                            ? getYCoordinate(
                                point
                                    .bodyFatPercentage,
                                bodyFatScale
                                    .minimum,
                                bodyFatScale.range,
                                plotTop,
                                plotHeight
                            )
                            : plotBottom,
                };
            }
        );

    return {
        plotLeft,
        plotRight,
        plotTop,
        plotBottom,

        weightPoints:
            weightChartPoints,

        bodyFatPoints:
            bodyFatChartPoints,

        weightTicks:
            weightScale.ticks,

        bodyFatTicks:
            bodyFatScale?.ticks ??
            [],

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

function createNumericScale(
    values: number[],
    plotTop: number,
    plotBottom: number,
    paddingRatio: number,
    minimumPadding: number,
    hardMinimum?: number,
    hardMaximum?: number
) {
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
            ? rawRange *
            paddingRatio
            : Math.max(
                Math.abs(
                    rawMaximum
                ) * 0.03,
                minimumPadding
            );

    let minimum =
        rawMinimum -
        padding;

    let maximum =
        rawMaximum +
        padding;

    if (
        hardMinimum !==
        undefined
    ) {
        minimum =
            Math.max(
                hardMinimum,
                minimum
            );
    }

    if (
        hardMaximum !==
        undefined
    ) {
        maximum =
            Math.min(
                hardMaximum,
                maximum
            );
    }

    if (
        maximum <= minimum
    ) {
        maximum =
            minimum +
            Math.max(
                minimumPadding,
                0.1
            );
    }

    const range =
        maximum -
        minimum;

    const plotHeight =
        plotBottom -
        plotTop;

    const tickCount = 5;

    const ticks =
        Array.from(
            {
                length:
                    tickCount,
            },
            (
                _,
                index
            ) => {
                const ratio =
                    index /
                    (
                        tickCount - 1
                    );

                return {
                    value:
                        maximum -
                        ratio *
                        range,

                    y:
                        plotTop +
                        ratio *
                        plotHeight,
                };
            }
        );

    return {
        minimum,
        maximum,
        range,
        ticks,
    };
}

function getXCoordinate(
    recordedAtUtc: string,
    index: number,
    pointCount: number,
    firstTimestamp: number,
    timeRange: number,
    plotLeft: number,
    plotWidth: number
): number {
    if (
        pointCount === 1
    ) {
        return (
            plotLeft +
            plotWidth / 2
        );
    }

    if (
        timeRange <= 0
    ) {
        return (
            plotLeft +
            (
                index /
                Math.max(
                    pointCount - 1,
                    1
                )
            ) *
            plotWidth
        );
    }

    const timestamp =
        getTimestamp(
            recordedAtUtc
        );

    return (
        plotLeft +
        (
            (
                timestamp -
                firstTimestamp
            ) /
            timeRange
        ) *
        plotWidth
    );
}

function getYCoordinate(
    value: number,
    minimum: number,
    range: number,
    plotTop: number,
    plotHeight: number
): number {
    const normalized =
        (
            value -
            minimum
        ) /
        range;

    return (
        plotTop +
        (
            1 -
            normalized
        ) *
        plotHeight
    );
}

function buildWeightPointLabel(
    point:
        BodyCompositionTrendPoint,
    weightUnit:
        BodyWeightDisplayUnit
): string {
    const values = [
        formatDateTime(
            point.recordedAtUtc
        ),

        `Weight ${formatBodyWeight(
            point.weightKg,
            weightUnit
        )}`,
    ];

    if (
        point.bodyFatPercentage !==
        null
    ) {
        values.push(
            `Body fat ${formatBodyFat(
                point.bodyFatPercentage
            )}`
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

function buildBodyFatPointLabel(
    point:
        BodyFatTrendPoint,
    weightUnit:
        BodyWeightDisplayUnit
): string {
    const values = [
        formatDateTime(
            point.recordedAtUtc
        ),

        `Body fat ${formatBodyFat(
            point.bodyFatPercentage
        )}`,

        `Weight ${formatBodyWeight(
            point.weightKg,
            weightUnit
        )}`,
    ];

    if (point.notes) {
        values.push(
            point.notes
        );
    }

    return values.join(
        ' — '
    );
}

function formatBodyFat(
    value: number
): string {
    return (
        `${new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits: 1,
            }
        ).format(value)}%`
    );
}

function formatPercentagePointChange(
    value: number
): string {
    const normalized =
        Math.abs(value) <
            0.0001
            ? 0
            : value;

    const prefix =
        normalized > 0
            ? '+'
            : '';

    return (
        `${prefix}` +
        `${new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits: 1,
            }
        ).format(
            normalized
        )} pp`
    );
}

function formatRelativePercentageChange(
    value: number
): string {
    if (
        Math.abs(value) <
        0.0001
    ) {
        return '0%';
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
        ).format(value)}%`
    );
}

function formatWeightAxisValue(
    weightKg: number,
    weightUnit:
        BodyWeightDisplayUnit
): string {
    const displayWeight =
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
        displayWeight
    );
}

function formatBodyFatAxisValue(
    value: number
): string {
    return (
        `${new Intl.NumberFormat(
            undefined,
            {
                maximumFractionDigits: 1,
            }
        ).format(value)}%`
    );
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

export default BodyCompositionTrend;
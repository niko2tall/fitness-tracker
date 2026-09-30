import type {
    BodyMeasurement,
} from '../types/bodyMeasurement';

export interface BodyCompositionTrendPoint {
    measurementId: string;
    recordedAtUtc: string;

    weightKg: number;

    bodyFatPercentage:
    number | null;

    notes:
    string | null;
}

export interface BodyFatTrendPoint {
    measurementId: string;
    recordedAtUtc: string;

    weightKg: number;

    bodyFatPercentage: number;

    notes:
    string | null;
}

export interface BodyCompositionTrendSeries {
    points:
    BodyCompositionTrendPoint[];

    bodyFatPoints:
    BodyFatTrendPoint[];

    earliestWeightPoint:
    BodyCompositionTrendPoint;

    latestWeightPoint:
    BodyCompositionTrendPoint;

    minimumWeightPoint:
    BodyCompositionTrendPoint;

    maximumWeightPoint:
    BodyCompositionTrendPoint;

    weightChangeKg: number;

    weightPercentageChange:
    number;

    earliestBodyFatPoint:
    BodyFatTrendPoint | null;

    latestBodyFatPoint:
    BodyFatTrendPoint | null;

    minimumBodyFatPoint:
    BodyFatTrendPoint | null;

    maximumBodyFatPoint:
    BodyFatTrendPoint | null;

    bodyFatChangePercentagePoints:
    number | null;
}

export function buildBodyCompositionTrendSeries(
    measurements:
        BodyMeasurement[]
): BodyCompositionTrendSeries | null {
    const points =
        measurements
            .filter(
                (measurement) =>
                    Number.isFinite(
                        measurement.weightKg
                    ) &&
                    measurement.weightKg >
                    0 &&
                    isValidTimestamp(
                        measurement
                            .recordedAtUtc
                    )
            )
            .map(
                (measurement) => ({
                    measurementId:
                        measurement.id,

                    recordedAtUtc:
                        measurement
                            .recordedAtUtc,

                    weightKg:
                        measurement
                            .weightKg,

                    bodyFatPercentage:
                        measurement
                            .bodyFatPercentage,

                    notes:
                        measurement.notes,
                })
            )
            .sort(
                (
                    left,
                    right
                ) =>
                    getTimestamp(
                        left.recordedAtUtc
                    ) -
                    getTimestamp(
                        right.recordedAtUtc
                    )
            );

    if (
        points.length === 0
    ) {
        return null;
    }

    const bodyFatPoints:
        BodyFatTrendPoint[] =
        points.flatMap(
            (point) => {
                if (
                    point.bodyFatPercentage ===
                    null ||
                    !Number.isFinite(
                        point.bodyFatPercentage
                    ) ||
                    point.bodyFatPercentage <
                    0 ||
                    point.bodyFatPercentage >
                    100
                ) {
                    return [];
                }

                return [
                    {
                        measurementId:
                            point.measurementId,

                        recordedAtUtc:
                            point.recordedAtUtc,

                        weightKg:
                            point.weightKg,

                        bodyFatPercentage:
                            point
                                .bodyFatPercentage,

                        notes:
                            point.notes,
                    },
                ];
            }
        );

    const earliestWeightPoint =
        points[0];

    const latestWeightPoint =
        points[
        points.length - 1
        ];

    const minimumWeightPoint =
        points.reduce(
            (
                minimum,
                point
            ) =>
                point.weightKg <=
                    minimum.weightKg
                    ? point
                    : minimum,
            points[0]
        );

    const maximumWeightPoint =
        points.reduce(
            (
                maximum,
                point
            ) =>
                point.weightKg >=
                    maximum.weightKg
                    ? point
                    : maximum,
            points[0]
        );

    const weightChangeKg =
        latestWeightPoint
            .weightKg -
        earliestWeightPoint
            .weightKg;

    const weightPercentageChange =
        (
            weightChangeKg /
            earliestWeightPoint
                .weightKg
        ) * 100;

    const earliestBodyFatPoint =
        bodyFatPoints[0] ??
        null;

    const latestBodyFatPoint =
        bodyFatPoints.length > 0
            ? bodyFatPoints[
            bodyFatPoints.length -
            1
            ]
            : null;

    const minimumBodyFatPoint =
        bodyFatPoints.length > 0
            ? bodyFatPoints.reduce(
                (
                    minimum,
                    point
                ) =>
                    point
                        .bodyFatPercentage <=
                        minimum
                            .bodyFatPercentage
                        ? point
                        : minimum,
                bodyFatPoints[0]
            )
            : null;

    const maximumBodyFatPoint =
        bodyFatPoints.length > 0
            ? bodyFatPoints.reduce(
                (
                    maximum,
                    point
                ) =>
                    point
                        .bodyFatPercentage >=
                        maximum
                            .bodyFatPercentage
                        ? point
                        : maximum,
                bodyFatPoints[0]
            )
            : null;

    const bodyFatChangePercentagePoints =
        earliestBodyFatPoint &&
            latestBodyFatPoint
            ? latestBodyFatPoint
                .bodyFatPercentage -
            earliestBodyFatPoint
                .bodyFatPercentage
            : null;

    return {
        points,
        bodyFatPoints,

        earliestWeightPoint,
        latestWeightPoint,

        minimumWeightPoint,
        maximumWeightPoint,

        weightChangeKg,
        weightPercentageChange,

        earliestBodyFatPoint,
        latestBodyFatPoint,

        minimumBodyFatPoint,
        maximumBodyFatPoint,

        bodyFatChangePercentagePoints,
    };
}

function isValidTimestamp(
    value: string
): boolean {
    return Number.isFinite(
        Date.parse(value)
    );
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
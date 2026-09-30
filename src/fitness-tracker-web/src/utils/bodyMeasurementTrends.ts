import type {
    BodyMeasurement,
} from '../types/bodyMeasurement';

export interface BodyWeightTrendPoint {
    measurementId: string;
    recordedAtUtc: string;

    weightKg: number;

    bodyFatPercentage:
    number | null;

    notes:
    string | null;
}

export interface BodyWeightTrendSeries {
    points:
    BodyWeightTrendPoint[];

    earliestPoint:
    BodyWeightTrendPoint;

    latestPoint:
    BodyWeightTrendPoint;

    minimumPoint:
    BodyWeightTrendPoint;

    maximumPoint:
    BodyWeightTrendPoint;

    absoluteChangeKg:
    number;

    percentageChange:
    number;
}

export function buildBodyWeightTrendSeries(
    measurements:
        BodyMeasurement[]
): BodyWeightTrendSeries | null {
    const points =
        measurements
            .filter(
                (measurement) =>
                    Number.isFinite(
                        measurement.weightKg
                    ) &&
                    measurement.weightKg >
                    0 &&
                    Number.isFinite(
                        Date.parse(
                            measurement
                                .recordedAtUtc
                        )
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

    const earliestPoint =
        points[0];

    const latestPoint =
        points[
        points.length - 1
        ];

    const minimumPoint =
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

    const maximumPoint =
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

    const absoluteChangeKg =
        latestPoint.weightKg -
        earliestPoint.weightKg;

    const percentageChange =
        (
            absoluteChangeKg /
            earliestPoint.weightKg
        ) * 100;

    return {
        points,

        earliestPoint,
        latestPoint,

        minimumPoint,
        maximumPoint,

        absoluteChangeKg,
        percentageChange,
    };
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
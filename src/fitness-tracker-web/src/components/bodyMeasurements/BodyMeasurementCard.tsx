import type {
    BodyMeasurement,
} from '../../types/bodyMeasurement';

import {
    formatDateTime,
} from '../../utils/dateTime';

import {
    formatBodyWeight,
    type BodyWeightDisplayUnit,
} from '../../utils/bodyMeasurementUnits';

interface BodyMeasurementCardProps {
    measurement: BodyMeasurement;
    weightUnit: BodyWeightDisplayUnit;

    onEdit: (
        measurement: BodyMeasurement
    ) => void;

    onDelete: (
        measurement: BodyMeasurement
    ) => void;
}

function BodyMeasurementCard({
    measurement,
    weightUnit,
    onEdit,
    onDelete,
}: BodyMeasurementCardProps) {
    return (
        <article className="body-measurement-card">
            <header className="body-measurement-card__header">
                <div>
                    <p className="body-measurement-card__eyebrow">
                        Recorded Measurement
                    </p>

                    <h3>
                        {formatBodyWeight(
                            measurement.weightKg,
                            weightUnit
                        )}
                    </h3>

                    <p className="body-measurement-card__date">
                        {formatDateTime(
                            measurement.recordedAtUtc
                        )}
                    </p>
                </div>

                <div className="body-measurement-card__actions">
                    <button
                        type="button"
                        className="body-measurement-action-button"
                        onClick={() =>
                            onEdit(
                                measurement
                            )
                        }
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="body-measurement-action-button body-measurement-action-button--danger"
                        onClick={() =>
                            onDelete(
                                measurement
                            )
                        }
                    >
                        Delete
                    </button>
                </div>
            </header>

            <dl className="body-measurement-card__details">
                <div>
                    <dt>
                        Weight
                    </dt>

                    <dd>
                        {formatBodyWeight(
                            measurement.weightKg,
                            weightUnit
                        )}
                    </dd>
                </div>

                <div>
                    <dt>
                        Body Fat
                    </dt>

                    <dd>
                        {measurement
                            .bodyFatPercentage !==
                            null
                            ? `${measurement.bodyFatPercentage}%`
                            : '—'}
                    </dd>
                </div>
            </dl>

            {measurement.notes && (
                <div className="body-measurement-card__notes">
                    <span>
                        Notes
                    </span>

                    <p>
                        {measurement.notes}
                    </p>
                </div>
            )}
        </article>
    );
}

export default BodyMeasurementCard;
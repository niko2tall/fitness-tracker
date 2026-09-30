import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from 'react';

import type {
    BodyMeasurement,
    CreateBodyMeasurementRequest,
} from '../../types/bodyMeasurement';

import {
    convertDisplayWeightToKilograms,
    formatBodyWeightInputValue,
    getBodyWeightUnitAbbreviation,
    localDateTimeInputToUtc,
    toLocalDateTimeInputValue,
    type BodyWeightDisplayUnit,
} from '../../utils/bodyMeasurementUnits';

interface BodyMeasurementDialogProps {
    isOpen: boolean;
    mode: 'create' | 'edit';

    measurement:
    BodyMeasurement | null;

    weightUnit:
    BodyWeightDisplayUnit;

    isSubmitting: boolean;
    error: string | null;

    onClose: () => void;

    onSubmit: (
        request:
            CreateBodyMeasurementRequest
    ) => Promise<void>;
}

function BodyMeasurementDialog({
    isOpen,
    mode,
    measurement,
    weightUnit,
    isSubmitting,
    error,
    onClose,
    onSubmit,
}: BodyMeasurementDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(
            null
        );

    const [
        recordedAt,
        setRecordedAt,
    ] = useState('');

    const [
        weight,
        setWeight,
    ] = useState('');

    const [
        bodyFatPercentage,
        setBodyFatPercentage,
    ] = useState('');

    const [
        notes,
        setNotes,
    ] = useState('');

    const [
        validationError,
        setValidationError,
    ] =
        useState<string | null>(
            null
        );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (measurement) {
            setRecordedAt(
                toLocalDateTimeInputValue(
                    measurement
                        .recordedAtUtc
                )
            );

            setWeight(
                formatBodyWeightInputValue(
                    measurement.weightKg,
                    weightUnit
                )
            );

            setBodyFatPercentage(
                measurement
                    .bodyFatPercentage !==
                    null
                    ? String(
                        measurement
                            .bodyFatPercentage
                    )
                    : ''
            );

            setNotes(
                measurement.notes ??
                ''
            );
        } else {
            setRecordedAt(
                toLocalDateTimeInputValue(
                    new Date()
                )
            );

            setWeight('');
            setBodyFatPercentage('');
            setNotes('');
        }

        setValidationError(null);
    }, [
        isOpen,
        measurement,
        weightUnit,
    ]);

    useEffect(() => {
        const dialog =
            dialogRef.current;

        if (
            !isOpen ||
            !dialog
        ) {
            return;
        }

        if (!dialog.open) {
            dialog.showModal();
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setValidationError(null);

        const recordedAtUtc =
            localDateTimeInputToUtc(
                recordedAt
            );

        if (!recordedAtUtc) {
            setValidationError(
                'Enter a valid measurement date and time.'
            );

            return;
        }

        const parsedWeight =
            Number(weight);

        if (
            !Number.isFinite(
                parsedWeight
            ) ||
            parsedWeight <= 0
        ) {
            setValidationError(
                'Weight must be greater than zero.'
            );

            return;
        }

        let parsedBodyFat:
            number | null =
            null;

        if (
            bodyFatPercentage
                .trim()
                .length > 0
        ) {
            parsedBodyFat =
                Number(
                    bodyFatPercentage
                );

            if (
                !Number.isFinite(
                    parsedBodyFat
                ) ||
                parsedBodyFat < 0 ||
                parsedBodyFat > 100
            ) {
                setValidationError(
                    'Body fat percentage must be between 0 and 100.'
                );

                return;
            }
        }

        const normalizedNotes =
            notes.trim();

        if (
            normalizedNotes.length >
            1000
        ) {
            setValidationError(
                'Notes cannot exceed 1000 characters.'
            );

            return;
        }

        const request:
            CreateBodyMeasurementRequest =
        {
            recordedAtUtc,

            weightKg:
                convertDisplayWeightToKilograms(
                    parsedWeight,
                    weightUnit
                ),

            bodyFatPercentage:
                parsedBodyFat,

            notes:
                normalizedNotes.length >
                    0
                    ? normalizedNotes
                    : null,
        };

        await onSubmit(
            request
        );
    }

    const title =
        mode === 'create'
            ? 'Add Measurement'
            : 'Edit Measurement';

    const submitLabel =
        mode === 'create'
            ? 'Add Measurement'
            : 'Save Changes';

    return (
        <dialog
            ref={dialogRef}
            className="body-measurement-dialog"
            onCancel={(event) => {
                if (isSubmitting) {
                    event.preventDefault();

                    return;
                }

                onClose();
            }}
        >
            <form
                className="body-measurement-dialog__form"
                onSubmit={
                    handleSubmit
                }
            >
                <header className="body-measurement-dialog__header">
                    <div>
                        <p className="body-measurement-dialog__eyebrow">
                            Progress Tracking
                        </p>

                        <h2>
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="body-measurement-dialog__close"
                        aria-label="Close"
                        disabled={
                            isSubmitting
                        }
                        onClick={
                            onClose
                        }
                    >
                        ×
                    </button>
                </header>

                <label className="body-measurement-field">
                    <span>
                        Recorded At
                    </span>

                    <input
                        type="datetime-local"
                        value={
                            recordedAt
                        }
                        required
                        disabled={
                            isSubmitting
                        }
                        onChange={(event) =>
                            setRecordedAt(
                                event.target.value
                            )
                        }
                    />
                </label>

                <label className="body-measurement-field">
                    <span>
                        Weight (
                        {getBodyWeightUnitAbbreviation(
                            weightUnit
                        )}
                        )
                    </span>

                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        inputMode="decimal"
                        value={weight}
                        required
                        disabled={
                            isSubmitting
                        }
                        onChange={(event) =>
                            setWeight(
                                event.target.value
                            )
                        }
                    />
                </label>

                <label className="body-measurement-field">
                    <span>
                        Body Fat % — Optional
                    </span>

                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        inputMode="decimal"
                        value={
                            bodyFatPercentage
                        }
                        disabled={
                            isSubmitting
                        }
                        onChange={(event) =>
                            setBodyFatPercentage(
                                event.target.value
                            )
                        }
                    />
                </label>

                <label className="body-measurement-field">
                    <span>
                        Notes — Optional
                    </span>

                    <textarea
                        rows={4}
                        maxLength={1000}
                        value={notes}
                        disabled={
                            isSubmitting
                        }
                        onChange={(event) =>
                            setNotes(
                                event.target.value
                            )
                        }
                    />

                    <small>
                        {notes.length}/1000
                    </small>
                </label>

                {(validationError ||
                    error) && (
                        <div
                            className="body-measurement-dialog__error"
                            role="alert"
                        >
                            {validationError ??
                                error}
                        </div>
                    )}

                <footer className="body-measurement-dialog__actions">
                    <button
                        type="button"
                        className="workout-button workout-button--secondary"
                        disabled={
                            isSubmitting
                        }
                        onClick={
                            onClose
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="workout-button workout-button--primary"
                        disabled={
                            isSubmitting
                        }
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : submitLabel}
                    </button>
                </footer>
            </form>
        </dialog>
    );
}

export default BodyMeasurementDialog;
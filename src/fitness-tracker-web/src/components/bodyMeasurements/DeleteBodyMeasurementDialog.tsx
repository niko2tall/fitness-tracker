import {
    useEffect,
    useRef,
} from 'react';

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

interface DeleteBodyMeasurementDialogProps {
    isOpen: boolean;

    measurement:
    BodyMeasurement | null;

    weightUnit:
    BodyWeightDisplayUnit;

    isSubmitting: boolean;
    error: string | null;

    onClose: () => void;

    onConfirm: () => Promise<void>;
}

function DeleteBodyMeasurementDialog({
    isOpen,
    measurement,
    weightUnit,
    isSubmitting,
    error,
    onClose,
    onConfirm,
}: DeleteBodyMeasurementDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(
            null
        );

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

    if (
        !isOpen ||
        !measurement
    ) {
        return null;
    }

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
            <div className="body-measurement-dialog__form">
                <header className="body-measurement-dialog__header">
                    <div>
                        <p className="body-measurement-dialog__eyebrow">
                            Remove Record
                        </p>

                        <h2>
                            Delete Measurement?
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

                <div className="body-measurement-delete-summary">
                    <strong>
                        {formatBodyWeight(
                            measurement.weightKg,
                            weightUnit
                        )}
                    </strong>

                    <span>
                        {formatDateTime(
                            measurement
                                .recordedAtUtc
                        )}
                    </span>
                </div>

                <p className="body-measurement-delete-warning">
                    This measurement will be
                    permanently removed from
                    your progress history.
                </p>

                {error && (
                    <div
                        className="body-measurement-dialog__error"
                        role="alert"
                    >
                        {error}
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
                        type="button"
                        className="workout-button workout-button--danger"
                        disabled={
                            isSubmitting
                        }
                        onClick={() =>
                            void onConfirm()
                        }
                    >
                        {isSubmitting
                            ? 'Deleting...'
                            : 'Delete Measurement'}
                    </button>
                </footer>
            </div>
        </dialog>
    );
}

export default DeleteBodyMeasurementDialog;
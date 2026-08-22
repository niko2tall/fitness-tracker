import {
    useEffect,
    useRef,
    useState,
} from 'react';

import type { Exercise } from '../../types/exercise';

interface ArchiveExerciseDialogProps {
    exercise: Exercise;
    onConfirm: (
        exerciseId: string
    ) => Promise<void>;
    onClose: () => void;
}

function ArchiveExerciseDialog({
    exercise,
    onConfirm,
    onClose,
}: ArchiveExerciseDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    const [isArchiving, setIsArchiving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (dialog && !dialog.open) {
            dialog.showModal();
        }

        return () => {
            if (dialog?.open) {
                dialog.close();
            }
        };
    }, []);

    async function handleArchive() {
        try {
            setIsArchiving(true);
            setError(null);

            await onConfirm(exercise.id);

            setIsArchiving(false);
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.'
            );

            setIsArchiving(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="exercise-dialog"
            aria-labelledby="archive-exercise-title"
            onCancel={(event) => {
                event.preventDefault();

                if (!isArchiving) {
                    onClose();
                }
            }}
            onClick={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isArchiving
                ) {
                    onClose();
                }
            }}
        >
            <div className="exercise-dialog__content">
                <div className="exercise-dialog__header">
                    <div>
                        <p className="exercise-dialog__eyebrow">
                            Custom Exercise
                        </p>

                        <h2 id="archive-exercise-title">
                            Archive Exercise?
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="exercise-dialog__close"
                        aria-label="Close archive confirmation"
                        disabled={isArchiving}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="archive-exercise-message">
                    <p>
                        Are you sure you want to archive{' '}
                        <strong>{exercise.name}</strong>?
                    </p>

                    <p>
                        It will be removed from the active
                        exercise library, but the record will
                        remain stored for historical data.
                    </p>
                </div>

                {error && (
                    <div
                        className="exercise-form__error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <div className="exercise-dialog__actions">
                    <button
                        type="button"
                        className="exercise-dialog__action-button exercise-dialog__action-button--secondary"
                        disabled={isArchiving}
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="exercise-dialog__action-button exercise-dialog__action-button--danger"
                        disabled={isArchiving}
                        onClick={handleArchive}
                    >
                        {isArchiving
                            ? 'Archiving...'
                            : 'Archive Exercise'}
                    </button>
                </div>
            </div>
        </dialog>
    );
}

export default ArchiveExerciseDialog;
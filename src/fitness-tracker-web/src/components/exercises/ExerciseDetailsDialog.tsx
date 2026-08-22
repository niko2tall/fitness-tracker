import { useEffect, useRef } from 'react';
import type { Exercise } from '../../types/exercise';

interface ExerciseDetailsDialogProps {
    exercise: Exercise | null;
    isLoading: boolean;
    error: string | null;
    onEdit: (exercise: Exercise) => void;
    onArchive: (exercise: Exercise) => void;
    onClose: () => void;
}

function ExerciseDetailsDialog({
    exercise,
    isLoading,
    error,
    onEdit,
    onArchive,
    onClose,
}: ExerciseDetailsDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

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

    return (
        <dialog
            ref={dialogRef}
            className="exercise-dialog"
            aria-labelledby="exercise-dialog-title"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="exercise-dialog__content">
                <div className="exercise-dialog__header">
                    <div>
                        <p className="exercise-dialog__eyebrow">
                            Exercise Details
                        </p>

                        <h2 id="exercise-dialog-title">
                            {exercise?.name ?? 'Exercise'}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="exercise-dialog__close"
                        aria-label="Close exercise details"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {isLoading && (
                    <div
                        className="exercise-dialog__status"
                        role="status"
                    >
                        <p>Loading exercise details...</p>
                    </div>
                )}

                {error && (
                    <div
                        className="exercise-dialog__status"
                        role="alert"
                    >
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && exercise && (
                    <>
                        <div className="exercise-dialog__badges">
                            <span className="exercise-badge">
                                {exercise.exerciseType}
                            </span>

                            <span className="exercise-badge">
                                {exercise.isCustom
                                    ? 'Custom Exercise'
                                    : 'Built-in Exercise'}
                            </span>

                            <span className="exercise-badge">
                                {exercise.isArchived
                                    ? 'Archived'
                                    : 'Active'}
                            </span>
                        </div>

                        <dl className="exercise-details">
                            <div>
                                <dt>Tracking Method</dt>
                                <dd>
                                    {formatTrackingType(
                                        exercise.trackingType
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt>Primary Muscle Group</dt>
                                <dd>
                                    {exercise.primaryMuscleGroup ??
                                        'Not specified'}
                                </dd>
                            </div>

                            <div>
                                <dt>Equipment</dt>
                                <dd>
                                    {exercise.equipment ??
                                        'Not specified'}
                                </dd>
                            </div>

                            <div>
                                <dt>Source</dt>
                                <dd>
                                    {exercise.isCustom
                                        ? 'Custom'
                                        : 'Built-in'}
                                </dd>
                            </div>

                            <div>
                                <dt>Status</dt>
                                <dd>
                                    {exercise.isArchived
                                        ? 'Archived'
                                        : 'Active'}
                                </dd>
                            </div>
                        </dl>

                        {exercise.isCustom &&
                            !exercise.isArchived && (
                                <div className="exercise-dialog__actions">
                                    <button
                                        type="button"
                                        className="exercise-dialog__action-button exercise-dialog__action-button--secondary"
                                        onClick={() => onEdit(exercise)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="exercise-dialog__action-button exercise-dialog__action-button--danger"
                                        onClick={() => onArchive(exercise)}
                                    >
                                        Archive
                                    </button>
                                </div>
                            )}
                    </>
                )}
            </div>
        </dialog>
    );
}

function formatTrackingType(
    trackingType: Exercise['trackingType']
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return 'Weight & Reps';

        case 'RepsOnly':
            return 'Reps';

        case 'Duration':
            return 'Duration';

        case 'DistanceAndDuration':
            return 'Distance & Duration';

        default:
            return trackingType;
    }
}

export default ExerciseDetailsDialog;
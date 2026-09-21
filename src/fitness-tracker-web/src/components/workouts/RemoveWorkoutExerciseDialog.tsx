import {
    useEffect,
    useRef,
} from 'react';

import type {
    WorkoutExercise,
} from '../../types/workout';

interface RemoveWorkoutExerciseDialogProps {
    isOpen: boolean;
    exercise: WorkoutExercise | null;
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

function RemoveWorkoutExerciseDialog({
    isOpen,
    exercise,
    isSubmitting,
    error,
    onClose,
    onConfirm,
}: RemoveWorkoutExerciseDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog =
            dialogRef.current;

        if (
            isOpen &&
            dialog &&
            !dialog.open
        ) {
            dialog.showModal();
        }
    }, [isOpen]);

    if (
        !isOpen ||
        !exercise
    ) {
        return null;
    }

    function handleClose() {
        if (isSubmitting) {
            return;
        }

        onClose();
    }

    return (
        <dialog
            ref={dialogRef}
            className="workout-dialog workout-remove-dialog"
            aria-labelledby="remove-workout-exercise-title"
            onCancel={(event) => {
                event.preventDefault();
                handleClose();
            }}
            onClick={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose();
                }
            }}
        >
            <div className="workout-dialog__content">
                <header className="workout-dialog__header">
                    <div>
                        <p className="workout-dialog__eyebrow">
                            Remove Exercise
                        </p>

                        <h2 id="remove-workout-exercise-title">
                            {exercise.exerciseName}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="workout-dialog__close"
                        aria-label="Close"
                        disabled={isSubmitting}
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </header>

                <div className="workout-remove-dialog__message">
                    <p>
                        Remove this exercise from the
                        current workout?
                    </p>

                    {exercise.sets.length > 0 && (
                        <p className="workout-remove-dialog__warning">
                            This will also permanently remove{' '}
                            {exercise.sets.length === 1
                                ? 'the recorded set'
                                : `all ${exercise.sets.length} recorded sets`}
                            {' '}for this exercise.
                        </p>
                    )}
                </div>

                {error && (
                    <div
                        className="workout-form__error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <footer className="workout-dialog__actions">
                    <button
                        type="button"
                        className="workout-button workout-button--secondary"
                        disabled={isSubmitting}
                        onClick={handleClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="workout-button workout-button--danger"
                        disabled={isSubmitting}
                        onClick={() =>
                            void onConfirm()
                        }
                    >
                        {isSubmitting
                            ? 'Removing...'
                            : 'Remove Exercise'}
                    </button>
                </footer>
            </div>
        </dialog>
    );
}

export default RemoveWorkoutExerciseDialog;
import {
    useEffect,
    useRef,
} from 'react';

import type {
    WorkoutExercise,
    WorkoutSet,
} from '../../types/workout';

interface RemoveWorkoutSetDialogProps {
    isOpen: boolean;
    exercise: WorkoutExercise | null;
    set: WorkoutSet | null;
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

function RemoveWorkoutSetDialog({
    isOpen,
    exercise,
    set,
    isSubmitting,
    error,
    onClose,
    onConfirm,
}: RemoveWorkoutSetDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog =
            dialogRef.current;

        if (
            isOpen &&
            exercise &&
            set &&
            dialog &&
            !dialog.open
        ) {
            dialog.showModal();
        }
    }, [
        isOpen,
        exercise,
        set,
    ]);

    if (
        !isOpen ||
        !exercise ||
        !set
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
            aria-labelledby="remove-workout-set-title"
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
                            Remove Set
                        </p>

                        <h2 id="remove-workout-set-title">
                            Set {set.setNumber}
                        </h2>

                        <p className="workout-set-dialog__exercise-name">
                            {exercise.exerciseName}
                        </p>
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
                        Permanently remove this
                        recorded set from the
                        current workout?
                    </p>

                    <p className="workout-remove-dialog__warning">
                        Remaining sets for this
                        exercise will be renumbered
                        automatically.
                    </p>
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
                            : 'Remove Set'}
                    </button>
                </footer>
            </div>
        </dialog>
    );
}

export default RemoveWorkoutSetDialog;
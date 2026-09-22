import {
    useEffect,
    useMemo,
    useRef,
} from 'react';

import type {
    Workout,
} from '../../types/workout';

interface CompleteWorkoutDialogProps {
    isOpen: boolean;
    workout: Workout | null;
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

function CompleteWorkoutDialog({
    isOpen,
    workout,
    isSubmitting,
    error,
    onClose,
    onConfirm,
}: CompleteWorkoutDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog =
            dialogRef.current;

        if (
            isOpen &&
            workout &&
            dialog &&
            !dialog.open
        ) {
            dialog.showModal();
        }
    }, [
        isOpen,
        workout,
    ]);

    const completedSetCount =
        useMemo(
            () =>
                workout?.exercises.reduce(
                    (
                        total,
                        exercise
                    ) =>
                        total +
                        exercise.sets.filter(
                            (set) =>
                                set.isCompleted
                        ).length,
                    0
                ) ?? 0,
            [workout]
        );

    const totalSetCount =
        useMemo(
            () =>
                workout?.exercises.reduce(
                    (
                        total,
                        exercise
                    ) =>
                        total +
                        exercise.sets.length,
                    0
                ) ?? 0,
            [workout]
        );

    if (
        !isOpen ||
        !workout
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
            className="workout-dialog workout-complete-dialog"
            aria-labelledby="complete-workout-title"
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
                            Finish Session
                        </p>

                        <h2 id="complete-workout-title">
                            Complete Workout
                        </h2>

                        <p className="workout-complete-dialog__name">
                            {workout.name}
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

                <div className="workout-complete-dialog__summary">
                    <div>
                        <span>Exercises</span>

                        <strong>
                            {workout.exercises.length}
                        </strong>
                    </div>

                    <div>
                        <span>Sets</span>

                        <strong>
                            {totalSetCount}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Completed Sets
                        </span>

                        <strong>
                            {completedSetCount}
                        </strong>
                    </div>
                </div>

                <div className="workout-complete-dialog__warning">
                    <strong>
                        Completing this workout will
                        make the normal logging
                        controls read-only.
                    </strong>

                    <p>
                        You will still be able to view
                        the workout, its exercises,
                        sets, performance values, and
                        notes after completion.
                    </p>
                </div>

                {completedSetCount === 0 && (
                    <div
                        className="workout-form__error"
                        role="alert"
                    >
                        At least one completed set is
                        required before this workout
                        can be completed.
                    </div>
                )}

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
                        Keep Workout Active
                    </button>

                    <button
                        type="button"
                        className="workout-button workout-button--primary"
                        disabled={
                            isSubmitting ||
                            completedSetCount === 0
                        }
                        onClick={() =>
                            void onConfirm()
                        }
                    >
                        {isSubmitting
                            ? 'Completing...'
                            : 'Complete Workout'}
                    </button>
                </footer>
            </div>
        </dialog>
    );
}

export default CompleteWorkoutDialog;
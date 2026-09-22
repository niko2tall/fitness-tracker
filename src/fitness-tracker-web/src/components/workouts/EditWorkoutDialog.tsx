import {
    type FormEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

import type {
    UpdateWorkoutRequest,
    Workout,
    WorkoutType,
} from '../../types/workout';

interface EditWorkoutDialogProps {
    isOpen: boolean;
    workout: Workout | null;
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (
        request: UpdateWorkoutRequest
    ) => Promise<void>;
}

function EditWorkoutDialog({
    isOpen,
    workout,
    isSubmitting,
    error,
    onClose,
    onSubmit,
}: EditWorkoutDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    const [
        name,
        setName,
    ] = useState('');

    const [
        workoutType,
        setWorkoutType,
    ] =
        useState<WorkoutType>(
            'Strength'
        );

    const [
        notes,
        setNotes,
    ] = useState('');

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(
        null
    );

    useEffect(() => {
        if (
            !isOpen ||
            !workout
        ) {
            return;
        }

        setName(workout.name);

        setWorkoutType(
            workout.workoutType
        );

        setNotes(
            workout.notes ?? ''
        );

        setValidationError(null);
    }, [
        isOpen,
        workout,
    ]);

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

    if (
        !isOpen ||
        !workout
    ) {
        return null;
    }

    const canUseStrength =
        canUseWorkoutType(
            'Strength',
            workout
        );

    const canUseCardio =
        canUseWorkoutType(
            'Cardio',
            workout
        );

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const normalizedName =
            name.trim();

        if (!normalizedName) {
            setValidationError(
                'Workout name is required.'
            );

            return;
        }

        setValidationError(null);

        await onSubmit({
            name: normalizedName,

            workoutType,

            notes:
                notes.trim().length > 0
                    ? notes.trim()
                    : null,
        });
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
            className="workout-dialog workout-edit-dialog"
            aria-labelledby="edit-workout-title"
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
            <form
                className="workout-dialog__content"
                onSubmit={handleSubmit}
            >
                <header className="workout-dialog__header">
                    <div>
                        <p className="workout-dialog__eyebrow">
                            Active Workout
                        </p>

                        <h2 id="edit-workout-title">
                            Edit Workout
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

                <div className="workout-form">
                    <label className="workout-form__field">
                        <span>Workout name</span>

                        <input
                            type="text"
                            maxLength={150}
                            value={name}
                            required
                            disabled={isSubmitting}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                        />
                    </label>

                    <label className="workout-form__field">
                        <span>Workout type</span>

                        <select
                            value={workoutType}
                            disabled={isSubmitting}
                            onChange={(event) =>
                                setWorkoutType(
                                    event.target
                                        .value as WorkoutType
                                )
                            }
                        >
                            <option
                                value="Strength"
                                disabled={
                                    !canUseStrength
                                }
                            >
                                Strength
                            </option>

                            <option
                                value="Cardio"
                                disabled={
                                    !canUseCardio
                                }
                            >
                                Cardio
                            </option>

                            <option value="Mixed">
                                Mixed
                            </option>
                        </select>

                        <small className="workout-form__help">
                            Workout types that conflict
                            with exercises already in
                            this session are disabled.
                        </small>
                    </label>

                    <label className="workout-form__field">
                        <span>
                            Notes
                            <span className="workout-form__optional">
                                {' '}
                                — optional
                            </span>
                        </span>

                        <textarea
                            rows={4}
                            maxLength={2000}
                            value={notes}
                            placeholder="Session goals, focus, or other notes..."
                            disabled={isSubmitting}
                            onChange={(event) =>
                                setNotes(
                                    event.target.value
                                )
                            }
                        />
                    </label>
                </div>

                {(validationError ||
                    error) && (
                        <div
                            className="workout-form__error"
                            role="alert"
                        >
                            {validationError ??
                                error}
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
                        type="submit"
                        className="workout-button workout-button--primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : 'Save Changes'}
                    </button>
                </footer>
            </form>
        </dialog>
    );
}

function canUseWorkoutType(
    workoutType: WorkoutType,
    workout: Workout
): boolean {
    switch (workoutType) {
        case 'Strength':
            return workout.exercises.every(
                (exercise) =>
                    exercise.exerciseType ===
                    'Strength'
            );

        case 'Cardio':
            return workout.exercises.every(
                (exercise) =>
                    exercise.exerciseType ===
                    'Cardio'
            );

        case 'Mixed':
            return true;

        default:
            return false;
    }
}

export default EditWorkoutDialog;
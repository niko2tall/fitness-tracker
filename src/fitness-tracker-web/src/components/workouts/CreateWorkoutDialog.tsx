import {
    type FormEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

import type {
    CreateWorkoutRequest,
    WorkoutType,
} from '../../types/workout';

interface CreateWorkoutDialogProps {
    isOpen: boolean;
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (
        request: CreateWorkoutRequest
    ) => Promise<void>;
}

function CreateWorkoutDialog({
    isOpen,
    isSubmitting,
    error,
    onClose,
    onSubmit,
}: CreateWorkoutDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    const [name, setName] =
        useState('');

    const [workoutType, setWorkoutType] =
        useState<WorkoutType>('Strength');

    const [notes, setNotes] =
        useState('');

    const [validationError, setValidationError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setName('');
        setWorkoutType('Strength');
        setNotes('');
        setValidationError(null);
    }, [isOpen]);

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

    if (!isOpen) {
        return null;
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
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
            className="workout-dialog"
            aria-labelledby="create-workout-title"
            onCancel={(event) => {
                event.preventDefault();
                handleClose();
            }}
            onClick={(event) => {
                if (
                    event.target === event.currentTarget
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
                            New Session
                        </p>

                        <h2 id="create-workout-title">
                            Start Workout
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
                            value={name}
                            maxLength={150}
                            autoFocus
                            required
                            placeholder="Push Day"
                            disabled={isSubmitting}
                            onChange={(event) =>
                                setName(event.target.value)
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
                            <option value="Strength">
                                Strength
                            </option>

                            <option value="Cardio">
                                Cardio
                            </option>

                            <option value="Mixed">
                                Mixed
                            </option>
                        </select>
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
                            value={notes}
                            maxLength={2000}
                            rows={4}
                            placeholder="Anything you want to remember about this session..."
                            disabled={isSubmitting}
                            onChange={(event) =>
                                setNotes(event.target.value)
                            }
                        />
                    </label>
                </div>

                {(validationError || error) && (
                    <div
                        className="workout-form__error"
                        role="alert"
                    >
                        {validationError ?? error}
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
                            ? 'Starting...'
                            : 'Start Workout'}
                    </button>
                </footer>
            </form>
        </dialog>
    );
}

export default CreateWorkoutDialog;
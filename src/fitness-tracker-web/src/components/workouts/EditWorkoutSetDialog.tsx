import {
    type FormEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

import type {
    SetType,
    UpdateWorkoutSetRequest,
    WorkoutExercise,
    WorkoutSet,
} from '../../types/workout';

interface EditWorkoutSetDialogProps {
    isOpen: boolean;
    exercise: WorkoutExercise | null;
    set: WorkoutSet | null;
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (
        request: UpdateWorkoutSetRequest
    ) => Promise<void>;
}

function EditWorkoutSetDialog({
    isOpen,
    exercise,
    set,
    isSubmitting,
    error,
    onClose,
    onSubmit,
}: EditWorkoutSetDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    const [
        setType,
        setSetType,
    ] = useState<SetType>('Working');

    const [
        reps,
        setReps,
    ] = useState('');

    const [
        weightKg,
        setWeightKg,
    ] = useState('');

    const [
        durationMinutes,
        setDurationMinutes,
    ] = useState('');

    const [
        durationSeconds,
        setDurationSeconds,
    ] = useState('');

    const [
        distanceKm,
        setDistanceKm,
    ] = useState('');

    const [
        rpe,
        setRpe,
    ] = useState('');

    const [
        notes,
        setNotes,
    ] = useState('');

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(null);

    useEffect(() => {
        if (
            !isOpen ||
            !exercise ||
            !set
        ) {
            return;
        }

        setSetType(
            exercise.exerciseType === 'Cardio'
                ? 'Working'
                : set.setType
        );

        setReps(
            set.reps !== null
                ? String(set.reps)
                : ''
        );

        setWeightKg(
            set.weightKg !== null
                ? formatInputNumber(
                    set.weightKg
                )
                : ''
        );

        if (
            set.durationSeconds !== null
        ) {
            const minutes =
                Math.floor(
                    set.durationSeconds / 60
                );

            const seconds =
                set.durationSeconds % 60;

            setDurationMinutes(
                String(minutes)
            );

            setDurationSeconds(
                String(seconds)
            );
        } else {
            setDurationMinutes('');
            setDurationSeconds('');
        }

        setDistanceKm(
            set.distanceMeters !== null
                ? formatInputNumber(
                    set.distanceMeters /
                    1000
                )
                : ''
        );

        setRpe(
            set.rpe !== null
                ? formatInputNumber(
                    set.rpe
                )
                : ''
        );

        setNotes(
            set.notes ?? ''
        );

        setValidationError(null);
    }, [
        isOpen,
        exercise,
        set,
    ]);

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

    const isCardio =
        exercise.exerciseType ===
        'Cardio';

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        // Explicit guard keeps TypeScript's
        // nullability checks safe inside
        // this callback.
        if (
            !exercise ||
            !set
        ) {
            setValidationError(
                'A workout set is required before it can be edited.'
            );

            return;
        }

        setValidationError(null);

        const parsedRpe =
            parseOptionalNumber(rpe);

        if (
            rpe.trim().length > 0 &&
            parsedRpe === null
        ) {
            setValidationError(
                'RPE must be a valid number.'
            );

            return;
        }

        if (
            parsedRpe !== null &&
            (
                parsedRpe < 1 ||
                parsedRpe > 10
            )
        ) {
            setValidationError(
                'RPE must be between 1 and 10.'
            );

            return;
        }

        const request:
            UpdateWorkoutSetRequest = {
            setType:
                isCardio
                    ? 'Working'
                    : setType,

            reps: null,
            weightKg: null,
            durationSeconds: null,
            distanceMeters: null,
            rpe: parsedRpe,

            notes:
                notes.trim().length > 0
                    ? notes.trim()
                    : null,
        };

        switch (
        exercise.trackingType
        ) {
            case 'WeightAndReps': {
                const parsedReps =
                    parseOptionalNumber(reps);

                const parsedWeight =
                    parseOptionalNumber(
                        weightKg
                    );

                if (
                    parsedReps === null ||
                    !Number.isInteger(
                        parsedReps
                    ) ||
                    parsedReps <= 0
                ) {
                    setValidationError(
                        'Repetitions must be a whole number greater than zero.'
                    );

                    return;
                }

                if (
                    parsedWeight === null ||
                    parsedWeight < 0
                ) {
                    setValidationError(
                        'Weight must be zero or greater.'
                    );

                    return;
                }

                request.reps =
                    parsedReps;

                request.weightKg =
                    parsedWeight;

                break;
            }

            case 'RepsOnly': {
                const parsedReps =
                    parseOptionalNumber(reps);

                if (
                    parsedReps === null ||
                    !Number.isInteger(
                        parsedReps
                    ) ||
                    parsedReps <= 0
                ) {
                    setValidationError(
                        'Repetitions must be a whole number greater than zero.'
                    );

                    return;
                }

                request.reps =
                    parsedReps;

                break;
            }

            case 'Duration': {
                const durationResult =
                    parseDuration(
                        durationMinutes,
                        durationSeconds
                    );

                if (
                    durationResult.error
                ) {
                    setValidationError(
                        durationResult.error
                    );

                    return;
                }

                if (
                    durationResult.value ===
                    null
                ) {
                    setValidationError(
                        'Duration is required.'
                    );

                    return;
                }

                request.durationSeconds =
                    durationResult.value;

                break;
            }

            case 'DistanceAndDuration': {
                const parsedDistanceKm =
                    parseOptionalNumber(
                        distanceKm
                    );

                if (
                    parsedDistanceKm === null ||
                    parsedDistanceKm <= 0
                ) {
                    setValidationError(
                        'Distance must be greater than zero.'
                    );

                    return;
                }

                const durationResult =
                    parseDuration(
                        durationMinutes,
                        durationSeconds
                    );

                if (
                    durationResult.error
                ) {
                    setValidationError(
                        durationResult.error
                    );

                    return;
                }

                if (
                    durationResult.value ===
                    null
                ) {
                    setValidationError(
                        'Duration is required.'
                    );

                    return;
                }

                request.distanceMeters =
                    Math.round(
                        parsedDistanceKm * 1000
                    );

                request.durationSeconds =
                    durationResult.value;

                break;
            }

            default:
                setValidationError(
                    'This exercise uses an unsupported tracking type.'
                );

                return;
        }

        await onSubmit(request);
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
            className="workout-dialog workout-set-dialog"
            aria-labelledby="edit-workout-set-title"
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
                            {formatTrackingType(
                                exercise.trackingType
                            )}
                        </p>

                        <h2 id="edit-workout-set-title">
                            Edit Set {set.setNumber}
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

                <p className="workout-set-dialog__description">
                    Update the recorded
                    performance for this set.
                </p>

                <div className="workout-form">
                    {isCardio ? (
                        <div className="workout-form__field">
                            <span>Set type</span>

                            <div className="workout-set-dialog__fixed-value">
                                Working
                            </div>
                        </div>
                    ) : (
                        <label className="workout-form__field">
                            <span>Set type</span>

                            <select
                                value={setType}
                                disabled={isSubmitting}
                                onChange={(event) =>
                                    setSetType(
                                        event.target
                                            .value as SetType
                                    )
                                }
                            >
                                <option value="Warmup">
                                    Warmup
                                </option>

                                <option value="Working">
                                    Working
                                </option>

                                <option value="Drop">
                                    Drop
                                </option>

                                <option value="Failure">
                                    Failure
                                </option>
                            </select>
                        </label>
                    )}

                    {exercise.trackingType ===
                        'WeightAndReps' && (
                            <div className="workout-set-dialog__field-grid">
                                <label className="workout-form__field">
                                    <span>
                                        Weight (kg)
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        inputMode="decimal"
                                        value={weightKg}
                                        disabled={isSubmitting}
                                        onChange={(event) =>
                                            setWeightKg(
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label className="workout-form__field">
                                    <span>Reps</span>

                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        inputMode="numeric"
                                        value={reps}
                                        disabled={isSubmitting}
                                        onChange={(event) =>
                                            setReps(
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>
                            </div>
                        )}

                    {exercise.trackingType ===
                        'RepsOnly' && (
                            <label className="workout-form__field">
                                <span>Reps</span>

                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    inputMode="numeric"
                                    value={reps}
                                    disabled={isSubmitting}
                                    onChange={(event) =>
                                        setReps(
                                            event.target.value
                                        )
                                    }
                                />
                            </label>
                        )}

                    {exercise.trackingType ===
                        'Duration' && (
                            <DurationFields
                                minutes={
                                    durationMinutes
                                }
                                seconds={
                                    durationSeconds
                                }
                                disabled={
                                    isSubmitting
                                }
                                onMinutesChange={
                                    setDurationMinutes
                                }
                                onSecondsChange={
                                    setDurationSeconds
                                }
                            />
                        )}

                    {exercise.trackingType ===
                        'DistanceAndDuration' && (
                            <>
                                <label className="workout-form__field">
                                    <span>
                                        Distance (km)
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        inputMode="decimal"
                                        value={distanceKm}
                                        disabled={isSubmitting}
                                        onChange={(event) =>
                                            setDistanceKm(
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <DurationFields
                                    minutes={
                                        durationMinutes
                                    }
                                    seconds={
                                        durationSeconds
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                    onMinutesChange={
                                        setDurationMinutes
                                    }
                                    onSecondsChange={
                                        setDurationSeconds
                                    }
                                />
                            </>
                        )}

                    <label className="workout-form__field">
                        <span>
                            RPE
                            <span className="workout-form__optional">
                                {' '}
                                — optional
                            </span>
                        </span>

                        <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.5"
                            inputMode="decimal"
                            value={rpe}
                            disabled={isSubmitting}
                            onChange={(event) =>
                                setRpe(
                                    event.target.value
                                )
                            }
                        />

                        <small className="workout-form__help">
                            Rate perceived exertion
                            from 1 to 10.
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
                            rows={3}
                            maxLength={1000}
                            value={notes}
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

interface DurationFieldsProps {
    minutes: string;
    seconds: string;
    disabled: boolean;
    onMinutesChange: (
        value: string
    ) => void;
    onSecondsChange: (
        value: string
    ) => void;
}

function DurationFields({
    minutes,
    seconds,
    disabled,
    onMinutesChange,
    onSecondsChange,
}: DurationFieldsProps) {
    return (
        <fieldset className="workout-duration-fields">
            <legend>Duration</legend>

            <div className="workout-set-dialog__field-grid">
                <label className="workout-form__field">
                    <span>Minutes</span>

                    <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={minutes}
                        disabled={disabled}
                        onChange={(event) =>
                            onMinutesChange(
                                event.target.value
                            )
                        }
                    />
                </label>

                <label className="workout-form__field">
                    <span>Seconds</span>

                    <input
                        type="number"
                        min="0"
                        max="59"
                        step="1"
                        inputMode="numeric"
                        value={seconds}
                        disabled={disabled}
                        onChange={(event) =>
                            onSecondsChange(
                                event.target.value
                            )
                        }
                    />
                </label>
            </div>
        </fieldset>
    );
}

interface DurationParseResult {
    value: number | null;
    error: string | null;
}

function parseDuration(
    minutesText: string,
    secondsText: string
): DurationParseResult {
    const hasMinutes =
        minutesText.trim().length > 0;

    const hasSeconds =
        secondsText.trim().length > 0;

    if (
        !hasMinutes &&
        !hasSeconds
    ) {
        return {
            value: null,
            error: null,
        };
    }

    const minutes =
        hasMinutes
            ? Number(minutesText)
            : 0;

    const seconds =
        hasSeconds
            ? Number(secondsText)
            : 0;

    if (
        !Number.isInteger(minutes) ||
        minutes < 0
    ) {
        return {
            value: null,
            error:
                'Duration minutes must be a whole number of zero or greater.',
        };
    }

    if (
        !Number.isInteger(seconds) ||
        seconds < 0 ||
        seconds > 59
    ) {
        return {
            value: null,
            error:
                'Duration seconds must be a whole number between 0 and 59.',
        };
    }

    const totalSeconds =
        minutes * 60 + seconds;

    if (totalSeconds <= 0) {
        return {
            value: null,
            error:
                'Duration must be greater than zero.',
        };
    }

    return {
        value: totalSeconds,
        error: null,
    };
}

function parseOptionalNumber(
    value: string
): number | null {
    const normalized =
        value.trim();

    if (!normalized) {
        return null;
    }

    const parsed =
        Number(normalized);

    return Number.isFinite(parsed)
        ? parsed
        : null;
}

function formatInputNumber(
    value: number
): string {
    return String(
        Number(
            value.toFixed(3)
        )
    );
}

function formatTrackingType(
    trackingType:
        WorkoutExercise['trackingType']
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return 'Weight + Reps';

        case 'RepsOnly':
            return 'Reps';

        case 'Duration':
            return 'Duration';

        case 'DistanceAndDuration':
            return 'Distance + Duration';

        default:
            return trackingType;
    }
}

export default EditWorkoutSetDialog;
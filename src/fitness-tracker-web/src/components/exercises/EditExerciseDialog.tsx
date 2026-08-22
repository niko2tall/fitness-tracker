import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from 'react';

import type {
    Exercise,
    ExerciseTrackingType,
    ExerciseType,
    UpdateExerciseRequest,
} from '../../types/exercise';

interface EditExerciseDialogProps {
    exercise: Exercise;
    muscleGroups: string[];
    equipmentOptions: string[];
    onSubmit: (
        id: string,
        request: UpdateExerciseRequest
    ) => Promise<void>;
    onClose: () => void;
}

interface TrackingOption {
    value: ExerciseTrackingType;
    label: string;
}

const strengthTrackingOptions: TrackingOption[] = [
    {
        value: 'WeightAndReps',
        label: 'Weight & Reps',
    },
    {
        value: 'RepsOnly',
        label: 'Reps',
    },
    {
        value: 'Duration',
        label: 'Duration',
    },
];

const cardioTrackingOptions: TrackingOption[] = [
    {
        value: 'Duration',
        label: 'Duration',
    },
    {
        value: 'DistanceAndDuration',
        label: 'Distance & Duration',
    },
];

function EditExerciseDialog({
    exercise,
    muscleGroups,
    equipmentOptions,
    onSubmit,
    onClose,
}: EditExerciseDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [name, setName] = useState(exercise.name);

    const [exerciseType, setExerciseType] =
        useState<ExerciseType>(
            exercise.exerciseType
        );

    const [trackingType, setTrackingType] =
        useState<ExerciseTrackingType | ''>(
            exercise.trackingType
        );

    const [
        primaryMuscleGroup,
        setPrimaryMuscleGroup,
    ] = useState(
        exercise.primaryMuscleGroup ?? ''
    );

    const [equipment, setEquipment] =
        useState(exercise.equipment ?? '');

    const [isSubmitting, setIsSubmitting] =
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

    const trackingOptions =
        getTrackingOptions(exerciseType);

    function handleExerciseTypeChange(
        value: ExerciseType
    ) {
        setExerciseType(value);
        setError(null);

        const validTrackingTypes =
            getTrackingOptions(value).map(
                (option) => option.value
            );

        if (
            trackingType &&
            !validTrackingTypes.includes(trackingType)
        ) {
            setTrackingType('');
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        const normalizedName = name.trim();

        if (!normalizedName) {
            setError('Exercise name is required.');
            return;
        }

        if (!trackingType) {
            setError('Tracking method is required.');
            return;
        }

        const request: UpdateExerciseRequest = {
            name: normalizedName,
            exerciseType,
            trackingType,
            primaryMuscleGroup:
                normalizeOptionalText(
                    primaryMuscleGroup
                ),
            equipment:
                normalizeOptionalText(equipment),
        };

        try {
            setIsSubmitting(true);

            await onSubmit(
                exercise.id,
                request
            );

            setIsSubmitting(false);
            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.'
            );

            setIsSubmitting(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="exercise-dialog"
            aria-labelledby="edit-exercise-title"
            onCancel={(event) => {
                event.preventDefault();

                if (!isSubmitting) {
                    onClose();
                }
            }}
            onClick={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isSubmitting
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

                        <h2 id="edit-exercise-title">
                            Edit Exercise
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="exercise-dialog__close"
                        aria-label="Close edit exercise form"
                        disabled={isSubmitting}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form
                    className="exercise-form"
                    onSubmit={handleSubmit}
                >
                    {error && (
                        <div
                            className="exercise-form__error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <div className="exercise-form__field">
                        <label htmlFor="edit-exercise-name">
                            Exercise Name
                        </label>

                        <input
                            id="edit-exercise-name"
                            type="text"
                            value={name}
                            maxLength={150}
                            required
                            autoFocus
                            disabled={isSubmitting}
                            onChange={(event) => {
                                setName(event.target.value);
                                setError(null);
                            }}
                        />
                    </div>

                    <div className="exercise-form__row">
                        <div className="exercise-form__field">
                            <label htmlFor="edit-exercise-type">
                                Exercise Type
                            </label>

                            <select
                                id="edit-exercise-type"
                                value={exerciseType}
                                required
                                disabled={isSubmitting}
                                onChange={(event) =>
                                    handleExerciseTypeChange(
                                        event.target.value as
                                        ExerciseType
                                    )
                                }
                            >
                                <option value="Strength">
                                    Strength
                                </option>

                                <option value="Cardio">
                                    Cardio
                                </option>
                            </select>
                        </div>

                        <div className="exercise-form__field">
                            <label htmlFor="edit-tracking-type">
                                Tracking Method
                            </label>

                            <select
                                id="edit-tracking-type"
                                value={trackingType}
                                required
                                disabled={isSubmitting}
                                onChange={(event) => {
                                    setTrackingType(
                                        event.target.value as
                                        | ExerciseTrackingType
                                        | ''
                                    );

                                    setError(null);
                                }}
                            >
                                <option value="">
                                    Select tracking method
                                </option>

                                {trackingOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="exercise-form__row">
                        <div className="exercise-form__field">
                            <label htmlFor="edit-muscle-group">
                                Primary Muscle Group
                            </label>

                            <input
                                id="edit-muscle-group"
                                type="text"
                                list="edit-muscle-group-options"
                                value={primaryMuscleGroup}
                                maxLength={100}
                                disabled={isSubmitting}
                                onChange={(event) => {
                                    setPrimaryMuscleGroup(
                                        event.target.value
                                    );

                                    setError(null);
                                }}
                            />

                            <datalist id="edit-muscle-group-options">
                                {muscleGroups.map((muscleGroup) => (
                                    <option
                                        key={muscleGroup}
                                        value={muscleGroup}
                                    />
                                ))}
                            </datalist>
                        </div>

                        <div className="exercise-form__field">
                            <label htmlFor="edit-equipment">
                                Equipment
                            </label>

                            <input
                                id="edit-equipment"
                                type="text"
                                list="edit-equipment-options"
                                value={equipment}
                                maxLength={100}
                                disabled={isSubmitting}
                                onChange={(event) => {
                                    setEquipment(event.target.value);
                                    setError(null);
                                }}
                            />

                            <datalist id="edit-equipment-options">
                                {equipmentOptions.map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="exercise-form__actions">
                        <button
                            type="button"
                            className="exercise-form__button exercise-form__button--secondary"
                            disabled={isSubmitting}
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="exercise-form__button exercise-form__button--primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

function getTrackingOptions(
    exerciseType: ExerciseType
): TrackingOption[] {
    switch (exerciseType) {
        case 'Strength':
            return strengthTrackingOptions;

        case 'Cardio':
            return cardioTrackingOptions;
    }
}

function normalizeOptionalText(
    value: string
): string | null {
    const normalizedValue = value.trim();

    return normalizedValue.length > 0
        ? normalizedValue
        : null;
}

export default EditExerciseDialog;
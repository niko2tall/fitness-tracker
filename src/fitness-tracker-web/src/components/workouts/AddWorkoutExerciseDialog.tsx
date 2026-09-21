import {
    type FormEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    getExercises,
} from '../../services/api';

import type {
    Exercise,
} from '../../types/exercise';

import type {
    AddWorkoutExerciseRequest,
    WorkoutType,
} from '../../types/workout';

interface AddWorkoutExerciseDialogProps {
    isOpen: boolean;
    workoutType: WorkoutType;
    existingExerciseIds: string[];
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (
        request: AddWorkoutExerciseRequest
    ) => Promise<void>;
}

function AddWorkoutExerciseDialog({
    isOpen,
    workoutType,
    existingExerciseIds,
    isSubmitting,
    error,
    onClose,
    onSubmit,
}: AddWorkoutExerciseDialogProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    const [
        exercises,
        setExercises,
    ] = useState<Exercise[]>([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        loadError,
        setLoadError,
    ] = useState<string | null>(null);

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');

    const [
        selectedExerciseId,
        setSelectedExerciseId,
    ] = useState<string | null>(null);

    const [
        notes,
        setNotes,
    ] = useState('');

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setSearchTerm('');
        setSelectedExerciseId(null);
        setNotes('');
        setLoadError(null);

        const controller =
            new AbortController();

        async function loadExercises() {
            try {
                setIsLoading(true);

                const response =
                    await getExercises(
                        false,
                        controller.signal
                    );

                setExercises(response);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setLoadError(
                    getErrorMessage(
                        error,
                        'Unable to load exercises.'
                    )
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadExercises();

        return () => {
            controller.abort();
        };
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

    const existingExerciseIdSet =
        useMemo(
            () =>
                new Set(existingExerciseIds),
            [existingExerciseIds]
        );

    const eligibleExercises =
        useMemo(
            () =>
                exercises
                    .filter(
                        (exercise) =>
                            !exercise.isArchived
                    )
                    .filter(
                        (exercise) =>
                            !existingExerciseIdSet.has(
                                exercise.id
                            )
                    )
                    .filter(
                        (exercise) =>
                            isCompatibleWithWorkout(
                                exercise,
                                workoutType
                            )
                    )
                    .sort((left, right) =>
                        left.name.localeCompare(
                            right.name
                        )
                    ),
            [
                exercises,
                existingExerciseIdSet,
                workoutType,
            ]
        );

    const filteredExercises =
        useMemo(() => {
            const normalizedSearch =
                searchTerm
                    .trim()
                    .toLowerCase();

            if (!normalizedSearch) {
                return eligibleExercises;
            }

            return eligibleExercises.filter(
                (exercise) => {
                    const searchableValues = [
                        exercise.name,
                        exercise.primaryMuscleGroup,
                        exercise.equipment,
                    ];

                    return searchableValues.some(
                        (value) =>
                            value
                                ?.toLowerCase()
                                .includes(
                                    normalizedSearch
                                )
                    );
                }
            );
        }, [
            eligibleExercises,
            searchTerm,
        ]);

    const selectedExercise =
        useMemo(
            () =>
                eligibleExercises.find(
                    (exercise) =>
                        exercise.id ===
                        selectedExerciseId
                ) ?? null,
            [
                eligibleExercises,
                selectedExerciseId,
            ]
        );

    if (!isOpen) {
        return null;
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!selectedExercise) {
            return;
        }

        await onSubmit({
            exerciseId:
                selectedExercise.id,

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
            className="workout-dialog workout-exercise-dialog"
            aria-labelledby="add-workout-exercise-title"
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

                        <h2 id="add-workout-exercise-title">
                            Add Exercise
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

                <p className="workout-exercise-dialog__description">
                    Showing exercises compatible with
                    this {workoutType.toLowerCase()}
                    {' '}workout.
                </p>

                <label className="workout-form__field">
                    <span>Search exercises</span>

                    <input
                        type="search"
                        value={searchTerm}
                        placeholder="Search by name, muscle, or equipment..."
                        disabled={
                            isLoading ||
                            isSubmitting
                        }
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />
                </label>

                {isLoading && (
                    <div className="workout-picker-state">
                        Loading exercises...
                    </div>
                )}

                {!isLoading &&
                    loadError && (
                        <div
                            className="workout-form__error"
                            role="alert"
                        >
                            {loadError}
                        </div>
                    )}

                {!isLoading &&
                    !loadError &&
                    eligibleExercises.length ===
                    0 && (
                        <div className="workout-picker-state">
                            No additional compatible
                            exercises are available.
                        </div>
                    )}

                {!isLoading &&
                    !loadError &&
                    eligibleExercises.length > 0 &&
                    filteredExercises.length ===
                    0 && (
                        <div className="workout-picker-state">
                            No exercises match your
                            search.
                        </div>
                    )}

                {!isLoading &&
                    !loadError &&
                    filteredExercises.length > 0 && (
                        <div className="workout-exercise-picker">
                            {filteredExercises.map(
                                (exercise) => {
                                    const isSelected =
                                        exercise.id ===
                                        selectedExerciseId;

                                    return (
                                        <button
                                            key={exercise.id}
                                            type="button"
                                            className={
                                                isSelected
                                                    ? 'workout-exercise-picker__item workout-exercise-picker__item--selected'
                                                    : 'workout-exercise-picker__item'
                                            }
                                            disabled={isSubmitting}
                                            onClick={() =>
                                                setSelectedExerciseId(
                                                    exercise.id
                                                )
                                            }
                                        >
                                            <div className="workout-exercise-picker__main">
                                                <strong>
                                                    {exercise.name}
                                                </strong>

                                                <span>
                                                    {formatTrackingType(
                                                        exercise.trackingType
                                                    )}
                                                </span>
                                            </div>

                                            <div className="workout-exercise-picker__meta">
                                                {exercise.primaryMuscleGroup && (
                                                    <span>
                                                        {
                                                            exercise.primaryMuscleGroup
                                                        }
                                                    </span>
                                                )}

                                                {exercise.equipment && (
                                                    <span>
                                                        {
                                                            exercise.equipment
                                                        }
                                                    </span>
                                                )}

                                                {exercise.isCustom && (
                                                    <span>
                                                        Custom
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    )}

                {selectedExercise && (
                    <section className="workout-exercise-selection">
                        <div>
                            <p className="workout-exercise-selection__label">
                                Selected Exercise
                            </p>

                            <h3>
                                {selectedExercise.name}
                            </h3>

                            <p>
                                {formatTrackingType(
                                    selectedExercise.trackingType
                                )}
                            </p>
                        </div>

                        <label className="workout-form__field">
                            <span>
                                Exercise notes
                                <span className="workout-form__optional">
                                    {' '}
                                    — optional
                                </span>
                            </span>

                            <textarea
                                rows={3}
                                maxLength={1000}
                                value={notes}
                                placeholder="Example: pause each rep, use a neutral grip..."
                                disabled={isSubmitting}
                                onChange={(event) =>
                                    setNotes(
                                        event.target.value
                                    )
                                }
                            />
                        </label>
                    </section>
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
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="workout-button workout-button--primary"
                        disabled={
                            !selectedExercise ||
                            isSubmitting
                        }
                    >
                        {isSubmitting
                            ? 'Adding...'
                            : 'Add Exercise'}
                    </button>
                </footer>
            </form>
        </dialog>
    );
}

function isCompatibleWithWorkout(
    exercise: Exercise,
    workoutType: WorkoutType
): boolean {
    switch (workoutType) {
        case 'Strength':
            return (
                exercise.exerciseType ===
                'Strength'
            );

        case 'Cardio':
            return (
                exercise.exerciseType ===
                'Cardio'
            );

        case 'Mixed':
            return true;

        default:
            return false;
    }
}

function formatTrackingType(
    trackingType:
        Exercise['trackingType']
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

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    return error instanceof Error &&
        error.message.trim().length > 0
        ? error.message
        : fallback;
}

export default AddWorkoutExerciseDialog;
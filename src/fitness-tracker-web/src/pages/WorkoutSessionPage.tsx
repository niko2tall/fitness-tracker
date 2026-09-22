import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Link,
    useParams,
} from 'react-router-dom';

import AddWorkoutExerciseDialog
    from '../components/workouts/AddWorkoutExerciseDialog';

import AddWorkoutSetDialog
    from '../components/workouts/AddWorkoutSetDialog';

import CompleteWorkoutDialog
    from '../components/workouts/CompleteWorkoutDialog';

import CompletedWorkoutNotice
    from '../components/workouts/CompletedWorkoutNotice';

import EditWorkoutDialog
    from '../components/workouts/EditWorkoutDialog';

import EditWorkoutSetDialog
    from '../components/workouts/EditWorkoutSetDialog';

import RemoveWorkoutExerciseDialog
    from '../components/workouts/RemoveWorkoutExerciseDialog';

import RemoveWorkoutSetDialog
    from '../components/workouts/RemoveWorkoutSetDialog';

import WorkoutExerciseCard
    from '../components/workouts/WorkoutExerciseCard';

import {
    addWorkoutExercise,
    addWorkoutSet,
    completeWorkout,
    getWorkoutById,
    removeWorkoutExercise,
    removeWorkoutSet,
    updateWorkout,
    updateWorkoutSet,
} from '../services/api';

import type {
    AddWorkoutExerciseRequest,
    CreateWorkoutSetRequest,
    UpdateWorkoutRequest,
    UpdateWorkoutSetRequest,
    Workout,
    WorkoutExercise,
    WorkoutSet,
} from '../types/workout';

import {
    formatDateTime,
} from '../utils/dateTime';

import '../styles/workouts.css';
import '../styles/workoutLogging.css';
import '../styles/completedWorkout.css';

interface WorkoutSetTarget {
    exercise: WorkoutExercise;
    set: WorkoutSet;
}

function WorkoutSessionPage() {
    const {
        workoutId,
    } = useParams<{
        workoutId: string;
    }>();

    const [
        workout,
        setWorkout,
    ] =
        useState<Workout | null>(
            null
        );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );

    const [
        isEditWorkoutOpen,
        setIsEditWorkoutOpen,
    ] = useState(false);

    const [
        isEditingWorkout,
        setIsEditingWorkout,
    ] = useState(false);

    const [
        editWorkoutError,
        setEditWorkoutError,
    ] =
        useState<string | null>(
            null
        );

    const [
        isCompleteWorkoutOpen,
        setIsCompleteWorkoutOpen,
    ] = useState(false);

    const [
        isCompletingWorkout,
        setIsCompletingWorkout,
    ] = useState(false);

    const [
        completeWorkoutError,
        setCompleteWorkoutError,
    ] =
        useState<string | null>(
            null
        );

    const [
        isAddExerciseOpen,
        setIsAddExerciseOpen,
    ] = useState(false);

    const [
        isAddingExercise,
        setIsAddingExercise,
    ] = useState(false);

    const [
        addExerciseError,
        setAddExerciseError,
    ] =
        useState<string | null>(
            null
        );

    const [
        exerciseToRemove,
        setExerciseToRemove,
    ] =
        useState<
            WorkoutExercise | null
        >(null);

    const [
        isRemovingExercise,
        setIsRemovingExercise,
    ] = useState(false);

    const [
        removeExerciseError,
        setRemoveExerciseError,
    ] =
        useState<string | null>(
            null
        );

    const [
        exerciseForSet,
        setExerciseForSet,
    ] =
        useState<
            WorkoutExercise | null
        >(null);

    const [
        isAddingSet,
        setIsAddingSet,
    ] = useState(false);

    const [
        addSetError,
        setAddSetError,
    ] =
        useState<string | null>(
            null
        );

    const [
        setToEdit,
        setSetToEdit,
    ] =
        useState<
            WorkoutSetTarget | null
        >(null);

    const [
        isEditingSet,
        setIsEditingSet,
    ] = useState(false);

    const [
        editSetError,
        setEditSetError,
    ] =
        useState<string | null>(
            null
        );

    const [
        setToRemove,
        setSetToRemove,
    ] =
        useState<
            WorkoutSetTarget | null
        >(null);

    const [
        isRemovingSet,
        setIsRemovingSet,
    ] = useState(false);

    const [
        removeSetError,
        setRemoveSetError,
    ] =
        useState<string | null>(
            null
        );

    useEffect(() => {
        if (!workoutId) {
            setError(
                'A workout ID was not provided.'
            );

            setIsLoading(false);

            return;
        }

        const controller =
            new AbortController();

        async function loadWorkout() {
            try {
                setIsLoading(true);
                setError(null);

                const response =
                    await getWorkoutById(
                        workoutId!,
                        controller.signal
                    );

                setWorkout(response);
            } catch (error) {
                if (
                    error instanceof
                    DOMException &&
                    error.name ===
                    'AbortError'
                ) {
                    return;
                }

                setError(
                    getErrorMessage(
                        error,
                        'Unable to load this workout.'
                    )
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setIsLoading(false);
                }
            }
        }

        void loadWorkout();

        return () => {
            controller.abort();
        };
    }, [workoutId]);

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

    const hasCompletedSet =
        useMemo(
            () =>
                workout?.exercises.some(
                    (exercise) =>
                        exercise.sets.some(
                            (set) =>
                                set.isCompleted
                        )
                ) ?? false,
            [workout]
        );

    const existingExerciseIds =
        useMemo(
            () =>
                workout?.exercises.map(
                    (exercise) =>
                        exercise.exerciseId
                ) ?? [],
            [workout]
        );

    async function refreshWorkout(
        currentWorkoutId: string
    ) {
        const refreshedWorkout =
            await getWorkoutById(
                currentWorkoutId
            );

        setWorkout(
            refreshedWorkout
        );
    }

    function openEditWorkoutDialog() {
        setEditWorkoutError(null);
        setIsEditWorkoutOpen(true);
    }

    function closeEditWorkoutDialog() {
        if (isEditingWorkout) {
            return;
        }

        setEditWorkoutError(null);
        setIsEditWorkoutOpen(false);
    }

    async function handleEditWorkout(
        request:
            UpdateWorkoutRequest
    ) {
        if (!workout) {
            return;
        }

        try {
            setIsEditingWorkout(true);
            setEditWorkoutError(null);

            const updatedWorkout =
                await updateWorkout(
                    workout.id,
                    request
                );

            setWorkout(
                updatedWorkout
            );

            setIsEditWorkoutOpen(
                false
            );
        } catch (error) {
            setEditWorkoutError(
                getErrorMessage(
                    error,
                    'Unable to update the workout.'
                )
            );
        } finally {
            setIsEditingWorkout(false);
        }
    }

    function openCompleteWorkoutDialog() {
        setCompleteWorkoutError(null);

        setIsCompleteWorkoutOpen(
            true
        );
    }

    function closeCompleteWorkoutDialog() {
        if (isCompletingWorkout) {
            return;
        }

        setCompleteWorkoutError(null);

        setIsCompleteWorkoutOpen(
            false
        );
    }

    async function handleCompleteWorkout() {
        if (!workout) {
            return;
        }

        try {
            setIsCompletingWorkout(
                true
            );

            setCompleteWorkoutError(
                null
            );

            const completedWorkout =
                await completeWorkout(
                    workout.id
                );

            setWorkout(
                completedWorkout
            );

            setIsCompleteWorkoutOpen(
                false
            );
        } catch (error) {
            setCompleteWorkoutError(
                getErrorMessage(
                    error,
                    'Unable to complete the workout.'
                )
            );
        } finally {
            setIsCompletingWorkout(
                false
            );
        }
    }

    function openAddExerciseDialog() {
        setAddExerciseError(null);
        setIsAddExerciseOpen(true);
    }

    function closeAddExerciseDialog() {
        if (isAddingExercise) {
            return;
        }

        setAddExerciseError(null);
        setIsAddExerciseOpen(false);
    }

    async function handleAddExercise(
        request:
            AddWorkoutExerciseRequest
    ) {
        if (!workout) {
            return;
        }

        try {
            setIsAddingExercise(true);
            setAddExerciseError(null);

            await addWorkoutExercise(
                workout.id,
                request
            );

            await refreshWorkout(
                workout.id
            );

            setIsAddExerciseOpen(false);
        } catch (error) {
            setAddExerciseError(
                getErrorMessage(
                    error,
                    'Unable to add the exercise.'
                )
            );
        } finally {
            setIsAddingExercise(false);
        }
    }

    function openRemoveExerciseDialog(
        exercise: WorkoutExercise
    ) {
        setRemoveExerciseError(null);

        setExerciseToRemove(
            exercise
        );
    }

    function closeRemoveExerciseDialog() {
        if (isRemovingExercise) {
            return;
        }

        setRemoveExerciseError(null);
        setExerciseToRemove(null);
    }

    async function handleRemoveExercise() {
        if (
            !workout ||
            !exerciseToRemove
        ) {
            return;
        }

        try {
            setIsRemovingExercise(true);
            setRemoveExerciseError(null);

            await removeWorkoutExercise(
                workout.id,
                exerciseToRemove.id
            );

            await refreshWorkout(
                workout.id
            );

            setExerciseToRemove(null);
        } catch (error) {
            setRemoveExerciseError(
                getErrorMessage(
                    error,
                    'Unable to remove the exercise.'
                )
            );
        } finally {
            setIsRemovingExercise(false);
        }
    }

    function openAddSetDialog(
        exercise: WorkoutExercise
    ) {
        setAddSetError(null);

        setExerciseForSet(
            exercise
        );
    }

    function closeAddSetDialog() {
        if (isAddingSet) {
            return;
        }

        setAddSetError(null);
        setExerciseForSet(null);
    }

    async function handleAddSet(
        request:
            CreateWorkoutSetRequest
    ) {
        if (
            !workout ||
            !exerciseForSet
        ) {
            return;
        }

        try {
            setIsAddingSet(true);
            setAddSetError(null);

            await addWorkoutSet(
                workout.id,
                exerciseForSet.id,
                request
            );

            await refreshWorkout(
                workout.id
            );

            setExerciseForSet(null);
        } catch (error) {
            setAddSetError(
                getErrorMessage(
                    error,
                    'Unable to add the set.'
                )
            );
        } finally {
            setIsAddingSet(false);
        }
    }

    function openEditSetDialog(
        exercise: WorkoutExercise,
        set: WorkoutSet
    ) {
        setEditSetError(null);

        setSetToEdit({
            exercise,
            set,
        });
    }

    function closeEditSetDialog() {
        if (isEditingSet) {
            return;
        }

        setEditSetError(null);
        setSetToEdit(null);
    }

    async function handleEditSet(
        request:
            UpdateWorkoutSetRequest
    ) {
        if (
            !workout ||
            !setToEdit
        ) {
            return;
        }

        try {
            setIsEditingSet(true);
            setEditSetError(null);

            await updateWorkoutSet(
                workout.id,
                setToEdit.exercise.id,
                setToEdit.set.id,
                request
            );

            await refreshWorkout(
                workout.id
            );

            setSetToEdit(null);
        } catch (error) {
            setEditSetError(
                getErrorMessage(
                    error,
                    'Unable to update the set.'
                )
            );
        } finally {
            setIsEditingSet(false);
        }
    }

    function openRemoveSetDialog(
        exercise: WorkoutExercise,
        set: WorkoutSet
    ) {
        setRemoveSetError(null);

        setSetToRemove({
            exercise,
            set,
        });
    }

    function closeRemoveSetDialog() {
        if (isRemovingSet) {
            return;
        }

        setRemoveSetError(null);
        setSetToRemove(null);
    }

    async function handleRemoveSet() {
        if (
            !workout ||
            !setToRemove
        ) {
            return;
        }

        try {
            setIsRemovingSet(true);
            setRemoveSetError(null);

            await removeWorkoutSet(
                workout.id,
                setToRemove.exercise.id,
                setToRemove.set.id
            );

            await refreshWorkout(
                workout.id
            );

            setSetToRemove(null);
        } catch (error) {
            setRemoveSetError(
                getErrorMessage(
                    error,
                    'Unable to remove the set.'
                )
            );
        } finally {
            setIsRemovingSet(false);
        }
    }

    if (isLoading) {
        return (
            <main className="app-shell">
                <section className="workout-state-panel">
                    <h1>
                        Loading workout...
                    </h1>

                    <p>
                        Retrieving the workout
                        session.
                    </p>
                </section>
            </main>
        );
    }

    if (
        error ||
        !workout
    ) {
        return (
            <main className="app-shell">
                <section
                    className="workout-state-panel workout-state-panel--error"
                    role="alert"
                >
                    <h1>
                        Workout couldn't be loaded
                    </h1>

                    <p>
                        {error ??
                            'The workout could not be found.'}
                    </p>

                    <Link
                        to="/workouts"
                        className="workout-text-link"
                    >
                        Return to Workouts
                    </Link>
                </section>
            </main>
        );
    }

    const isActive =
        workout.endedAtUtc === null;

    const backDestination =
        isActive
            ? '/workouts'
            : '/history';

    const backLabel =
        isActive
            ? 'Workouts'
            : 'Workout History';

    return (
        <>
            <main className="app-shell workout-session">
                <Link
                    to={backDestination}
                    className="workout-back-link"
                >
                    ← {backLabel}
                </Link>

                <header className="workout-session__header">
                    <div>
                        <div className="workout-summary-card__badges">
                            <span
                                className={
                                    isActive
                                        ? 'workout-status workout-status--active'
                                        : 'workout-status workout-status--completed'
                                }
                            >
                                {isActive
                                    ? 'Active'
                                    : 'Completed'}
                            </span>

                            <span className="workout-type-badge">
                                {workout.workoutType}
                            </span>
                        </div>

                        <h1>
                            {workout.name}
                        </h1>

                        {workout.notes && (
                            <p className="workout-session__notes">
                                {workout.notes}
                            </p>
                        )}
                    </div>

                    {isActive && (
                        <div className="workout-session__header-actions">
                            <div className="workout-session__header-button-row">
                                <button
                                    type="button"
                                    className="workout-button workout-button--secondary"
                                    onClick={
                                        openEditWorkoutDialog
                                    }
                                >
                                    Edit Workout
                                </button>

                                <button
                                    type="button"
                                    className="workout-button workout-button--primary"
                                    disabled={
                                        !hasCompletedSet
                                    }
                                    onClick={
                                        openCompleteWorkoutDialog
                                    }
                                >
                                    Complete Workout
                                </button>
                            </div>

                            {!hasCompletedSet && (
                                <span className="workout-session__completion-hint">
                                    Record at least one
                                    set before completing
                                    this workout.
                                </span>
                            )}
                        </div>
                    )}
                </header>

                {!isActive && (
                    <CompletedWorkoutNotice
                        completedAtUtc={
                            workout.endedAtUtc
                        }
                    />
                )}

                <section className="workout-session__summary">
                    <div>
                        <span>
                            Started
                        </span>

                        <strong>
                            {formatDateTime(
                                workout.startedAtUtc
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Exercises
                        </span>

                        <strong>
                            {
                                workout.exercises
                                    .length
                            }
                        </strong>
                    </div>

                    <div>
                        <span>
                            Sets
                        </span>

                        <strong>
                            {totalSetCount}
                        </strong>
                    </div>

                    {workout.endedAtUtc && (
                        <div>
                            <span>
                                Completed
                            </span>

                            <strong>
                                {formatDateTime(
                                    workout.endedAtUtc
                                )}
                            </strong>
                        </div>
                    )}
                </section>

                <section className="workout-session__exercises">
                    <header className="workout-section__header">
                        <div>
                            <p className="workout-section__eyebrow">
                                Session
                            </p>

                            <h2>
                                Exercises
                            </h2>
                        </div>

                        <div className="workout-section__actions">
                            <span className="workout-section__count">
                                {
                                    workout.exercises
                                        .length
                                }
                            </span>

                            {isActive && (
                                <button
                                    type="button"
                                    className="workout-button workout-button--primary"
                                    onClick={
                                        openAddExerciseDialog
                                    }
                                >
                                    Add Exercise
                                </button>
                            )}
                        </div>
                    </header>

                    {workout.exercises.length ===
                        0 ? (
                        <div className="workout-section__empty workout-session__empty">
                            <p>
                                No exercises have
                                been added to this
                                workout yet.
                            </p>

                            {isActive && (
                                <button
                                    type="button"
                                    className="workout-button workout-button--primary"
                                    onClick={
                                        openAddExerciseDialog
                                    }
                                >
                                    Add First Exercise
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="workout-session-exercise-list">
                            {workout.exercises.map(
                                (exercise) => (
                                    <WorkoutExerciseCard
                                        key={
                                            exercise.id
                                        }
                                        exercise={
                                            exercise
                                        }
                                        isActive={
                                            isActive
                                        }
                                        onAddSet={
                                            openAddSetDialog
                                        }
                                        onEditSet={
                                            openEditSetDialog
                                        }
                                        onRemoveSet={
                                            openRemoveSetDialog
                                        }
                                        onRemove={
                                            openRemoveExerciseDialog
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>
            </main>

            <EditWorkoutDialog
                isOpen={
                    isEditWorkoutOpen
                }
                workout={
                    workout
                }
                isSubmitting={
                    isEditingWorkout
                }
                error={
                    editWorkoutError
                }
                onClose={
                    closeEditWorkoutDialog
                }
                onSubmit={
                    handleEditWorkout
                }
            />

            <CompleteWorkoutDialog
                isOpen={
                    isCompleteWorkoutOpen
                }
                workout={
                    workout
                }
                isSubmitting={
                    isCompletingWorkout
                }
                error={
                    completeWorkoutError
                }
                onClose={
                    closeCompleteWorkoutDialog
                }
                onConfirm={
                    handleCompleteWorkout
                }
            />

            <AddWorkoutExerciseDialog
                isOpen={
                    isAddExerciseOpen
                }
                workoutType={
                    workout.workoutType
                }
                existingExerciseIds={
                    existingExerciseIds
                }
                isSubmitting={
                    isAddingExercise
                }
                error={
                    addExerciseError
                }
                onClose={
                    closeAddExerciseDialog
                }
                onSubmit={
                    handleAddExercise
                }
            />

            <RemoveWorkoutExerciseDialog
                isOpen={
                    exerciseToRemove !==
                    null
                }
                exercise={
                    exerciseToRemove
                }
                isSubmitting={
                    isRemovingExercise
                }
                error={
                    removeExerciseError
                }
                onClose={
                    closeRemoveExerciseDialog
                }
                onConfirm={
                    handleRemoveExercise
                }
            />

            <AddWorkoutSetDialog
                isOpen={
                    exerciseForSet !==
                    null
                }
                exercise={
                    exerciseForSet
                }
                isSubmitting={
                    isAddingSet
                }
                error={
                    addSetError
                }
                onClose={
                    closeAddSetDialog
                }
                onSubmit={
                    handleAddSet
                }
            />

            <EditWorkoutSetDialog
                isOpen={
                    setToEdit !==
                    null
                }
                exercise={
                    setToEdit?.exercise ??
                    null
                }
                set={
                    setToEdit?.set ??
                    null
                }
                isSubmitting={
                    isEditingSet
                }
                error={
                    editSetError
                }
                onClose={
                    closeEditSetDialog
                }
                onSubmit={
                    handleEditSet
                }
            />

            <RemoveWorkoutSetDialog
                isOpen={
                    setToRemove !==
                    null
                }
                exercise={
                    setToRemove?.exercise ??
                    null
                }
                set={
                    setToRemove?.set ??
                    null
                }
                isSubmitting={
                    isRemovingSet
                }
                error={
                    removeSetError
                }
                onClose={
                    closeRemoveSetDialog
                }
                onConfirm={
                    handleRemoveSet
                }
            />
        </>
    );
}

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    return (
        error instanceof Error &&
            error.message.trim().length >
            0
            ? error.message
            : fallback
    );
}

export default WorkoutSessionPage;
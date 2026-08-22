import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import './App.css';

import CreateExerciseDialog
    from './components/exercises/CreateExerciseDialog';

import ExerciseDetailsDialog
    from './components/exercises/ExerciseDetailsDialog';

import ExerciseFilters
    from './components/exercises/ExerciseFilters';

import ExerciseList
    from './components/exercises/ExerciseList';

import {
    createExercise,
    getExerciseById,
    getExercises,
} from './services/api';

import type {
    CreateExerciseRequest,
    Exercise,
    ExerciseType,
} from './types/exercise';

function App() {
    const [exercises, setExercises] =
        useState<Exercise[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [searchTerm, setSearchTerm] =
        useState('');

    const [selectedType, setSelectedType] =
        useState<ExerciseType | 'All'>('All');

    const [
        selectedMuscleGroup,
        setSelectedMuscleGroup,
    ] = useState('All');

    const [
        selectedEquipment,
        setSelectedEquipment,
    ] = useState('All');

    const [
        selectedExerciseId,
        setSelectedExerciseId,
    ] = useState<string | null>(null);

    const [
        selectedExercise,
        setSelectedExercise,
    ] = useState<Exercise | null>(null);

    const [
        isDetailsLoading,
        setIsDetailsLoading,
    ] = useState(false);

    const [
        detailsError,
        setDetailsError,
    ] = useState<string | null>(null);

    const [
        isCreateDialogOpen,
        setIsCreateDialogOpen,
    ] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadExercises() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getExercises(
                    false,
                    controller.signal
                );

                setExercises(data);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setError(
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred.'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadExercises();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (!selectedExerciseId) {
            return;
        }

        const controller = new AbortController();

        async function loadExerciseDetails() {
            try {
                setIsDetailsLoading(true);
                setDetailsError(null);
                setSelectedExercise(null);

                const exercise = await getExerciseById(
                    selectedExerciseId!,
                    controller.signal
                );

                setSelectedExercise(exercise);
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setDetailsError(
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred.'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsDetailsLoading(false);
                }
            }
        }

        loadExerciseDetails();

        return () => {
            controller.abort();
        };
    }, [selectedExerciseId]);

    const muscleGroups = useMemo(() => {
        const values = exercises
            .map(
                (exercise) =>
                    exercise.primaryMuscleGroup
            )
            .filter(
                (
                    muscleGroup
                ): muscleGroup is string =>
                    muscleGroup !== null
            );

        return [...new Set(values)].sort(
            (a, b) => a.localeCompare(b)
        );
    }, [exercises]);

    const equipmentOptions = useMemo(() => {
        const values = exercises
            .map(
                (exercise) =>
                    exercise.equipment
            )
            .filter(
                (
                    equipment
                ): equipment is string =>
                    equipment !== null
            );

        return [...new Set(values)].sort(
            (a, b) => a.localeCompare(b)
        );
    }, [exercises]);

    const filteredExercises = useMemo(() => {
        const normalizedSearchTerm =
            searchTerm.trim().toLowerCase();

        return exercises.filter((exercise) => {
            const matchesSearch =
                normalizedSearchTerm.length === 0 ||
                exercise.name
                    .toLowerCase()
                    .includes(normalizedSearchTerm);

            const matchesType =
                selectedType === 'All' ||
                exercise.exerciseType === selectedType;

            const matchesMuscleGroup =
                selectedMuscleGroup === 'All' ||
                exercise.primaryMuscleGroup ===
                selectedMuscleGroup;

            const matchesEquipment =
                selectedEquipment === 'All' ||
                exercise.equipment ===
                selectedEquipment;

            return (
                matchesSearch &&
                matchesType &&
                matchesMuscleGroup &&
                matchesEquipment
            );
        });
    }, [
        exercises,
        searchTerm,
        selectedType,
        selectedMuscleGroup,
        selectedEquipment,
    ]);

    function clearFilters() {
        setSearchTerm('');
        setSelectedType('All');
        setSelectedMuscleGroup('All');
        setSelectedEquipment('All');
    }

    function openExerciseDetails(
        exerciseId: string
    ) {
        setSelectedExerciseId(exerciseId);
    }

    function closeExerciseDetails() {
        setSelectedExerciseId(null);
        setSelectedExercise(null);
        setDetailsError(null);
        setIsDetailsLoading(false);
    }

    function openCreateExercise() {
        setIsCreateDialogOpen(true);
    }

    function closeCreateExercise() {
        setIsCreateDialogOpen(false);
    }

    async function handleCreateExercise(
        request: CreateExerciseRequest
    ) {
        const createdExercise =
            await createExercise(request);

        setExercises((currentExercises) =>
            [
                ...currentExercises,
                createdExercise,
            ].sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        );
    }

    return (
        <main className="app-shell">
            <header className="page-header">
                <div>
                    <p className="page-header__eyebrow">
                        Fitness Tracker
                    </p>

                    <h1>Exercise Library</h1>

                    <p className="page-header__description">
                        Browse the exercises available for
                        your workouts.
                    </p>
                </div>

                {!isLoading && !error && (
                    <div className="page-header__actions">
                        <div className="exercise-count">
                            <strong>{exercises.length}</strong>
                            <span>Exercises</span>
                        </div>

                        <button
                            type="button"
                            className="add-exercise-button"
                            onClick={openCreateExercise}
                        >
                            Create Exercise
                        </button>
                    </div>
                )}
            </header>

            {isLoading && (
                <div
                    className="status-panel"
                    role="status"
                >
                    <h2>Loading exercises...</h2>

                    <p>
                        Retrieving the exercise library
                        from the API.
                    </p>
                </div>
            )}

            {error && (
                <div
                    className="status-panel status-panel--error"
                    role="alert"
                >
                    <h2>Unable to load exercises</h2>
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    <ExerciseFilters
                        searchTerm={searchTerm}
                        selectedType={selectedType}
                        selectedMuscleGroup={
                            selectedMuscleGroup
                        }
                        selectedEquipment={
                            selectedEquipment
                        }
                        muscleGroups={muscleGroups}
                        equipmentOptions={
                            equipmentOptions
                        }
                        resultCount={
                            filteredExercises.length
                        }
                        totalCount={exercises.length}
                        onSearchTermChange={
                            setSearchTerm
                        }
                        onTypeChange={
                            setSelectedType
                        }
                        onMuscleGroupChange={
                            setSelectedMuscleGroup
                        }
                        onEquipmentChange={
                            setSelectedEquipment
                        }
                        onClearFilters={clearFilters}
                    />

                    <ExerciseList
                        exercises={filteredExercises}
                        onViewDetails={
                            openExerciseDetails
                        }
                    />
                </>
            )}

            {selectedExerciseId && (
                <ExerciseDetailsDialog
                    exercise={selectedExercise}
                    isLoading={isDetailsLoading}
                    error={detailsError}
                    onClose={closeExerciseDetails}
                />
            )}

            {isCreateDialogOpen && (
                <CreateExerciseDialog
                    muscleGroups={muscleGroups}
                    equipmentOptions={
                        equipmentOptions
                    }
                    onSubmit={
                        handleCreateExercise
                    }
                    onClose={
                        closeCreateExercise
                    }
                />
            )}
        </main>
    );
}

export default App;
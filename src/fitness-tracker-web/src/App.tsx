import { useEffect, useMemo, useState } from 'react';
import './App.css';

import ExerciseFilters from './components/exercises/ExerciseFilters';
import ExerciseList from './components/exercises/ExerciseList';
import { getExercises } from './services/api';
import type {
    Exercise,
    ExerciseType,
} from './types/exercise';

function App() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] =
        useState<ExerciseType | 'All'>('All');
    const [selectedMuscleGroup, setSelectedMuscleGroup] =
        useState('All');
    const [selectedEquipment, setSelectedEquipment] =
        useState('All');

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

    const muscleGroups = useMemo(() => {
        const values = exercises
            .map((exercise) => exercise.primaryMuscleGroup)
            .filter(
                (muscleGroup): muscleGroup is string =>
                    muscleGroup !== null
            );

        return [...new Set(values)].sort((a, b) =>
            a.localeCompare(b)
        );
    }, [exercises]);

    const equipmentOptions = useMemo(() => {
        const values = exercises
            .map((exercise) => exercise.equipment)
            .filter(
                (equipment): equipment is string =>
                    equipment !== null
            );

        return [...new Set(values)].sort((a, b) =>
            a.localeCompare(b)
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
                exercise.equipment === selectedEquipment;

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

    return (
        <main className="app-shell">
            <header className="page-header">
                <div>
                    <p className="page-header__eyebrow">
                        Fitness Tracker
                    </p>

                    <h1>Exercise Library</h1>

                    <p className="page-header__description">
                        Browse the exercises available for your workouts.
                    </p>
                </div>

                {!isLoading && !error && (
                    <div className="exercise-count">
                        <strong>{exercises.length}</strong>
                        <span>Exercises</span>
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
                        Retrieving the exercise library from the API.
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
                        selectedMuscleGroup={selectedMuscleGroup}
                        selectedEquipment={selectedEquipment}
                        muscleGroups={muscleGroups}
                        equipmentOptions={equipmentOptions}
                        resultCount={filteredExercises.length}
                        totalCount={exercises.length}
                        onSearchTermChange={setSearchTerm}
                        onTypeChange={setSelectedType}
                        onMuscleGroupChange={setSelectedMuscleGroup}
                        onEquipmentChange={setSelectedEquipment}
                        onClearFilters={clearFilters}
                    />

                    <ExerciseList exercises={filteredExercises} />
                </>
            )}
        </main>
    );
}

export default App;
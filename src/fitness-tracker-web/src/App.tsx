import { useEffect, useState } from 'react';
import './App.css';

import ExerciseList from './components/exercises/ExerciseList';
import { getExercises } from './services/api';
import type { Exercise } from './types/exercise';

function App() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <ExerciseList exercises={exercises} />
            )}
        </main>
    );
}

export default App;
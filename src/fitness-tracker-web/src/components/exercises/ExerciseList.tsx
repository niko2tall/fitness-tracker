import type { Exercise } from '../../types/exercise';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
    exercises: Exercise[];
}

function ExerciseList({ exercises }: ExerciseListProps) {
    if (exercises.length === 0) {
        return (
            <div className="empty-state">
                <h2>No exercises found</h2>
                <p>
                    Exercises will appear here once they are available.
                </p>
            </div>
        );
    }

    return (
        <section
            className="exercise-grid"
            aria-label="Exercise library"
        >
            {exercises.map((exercise) => (
                <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                />
            ))}
        </section>
    );
}

export default ExerciseList;
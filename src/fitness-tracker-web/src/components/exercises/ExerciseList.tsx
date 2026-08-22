import type { Exercise } from '../../types/exercise';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
    exercises: Exercise[];
    onViewDetails: (exerciseId: string) => void;
}

function ExerciseList({ exercises, onViewDetails }: ExerciseListProps) {
    if (exercises.length === 0) {
        return (
            <div className="empty-state">
                <h2>No exercises found</h2>
                <p>
                    Try adjusting your search or filters.
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
                    onViewDetails={onViewDetails}
                />
            ))}
        </section>
    );
}

export default ExerciseList;
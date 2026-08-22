import type { Exercise } from '../../types/exercise';

interface ExerciseCardProps {
    exercise: Exercise;
}

function ExerciseCard({ exercise }: ExerciseCardProps) {
    return (
        <article className="exercise-card">
            <div className="exercise-card__header">
                <div>
                    <h3>{exercise.name}</h3>

                    <span className="exercise-card__type">
                        {exercise.exerciseType}
                    </span>
                </div>

                {exercise.isCustom && (
                    <span className="exercise-card__custom">
                        Custom
                    </span>
                )}
            </div>

            <dl className="exercise-card__details">
                <div>
                    <dt>Tracking</dt>
                    <dd>{formatTrackingType(exercise.trackingType)}</dd>
                </div>

                <div>
                    <dt>Muscle Group</dt>
                    <dd>{exercise.primaryMuscleGroup ?? 'Not specified'}</dd>
                </div>

                <div>
                    <dt>Equipment</dt>
                    <dd>{exercise.equipment ?? 'Not specified'}</dd>
                </div>
            </dl>
        </article>
    );
}

function formatTrackingType(
    trackingType: Exercise['trackingType']
): string {
    switch (trackingType) {
        case 'WeightAndReps':
            return 'Weight & Reps';

        case 'RepsOnly':
            return 'Reps';

        case 'Duration':
            return 'Duration';

        case 'DistanceAndDuration':
            return 'Distance & Duration';

        default:
            return trackingType;
    }
}

export default ExerciseCard;
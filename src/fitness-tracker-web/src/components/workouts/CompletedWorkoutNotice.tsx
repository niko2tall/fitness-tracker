import {
    Link,
} from 'react-router-dom';

import {
    formatDateTime,
} from '../../utils/dateTime';

interface CompletedWorkoutNoticeProps {
    completedAtUtc: string | null;
}

function CompletedWorkoutNotice({
    completedAtUtc,
}: CompletedWorkoutNoticeProps) {
    if (!completedAtUtc) {
        return null;
    }

    return (
        <section
            className="completed-workout-notice"
            aria-labelledby="completed-workout-notice-title"
        >
            <div className="completed-workout-notice__content">
                <div>
                    <p className="completed-workout-notice__eyebrow">
                        Historical Record
                    </p>

                    <h2 id="completed-workout-notice-title">
                        This workout is complete
                    </h2>

                    <p className="completed-workout-notice__description">
                        Completed workouts are kept
                        read-only so your recorded
                        training history stays
                        consistent.
                    </p>

                    <p className="completed-workout-notice__timestamp">
                        Completed{' '}
                        {formatDateTime(
                            completedAtUtc
                        )}
                    </p>
                </div>

                <Link
                    to="/history"
                    className="completed-workout-notice__link"
                >
                    Return to Workout History
                </Link>
            </div>
        </section>
    );
}

export default CompletedWorkoutNotice;
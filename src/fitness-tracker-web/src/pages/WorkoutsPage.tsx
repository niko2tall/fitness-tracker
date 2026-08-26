function WorkoutsPage() {
    return (
        <main className="app-shell">
            <header className="page-header">
                <div>
                    <p className="page-header__eyebrow">
                        Workout Management
                    </p>

                    <h1>Workouts</h1>

                    <p className="page-header__description">
                        Create, log, and review workout sessions.
                    </p>
                </div>
            </header>

            <section className="status-panel">
                <h2>Workout tracking is next</h2>

                <p>
                    The workout data model already exists.
                    The next development phase will build the
                    API and React workflow for logging workout
                    exercises and sets.
                </p>
            </section>
        </main>
    );
}

export default WorkoutsPage;
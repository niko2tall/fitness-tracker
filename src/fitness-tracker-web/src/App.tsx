import { useEffect, useState } from 'react';
import { getHealth } from './services/api';
import type { HealthResponse } from './services/api';

function App() {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getHealth()
            .then(setHealth)
            .catch((err: Error) => setError(err.message));
    }, []);

    return (
        <main>
            <h1>Fitness Tracker</h1>

            {health && (
                <div>
                    <p>API Status: {health.status}</p>
                    <p>Application: {health.application}</p>
                </div>
            )}

            {error && <p>API Error: {error}</p>}
        </main>
    );
}

export default App;
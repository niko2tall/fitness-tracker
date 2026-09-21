import {
    Route,
    Routes,
} from 'react-router-dom';

import './App.css';

import AppLayout
    from './components/layout/AppLayout';

import DashboardPage
    from './pages/DashboardPage';

import ExercisesPage
    from './pages/ExercisesPage';

import NotFoundPage
    from './pages/NotFoundPage';

import WorkoutsPage
    from './pages/WorkoutsPage';

import WorkoutSessionPage
    from './pages/WorkoutSessionPage';

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route
                    path="/"
                    element={<DashboardPage />}
                />

                <Route
                    path="/exercises"
                    element={<ExercisesPage />}
                />

                <Route
                    path="/workouts"
                    element={<WorkoutsPage />}
                />

                <Route
                    path="/workouts/:workoutId"
                    element={<WorkoutSessionPage />}
                />

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Route>
        </Routes>
    );
}

export default App;
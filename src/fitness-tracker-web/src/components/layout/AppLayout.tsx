import {
    NavLink,
    Outlet,
} from 'react-router-dom';

function AppLayout() {
    return (
        <>
            <header className="app-navigation">
                <div className="app-navigation__inner">
                    <NavLink
                        to="/"
                        className="app-navigation__brand"
                    >
                        Fitness Tracker
                    </NavLink>

                    <nav
                        className="app-navigation__links"
                        aria-label="Main navigation"
                    >
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? 'app-navigation__link app-navigation__link--active'
                                    : 'app-navigation__link'
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/exercises"
                            className={({ isActive }) =>
                                isActive
                                    ? 'app-navigation__link app-navigation__link--active'
                                    : 'app-navigation__link'
                            }
                        >
                            Exercises
                        </NavLink>

                        <NavLink
                            to="/workouts"
                            className={({ isActive }) =>
                                isActive
                                    ? 'app-navigation__link app-navigation__link--active'
                                    : 'app-navigation__link'
                            }
                        >
                            Workouts
                        </NavLink>
                    </nav>
                </div>
            </header>

            <Outlet />
        </>
    );
}

export default AppLayout;
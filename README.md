# Fitness Tracker

A full-stack fitness tracking application for logging strength and cardio workouts, managing reusable exercises, recording workout performance, and reviewing training history.

The project is built as a portfolio application with a separate ASP.NET Core Web API and React frontend so the backend can eventually support multiple clients, including the current web app and a future PWA or native client.

## Current Status

Exercise Management is complete end-to-end. The initial Workout Logging phase is also complete end-to-end, and the application now includes a dedicated Workout History experience for completed sessions.

### Completed

- ASP.NET Core Web API and React + TypeScript + Vite applications
- HTTPS development setup, fixed local ports, CORS, OpenAPI, and Scalar
- EF Core + SQLite persistence with migrations and seed data
- Core fitness domain model and relational configuration
- Built-in Exercise library with stable seeded IDs
- Exercise API, validation, and custom Exercise CRUD/archive workflows
- Exercise Library UI with search, filtering, details, create/edit/archive flows
- React Router application structure and responsive navigation
- Development current-user abstraction for pre-authentication ownership
- Workout DTOs, service layer, and REST API
- Workout creation, retrieval, update, and completion
- Exercise assignment/removal within active Workouts
- Tracking-specific Workout Set creation
- Workout Set editing/removal with server-side renumbering
- Server-controlled ownership, ordering, timestamps, and lifecycle state
- Frontend API client split into shared and feature-specific modules
- Active Workout list and creation workflow
- Dedicated Workout Session route
- Workout Exercise search and compatibility filtering
- Tracking-specific React Set forms for Weight + Reps, Reps Only, Duration, and Distance + Duration
- User-friendly kilometre/minute/second inputs with canonical metre/second persistence
- Active Workout Set correction controls
- Active Workout metadata editing for name, type, and notes
- Workout-type options constrained by Exercises already in the session
- Workout completion confirmation and lifecycle transition in React
- Completed Workouts become read-only in the normal logging UI
- Dedicated Workout History route for completed sessions
- Completed Workout cards link back to read-only session details
- Dashboard and Workouts page provide direct access to Workout History
- Responsive Workout list, session, Exercise, Set, edit, completion, and history flows

## Currently In Development

The current development focus is the Workout History phase:

- Workout-history filtering
- Date navigation
- Workout summary metrics
- Workout-duration display
- Historical editing policy
- Progress tracking and personal-record features
- Body-measurement tracking
- Authentication
- PWA/mobile enhancements
- Deployment

---

## Technology Stack

### Backend

- C#
- .NET 10
- ASP.NET Core Web API
- Controller-based REST endpoints
- Entity Framework Core
- SQLite
- OpenAPI
- Scalar

### Frontend

- React
- TypeScript
- Vite
- React Router
- HTML
- CSS
- Fetch API

### Development Tools

- Visual Studio 2026
- Visual Studio Code
- EF Core CLI
- Git
- GitHub
- Node.js
- npm

---

## Architecture

```text
React / TypeScript
        |
        | HTTPS / JSON
        v
ASP.NET Core Web API
        |
        | EF Core
        v
      SQLite
```

The API owns validation, business rules, ownership enforcement, lifecycle state, persistence, resource identifiers, ordering, and timestamps.

React owns presentation, user interaction, local UI state, user-friendly unit entry, and typed API calls.

The backend remains independent of the current React client so the same API can support future clients such as a PWA or native mobile application.

---

## Project Structure

```text
fitness-tracker
├── FitnessTracker.slnx
│
├── src
│   ├── FitnessTracker.Api
│   │   ├── Controllers
│   │   │   ├── ExercisesController.cs
│   │   │   ├── HealthController.cs
│   │   │   └── WorkoutsController.cs
│   │   ├── Data
│   │   │   ├── Seed
│   │   │   │   └── ExerciseSeedData.cs
│   │   │   ├── DevelopmentDataInitializer.cs
│   │   │   ├── FitnessTrackerDbContext.cs
│   │   │   └── FitnessTracker.db
│   │   ├── Development
│   │   │   └── DevelopmentUser.cs
│   │   ├── DTOs
│   │   │   ├── Exercises
│   │   │   │   ├── CreateExerciseDto.cs
│   │   │   │   ├── ExerciseResponseDto.cs
│   │   │   │   └── UpdateExerciseDto.cs
│   │   │   └── Workouts
│   │   │       ├── AddWorkoutExerciseDto.cs
│   │   │       ├── CreateWorkoutDto.cs
│   │   │       ├── CreateWorkoutSetDto.cs
│   │   │       ├── UpdateWorkoutDto.cs
│   │   │       ├── UpdateWorkoutSetDto.cs
│   │   │       ├── WorkoutExerciseResponseDto.cs
│   │   │       ├── WorkoutResponseDto.cs
│   │   │       ├── WorkoutSetResponseDto.cs
│   │   │       └── WorkoutSummaryDto.cs
│   │   ├── Migrations
│   │   │   ├── <timestamp>_InitialCreate.cs
│   │   │   ├── <timestamp>_SeedBuiltInExercises.cs
│   │   │   └── FitnessTrackerDbContextModelSnapshot.cs
│   │   ├── Models
│   │   │   ├── Enums
│   │   │   │   ├── DistanceUnit.cs
│   │   │   │   ├── ExerciseTrackingType.cs
│   │   │   │   ├── ExerciseType.cs
│   │   │   │   ├── SetType.cs
│   │   │   │   ├── WeightUnit.cs
│   │   │   │   └── WorkoutType.cs
│   │   │   ├── ApplicationUser.cs
│   │   │   ├── BodyMeasurement.cs
│   │   │   ├── Exercise.cs
│   │   │   ├── Workout.cs
│   │   │   ├── WorkoutExercise.cs
│   │   │   └── WorkoutSet.cs
│   │   ├── Services
│   │   │   ├── Exercises
│   │   │   │   ├── ExerciseService.cs
│   │   │   │   └── IExerciseService.cs
│   │   │   ├── Users
│   │   │   │   ├── DevelopmentCurrentUserService.cs
│   │   │   │   └── ICurrentUserService.cs
│   │   │   └── Workouts
│   │   │       ├── IWorkoutService.cs
│   │   │       └── WorkoutService.cs
│   │   ├── Properties
│   │   │   └── launchSettings.json
│   │   ├── appsettings.json
│   │   ├── FitnessTracker.Api.csproj
│   │   └── Program.cs
│   │
│   └── fitness-tracker-web
│       ├── src
│       │   ├── components
│       │   │   ├── exercises
│       │   │   │   └── ...
│       │   │   ├── layout
│       │   │   │   └── AppLayout.tsx
│       │   │   └── workouts
│       │   │       ├── AddWorkoutExerciseDialog.tsx
│       │   │       ├── AddWorkoutSetDialog.tsx
│       │   │       ├── CompleteWorkoutDialog.tsx
│       │   │       ├── CreateWorkoutDialog.tsx
│       │   │       ├── EditWorkoutDialog.tsx
│       │   │       ├── EditWorkoutSetDialog.tsx
│       │   │       ├── RemoveWorkoutExerciseDialog.tsx
│       │   │       ├── RemoveWorkoutSetDialog.tsx
│       │   │       ├── WorkoutExerciseCard.tsx
│       │   │       └── WorkoutSummaryCard.tsx
│       │   ├── pages
│       │   │   ├── DashboardPage.tsx
│       │   │   ├── ExercisesPage.tsx
│       │   │   ├── NotFoundPage.tsx
│       │   │   ├── WorkoutHistoryPage.tsx
│       │   │   ├── WorkoutsPage.tsx
│       │   │   └── WorkoutSessionPage.tsx
│       │   ├── services
│       │   │   ├── api.ts
│       │   │   ├── apiClient.ts
│       │   │   ├── exercisesApi.ts
│       │   │   ├── healthApi.ts
│       │   │   └── workoutsApi.ts
│       │   ├── styles
│       │   │   ├── workoutHistory.css
│       │   │   ├── workoutLogging.css
│       │   │   └── workouts.css
│       │   ├── types
│       │   │   ├── exercise.ts
│       │   │   └── workout.ts
│       │   ├── utils
│       │   │   └── dateTime.ts
│       │   ├── App.css
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── .env.development
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── .gitignore
└── README.md
```

`FitnessTracker.db` is a local development artifact and is ignored by Git.

---

## Domain Model

### ApplicationUser

Owns Workouts, BodyMeasurements, and custom Exercises.

### Exercise

A reusable Strength or Cardio Exercise definition. Exercises can be built-in, custom, active, or archived.

### Workout

A training session containing:

- Name
- Workout type
- Start time
- Optional completion time
- Notes
- Creation/update timestamps
- Ordered WorkoutExercises

### WorkoutExercise

An explicit relationship between a Workout and Exercise. It stores Workout order, optional notes, and WorkoutSets.

### WorkoutSet

One recorded performance entry containing values appropriate for the Exercise TrackingType.

### BodyMeasurement

Represents body measurements recorded over time. API/UI support is planned for a later phase.

---

## Exercise Tracking Types

```text
WeightAndReps
RepsOnly
Duration
DistanceAndDuration
```

### WeightAndReps

Requires weight in kilograms and repetitions.

### RepsOnly

Requires repetitions.

### Duration

Requires duration in seconds at the API/storage boundary. React uses minute/second inputs.

### DistanceAndDuration

Requires distance in metres and duration in seconds at the API/storage boundary. React uses kilometre plus minute/second inputs.

---

## Workout Types

```text
Strength
Cardio
Mixed
```

Rules:

- Strength Workouts accept Strength Exercises
- Cardio Workouts accept Cardio Exercises
- Mixed Workouts accept both
- Workout type can only be changed while the Workout is active
- React disables incompatible type choices
- The API independently validates the same compatibility rules

---

## Workout Lifecycle

```text
Create Workout
      ↓
Active
      ↓
Add / remove Exercises
      ↓
Add / edit / remove Sets
      ↓
Edit Workout metadata
      ↓
Complete Workout
      ↓
Completed / read-only
      ↓
Workout History
```

A Workout must contain at least one completed Set before completion.

After completion, the normal logging API rejects further Workout, Exercise, and Set mutations.

---

## Design Decisions

- Separate API and frontend
- DTO separation between API contracts and EF Core entities
- Thin controllers with business rules in services
- Server-controlled ownership
- Canonical kilograms, metres, and seconds
- UTC persistence with browser-local display
- Calculated values are derived instead of duplicated in storage
- Soft Exercise archiving preserves historical references
- Completed Workouts are read-only to normal logging operations
- Server-assigned WorkoutExercise ordering and WorkoutSet numbering
- Backend validation remains authoritative
- Tracking-specific forms avoid irrelevant inputs
- Friendly UI units are converted to canonical API units
- React reloads nested Workout state after nested mutations
- Workout-level update/completion responses replace the current Workout state directly
- Active Workout management and completed Workout history use separate frontend pages

---

## Database

### Provider

SQLite

### Connection String

```text
Data Source=Data/FitnessTracker.db
```

### Tables

```text
Users
Exercises
Workouts
WorkoutExercises
WorkoutSets
BodyMeasurements
__EFMigrationsHistory
```

### Delete Behaviors

- User → Workouts: Cascade
- User → BodyMeasurements: Cascade
- User → CustomExercises: SetNull
- Workout → WorkoutExercises: Cascade
- WorkoutExercise → WorkoutSets: Cascade
- Exercise → WorkoutExercises: Restrict

### Important Indexes

- Workout `(UserId, StartedAtUtc)`
- WorkoutExercise unique `(WorkoutId, OrderIndex)`
- WorkoutSet unique `(WorkoutExerciseId, SetNumber)`
- BodyMeasurement `(UserId, RecordedAtUtc)`
- Exercise `CreatedByUserId`
- Exercise `(Name, IsArchived)`

---

## Database Migrations

Current migrations:

```text
InitialCreate
SeedBuiltInExercises
```

---

## Workout API

Base route:

```http
/api/workouts
```

Supported operations:

```http
GET    /api/workouts
GET    /api/workouts/{id}
POST   /api/workouts
PUT    /api/workouts/{workoutId}

POST   /api/workouts/{workoutId}/exercises
DELETE /api/workouts/{workoutId}/exercises/{workoutExerciseId}

POST   /api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets
PUT    /api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets/{setId}
DELETE /api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets/{setId}

POST   /api/workouts/{workoutId}/complete
```

The current history page reuses the existing Workout summary endpoint and filters for completed Workouts in React. More advanced server-side history queries can be introduced later if the history dataset grows.

---

## Frontend Routes

```text
/
Dashboard

/exercises
Exercise Library

/workouts
Active Workout management and Workout creation

/workouts/{workoutId}
Workout session details and logging workflow

/history
Completed Workout history
```

---

## Current React Features

### Exercise Library

Supports built-in/custom Exercises, search/filtering, details, custom creation/edit/archive, validation feedback, and responsive layouts.

### Active Workouts

Supports:

- Workout creation
- Active Workout summaries
- Dedicated session routing
- Exercise assignment/removal
- Exercise search and compatibility filtering
- Tracking-specific Set creation/editing
- Set removal with confirmation
- Workout metadata editing
- Workout completion
- Read-only lifecycle transition after completion

### Workout History

Supports:

- Dedicated `/history` route
- Completed Workouts only
- Completed Workout count
- Read-only session links
- Empty history state
- Navigation back to active Workouts
- Responsive card layout

---

## Local Development URLs

### React

```text
http://localhost:5173
```

### API HTTPS

```text
https://localhost:7081
```

### API HTTP

```text
http://localhost:5081
```

### OpenAPI JSON

```text
https://localhost:7081/openapi/v1.json
```

### Scalar

```text
https://localhost:7081/scalar
```

---

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js
- npm
- Git

The project is currently developed with .NET SDK 10.0.400.

### Clone

```powershell
git clone https://github.com/niko2tall/fitness-tracker.git
cd fitness-tracker
```

### Restore Backend

```powershell
dotnet restore
```

### Trust Development Certificate

```powershell
dotnet dev-certs https --trust
```

### Apply Database Migrations

```powershell
cd src/FitnessTracker.Api
dotnet ef database update
```

### Run API

```powershell
dotnet run --launch-profile https
```

### Install and Run Frontend

In another terminal:

```powershell
cd src/fitness-tracker-web
npm install
npm run dev
```

`src/fitness-tracker-web/.env.development` should contain:

```text
VITE_API_BASE_URL=https://localhost:7081
```

---

## Building

### Backend

```powershell
dotnet build .\FitnessTracker.slnx
```

### Frontend

```powershell
cd src/fitness-tracker-web
npm run build
```

---

## Roadmap

### Phase 1 — Project Foundation

- [x] Repository, solution, API, React frontend, HTTPS, CORS, OpenAPI, Scalar

### Phase 2 — Domain and Database

- [x] Core domain model, EF Core, SQLite, migrations, relationships, seed data

### Phase 3 — Exercise Management API

- [x] Exercise DTOs, service, validation, CRUD/archive API

### Phase 4 — Exercise Frontend

- [x] Exercise Library, search/filtering, details, create/edit/archive

### Phase 5 — Application Structure

- [x] React Router, shared layout, Dashboard, feature routes, responsive navigation

### Phase 6 — Workout Logging

- [x] Workout backend lifecycle
- [x] Workout API client
- [x] Workout creation
- [x] Exercise assignment/removal
- [x] Tracking-specific Set logging
- [x] Set editing/removal
- [x] Workout editing/completion
- [x] Initial React Workout logging interface

### Phase 7 — Workout History

- [x] Build dedicated Workout history experience
- [ ] Add filtering and date navigation
- [ ] Add useful Workout summary metrics
- [ ] Add Workout-duration display
- [ ] Decide whether historical Workout editing is supported

### Phase 8 — Progress Tracking

- [ ] Personal-record detection
- [ ] Strength progress charts
- [ ] Exercise history
- [ ] Body-measurement API
- [ ] Body-measurement UI
- [ ] Body-weight charts
- [ ] Additional progress metrics

### Phase 9 — Authentication

- [ ] Authentication
- [ ] Registration/login
- [ ] Replace development current-user implementation
- [ ] User-owned Exercise/resource scoping

### Phase 10 — Mobile / PWA

- [ ] Web app manifest
- [ ] Installable PWA behavior
- [ ] Touch interaction review
- [ ] Offline/error handling
- [ ] Mobile Workout logging polish

### Phase 11 — Deployment

- [ ] Production hosting/database strategy
- [ ] Production environment configuration
- [ ] SPA route fallback
- [ ] API/frontend deployment
- [ ] Live project URL

---

## Git Workflow

Major milestones include:

```text
Set up ASP.NET Core API and React frontend
Add core fitness tracker domain models
Add comprehensive project README
Add EF Core database context and model configuration
Configure SQLite database integration
Add initial database migration
Seed built-in exercise library
Add exercise API DTOs
Add exercise service layer
Add exercise read API endpoints
Add exercise write API endpoints
Add React exercise library
Add exercise search and filtering
Add exercise detail view
Add custom exercise creation UI
Complete exercise management frontend
Add application routing and navigation
Add workout API DTOs
Add workout service foundation
Add initial workout API endpoints
Add workout exercise assignment
Add workout set logging
Add workout completion workflow
Add active workout correction operations
Add frontend workout API client
Add workout list and creation UI
Add active workout exercise management
Add tracking-specific workout set entry
Add workout set correction controls
Add workout editing and completion UI
Add dedicated workout history
```

---

## Portfolio Status

The application currently demonstrates full-stack architecture, REST API design, relational modeling, EF Core migrations and seed data, DTO/service-layer patterns, server-controlled resource ownership, business-rule validation, React Router, responsive React UI development, canonical-unit conversion, lifecycle-aware UI behavior, nested resource mutation, destructive-action confirmation workflows, and Git-based incremental development.

Exercise Management and the initial Workout Logging workflow are complete end-to-end. Completed Workouts now also have a dedicated history page, establishing the foundation for filtering, date navigation, summary metrics, and future progress analysis.

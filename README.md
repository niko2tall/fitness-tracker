# Fitness Tracker

A full-stack fitness tracking application for logging strength and cardio workouts, managing reusable exercises, recording workout performance, and reviewing training history.

The project is built as a portfolio application with a separate ASP.NET Core Web API and React frontend so the backend can eventually support multiple clients, including the current web app and a future PWA or native client.

## Current Status

Exercise Management is complete end-to-end. Workout Logging now has a complete initial backend lifecycle and a nearly complete active-workout React experience, including workout creation, exercise management, tracking-specific set logging, set correction, workout editing, and workout completion.

### Completed

- ASP.NET Core Web API and React + TypeScript + Vite applications
- HTTPS development setup, fixed local ports, CORS, OpenAPI, and Scalar
- EF Core + SQLite persistence with migrations and seed data
- Core fitness domain model and relational configuration
- Built-in Exercise library with stable seeded IDs
- Exercise API, validation, custom Exercise CRUD/archive workflows
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
- Workout list and active/completed grouping
- Dedicated Workout Session route
- Workout Exercise search and compatibility filtering
- Tracking-specific React Set forms for Weight + Reps, Reps Only, Duration, and Distance + Duration
- User-friendly kilometre/minute/second inputs with canonical metre/second persistence
- Active Workout Set correction controls
- Active Workout metadata editing for name, type, and notes
- Workout-type options constrained by Exercises already in the session
- Workout completion confirmation and lifecycle transition in React
- Completed Workouts become read-only in the normal logging UI
- Responsive Workout list, session, Exercise, Set, edit, and completion flows

## Currently In Development

The current development focus is on polishing the completed Workout Logging phase and preparing the next application areas:

- Final active-session interaction polish
- Dedicated Workout History experience
- Workout-history filtering and summary metrics
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
│       │   │   │   ├── ArchiveExerciseDialog.tsx
│       │   │   │   ├── CreateExerciseDialog.tsx
│       │   │   │   ├── EditExerciseDialog.tsx
│       │   │   │   ├── ExerciseCard.tsx
│       │   │   │   ├── ExerciseDetailsDialog.tsx
│       │   │   │   ├── ExerciseFilters.tsx
│       │   │   │   └── ExerciseList.tsx
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
│       │   │   ├── WorkoutsPage.tsx
│       │   │   └── WorkoutSessionPage.tsx
│       │   ├── services
│       │   │   ├── api.ts
│       │   │   ├── apiClient.ts
│       │   │   ├── exercisesApi.ts
│       │   │   ├── healthApi.ts
│       │   │   └── workoutsApi.ts
│       │   ├── styles
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

Authentication has not yet been implemented. A server-controlled development user provides pre-authentication Workout ownership.

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

An explicit relationship between a Workout and an Exercise. It stores Workout order, optional notes, and WorkoutSets.

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
- React disables type choices that conflict with Exercises already in the session
- The API independently validates the same compatibility rules

---

## Set Types

```text
Warmup
Working
Drop
Failure
```

Current Cardio performance entries use `Working`.

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
```

The API controls `StartedAtUtc`, `EndedAtUtc`, `CreatedAtUtc`, and `UpdatedAtUtc`.

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
- React reloads nested Workout state after nested Exercise/Set mutations
- Workout-level update/completion responses replace the current Workout state directly

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

## Exercise API

Base route:

```http
/api/exercises
```

Supported operations:

```http
GET    /api/exercises
GET    /api/exercises/{id}
POST   /api/exercises
PUT    /api/exercises/{id}
DELETE /api/exercises/{id}
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

### Workout Update

The client can update:

- Name
- WorkoutType
- Notes

IDs, ownership, lifecycle timestamps, and nested resources remain server-controlled.

### Workout Completion

Completion requires at least one completed Set.

Successful completion populates `EndedAtUtc` and returns the updated Workout.

React immediately transitions the session into a read-only completed state.

---

## API Error Handling

Typical responses:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
```

The React API client parses ASP.NET Core Problem Details and validation responses.

---

## Frontend API Layer

```text
apiClient.ts
├── Base URL configuration
├── fetch wrapper
├── HTTP status checking
└── ProblemDetails parsing

healthApi.ts
└── Health endpoint

exercisesApi.ts
└── Exercise endpoints

workoutsApi.ts
└── Workout endpoints
```

`api.ts` acts as a barrel export.

---

## Frontend Routes

```text
/
Dashboard

/exercises
Exercise Library

/workouts
Workout list and creation

/workouts/{workoutId}
Workout session details and logging workflow
```

---

## Current React Features

### Dashboard

Navigation into Exercise Management and Workout Tracking.

### Exercise Library

Supports built-in/custom Exercises, search/filtering, details, custom creation/edit/archive, validation feedback, and responsive layouts.

### Workouts

Supports:

- Workout summaries with Active and Completed grouping
- Workout creation
- Dedicated session routing
- Full nested Workout retrieval
- Exercise assignment/removal
- Exercise search and compatibility filtering
- Tracking-specific Set creation
- Tracking-specific Set editing
- Set removal with confirmation
- Strength SetType selection
- Cardio Working-only SetType behavior
- Optional RPE and Set notes
- Canonical unit conversion
- Server-renumbered Set numbers after deletion
- Workout name/type/notes editing
- Compatibility-aware WorkoutType selection
- Workout completion confirmation
- Immediate Active → Completed lifecycle transition
- Read-only Completed Workout display
- Responsive layouts

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

### Health

```text
https://localhost:7081/api/health
```

### Exercise API

```text
https://localhost:7081/api/exercises
```

### Workout API

```text
https://localhost:7081/api/workouts
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

### Install Frontend Packages

In another terminal:

```powershell
cd src/fitness-tracker-web
npm install
```

### Frontend Environment

`src/fitness-tracker-web/.env.development`:

```text
VITE_API_BASE_URL=https://localhost:7081
```

### Run React

```powershell
npm run dev
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

- [x] Create GitHub repository
- [x] Create solution
- [x] Create ASP.NET Core API
- [x] Create React + TypeScript + Vite frontend
- [x] Configure HTTPS
- [x] Configure development ports
- [x] Configure CORS
- [x] Create health endpoint
- [x] Configure OpenAPI
- [x] Configure Scalar
- [x] Add project README

### Phase 2 — Domain and Database

- [x] Design core domain model
- [x] Add domain enums
- [x] Add EF Core
- [x] Add SQLite
- [x] Create DbContext
- [x] Configure relationships
- [x] Configure delete behaviors
- [x] Configure indexes
- [x] Configure enum storage
- [x] Create initial migration
- [x] Create local database
- [x] Verify migration history
- [x] Seed built-in Exercise library

### Phase 3 — Exercise Management API

- [x] Create Exercise DTOs
- [x] Create Exercise service
- [x] Add Exercise read endpoints
- [x] Add Exercise create endpoint
- [x] Add Exercise update endpoint
- [x] Add Exercise archive endpoint
- [x] Add Exercise validation
- [x] Protect built-in Exercises
- [x] Test Exercise API through Scalar

### Phase 4 — Exercise Frontend

- [x] Create Exercise TypeScript contracts
- [x] Connect React to Exercise API
- [x] Build Exercise Library
- [x] Add search
- [x] Add filtering
- [x] Add Exercise details
- [x] Add custom Exercise creation
- [x] Add custom Exercise editing
- [x] Add custom Exercise archiving
- [x] Surface API validation messages
- [x] Verify responsive layout
- [x] Verify Exercise CRUD end-to-end

### Phase 5 — Application Structure

- [x] Add React Router
- [x] Add shared application layout
- [x] Add Dashboard
- [x] Add Exercise route
- [x] Add Workout route
- [x] Add Workout Session route
- [x] Add Not Found route
- [x] Add responsive navigation

### Phase 6 — Workout Logging

- [x] Create Workout DTOs
- [x] Add development current-user abstraction
- [x] Create Workout service
- [x] Create Workout API
- [x] Create frontend Workout API contracts and client
- [x] Create Workout creation workflow
- [x] Add Exercises to Workouts in the API
- [x] Add Sets to Exercises in the API
- [x] Record weight and repetitions
- [x] Record duration
- [x] Record distance
- [x] Record RPE
- [x] Add Workout notes
- [x] Complete Workouts in the API
- [x] Build Workout list and session routing
- [x] Add active Workout Exercise selection UI
- [x] Add active Workout Exercise removal UI
- [x] Add tracking-specific Set entry UI
- [x] Add Set editing/removal UI
- [x] Add Workout editing/completion UI
- [x] Complete initial React Workout logging interface

### Phase 7 — Workout History

- [ ] Build dedicated Workout history experience
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

- [ ] Add authentication
- [ ] Add registration and login
- [ ] Replace development current-user implementation
- [ ] Associate custom Exercises with authenticated users
- [ ] Scope all user-owned resources to authenticated identity

### Phase 10 — Mobile / PWA

- [ ] Add web app manifest
- [ ] Add installable PWA behavior
- [ ] Review touch interactions
- [ ] Improve offline/error handling
- [ ] Optimize active Workout logging for mobile use

### Phase 11 — Deployment

- [ ] Select production hosting
- [ ] Select production database strategy
- [ ] Configure production environment
- [ ] Configure SPA route fallback
- [ ] Deploy API
- [ ] Deploy frontend
- [ ] Add production configuration
- [ ] Add live project URL

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
Update database development progress
Seed built-in exercise library
Add exercise API DTOs
Add exercise service layer
Add exercise read API endpoints
Add exercise write API endpoints
Document completed exercise API
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
```

---

## Portfolio Status

The application currently demonstrates:

- Full-stack architecture
- C# and ASP.NET Core API development
- REST API design
- Entity Framework Core
- Relational database modeling
- SQLite persistence
- Database migrations and seed data
- DTO-based API contracts
- Service-layer architecture
- Server-controlled resource ownership
- Validation and business-rule enforcement
- Nested resource design
- TypeScript API modeling
- React component development
- React Router
- Responsive UI design
- Frontend/backend integration
- Error handling across API and UI layers
- Tracking-specific create/edit form design
- Canonical-unit conversion at client/API boundaries
- Active resource mutation and synchronization
- Destructive-action confirmation workflows
- Lifecycle-aware UI behavior
- Git-based incremental development

Exercise Management is complete end-to-end.

The initial Workout Logging phase is also complete end-to-end: users can create Workouts, edit active Workout metadata, manage Exercises, record/edit/remove tracking-specific Sets, complete the Workout, and review the read-only completed session. The next major development area is the dedicated Workout History experience.

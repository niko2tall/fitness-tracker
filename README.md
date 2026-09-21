# Fitness Tracker

A full-stack fitness tracking application for logging strength and cardio workouts, managing reusable exercises, recording workout performance, and reviewing training history.

The project is being built as a portfolio application with a separate ASP.NET Core Web API and React frontend so the backend can eventually support multiple clients, including the current web app and a future PWA or native client.

## Current Status

The project currently supports end-to-end Exercise Management, a complete initial Workout Logging backend lifecycle, and an increasingly complete React Workout logging experience.

### Completed

- Repository and solution structure established
- ASP.NET Core Web API created with controller-based endpoints
- React + TypeScript + Vite frontend created
- HTTPS development certificate configured
- Fixed local API and frontend ports
- CORS configured between React and the API
- Health endpoint implemented
- OpenAPI document generation configured
- Scalar API reference configured
- EF Core and SQLite integrated
- Core relational domain model implemented
- Database relationships, indexes, enum conversions, and delete behaviors configured
- Initial database migration created and applied
- Built-in Exercise library seeded through EF Core migration
- Exercise DTOs and service layer implemented
- Exercise REST API implemented
- Exercise validation and built-in Exercise protection implemented
- Exercise archive workflow implemented
- Exercise API tested through Scalar
- Exercise Library implemented in React
- Exercise search and filtering implemented
- Exercise detail view implemented
- Custom Exercise creation, editing, and archiving implemented
- Exercise API validation errors surfaced in React
- Exercise Management verified end-to-end
- Application routing and main navigation implemented with React Router
- Dashboard, Exercise, Workout, Workout Session, and fallback routes added
- Server-controlled development user abstraction implemented for pre-authentication Workout ownership
- Workout DTOs and service layer implemented
- Workout REST API implemented with server-controlled ownership
- Active Workouts support ordered Exercise assignment with ownership, archive, duplicate, and type validation
- Workout Set logging implemented with tracking-type-specific validation
- Strength, reps-only, duration, and distance/duration performance logging supported
- RPE, SetType, and notes supported
- Workout completion implemented with server-controlled lifecycle timestamps
- Completed Workouts protected from normal logging mutations
- Active-Workout correction operations implemented for Workout details, Exercises, and Sets
- Frontend API layer split into shared and feature-specific clients
- Full Workout API client implemented in TypeScript
- Workout list implemented in React
- Active and Completed Workouts separated in the UI
- Workout creation dialog implemented
- Successful Workout creation navigates directly to the session route
- Dedicated `/workouts/{workoutId}` session route implemented
- Persisted Workout Exercises and Sets can be viewed from React
- Workout timestamps displayed in browser-local time
- Active Workout Exercise selection implemented in React
- Exercise selection filtered by Workout type
- Exercises already present in a Workout excluded from selection
- Exercise search available from the active Workout
- Optional WorkoutExercise notes supported during Exercise assignment
- Active WorkoutExercise removal implemented with confirmation
- Workout session refreshes from the API after Exercise additions/removals
- Completed Workout sessions keep Exercise-management controls hidden
- Tracking-specific Set entry implemented in React
- Weight-and-repetitions Set entry implemented
- Reps-only Set entry implemented
- Duration Set entry implemented
- Distance-and-duration Set entry implemented
- Cardio SetType is constrained to Working in the UI
- User-friendly kilometre input is converted to canonical metres before API submission
- Set data refreshes from the API after successful creation
- Workout Set summaries display SetType, performance data, RPE, and optional notes
- Completed Workouts keep Set-entry controls hidden
- Workout list, creation, session details, Exercise management, and Set entry are responsive

## Currently In Development

The current development phase is focused on completing the **active React Workout logging experience**:

- Adding Set editing and removal controls
- Adding Workout editing controls
- Adding Workout completion controls
- Improving active-session interaction details
- Finalizing the mobile Workout logging experience

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

The frontend does not access the database directly.

The API is responsible for validation, business rules, ownership enforcement, lifecycle state, persistence, and server-controlled IDs/timestamps.

The React client is responsible for presentation, interaction, local UI state, user-friendly unit entry, and calling the API through typed feature clients.

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
│   │   │
│   │   ├── Data
│   │   │   ├── Seed
│   │   │   │   └── ExerciseSeedData.cs
│   │   │   ├── DevelopmentDataInitializer.cs
│   │   │   ├── FitnessTrackerDbContext.cs
│   │   │   └── FitnessTracker.db
│   │   │
│   │   ├── Development
│   │   │   └── DevelopmentUser.cs
│   │   │
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
│   │   │
│   │   ├── Migrations
│   │   │   ├── <timestamp>_InitialCreate.cs
│   │   │   ├── <timestamp>_SeedBuiltInExercises.cs
│   │   │   └── FitnessTrackerDbContextModelSnapshot.cs
│   │   │
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
│   │   │
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
│   │   │
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
│       │   │       ├── CreateWorkoutDialog.tsx
│       │   │       ├── RemoveWorkoutExerciseDialog.tsx
│       │   │       ├── WorkoutExerciseCard.tsx
│       │   │       └── WorkoutSummaryCard.tsx
│       │   │
│       │   ├── pages
│       │   │   ├── DashboardPage.tsx
│       │   │   ├── ExercisesPage.tsx
│       │   │   ├── NotFoundPage.tsx
│       │   │   ├── WorkoutsPage.tsx
│       │   │   └── WorkoutSessionPage.tsx
│       │   │
│       │   ├── services
│       │   │   ├── api.ts
│       │   │   ├── apiClient.ts
│       │   │   ├── exercisesApi.ts
│       │   │   ├── healthApi.ts
│       │   │   └── workoutsApi.ts
│       │   │
│       │   ├── styles
│       │   │   ├── workoutLogging.css
│       │   │   └── workouts.css
│       │   │
│       │   ├── types
│       │   │   ├── exercise.ts
│       │   │   └── workout.ts
│       │   │
│       │   ├── utils
│       │   │   └── dateTime.ts
│       │   ├── App.css
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       │
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

A reusable built-in or custom Strength/Cardio Exercise definition.

Archived Exercises remain available to historical Workouts but cannot be selected for new logging.

### Workout

A training session containing metadata, lifecycle timestamps, notes, and ordered WorkoutExercises.

### WorkoutExercise

An explicit relationship between a Workout and Exercise. It stores order, optional session-specific notes, and WorkoutSets.

### WorkoutSet

One recorded performance entry containing the fields appropriate for its Exercise tracking type.

### BodyMeasurement

Represents user body measurements recorded over time. API and UI support are planned for a later phase.

---

## Exercise Tracking Types

```text
WeightAndReps
RepsOnly
Duration
DistanceAndDuration
```

### WeightAndReps

Requires:

- Weight in kilograms
- Repetitions

Supports optional RPE, SetType, and notes.

### RepsOnly

Requires repetitions and supports optional RPE, SetType, and notes.

### Duration

Requires duration in seconds at the API/storage layer.

The React UI accepts minutes and seconds and converts them to canonical seconds before submission.

### DistanceAndDuration

Requires:

- Distance in metres at the API/storage layer
- Duration in seconds

The React UI accepts distance in kilometres plus minutes/seconds, then converts the values to canonical metres/seconds before submission.

---

## Workout Types

```text
Strength
Cardio
Mixed
```

Compatibility rules:

- Strength Workouts accept Strength Exercises
- Cardio Workouts accept Cardio Exercises
- Mixed Workouts accept either
- Existing Exercise compatibility is checked before changing Workout type
- React pre-filters Exercise choices, while the API remains authoritative

---

## Set Types

```text
Warmup
Working
Drop
Failure
```

The current Cardio model requires `Working`.

The React Set-entry dialog automatically uses `Working` for Cardio Exercises and does not offer incompatible SetType choices.

---

## Design Decisions

### Separate API and frontend

The backend remains independent from the current React client.

### DTO separation

API contracts are separate from EF Core entities.

### Service layer

Controllers delegate Workout and Exercise business rules to services.

### Server-controlled ownership

React never submits Workout ownership IDs.

### Canonical units

The database stores kilograms, metres, and seconds.

The UI can use more convenient entry units and convert them before submission.

### UTC timestamps

Persistent timestamps use UTC; React displays browser-local time.

### Calculated values are not stored unnecessarily

Pace, Workout duration, and similar derived values are calculated from source data.

### Exercise archiving

Exercises are soft-archived so history remains intact.

### Completed Workouts are read-only

Normal mutation operations are available only while `EndedAtUtc` is null.

### Server-assigned ordering

The API owns WorkoutExercise OrderIndex and WorkoutSet SetNumber.

### API remains authoritative

Frontend validation improves usability, but backend validation remains the source of truth.

### Refresh after nested mutations

React reloads the Workout after nested Exercise and Set creation/removal so server-owned order, timestamps, and nested state remain authoritative.

### Tracking-specific forms

The active Workout UI only asks for fields relevant to the selected Exercise's tracking type. This avoids presenting meaningless Weight, Reps, Duration, or Distance fields for the wrong Exercise.

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

### Important Relationships

```text
ApplicationUser
├── Workouts
├── BodyMeasurements
└── CustomExercises

Workout
└── WorkoutExercises
    ├── Exercise
    └── WorkoutSets
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

Local SQLite databases are ignored by Git.

---

## Built-In Exercise Library

The application seeds 42 built-in Strength and Cardio Exercises with stable IDs.

Built-in Exercises cannot be edited or archived.

Custom Exercises can be created, edited, and archived.

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

Optional archived inclusion:

```http
GET /api/exercises?includeArchived=true
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

### Workout Creation

React submits editable Workout fields only. IDs, ownership, and lifecycle timestamps are server-controlled.

### Exercise Assignment

The API validates ownership, lifecycle state, Exercise existence, archive state, type compatibility, and duplicates.

### Set Logging

The API validates each Set against the Exercise tracking type.

React now exposes tracking-specific Set forms for all supported tracking modes.

### Workout Completion

Completion requires at least one completed Set and assigns `EndedAtUtc` server-side.

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
Workout session details and active logging workflow
```

---

## Current React Features

### Dashboard

Navigation into Exercise Management and Workout Tracking.

### Exercise Library

Supports built-in/custom Exercises, search/filtering, details, custom creation/edit/archive, validation feedback, and responsive layouts.

### Workouts

Supports:

- Real Workout summaries
- Active and Completed sections
- Workout creation
- Dedicated session routing
- Full nested Workout retrieval
- Exercise assignment
- Exercise search and compatibility filtering
- Exercise removal
- Optional WorkoutExercise notes
- Tracking-specific Set entry
- Weight + Reps entry
- Reps-only entry
- Duration entry
- Distance + Duration entry
- Strength SetType selection
- Cardio Working-only SetType behavior
- Optional RPE
- Optional Set notes
- User-friendly duration and distance entry with canonical API conversion
- Automatic Workout refresh after successful Set creation
- Existing Set summary display
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

Open:

```text
http://localhost:5173
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

## EF Core Commands

Run from:

```text
src/FitnessTracker.Api
```

Apply migrations:

```powershell
dotnet ef database update
```

Create a migration only after an intentional EF model change:

```powershell
dotnet ef migrations add MigrationName
```

View migrations:

```powershell
dotnet ef migrations list
```

---

## Development Principles

- Keep entities separate from API DTOs
- Keep controllers thin
- Put business rules in services
- Keep ownership decisions on the server
- Store canonical measurement units
- Store timestamps in UTC
- Avoid storing values that can be calculated
- Preserve historical references
- Use explicit relational entities when relationships contain data
- Keep feature-specific frontend API code separate
- Let the backend remain authoritative even when React pre-validates choices
- Use tracking-specific forms instead of generic forms with irrelevant fields
- Refresh server-owned nested state after mutations when useful
- Maintain responsive layouts as features are introduced
- Build backend behavior before depending on it in the UI
- Commit coherent development milestones

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
- [x] Complete Workouts
- [x] Build Workout list and session routing
- [x] Add active Workout Exercise selection UI
- [x] Add active Workout Exercise removal UI
- [x] Add tracking-specific Set entry UI
- [ ] Add Set editing/removal UI
- [ ] Add Workout editing/completion UI
- [ ] Complete full React Workout logging interface

### Phase 7 — Workout History

- [ ] Build dedicated Workout history experience
- [ ] Add filtering and date navigation
- [ ] Add useful Workout summary metrics
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
- Database migrations
- Seed data
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
- Tracking-specific form design
- Canonical-unit conversion at client/API boundaries
- Active resource mutation and synchronization
- Git-based incremental development

Exercise Management is complete end-to-end.

Workout Logging has a complete initial backend lifecycle. The React client can list and create Workouts, open sessions, add/remove Exercises, and record Sets using forms tailored to each Exercise tracking type. Current development is focused on editing/removing recorded Sets and exposing the remaining Workout update/completion controls in React.

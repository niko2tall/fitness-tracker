# Fitness Tracker

A full-stack fitness tracking application for logging strength and cardio workouts, managing reusable exercises, recording workout performance, and reviewing training history.

The project is being built as a portfolio application with a separate ASP.NET Core Web API and React frontend so the backend can eventually support multiple clients, including the current web app and a future PWA or native client.

## Current Status

The project currently supports end-to-end Exercise Management and a substantial Workout Logging backend, along with the first real Workout frontend workflow.

### Completed

- Repository and solution structure established
- ASP.NET Core Web API created with controller-based endpoints
- React + TypeScript + Vite frontend created
- HTTPS development certificate configured
- Fixed local API and frontend ports
- CORS configured between the React frontend and API
- Health endpoint implemented
- OpenAPI document generation configured
- Scalar API reference configured
- EF Core and SQLite integrated
- Initial relational domain model implemented
- Database relationships, indexes, enum conversions, and delete behaviors configured
- Initial database migration created and applied
- Built-in exercise library seeded through EF Core migration
- Exercise DTOs and service layer implemented
- Exercise REST API implemented
- Exercise validation and built-in exercise protection implemented
- Exercise archive workflow implemented
- Exercise API tested through Scalar
- Exercise Library implemented in React
- Exercise search and filtering implemented
- Exercise detail view implemented
- Custom exercise creation implemented
- Custom exercise editing implemented
- Custom exercise archiving implemented
- Exercise API validation errors surfaced in React
- Exercise Management verified end-to-end
- Application routing and main navigation implemented with React Router
- Dashboard, Exercise, Workout, and fallback routes added
- Server-controlled development user abstraction implemented for pre-authentication workout ownership
- Workout DTOs and service layer implemented
- Initial Workout REST API implemented with server-controlled ownership
- Active workouts support ordered exercise assignment with ownership, archive, duplicate, and type validation
- Workout set logging implemented with tracking-type-specific validation
- Strength performance supports weight, repetitions, set type, notes, and RPE
- Reps-only performance logging supported
- Duration-based performance logging supported
- Distance-and-duration cardio performance logging supported
- Workout completion implemented with server-controlled lifecycle timestamps
- Completed workouts are protected from normal logging mutations
- Active-workout correction operations implemented for workout details, exercises, and sets
- Frontend API layer split into shared and feature-specific clients
- Full Workout API client implemented in TypeScript
- Workout list implemented in React
- Active and completed workouts separated in the UI
- Workout creation dialog implemented
- Successful workout creation navigates directly to the session route
- Dedicated `/workouts/{workoutId}` session route implemented
- Persisted workout exercises and sets can be viewed from React
- Workout timestamps are displayed in browser-local time
- Workout list, creation, and session-detail views are responsive

## Currently In Development

The current development phase is focused on the **active React workout logging experience**:

- Adding exercise selection to active workouts
- Adding exercise removal and correction controls
- Building tracking-specific set entry forms
- Adding set editing and removal
- Adding workout editing and completion controls

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

The project uses a separated client/server architecture:

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

The API is responsible for:

- Validation
- Business rules
- Ownership enforcement
- Lifecycle state
- Persistence
- Server-controlled IDs and timestamps

The React client is responsible for:

- User interaction
- Presentation
- Local UI state
- Calling the API through typed feature clients

The separate API design also keeps the project open to future clients such as:

- Progressive Web App
- Native mobile application
- Additional web clients

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
│   │   │   │
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
│   │   │   │
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
│   │   │   │
│   │   │   ├── Users
│   │   │   │   ├── DevelopmentCurrentUserService.cs
│   │   │   │   └── ICurrentUserService.cs
│   │   │   │
│   │   │   └── Workouts
│   │   │       ├── IWorkoutService.cs
│   │   │       └── WorkoutService.cs
│   │   │
│   │   ├── Properties
│   │   │   └── launchSettings.json
│   │   │
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
│       │   │   │
│       │   │   ├── layout
│       │   │   │   └── AppLayout.tsx
│       │   │   │
│       │   │   └── workouts
│       │   │       ├── CreateWorkoutDialog.tsx
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
│       │   │   └── workouts.css
│       │   │
│       │   ├── types
│       │   │   ├── exercise.ts
│       │   │   └── workout.ts
│       │   │
│       │   ├── utils
│       │   │   └── dateTime.ts
│       │   │
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

The current domain contains six main entities:

### ApplicationUser

Represents an application user and owns:

- Workouts
- Body measurements
- Custom exercises

Authentication has not yet been implemented. During development, a server-controlled development user is used so Workout ownership can be modeled correctly without allowing the client to submit arbitrary user IDs.

### Exercise

Represents a reusable exercise definition.

Exercises can be:

- Built-in
- Custom
- Strength
- Cardio
- Archived

Archived exercises remain available to historical workouts but cannot be selected for new workout logging.

### Workout

Represents one training session.

A Workout contains:

- Name
- Workout type
- Start time
- Optional end time
- Notes
- Creation and update timestamps
- Ordered WorkoutExercises

### WorkoutExercise

Represents an Exercise used inside a specific Workout.

This explicit join entity stores:

- Workout relationship
- Exercise relationship
- Order within the workout
- Exercise-specific workout notes
- WorkoutSets

### WorkoutSet

Represents one recorded performance entry.

Depending on the Exercise tracking method, a set may contain:

- Repetitions
- Weight
- Duration
- Distance
- RPE
- Set type
- Notes

### BodyMeasurement

Represents user body measurements recorded over time.

Body-measurement API and frontend functionality are planned for a later phase.

---

## Exercise Tracking Types

Exercises use one of four tracking strategies:

```text
WeightAndReps
RepsOnly
Duration
DistanceAndDuration
```

### WeightAndReps

Used for exercises such as:

- Barbell Bench Press
- Back Squat
- Deadlift

Recorded fields:

- Weight
- Repetitions
- Optional RPE
- Set type
- Optional notes

### RepsOnly

Used for movements where repetitions are the main tracked value.

Recorded fields:

- Repetitions
- Optional RPE
- Set type
- Optional notes

### Duration

Used for exercises such as timed holds.

Recorded fields:

- Duration
- Optional RPE
- Set type
- Optional notes

### DistanceAndDuration

Used for cardio activities such as running.

Recorded fields:

- Distance
- Duration
- Optional RPE
- Optional notes

Pace and similar values are calculated from source data rather than persisted separately.

---

## Workout Types

```text
Strength
Cardio
Mixed
```

Workout/exercise compatibility is enforced by the API:

- Strength workouts accept Strength exercises
- Cardio workouts accept Cardio exercises
- Mixed workouts accept either
- Existing exercise compatibility is checked before changing a workout type

---

## Set Types

```text
Warmup
Working
Drop
Failure
```

For the current cardio implementation, performance entries use the `Working` set type.

---

## Design Decisions

### Separate API and frontend

The backend is intentionally independent from the React application so other clients can use the same API later.

### DTO separation

API request/response contracts are kept separate from EF Core entities.

This prevents clients from directly controlling server-owned fields and allows API contracts to evolve independently of the database model.

### Service layer

Controllers delegate business rules and persistence behavior to feature services.

Current service areas include:

- Exercise service
- Workout service
- Current-user abstraction

### Server-controlled ownership

Clients do not submit Workout `UserId` values.

The server determines the current user and applies ownership internally.

A temporary development implementation is used until authentication is added.

### Canonical units

The database stores canonical units:

- Weight: kilograms
- Distance: metres

User preference and display conversion can be handled at the client/application layer.

### UTC timestamps

Persisted timestamps use UTC.

The React frontend converts timestamps to browser-local time for display.

### Calculated values are not stored unnecessarily

Values such as:

- Pace
- Workout duration
- Exercise count

are derived from existing source data when needed.

### Exercise archiving

Exercise definitions are soft-archived rather than deleted.

This preserves historical Workout references.

### Completed workouts are read-only

Normal Workout logging endpoints allow editing only while a Workout is active.

Once `EndedAtUtc` is populated:

- New exercises cannot be added
- Existing exercises cannot be removed
- Sets cannot be added
- Sets cannot be edited
- Sets cannot be removed
- Workout details cannot be edited

Historical editing can be designed separately if needed later.

### Server-assigned ordering

The server assigns:

- `WorkoutExercise.OrderIndex`
- `WorkoutSet.SetNumber`

The client does not determine these values.

When items are removed, remaining indexes/numbers are normalized.

### Client-side routing

React Router provides distinct application routes instead of keeping every feature inside a single page component.

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

Exercise deletion is restricted because historical Workout records may reference the Exercise.

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

The first migration created the application schema.

The second migration inserted the built-in Exercise library using stable GUIDs.

Local SQLite database files are ignored by Git while migrations are committed.

---

## Built-In Exercise Library

The application currently seeds 42 built-in exercises across Strength and Cardio categories.

Built-in exercises:

- Are created through migration data
- Use stable IDs
- Cannot be edited
- Cannot be archived
- Can be used in workouts

Custom exercises can be:

- Created
- Edited
- Archived

---

## Exercise API

Base route:

```http
/api/exercises
```

### List Exercises

```http
GET /api/exercises
```

Optional archived inclusion:

```http
GET /api/exercises?includeArchived=true
```

### Get Exercise

```http
GET /api/exercises/{id}
```

### Create Custom Exercise

```http
POST /api/exercises
```

Example:

```json
{
  "name": "Cable Chest Press",
  "exerciseType": "Strength",
  "trackingType": "WeightAndReps",
  "primaryMuscleGroup": "Chest",
  "equipment": "Cable"
}
```

### Update Custom Exercise

```http
PUT /api/exercises/{id}
```

### Archive Custom Exercise

```http
DELETE /api/exercises/{id}
```

Archiving is a soft-delete operation.

### Exercise Business Rules

- Exercise names are checked case-insensitively for active duplicates
- Built-in exercises cannot be edited
- Built-in exercises cannot be archived
- Archived custom exercises cannot be edited
- Strength/Cardio tracking-type combinations are validated
- Server-owned fields are not accepted from client requests

---

## Workout API

Base route:

```http
/api/workouts
```

### List Workouts

```http
GET /api/workouts
```

Returns lightweight workout summaries belonging to the current application user.

### Get Workout

```http
GET /api/workouts/{id}
```

Returns the full nested Workout, including exercises and sets.

### Start Workout

```http
POST /api/workouts
```

Example:

```json
{
  "name": "Push Day",
  "workoutType": "Strength",
  "notes": "Chest, shoulders, and triceps"
}
```

The server assigns ownership and lifecycle timestamps.

### Update Active Workout

```http
PUT /api/workouts/{workoutId}
```

Only active workouts can be changed.

### Add Exercise

```http
POST /api/workouts/{workoutId}/exercises
```

The server assigns exercise order and validates compatibility, ownership, archive state, and duplicates.

### Remove Exercise

```http
DELETE /api/workouts/{workoutId}/exercises/{workoutExerciseId}
```

Returns `204 No Content` on success and renumbers remaining exercises.

### Add Set

```http
POST /api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets
```

The server validates performance data against the Exercise tracking type.

### Update Set

```http
PUT /api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets/{setId}
```

### Remove Set

```http
DELETE /api/workouts/{workoutId}/exercises/{workoutExerciseId}/sets/{setId}
```

Remaining set numbers are normalized after deletion.

### Complete Workout

```http
POST /api/workouts/{workoutId}/complete
```

Completion requires at least one completed set.

Once completed, the Workout becomes read-only to normal logging operations.

---

## API Error Handling

The API uses appropriate HTTP status codes and ASP.NET Core Problem Details.

Typical responses include:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
```

The React API client parses both standard Problem Details and ASP.NET Core validation errors.

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
Workout list and workout creation

/workouts/{workoutId}
Workout session details and active logging workflow
```

---

## Current React Features

### Dashboard

Provides navigation into Exercise Management and Workout Tracking.

### Exercise Library

Supports:

- Built-in and custom exercises
- Search and filtering
- Exercise details
- Custom exercise creation
- Custom exercise editing
- Custom exercise archiving
- API validation messages
- Responsive layouts

### Workouts

Currently supports:

- Loading real Workout summaries
- Active and Completed sections
- Workout status/type indicators
- Exercise counts
- Localized timestamps
- Empty state
- Start Workout dialog
- Strength/Cardio/Mixed creation
- Automatic navigation after creation
- Dedicated Workout session URLs
- Loading full nested Workout data
- Displaying existing exercises and sets
- Read-only completed Workout display
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

Install:

- .NET 10 SDK
- Node.js
- npm
- Git

The project is currently developed with .NET SDK 10.0.400.

### 1. Clone the Repository

```powershell
git clone https://github.com/niko2tall/fitness-tracker.git
cd fitness-tracker
```

### 2. Restore Backend Packages

```powershell
dotnet restore
```

### 3. Trust the ASP.NET Development Certificate

```powershell
dotnet dev-certs https --trust
```

### 4. Apply Database Migrations

```powershell
cd src/FitnessTracker.Api
dotnet ef database update
```

### 5. Run the API

```powershell
dotnet run --launch-profile https
```

### 6. Install Frontend Dependencies

In another terminal:

```powershell
cd src/fitness-tracker-web
npm install
```

### 7. Configure Frontend API URL

`src/fitness-tracker-web/.env.development`:

```text
VITE_API_BASE_URL=https://localhost:7081
```

### 8. Run React

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Building the Project

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

Run EF commands from:

```text
src/FitnessTracker.Api
```

Apply migrations:

```powershell
dotnet ef database update
```

Create a migration only when the EF model intentionally changes:

```powershell
dotnet ef migrations add MigrationName
```

View migrations:

```powershell
dotnet ef migrations list
```

---

## Development Principles

- Keep database entities separate from API DTOs
- Keep controllers thin
- Put business logic in services
- Keep ownership decisions on the server
- Store canonical measurement units
- Store timestamps in UTC
- Avoid storing values that can be calculated
- Preserve historical references
- Use explicit relational entities when relationships contain data
- Keep API responses convenient for frontend use
- Keep feature-specific frontend API code separate
- Maintain responsive layouts as features are introduced
- Build backend behavior before depending on it in the UI
- Commit coherent development milestones rather than every small edit

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
- [x] Seed built-in exercise library

### Phase 3 — Exercise Management API

- [x] Create Exercise DTOs
- [x] Create Exercise service
- [x] Add Exercise read endpoints
- [x] Add Exercise create endpoint
- [x] Add Exercise update endpoint
- [x] Add Exercise archive endpoint
- [x] Add Exercise validation
- [x] Protect built-in exercises
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
- [x] Add Not Found route
- [x] Add responsive navigation

### Phase 6 — Workout Logging

- [x] Create Workout DTOs
- [x] Add development current-user abstraction
- [x] Create Workout service
- [x] Create Workout API
- [x] Create frontend Workout API contracts and client
- [x] Create Workout creation workflow
- [x] Add exercises to Workouts
- [x] Add sets to exercises
- [x] Record weight and repetitions
- [x] Record duration
- [x] Record distance
- [x] Record RPE
- [x] Add Workout notes
- [x] Complete Workouts
- [ ] Build full React Workout logging interface

### Phase 7 — Workout History

- [ ] Build Workout history page
- [ ] Add detailed completed Workout view
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
- [ ] Optimize the active Workout logger for mobile use

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

Major development milestones include:

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
- Git-based incremental development

Exercise Management is complete end-to-end.

Workout Logging has a complete backend lifecycle and now includes the first React workflows for listing, creating, routing to, and viewing Workout sessions. Current development is focused on making active Workout sessions fully interactive from the frontend.

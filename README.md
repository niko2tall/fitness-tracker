# Fitness Tracker

A full-stack fitness tracking application for logging strength and cardio workouts, managing reusable exercises, recording workout performance, and reviewing training history.

The project is being built as a portfolio application with a separate ASP.NET Core Web API and React frontend so the backend can support multiple clients over time, including the current web application and a future PWA or native client.

## Current Status

Exercise Management is complete end-to-end. The initial Workout Logging workflow is complete end-to-end. Workout History is complete for the current project scope. Phase 8 — Progress Tracking now includes Exercise History, tracking-type-specific personal records and trend charts, plus a current-user-scoped Body Measurement CRUD API with matching TypeScript client contracts.

### Current Development Focus

The current development phase is **Progress Tracking**:

- Exercise History API and frontend contracts
- Exercise History UI
- Historical Workout links for each Exercise
- Tracking-type-specific personal-record detection
- WeightAndReps strength progress charts
- RepsOnly progress trends
- Duration progress trends
- DistanceAndDuration/cardio progress trends
- Body-measurement API and frontend contracts
- Body-measurement UI
- Body-weight charts
- Additional progress metrics

The completed Workout History experience remains the historical source for these analytics features.

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

The API owns:

- Validation
- Business rules
- Ownership enforcement
- Lifecycle state
- Persistence
- Resource identifiers
- Server-controlled ordering
- Server-controlled timestamps

React owns:

- Presentation
- User interaction
- Local UI state
- Search and filtering
- History aggregation
- User-friendly measurement entry
- Typed API communication

The frontend never accesses the database directly.

---

## Project Structure

```text
fitness-tracker
├── FitnessTracker.slnx
│
├── src
│   ├── FitnessTracker.Api
│   │   ├── Controllers
│   │   │   ├── BodyMeasurementsController.cs
│   │   │   ├── ExercisesController.cs
│   │   │   ├── HealthController.cs
│   │   │   ├── ProgressController.cs
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
│   │   │   ├── BodyMeasurements
│   │   │   │   ├── BodyMeasurementResponseDto.cs
│   │   │   │   ├── CreateBodyMeasurementDto.cs
│   │   │   │   └── UpdateBodyMeasurementDto.cs
│   │   │   │
│   │   │   ├── Exercises
│   │   │   │   ├── CreateExerciseDto.cs
│   │   │   │   ├── ExerciseResponseDto.cs
│   │   │   │   └── UpdateExerciseDto.cs
│   │   │   │
│   │   │   ├── Progress
│   │   │   │   ├── ExerciseHistoryResponseDto.cs
│   │   │   │   ├── ExerciseHistorySetDto.cs
│   │   │   │   └── ExerciseHistoryWorkoutDto.cs
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
│   │   │   ├── BodyMeasurements
│   │   │   │   ├── BodyMeasurementService.cs
│   │   │   │   └── IBodyMeasurementService.cs
│   │   │   ├── Exercises
│   │   │   │   ├── ExerciseService.cs
│   │   │   │   └── IExerciseService.cs
│   │   │   ├── Progress
│   │   │   │   ├── IProgressService.cs
│   │   │   │   └── ProgressService.cs
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
│       │   │   │
│       │   │   ├── layout
│       │   │   │   └── AppLayout.tsx
│       │   │   │
│       │   │   ├── progress
│       │   │   │   ├── ExerciseHistoryWorkoutCard.tsx
│       │   │   │   ├── ExercisePersonalRecords.tsx
│       │   │   │   └── ExercisePerformanceTrend.tsx
│       │   │   │
│       │   │   └── workouts
│       │   │       ├── AddWorkoutExerciseDialog.tsx
│       │   │       ├── AddWorkoutSetDialog.tsx
│       │   │       ├── CompleteWorkoutDialog.tsx
│       │   │       ├── CompletedWorkoutNotice.tsx
│       │   │       ├── CreateWorkoutDialog.tsx
│       │   │       ├── EditWorkoutDialog.tsx
│       │   │       ├── EditWorkoutSetDialog.tsx
│       │   │       ├── RemoveWorkoutExerciseDialog.tsx
│       │   │       ├── RemoveWorkoutSetDialog.tsx
│       │   │       ├── WorkoutExerciseCard.tsx
│       │   │       ├── WorkoutHistoryCard.tsx
│       │   │       ├── WorkoutHistoryFilters.tsx
│       │   │       ├── WorkoutHistoryMetrics.tsx
│       │   │       └── WorkoutSummaryCard.tsx
│       │   │
│       │   ├── pages
│       │   │   ├── DashboardPage.tsx
│       │   │   ├── ExerciseHistoryPage.tsx
│       │   │   ├── ExercisesPage.tsx
│       │   │   ├── NotFoundPage.tsx
│       │   │   ├── WorkoutHistoryPage.tsx
│       │   │   ├── WorkoutsPage.tsx
│       │   │   └── WorkoutSessionPage.tsx
│       │   │
│       │   ├── services
│       │   │   ├── api.ts
│       │   │   ├── apiClient.ts
│       │   │   ├── bodyMeasurementsApi.ts
│       │   │   ├── exercisesApi.ts
│       │   │   ├── healthApi.ts
│       │   │   ├── progressApi.ts
│       │   │   └── workoutsApi.ts
│       │   │
│       │   ├── styles
│       │   │   ├── completedWorkout.css
│       │   │   ├── exerciseHistory.css
│       │   │   ├── workoutHistory.css
│       │   │   ├── workoutLogging.css
│       │   │   └── workouts.css
│       │   │
│       │   ├── types
│       │   │   ├── bodyMeasurement.ts
│       │   │   ├── exercise.ts
│       │   │   ├── progress.ts
│       │   │   └── workout.ts
│       │   │
│       │   ├── utils
│       │   │   ├── dateTime.ts
│       │   │   ├── exerciseTrends.ts
│       │   │   ├── personalRecords.ts
│       │   │   └── workoutMetrics.ts
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

### ApplicationUser

Owns:

- Workouts
- BodyMeasurements
- Custom Exercises

Authentication has not yet been implemented. A server-controlled development user currently provides Workout ownership.

### Exercise

A reusable Exercise definition.

Exercises can be:

- Built-in
- Custom
- Strength
- Cardio
- Active
- Archived

Archived Exercises remain available to historical Workouts but cannot be selected for new logging.

### Workout

Represents one training session.

Stores:

- User relationship
- Name
- WorkoutType
- StartedAtUtc
- EndedAtUtc
- Notes
- CreatedAtUtc
- UpdatedAtUtc
- Ordered WorkoutExercises

### WorkoutExercise

Explicit join entity between Workout and Exercise.

Stores:

- WorkoutId
- ExerciseId
- OrderIndex
- Optional notes
- WorkoutSets

### WorkoutSet

Represents one recorded performance entry.

Depending on Exercise TrackingType, a Set may contain:

- Repetitions
- Weight
- Duration
- Distance
- RPE
- SetType
- Notes

### BodyMeasurement

Represents body measurements recorded over time.

Body-measurement API and frontend functionality are planned for a later phase.

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

- WeightKg
- Reps

Supports:

- SetType
- RPE
- Notes

### RepsOnly

Requires:

- Reps

Supports:

- SetType
- RPE
- Notes

### Duration

Requires:

- DurationSeconds

React presents minutes/seconds and converts to canonical seconds.

### DistanceAndDuration

Requires:

- DistanceMeters
- DurationSeconds

React presents kilometres plus minutes/seconds and converts to canonical metres/seconds.

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
- Mixed Workouts accept either
- Existing Exercise compatibility is checked before WorkoutType changes
- React disables known-incompatible choices
- The API remains authoritative

---

## Set Types

```text
Warmup
Working
Drop
Failure
```

Current Cardio performance records use `Working`.

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

The API controls:

- Workout ownership
- StartedAtUtc
- EndedAtUtc
- CreatedAtUtc
- UpdatedAtUtc
- WorkoutExercise.OrderIndex
- WorkoutSet.SetNumber

A Workout must contain at least one completed Set before completion.

Completed Workouts reject normal logging mutations.

---

## Historical Workout Policy

Completed Workouts are treated as **read-only historical records**.

This is an intentional application policy rather than only a UI limitation.

After a Workout is completed:

- Workout metadata cannot be edited through normal logging operations
- Exercises cannot be added or removed
- Sets cannot be added, edited, or removed
- Historical Exercise, Set, performance, RPE, and notes data remain visible
- The Workout remains retrievable through Workout History
- Completed session navigation returns to `/history` rather than the active Workout list

The React UI explains the read-only state and hides mutation controls.

The API independently enforces the same lifecycle restrictions with conflict responses, so manually crafted client requests cannot bypass the policy.

If historical correction is ever required in the future, it should be introduced as an explicit correction/audit workflow rather than silently reopening completed Workouts for normal editing.

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

No additional migrations were required for the React Workout Logging or Workout History work.

---

## Built-In Exercise Library

The application currently seeds 42 built-in Strength and Cardio Exercises.

Built-in Exercises:

- Use stable IDs
- Are inserted through EF Core migration data
- Cannot be edited
- Cannot be archived
- Can be used in Workouts

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

Exercise rules include:

- Case-insensitive active-name uniqueness
- Built-in protection
- Archive protection
- Strength/Cardio TrackingType validation
- Server-owned fields cannot be controlled by the client

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

### Workout Business Rules

- UserId is server-controlled
- StartedAtUtc/EndedAtUtc are server-controlled
- Only active Workouts can be normally edited
- Archived Exercises cannot be newly added
- Duplicate Exercises are prevented within a Workout
- Exercise/Workout type compatibility is enforced
- OrderIndex is server-assigned
- SetNumber is server-assigned
- Remaining order/set numbers are normalized after deletion
- Set payloads must match Exercise TrackingType
- Cardio performance currently uses SetType Working
- Completion requires at least one completed Set
- Completed Workouts remain retrievable as history
- Completed Workouts reject normal mutation operations

---

## Body Measurement API

Base route:

```http
/api/body-measurements
```

Supported operations:

```http
GET    /api/body-measurements
GET    /api/body-measurements/{id}
POST   /api/body-measurements
PUT    /api/body-measurements/{id}
DELETE /api/body-measurements/{id}
```

Body Measurement records are scoped to the current server-controlled user.

The current model stores:

- RecordedAtUtc
- WeightKg
- Optional BodyFatPercentage
- Optional Notes

Weight is stored canonically in kilograms. Body-fat percentage is optional and constrained to 0–100. Notes are limited to the existing 1000-character database limit.

The API:

- Returns measurements newest-first
- Assigns IDs and UserId server-side
- Never accepts an arbitrary UserId from the client
- Supports create, read, update, and delete operations
- Returns `404 Not Found` for missing or non-owned records
- Keeps timestamps in UTC

The BodyMeasurements table and `(UserId, RecordedAtUtc)` index were already created by the initial migration, so this feature does not require a new migration.

---

## Progress API

Base route:

```http
/api/progress
```

Current operation:

```http
GET /api/progress/exercises/{exerciseId}/history
```

The Exercise History endpoint:

- Returns metadata for the requested Exercise
- Scopes historical Workout data to the current server-controlled user
- Includes completed Workouts only
- Includes only WorkoutExercise records with at least one completed Set
- Returns completed Sets ordered by SetNumber
- Keeps archived Exercises available for historical analysis
- Returns an empty `entries` collection when the Exercise exists but has no completed history
- Returns `404 Not Found` when the Exercise itself does not exist

The response includes enough canonical performance data to support future:

- Exercise History UI
- Personal-record detection
- Strength progress charts
- Cardio duration/distance trends
- Exercise-specific analytics

No new database columns are required because the endpoint reads existing finalized Workout data.


---

## API Error Handling

Typical status codes include:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
```

React parses ASP.NET Core Problem Details and validation responses so API failures can be surfaced to the user.

---

## Frontend API Layer

```text
apiClient.ts
├── API base URL
├── fetch wrapper
├── HTTP status handling
└── ProblemDetails parsing

healthApi.ts
└── Health endpoint

exercisesApi.ts
└── Exercise endpoints

workoutsApi.ts
└── Workout endpoints

progressApi.ts
└── Exercise History / progress endpoints

bodyMeasurementsApi.ts
└── Body Measurement CRUD endpoints
```

`api.ts` provides barrel exports for feature consumers.

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
Workout session details and logging / read-only completed detail

/history
Completed Workout history

/progress/exercises/{exerciseId}
Exercise-specific completed performance history
```

The shared Workout detail route is lifecycle-aware:

- Active Workout → back navigation returns to `/workouts`
- Completed Workout → back navigation returns to `/history`

---

## Current React Features

### Dashboard

Provides access to:

- Exercise Library
- Active Workouts
- Workout History

### Exercise Library

Supports:

- Built-in/custom Exercises
- Search
- Filtering
- Exercise details
- Custom Exercise creation
- Custom Exercise editing
- Custom Exercise archiving
- API validation feedback
- Responsive layouts

### Workout Logging

Supports:

- Workout creation
- Active Workout summaries
- Dedicated session route
- Workout name/type/notes editing
- Exercise assignment/removal
- Exercise compatibility filtering
- Optional WorkoutExercise notes
- Tracking-specific Set creation
- Tracking-specific Set editing
- Set removal with confirmation
- Weight + Reps
- Reps Only
- Duration
- Distance + Duration
- Strength SetType selection
- Cardio Working-only behavior
- RPE
- Set notes
- Canonical unit conversion
- Workout completion
- Immediate Active → Completed transition
- Responsive layouts

### Exercise Progress History

Supports:

- Dedicated `/progress/exercises/{exerciseId}` route
- Exercise metadata and tracking type display
- Completed Workout occurrences only
- Historical Sets grouped by Workout
- Tracking-specific Set summaries
- SetType, RPE, and notes display
- Exercise-specific Workout notes
- Links back to the originating completed Workout
- Session count and total historical Set count
- Most-recent and first-logged timestamps
- Tracking-type-specific personal-record cards
- Source Workout and Set references for each record
- Generalized progress trend chart for every ExerciseTrackingType
- WeightAndReps metrics: heaviest weight, most reps, highest set volume
- RepsOnly metric: most reps
- Duration metric: longest duration
- DistanceAndDuration metrics: longest distance, longest duration, fastest pace
- Per-session best-value aggregation
- Metric-aware higher-is-better / lower-is-better selection
- Earliest/latest/best/change trend summaries
- Accessible SVG point labels and data table
- Archived Exercise history remains viewable
- Empty-history state
- API error/loading states
- Responsive historical Set, record, and trend layouts
- Direct Exercise History links from Workout Exercise cards

### Workout History

Supports:

- Dedicated `/history` route
- Completed Workouts only
- Workout-name search
- Workout Type filtering
- All-history view
- Month view
- Previous-month navigation
- Next-month navigation up to the current month
- Clear-filter behavior
- Result counts
- Duration-aware completed Workout cards
- Total filtered training time
- Average filtered Workout duration
- Average filtered Exercises per Workout
- Filter-aware summary metrics
- Read-only completed-session details
- History-aware back navigation
- Read-only historical-record notice
- Empty-history state
- No-filter-match state
- Responsive controls and card layout

---

## Workout History Metrics

The current History metrics are calculated from `WorkoutSummary` data already returned by the API.

For the currently filtered result set, React derives:

- Matching Workout count
- Total training time
- Average Workout duration
- Average Exercises per Workout

Workout duration is calculated from:

```text
EndedAtUtc - StartedAtUtc
```

No additional database field is stored for duration.

Invalid or incomplete timestamps are excluded from duration aggregation rather than producing misleading values.

---

## Exercise Progress Trends

The Exercise History page supports session-level trend charts for every current `ExerciseTrackingType`.

### WeightAndReps

- Heaviest Weight
- Most Reps
- Highest Set Volume (`WeightKg × Reps`)

### RepsOnly

- Most Reps

### Duration

- Longest Duration

### DistanceAndDuration

- Longest Distance
- Longest Duration
- Fastest Average Pace

Each completed Workout contributes at most one point per selected metric. The point represents the best eligible finalized Set for that metric in that session.

Most metrics treat a larger value as the record/best value. `Fastest Pace` is intentionally lower-is-better because it stores seconds per kilometre.

Historical Exercise entries arrive newest-first from the API, while chart points are intentionally sorted oldest-to-newest for left-to-right trend visualization.

The chart is rendered with native React/SVG rather than an external charting dependency.

The trend view includes:

- Tracking-type-specific metric controls
- Earliest value
- Latest value
- Best value
- Absolute change from earliest to latest
- Percentage change when the earliest value is greater than zero
- Pace-aware faster/slower change wording
- Accessible/focusable SVG point labels
- A compact data table containing the same chart values and source Workout links

No progress values are persisted separately; trends are derived from finalized completed-Workout history.


---

## Personal Record Detection

Personal records are derived on the frontend from finalized Exercise History data. They are not stored as separate database rows.

Current records depend on `ExerciseTrackingType`.

### WeightAndReps

- Heaviest Weight
- Most Reps in a Set
- Highest Set Volume (`WeightKg × Reps`)

### RepsOnly

- Most Reps in a Set

### Duration

- Longest Duration

### DistanceAndDuration

- Longest Distance
- Longest Duration
- Fastest Average Pace

Fastest pace is calculated only when both distance and duration are greater than zero.

Each record retains its source:

- Workout ID
- Workout name
- completion timestamp
- Set number
- Set type
- source Set details

When two performances have the same record value, the most recent one is retained because Exercise History arrives newest-first and record replacement occurs only for a strictly better value.

The implementation uses finalized completed-Workout data only, so active-session corrections cannot temporarily alter Progress records.

Records remain derived instead of persisted so corrected or newly finalized historical data automatically produces the appropriate current record without synchronization logic.


---

## Design Decisions

### Separate API and Frontend

The backend is independent from the current React client.

### DTO Separation

API contracts are separate from EF Core entities.

### Service Layer

Controllers remain thin while services enforce business rules.

### Server-Controlled Ownership

React never submits arbitrary Workout ownership IDs.

### Canonical Units

Persistence uses:

- Kilograms
- Metres
- Seconds

### UTC Timestamps

Persistent timestamps use UTC. React converts them to browser-local time for display and History month filtering.

### Calculated Values

Values such as pace and Workout duration are derived rather than duplicated in persistence.

### Soft Exercise Archiving

Historical Workout references remain intact.

### Completed Workouts Are Read-Only

Normal logging operations are restricted to active Workouts. Completed Workouts are treated as historical records.

### Explicit Historical Correction Policy

The application does not reopen completed Workouts for ordinary editing.

If correction support is needed later, it should be implemented as a distinct auditable workflow.

### Server-Assigned Ordering

The API controls WorkoutExercise `OrderIndex` and WorkoutSet `SetNumber`.

### Backend Validation Remains Authoritative

React prevents obvious invalid choices, but API rules remain the source of truth.

### Tracking-Specific Forms

The UI displays only fields relevant to an Exercise's TrackingType.

### Round-Trip Unit Conversion

Friendly UI values are converted to canonical API values and back.

### Dedicated History Experience

Active Workout management and completed Workout review are separate frontend concerns.

### Lifecycle-Aware Shared Detail Page

The same Workout Session route renders both active and completed sessions, but navigation and controls adapt to lifecycle state.

### Client-Side History Filtering

The current dataset is small enough to load Workout summaries once and apply search/type/month filters in React.

If history grows substantially, the same UI can later be backed by server-side filtering and pagination.

### Client-Side History Metrics

Current History metrics are derived from the same lightweight filtered Workout summaries already loaded for the page.

This avoids extra API calls and redundant aggregate storage.

### Derived Personal Records

Exercise personal records are calculated from finalized Exercise History responses rather than persisted separately.

This keeps the completed Workout/Set data as the source of truth and avoids stale record rows when historical data changes through a future explicit correction workflow.

### Derived Exercise Trends

Trend points for every ExerciseTrackingType are calculated from the same finalized Exercise History response.

The chart keeps the API/database model unchanged and avoids storing redundant per-session progress aggregates. The utility layer converts completed Sets into chronological, tracking-type-aware chart points, while the React component owns metric selection and visualization.

The trend model explicitly supports metric direction so `Fastest Pace` can treat a lower seconds-per-kilometre value as better while weight, reps, volume, duration, and distance use higher values.

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

### 1. Clone

```powershell
git clone https://github.com/niko2tall/fitness-tracker.git
cd fitness-tracker
```

### 2. Restore Backend Packages

```powershell
dotnet restore
```

### 3. Trust the Development Certificate

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

### 6. Install Frontend Packages

In another terminal:

```powershell
cd src/fitness-tracker-web
npm install
```

### 7. Configure the Development API URL

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

## Quick Start for Testing

Start the backend in one PowerShell window:

```powershell
cd C:\Dev\fitness-tracker\src\FitnessTracker.Api
dotnet run --launch-profile https
```

Start the frontend in a second PowerShell window:

```powershell
cd C:\Dev\fitness-tracker\src\fitness-tracker-web
npm run dev
```

Then open:

```text
http://localhost:5173
```

API reference:

```text
https://localhost:7081/scalar
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

- [x] Build dedicated Workout History page
- [x] Separate active and completed Workout experiences
- [x] Add Workout-name search
- [x] Add Workout Type filtering
- [x] Add all-history/month view controls
- [x] Add previous/next month navigation
- [x] Add useful Workout summary metrics
- [x] Add Workout-duration display
- [x] Define completed Workouts as read-only historical records
- [x] Add lifecycle-aware completed-session navigation
- [x] Add completed-session read-only guidance
- [ ] Consider server-side filtering/pagination when dataset size warrants it

### Phase 8 — Progress Tracking

- [x] Add Exercise History API foundation
- [x] Add Exercise History TypeScript contracts/client
- [x] Build Exercise History UI
- [x] Add Exercise History links from Workout sessions
- [x] Add tracking-type-specific personal-record detection
- [x] Add WeightAndReps strength progress charts
- [x] Add RepsOnly/Duration/Cardio trend charts
- [x] Add Body Measurement CRUD API
- [x] Add Body Measurement TypeScript contracts/client
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

## Development Milestones

The milestone history is intentionally preserved because it documents how the project evolved from initial setup into a complete full-stack feature set.

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
Add dedicated workout history
Add workout history filtering and date navigation
Add workout history metrics and duration
Finalize historical workout read-only experience
Add exercise progress history API foundation
Add exercise history React experience
Add exercise personal record detection
Add weight and reps progress trend charts
Generalize exercise progress trends across tracking types
Add body measurement API and frontend contracts
```

## Portfolio Status

The project currently demonstrates:

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
- Nested-resource design
- TypeScript API modeling
- React component development
- React Router
- Responsive UI design
- Frontend/backend integration
- ProblemDetails error handling
- Tracking-specific form design
- Canonical-unit conversion
- Lifecycle-aware UI behavior
- Active-resource mutation and synchronization
- Destructive-action confirmation workflows
- Client-side search and filtering
- Date-based history navigation
- Derived duration calculations
- Filter-aware aggregate metrics
- Explicit immutable-history design
- Lifecycle-aware navigation
- Current-user-scoped Body Measurement CRUD API
- Canonical kilogram body-weight persistence
- Git-based incremental development

Exercise Management is complete end-to-end.

The initial Workout Logging workflow is complete end-to-end: users can create Workouts, edit active Workout metadata, manage Exercises, record/edit/remove tracking-specific Sets, complete the Workout, and review the resulting read-only session.

Workout History is complete for the current project scope. Completed Workouts can be searched, filtered, browsed by month, summarized with duration and aggregate metrics, and opened in a lifecycle-aware read-only detail experience.

Progress Tracking now includes a current-user-scoped Exercise History API, matching TypeScript client contracts, a dedicated React Exercise History page, tracking-type-specific personal-record detection, interactive trend charts for every current tracking type, and a Body Measurement CRUD API with frontend contracts. Body Measurement persistence uses the existing schema and canonical kilogram storage, preparing the next part for the React measurement interface and body-weight chart.

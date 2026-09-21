# Fitness Tracker

A full-stack fitness tracking application built with **ASP.NET Core**, **React**, **TypeScript**, **Entity Framework Core**, and **SQLite**.

The project is being developed as a portfolio application to demonstrate full-stack software development, REST API design, relational database design, frontend/backend integration, and responsive application development.

Fitness Tracker is intended to provide a centralized place for users to record strength workouts, cardio activities, exercise performance, body measurements, and long-term fitness progress.

The application is being designed with **mobile use in mind**, with responsive web support as the initial target and Progressive Web App functionality planned for a later stage.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Current Status](#current-status)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Domain Model](#domain-model)
* [Exercise Tracking Types](#exercise-tracking-types)
* [Workout Types](#workout-types)
* [Set Types](#set-types)
* [Design Decisions](#design-decisions)
* [API](#api)
* [Getting Started](#getting-started)
* [Running the Application](#running-the-application)
* [Environment Configuration](#environment-configuration)
* [CORS](#cors)
* [Database](#database)
* [Database Relationships](#database-relationships)
* [Development Roadmap](#development-roadmap)
* [Git Workflow](#git-workflow)
* [Building the Project](#building-the-project)
* [Future Improvements](#future-improvements)
* [Project Goals](#project-goals)
* [Portfolio Status](#portfolio-status)

---

# Project Overview

Fitness Tracker is a full-stack application designed to support both **strength training** and **cardiovascular exercise tracking**.

Rather than limiting the project to basic workout entries, the application is being structured around reusable exercises, workout sessions, exercise performance, individual sets, measurements, and long-term historical data.

The backend is implemented as a separate REST API so the same backend can eventually support multiple clients, including:

* Web browsers
* Mobile browsers
* Progressive Web Apps
* Potential native mobile applications

The project is also intended to demonstrate practical software-development concepts including:

* REST API development
* Relational database design
* Entity relationships
* Data validation
* CRUD operations
* Frontend/backend separation
* Client-side routing
* Responsive UI design
* Authentication and authorization
* Historical data tracking
* Application analytics
* Git-based development workflow

---

# Current Status

## Currently In Development

The current development phase is focused on **building the React workout logging workflow**:

* Creating frontend Workout API contracts
* Building the workout creation interface
* Building the active workout logging screen
* Adding exercise selection to active workouts
* Adding tracking-specific set entry forms
* Supporting workout corrections and completion from React

---

## Completed

The following foundation, database, Exercise Management, frontend, and application-structure work has been implemented:

* GitHub repository created and connected to the local project
* Visual Studio solution created
* ASP.NET Core Web API created with .NET 10
* React frontend created with Vite and TypeScript
* Frontend and backend projects separated
* HTTPS development certificate configured
* Predictable local development ports configured
* CORS configured between React and ASP.NET Core
* React-to-API communication verified
* API health endpoint created
* Active-workout correction operations implemented for workout details, exercises, and sets
* OpenAPI document generation configured
* Scalar interactive API documentation configured
* Entity Framework Core configured
* SQLite database provider configured
* EF Core command-line tooling configured
* Initial fitness domain model designed
* Core domain model classes created
* Application enums created
* Workout completion implemented with server-controlled lifecycle timestamps and post-completion mutation protection
* `FitnessTrackerDbContext` created
* Entity relationships and foreign keys configured
* Database delete behaviours configured
* Database indexes and uniqueness constraints configured
* Enum-to-string database conversions configured
* SQLite connection string configured
* Initial Entity Framework Core migration created
* Local SQLite database created
* Database schema verified
* EF Core migration history verified
* Built-in exercise library seeded through Entity Framework Core migrations
* Exercise request and response DTOs implemented
* Exercise service layer implemented
* Exercise business rules and validation implemented
* Exercise REST API implemented
* Exercise retrieval by list and ID implemented
* Custom exercise creation implemented
* Custom exercise editing implemented
* Custom exercise soft-archiving implemented
* Built-in exercise modification protection implemented
* Exercise API validation and error handling implemented
* Exercise API tested through Scalar
* Workout set logging implemented with tracking-type-specific validation for strength and cardio performance
* React exercise library connected to the ASP.NET Core API
* Client-side exercise search and filtering implemented
* Server-controlled development user abstraction implemented for pre-authentication workout ownership
* Responsive exercise detail interface implemented
* Custom exercise creation implemented in React
* Custom exercise editing implemented in React
* Custom exercise soft-archiving implemented in React
* API validation and conflict errors surfaced in the frontend
* Exercise management interface verified on desktop and mobile
* Complete Exercise CRUD workflow verified end-to-end
* Client-side routing implemented with React Router
* Shared application navigation implemented
* Dashboard route created
* Exercise Management moved into a dedicated routed page
* Workouts route created for the next development phase
* Not-found route implemented
* Git-based milestone workflow established
* Initial Workout REST API implemented with server-controlled workout ownership

---

## Not Yet Implemented

The following functionality is planned but not yet complete:

* Workout API and service layer
* Workout creation interface
* Workout history
* Workout editing and archiving
* Personal record detection
* Progress charts
* Body measurement interface and charts
* Authentication
* User registration
* Authorization and per-user data isolation
* PWA installation
* Production deployment

---

# Features

## Exercise Management

Exercise Management is the first completed end-to-end feature in the application.

Current functionality includes:

* Built-in exercise library
* Strength and cardio exercise types
* Multiple exercise tracking methods
* Exercise search
* Exercise-type filtering
* Muscle-group filtering
* Equipment filtering
* Exercise detail views
* Custom exercise creation
* Custom exercise editing
* Custom exercise archiving
* Duplicate-name protection
* Exercise-type and tracking-method validation
* Responsive desktop and mobile layouts
* Protection of built-in exercises from user modification
* Active workouts support ordered exercise assignment with type, ownership, archive, and duplicate validation

Built-in exercises are seeded through Entity Framework Core migrations, while user-created exercises are stored as custom records.

Archived exercises are retained in the database to preserve future historical workout relationships.

---

## Strength Training

Planned strength-training functionality includes:

* Create workouts
* Select exercises from the exercise library
* Record multiple exercises per workout
* Record multiple sets per exercise
* Record repetitions
* Record weight
* Track warm-up sets
* Track working sets
* Track drop sets
* Track sets taken to failure
* Record RPE
* Add exercise-specific notes
* Add set-specific notes
* Review previous workouts
* Track strength progression
* Detect personal records
* Calculate training volume

Example:

```text
Push Day

Bench Press
95 lb × 10       Warmup
135 lb × 8       Warmup
185 lb × 8       Working
185 lb × 7       Working
175 lb × 9       Working

Incline Dumbbell Press
70 lb × 10       Working
70 lb × 9        Working
```

---

## Cardio

Cardio tracking is being designed to support activities including:

* Outdoor running
* Treadmill running
* Cycling
* Rowing
* Other duration-based cardio

Planned workout data includes:

* Distance
* Duration
* Pace
* Activity notes
* RPE
* Workout history

Example:

```text
Sunday Long Run

Distance:
21.3 km

Duration:
1:58:32

Average Pace:
Calculated from distance and duration
```

The database stores the underlying distance and duration rather than storing calculated pace.

---

## Body Measurements

The application will also support body measurement history.

Initial measurement tracking includes:

* Body weight
* Body-fat percentage
* Recording date
* Notes

Future versions may add measurements such as:

* Waist
* Chest
* Arms
* Legs
* Hips

Measurement history will eventually be visualized using progress charts.

---

# Technology Stack

## Backend

* C#
* .NET 10
* ASP.NET Core Web API
* Controller-based API architecture
* Entity Framework Core
* SQLite
* OpenAPI
* Scalar API Reference

---

## Frontend

* React
* TypeScript
* React Router
* Vite
* HTML
* CSS
* Fetch API

The frontend currently uses client-side routing to separate the Dashboard, Exercise Management, and Workout areas of the application.

Additional frontend libraries may be introduced as the interface develops.

---

## Database

Current local development database:

* SQLite

Data access:

* Entity Framework Core

Schema management:

* Entity Framework Core migrations

The application is structured so that the database provider can be replaced with a larger relational database system in the future if necessary.

Possible future options include:

* SQL Server
* PostgreSQL

---

## Development Tools

* Visual Studio 2026
* .NET SDK 10.0.400
* Git
* GitHub
* Node.js
* npm
* EF Core CLI
* Scalar
* DB Browser for SQLite

---

# Architecture

Fitness Tracker uses a separated frontend/backend architecture.

```text
┌─────────────────────────────┐
│      React + TypeScript     │
│                             │
│   Dashboard / Exercises     │
│         / Workouts          │
│                             │
│       React Router          │
└──────────────┬──────────────┘
               │
               │ HTTPS
               │ JSON
               │ REST
               ▼
┌─────────────────────────────┐
│     ASP.NET Core Web API    │
│                             │
│        Controllers          │
│        Services             │
│        DTOs                 │
└──────────────┬──────────────┘
               │
               │ Entity Framework Core
               ▼
┌─────────────────────────────┐
│           SQLite            │
│                             │
│      Relational Data        │
└─────────────────────────────┘
```

The separation between frontend and backend allows additional clients to use the same API in the future.

For example:

```text
React Web App ───────┐
                     │
Future Mobile App ───┼──► ASP.NET Core API ───► Database
                     │
Future Desktop App ──┘
```

The backend also separates HTTP handling, business logic, API contracts, and persistence:

```text
Controller
    ↓
Service
    ↓
Entity Framework Core
    ↓
SQLite
```

For Exercise Management:

```text
React Exercise UI
        ↓
Frontend API Client
        ↓
ExercisesController
        ↓
IExerciseService
        ↓
ExerciseService
        ↓
FitnessTrackerDbContext
        ↓
SQLite
```

---

# Project Structure

The repository is organized into separate backend and frontend applications.

```text
fitness-tracker
│
├── .gitignore
├── README.md
├── FitnessTracker.slnx
│
└── src
    │
    ├── FitnessTracker.Api
    │   │
    │   ├── Controllers
    │   │   ├── ExercisesController.cs
    │   │   └── HealthController.cs
    │   │
    │   ├── Data
    │   │   ├── Seed
    │   │   │   └── ExerciseSeedData.cs
    │   │   │
    │   │   ├── FitnessTrackerDbContext.cs
    │   │   └── FitnessTracker.db
    │   │
    │   ├── DTOs
    │   │   └── Exercises
    │   │       ├── CreateExerciseDto.cs
    │   │       ├── ExerciseResponseDto.cs
    │   │       └── UpdateExerciseDto.cs
    │   │
    │   ├── Migrations
    │   │   ├── <timestamp>_InitialCreate.cs
    │   │   ├── <timestamp>_SeedBuiltInExercises.cs
    │   │   └── FitnessTrackerDbContextModelSnapshot.cs
    │   │
    │   ├── Models
    │   │   │
    │   │   ├── Enums
    │   │   │   ├── DistanceUnit.cs
    │   │   │   ├── ExerciseTrackingType.cs
    │   │   │   ├── ExerciseType.cs
    │   │   │   ├── SetType.cs
    │   │   │   ├── WeightUnit.cs
    │   │   │   └── WorkoutType.cs
    │   │   │
    │   │   ├── ApplicationUser.cs
    │   │   ├── BodyMeasurement.cs
    │   │   ├── Exercise.cs
    │   │   ├── Workout.cs
    │   │   ├── WorkoutExercise.cs
    │   │   └── WorkoutSet.cs
    │   │
    │   ├── Services
    │   │   └── Exercises
    │   │       ├── ExerciseService.cs
    │   │       └── IExerciseService.cs
    │   │
    │   ├── Properties
    │   │   └── launchSettings.json
    │   │
    │   ├── Program.cs
    │   ├── appsettings.json
    │   └── FitnessTracker.Api.csproj
    │
    └── fitness-tracker-web
        │
        ├── public
        │
        ├── src
        │   │
        │   ├── components
        │   │   ├── exercises
        │   │   │   ├── ArchiveExerciseDialog.tsx
        │   │   │   ├── CreateExerciseDialog.tsx
        │   │   │   ├── EditExerciseDialog.tsx
        │   │   │   ├── ExerciseCard.tsx
        │   │   │   ├── ExerciseDetailsDialog.tsx
        │   │   │   ├── ExerciseFilters.tsx
        │   │   │   └── ExerciseList.tsx
        │   │   │
        │   │   └── layout
        │   │       └── AppLayout.tsx
        │   │
        │   ├── pages
        │   │   ├── DashboardPage.tsx
        │   │   ├── ExercisesPage.tsx
        │   │   ├── NotFoundPage.tsx
        │   │   └── WorkoutsPage.tsx
        │   │
        │   ├── services
        │   │   └── api.ts
        │   │
        │   ├── types
        │   │   └── exercise.ts
        │   │
        │   ├── App.css
        │   ├── App.tsx
        │   ├── index.css
        │   └── main.tsx
        │
        ├── .env.development
        ├── index.html
        ├── package.json
        ├── package-lock.json
        ├── tsconfig.json
        └── vite.config.ts
```

`FitnessTracker.db` is a local development artifact and is excluded from Git source control.

---

# Domain Model

The application uses several related entities to represent fitness activity.

```text
ApplicationUser
    │
    ├─────────────── Workouts
    │                   │
    │                   └──────── WorkoutExercises
    │                                │
    │                                ├──────── Exercise
    │                                │
    │                                └──────── WorkoutSets
    │
    ├─────────────── BodyMeasurements
    │
    └─────────────── CustomExercises
```

---

## ApplicationUser

Represents an application user.

Initial fields include:

```text
Id
DisplayName
PreferredWeightUnit
PreferredDistanceUnit
CreatedAtUtc
```

The user entity will later be integrated with ASP.NET Core Identity when authentication is implemented.

---

## Workout

Represents an individual training session.

Example:

```text
Push Day
Leg Day
Upper Body
Sunday Long Run
Tempo Run
```

Important fields include:

```text
Id
UserId
Name
WorkoutType
StartedAtUtc
EndedAtUtc
Notes
CreatedAtUtc
UpdatedAtUtc
```

A user can have many workouts.

```text
ApplicationUser
      1
      │
      │
      *
   Workout
```

---

## Exercise

Represents the definition of an exercise or activity.

Examples:

```text
Bench Press
Back Squat
Deadlift
Pull-Up
Outdoor Run
Treadmill Run
Cycling
```

An exercise contains information such as:

```text
Name
ExerciseType
TrackingType
PrimaryMuscleGroup
Equipment
IsCustom
IsArchived
```

Exercises may either be built-in or user-created custom exercises.

Built-in exercises are seeded through Entity Framework Core migrations and cannot be edited or archived through the user-facing Exercise API.

Custom exercises can be created, updated, and archived through the application.

---

## WorkoutExercise

`WorkoutExercise` represents an exercise being performed during a particular workout.

This entity exists because additional information belongs to the relationship between a workout and an exercise.

For example:

```text
Push Day

1. Bench Press
2. Incline Dumbbell Press
3. Cable Fly
```

The order of the exercises belongs to the workout rather than to the exercise definition.

Important fields include:

```text
WorkoutId
ExerciseId
OrderIndex
Notes
```

---

## WorkoutSet

Represents an individual set or recorded performance entry.

Strength example:

```text
Weight:
83.9 kg

Reps:
8

RPE:
8
```

Cardio example:

```text
Distance:
5000 metres

Duration:
1425 seconds
```

Important fields include:

```text
WorkoutExerciseId
SetNumber
SetType
Reps
WeightKg
DurationSeconds
DistanceMeters
Rpe
IsCompleted
Notes
```

Several fields are nullable because different exercise types require different forms of tracking.

---

## BodyMeasurement

Represents a user's body measurement at a specific point in time.

Initial fields include:

```text
UserId
RecordedAtUtc
WeightKg
BodyFatPercentage
Notes
```

This data will eventually support fitness progress visualization.

---

# Exercise Tracking Types

Different exercises require different input methods.

The application currently defines:

```text
WeightAndReps
RepsOnly
Duration
DistanceAndDuration
```

Examples:

| Exercise | Tracking Type |
| --- | --- |
| Bench Press | WeightAndReps |
| Back Squat | WeightAndReps |
| Pull-Up | RepsOnly |
| Push-Up | RepsOnly |
| Plank | Duration |
| Outdoor Run | DistanceAndDuration |
| Cycling | DistanceAndDuration |

The React exercise-management interface already uses this value to provide appropriate tracking-method choices when custom exercises are created or edited.

The same value will later determine which controls are displayed while logging exercise performance during workouts.

---

# Workout Types

Workouts are currently categorized as:

```text
Strength
Cardio
Mixed
```

Example:

```text
Push Day
→ Strength

10K Run
→ Cardio

Gym Session + Conditioning
→ Mixed
```

---

# Set Types

Strength sets can be classified using:

```text
Warmup
Working
Drop
Failure
```

Example:

```text
Bench Press

Set 1
95 lb × 10
Warmup

Set 2
135 lb × 8
Warmup

Set 3
185 lb × 8
Working

Set 4
185 lb × 7
Working
```

---

# Design Decisions

Several architectural decisions have been made deliberately to keep the application maintainable and extensible.

## Canonical Weight Storage

Weight is stored internally in:

```text
kilograms
```

The frontend can eventually display either:

```text
kilograms
```

or:

```text
pounds
```

based on the user's preference.

This avoids storing the same type of measurement using inconsistent units.

---

## Canonical Distance Storage

Distance is stored internally in:

```text
metres
```

It can later be displayed as:

```text
kilometres
```

or:

```text
miles
```

depending on user preference.

---

## Calculated Values Are Not Stored Unnecessarily

Where possible, the application stores underlying facts rather than values that can be calculated.

For example:

```text
Workout Duration
=
EndedAtUtc - StartedAtUtc
```

Strength training volume can be calculated using:

```text
Volume
=
Weight × Repetitions
```

Running pace can be calculated using:

```text
Pace
=
Duration / Distance
```

This prevents calculated values from becoming inconsistent with their source data.

---

## UTC Date Storage

Application timestamps are stored in UTC.

Examples:

```text
StartedAtUtc
EndedAtUtc
CreatedAtUtc
UpdatedAtUtc
RecordedAtUtc
```

The frontend will convert UTC timestamps into the user's local time for display where appropriate.

---

## Exercise Archiving

Exercises that may be associated with historical workout data should not be permanently deleted.

Custom exercises can instead be marked:

```text
IsArchived = true
```

Archived exercises are excluded from the normal active exercise library while remaining available for historical references.

Built-in exercises are protected from user modification and archiving.

---

## API DTO Separation

Entity Framework Core entities are not exposed directly as API contracts.

Requests and responses use dedicated DTOs such as:

```text
CreateExerciseDto
UpdateExerciseDto
ExerciseResponseDto
```

This prevents clients from directly controlling server-managed properties such as IDs, creation timestamps, archive state, and ownership information.

---

## Service Layer

Business logic is kept outside API controllers.

Exercise requests follow:

```text
ExercisesController
        ↓
IExerciseService
        ↓
ExerciseService
        ↓
FitnessTrackerDbContext
```

This keeps controllers focused on HTTP behavior while validation and application rules remain in the service layer.

---

## Separate REST API

The React frontend does not communicate directly with the database.

All requests follow:

```text
React
   ↓
ASP.NET Core API
   ↓
Entity Framework Core
   ↓
Database
```

This keeps application responsibilities separated and makes additional clients possible later.

---

## Client-Side Routing

The React application uses React Router to separate major application areas.

Current routes include:

```text
/
→ Dashboard

/exercises
→ Exercise Management

/workouts
→ Workout Management
```

This keeps individual features out of the root `App.tsx` component and provides a scalable structure as the application grows.

---

# API

The ASP.NET Core backend currently runs locally at:

```text
https://localhost:7081
```

HTTP development endpoint:

```text
http://localhost:5081
```

---

## Health Check

Endpoint:

```http
GET /api/health
```

Local URL:

```text
https://localhost:7081/api/health
```

Current response:

```json
{
  "status": "healthy",
  "application": "Fitness Tracker API"
}
```

---

## Exercise API

The Exercise API currently supports:

```http
GET /api/exercises
```

Returns the active exercise library.

Optional query parameter:

```text
includeArchived=true
```

Example:

```http
GET /api/exercises?includeArchived=true
```

---

```http
GET /api/exercises/{id}
```

Returns a specific exercise by GUID.

---

```http
POST /api/exercises
```

Creates a custom exercise.

Example request:

```json
{
  "name": "Kettlebell Goblet Squat",
  "exerciseType": "Strength",
  "trackingType": "WeightAndReps",
  "primaryMuscleGroup": "Quadriceps",
  "equipment": "Kettlebell"
}
```

Successful creation returns:

```text
201 Created
```

---

```http
PUT /api/exercises/{id}
```

Updates an active custom exercise.

Built-in exercises cannot be modified.

---

```http
DELETE /api/exercises/{id}
```

Soft-archives a custom exercise.

The record remains in the database with:

```text
IsArchived = true
```

Built-in exercises cannot be archived.

### Add Exercise to Workout

```http
POST /api/workouts/{workoutId}/exercises
```

Example:
{
  "exerciseId": "10000000-0000-0000-0000-000000000001",
  "notes": "Pause each rep on chest"
}

---

## Exercise API Response Codes

Exercise operations may return:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
```

Validation and business-rule errors use ASP.NET Core problem responses and are surfaced by the React frontend.

---

## Workout API

The initial Workout API currently supports:

```http
GET /api/workouts

## OpenAPI

The OpenAPI specification is available during development at:

```text
https://localhost:7081/openapi/v1.json
```

---

## Scalar API Documentation

Interactive API documentation is available during development at:

```text
https://localhost:7081/scalar
```

Current API endpoints can be tested directly through Scalar during development.

---

# Getting Started

## Prerequisites

Before running the project locally, install:

* Git
* .NET 10 SDK
* Node.js
* npm

The project was initially developed using:

```text
Visual Studio 2026
.NET SDK 10.0.400
```

---

## Clone the Repository

```bash
git clone https://github.com/niko2tall/fitness-tracker.git
```

Navigate into the repository:

```bash
cd fitness-tracker
```

---

## Restore .NET Dependencies

From the repository root:

```bash
dotnet restore
```

---

## Install Frontend Dependencies

Navigate to the React application:

```bash
cd src/fitness-tracker-web
```

Install dependencies:

```bash
npm install
```

Return to the repository root if necessary:

```bash
cd ../..
```

---

## Trust the Development HTTPS Certificate

For local HTTPS development:

```bash
dotnet dev-certs https --trust
```

Follow the operating system prompt to trust the development certificate.

---

## Create the Local Database

Navigate to the API project:

```bash
cd src/FitnessTracker.Api
```

Apply all Entity Framework Core migrations:

```bash
dotnet ef database update
```

This creates the local SQLite database and applies:

```text
InitialCreate
SeedBuiltInExercises
```

The local database file is ignored by Git and can be recreated from the migration history.

---

# Running the Application

The frontend and backend run as separate development processes.

Both must be running for the complete application to work.

---

## Start the Backend

Open a terminal from the repository root.

Navigate to:

```bash
cd src/FitnessTracker.Api
```

Run:

```bash
dotnet run --launch-profile https
```

Expected addresses:

```text
https://localhost:7081
http://localhost:5081
```

Keep this terminal running.

---

## Start the Frontend

Open a second terminal.

Navigate to:

```bash
cd src/fitness-tracker-web
```

Run:

```bash
npm run dev
```

The Vite development server should run at:

```text
http://localhost:5173
```

---

## Frontend Routes

Current frontend routes include:

```text
http://localhost:5173/
```

Dashboard.

```text
http://localhost:5173/exercises
```

Exercise Management.

```text
http://localhost:5173/workouts
```

Workout Management route for the next development phase.

---

## Verify Frontend-to-Backend Communication

With both applications running, open:

```text
http://localhost:5173/exercises
```

The React application should request:

```http
GET https://localhost:7081/api/exercises
```

and display the exercise library stored in SQLite.

Exercise details, creation, editing, and archiving should also communicate with the ASP.NET Core API.

The browser Network tools can be used to verify requests such as:

```text
GET     /api/exercises
GET     /api/exercises/{id}
POST    /api/exercises
PUT     /api/exercises/{id}
DELETE  /api/exercises/{id}
```

---

# Environment Configuration

The frontend development environment uses:

```text
src/fitness-tracker-web/.env.development
```

Current configuration:

```env
VITE_API_BASE_URL=https://localhost:7081
```

Vite environment variables intended for frontend use must use the:

```text
VITE_
```

prefix.

Secrets should never be stored in frontend environment variables because frontend values are accessible to users of the application.

---

# CORS

During local development:

```text
Frontend:
http://localhost:5173
```

communicates with:

```text
Backend:
https://localhost:7081
```

ASP.NET Core CORS configuration permits requests from the Vite development server.

Production CORS configuration will be updated when the application is deployed.

---

# Database

The application currently uses:

```text
Entity Framework Core
        ↓
SQLite
```

The local connection string is configured in the ASP.NET Core application.

Current database flow:

```text
Domain Models
      ↓
FitnessTrackerDbContext
      ↓
Entity Framework Core
      ↓
Migrations
      ↓
SQLite Database
```

Current migrations include:

```text
InitialCreate
SeedBuiltInExercises
```

The database currently contains the application tables:

```text
Users
Exercises
Workouts
WorkoutExercises
WorkoutSets
BodyMeasurements
```

Entity Framework Core also maintains:

```text
__EFMigrationsHistory
```

to record applied migrations.

The local SQLite database file is excluded from Git source control.

A new development database can be recreated using:

```bash
dotnet ef database update
```

---

# Database Relationships

The current database model includes the following relationships:

```text
ApplicationUser
│
├── 1 → many Workouts
│
├── 1 → many BodyMeasurements
│
└── 1 → many Custom Exercises


Workout
│
└── 1 → many WorkoutExercises


Exercise
│
└── 1 → many WorkoutExercises


WorkoutExercise
│
└── 1 → many WorkoutSets
```

Current delete behaviour includes:

```text
User → Workouts
CASCADE

User → BodyMeasurements
CASCADE

User → Custom Exercises
SET NULL

Workout → WorkoutExercises
CASCADE

Exercise → WorkoutExercises
RESTRICT

WorkoutExercise → WorkoutSets
CASCADE
```

The database also includes uniqueness constraints for:

```text
WorkoutId + OrderIndex
```

and:

```text
WorkoutExerciseId + SetNumber
```

to protect exercise ordering and set numbering within workouts.

---

# Development Roadmap

Development is being completed incrementally so each architectural layer can be tested before another is introduced.

## Phase 1 — Project Foundation

* [x] Create GitHub repository
* [x] Create Visual Studio solution
* [x] Create ASP.NET Core API
* [x] Create React frontend
* [x] Configure TypeScript
* [x] Configure HTTPS
* [x] Configure CORS
* [x] Connect React to ASP.NET Core
* [x] Add API health endpoint
* [x] Add OpenAPI
* [x] Add Scalar API documentation

---

## Phase 2 — Domain and Database

* [x] Design initial domain model
* [x] Create domain entities
* [x] Create application enums
* [x] Create `FitnessTrackerDbContext`
* [x] Configure entity relationships
* [x] Configure database indexes
* [x] Configure delete behaviour
* [x] Configure enum conversions
* [x] Configure SQLite
* [x] Create initial migration
* [x] Create local database
* [x] Verify database schema

---

## Phase 3 — Exercise Management API

* [x] Seed built-in exercises
* [x] Create exercise DTOs
* [x] Create exercise service
* [x] Create Exercise API controller
* [x] Implement GET exercises
* [x] Implement GET exercise by ID
* [x] Implement POST exercise
* [x] Implement PUT exercise
* [x] Implement exercise archiving
* [x] Add API validation and business rules
* [x] Test Exercise API using Scalar

---

## Phase 4 — Exercise Frontend

* [x] Create exercise API client
* [x] Create exercise list
* [x] Create exercise search and filtering
* [x] Create exercise details
* [x] Create custom exercise form
* [x] Create exercise editing and archiving
* [x] Implement responsive Exercise Management layout
* [x] Verify Exercise CRUD workflow end-to-end

---

## Phase 5 — Application Structure

* [x] Add client-side routing
* [x] Create shared application navigation
* [x] Move Exercise Management into its own page
* [x] Create Dashboard route
* [x] Create Workouts route
* [x] Add not-found route
* [x] Verify desktop and mobile navigation

---

## Phase 6 — Workout Logging

* [x] Create workout DTOs
* [x] Add development current-user abstraction
* [x] Create workout service
* [x] Create workout API
* [ ] Create workout creation workflow
* [x] Add exercises to workouts
* [x] Add sets to exercises
* [x] Record weight and repetitions
* [x] Record duration
* [x] Record distance
* [x] Record RPE
* [x] Add workout notes
* [x] Complete workouts
* [ ] Build React workout logging interface

---

## Phase 7 — Workout History

* [ ] Display workout history
* [ ] Filter workouts
* [ ] View workout details
* [ ] Edit previous workouts
* [ ] Archive or remove workouts
* [ ] Show previous exercise performance

---

## Phase 8 — Progress Tracking

* [ ] Calculate training volume
* [ ] Detect personal records
* [ ] Display exercise progression
* [ ] Display workout frequency
* [ ] Display running totals
* [ ] Calculate pace
* [ ] Track body weight
* [ ] Display body measurement history
* [ ] Add progress charts

---

## Phase 9 — Authentication

* [ ] Integrate ASP.NET Core Identity
* [ ] Extend `ApplicationUser`
* [ ] Add registration
* [ ] Add login
* [ ] Add logout
* [ ] Protect user data
* [ ] Add authorization
* [ ] Associate workouts with authenticated users
* [ ] Associate custom exercises with authenticated users

---

## Phase 10 — Mobile and PWA

* [ ] Complete application-wide responsive UI
* [ ] Refine mobile navigation
* [ ] Create mobile-friendly workout logging interface
* [ ] Add PWA manifest
* [ ] Add application icons
* [ ] Add installable web application support
* [ ] Investigate offline workout logging

---

## Phase 11 — Deployment

* [ ] Select production database
* [ ] Configure production environment
* [ ] Deploy ASP.NET Core API
* [ ] Deploy React frontend
* [ ] Configure production CORS
* [ ] Configure HTTPS
* [ ] Configure SPA route fallback
* [ ] Add deployed application URL
* [ ] Add screenshots to README

---

# Git Workflow

Development is committed in logical milestones rather than after every individual file.

Examples of project milestones:

```text
Project foundation
      ↓
Domain model
      ↓
Database configuration
      ↓
Exercise API
      ↓
Exercise frontend
      ↓
Application routing
      ↓
Workout API
      ↓
Workout frontend
      ↓
Authentication
      ↓
Deployment
```

Typical workflow:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Describe completed feature"
```

Push:

```bash
git push
```

Commit messages are intended to describe complete development milestones.

Examples:

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
```

---

# Building the Project

From the repository root:

```bash
dotnet build FitnessTracker.slnx
```

A successful build should end with:

```text
Build succeeded.
```

Frontend production builds can be tested separately from:

```bash
cd src/fitness-tracker-web
npm run build
```

Both builds are checked at major development milestones.

---

# Future Improvements

Potential future additions include:

* Workout templates
* Saved workout routines
* Training programs
* Exercise favorites
* Rest timers
* Automatic personal record detection
* Exercise history during active workouts
* Estimated one-rep maximum calculations
* Weekly and monthly volume analysis
* Muscle-group volume tracking
* Workout streaks
* Running split tracking
* Interval workout support
* Heart-rate data
* Calorie estimates
* Data export
* CSV export
* User profile customization
* Theme support
* Manual light/dark theme selection
* Push notifications
* Offline workout logging
* Cloud synchronization
* Native mobile client

These features are not guaranteed and will be evaluated as the core application develops.

---

# Project Goals

The primary goal of Fitness Tracker is to create a complete full-stack application that demonstrates practical software engineering rather than only isolated programming examples.

The project is intended to demonstrate experience with:

```text
C#
ASP.NET Core
REST APIs
React
TypeScript
React Router
Entity Framework Core
Relational Databases
SQL
Frontend / Backend Integration
Responsive Design
Authentication
Git
GitHub
Software Architecture
```

The project also provides an opportunity to demonstrate database-focused development while still building a complete user-facing interface.

---

# Portfolio Status

Fitness Tracker is an active portfolio project.

The repository represents the development process as well as the finished application, with features being added incrementally and committed as working milestones.

The Exercise Management feature is currently implemented end-to-end across the database, REST API, and React frontend.

Current development is moving into workout logging and workout data management.

A live deployment is not currently available.

Screenshots and deployment links will be added as the application reaches a more complete state.

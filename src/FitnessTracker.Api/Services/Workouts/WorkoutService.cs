using FitnessTracker.Api.Data;
using FitnessTracker.Api.DTOs.Workouts;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Models.Enums;
using FitnessTracker.Api.Services.Users;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Services.Workouts;

public class WorkoutService : IWorkoutService
{
    private readonly FitnessTrackerDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public WorkoutService(
        FitnessTrackerDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<WorkoutSummaryDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var currentUserId =
            _currentUserService.CurrentUserId;

        return await _dbContext.Workouts
            .AsNoTracking()
            .Where(workout =>
                workout.UserId == currentUserId)
            .OrderByDescending(workout =>
                workout.StartedAtUtc)
            .Select(workout => new WorkoutSummaryDto
            {
                Id = workout.Id,
                Name = workout.Name,
                WorkoutType = workout.WorkoutType,
                StartedAtUtc = workout.StartedAtUtc,
                EndedAtUtc = workout.EndedAtUtc,
                ExerciseCount =
                    workout.WorkoutExercises.Count
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<WorkoutResponseDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var currentUserId =
            _currentUserService.CurrentUserId;

        var workout = await _dbContext.Workouts
            .AsNoTracking()
            .AsSplitQuery()
            .Include(workout =>
                workout.WorkoutExercises)
                .ThenInclude(workoutExercise =>
                    workoutExercise.Exercise)
            .Include(workout =>
                workout.WorkoutExercises)
                .ThenInclude(workoutExercise =>
                    workoutExercise.WorkoutSets)
            .SingleOrDefaultAsync(
                workout =>
                    workout.Id == id &&
                    workout.UserId == currentUserId,
                cancellationToken);

        if (workout is null)
        {
            return null;
        }

        return MapToResponseDto(workout);
    }

    public async Task<WorkoutResponseDto> CreateAsync(
        CreateWorkoutDto dto,
        CancellationToken cancellationToken = default)
    {
        ValidateCreateWorkout(dto);

        var currentUserId =
            _currentUserService.CurrentUserId;

        var currentUserExists =
            await _dbContext.Users
                .AsNoTracking()
                .AnyAsync(
                    user =>
                        user.Id == currentUserId,
                    cancellationToken);

        if (!currentUserExists)
        {
            throw new InvalidOperationException(
                "The current application user could not be found.");
        }

        var now = DateTime.UtcNow;

        var workout = new Workout
        {
            Id = Guid.NewGuid(),
            UserId = currentUserId,
            Name = dto.Name.Trim(),
            WorkoutType = dto.WorkoutType!.Value,
            StartedAtUtc = now,
            EndedAtUtc = null,
            Notes = NormalizeOptionalText(dto.Notes),
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        _dbContext.Workouts.Add(workout);

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return MapToResponseDto(workout);
    }

    public async Task<WorkoutExerciseResponseDto?>
        AddExerciseAsync(
            Guid workoutId,
            AddWorkoutExerciseDto dto,
            CancellationToken cancellationToken = default)
    {
        if (!dto.ExerciseId.HasValue)
        {
            throw new ArgumentException(
                "Exercise ID is required.",
                nameof(dto.ExerciseId));
        }

        var currentUserId =
            _currentUserService.CurrentUserId;

        var workout = await _dbContext.Workouts
            .SingleOrDefaultAsync(
                workout =>
                    workout.Id == workoutId &&
                    workout.UserId == currentUserId,
                cancellationToken);

        if (workout is null)
        {
            return null;
        }

        if (workout.EndedAtUtc.HasValue)
        {
            throw new InvalidOperationException(
                "Exercises cannot be added to a completed workout.");
        }

        var exerciseId =
            dto.ExerciseId.Value;

        var exercise = await _dbContext.Exercises
            .AsNoTracking()
            .SingleOrDefaultAsync(
                exercise =>
                    exercise.Id == exerciseId,
                cancellationToken);

        if (exercise is null)
        {
            throw new KeyNotFoundException(
                "Exercise not found.");
        }

        if (exercise.IsArchived)
        {
            throw new InvalidOperationException(
                "Archived exercises cannot be added to a workout.");
        }

        ValidateWorkoutExerciseCompatibility(
            workout.WorkoutType,
            exercise.ExerciseType);

        var exerciseAlreadyAdded =
            await _dbContext.WorkoutExercises
                .AsNoTracking()
                .AnyAsync(
                    workoutExercise =>
                        workoutExercise.WorkoutId ==
                            workout.Id &&
                        workoutExercise.ExerciseId ==
                            exercise.Id,
                    cancellationToken);

        if (exerciseAlreadyAdded)
        {
            throw new InvalidOperationException(
                $"'{exercise.Name}' has already been added to this workout.");
        }

        var highestOrderIndex =
            await _dbContext.WorkoutExercises
                .Where(workoutExercise =>
                    workoutExercise.WorkoutId ==
                        workout.Id)
                .Select(workoutExercise =>
                    (int?)workoutExercise.OrderIndex)
                .MaxAsync(cancellationToken)
            ?? 0;

        var workoutExercise =
            new WorkoutExercise
            {
                Id = Guid.NewGuid(),
                WorkoutId = workout.Id,
                ExerciseId = exercise.Id,
                OrderIndex =
                    highestOrderIndex + 1,
                Notes =
                    NormalizeOptionalText(dto.Notes)
            };

        _dbContext.WorkoutExercises.Add(
            workoutExercise);

        workout.UpdatedAtUtc =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return new WorkoutExerciseResponseDto
        {
            Id = workoutExercise.Id,
            ExerciseId = exercise.Id,
            ExerciseName = exercise.Name,
            ExerciseType = exercise.ExerciseType,
            TrackingType = exercise.TrackingType,
            OrderIndex = workoutExercise.OrderIndex,
            Notes = workoutExercise.Notes,
            Sets = new List<WorkoutSetResponseDto>()
        };
    }

    public async Task<WorkoutSetResponseDto?>
        AddSetAsync(
            Guid workoutId,
            Guid workoutExerciseId,
            CreateWorkoutSetDto dto,
            CancellationToken cancellationToken = default)
    {
        var currentUserId =
            _currentUserService.CurrentUserId;

        var workoutExercise =
            await _dbContext.WorkoutExercises
                .Include(workoutExercise =>
                    workoutExercise.Workout)
                .Include(workoutExercise =>
                    workoutExercise.Exercise)
                .SingleOrDefaultAsync(
                    workoutExercise =>
                        workoutExercise.Id ==
                            workoutExerciseId &&
                        workoutExercise.WorkoutId ==
                            workoutId &&
                        workoutExercise.Workout.UserId ==
                            currentUserId,
                    cancellationToken);

        if (workoutExercise is null)
        {
            return null;
        }

        if (workoutExercise.Workout.EndedAtUtc.HasValue)
        {
            throw new InvalidOperationException(
                "Sets cannot be added to a completed workout.");
        }

        ValidateWorkoutSetData(
            workoutExercise.Exercise.ExerciseType,
            workoutExercise.Exercise.TrackingType,
            dto);

        var highestSetNumber =
            await _dbContext.WorkoutSets
                .Where(workoutSet =>
                    workoutSet.WorkoutExerciseId ==
                        workoutExercise.Id)
                .Select(workoutSet =>
                    (int?)workoutSet.SetNumber)
                .MaxAsync(cancellationToken)
            ?? 0;

        var workoutSet =
            new WorkoutSet
            {
                Id = Guid.NewGuid(),
                WorkoutExerciseId =
                    workoutExercise.Id,
                SetNumber =
                    highestSetNumber + 1,
                SetType =
                    dto.SetType,
                Reps =
                    dto.Reps,
                WeightKg =
                    dto.WeightKg,
                DurationSeconds =
                    dto.DurationSeconds,
                DistanceMeters =
                    dto.DistanceMeters,
                Rpe =
                    dto.Rpe,
                IsCompleted =
                    true,
                Notes =
                    NormalizeOptionalText(dto.Notes)
            };

        _dbContext.WorkoutSets.Add(
            workoutSet);

        workoutExercise.Workout.UpdatedAtUtc =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return MapToWorkoutSetResponseDto(
            workoutSet);
    }

    public async Task<WorkoutResponseDto?>
        CompleteAsync(
            Guid workoutId,
            CancellationToken cancellationToken = default)
    {
        var currentUserId =
            _currentUserService.CurrentUserId;

        var workout = await _dbContext.Workouts
            .AsSplitQuery()
            .Include(workout =>
                workout.WorkoutExercises)
                .ThenInclude(workoutExercise =>
                    workoutExercise.Exercise)
            .Include(workout =>
                workout.WorkoutExercises)
                .ThenInclude(workoutExercise =>
                    workoutExercise.WorkoutSets)
            .SingleOrDefaultAsync(
                workout =>
                    workout.Id == workoutId &&
                    workout.UserId == currentUserId,
                cancellationToken);

        if (workout is null)
        {
            return null;
        }

        if (workout.EndedAtUtc.HasValue)
        {
            throw new InvalidOperationException(
                "The workout has already been completed.");
        }

        var hasCompletedSet =
            workout.WorkoutExercises
                .SelectMany(workoutExercise =>
                    workoutExercise.WorkoutSets)
                .Any(workoutSet =>
                    workoutSet.IsCompleted);

        if (!hasCompletedSet)
        {
            throw new InvalidOperationException(
                "A workout must contain at least one completed set before it can be completed.");
        }

        var now = DateTime.UtcNow;

        workout.EndedAtUtc = now;
        workout.UpdatedAtUtc = now;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return MapToResponseDto(workout);
    }

    private static void ValidateCreateWorkout(
        CreateWorkoutDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException(
                "Workout name is required.",
                nameof(dto.Name));
        }

        if (!dto.WorkoutType.HasValue)
        {
            throw new ArgumentException(
                "Workout type is required.",
                nameof(dto.WorkoutType));
        }
    }

    private static void
        ValidateWorkoutExerciseCompatibility(
            WorkoutType workoutType,
            ExerciseType exerciseType)
    {
        var isCompatible =
            workoutType switch
            {
                WorkoutType.Strength =>
                    exerciseType ==
                        ExerciseType.Strength,

                WorkoutType.Cardio =>
                    exerciseType ==
                        ExerciseType.Cardio,

                WorkoutType.Mixed =>
                    true,

                _ => false
            };

        if (!isCompatible)
        {
            throw new InvalidOperationException(
                $"A {exerciseType} exercise cannot be added to a {workoutType} workout.");
        }
    }

    private static void ValidateWorkoutSetData(
        ExerciseType exerciseType,
        ExerciseTrackingType trackingType,
        CreateWorkoutSetDto dto)
    {
        if (dto.Reps is <= 0)
        {
            throw new ArgumentException(
                "Repetitions must be greater than zero.",
                nameof(dto.Reps));
        }

        if (dto.WeightKg is < 0)
        {
            throw new ArgumentException(
                "Weight cannot be negative.",
                nameof(dto.WeightKg));
        }

        if (dto.DurationSeconds is <= 0)
        {
            throw new ArgumentException(
                "Duration must be greater than zero.",
                nameof(dto.DurationSeconds));
        }

        if (dto.DistanceMeters is < 0)
        {
            throw new ArgumentException(
                "Distance cannot be negative.",
                nameof(dto.DistanceMeters));
        }

        if (dto.Rpe is < 1 or > 10)
        {
            throw new ArgumentException(
                "RPE must be between 1 and 10.",
                nameof(dto.Rpe));
        }

        if (
            exerciseType == ExerciseType.Cardio &&
            dto.SetType != SetType.Working)
        {
            throw new ArgumentException(
                "Cardio performance entries must use the Working set type.",
                nameof(dto.SetType));
        }

        switch (trackingType)
        {
            case ExerciseTrackingType.WeightAndReps:
                ValidateWeightAndRepsSet(dto);
                break;

            case ExerciseTrackingType.RepsOnly:
                ValidateRepsOnlySet(dto);
                break;

            case ExerciseTrackingType.Duration:
                ValidateDurationSet(dto);
                break;

            case ExerciseTrackingType.DistanceAndDuration:
                ValidateDistanceAndDurationSet(dto);
                break;

            default:
                throw new ArgumentException(
                    $"Unsupported exercise tracking type '{trackingType}'.");
        }
    }

    private static void ValidateWeightAndRepsSet(
        CreateWorkoutSetDto dto)
    {
        if (!dto.Reps.HasValue)
        {
            throw new ArgumentException(
                "Weight-and-reps exercises require repetitions.",
                nameof(dto.Reps));
        }

        if (!dto.WeightKg.HasValue)
        {
            throw new ArgumentException(
                "Weight-and-reps exercises require weight.",
                nameof(dto.WeightKg));
        }

        if (
            dto.DurationSeconds.HasValue ||
            dto.DistanceMeters.HasValue)
        {
            throw new ArgumentException(
                "Weight-and-reps exercises cannot record duration or distance.");
        }
    }

    private static void ValidateRepsOnlySet(
        CreateWorkoutSetDto dto)
    {
        if (!dto.Reps.HasValue)
        {
            throw new ArgumentException(
                "Reps-only exercises require repetitions.",
                nameof(dto.Reps));
        }

        if (
            dto.WeightKg.HasValue ||
            dto.DurationSeconds.HasValue ||
            dto.DistanceMeters.HasValue)
        {
            throw new ArgumentException(
                "Reps-only exercises cannot record weight, duration, or distance.");
        }
    }

    private static void ValidateDurationSet(
        CreateWorkoutSetDto dto)
    {
        if (!dto.DurationSeconds.HasValue)
        {
            throw new ArgumentException(
                "Duration-based exercises require duration.",
                nameof(dto.DurationSeconds));
        }

        if (
            dto.Reps.HasValue ||
            dto.WeightKg.HasValue ||
            dto.DistanceMeters.HasValue)
        {
            throw new ArgumentException(
                "Duration-based exercises cannot record repetitions, weight, or distance.");
        }
    }

    private static void
        ValidateDistanceAndDurationSet(
            CreateWorkoutSetDto dto)
    {
        if (
            !dto.DistanceMeters.HasValue ||
            dto.DistanceMeters.Value <= 0)
        {
            throw new ArgumentException(
                "Distance-and-duration exercises require a distance greater than zero.",
                nameof(dto.DistanceMeters));
        }

        if (!dto.DurationSeconds.HasValue)
        {
            throw new ArgumentException(
                "Distance-and-duration exercises require duration.",
                nameof(dto.DurationSeconds));
        }

        if (
            dto.Reps.HasValue ||
            dto.WeightKg.HasValue)
        {
            throw new ArgumentException(
                "Distance-and-duration exercises cannot record repetitions or weight.");
        }
    }

    private static string? NormalizeOptionalText(
        string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }

    private static WorkoutSetResponseDto
        MapToWorkoutSetResponseDto(
            WorkoutSet workoutSet)
    {
        return new WorkoutSetResponseDto
        {
            Id = workoutSet.Id,
            SetNumber = workoutSet.SetNumber,
            SetType = workoutSet.SetType,
            Reps = workoutSet.Reps,
            WeightKg = workoutSet.WeightKg,
            DurationSeconds =
                workoutSet.DurationSeconds,
            DistanceMeters =
                workoutSet.DistanceMeters,
            Rpe = workoutSet.Rpe,
            IsCompleted =
                workoutSet.IsCompleted,
            Notes = workoutSet.Notes
        };
    }

    private static WorkoutResponseDto
        MapToResponseDto(
            Workout workout)
    {
        return new WorkoutResponseDto
        {
            Id = workout.Id,
            Name = workout.Name,
            WorkoutType = workout.WorkoutType,
            StartedAtUtc = workout.StartedAtUtc,
            EndedAtUtc = workout.EndedAtUtc,
            Notes = workout.Notes,
            CreatedAtUtc = workout.CreatedAtUtc,
            UpdatedAtUtc = workout.UpdatedAtUtc,

            Exercises = workout.WorkoutExercises
                .OrderBy(workoutExercise =>
                    workoutExercise.OrderIndex)
                .Select(workoutExercise =>
                    new WorkoutExerciseResponseDto
                    {
                        Id =
                            workoutExercise.Id,

                        ExerciseId =
                            workoutExercise.ExerciseId,

                        ExerciseName =
                            workoutExercise.Exercise.Name,

                        ExerciseType =
                            workoutExercise.Exercise
                                .ExerciseType,

                        TrackingType =
                            workoutExercise.Exercise
                                .TrackingType,

                        OrderIndex =
                            workoutExercise.OrderIndex,

                        Notes =
                            workoutExercise.Notes,

                        Sets = workoutExercise
                            .WorkoutSets
                            .OrderBy(workoutSet =>
                                workoutSet.SetNumber)
                            .Select(workoutSet =>
                                new WorkoutSetResponseDto
                                {
                                    Id =
                                        workoutSet.Id,

                                    SetNumber =
                                        workoutSet.SetNumber,

                                    SetType =
                                        workoutSet.SetType,

                                    Reps =
                                        workoutSet.Reps,

                                    WeightKg =
                                        workoutSet.WeightKg,

                                    DurationSeconds =
                                        workoutSet
                                            .DurationSeconds,

                                    DistanceMeters =
                                        workoutSet
                                            .DistanceMeters,

                                    Rpe =
                                        workoutSet.Rpe,

                                    IsCompleted =
                                        workoutSet
                                            .IsCompleted,

                                    Notes =
                                        workoutSet.Notes
                                })
                            .ToList()
                    })
                .ToList()
        };
    }
}
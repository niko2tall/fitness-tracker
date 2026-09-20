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
        ValidateWorkoutDetails(
            dto.Name,
            dto.WorkoutType);

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

    public async Task<WorkoutResponseDto?> UpdateAsync(
        Guid workoutId,
        UpdateWorkoutDto dto,
        CancellationToken cancellationToken = default)
    {
        ValidateWorkoutDetails(
            dto.Name,
            dto.WorkoutType);

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
                "Completed workouts cannot be modified.");
        }

        var newWorkoutType =
            dto.WorkoutType!.Value;

        ValidateExistingExercisesForWorkoutType(
            newWorkoutType,
            workout.WorkoutExercises);

        workout.Name =
            dto.Name.Trim();

        workout.WorkoutType =
            newWorkoutType;

        workout.Notes =
            NormalizeOptionalText(dto.Notes);

        workout.UpdatedAtUtc =
            DateTime.UtcNow;

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

    public async Task<bool> RemoveExerciseAsync(
        Guid workoutId,
        Guid workoutExerciseId,
        CancellationToken cancellationToken = default)
    {
        var currentUserId =
            _currentUserService.CurrentUserId;

        var workoutExercise =
            await _dbContext.WorkoutExercises
                .Include(workoutExercise =>
                    workoutExercise.Workout)
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
            return false;
        }

        if (workoutExercise.Workout.EndedAtUtc.HasValue)
        {
            throw new InvalidOperationException(
                "Exercises cannot be removed from a completed workout.");
        }

        await using var transaction =
            await _dbContext.Database
                .BeginTransactionAsync(
                    cancellationToken);

        _dbContext.WorkoutExercises.Remove(
            workoutExercise);

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        await RenumberWorkoutExercisesAsync(
            workoutId,
            cancellationToken);

        workoutExercise.Workout.UpdatedAtUtc =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        await transaction.CommitAsync(
            cancellationToken);

        return true;
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
            dto.SetType,
            dto.Reps,
            dto.WeightKg,
            dto.DurationSeconds,
            dto.DistanceMeters,
            dto.Rpe);

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

    public async Task<WorkoutSetResponseDto?>
        UpdateSetAsync(
            Guid workoutId,
            Guid workoutExerciseId,
            Guid setId,
            UpdateWorkoutSetDto dto,
            CancellationToken cancellationToken = default)
    {
        var currentUserId =
            _currentUserService.CurrentUserId;

        var workoutSet =
            await _dbContext.WorkoutSets
                .Include(workoutSet =>
                    workoutSet.WorkoutExercise)
                    .ThenInclude(workoutExercise =>
                        workoutExercise.Workout)
                .Include(workoutSet =>
                    workoutSet.WorkoutExercise)
                    .ThenInclude(workoutExercise =>
                        workoutExercise.Exercise)
                .SingleOrDefaultAsync(
                    workoutSet =>
                        workoutSet.Id == setId &&
                        workoutSet.WorkoutExerciseId ==
                            workoutExerciseId &&
                        workoutSet.WorkoutExercise
                            .WorkoutId ==
                            workoutId &&
                        workoutSet.WorkoutExercise
                            .Workout.UserId ==
                            currentUserId,
                    cancellationToken);

        if (workoutSet is null)
        {
            return null;
        }

        var workout =
            workoutSet.WorkoutExercise.Workout;

        if (workout.EndedAtUtc.HasValue)
        {
            throw new InvalidOperationException(
                "Sets cannot be modified in a completed workout.");
        }

        var exercise =
            workoutSet.WorkoutExercise.Exercise;

        ValidateWorkoutSetData(
            exercise.ExerciseType,
            exercise.TrackingType,
            dto.SetType,
            dto.Reps,
            dto.WeightKg,
            dto.DurationSeconds,
            dto.DistanceMeters,
            dto.Rpe);

        workoutSet.SetType =
            dto.SetType;

        workoutSet.Reps =
            dto.Reps;

        workoutSet.WeightKg =
            dto.WeightKg;

        workoutSet.DurationSeconds =
            dto.DurationSeconds;

        workoutSet.DistanceMeters =
            dto.DistanceMeters;

        workoutSet.Rpe =
            dto.Rpe;

        workoutSet.Notes =
            NormalizeOptionalText(dto.Notes);

        workout.UpdatedAtUtc =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return MapToWorkoutSetResponseDto(
            workoutSet);
    }

    public async Task<bool> RemoveSetAsync(
        Guid workoutId,
        Guid workoutExerciseId,
        Guid setId,
        CancellationToken cancellationToken = default)
    {
        var currentUserId =
            _currentUserService.CurrentUserId;

        var workoutSet =
            await _dbContext.WorkoutSets
                .Include(workoutSet =>
                    workoutSet.WorkoutExercise)
                    .ThenInclude(workoutExercise =>
                        workoutExercise.Workout)
                .SingleOrDefaultAsync(
                    workoutSet =>
                        workoutSet.Id == setId &&
                        workoutSet.WorkoutExerciseId ==
                            workoutExerciseId &&
                        workoutSet.WorkoutExercise
                            .WorkoutId ==
                            workoutId &&
                        workoutSet.WorkoutExercise
                            .Workout.UserId ==
                            currentUserId,
                    cancellationToken);

        if (workoutSet is null)
        {
            return false;
        }

        var workout =
            workoutSet.WorkoutExercise.Workout;

        if (workout.EndedAtUtc.HasValue)
        {
            throw new InvalidOperationException(
                "Sets cannot be removed from a completed workout.");
        }

        await using var transaction =
            await _dbContext.Database
                .BeginTransactionAsync(
                    cancellationToken);

        _dbContext.WorkoutSets.Remove(
            workoutSet);

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        await RenumberWorkoutSetsAsync(
            workoutExerciseId,
            cancellationToken);

        workout.UpdatedAtUtc =
            DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        await transaction.CommitAsync(
            cancellationToken);

        return true;
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

        var now =
            DateTime.UtcNow;

        workout.EndedAtUtc =
            now;

        workout.UpdatedAtUtc =
            now;

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        return MapToResponseDto(workout);
    }

    private static void ValidateWorkoutDetails(
        string name,
        WorkoutType? workoutType)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Workout name is required.",
                nameof(name));
        }

        if (!workoutType.HasValue)
        {
            throw new ArgumentException(
                "Workout type is required.",
                nameof(workoutType));
        }
    }

    private static bool IsWorkoutExerciseCompatible(
        WorkoutType workoutType,
        ExerciseType exerciseType)
    {
        return workoutType switch
        {
            WorkoutType.Strength =>
                exerciseType ==
                    ExerciseType.Strength,

            WorkoutType.Cardio =>
                exerciseType ==
                    ExerciseType.Cardio,

            WorkoutType.Mixed =>
                true,

            _ =>
                false
        };
    }

    private static void
        ValidateWorkoutExerciseCompatibility(
            WorkoutType workoutType,
            ExerciseType exerciseType)
    {
        if (!IsWorkoutExerciseCompatible(
                workoutType,
                exerciseType))
        {
            throw new InvalidOperationException(
                $"A {exerciseType} exercise cannot be added to a {workoutType} workout.");
        }
    }

    private static void
        ValidateExistingExercisesForWorkoutType(
            WorkoutType workoutType,
            IEnumerable<WorkoutExercise>
                workoutExercises)
    {
        var incompatibleExercise =
            workoutExercises
                .FirstOrDefault(
                    workoutExercise =>
                        !IsWorkoutExerciseCompatible(
                            workoutType,
                            workoutExercise.Exercise
                                .ExerciseType));

        if (incompatibleExercise is null)
        {
            return;
        }

        throw new InvalidOperationException(
            $"Workout type cannot be changed to '{workoutType}' because '{incompatibleExercise.Exercise.Name}' is a {incompatibleExercise.Exercise.ExerciseType} exercise.");
    }

    private static void ValidateWorkoutSetData(
        ExerciseType exerciseType,
        ExerciseTrackingType trackingType,
        SetType setType,
        int? reps,
        double? weightKg,
        int? durationSeconds,
        double? distanceMeters,
        double? rpe)
    {
        if (reps is <= 0)
        {
            throw new ArgumentException(
                "Repetitions must be greater than zero.");
        }

        if (weightKg is < 0)
        {
            throw new ArgumentException(
                "Weight cannot be negative.");
        }

        if (durationSeconds is <= 0)
        {
            throw new ArgumentException(
                "Duration must be greater than zero.");
        }

        if (distanceMeters is < 0)
        {
            throw new ArgumentException(
                "Distance cannot be negative.");
        }

        if (rpe is < 1 or > 10)
        {
            throw new ArgumentException(
                "RPE must be between 1 and 10.");
        }

        if (
            exerciseType == ExerciseType.Cardio &&
            setType != SetType.Working)
        {
            throw new ArgumentException(
                "Cardio performance entries must use the Working set type.");
        }

        switch (trackingType)
        {
            case ExerciseTrackingType.WeightAndReps:
                ValidateWeightAndRepsSet(
                    reps,
                    weightKg,
                    durationSeconds,
                    distanceMeters);
                break;

            case ExerciseTrackingType.RepsOnly:
                ValidateRepsOnlySet(
                    reps,
                    weightKg,
                    durationSeconds,
                    distanceMeters);
                break;

            case ExerciseTrackingType.Duration:
                ValidateDurationSet(
                    reps,
                    weightKg,
                    durationSeconds,
                    distanceMeters);
                break;

            case ExerciseTrackingType.DistanceAndDuration:
                ValidateDistanceAndDurationSet(
                    reps,
                    weightKg,
                    durationSeconds,
                    distanceMeters);
                break;

            default:
                throw new ArgumentException(
                    $"Unsupported exercise tracking type '{trackingType}'.");
        }
    }

    private static void ValidateWeightAndRepsSet(
        int? reps,
        double? weightKg,
        int? durationSeconds,
        double? distanceMeters)
    {
        if (!reps.HasValue)
        {
            throw new ArgumentException(
                "Weight-and-reps exercises require repetitions.");
        }

        if (!weightKg.HasValue)
        {
            throw new ArgumentException(
                "Weight-and-reps exercises require weight.");
        }

        if (
            durationSeconds.HasValue ||
            distanceMeters.HasValue)
        {
            throw new ArgumentException(
                "Weight-and-reps exercises cannot record duration or distance.");
        }
    }

    private static void ValidateRepsOnlySet(
        int? reps,
        double? weightKg,
        int? durationSeconds,
        double? distanceMeters)
    {
        if (!reps.HasValue)
        {
            throw new ArgumentException(
                "Reps-only exercises require repetitions.");
        }

        if (
            weightKg.HasValue ||
            durationSeconds.HasValue ||
            distanceMeters.HasValue)
        {
            throw new ArgumentException(
                "Reps-only exercises cannot record weight, duration, or distance.");
        }
    }

    private static void ValidateDurationSet(
        int? reps,
        double? weightKg,
        int? durationSeconds,
        double? distanceMeters)
    {
        if (!durationSeconds.HasValue)
        {
            throw new ArgumentException(
                "Duration-based exercises require duration.");
        }

        if (
            reps.HasValue ||
            weightKg.HasValue ||
            distanceMeters.HasValue)
        {
            throw new ArgumentException(
                "Duration-based exercises cannot record repetitions, weight, or distance.");
        }
    }

    private static void
        ValidateDistanceAndDurationSet(
            int? reps,
            double? weightKg,
            int? durationSeconds,
            double? distanceMeters)
    {
        if (
            !distanceMeters.HasValue ||
            distanceMeters.Value <= 0)
        {
            throw new ArgumentException(
                "Distance-and-duration exercises require a distance greater than zero.");
        }

        if (!durationSeconds.HasValue)
        {
            throw new ArgumentException(
                "Distance-and-duration exercises require duration.");
        }

        if (
            reps.HasValue ||
            weightKg.HasValue)
        {
            throw new ArgumentException(
                "Distance-and-duration exercises cannot record repetitions or weight.");
        }
    }

    private async Task
        RenumberWorkoutExercisesAsync(
            Guid workoutId,
            CancellationToken cancellationToken)
    {
        var workoutExercises =
            await _dbContext.WorkoutExercises
                .Where(workoutExercise =>
                    workoutExercise.WorkoutId ==
                        workoutId)
                .OrderBy(workoutExercise =>
                    workoutExercise.OrderIndex)
                .ToListAsync(cancellationToken);

        if (workoutExercises.Count == 0)
        {
            return;
        }

        for (var index = 0;
             index < workoutExercises.Count;
             index++)
        {
            workoutExercises[index].OrderIndex =
                -(index + 1);
        }

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        for (var index = 0;
             index < workoutExercises.Count;
             index++)
        {
            workoutExercises[index].OrderIndex =
                index + 1;
        }

        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }

    private async Task RenumberWorkoutSetsAsync(
        Guid workoutExerciseId,
        CancellationToken cancellationToken)
    {
        var workoutSets =
            await _dbContext.WorkoutSets
                .Where(workoutSet =>
                    workoutSet.WorkoutExerciseId ==
                        workoutExerciseId)
                .OrderBy(workoutSet =>
                    workoutSet.SetNumber)
                .ToListAsync(cancellationToken);

        if (workoutSets.Count == 0)
        {
            return;
        }

        for (var index = 0;
             index < workoutSets.Count;
             index++)
        {
            workoutSets[index].SetNumber =
                -(index + 1);
        }

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        for (var index = 0;
             index < workoutSets.Count;
             index++)
        {
            workoutSets[index].SetNumber =
                index + 1;
        }

        await _dbContext.SaveChangesAsync(
            cancellationToken);
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
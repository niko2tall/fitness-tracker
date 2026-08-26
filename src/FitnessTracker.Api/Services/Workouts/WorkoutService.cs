using FitnessTracker.Api.Data;
using FitnessTracker.Api.DTOs.Workouts;
using FitnessTracker.Api.Models;
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

    private static string? NormalizeOptionalText(
        string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }

    private static WorkoutResponseDto MapToResponseDto(
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
                        Id = workoutExercise.Id,
                        ExerciseId =
                            workoutExercise.ExerciseId,
                        ExerciseName =
                            workoutExercise.Exercise.Name,
                        ExerciseType =
                            workoutExercise.Exercise.ExerciseType,
                        TrackingType =
                            workoutExercise.Exercise.TrackingType,
                        OrderIndex =
                            workoutExercise.OrderIndex,
                        Notes =
                            workoutExercise.Notes,

                        Sets = workoutExercise.WorkoutSets
                            .OrderBy(workoutSet =>
                                workoutSet.SetNumber)
                            .Select(workoutSet =>
                                new WorkoutSetResponseDto
                                {
                                    Id = workoutSet.Id,
                                    SetNumber =
                                        workoutSet.SetNumber,
                                    SetType =
                                        workoutSet.SetType,
                                    Reps =
                                        workoutSet.Reps,
                                    WeightKg =
                                        workoutSet.WeightKg,
                                    DurationSeconds =
                                        workoutSet.DurationSeconds,
                                    DistanceMeters =
                                        workoutSet.DistanceMeters,
                                    Rpe =
                                        workoutSet.Rpe,
                                    IsCompleted =
                                        workoutSet.IsCompleted,
                                    Notes =
                                        workoutSet.Notes
                                })
                            .ToList()
                    })
                .ToList()
        };
    }
}
using FitnessTracker.Api.Data;
using FitnessTracker.Api.DTOs.Progress;
using FitnessTracker.Api.Services.Users;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Services.Progress;

public class ProgressService :
    IProgressService
{
    private readonly FitnessTrackerDbContext
        _dbContext;

    private readonly ICurrentUserService
        _currentUserService;

    public ProgressService(
        FitnessTrackerDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService =
            currentUserService;
    }

    public async Task<
        ExerciseHistoryResponseDto?>
        GetExerciseHistoryAsync(
            Guid exerciseId,
            CancellationToken cancellationToken
                = default)
    {
        var exercise =
            await _dbContext.Exercises
                .AsNoTracking()
                .SingleOrDefaultAsync(
                    exercise =>
                        exercise.Id ==
                        exerciseId,
                    cancellationToken);

        if (exercise is null)
        {
            return null;
        }

        var currentUserId =
            _currentUserService
                .CurrentUserId;

        var historicalExercises =
            await _dbContext
                .WorkoutExercises
                .AsNoTracking()
                .Include(
                    workoutExercise =>
                        workoutExercise
                            .Workout)
                .Include(
                    workoutExercise =>
                        workoutExercise
                            .WorkoutSets)
                .Where(
                    workoutExercise =>
                        workoutExercise
                            .ExerciseId ==
                        exerciseId
                        &&
                        workoutExercise
                            .Workout
                            .UserId ==
                        currentUserId
                        &&
                        workoutExercise
                            .Workout
                            .EndedAtUtc !=
                        null
                        &&
                        workoutExercise
                            .WorkoutSets
                            .Any(
                                set =>
                                    set
                                        .IsCompleted))
                .OrderByDescending(
                    workoutExercise =>
                        workoutExercise
                            .Workout
                            .EndedAtUtc)
                .ThenByDescending(
                    workoutExercise =>
                        workoutExercise
                            .Workout
                            .StartedAtUtc)
                .ToListAsync(
                    cancellationToken);

        var entries =
            historicalExercises
                .Select(
                    workoutExercise =>
                        new ExerciseHistoryWorkoutDto
                        {
                            WorkoutId =
                                workoutExercise
                                    .WorkoutId,

                            WorkoutExerciseId =
                                workoutExercise
                                    .Id,

                            WorkoutName =
                                workoutExercise
                                    .Workout
                                    .Name,

                            WorkoutType =
                                workoutExercise
                                    .Workout
                                    .WorkoutType,

                            StartedAtUtc =
                                workoutExercise
                                    .Workout
                                    .StartedAtUtc,

                            EndedAtUtc =
                                workoutExercise
                                    .Workout
                                    .EndedAtUtc,

                            ExerciseNotes =
                                workoutExercise
                                    .Notes,

                            Sets =
                                workoutExercise
                                    .WorkoutSets
                                    .Where(
                                        set =>
                                            set
                                                .IsCompleted)
                                    .OrderBy(
                                        set =>
                                            set
                                                .SetNumber)
                                    .Select(
                                        set =>
                                            new ExerciseHistorySetDto
                                            {
                                                Id =
                                                    set
                                                        .Id,

                                                SetNumber =
                                                    set
                                                        .SetNumber,

                                                SetType =
                                                    set
                                                        .SetType,

                                                Reps =
                                                    set
                                                        .Reps,

                                                WeightKg =
                                                    set
                                                        .WeightKg,

                                                DurationSeconds =
                                                    set
                                                        .DurationSeconds,

                                                DistanceMeters =
                                                    set
                                                        .DistanceMeters,

                                                Rpe =
                                                    set
                                                        .Rpe,

                                                Notes =
                                                    set
                                                        .Notes,
                                            })
                                    .ToList(),
                        })
                .ToList();

        return new ExerciseHistoryResponseDto
        {
            ExerciseId =
                exercise.Id,

            ExerciseName =
                exercise.Name,

            ExerciseType =
                exercise.ExerciseType,

            TrackingType =
                exercise.TrackingType,

            PrimaryMuscleGroup =
                exercise.PrimaryMuscleGroup,

            Equipment =
                exercise.Equipment,

            IsCustom =
                exercise.IsCustom,

            IsArchived =
                exercise.IsArchived,

            Entries =
                entries,
        };
    }
}
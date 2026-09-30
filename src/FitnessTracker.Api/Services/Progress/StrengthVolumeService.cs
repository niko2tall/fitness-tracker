using FitnessTracker.Api.Data;
using FitnessTracker.Api.DTOs.Progress;
using FitnessTracker.Api.Models.Enums;
using FitnessTracker.Api.Services.Users;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Services.Progress;

public sealed class StrengthVolumeService : IStrengthVolumeService
{
    private readonly FitnessTrackerDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public StrengthVolumeService(
        FitnessTrackerDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<StrengthVolumeResponseDto> GetStrengthVolumeAsync(
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.CurrentUserId;

        var rawSets = await _dbContext.WorkoutSets
            .AsNoTracking()
            .Where(set =>
                set.IsCompleted &&
                set.Reps.HasValue &&
                set.Reps.Value > 0 &&
                set.WeightKg.HasValue &&
                set.WeightKg.Value > 0 &&
                set.WorkoutExercise.Exercise.TrackingType ==
                    ExerciseTrackingType.WeightAndReps &&
                set.WorkoutExercise.Workout.UserId == userId &&
                set.WorkoutExercise.Workout.EndedAtUtc != null)
            .Select(set => new
            {
                WorkoutId =
                    set.WorkoutExercise.Workout.Id,

                WorkoutName =
                    set.WorkoutExercise.Workout.Name,

                WorkoutType =
                    set.WorkoutExercise.Workout.WorkoutType,

                StartedAtUtc =
                    set.WorkoutExercise.Workout.StartedAtUtc,

                EndedAtUtc =
                    set.WorkoutExercise.Workout.EndedAtUtc,

                ExerciseId =
                    set.WorkoutExercise.ExerciseId,

                ExerciseName =
                    set.WorkoutExercise.Exercise.Name,

                WeightKg =
                    set.WeightKg,

                Reps =
                    set.Reps,
            })
            .ToListAsync(cancellationToken);

        var workouts = rawSets
            .GroupBy(set => new
            {
                set.WorkoutId,
                set.WorkoutName,
                set.WorkoutType,
                set.StartedAtUtc,
                set.EndedAtUtc,
            })
            .Select(workoutGroup =>
            {
                var exercises = workoutGroup
                    .GroupBy(set => new
                    {
                        set.ExerciseId,
                        set.ExerciseName,
                    })
                    .Select(exerciseGroup =>
                    {
                        var exerciseVolume =
                            exerciseGroup.Sum(set =>
                                Convert.ToDouble(
                                    set.WeightKg.GetValueOrDefault()) *
                                set.Reps.GetValueOrDefault());

                        return new StrengthVolumeExerciseDto
                        {
                            ExerciseId =
                                exerciseGroup.Key.ExerciseId,

                            ExerciseName =
                                exerciseGroup.Key.ExerciseName,

                            VolumeLoadKg =
                                Math.Round(
                                    exerciseVolume,
                                    4,
                                    MidpointRounding.AwayFromZero),

                            VolumeSetCount =
                                exerciseGroup.Count(),
                        };
                    })
                    .OrderByDescending(
                        exercise =>
                            exercise.VolumeLoadKg)
                    .ThenBy(
                        exercise =>
                            exercise.ExerciseName)
                    .ToList();

                var totalVolume =
                    exercises.Sum(
                        exercise =>
                            exercise.VolumeLoadKg);

                return new StrengthVolumeWorkoutDto
                {
                    WorkoutId =
                        workoutGroup.Key.WorkoutId,

                    WorkoutName =
                        workoutGroup.Key.WorkoutName,

                    WorkoutType =
                        workoutGroup.Key.WorkoutType,

                    StartedAtUtc =
                        workoutGroup.Key.StartedAtUtc,

                    EndedAtUtc =
                        workoutGroup.Key.EndedAtUtc,

                    TotalVolumeLoadKg =
                        Math.Round(
                            totalVolume,
                            4,
                            MidpointRounding.AwayFromZero),

                    VolumeSetCount =
                        workoutGroup.Count(),

                    Exercises =
                        exercises,
                };
            })
            .OrderByDescending(
                workout =>
                    workout.StartedAtUtc)
            .ToList();

        return new StrengthVolumeResponseDto
        {
            Workouts = workouts,
        };
    }
}
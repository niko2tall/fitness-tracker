using FitnessTracker.Api.Data;
using FitnessTracker.Api.DTOs.Progress;
using FitnessTracker.Api.Models.Enums;
using FitnessTracker.Api.Services.Users;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Services.Progress;

public sealed class CardioSummaryService : ICardioSummaryService
{
    private readonly FitnessTrackerDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;

    public CardioSummaryService(
        FitnessTrackerDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<CardioSummaryResponseDto> GetCardioSummaryAsync(
        CancellationToken cancellationToken = default)
    {
        var userId =
            _currentUserService.CurrentUserId;

        var rawSets = await _dbContext.WorkoutSets
            .AsNoTracking()
            .Where(set =>
                set.IsCompleted &&
                set.WorkoutExercise.Workout.UserId == userId &&
                set.WorkoutExercise.Workout.EndedAtUtc != null &&
                set.WorkoutExercise.Exercise.ExerciseType ==
                    ExerciseType.Cardio &&
                set.DurationSeconds.HasValue &&
                set.DurationSeconds.Value > 0 &&
                (
                    set.WorkoutExercise.Exercise.TrackingType ==
                        ExerciseTrackingType.Duration ||
                    (
                        set.WorkoutExercise.Exercise.TrackingType ==
                            ExerciseTrackingType.DistanceAndDuration &&
                        set.DistanceMeters.HasValue &&
                        set.DistanceMeters.Value > 0
                    )
                ))
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

                TrackingType =
                    set.WorkoutExercise.Exercise.TrackingType,

                DistanceMeters =
                    set.DistanceMeters,

                DurationSeconds =
                    set.DurationSeconds,
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
                        set.TrackingType,
                    })
                    .Select(exerciseGroup =>
                    {
                        var distanceMeters =
                            exerciseGroup.Sum(set =>
                                Convert.ToDouble(
                                    set.DistanceMeters
                                        .GetValueOrDefault()));

                        var durationSeconds =
                            exerciseGroup.Sum(set =>
                                Convert.ToDouble(
                                    set.DurationSeconds
                                        .GetValueOrDefault()));

                        return new CardioSummaryExerciseDto
                        {
                            ExerciseId =
                                exerciseGroup.Key.ExerciseId,

                            ExerciseName =
                                exerciseGroup.Key.ExerciseName,

                            TrackingType =
                                exerciseGroup.Key.TrackingType,

                            DistanceMeters =
                                Math.Round(
                                    distanceMeters,
                                    4,
                                    MidpointRounding.AwayFromZero),

                            DurationSeconds =
                                Math.Round(
                                    durationSeconds,
                                    4,
                                    MidpointRounding.AwayFromZero),

                            CardioSetCount =
                                exerciseGroup.Count(),
                        };
                    })
                    .OrderByDescending(exercise =>
                        exercise.DistanceMeters)
                    .ThenByDescending(exercise =>
                        exercise.DurationSeconds)
                    .ThenBy(exercise =>
                        exercise.ExerciseName)
                    .ToList();

                var totalDistanceMeters =
                    exercises.Sum(exercise =>
                        exercise.DistanceMeters);

                var totalDurationSeconds =
                    exercises.Sum(exercise =>
                        exercise.DurationSeconds);

                var distanceDurationSeconds =
                    exercises
                        .Where(exercise =>
                            exercise.TrackingType ==
                                ExerciseTrackingType.DistanceAndDuration)
                        .Sum(exercise =>
                            exercise.DurationSeconds);

                return new CardioSummaryWorkoutDto
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

                    TotalDistanceMeters =
                        Math.Round(
                            totalDistanceMeters,
                            4,
                            MidpointRounding.AwayFromZero),

                    TotalDurationSeconds =
                        Math.Round(
                            totalDurationSeconds,
                            4,
                            MidpointRounding.AwayFromZero),

                    DistanceDurationSeconds =
                        Math.Round(
                            distanceDurationSeconds,
                            4,
                            MidpointRounding.AwayFromZero),

                    CardioSetCount =
                        workoutGroup.Count(),

                    Exercises =
                        exercises,
                };
            })
            .OrderByDescending(workout =>
                workout.StartedAtUtc)
            .ToList();

        return new CardioSummaryResponseDto
        {
            Workouts = workouts,
        };
    }
}
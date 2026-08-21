using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.Data.Seed;

public static class ExerciseSeedData
{
    private static readonly DateTime SeedCreatedAtUtc =
        new(2026, 8, 21, 0, 0, 0, DateTimeKind.Utc);

    public static readonly object[] Exercises =
    {
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
            Name = "Barbell Bench Press",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Chest",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
            Name = "Incline Barbell Bench Press",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Chest",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
            Name = "Dumbbell Bench Press",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Chest",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000004"),
            Name = "Incline Dumbbell Bench Press",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Chest",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000005"),
            Name = "Overhead Press",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Shoulders",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000006"),
            Name = "Dumbbell Shoulder Press",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Shoulders",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000007"),
            Name = "Lateral Raise",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Shoulders",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000008"),
            Name = "Cable Fly",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Chest",
            Equipment = "Cable",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000009"),
            Name = "Push-Up",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.RepsOnly,
            PrimaryMuscleGroup = "Chest",
            Equipment = "Bodyweight",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000010"),
            Name = "Triceps Pushdown",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Triceps",
            Equipment = "Cable",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000011"),
            Name = "Overhead Triceps Extension",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Triceps",
            Equipment = "Cable",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000012"),
            Name = "Back Squat",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Quadriceps",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000013"),
            Name = "Front Squat",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Quadriceps",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000014"),
            Name = "Romanian Deadlift",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Hamstrings",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000015"),
            Name = "Deadlift",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Back",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000016"),
            Name = "Leg Press",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Quadriceps",
            Equipment = "Machine",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000017"),
            Name = "Bulgarian Split Squat",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Quadriceps",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000018"),
            Name = "Walking Lunge",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Quadriceps",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000019"),
            Name = "Leg Extension",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Quadriceps",
            Equipment = "Machine",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000020"),
            Name = "Leg Curl",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Hamstrings",
            Equipment = "Machine",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000021"),
            Name = "Standing Calf Raise",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Calves",
            Equipment = "Machine",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000022"),
            Name = "Pull-Up",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.RepsOnly,
            PrimaryMuscleGroup = "Back",
            Equipment = "Bodyweight",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000023"),
            Name = "Chin-Up",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.RepsOnly,
            PrimaryMuscleGroup = "Back",
            Equipment = "Bodyweight",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000024"),
            Name = "Lat Pulldown",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Back",
            Equipment = "Cable",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000025"),
            Name = "Barbell Row",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Back",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000026"),
            Name = "Seated Cable Row",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Back",
            Equipment = "Cable",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000027"),
            Name = "One-Arm Dumbbell Row",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Back",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000028"),
            Name = "Face Pull",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Shoulders",
            Equipment = "Cable",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000029"),
            Name = "Barbell Curl",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Biceps",
            Equipment = "Barbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000030"),
            Name = "Dumbbell Curl",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Biceps",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000031"),
            Name = "Hammer Curl",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Biceps",
            Equipment = "Dumbbell",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000032"),
            Name = "Plank",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.Duration,
            PrimaryMuscleGroup = "Core",
            Equipment = "Bodyweight",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000033"),
            Name = "Hanging Leg Raise",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.RepsOnly,
            PrimaryMuscleGroup = "Core",
            Equipment = "Bodyweight",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000034"),
            Name = "Cable Crunch",
            ExerciseType = ExerciseType.Strength,
            TrackingType = ExerciseTrackingType.WeightAndReps,
            PrimaryMuscleGroup = "Core",
            Equipment = "Cable",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },

        // Cardio
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000035"),
            Name = "Outdoor Run",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.DistanceAndDuration,
            PrimaryMuscleGroup = "Full Body",
            Equipment = "None",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000036"),
            Name = "Treadmill Run",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.DistanceAndDuration,
            PrimaryMuscleGroup = "Full Body",
            Equipment = "Treadmill",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000037"),
            Name = "Cycling",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.DistanceAndDuration,
            PrimaryMuscleGroup = "Legs",
            Equipment = "Bicycle",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000038"),
            Name = "Stationary Bike",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.DistanceAndDuration,
            PrimaryMuscleGroup = "Legs",
            Equipment = "Stationary Bike",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000039"),
            Name = "Rowing Machine",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.DistanceAndDuration,
            PrimaryMuscleGroup = "Full Body",
            Equipment = "Rowing Machine",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000040"),
            Name = "Elliptical",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.DistanceAndDuration,
            PrimaryMuscleGroup = "Full Body",
            Equipment = "Elliptical",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000041"),
            Name = "Stair Climber",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.Duration,
            PrimaryMuscleGroup = "Legs",
            Equipment = "Stair Climber",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        },
        new
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000042"),
            Name = "Walking",
            ExerciseType = ExerciseType.Cardio,
            TrackingType = ExerciseTrackingType.DistanceAndDuration,
            PrimaryMuscleGroup = "Full Body",
            Equipment = "None",
            IsCustom = false,
            CreatedByUserId = (Guid?)null,
            IsArchived = false,
            CreatedAtUtc = SeedCreatedAtUtc
        }
    };
}
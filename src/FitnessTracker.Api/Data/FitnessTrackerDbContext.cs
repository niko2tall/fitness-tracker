using FitnessTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Data;

public class FitnessTrackerDbContext : DbContext
{
    public FitnessTrackerDbContext(
        DbContextOptions<FitnessTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();

    public DbSet<Workout> Workouts => Set<Workout>();

    public DbSet<Exercise> Exercises => Set<Exercise>();

    public DbSet<WorkoutExercise> WorkoutExercises => Set<WorkoutExercise>();

    public DbSet<WorkoutSet> WorkoutSets => Set<WorkoutSet>();

    public DbSet<BodyMeasurement> BodyMeasurements => Set<BodyMeasurement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureApplicationUser(modelBuilder);
        ConfigureExercise(modelBuilder);
        ConfigureWorkout(modelBuilder);
        ConfigureWorkoutExercise(modelBuilder);
        ConfigureWorkoutSet(modelBuilder);
        ConfigureBodyMeasurement(modelBuilder);
    }

    private static void ConfigureApplicationUser(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<ApplicationUser>();

        entity.ToTable("Users");

        entity.HasKey(user => user.Id);

        entity.Property(user => user.DisplayName)
            .IsRequired()
            .HasMaxLength(100);

        entity.Property(user => user.PreferredWeightUnit)
            .HasConversion<string>()
            .HasMaxLength(20);

        entity.Property(user => user.PreferredDistanceUnit)
            .HasConversion<string>()
            .HasMaxLength(20);

        entity.HasMany(user => user.Workouts)
            .WithOne(workout => workout.User)
            .HasForeignKey(workout => workout.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasMany(user => user.BodyMeasurements)
            .WithOne(measurement => measurement.User)
            .HasForeignKey(measurement => measurement.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasMany(user => user.CustomExercises)
            .WithOne(exercise => exercise.CreatedByUser)
            .HasForeignKey(exercise => exercise.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureExercise(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<Exercise>();

        entity.ToTable("Exercises");

        entity.HasKey(exercise => exercise.Id);

        entity.Property(exercise => exercise.Name)
            .IsRequired()
            .HasMaxLength(150);

        entity.Property(exercise => exercise.ExerciseType)
            .HasConversion<string>()
            .HasMaxLength(30);

        entity.Property(exercise => exercise.TrackingType)
            .HasConversion<string>()
            .HasMaxLength(40);

        entity.Property(exercise => exercise.PrimaryMuscleGroup)
            .HasMaxLength(100);

        entity.Property(exercise => exercise.Equipment)
            .HasMaxLength(100);

        entity.HasIndex(exercise => exercise.CreatedByUserId);

        entity.HasIndex(exercise => new
        {
            exercise.Name,
            exercise.IsArchived
        });
    }

    private static void ConfigureWorkout(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<Workout>();

        entity.ToTable("Workouts");

        entity.HasKey(workout => workout.Id);

        entity.Property(workout => workout.Name)
            .IsRequired()
            .HasMaxLength(150);

        entity.Property(workout => workout.WorkoutType)
            .HasConversion<string>()
            .HasMaxLength(30);

        entity.Property(workout => workout.Notes)
            .HasMaxLength(2000);

        entity.HasIndex(workout => new
        {
            workout.UserId,
            workout.StartedAtUtc
        });

        entity.HasMany(workout => workout.WorkoutExercises)
            .WithOne(workoutExercise => workoutExercise.Workout)
            .HasForeignKey(workoutExercise => workoutExercise.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureWorkoutExercise(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<WorkoutExercise>();

        entity.ToTable("WorkoutExercises");

        entity.HasKey(workoutExercise => workoutExercise.Id);

        entity.Property(workoutExercise => workoutExercise.Notes)
            .HasMaxLength(1000);

        entity.HasOne(workoutExercise => workoutExercise.Exercise)
            .WithMany(exercise => exercise.WorkoutExercises)
            .HasForeignKey(workoutExercise => workoutExercise.ExerciseId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasMany(workoutExercise => workoutExercise.WorkoutSets)
            .WithOne(workoutSet => workoutSet.WorkoutExercise)
            .HasForeignKey(workoutSet => workoutSet.WorkoutExerciseId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasIndex(workoutExercise => new
        {
            workoutExercise.WorkoutId,
            workoutExercise.OrderIndex
        })
        .IsUnique();
    }

    private static void ConfigureWorkoutSet(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<WorkoutSet>();

        entity.ToTable("WorkoutSets");

        entity.HasKey(workoutSet => workoutSet.Id);

        entity.Property(workoutSet => workoutSet.SetType)
            .HasConversion<string>()
            .HasMaxLength(30);

        entity.Property(workoutSet => workoutSet.Notes)
            .HasMaxLength(1000);

        entity.HasIndex(workoutSet => new
        {
            workoutSet.WorkoutExerciseId,
            workoutSet.SetNumber
        })
        .IsUnique();
    }

    private static void ConfigureBodyMeasurement(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<BodyMeasurement>();

        entity.ToTable("BodyMeasurements");

        entity.HasKey(measurement => measurement.Id);

        entity.Property(measurement => measurement.Notes)
            .HasMaxLength(1000);

        entity.HasIndex(measurement => new
        {
            measurement.UserId,
            measurement.RecordedAtUtc
        });
    }
}
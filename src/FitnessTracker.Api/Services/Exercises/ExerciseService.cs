using FitnessTracker.Api.Data;
using FitnessTracker.Api.DTOs.Exercises;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Services.Exercises;

public class ExerciseService : IExerciseService
{
    private readonly FitnessTrackerDbContext _dbContext;

    public ExerciseService(FitnessTrackerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ExerciseResponseDto>> GetAllAsync(
        bool includeArchived = false,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Exercises
            .AsNoTracking()
            .AsQueryable();

        if (!includeArchived)
        {
            query = query.Where(exercise => !exercise.IsArchived);
        }

        return await query
            .OrderBy(exercise => exercise.Name)
            .Select(exercise => new ExerciseResponseDto
            {
                Id = exercise.Id,
                Name = exercise.Name,
                ExerciseType = exercise.ExerciseType,
                TrackingType = exercise.TrackingType,
                PrimaryMuscleGroup = exercise.PrimaryMuscleGroup,
                Equipment = exercise.Equipment,
                IsCustom = exercise.IsCustom,
                IsArchived = exercise.IsArchived,
                CreatedAtUtc = exercise.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ExerciseResponseDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Exercises
            .AsNoTracking()
            .Where(exercise => exercise.Id == id)
            .Select(exercise => new ExerciseResponseDto
            {
                Id = exercise.Id,
                Name = exercise.Name,
                ExerciseType = exercise.ExerciseType,
                TrackingType = exercise.TrackingType,
                PrimaryMuscleGroup = exercise.PrimaryMuscleGroup,
                Equipment = exercise.Equipment,
                IsCustom = exercise.IsCustom,
                IsArchived = exercise.IsArchived,
                CreatedAtUtc = exercise.CreatedAtUtc
            })
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<ExerciseResponseDto> CreateAsync(
        CreateExerciseDto dto,
        CancellationToken cancellationToken = default)
    {
        ValidateRequiredValues(
            dto.Name,
            dto.ExerciseType,
            dto.TrackingType);

        var name = dto.Name.Trim();
        var exerciseType = dto.ExerciseType!.Value;
        var trackingType = dto.TrackingType!.Value;

        ValidateTrackingCombination(exerciseType, trackingType);

        if (await ActiveExerciseNameExistsAsync(
                name,
                excludedExerciseId: null,
                cancellationToken))
        {
            throw new InvalidOperationException(
                $"An active exercise named '{name}' already exists.");
        }

        var exercise = new Exercise
        {
            Id = Guid.NewGuid(),
            Name = name,
            ExerciseType = exerciseType,
            TrackingType = trackingType,
            PrimaryMuscleGroup = NormalizeOptionalText(dto.PrimaryMuscleGroup),
            Equipment = NormalizeOptionalText(dto.Equipment),
            IsCustom = true,

            // Authentication has not been implemented yet.
            // Once it is, this will be populated from the authenticated user.
            CreatedByUserId = null,

            IsArchived = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        _dbContext.Exercises.Add(exercise);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return MapToResponseDto(exercise);
    }

    public async Task<ExerciseResponseDto?> UpdateAsync(
        Guid id,
        UpdateExerciseDto dto,
        CancellationToken cancellationToken = default)
    {
        ValidateRequiredValues(
            dto.Name,
            dto.ExerciseType,
            dto.TrackingType);

        var exercise = await _dbContext.Exercises
            .SingleOrDefaultAsync(
                exercise => exercise.Id == id,
                cancellationToken);

        if (exercise is null)
        {
            return null;
        }

        if (!exercise.IsCustom)
        {
            throw new InvalidOperationException(
                "Built-in exercises cannot be modified.");
        }

        if (exercise.IsArchived)
        {
            throw new InvalidOperationException(
                "Archived exercises cannot be modified.");
        }

        var name = dto.Name.Trim();
        var exerciseType = dto.ExerciseType!.Value;
        var trackingType = dto.TrackingType!.Value;

        ValidateTrackingCombination(exerciseType, trackingType);

        if (await ActiveExerciseNameExistsAsync(
                name,
                exercise.Id,
                cancellationToken))
        {
            throw new InvalidOperationException(
                $"An active exercise named '{name}' already exists.");
        }

        exercise.Name = name;
        exercise.ExerciseType = exerciseType;
        exercise.TrackingType = trackingType;
        exercise.PrimaryMuscleGroup =
            NormalizeOptionalText(dto.PrimaryMuscleGroup);
        exercise.Equipment =
            NormalizeOptionalText(dto.Equipment);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return MapToResponseDto(exercise);
    }

    public async Task<bool> ArchiveAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var exercise = await _dbContext.Exercises
            .SingleOrDefaultAsync(
                exercise => exercise.Id == id,
                cancellationToken);

        if (exercise is null)
        {
            return false;
        }

        if (!exercise.IsCustom)
        {
            throw new InvalidOperationException(
                "Built-in exercises cannot be archived.");
        }

        if (exercise.IsArchived)
        {
            return true;
        }

        exercise.IsArchived = true;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    private async Task<bool> ActiveExerciseNameExistsAsync(
        string name,
        Guid? excludedExerciseId,
        CancellationToken cancellationToken)
    {
        var normalizedName = name.ToLower();

        var query = _dbContext.Exercises
            .AsNoTracking()
            .Where(exercise =>
                !exercise.IsArchived &&
                exercise.Name.ToLower() == normalizedName);

        if (excludedExerciseId.HasValue)
        {
            query = query.Where(
                exercise => exercise.Id != excludedExerciseId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    private static void ValidateRequiredValues(
        string name,
        ExerciseType? exerciseType,
        ExerciseTrackingType? trackingType)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Exercise name is required.",
                nameof(name));
        }

        if (!exerciseType.HasValue)
        {
            throw new ArgumentException(
                "Exercise type is required.",
                nameof(exerciseType));
        }

        if (!trackingType.HasValue)
        {
            throw new ArgumentException(
                "Exercise tracking type is required.",
                nameof(trackingType));
        }
    }

    private static void ValidateTrackingCombination(
        ExerciseType exerciseType,
        ExerciseTrackingType trackingType)
    {
        var isValid = exerciseType switch
        {
            ExerciseType.Strength =>
                trackingType is
                    ExerciseTrackingType.WeightAndReps or
                    ExerciseTrackingType.RepsOnly or
                    ExerciseTrackingType.Duration,

            ExerciseType.Cardio =>
                trackingType is
                    ExerciseTrackingType.Duration or
                    ExerciseTrackingType.DistanceAndDuration,

            _ => false
        };

        if (!isValid)
        {
            throw new ArgumentException(
                $"Tracking type '{trackingType}' is not valid " +
                $"for exercise type '{exerciseType}'.");
        }
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }

    private static ExerciseResponseDto MapToResponseDto(Exercise exercise)
    {
        return new ExerciseResponseDto
        {
            Id = exercise.Id,
            Name = exercise.Name,
            ExerciseType = exercise.ExerciseType,
            TrackingType = exercise.TrackingType,
            PrimaryMuscleGroup = exercise.PrimaryMuscleGroup,
            Equipment = exercise.Equipment,
            IsCustom = exercise.IsCustom,
            IsArchived = exercise.IsArchived,
            CreatedAtUtc = exercise.CreatedAtUtc
        };
    }
}
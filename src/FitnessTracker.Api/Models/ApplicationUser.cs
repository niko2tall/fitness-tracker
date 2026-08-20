using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.Models;

public class ApplicationUser
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string DisplayName { get; set; } = string.Empty;

    public WeightUnit PreferredWeightUnit { get; set; } = WeightUnit.Kilograms;

    public DistanceUnit PreferredDistanceUnit { get; set; } = DistanceUnit.Kilometers;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();

    public ICollection<BodyMeasurement> BodyMeasurements { get; set; }
        = new List<BodyMeasurement>();

    public ICollection<Exercise> CustomExercises { get; set; }
        = new List<Exercise>();
}
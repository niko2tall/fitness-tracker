namespace FitnessTracker.Api.Models;

public class BodyMeasurement
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public ApplicationUser User { get; set; } = null!;

    public DateTime RecordedAtUtc { get; set; } = DateTime.UtcNow;

    public double WeightKg { get; set; }

    public double? BodyFatPercentage { get; set; }

    public string? Notes { get; set; }
}
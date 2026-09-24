namespace FitnessTracker.Api.DTOs.BodyMeasurements;

public class BodyMeasurementResponseDto
{
    public Guid Id { get; set; }

    public DateTime RecordedAtUtc { get; set; }

    public double WeightKg { get; set; }

    public double? BodyFatPercentage { get; set; }

    public string? Notes { get; set; }
}
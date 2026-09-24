using System.ComponentModel.DataAnnotations;

namespace FitnessTracker.Api.DTOs.BodyMeasurements;

public class CreateBodyMeasurementDto
{
    public DateTime RecordedAtUtc { get; set; }

    [Range(
        0.000001,
        double.MaxValue,
        ErrorMessage =
            "Weight must be greater than zero.")]
    public double WeightKg { get; set; }

    [Range(
        0,
        100,
        ErrorMessage =
            "Body fat percentage must be between 0 and 100.")]
    public double? BodyFatPercentage { get; set; }

    [MaxLength(
        1000,
        ErrorMessage =
            "Notes cannot exceed 1000 characters.")]
    public string? Notes { get; set; }
}
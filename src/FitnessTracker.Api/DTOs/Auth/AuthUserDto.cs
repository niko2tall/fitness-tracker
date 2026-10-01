using FitnessTracker.Api.Models.Enums;

namespace FitnessTracker.Api.DTOs.Auth;

public sealed class AuthUserDto
{
    public Guid Id { get; init; }

    public string DisplayName { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public WeightUnit PreferredWeightUnit { get; init; }

    public DistanceUnit PreferredDistanceUnit { get; init; }

    public DateTime CreatedAtUtc { get; init; }
}
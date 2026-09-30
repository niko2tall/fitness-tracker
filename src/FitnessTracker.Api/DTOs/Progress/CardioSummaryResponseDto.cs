namespace FitnessTracker.Api.DTOs.Progress;

public sealed class CardioSummaryResponseDto
{
    public IReadOnlyList<CardioSummaryWorkoutDto> Workouts { get; init; }
        = Array.Empty<CardioSummaryWorkoutDto>();
}
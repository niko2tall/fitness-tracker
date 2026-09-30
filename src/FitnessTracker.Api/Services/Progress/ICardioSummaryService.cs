using FitnessTracker.Api.DTOs.Progress;

namespace FitnessTracker.Api.Services.Progress;

public interface ICardioSummaryService
{
    Task<CardioSummaryResponseDto> GetCardioSummaryAsync(
        CancellationToken cancellationToken = default);
}
using FitnessTracker.Api.DTOs.Progress;

namespace FitnessTracker.Api.Services.Progress;

public interface IStrengthVolumeService
{
    Task<StrengthVolumeResponseDto> GetStrengthVolumeAsync(
        CancellationToken cancellationToken = default);
}
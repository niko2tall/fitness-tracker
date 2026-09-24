using FitnessTracker.Api.DTOs.BodyMeasurements;

namespace FitnessTracker.Api.Services.BodyMeasurements;

public interface IBodyMeasurementService
{
    Task<IReadOnlyList<BodyMeasurementResponseDto>>
        GetMeasurementsAsync(
            CancellationToken cancellationToken =
                default);

    Task<BodyMeasurementResponseDto?>
        GetMeasurementAsync(
            Guid measurementId,
            CancellationToken cancellationToken =
                default);

    Task<BodyMeasurementResponseDto>
        CreateMeasurementAsync(
            CreateBodyMeasurementDto request,
            CancellationToken cancellationToken =
                default);

    Task<BodyMeasurementResponseDto?>
        UpdateMeasurementAsync(
            Guid measurementId,
            UpdateBodyMeasurementDto request,
            CancellationToken cancellationToken =
                default);

    Task<bool>
        DeleteMeasurementAsync(
            Guid measurementId,
            CancellationToken cancellationToken =
                default);
}
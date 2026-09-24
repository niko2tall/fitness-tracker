using FitnessTracker.Api.Data;
using FitnessTracker.Api.DTOs.BodyMeasurements;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Services.Users;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Services.BodyMeasurements;

public class BodyMeasurementService :
    IBodyMeasurementService
{
    private readonly FitnessTrackerDbContext
        _dbContext;

    private readonly ICurrentUserService
        _currentUserService;

    public BodyMeasurementService(
        FitnessTrackerDbContext dbContext,
        ICurrentUserService currentUserService)
    {
        _dbContext =
            dbContext;

        _currentUserService =
            currentUserService;
    }

    public async Task<
        IReadOnlyList<BodyMeasurementResponseDto>>
        GetMeasurementsAsync(
            CancellationToken cancellationToken =
                default)
    {
        var currentUserId =
            _currentUserService
                .CurrentUserId;

        return await _dbContext
            .BodyMeasurements
            .AsNoTracking()
            .Where(
                measurement =>
                    measurement.UserId ==
                    currentUserId)
            .OrderByDescending(
                measurement =>
                    measurement.RecordedAtUtc)
            .Select(
                measurement =>
                    MapMeasurement(
                        measurement))
            .ToListAsync(
                cancellationToken);
    }

    public async Task<
        BodyMeasurementResponseDto?>
        GetMeasurementAsync(
            Guid measurementId,
            CancellationToken cancellationToken =
                default)
    {
        var currentUserId =
            _currentUserService
                .CurrentUserId;

        var measurement =
            await _dbContext
                .BodyMeasurements
                .AsNoTracking()
                .SingleOrDefaultAsync(
                    measurement =>
                        measurement.Id ==
                            measurementId
                        &&
                        measurement.UserId ==
                            currentUserId,
                    cancellationToken);

        return measurement is null
            ? null
            : MapMeasurement(
                measurement);
    }

    public async Task<
        BodyMeasurementResponseDto>
        CreateMeasurementAsync(
            CreateBodyMeasurementDto request,
            CancellationToken cancellationToken =
                default)
    {
        var currentUserId =
            _currentUserService
                .CurrentUserId;

        var measurement =
            new BodyMeasurement
            {
                Id =
                    Guid.NewGuid(),

                UserId =
                    currentUserId,

                RecordedAtUtc =
                    NormalizeUtc(
                        request
                            .RecordedAtUtc),

                WeightKg =
                    request.WeightKg,

                BodyFatPercentage =
                    request
                        .BodyFatPercentage,

                Notes =
                    NormalizeNotes(
                        request.Notes),
            };

        _dbContext
            .BodyMeasurements
            .Add(
                measurement);

        await _dbContext
            .SaveChangesAsync(
                cancellationToken);

        return MapMeasurement(
            measurement);
    }

    public async Task<
        BodyMeasurementResponseDto?>
        UpdateMeasurementAsync(
            Guid measurementId,
            UpdateBodyMeasurementDto request,
            CancellationToken cancellationToken =
                default)
    {
        var currentUserId =
            _currentUserService
                .CurrentUserId;

        var measurement =
            await _dbContext
                .BodyMeasurements
                .SingleOrDefaultAsync(
                    measurement =>
                        measurement.Id ==
                            measurementId
                        &&
                        measurement.UserId ==
                            currentUserId,
                    cancellationToken);

        if (
            measurement is null
        )
        {
            return null;
        }

        measurement.RecordedAtUtc =
            NormalizeUtc(
                request.RecordedAtUtc);

        measurement.WeightKg =
            request.WeightKg;

        measurement.BodyFatPercentage =
            request.BodyFatPercentage;

        measurement.Notes =
            NormalizeNotes(
                request.Notes);

        await _dbContext
            .SaveChangesAsync(
                cancellationToken);

        return MapMeasurement(
            measurement);
    }

    public async Task<bool>
        DeleteMeasurementAsync(
            Guid measurementId,
            CancellationToken cancellationToken =
                default)
    {
        var currentUserId =
            _currentUserService
                .CurrentUserId;

        var measurement =
            await _dbContext
                .BodyMeasurements
                .SingleOrDefaultAsync(
                    measurement =>
                        measurement.Id ==
                            measurementId
                        &&
                        measurement.UserId ==
                            currentUserId,
                    cancellationToken);

        if (
            measurement is null
        )
        {
            return false;
        }

        _dbContext
            .BodyMeasurements
            .Remove(
                measurement);

        await _dbContext
            .SaveChangesAsync(
                cancellationToken);

        return true;
    }

    private static
        BodyMeasurementResponseDto
        MapMeasurement(
            BodyMeasurement measurement)
    {
        return new BodyMeasurementResponseDto
        {
            Id =
                measurement.Id,

            RecordedAtUtc =
                measurement
                    .RecordedAtUtc,

            WeightKg =
                measurement.WeightKg,

            BodyFatPercentage =
                measurement
                    .BodyFatPercentage,

            Notes =
                measurement.Notes,
        };
    }

    private static DateTime
        NormalizeUtc(
            DateTime value)
    {
        return value.Kind switch
        {
            DateTimeKind.Utc =>
                value,

            DateTimeKind.Local =>
                value.ToUniversalTime(),

            _ =>
                DateTime.SpecifyKind(
                    value,
                    DateTimeKind.Utc),
        };
    }

    private static string?
        NormalizeNotes(
            string? notes)
    {
        if (
            string.IsNullOrWhiteSpace(
                notes)
        )
        {
            return null;
        }

        return notes.Trim();
    }
}
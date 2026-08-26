using FitnessTracker.Api.Development;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace FitnessTracker.Api.Data;

public static class DevelopmentDataInitializer
{
    public static async Task EnsureDevelopmentUserAsync(
        FitnessTrackerDbContext dbContext,
        CancellationToken cancellationToken = default)
    {
        var userExists = await dbContext.Users
            .AnyAsync(
                user => user.Id == DevelopmentUser.Id,
                cancellationToken);

        if (userExists)
        {
            return;
        }

        var user = new ApplicationUser
        {
            Id = DevelopmentUser.Id,
            DisplayName = DevelopmentUser.DisplayName,
            PreferredWeightUnit = WeightUnit.Kilograms,
            PreferredDistanceUnit = DistanceUnit.Kilometers,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.Users.Add(user);

        await dbContext.SaveChangesAsync(
            cancellationToken);
    }
}
namespace FitnessTracker.Api.Services.Users;

public interface ICurrentUserService
{
    Guid CurrentUserId { get; }
}
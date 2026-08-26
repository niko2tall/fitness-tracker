using FitnessTracker.Api.Development;
using Microsoft.Extensions.Hosting;

namespace FitnessTracker.Api.Services.Users;

public class DevelopmentCurrentUserService : ICurrentUserService
{
	private readonly IHostEnvironment _environment;

	public DevelopmentCurrentUserService(
		IHostEnvironment environment)
	{
		_environment = environment;
	}

	public Guid CurrentUserId
	{
		get
		{
			if (!_environment.IsDevelopment())
			{
				throw new InvalidOperationException(
					"The development current-user service cannot be used outside the Development environment.");
			}

			return DevelopmentUser.Id;
		}
	}
}
using System.Text.Json.Serialization;
using FitnessTracker.Api.Data;
using FitnessTracker.Api.Services.BodyMeasurements;
using FitnessTracker.Api.Services.Exercises;
using FitnessTracker.Api.Services.Progress;
using FitnessTracker.Api.Services.Users;
using FitnessTracker.Api.Services.Workouts;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using FitnessTracker.Api.Models;
using Microsoft.AspNetCore.Identity;

var builder =
    WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy =
    "FrontendCorsPolicy";

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options
            .JsonSerializerOptions
            .Converters
            .Add(
                new JsonStringEnumConverter(
                    allowIntegerValues:
                        false));
    });

builder.Services.AddOpenApi();

var connectionString =
    builder.Configuration
        .GetConnectionString(
            "FitnessTrackerDatabase")
    ?? throw new InvalidOperationException(
        "Connection string 'FitnessTrackerDatabase' was not found.");

builder.Services.AddDbContext<FitnessTrackerDbContext>(
    options =>
    {
        options.UseSqlite(
            connectionString);
    });

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<Guid>>(
        options =>
        {
            options.User.RequireUniqueEmail = true;

            options.Password.RequiredLength = 8;
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;

            options.SignIn.RequireConfirmedEmail = false;

            options.Lockout.AllowedForNewUsers = true;
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan =
                TimeSpan.FromMinutes(5);
        })
    .AddEntityFrameworkStores<FitnessTrackerDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(
    options =>
    {
        options.Cookie.Name =
            "FitnessTracker.Auth";

        options.Cookie.HttpOnly =
            true;

        options.Cookie.SecurePolicy =
            CookieSecurePolicy.Always;

        options.Cookie.SameSite =
            SameSiteMode.None;

        options.ExpireTimeSpan =
            TimeSpan.FromDays(7);

        options.SlidingExpiration =
            true;

        options.Events.OnRedirectToLogin =
            context =>
            {
                context.Response.StatusCode =
                    StatusCodes.Status401Unauthorized;

                return Task.CompletedTask;
            };

        options.Events.OnRedirectToAccessDenied =
            context =>
            {
                context.Response.StatusCode =
                    StatusCodes.Status403Forbidden;

                return Task.CompletedTask;
            };
    });

builder.Services.AddScoped<
    IExerciseService,
    ExerciseService>();

builder.Services.AddScoped<
    ICurrentUserService,
    DevelopmentCurrentUserService>();

builder.Services.AddScoped<
    IWorkoutService,
    WorkoutService>();

builder.Services.AddScoped<
    IProgressService,
    ProgressService>();

builder.Services.AddScoped<
    IStrengthVolumeService,
    StrengthVolumeService>();

builder.Services.AddScoped<
    ICardioSummaryService,
    CardioSummaryService>();

builder.Services.AddScoped<
    IBodyMeasurementService,
    BodyMeasurementService>();

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            FrontendCorsPolicy,
            policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
    });

var app = builder.Build();

if (
    app.Environment
        .IsDevelopment()
)
{
    await using var scope =
        app.Services
            .CreateAsyncScope();

    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<
                FitnessTrackerDbContext>();

    await DevelopmentDataInitializer
        .EnsureDevelopmentUserAsync(
            dbContext);

    app.MapOpenApi();

    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(
    FrontendCorsPolicy);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
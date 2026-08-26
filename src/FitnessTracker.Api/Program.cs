using System.Text.Json.Serialization;
using FitnessTracker.Api.Data;
using FitnessTracker.Api.Services.Exercises;
using FitnessTracker.Api.Services.Users;
using FitnessTracker.Api.Services.Workouts;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy =
    "FrontendCorsPolicy";

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions
            .Converters
            .Add(
                new JsonStringEnumConverter(
                    allowIntegerValues: false));
    });

builder.Services.AddOpenApi();

var connectionString = builder.Configuration
    .GetConnectionString(
        "FitnessTrackerDatabase")
    ?? throw new InvalidOperationException(
        "Connection string 'FitnessTrackerDatabase' was not found.");

builder.Services.AddDbContext<
    FitnessTrackerDbContext>(options =>
    {
        options.UseSqlite(connectionString);
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

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        FrontendCorsPolicy,
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    await using var scope =
        app.Services.CreateAsyncScope();

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

app.UseCors(FrontendCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
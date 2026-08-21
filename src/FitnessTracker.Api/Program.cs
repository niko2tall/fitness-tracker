using FitnessTracker.Api.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCorsPolicy";

// Add controller support.
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(allowIntegerValues: false));
    });

// Add OpenAPI document generation.
builder.Services.AddOpenApi();

// Get the SQLite connection string.
var connectionString = builder.Configuration
    .GetConnectionString("FitnessTrackerDatabase")
    ?? throw new InvalidOperationException(
        "Connection string 'FitnessTrackerDatabase' was not found.");

// Register the EF Core database context.
builder.Services.AddDbContext<FitnessTrackerDbContext>(options =>
{
    options.UseSqlite(connectionString);
});

// Allow the React development server to call this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Development-only API documentation.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors(FrontendCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
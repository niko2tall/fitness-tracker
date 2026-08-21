using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitnessTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedBuiltInExercises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Exercises",
                columns: new[] { "Id", "CreatedAtUtc", "CreatedByUserId", "Equipment", "ExerciseType", "IsArchived", "IsCustom", "Name", "PrimaryMuscleGroup", "TrackingType" },
                values: new object[,]
                {
                    { new Guid("10000000-0000-0000-0000-000000000001"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Barbell Bench Press", "Chest", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000002"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Incline Barbell Bench Press", "Chest", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000003"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Dumbbell Bench Press", "Chest", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000004"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Incline Dumbbell Bench Press", "Chest", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000005"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Overhead Press", "Shoulders", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000006"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Dumbbell Shoulder Press", "Shoulders", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000007"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Lateral Raise", "Shoulders", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000008"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cable", "Strength", false, false, "Cable Fly", "Chest", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000009"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bodyweight", "Strength", false, false, "Push-Up", "Chest", "RepsOnly" },
                    { new Guid("10000000-0000-0000-0000-000000000010"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cable", "Strength", false, false, "Triceps Pushdown", "Triceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000011"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cable", "Strength", false, false, "Overhead Triceps Extension", "Triceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000012"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Back Squat", "Quadriceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000013"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Front Squat", "Quadriceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000014"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Romanian Deadlift", "Hamstrings", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000015"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Deadlift", "Back", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000016"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Machine", "Strength", false, false, "Leg Press", "Quadriceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000017"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Bulgarian Split Squat", "Quadriceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000018"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Walking Lunge", "Quadriceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000019"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Machine", "Strength", false, false, "Leg Extension", "Quadriceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000020"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Machine", "Strength", false, false, "Leg Curl", "Hamstrings", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000021"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Machine", "Strength", false, false, "Standing Calf Raise", "Calves", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000022"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bodyweight", "Strength", false, false, "Pull-Up", "Back", "RepsOnly" },
                    { new Guid("10000000-0000-0000-0000-000000000023"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bodyweight", "Strength", false, false, "Chin-Up", "Back", "RepsOnly" },
                    { new Guid("10000000-0000-0000-0000-000000000024"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cable", "Strength", false, false, "Lat Pulldown", "Back", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000025"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Barbell Row", "Back", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000026"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cable", "Strength", false, false, "Seated Cable Row", "Back", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000027"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "One-Arm Dumbbell Row", "Back", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000028"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cable", "Strength", false, false, "Face Pull", "Shoulders", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000029"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Barbell", "Strength", false, false, "Barbell Curl", "Biceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000030"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Dumbbell Curl", "Biceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000031"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Dumbbell", "Strength", false, false, "Hammer Curl", "Biceps", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000032"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bodyweight", "Strength", false, false, "Plank", "Core", "Duration" },
                    { new Guid("10000000-0000-0000-0000-000000000033"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bodyweight", "Strength", false, false, "Hanging Leg Raise", "Core", "RepsOnly" },
                    { new Guid("10000000-0000-0000-0000-000000000034"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cable", "Strength", false, false, "Cable Crunch", "Core", "WeightAndReps" },
                    { new Guid("10000000-0000-0000-0000-000000000035"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "None", "Cardio", false, false, "Outdoor Run", "Full Body", "DistanceAndDuration" },
                    { new Guid("10000000-0000-0000-0000-000000000036"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Treadmill", "Cardio", false, false, "Treadmill Run", "Full Body", "DistanceAndDuration" },
                    { new Guid("10000000-0000-0000-0000-000000000037"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Bicycle", "Cardio", false, false, "Cycling", "Legs", "DistanceAndDuration" },
                    { new Guid("10000000-0000-0000-0000-000000000038"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Stationary Bike", "Cardio", false, false, "Stationary Bike", "Legs", "DistanceAndDuration" },
                    { new Guid("10000000-0000-0000-0000-000000000039"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Rowing Machine", "Cardio", false, false, "Rowing Machine", "Full Body", "DistanceAndDuration" },
                    { new Guid("10000000-0000-0000-0000-000000000040"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Elliptical", "Cardio", false, false, "Elliptical", "Full Body", "DistanceAndDuration" },
                    { new Guid("10000000-0000-0000-0000-000000000041"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "Stair Climber", "Cardio", false, false, "Stair Climber", "Legs", "Duration" },
                    { new Guid("10000000-0000-0000-0000-000000000042"), new DateTime(2026, 8, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, "None", "Cardio", false, false, "Walking", "Full Body", "DistanceAndDuration" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000006"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000007"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000008"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000009"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000010"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000011"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000012"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000013"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000014"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000015"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000016"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000017"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000018"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000019"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000020"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000021"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000022"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000023"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000024"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000025"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000026"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000027"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000028"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000029"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000030"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000031"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000032"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000033"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000034"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000035"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000036"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000037"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000038"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000039"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000040"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000041"));

            migrationBuilder.DeleteData(
                table: "Exercises",
                keyColumn: "Id",
                keyValue: new Guid("10000000-0000-0000-0000-000000000042"));
        }
    }
}

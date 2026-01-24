using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieTown.Migrations
{
    /// <inheritdoc />
    public partial class AddReservationLogic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReservedAt",
                table: "Reservations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartTime",
                value: new DateTime(2026, 1, 24, 16, 3, 24, 58, DateTimeKind.Utc).AddTicks(5927));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartTime",
                value: new DateTime(2026, 1, 24, 19, 3, 24, 58, DateTimeKind.Utc).AddTicks(6087));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartTime",
                value: new DateTime(2026, 1, 25, 10, 3, 24, 58, DateTimeKind.Utc).AddTicks(6089));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartTime",
                value: new DateTime(2026, 1, 29, 4, 3, 24, 58, DateTimeKind.Utc).AddTicks(6091));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartTime",
                value: new DateTime(2026, 1, 27, 22, 3, 24, 58, DateTimeKind.Utc).AddTicks(6092));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartTime",
                value: new DateTime(2026, 1, 25, 6, 3, 24, 58, DateTimeKind.Utc).AddTicks(6093));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartTime",
                value: new DateTime(2026, 1, 27, 2, 3, 24, 58, DateTimeKind.Utc).AddTicks(6093));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 8,
                column: "StartTime",
                value: new DateTime(2026, 1, 29, 6, 3, 24, 58, DateTimeKind.Utc).AddTicks(6094));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReservedAt",
                table: "Reservations");

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 1,
                column: "StartTime",
                value: new DateTime(2026, 1, 24, 15, 22, 45, 950, DateTimeKind.Utc).AddTicks(3337));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 2,
                column: "StartTime",
                value: new DateTime(2026, 1, 24, 18, 22, 45, 950, DateTimeKind.Utc).AddTicks(3489));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 3,
                column: "StartTime",
                value: new DateTime(2026, 1, 25, 9, 22, 45, 950, DateTimeKind.Utc).AddTicks(3491));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 4,
                column: "StartTime",
                value: new DateTime(2026, 1, 29, 3, 22, 45, 950, DateTimeKind.Utc).AddTicks(3492));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 5,
                column: "StartTime",
                value: new DateTime(2026, 1, 27, 21, 22, 45, 950, DateTimeKind.Utc).AddTicks(3494));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 6,
                column: "StartTime",
                value: new DateTime(2026, 1, 25, 5, 22, 45, 950, DateTimeKind.Utc).AddTicks(3494));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 7,
                column: "StartTime",
                value: new DateTime(2026, 1, 27, 1, 22, 45, 950, DateTimeKind.Utc).AddTicks(3495));

            migrationBuilder.UpdateData(
                table: "Screenings",
                keyColumn: "Id",
                keyValue: 8,
                column: "StartTime",
                value: new DateTime(2026, 1, 29, 5, 22, 45, 950, DateTimeKind.Utc).AddTicks(3496));
        }
    }
}

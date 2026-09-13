using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chet.QuartzNet.EFCore.SqlServer.Migrations
{
    /// <inheritdoc />
    public partial class AddJobRetryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RetryCount",
                table: "quartz_jobs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                comment: "失败重试次数(0=不重试)");

            migrationBuilder.AddColumn<int>(
                name: "RetryIntervalSeconds",
                table: "quartz_jobs",
                type: "int",
                nullable: false,
                defaultValue: 30,
                comment: "失败重试间隔(秒)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RetryCount",
                table: "quartz_jobs");

            migrationBuilder.DropColumn(
                name: "RetryIntervalSeconds",
                table: "quartz_jobs");
        }
    }
}

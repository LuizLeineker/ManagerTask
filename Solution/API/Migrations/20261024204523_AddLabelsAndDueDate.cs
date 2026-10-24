using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddLabelsAndDueDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "Tasks",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LabelId",
                table: "Tasks",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Labels",
                columns: table => new
                {
                    LabelId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labels", x => x.LabelId);
                    table.ForeignKey(
                        name: "FK_Labels_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_LabelId",
                table: "Tasks",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "IX_Labels_UserId",
                table: "Labels",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Labels_LabelId",
                table: "Tasks",
                column: "LabelId",
                principalTable: "Labels",
                principalColumn: "LabelId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Labels_LabelId",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "Labels");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_LabelId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "LabelId",
                table: "Tasks");
        }
    }
}

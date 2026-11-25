using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class LabelEndpoints
{
    public static void MapLabelEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/label").WithTags("Etiquetas");

        // Criar etiqueta
        group.MapPost("/create", async ([FromBody] LabelCreateRequest req, [FromServices] AppDataContext context) =>
        {
            if (!await context.Users.AnyAsync(u => u.UserId == req.UserId))
            {
                return Results.NotFound("Usuário não encontrado.");
            }

            var name = req.Name?.Trim() ?? "";
            var error = ValidateName(name);
            if (error is not null)
            {
                return Results.BadRequest(error);
            }

            bool labelExists = await context.Labels.AnyAsync(l => l.UserId == req.UserId && l.Name == name);
            if (labelExists)
            {
                return Results.Conflict("Você já possui uma etiqueta com esse nome.");
            }

            var label = new Label { Name = name, UserId = req.UserId };
            context.Labels.Add(label);
            await context.SaveChangesAsync();

            return Results.Created($"/label/{label.LabelId}", label);
        });

        // Etiquetas de um usuário
        group.MapGet("/list/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
        {
            if (!await context.Users.AnyAsync(u => u.UserId == userId))
            {
                return Results.NotFound("Usuário não encontrado.");
            }

            var labels = await context.Labels
                .Where(l => l.UserId == userId)
                .OrderBy(l => l.Name)
                .ToListAsync();

            return Results.Ok(labels);
        });

        // Renomear etiqueta
        group.MapPut("/update/{id}", async ([FromRoute] int id, [FromBody] LabelUpdateRequest req, [FromServices] AppDataContext context) =>
        {
            var label = await context.Labels.FindAsync(id);
            if (label is null)
            {
                return Results.NotFound("Etiqueta não encontrada.");
            }

            var name = req.Name?.Trim() ?? "";
            var error = ValidateName(name);
            if (error is not null)
            {
                return Results.BadRequest(error);
            }

            bool labelExists = await context.Labels.AnyAsync(l => l.LabelId != id && l.UserId == label.UserId && l.Name == name);
            if (labelExists)
            {
                return Results.Conflict("Você já possui uma etiqueta com esse nome.");
            }

            label.Name = name;
            await context.SaveChangesAsync();

            return Results.Ok(label);
        });

        // Excluir etiqueta (as tarefas dela ficam sem etiqueta)
        group.MapDelete("/delete/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
        {
            var label = await context.Labels.FindAsync(id);
            if (label is null)
            {
                return Results.NotFound("Etiqueta não encontrada.");
            }

            context.Labels.Remove(label);
            await context.SaveChangesAsync();

            return Results.Ok("Etiqueta removida com sucesso.");
        });
    }

    private static string? ValidateName(string name)
    {
        if (name == "") return "O nome da etiqueta é obrigatório.";
        if (name.Length > 30) return "O nome da etiqueta deve ter no máximo 30 caracteres.";
        return null;
    }
}

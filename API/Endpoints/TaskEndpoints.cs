using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class TaskEndpoints
{
    public static void MapTaskEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/tasks").WithTags("Tarefas");

        // Criar tarefa
        group.MapPost("/create", async ([FromBody] TaskCreateRequest req, [FromServices] AppDataContext context) =>
        {
            var user = await context.Users.FindAsync(req.UserId);
            if (user is null)
            {
                return Results.NotFound("Usuário não encontrado.");
            }

            var name = req.Name?.Trim() ?? "";
            var error = ValidateName(name);
            if (error is not null)
            {
                return Results.BadRequest(error);
            }

            if (req.LabelId is not null && !await LabelBelongsToUser(context, req.LabelId.Value, req.UserId))
            {
                return Results.BadRequest("Etiqueta não encontrada para este usuário.");
            }

            var task = new TaskItem
            {
                Name = name,
                Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim(),
                DueDate = req.DueDate,
                LabelId = req.LabelId,
                UserId = req.UserId
            };

            context.Tasks.Add(task);
            await context.SaveChangesAsync();
            await context.Entry(task).Reference(t => t.Label).LoadAsync();

            return Results.Created($"/tasks/{task.TaskId}", task);
        });

        // Listar tarefas do usuário
        group.MapGet("/list/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
        {
            if (!await context.Users.AnyAsync(u => u.UserId == userId))
            {
                return Results.NotFound("Usuário não encontrado.");
            }

            var tasks = await context.Tasks
                .Where(t => t.UserId == userId)
                .Include(t => t.Label)
                .OrderBy(t => t.IsCompleted)
                .ThenBy(t => t.DueDate == null)
                .ThenBy(t => t.DueDate)
                .ThenByDescending(t => t.TaskId)
                .ToListAsync();

            return Results.Ok(tasks);
        });

        // Resumo do dashboard
        group.MapGet("/summary/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
        {
            if (!await context.Users.AnyAsync(u => u.UserId == userId))
            {
                return Results.NotFound("Usuário não encontrado.");
            }

            var tasks = await context.Tasks.Where(t => t.UserId == userId).ToListAsync();
            var labels = await context.Labels.Where(l => l.UserId == userId).OrderBy(l => l.Name).ToListAsync();
            var today = DateTime.Today;

            var byLabel = labels
                .Select(l => new LabelCount(
                    l.LabelId,
                    l.Name,
                    tasks.Count(t => t.LabelId == l.LabelId),
                    tasks.Count(t => t.LabelId == l.LabelId && !t.IsCompleted)))
                .ToList();

            var withoutLabel = tasks.Where(t => t.LabelId == null).ToList();
            if (withoutLabel.Count > 0)
            {
                byLabel.Add(new LabelCount(null, "Sem etiqueta", withoutLabel.Count, withoutLabel.Count(t => !t.IsCompleted)));
            }

            var summary = new TaskSummary(
                Total: tasks.Count,
                Completed: tasks.Count(t => t.IsCompleted),
                Pending: tasks.Count(t => !t.IsCompleted),
                Overdue: tasks.Count(t => !t.IsCompleted && t.DueDate != null && t.DueDate.Value.Date < today),
                DueToday: tasks.Count(t => !t.IsCompleted && t.DueDate != null && t.DueDate.Value.Date == today),
                ByLabel: byLabel);

            return Results.Ok(summary);
        });

        // Buscar uma tarefa por id
        group.MapGet("/{id:int}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
        {
            var task = await context.Tasks.Include(t => t.Label).FirstOrDefaultAsync(t => t.TaskId == id);
            return task is null
                ? Results.NotFound("Tarefa não encontrada.")
                : Results.Ok(task);
        });

        // Atualizar tarefa
        group.MapPut("/update/{id}", async ([FromRoute] int id, [FromBody] TaskUpdateRequest req, [FromServices] AppDataContext context) =>
        {
            var task = await context.Tasks.FindAsync(id);
            if (task is null)
            {
                return Results.NotFound("Tarefa não encontrada.");
            }

            var name = req.Name?.Trim() ?? "";
            var error = ValidateName(name);
            if (error is not null)
            {
                return Results.BadRequest(error);
            }

            if (req.LabelId is not null && !await LabelBelongsToUser(context, req.LabelId.Value, task.UserId))
            {
                return Results.BadRequest("Etiqueta não encontrada para este usuário.");
            }

            task.Name = name;
            task.Description = string.IsNullOrWhiteSpace(req.Description) ? null : req.Description.Trim();
            task.IsCompleted = req.IsCompleted;
            task.DueDate = req.DueDate;
            task.LabelId = req.LabelId;

            await context.SaveChangesAsync();
            await context.Entry(task).Reference(t => t.Label).LoadAsync();

            return Results.Ok(task);
        });

        // Alternar concluída / pendente
        group.MapPatch("/status/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
        {
            var task = await context.Tasks.Include(t => t.Label).FirstOrDefaultAsync(t => t.TaskId == id);
            if (task is null)
            {
                return Results.NotFound("Tarefa não encontrada.");
            }

            task.IsCompleted = !task.IsCompleted;
            await context.SaveChangesAsync();

            return Results.Ok(task);
        });

        // Excluir tarefa
        group.MapDelete("/delete/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
        {
            var task = await context.Tasks.FindAsync(id);
            if (task is null)
            {
                return Results.NotFound("Tarefa não encontrada.");
            }

            context.Tasks.Remove(task);
            await context.SaveChangesAsync();

            return Results.Ok("Tarefa removida com sucesso.");
        });
    }

    private static string? ValidateName(string name)
    {
        if (name == "") return "O nome da tarefa é obrigatório.";
        if (name.Length > 30) return "O nome da tarefa deve ter no máximo 30 caracteres.";
        return null;
    }

    private static Task<bool> LabelBelongsToUser(AppDataContext context, int labelId, int userId) =>
        context.Labels.AnyAsync(l => l.LabelId == labelId && l.UserId == userId);
}

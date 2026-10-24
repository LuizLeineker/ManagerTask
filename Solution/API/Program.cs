using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
var app = builder.Build();


app.MapGet("/", () => "Welcome to the ManagerTask API!");

//
// Usuários (Users)
//

// Cria o usuário passado através do corpo da requisição (caso o nome de usuário e o email ainda não estejam em uso)
app.MapPost("/user/create", async ([FromBody] User user, [FromServices] AppDataContext context) =>
{
    bool userExists = await context.Users.AnyAsync(u => u.Username == user.Username || u.Email == user.Email);
    if (userExists)
    {
        return Results.Conflict("Username and/or email are already in use.");
    }

    context.Users.Add(user);
    await context.SaveChangesAsync();

    return Results.Created("", new { user.UserId, user.Username, user.Email });
});

// Retorna os dados do usuário cujo id bata com o parâmetro passado através da URL (caso o id seja válido)
app.MapGet("/user/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(id);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    return Results.Ok(new { user.UserId, user.Username, user.Email });
});

// Atualiza o nome, email e senha do usuário cujo id bata com o parâmetro passado através da URL (caso o id seja válido e os dados novos não estejam em uso)
app.MapPut("/user/update/{id}", async ([FromRoute] int id, [FromBody] User userChanges, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(id);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    bool userExists = await context.Users.AnyAsync(u => u.UserId != id && (u.Username == userChanges.Username || u.Email == userChanges.Email));
    if (userExists)
    {
        return Results.Conflict("Username and/or email are already in use.");
    }

    user.Username = userChanges.Username;
    user.Email = userChanges.Email;
    user.Password = userChanges.Password;

    await context.SaveChangesAsync();

    return Results.Ok(new { user.UserId, user.Username, user.Email });
});

// Remove o usuário cujo id bata com o parâmetro passado através da URL, junto com as tarefas e rótulos dele (caso o id seja válido)
app.MapDelete("/user/delete/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(id);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    context.Users.Remove(user);
    await context.SaveChangesAsync();

    return Results.Ok("User removed successfully.");
});

//
// Tarefas (Tasks)
//

// Cria uma tarefa com base no objeto passado através do corpo da requisição (caso o usuário exista e o rótulo, se informado, pertença a ele)
app.MapPost("/tasks/create", async ([FromBody] Task task, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(task.UserId);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    if (task.LabelId != null)
    {
        var label = await context.Labels.FindAsync(task.LabelId);
        if (label is null || label.UserId != task.UserId)
        {
            return Results.BadRequest("Label not found for this user.");
        }
    }

    context.Tasks.Add(task);
    await context.SaveChangesAsync();

    return Results.Created("", task);
});

// Lista todas as tarefas pertencentes ao usuário cujo id bata com o do parâmetro passado através da URL (caso o usuário exista)
app.MapGet("/tasks/list/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(userId);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    var tasks = await context.Tasks.Where(t => t.UserId == userId).Include(t => t.Label).ToListAsync();
    return Results.Ok(tasks);
});

// Retorna a tarefa cujo id bata com o parâmetro passado através da URL, junto com o rótulo dela (caso o id seja válido)
app.MapGet("/tasks/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var task = await context.Tasks.Include(t => t.Label).FirstOrDefaultAsync(t => t.TaskId == id);
    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }

    return Results.Ok(task);
});

// Atualiza as informações da tarefa com o id passado via parâmetro através da URL (caso o id seja válido e o rótulo pertença ao mesmo usuário)
app.MapPut("/tasks/update/{id}", async ([FromRoute] int id, [FromBody] Task taskChanges, [FromServices] AppDataContext context) =>
{
    var task = await context.Tasks.FindAsync(id);
    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }

    if (taskChanges.LabelId != null)
    {
        var label = await context.Labels.FindAsync(taskChanges.LabelId);
        if (label is null || label.UserId != task.UserId)
        {
            return Results.BadRequest("Label not found for this user.");
        }
    }

    task.Name = taskChanges.Name;
    task.Description = taskChanges.Description;
    task.IsCompleted = taskChanges.IsCompleted;
    task.DueDate = taskChanges.DueDate;
    task.LabelId = taskChanges.LabelId;

    await context.SaveChangesAsync();

    return Results.Ok(task);
});

// Alterna o status da tarefa entre concluída e pendente com base no id passado via parâmetro através da URL (caso o id seja válido)
app.MapPatch("/tasks/status/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var task = await context.Tasks.FindAsync(id);
    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }

    task.IsCompleted = !task.IsCompleted;
    await context.SaveChangesAsync();

    return Results.Ok(task);
});

// Remove a tarefa com id correspondente ao passado por parâmetro através da URL (caso o id de fato corresponda a alguma tarefa)
app.MapDelete("/tasks/delete/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var task = await context.Tasks.FindAsync(id);
    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }

    context.Tasks.Remove(task);
    await context.SaveChangesAsync();

    return Results.Ok("Task removed successfully.");
});

//
// Etiquetas/Rótulos (Labels)
//

// Cria uma etiqueta/rótulo tomando como referência o objeto de rótulo passado através do corpo da requisição (caso o usuário exista e ainda não tenha um rótulo com o mesmo nome)
app.MapPost("/label/create", async ([FromBody] Label label, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(label.UserId);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    bool labelExists = await context.Labels.AnyAsync(l => l.UserId == label.UserId && l.Name == label.Name);
    if (labelExists)
    {
        return Results.Conflict("Label already exists.");
    }

    context.Labels.Add(label);
    await context.SaveChangesAsync();

    return Results.Created("", label);
});

// Retorna todos os rótulos associados ao usuário com o id passado através da URL (caso o id seja válido)
app.MapGet("/label/list/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(userId);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    var labels = await context.Labels.Where(l => l.UserId == userId).ToListAsync();
    return Results.Ok(labels);
});

// Altera o nome do rótulo cujo id bata com o parâmetro passado através da URL (caso o id seja válido e o usuário não tenha outro rótulo com o mesmo nome)
app.MapPut("/label/update/{id}", async ([FromRoute] int id, [FromBody] Label labelChanges, [FromServices] AppDataContext context) =>
{
    var label = await context.Labels.FindAsync(id);
    if (label is null)
    {
        return Results.NotFound("Label not found.");
    }

    bool labelExists = await context.Labels.AnyAsync(l => l.LabelId != id && l.UserId == label.UserId && l.Name == labelChanges.Name);
    if (labelExists)
    {
        return Results.Conflict("Label already exists.");
    }

    label.Name = labelChanges.Name;
    await context.SaveChangesAsync();

    return Results.Ok(label);
});

// Remove o rótulo cujo id bata com o parâmetro passado através da URL, deixando as tarefas dele sem rótulo (caso o id seja válido)
app.MapDelete("/label/delete/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var label = await context.Labels.FindAsync(id);
    if (label is null)
    {
        return Results.NotFound("Label not found.");
    }

    context.Labels.Remove(label);
    await context.SaveChangesAsync();

    return Results.Ok("Label removed successfully.");
});

//
// Filtros e resumo das tarefas
//

// Lista as tarefas ainda não concluídas do usuário cujo id bata com o parâmetro passado através da URL (caso o usuário exista)
app.MapGet("/tasks/pending/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(userId);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    var tasks = await context.Tasks.Where(t => t.UserId == userId && !t.IsCompleted).Include(t => t.Label).ToListAsync();
    return Results.Ok(tasks);
});

// Lista as tarefas já concluídas do usuário cujo id bata com o parâmetro passado através da URL (caso o usuário exista)
app.MapGet("/tasks/completed/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(userId);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    var tasks = await context.Tasks.Where(t => t.UserId == userId && t.IsCompleted).Include(t => t.Label).ToListAsync();
    return Results.Ok(tasks);
});

// Lista as tarefas pendentes com prazo já vencido do usuário cujo id bata com o parâmetro passado através da URL (caso o usuário exista)
app.MapGet("/tasks/overdue/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(userId);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    var tasks = await context.Tasks.Where(t => t.UserId == userId && !t.IsCompleted && t.DueDate < DateTime.Now).Include(t => t.Label).ToListAsync();
    return Results.Ok(tasks);
});

// Lista as tarefas associadas ao rótulo cujo id bata com o parâmetro passado através da URL (caso o rótulo exista)
app.MapGet("/tasks/by-label/{labelId}", async ([FromRoute] int labelId, [FromServices] AppDataContext context) =>
{
    var label = await context.Labels.FindAsync(labelId);
    if (label is null)
    {
        return Results.NotFound("Label not found.");
    }

    var tasks = await context.Tasks.Where(t => t.LabelId == labelId).Include(t => t.Label).ToListAsync();
    return Results.Ok(tasks);
});

// Retorna um resumo das tarefas do usuário cujo id bata com o parâmetro passado através da URL, com totais, percentual concluído e quantidade por rótulo (caso o usuário exista)
app.MapGet("/summary/{userId}", async ([FromRoute] int userId, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.Where(u => u.UserId == userId).Include(u => u.Tasks).Include(u => u.Labels).FirstOrDefaultAsync();
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    int total = user.Tasks.Count;
    int completed = user.Tasks.Where(t => t.IsCompleted).Count();
    int pending = total - completed;
    int overdue = user.Tasks.Where(t => !t.IsCompleted && t.DueDate < DateTime.Now).Count();

    // Evita divisão por zero
    int completedPercentage = 0;
    if (total > 0)
    {
        completedPercentage = completed * 100 / total;
    }

    var tasksByLabel = new List<object>();
    foreach (var label in user.Labels)
    {
        tasksByLabel.Add(new { label = label.Name, quantity = user.Tasks.Where(t => t.LabelId == label.LabelId).Count() });
    }
    tasksByLabel.Add(new { label = "No label", quantity = user.Tasks.Where(t => t.LabelId == null).Count() });

    return Results.Ok(new { total, completed, pending, overdue, completedPercentage, tasksByLabel });
});

app.Run();


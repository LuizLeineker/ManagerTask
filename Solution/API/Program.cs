using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
var app = builder.Build();


app.MapGet("/", () => "Bem vindo ao ManagerTask!");

//
// Usuários (Users)
//

// create user 
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

// busca dados do user
app.MapGet("/user/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var user = await context.Users.FindAsync(id);
    if (user is null)
    {
        return Results.NotFound("User not found.");
    }

    return Results.Ok(new { user.UserId, user.Username, user.Email });
});

// update user
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

// delete user
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
// Tasks
//


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

// busca todas as tarefas de um ser especifico 
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

// busca uma tarefa especifica por id 
app.MapGet("/tasks/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
{
    var task = await context.Tasks.Include(t => t.Label).FirstOrDefaultAsync(t => t.TaskId == id);
    if (task is null)
    {
        return Results.NotFound("Task not found.");
    }

    return Results.Ok(task);
});

// update tarefa
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

// Tarefa completa?
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

// delete task
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
// Labels
//

// novo label
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

// todos os labels de um user
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

// atualizar label
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

// delete
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


app.Run();


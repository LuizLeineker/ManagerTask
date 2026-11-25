using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class UserEndpoints
{
    private static readonly PasswordHasher<User> Hasher = new();

    public static void MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/user").WithTags("Usuários");

        // Cadastro
        group.MapPost("/create", async ([FromBody] UserCreateRequest req, [FromServices] AppDataContext context) =>
        {
            var username = req.Username?.Trim() ?? "";
            var email = req.Email?.Trim().ToLowerInvariant() ?? "";
            var password = req.Password ?? "";

            var error = Validate(username, email, password);
            if (error is not null)
            {
                return Results.BadRequest(error);
            }

            bool userExists = await context.Users.AnyAsync(u => u.Username == username || u.Email == email);
            if (userExists)
            {
                return Results.Conflict("Username e/ou e-mail já estão em uso.");
            }

            var user = new User { Username = username, Email = email };
            user.Password = Hasher.HashPassword(user, password);

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Results.Created($"/user/{user.UserId}", UserResponse.From(user));
        });

        // Login (aceita username ou e-mail)
        group.MapPost("/login", async ([FromBody] UserLoginRequest req, [FromServices] AppDataContext context) =>
        {
            var identifier = (req.Username ?? req.Email ?? "").Trim();
            var password = req.Password ?? "";

            if (identifier == "" || password == "")
            {
                return Results.BadRequest("Informe usuário/e-mail e senha.");
            }

            var lowered = identifier.ToLowerInvariant();
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == identifier || u.Email == lowered);

            if (user is null || !VerifyPassword(user, password))
            {
                return Results.Unauthorized();
            }

            await context.SaveChangesAsync(); // salva caso a senha tenha sido migrada para hash
            return Results.Ok(UserResponse.From(user));
        });

        // Dados do usuário
        group.MapGet("/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
        {
            var user = await context.Users.FindAsync(id);
            return user is null
                ? Results.NotFound("Usuário não encontrado.")
                : Results.Ok(UserResponse.From(user));
        });

        // Atualização
        group.MapPut("/update/{id}", async ([FromRoute] int id, [FromBody] UserUpdateRequest req, [FromServices] AppDataContext context) =>
        {
            var user = await context.Users.FindAsync(id);
            if (user is null)
            {
                return Results.NotFound("Usuário não encontrado.");
            }

            var username = req.Username?.Trim() ?? "";
            var email = req.Email?.Trim().ToLowerInvariant() ?? "";
            var password = req.Password ?? "";

            var error = Validate(username, email, password);
            if (error is not null)
            {
                return Results.BadRequest(error);
            }

            bool userExists = await context.Users.AnyAsync(u => u.UserId != id && (u.Username == username || u.Email == email));
            if (userExists)
            {
                return Results.Conflict("Username e/ou e-mail já estão em uso.");
            }

            user.Username = username;
            user.Email = email;
            user.Password = Hasher.HashPassword(user, password);

            await context.SaveChangesAsync();

            return Results.Ok(UserResponse.From(user));
        });

        // Exclusão (tarefas e etiquetas vão junto, em cascata)
        group.MapDelete("/delete/{id}", async ([FromRoute] int id, [FromServices] AppDataContext context) =>
        {
            var user = await context.Users.FindAsync(id);
            if (user is null)
            {
                return Results.NotFound("Usuário não encontrado.");
            }

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            return Results.Ok("Usuário removido com sucesso.");
        });
    }

    private static string? Validate(string username, string email, string password)
    {
        if (username.Length < 5 || username.Length > 30)
            return "O username deve ter entre 5 e 30 caracteres.";
        if (email == "" || !email.Contains('@') || email.Length > 256)
            return "Informe um e-mail válido.";
        if (password.Length < 5 || password.Length > 30)
            return "A senha deve ter entre 5 e 30 caracteres.";
        return null;
    }

    // Confere a senha; se o registro for antigo (senha em texto puro), converte para hash.
    private static bool VerifyPassword(User user, string password)
    {
        try
        {
            var result = Hasher.VerifyHashedPassword(user, user.Password, password);
            if (result == PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.Password = Hasher.HashPassword(user, password);
            }
            return result != PasswordVerificationResult.Failed;
        }
        catch (FormatException)
        {
            if (user.Password != password) return false;
            user.Password = Hasher.HashPassword(user, password);
            return true;
        }
    }
}

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS liberado para o frontend React rodando localmente
builder.Services.AddCors(options =>
{
    options.AddPolicy("AcessoTotal", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// JSON em camelCase (padrão do System.Text.Json): taskId, name, isCompleted...
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services.AddDbContext<AppDataContext>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Aplica as migrations automaticamente: quem clonar o repositório
// não precisa rodar "dotnet ef database update" para criar o banco.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDataContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AcessoTotal");

app.MapGet("/", () => "Bem vindo ao ManagerTask!");

app.MapUserEndpoints();
app.MapTaskEndpoints();
app.MapLabelEndpoints();

app.Run();

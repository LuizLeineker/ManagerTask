using Microsoft.EntityFrameworkCore;

public class AppDataContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<TaskItem> Tasks { get; set; } = null!;
    public DbSet<Label> Labels { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=managertask.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>().ToTable("Tasks");

        // Tarefa nasce como não concluída
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.IsCompleted)
            .HasDefaultValue(false);

        // Data e hora do sistema
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.CreatedAt)
            .HasDefaultValueSql("datetime('now', 'localtime')");

        // Usuário tem várias tarefas (1-N)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Tasks)
            .WithOne()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Usuário tem várias etiquetas (1-N)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Labels)
            .WithOne()
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Etiqueta tem várias tarefas (1-N), se apagar a etiqueta a tarefa fica sem etiqueta
        modelBuilder.Entity<Label>()
            .HasMany<TaskItem>()
            .WithOne(t => t.Label)
            .HasForeignKey(t => t.LabelId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

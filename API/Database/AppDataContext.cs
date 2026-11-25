using Microsoft.EntityFrameworkCore;


public class AppDataContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Task> Tasks { get; set; } = null!;
    public DbSet<Label> Labels { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=managertask.db");
    }

     protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       
        // Criar tarefa como falso 
        modelBuilder.Entity<Task>()
        .Property(t => t.IsCompleted)
        .HasDefaultValue(false);

        // Data e hora do sistema 
        modelBuilder.Entity<Task>()
        .Property(t => t.CreatedAt)
        .HasDefaultValueSql("datetime('now', 'localtime')");

        // Rótulo tem várias tarefas (1-N), se apagar o rótulo a tarefa fica sem rótulo
        modelBuilder.Entity<Label>()
        .HasMany<Task>()
        .WithOne(t => t.Label)
        .HasForeignKey(t => t.LabelId)
        .OnDelete(DeleteBehavior.SetNull);
    }
}
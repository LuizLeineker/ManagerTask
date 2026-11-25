public record UserCreateRequest(string? Username, string? Email, string? Password);

public record UserLoginRequest(string? Username, string? Email, string? Password);

public record UserUpdateRequest(string? Username, string? Email, string? Password);

public record TaskCreateRequest(
    string? Name,
    string? Description,
    DateTime? DueDate,
    int? LabelId,
    int UserId);

public record TaskUpdateRequest(
    string? Name,
    string? Description,
    bool IsCompleted,
    DateTime? DueDate,
    int? LabelId);

public record LabelCreateRequest(string? Name, int UserId);

public record LabelUpdateRequest(string? Name);

public record UserResponse(int UserId, string Username, string Email)
{
    public static UserResponse From(User u) => new(u.UserId, u.Username, u.Email);
}

public record LabelCount(int? LabelId, string Name, int Total, int Pending);

public record TaskSummary(
    int Total,
    int Completed,
    int Pending,
    int Overdue,
    int DueToday,
    List<LabelCount> ByLabel);

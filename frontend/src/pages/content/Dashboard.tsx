import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Button, Typography, Paper, Checkbox,
    IconButton, AppBar, Toolbar, Container,
    List, ListItem, ListItemText, Divider,
    Chip, Alert
} from "@mui/material";
import {
    Add, Search, Delete, Logout,
    LabelOutlined, Event
} from "@mui/icons-material";
import api from "../../api/api";
import { Task } from "../../models/Task";
import { Summary } from "../../models/Summary";
import { formatDate, isOverdue } from "../../utils/date";

function Dashboard() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTasks();
    }, [userId]);

    async function loadTasks() {
        try {
            const [taskResponse, summaryResponse] = await Promise.all([
                api.get(`/tasks/list/${userId}`),
                api.get(`/tasks/summary/${userId}`)
            ]);
            setTasks(taskResponse.data);
            setSummary(summaryResponse.data);
            setError("");
        } catch {
            setError("Não foi possível carregar as tarefas.");
        }
    }

    async function toggleTask(taskId: number) {
        try {
            await api.patch(`/tasks/status/${taskId}`);
            await loadTasks();
        } catch {
            setError("Não foi possível atualizar a tarefa.");
        }
    }

    async function deleteTask(taskId: number) {
        try {
            await api.delete(`/tasks/delete/${taskId}`);
            await loadTasks();
        } catch {
            setError("Não foi possível excluir a tarefa.");
        }
    }

    function logout() {
        navigate("/signin");
    }

    const cards = summary ? [
        { title: "Total", value: summary.total, className: "stat-card" },
        { title: "Pendentes", value: summary.pending, className: "stat-card stat-card--pending" },
        { title: "Concluídas", value: summary.completed, className: "stat-card stat-card--done" },
        { title: "Atrasadas", value: summary.overdue, className: "stat-card stat-card--late" }
    ] : [];

    return (
        <Box className="app-page">
            <AppBar position="static" className="app-bar">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", flexGrow: 1 }}
                    >
                        ManagerTask
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={logout}
                        startIcon={<Logout />}
                    >
                        Sair
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography
                    className="page-title"
                    variant="h4"
                    sx={{ fontWeight: "bold", mb: 1 }}
                >
                    Minhas tarefas
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Organize suas atividades.
                </Typography>

                <Box sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 3
                }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate(`/tasks/create/${userId}`)}
                    >
                        Nova tarefa
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Search />}
                        onClick={() => navigate(`/tasks/search/${userId}`)}
                    >
                        Buscar tarefas
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<LabelOutlined />}
                        onClick={() => navigate(`/labels/${userId}`)}
                    >
                        Etiquetas
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {summary && (
                    <>
                        <Box className="stat-grid">
                            {cards.map(card => (
                                <Paper key={card.title} className={card.className} elevation={0}>
                                    <Typography className="stat-card__value">
                                        {card.value}
                                    </Typography>
                                    <Typography className="stat-card__title">
                                        {card.title}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>

                        {summary.dueToday > 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                Você tem {summary.dueToday} tarefa(s) vencendo hoje.
                            </Alert>
                        )}

                        {summary.byLabel.length > 0 && (
                            <Paper className="section-card" elevation={0} sx={{ p: 2, mb: 3 }}>
                                <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                    Tarefas por etiqueta
                                </Typography>

                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {summary.byLabel.map(item => (
                                        <Chip
                                            key={item.labelId ?? "none"}
                                            className="label-chip"
                                            label={`${item.name}: ${item.pending} pendente(s) de ${item.total}`}
                                            onClick={() => navigate(
                                                `/tasks/search/${userId}?label=${item.labelId ?? "none"}`
                                            )}
                                        />
                                    ))}
                                </Box>
                            </Paper>
                        )}
                    </>
                )}

                <Paper elevation={2} className="section-card">
                    {tasks.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: "center" }}>
                            <Typography color="text.secondary">
                                Você ainda não possui tarefas.
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {tasks.map((task, index) => (
                                <Box key={task.taskId}>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton
                                                color="error"
                                                onClick={() => deleteTask(task.taskId)}
                                                title="Excluir tarefa"
                                            >
                                                <Delete />
                                            </IconButton>
                                        }
                                    >
                                        <Checkbox
                                            checked={task.isCompleted}
                                            onChange={() => toggleTask(task.taskId)}
                                        />

                                        <ListItemText
                                            slotProps={{ secondary: { component: "div" } }}
                                            primary={
                                                <Typography sx={{
                                                    fontWeight: "medium",
                                                    textDecoration: task.isCompleted
                                                        ? "line-through"
                                                        : "none"
                                                }}>
                                                    {task.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 1,
                                                    mt: 1
                                                }}>
                                                    {task.description && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {task.description}
                                                        </Typography>
                                                    )}

                                                    {task.label && (
                                                        <Chip
                                                            className="label-chip"
                                                            label={task.label.name}
                                                            size="small"
                                                        />
                                                    )}

                                                    {task.dueDate && (
                                                        <Chip
                                                            icon={<Event />}
                                                            label={formatDate(task.dueDate)}
                                                            size="small"
                                                            color={isOverdue(task.dueDate, task.isCompleted) ? "error" : "default"}
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            }
                                        />

                                        <Button
                                            size="small"
                                            onClick={() => navigate(
                                                `/tasks/update/${task.taskId}/${userId}`
                                            )}
                                        >
                                            Editar
                                        </Button>
                                    </ListItem>

                                    {index !== tasks.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default Dashboard;
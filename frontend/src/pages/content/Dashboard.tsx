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
    LabelOutlined
} from "@mui/icons-material";
import api from "../../api/api";
import { Task } from "../../models/Task";

function Dashboard() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTasks();
    }, [userId]);

    async function loadTasks() {
        try {
            const { data } = await api.get(`/tasks/list/${userId}`);
            setTasks(data);
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

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
            <AppBar position="static">
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

                <Paper elevation={2}>
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
                                                            label={task.label.name}
                                                            size="small"
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
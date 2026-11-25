import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Button, Container, Paper, TextField,
    Typography, List, ListItem, ListItemText,
    Checkbox, IconButton, Divider, Alert
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import api from "../../api/api";
import { Task } from "../../models/Task";

function SearchTask() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadTasks();
    }, [userId]);

    async function loadTasks() {
        try {
            const { data } = await api.get(`/tasks/list/${userId}`);
            setTasks(data);
        } catch {
            setError("Não foi possível carregar as tarefas.");
        }
    }

    async function toggleTask(taskId: number) {
        try {
            await api.patch(`/tasks/status/${taskId}`);
            await loadTasks();
        } catch {
            setError("Não foi possível alterar o status.");
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

    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                sx={{ fontWeight: "bold", mb: 3 }}
            >
                Buscar tarefas
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
                label="Pesquisar pelo nome"
                fullWidth
                margin="normal"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <Paper sx={{ mt: 3 }}>
                {filteredTasks.length === 0 ? (
                    <Box sx={{ p: 3 }}>
                        <Typography color="text.secondary">
                            Nenhuma tarefa encontrada.
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {filteredTasks.map((task, index) => (
                            <Box key={task.taskId}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            color="error"
                                            onClick={() => deleteTask(task.taskId)}
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
                                        primary={task.name}
                                        secondary={task.description || "Sem descrição"}
                                    />

                                    <Button
                                        onClick={() => navigate(
                                            `/tasks/update/${task.taskId}/${userId}`
                                        )}
                                    >
                                        Editar
                                    </Button>
                                </ListItem>

                                {index !== filteredTasks.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                )}
            </Paper>

            <Button
                sx={{ mt: 3 }}
                onClick={() => navigate(`/dashboard/${userId}`)}
            >
                Voltar ao Dashboard
            </Button>
        </Container>
    );
}

export default SearchTask;

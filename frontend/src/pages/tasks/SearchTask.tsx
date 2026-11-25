import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    Box, Button, Container, Paper, TextField,
    Typography, List, ListItem, ListItemText,
    Checkbox, IconButton, Divider, Alert,
    MenuItem, Chip
} from "@mui/material";
import { Delete, Event } from "@mui/icons-material";
import api from "../../api/api";
import { Task } from "../../models/Task";
import { Label } from "../../models/Label";
import { formatDate, isOverdue } from "../../utils/date";

function SearchTask() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);
    const [search, setSearch] = useState("");
    const [labelFilter, setLabelFilter] = useState(searchParams.get("label") ?? "all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [error, setError] = useState("");

    useEffect(() => {
        loadTasks();
        loadLabels();
    }, [userId]);

    async function loadLabels() {
        try {
            const { data } = await api.get(`/label/list/${userId}`);
            setLabels(data);
        } catch {
            setError("Não foi possível carregar as etiquetas.");
        }
    }

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
        && (labelFilter === "all"
            || (labelFilter === "none" ? task.labelId == null : task.labelId === Number(labelFilter)))
        && (statusFilter === "all"
            || (statusFilter === "done" ? task.isCompleted : !task.isCompleted))
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

            <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                <TextField
                    select
                    label="Etiqueta"
                    fullWidth
                    margin="normal"
                    value={labelFilter}
                    onChange={e => setLabelFilter(e.target.value)}
                >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="none">Sem etiqueta</MenuItem>

                    {labels.map(label => (
                        <MenuItem key={label.labelId} value={String(label.labelId)}>
                            {label.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Status"
                    fullWidth
                    margin="normal"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="pending">Pendentes</MenuItem>
                    <MenuItem value="done">Concluídas</MenuItem>
                </TextField>
            </Box>

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
                                        slotProps={{ secondary: { component: "div" } }}
                                        primary={task.name}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {task.description || "Sem descrição"}
                                                </Typography>

                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
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
                                            </Box>
                                        }
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

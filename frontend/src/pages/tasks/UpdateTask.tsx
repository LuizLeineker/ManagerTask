import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Button, Paper, TextField, Typography,
    MenuItem, Alert, Container
} from "@mui/material";
import api from "../../api/api";
import { Task } from "../../models/Task";
import { Label } from "../../models/Label";

function UpdateTask() {
    const { taskId, userId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [labels, setLabels] = useState<Label[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, [taskId, userId]);

    async function loadData() {
        try {
            const taskResponse = await api.get(`/tasks/${taskId}`);
            const labelResponse = await api.get(`/label/list/${userId}`);

            setTask(taskResponse.data);
            setLabels(labelResponse.data);
        } catch {
            setError("Não foi possível carregar os dados da tarefa.");
        }
    }

    async function updateTask(e: React.FormEvent) {
        e.preventDefault();

        if (!task) return;

        try {
            await api.put(`/tasks/update/${taskId}`, {
                name: task.name,
                description: task.description ?? null,
                isCompleted: task.isCompleted,
                dueDate: task.dueDate ?? null,
                labelId: task.labelId ?? null
            });

            navigate(`/dashboard/${userId}`);
        } catch (err: any) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : "Não foi possível atualizar a tarefa."
            );
        }
    }

    if (!task) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography>
                    {error || "Carregando tarefa..."}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper className="form-card" sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mb: 3 }}
                >
                    Atualizar tarefa
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={updateTask}>
                    <TextField
                        label="Nome"
                        fullWidth
                        required
                        margin="normal"
                        value={task.name}
                        onChange={e => setTask({
                            ...task,
                            name: e.target.value
                        })}
                    />

                    <TextField
                        label="Descrição"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={task.description ?? ""}
                        onChange={e => setTask({
                            ...task,
                            description: e.target.value
                        })}
                    />

                    <TextField
                        label="Data de vencimento"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                        onChange={e => setTask({
                            ...task,
                            dueDate: e.target.value || null
                        })}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <TextField
                        label="Etiqueta"
                        select
                        fullWidth
                        margin="normal"
                        value={task.labelId ?? ""}
                        onChange={e => setTask({
                            ...task,
                            labelId: e.target.value
                                ? Number(e.target.value)
                                : null
                        })}
                    >
                        <MenuItem value="">Sem etiqueta</MenuItem>

                        {labels.map(label => (
                            <MenuItem key={label.labelId} value={label.labelId}>
                                {label.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Status"
                        fullWidth
                        margin="normal"
                        value={task.isCompleted ? "true" : "false"}
                        onChange={e => setTask({
                            ...task,
                            isCompleted: e.target.value === "true"
                        })}
                    >
                        <MenuItem value="false">Pendente</MenuItem>
                        <MenuItem value="true">Concluída</MenuItem>
                    </TextField>

                    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                        <Button type="submit" variant="contained" fullWidth>
                            Salvar
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate(`/dashboard/${userId}`)}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}

export default UpdateTask;

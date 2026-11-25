import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Button, Paper, TextField, Typography,
    MenuItem, Alert, Container
} from "@mui/material";
import api from "../../api/api";
import { Label } from "../../models/Label";

function CreateTask() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [labelId, setLabelId] = useState("");
    const [labels, setLabels] = useState<Label[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
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

    async function createTask(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            await api.post("/tasks/create", {
                name,
                description: description || null,
                dueDate: dueDate || null,
                userId: Number(userId),
                labelId: labelId ? Number(labelId) : null
            });

            navigate(`/dashboard/${userId}`);
        } catch (err: any) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : "Não foi possível criar a tarefa."
            );
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mb: 3 }}
                >
                    Nova tarefa
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={createTask}>
                    <TextField
                        label="Nome da tarefa"
                        fullWidth
                        required
                        margin="normal"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        slotProps={{
                            htmlInput: {
                                minLength: 5,
                                maxLength: 30
                            }
                        }}
                    />

                    <TextField
                        label="Descrição"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />

                    <TextField
                        label="Data de vencimento"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <TextField
                        label="Etiqueta"
                        select
                        fullWidth
                        margin="normal"
                        value={labelId}
                        onChange={e => setLabelId(e.target.value)}
                    >
                        <MenuItem value="">Sem etiqueta</MenuItem>

                        {labels.map(label => (
                            <MenuItem key={label.labelId} value={label.labelId}>
                                {label.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                        <Button type="submit" variant="contained" fullWidth>
                            Criar
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

export default CreateTask;
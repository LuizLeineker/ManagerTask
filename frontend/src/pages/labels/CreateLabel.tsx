import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container, Paper, Typography, TextField,
    Button, Box, Alert
} from "@mui/material";
import api from "../../api/api";

function CreateLabel() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [error, setError] = useState("");

    async function createLabel(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            await api.post("/label/create", {
                name,
                userId: Number(userId)
            });

            navigate(`/labels/${userId}`);
        } catch (err: any) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : "Não foi possível criar a etiqueta."
            );
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper className="form-card" sx={{ p: 4 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mb: 3 }}
                >
                    Criar etiqueta
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={createLabel}>
                    <TextField
                        label="Nome da etiqueta"
                        fullWidth
                        required
                        margin="normal"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                        <Button type="submit" variant="contained" fullWidth>
                            Criar
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate(`/labels/${userId}`)}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}

export default CreateLabel;

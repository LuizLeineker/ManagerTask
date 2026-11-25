import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container, Paper, Typography, Button,
    List, ListItem, ListItemText,
    IconButton, Divider, Box, Alert
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import api from "../../api/api";
import { Label } from "../../models/Label";

function ListLabels() {
    const { userId } = useParams();
    const navigate = useNavigate();

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

    async function deleteLabel(labelId: number) {
        try {
            await api.delete(`/label/delete/${labelId}`);
            await loadLabels();
        } catch {
            setError("Não foi possível excluir a etiqueta.");
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                sx={{ fontWeight: "bold", mb: 3 }}
            >
                Minhas etiquetas
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate(`/labels/create/${userId}`)}
                sx={{ mb: 3 }}
            >
                Nova etiqueta
            </Button>

            <Paper>
                {labels.length === 0 ? (
                    <Box sx={{ p: 3 }}>
                        <Typography color="text.secondary">
                            Você ainda não possui etiquetas.
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {labels.map((label, index) => (
                            <Box key={label.labelId}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            color="error"
                                            onClick={() => deleteLabel(label.labelId)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={label.name} />
                                </ListItem>

                                {index !== labels.length - 1 && <Divider />}
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

export default ListLabels;

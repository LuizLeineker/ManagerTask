import { useNavigate } from "react-router-dom";
import {
    Box, Button, Container, Typography, Paper
} from "@mui/material";
import { Login, PersonAdd, Checklist } from "@mui/icons-material";

function Home() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    className="form-card"
                    elevation={4}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        borderRadius: 4,
                        textAlign: "center"
                    }}
                >
                    <Checklist
                        sx={{
                            fontSize: 70,
                            color: "primary.main",
                            mb: 2
                        }}
                    />

                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: "bold",
                            mb: 2
                        }}
                    >
                        ManagerTask
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Organize suas tarefas e seu tempo.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Login />}
                            onClick={() => navigate("/signin")}
                        >
                            Entrar
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<PersonAdd />}
                            onClick={() => navigate("/signup")}
                        >
                            Criar conta
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Home;
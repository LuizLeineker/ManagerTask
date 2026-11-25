import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Box, Button, Paper, TextField, Typography,
    InputAdornment, IconButton, Alert
} from "@mui/material";
import {
    PersonOutlined, LockOutlined,
    Visibility, VisibilityOff
} from "@mui/icons-material";
import api from "../../api/api";

function SignIn() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function userLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await api.post("/user/login", {
                username: identifier,
                email: identifier,
                password
            });

            const userId = typeof data === "number"
                ? data
                : typeof data === "string"
                    ? Number(data)
                    : data.userId;

            if (!userId || isNaN(Number(userId))) {
                throw new Error("Resposta de login inválida.");
            }

            navigate(`/dashboard/${userId}`);
        } catch (err: any) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.message === "Resposta de login inválida."
                        ? err.message
                        : "Usuário ou senha inválidos."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2
        }}>
            <Paper elevation={4} className="form-card" sx={{
                width: "100%",
                maxWidth: 420,
                p: 4,
                borderRadius: 3
            }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                    ManagerTask
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", mb: 3 }}
                >
                    Entre na sua conta
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={userLogin}>
                    <TextField
                        label="Username ou Email"
                        fullWidth
                        required
                        margin="normal"
                        autoFocus
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        slotProps={{
                            htmlInput: {
                                maxLength: 256
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlined />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <TextField
                        label="Senha"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>

                <Typography sx={{ textAlign: "center", mt: 3 }}>
                    Ainda não possui conta? <Link to="/signup">Cadastrar</Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default SignIn;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Box, Button, Paper, TextField, Typography,
    InputAdornment, IconButton, Alert
} from "@mui/material";
import {
    PersonOutlined, EmailOutlined, LockOutlined,
    Visibility, VisibilityOff
} from "@mui/icons-material";
import api from "../../api/api";

function SignUp() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function registerUser(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/user/create", {
                username,
                email,
                password
            });

            navigate("/signin");
        } catch (err: any) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : "Não foi possível criar sua conta."
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
            bgcolor: "#f4f6f8",
            p: 2
        }}>
            <Paper elevation={4} sx={{
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
                    Crie sua conta
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={registerUser}>
                    <TextField
                        label="Username"
                        fullWidth
                        required
                        margin="normal"
                        autoFocus
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        slotProps={{
                            htmlInput: {
                                minLength: 5,
                                maxLength: 30
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
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined />
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
                                htmlInput: {
                                    minLength: 5,
                                    maxLength: 30
                                },
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
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </form>

                <Typography sx={{ textAlign: "center", mt: 3 }}>
                    Já possui uma conta? <Link to="/signin">Entrar</Link>
                </Typography>
            </Paper>
        </Box>
    );
}

export default SignUp;
import React from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { useAuth } from '../firebase/Auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { signIn } = useAuth();

    async function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
        const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;

        if (email && password) {
            await signIn(email, password);
            navigate("/");
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "green" }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={login} sx={{ width: "100%", mt: 1 }}>
                    <TextField
                        color="success"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        id="email"
                        type="email"
                        autoFocus
                        autoComplete="off"
                        label="Email"
                    />
                    <TextField
                        color="success"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        label="Password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        color="success"
                        sx={{ mt: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                        <Link
                            href="/register"
                            sx={{ color: "green", textDecorationColor: "green" }}
                            variant="body2"
                        >
                            New user? Sign up
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

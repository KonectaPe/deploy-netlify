import {
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "../../services/auth/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    const token = await login(data);
    if (token) {
      Swal.fire({
        title: "¡Inicio de sesión exitoso!",
        text: `Bienvenido, ${data.username}!`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/dashboard");
      });
    }
  };

  const onError = () => {
    Swal.fire({
      title: "Error",
      text: "Por favor, completa los campos correctamente.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  };

  return (
    <Container maxWidth="xs">
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar sesión
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <TextField
              fullWidth
              label="Usuario"
              type="text"
              margin="normal"
              autoFocus
              required
              name="username"
              {...register("username", {
                required: "El usuario es obligatorio",
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              required
              name="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              type="submit"
            >
              Ingresar
            </Button>
          </Box>
        </Paper>
      </Grid2>
    </Container>
  );
};

export default Login;

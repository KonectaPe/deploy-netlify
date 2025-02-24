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
import Swal from "sweetalert2";
import { updatePassword } from "../../services/user/authService";
import { useNavigate } from "react-router";

const Configuration = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.newPassword === data.password) {
      Swal.fire({
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido actualizada correctamente.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        updatePassword(data);
        navigate("/dashboard");
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden.",
        icon: "error",
        confirmButtonColor: "#d33",
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
    <Container maxWidth="xs" sx={{ pt: 4 }}>
      <Grid2 container justifyContent="center">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Actualizar contraseña
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              required
              name="newPassword"
              {...register("newPassword", {
                required: "La contraseña es obligatoria",
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              autoFocus
            />
            <TextField
              fullWidth
              label="Vuelva ingresar contraseña"
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
              Actualizar
            </Button>
          </Box>
        </Paper>
      </Grid2>
    </Container>
  );
};

export default Configuration;

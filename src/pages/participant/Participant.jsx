import {
  Box,
  Button,
  Container,
  FormControl,
  Grid2,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { addParticipant } from "../../services/user/authService";

const Participant = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const user = await addParticipant(data);
    if (user) {
      Swal.fire({
        title: "¡Participante registrado!",
        text: `El participante ${data.fullName} ha sido registrado exitosamente.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/dashboard");
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error al registrar al participante.",
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
    <Container sx={{ pt: 4 }} maxWidth="xs">
      <Grid2 container justifyContent="center" alignItems="center">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Registrar participante
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
              label="Nombre completo"
              type="text"
              margin="normal"
              required
              name="fullName"
              {...register("fullName", {
                required: "El nombre completo es obligatorio",
              })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
            <TextField
              fullWidth
              label="Especialidad"
              type="text"
              margin="normal"
              required
              name="speciality"
              {...register("speciality", {
                required: "La especialidad es obligatorio",
              })}
              error={!!errors.speciality}
              helperText={errors.speciality?.message}
            />
            <FormControl sx={{ mt: 2 }} fullWidth>
              <Typography color="primary">
                Seleccione una especialidad
              </Typography>
              <Controller
                name="area"
                control={control}
                defaultValue="BIOMEDICAS"
                rules={{ required: "El área es obligatorio" }}
                render={({ field }) => (
                  <Select {...field} fullWidth>
                    <MenuItem value="BIOMEDICAS">BIOMÉDICAS</MenuItem>
                    <MenuItem value="SOCIALES">SOCIALES</MenuItem>
                    <MenuItem value="INGENIERIAS">INGENIERÍAS</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              type="submit"
            >
              Registrar
            </Button>
          </Box>
        </Paper>
      </Grid2>
    </Container>
  );
};

export default Participant;

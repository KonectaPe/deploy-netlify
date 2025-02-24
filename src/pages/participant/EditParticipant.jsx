import { useEffect, useState } from "react";
import {
  getParticipants,
  updateParticipantData,
} from "../../services/user/authService";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";

const EditParticipant = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const participants = await getParticipants("PENDIENTE");
      setData(participants);
    };
    getData();
  }, []);

  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState({});

  const handleOpen = (data) => {
    setDataModal(data);
    setValue("username", data.username);
    setValue("fullName", data.fullName);
    setValue("speciality", data.speciality);
    setValue("area", data.area);
    setOpen(true);
  };
  const handleClose = () => {
    if (
      !dataModal.username ||
      !dataModal.fullName ||
      !dataModal.speciality ||
      !dataModal.area
    ) {
      return;
    }
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.id = dataModal.id;
    setOpen(false);
    Swal.fire({
      title: "¡Actualización exitosa!",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(async () => {
      await updateParticipantData(data);
      const participants = await getParticipants("PENDIENTE");
      setData(participants);
    });
  };

  const onError = () => {
    setOpen(true);
  };

  return (
    <Container sx={{ pt: 4 }} maxWidth="lg">
      <TableContainer sx={{ p: 4 }} component={Paper} elevation={4}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Usuario</TableCell>
              <TableCell align="center">Nombre completo</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Area</TableCell>
              <TableCell align="center">Rol</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.username}</TableCell>
                <TableCell align="center">{row.fullName}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="center">{row.area}</TableCell>
                <TableCell align="center">
                  {row.rol == "NULL" ? "SIN ASIGNAR" : row.rol}
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() =>
                      handleOpen({
                        id: row.id,
                        username: row.username,
                        fullName: row.fullName,
                        speciality: row.speciality,
                        area: row.area,
                      })
                    }
                  >
                    Actualizar
                  </Button>
                  <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: 250, sm: 400, md: 600 }, // Responsive width
                        bgcolor: "background.paper",
                        border: 2,
                        borderColor: "primary.main",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        zIndex: 1500,
                      }}
                    >
                      <Box display={"flex"} justifyContent={"flex-end"}>
                        <IconButton onClick={handleClose} aria-label="close">
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        color="primary"
                      >
                        Actualizar información
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
                          required
                          name="username"
                          value={dataModal.username}
                          {...register("username", {
                            required: "El usuario es obligatorio",
                          })}
                          onChange={(e) => {
                            setDataModal({
                              ...dataModal,
                              username: e.target.value,
                            });
                            setValue("username", e.target.value, {
                              shouldValidate: true,
                            });
                          }}
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
                          value={dataModal.fullName}
                          {...register("fullName", {
                            required: "El nombre completo es obligatorio",
                          })}
                          onChange={(e) => {
                            setDataModal({
                              ...dataModal,
                              fullName: e.target.value,
                            });
                            setValue("fullName", e.target.value, {
                              shouldValidate: true,
                            });
                          }}
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
                          value={dataModal.speciality}
                          {...register("speciality", {
                            required: "La especialidad es obligatorio",
                          })}
                          onChange={(e) => {
                            setDataModal({
                              ...dataModal,
                              speciality: e.target.value,
                            });
                            setValue("speciality", e.target.value, {
                              shouldValidate: true,
                            });
                          }}
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
                            defaultValue={dataModal.area}
                            rules={{ required: "El área es obligatorio" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                fullWidth
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  setDataModal((prev) => ({
                                    ...prev,
                                    area: e.target.value,
                                  }));
                                  field.onChange(e);
                                }}
                              >
                                <MenuItem value="BIOMEDICAS">
                                  BIOMÉDICAS
                                </MenuItem>
                                <MenuItem value="SOCIALES">SOCIALES</MenuItem>
                                <MenuItem value="INGENIERIAS">
                                  INGENIERÍAS
                                </MenuItem>
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
                    </Box>
                  </Modal>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EditParticipant;

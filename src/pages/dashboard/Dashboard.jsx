import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import Swal from "sweetalert2";
import {
  deleteData,
  getParticipants,
  updateParticipant,
} from "../../services/user/authService";
import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";

const Dashboard = () => {
  const [role, setRole] = useState("controlador");
  const [speciality, setSpeciality] = useState("ingenierias");
  const [numDraws, setNumDraws] = useState(1);
  const [slots, setSlots] = useState(["?", "?", "?"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winners, setWinners] = useState([]);
  const [seed, setSeed] = useState(null);
  const [availableNames, setAvailableNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentWinner, setCurrentWinner] = useState(null);

  useEffect(() => {
    participants();
  }, []);

  useEffect(() => {
    if (role === "formulador") {
      filterSpeciality(speciality);
    } else {
      setAvailableNames(users);
    }
  }, [users, speciality, role]);

  const participants = async () => {
    const participants = await getParticipants("PENDIENTE");
    setAvailableNames(participants);
    setUsers(participants);
  };

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setRole(newRole);
  };

  const handleSpecialityChange = (event) => {
    const newSpeciality = event.target.value;
    setSpeciality(newSpeciality);
  };

  const filterSpeciality = (specialityValue) => {
    if (!specialityValue) return;

    setAvailableNames(
      users.filter(
        (user) => user.area.toUpperCase() === specialityValue.toUpperCase()
      )
    );
  };

  const getSeededRandom = (seed) => {
    return () => {
      const x = Math.sin(seed++) * 1000;
      return x - Math.floor(x);
    };
  };

  const startDraw = useCallback(() => {
    if (numDraws <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El número de sorteos debe ser mayor a 0",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (availableNames.length <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay participantes disponibles para sortear",
        confirmButtonColor: "#d33",
      });
      return;
    }
    setIsSpinning(true);
    setWinners([]);

    let currentNames = [...availableNames];

    const drawWinners = (drawsLeft) => {
      if (drawsLeft === 0 || currentNames.length === 0) {
        setIsSpinning(false);
        return;
      }
      const newSeed = Date.now();
      setSeed(newSeed);
      const randomGen = getSeededRandom(newSeed);

      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(randomGen() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      let spins = 0;
      const shuffledNumbers = shuffleArray([...Array(100).keys()]);

      const finalNumber =
        shuffledNumbers[Math.floor(randomGen() * shuffledNumbers.length)];

      const interval = setInterval(() => {
        spins++;
        setSlots([
          shuffledNumbers[spins % 100],
          shuffledNumbers[(spins + 3) % 100],
          shuffledNumbers[(spins + 6) % 100],
        ]);

        if (spins >= 80) {
          clearInterval(interval);
          setSlots([finalNumber, finalNumber, finalNumber]);

          currentNames = shuffleArray(currentNames);
          const winner = currentNames.shift();

          setCurrentWinner(winner.username);

          setWinners((prev) => [...prev, winner]);

          setTimeout(() => drawWinners(drawsLeft - 1), 500);
        }
      }, 10 + Math.random() * 20);
      setCurrentWinner(null);
    };

    drawWinners(numDraws);
  }, [availableNames, numDraws, setSeed, setWinners, setIsSpinning, setSlots]);

  const accept = async (username) => {
    let status = "ACEPTADO";
    try {
      await updateParticipant(username, status, role.toUpperCase());
      Swal.fire({
        icon: "success",
        title: "¡Participante aceptado!",
        text: `El participante ${username} ha aceptado la oferta.`,
        confirmButtonColor: "#3085d6",
      }).then(async () => {
        await participants();
        setCurrentWinner(null);
        setWinners((prevWinners) =>
          prevWinners.filter((winner) => winner.username !== username)
        );
      });
    } catch (error) {
      console.error("Error al actualizar el estado del participante:", error);
    }
  };

  const cancel = async (username) => {
    let status = "RECHAZADO";
    try {
      await updateParticipant(username, status, role.toUpperCase());
      Swal.fire({
        icon: "success",
        title: "¡Participante rechazado!",
        text: `El participante ${username} ha rechazado la oferta.`,
        confirmButtonColor: "#d33",
      }).then(async () => {
        await participants();
        setCurrentWinner(null);
        setWinners((prevWinners) =>
          prevWinners.filter((winner) => winner.username !== username)
        );
      });
    } catch (error) {
      console.error("Error updating participant status:", error);
    }
  };

  const deleteAllData = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción es irreversible. ¿Deseas eliminar todos los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData();
        Swal.fire(
          "¡Eliminado!",
          "Todos los datos han sido eliminados.",
          "success"
        );
      }
    });
  };

  return (
    <>
      <Box sx={{ margin: "auto", py: 4 }} component="main">
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{
                display: "flex",
              }}
            >
              <Stack spacing={3} sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={6}
                  variant="outlined"
                  disabled
                  value={availableNames
                    .map((availableName) => {
                      return `${availableName.username}`;
                    })
                    .join("\n")}
                />
                <Button
                  href="/dashboard/edit"
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Editar
                </Button>
                <FormControl fullWidth>
                  <Typography color="primary">Seleccione un rol</Typography>
                  <Select value={role} onChange={handleRoleChange}>
                    <MenuItem value="controlador">Controlador</MenuItem>
                    <MenuItem value="formulador">Formulador</MenuItem>
                  </Select>
                </FormControl>
                {role === "formulador" && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Typography color="primary">Seleccione un area</Typography>
                    <Select
                      value={speciality}
                      onChange={handleSpecialityChange}
                    >
                      <MenuItem value="ingenierias">Ingenierías</MenuItem>
                      <MenuItem value="biomedicas">Biomédicas</MenuItem>
                      <MenuItem value="sociales">Sociales</MenuItem>
                    </Select>
                  </FormControl>
                )}
                <TextField
                  fullWidth
                  type="number"
                  label="Numero de Sorteos"
                  value={numDraws}
                  onChange={(event) => setNumDraws(event.target.value)}
                  sx={{ mt: 2 }}
                />
              </Stack>
              <Paper
                elevation={3}
                sx={{ flex: 2, p: 2, display: "flex", flexDirection: "column" }}
              >
                <Stack spacing={4} sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      flexDirection: "column",
                    }}
                  >
                    <Stack
                      flexWrap="wrap"
                      spacing={2}
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {slots.map((slot, index) => (
                        <Box
                          key={index}
                          sx={{
                            border: "2px solid black",
                            padding: 2,
                            minWidth: 100,
                            textAlign: "center",
                            bgcolor: "white",
                            height: 60,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <motion.div
                            animate={{
                              opacity: [0, 1],
                              y: isSpinning ? [10, -10, 10] : 0,
                            }}
                            transition={{
                              duration: 0.1,
                              repeat: isSpinning ? Infinity : 0,
                            }}
                          >
                            <Typography
                              variant="h4"
                              sx={{ textAlign: "center" }}
                            >
                              {slot}
                            </Typography>
                          </motion.div>
                        </Box>
                      ))}
                    </Stack>
                    {currentWinner && (
                      <Typography
                        fontSize={".8rem"}
                        color="primary"
                        variant="h6"
                      >
                        Ganador: {currentWinner}
                      </Typography>
                    )}
                  </Box>
                  {seed && (
                    <Typography
                      color="warning"
                      variant="body2"
                      sx={{ mt: 1, textAlign: "center" }}
                    >
                      Semilla del sorteo: {seed}
                    </Typography>
                  )}
                  <Stack
                    justifyContent={"center"}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={4}
                  >
                    <Button
                      variant="contained"
                      onClick={startDraw}
                      disabled={isSpinning}
                      sx={{ alignSelf: "center" }}
                    >
                      Iniciar/Sortear
                    </Button>
                    <Button
                      variant="contained"
                      onClick={deleteAllData}
                      sx={{ alignSelf: "center" }}
                      color="error"
                    >
                      Borrar datos
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Container maxWidth="lg">
                <Typography color="primary">Lista de ganadores</Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Usuario</TableCell>
                        <TableCell align="center">Nombre completo</TableCell>
                        <TableCell align="center">Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {winners.map((row) => (
                        <TableRow
                          key={row.username}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {row.username}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {row.fullName}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            <Stack
                              justifyContent="center"
                              direction="row"
                              spacing={2}
                            >
                              <IconButton
                                onClick={() => accept(row.username)}
                                size="large"
                                color="success"
                              >
                                <CheckCircleOutline />
                              </IconButton>
                              <IconButton
                                onClick={() => cancel(row.username)}
                                size="large"
                                color="error"
                              >
                                <CancelOutlined />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Container>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;

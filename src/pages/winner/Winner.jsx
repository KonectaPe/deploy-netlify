import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getWinners } from "../../services/user/authService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Pdf from "./Pdf";

const Winner = () => {
  const [role, setRole] = useState("CONTROLADOR");
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState([]);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSwitch = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWinners(role, checked);
      setData(data);
    };
    fetchData();
  }, [role, checked]);

  return (
    <Container sx={{ pt: 4 }} maxWidth="lg">
      <TableContainer sx={{ p: 4 }} component={Paper} elevation={4}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          spacing={4}
          justifyContent={"flex-end"}
          flexWrap={"wrap"}
          gap={4}
        >
          {data && data.length > 0 ? (
            <PDFDownloadLink
              key={JSON.stringify(data)}
              document={<Pdf data={data} />}
              fileName="reporte.pdf"
              style={{ textDecoration: "none" }}
            >
              {({ loading }) => (
                <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                  {loading ? "Generando PDF..." : "Descargar PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          ) : (
            ""
          )}
          <Switch
            checked={checked}
            onChange={handleSwitch}
            inputProps={{ "aria-label": "controlled" }}
          />
          <FormControl>
            <InputLabel id="role">Rol</InputLabel>
            <Select
              labelId="role"
              id="role-select"
              value={role}
              label="Rol"
              onChange={handleChange}
            >
              <MenuItem value="CONTROLADOR">Controladores</MenuItem>
              <MenuItem value="FORMULADOR">Formuladores</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Usuario</TableCell>
              <TableCell align="center">Nombre completo</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Especialidad</TableCell>
              <TableCell align="center">Rol</TableCell>
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
                <TableCell align="center">{row.rol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Winner;

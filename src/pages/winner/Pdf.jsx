import PropTypes from "prop-types";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#f2f2f2",
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
    fontSize: 9,
  },
  tableColNombre: {
    minWidth: 150,
    flexGrow: 2,
  },
});

const Pdf = ({ data }) => {
  // const generateData = (count) => {
  //   return Array.from({ length: count }, (_, index) => ({
  //     id: crypto.randomUUID(),
  //     area: "SOCIALES",
  //     fullName: "DEYVER TONNY JALIRI MESTAS DE LA TORRE",
  //     rol: "CONTROLADOR",
  //     status: "ACEPTADO",
  //     username: "99999999",
  //   }));
  // };

  // const datas = generateData(100);
  if (!data || data.length === 0) return null;
  const formatName = (name) => {
    const words = name.split(" ");
    let formattedName = "";

    for (let i = 0; i < words.length; i += 2) {
      formattedName += words.slice(i, i + 2).join(" ") + "\n";
    }

    return formattedName.trim();
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Reporte de sorteo
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Usuario</Text>
            <Text style={[styles.tableColHeader, styles.tableColNombre]}>
              Nombre Completo
            </Text>
            <Text style={styles.tableColHeader}>Estado</Text>
            <Text style={styles.tableColHeader}>Especialidad</Text>
            <Text style={styles.tableColHeader}>Rol</Text>
          </View>
          {data.map((item) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <Text style={styles.tableCol}>{item.username}</Text>
              <Text style={[styles.tableCol, styles.tableColNombre]}>
                {formatName(item.fullName)}
              </Text>
              <Text style={styles.tableCol}>{item.status}</Text>
              <Text style={styles.tableCol}>{item.area}</Text>
              <Text style={styles.tableCol}>{item.rol}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

Pdf.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      rol: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Pdf;

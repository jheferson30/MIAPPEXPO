import { StyleSheet, Text, TextInput, View } from "react-native";

export default function DataForm({ formData, setFormData }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Jheferson Cely"
        value={formData.nombre}
        onChangeText={(text) => setFormData({ ...formData, nombre: text })}
      />

      <Text style={styles.label}>Número de cédula</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 123456789"
        keyboardType="numeric"
        value={formData.cedula}
        onChangeText={(text) => setFormData({ ...formData, cedula: text })}
      />

      {/* NUEVO CAMPO: Necesario para el texto legal del documento */}
      <Text style={styles.label}>Expedida en</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Bogotá"
        value={formData.expedicion}
        onChangeText={(text) => setFormData({ ...formData, expedicion: text })}
      />

      <Text style={styles.label}>Fecha</Text>
      <TextInput
        style={styles.input}
        placeholder="DD / MM / AAAA"
        value={formData.fecha}
        onChangeText={(text) => setFormData({ ...formData, fecha: text })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10, // Bajé un poco el margen para que no choque arriba
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

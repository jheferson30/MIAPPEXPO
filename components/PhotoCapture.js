import * as ImagePicker from "expo-image-picker";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function PhotoCapture({ photo, setPhoto }) {
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Se requiere permiso para usar la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5, // Bajamos un poco la calidad para que el PDF no sea muy pesado
      base64: true, // ¡IMPORTANTE! Esto permite que la foto se incruste en el PDF
    });

    if (!result.canceled) {
      // Guardamos directamente la URI en el estado para que se vea en pantalla
      // y sea fácil de leer para el generador de PDF
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto de verificación (Biometría)</Text>

      {/* Si ya hay foto, mostramos la foto. Si no, mostramos el botón */}
      {photo ? (
        <View>
          <Image source={{ uri: photo }} style={styles.image} />
          <Button title="Tomar otra foto" color="#ff4444" onPress={takePhoto} />
        </View>
      ) : (
        <Button title="Capturar Rostro" onPress={takePhoto} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 10,
    borderRadius: 8,
    resizeMode: "cover",
  },
});

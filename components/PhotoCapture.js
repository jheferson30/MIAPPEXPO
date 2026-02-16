import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Button, Image, StyleSheet, View } from "react-native";

export default function PhotoCapture({ photo, setPhoto, cedula }) {
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Se requiere permiso para usar la camara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets?.[0];
      if (asset) {
        const cleanCedula = String(cedula || "")
          .replace(/\D+/g, "")
          .trim();
        const suffix = Date.now();
        const filename = cleanCedula
          ? `foto_${cleanCedula}_${suffix}.jpg`
          : `foto_sin_cedula_${suffix}.jpg`;
        const targetUri = `${FileSystem.cacheDirectory}${filename}`;

        try {
          await FileSystem.copyAsync({
            from: asset.uri,
            to: targetUri,
          });

          setPhoto({
            uri: targetUri,
            base64: asset.base64 || null,
            filename,
          });
        } catch {
          setPhoto({
            uri: asset.uri,
            base64: asset.base64 || null,
            filename,
          });
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
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
    flex: 1,
    padding: 6,
    justifyContent: "center",
  },
  previewWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    flex: 1,
    marginBottom: 8,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
});

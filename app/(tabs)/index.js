import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PhotoCapture from "../../components/PhotoCapture";
import SignaturePad from "../../components/SignaturePad";

export default function HomeScreen() {
  const sigRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    expedicion: "",
    fecha: new Date().toLocaleDateString(),
  });

  const manejarGenerarPDF = () => {
    if (!formData.nombre || !formData.cedula || !photo) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa los datos y la foto.",
      );
      return;
    }
    sigRef.current?.readSignature();
    setTimeout(() => {
      generarPDF();
    }, 1000);
  };

  const generarPDF = async () => {
    // Aquí va tu lógica de Print.printToFileAsync
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paperCard}>
          {/* ENCABEZADO LEGAL */}
          <Text style={styles.headerTitle}>
            AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES
          </Text>
          <Text style={styles.headerSubtitle}>
            Afiliación y control de ingreso a GYM WORK
          </Text>

          {/* CUERPO DEL TEXTO (TEXTO COMPLETO SEGÚN TU IMAGEN) */}
          <View style={styles.legalBody}>
            <Text style={styles.paragraph}>
              Yo,{" "}
              <TextInput
                style={styles.inlineInput}
                placeholder="Nombre completo"
                placeholderTextColor="#999"
                onChangeText={(t) => setFormData({ ...formData, nombre: t })}
                scrollEnabled={false}
              />{" "}
              identificado(a) con cédula de ciudadanía No.{" "}
              <TextInput
                style={[styles.inlineInput, { width: 90 }]}
                placeholder="Número"
                keyboardType="numeric"
                onChangeText={(t) => setFormData({ ...formData, cedula: t })}
              />{" "}
              expedida en{" "}
              <TextInput
                style={[styles.inlineInput, { width: 100 }]}
                placeholder="Ciudad"
                onChangeText={(t) =>
                  setFormData({ ...formData, expedicion: t })
                }
              />
              , por medio del presente documento y de conformidad con las normas
              vigentes sobre protección de datos personales, en especial la Ley
              1581 de 2012 y el Decreto 1074 de 2015, autorizo de manera libre,
              expresa e inequívoca a{" "}
              <Text style={styles.boldText}>GYM WORK</Text>, establecimiento de
              comercio legalmente constituido, para que realice la recolección y
              tratamiento de mis datos personales, los cuales suministro de
              forma veraz y completa.
            </Text>

            <Text style={styles.paragraph}>
              Los datos serán utilizados para aspectos relacionados con mi
              afiliación al gimnasio, la gestión administrativa del servicio, y
              especialmente para el{" "}
              <Text style={styles.boldText}>
                control de ingreso a las instalaciones mediante sistemas
                biométricos
              </Text>
              , así como para garantizar la seguridad de las personas, bienes e
              instalaciones.
            </Text>

            <Text style={styles.paragraph}>
              Autorizo el tratamiento de datos como: nombre, apellidos, número
              de identificación, número de celular, dirección, tipo de sangre y{" "}
              <Text style={styles.boldText}>
                datos biométricos (huella dactilar y reconocimiento facial)
              </Text>
              .
            </Text>

            <Text style={styles.paragraph}>
              Declaro que fui informado(a) de que los datos biométricos y el
              tipo de sangre son{" "}
              <Text style={styles.boldText}>datos sensibles</Text>, que no estoy
              obligado(a) a suministrarlos y que puedo solicitar un mecanismo
              alternativo de ingreso si no deseo utilizar sistemas biométricos.
            </Text>

            <Text style={styles.paragraph}>
              Conozco que tengo derecho a acceder, actualizar, rectificar y
              suprimir mis datos personales... a través del correo electrónico:{" "}
              <Text style={styles.linkText}>gymwork2021@gmail.com</Text>.
            </Text>

            <Text style={styles.paragraph}>
              La presente autorización me fue solicitada y puesta de presente
              antes de entregar mis datos y la suscribo de forma libre y
              voluntaria, una vez leída en su totalidad.
            </Text>
          </View>

          <View style={styles.horizontalDivider} />

          {/* SECCIÓN DE FIRMA Y FOTO LADO A LADO */}
          <View style={styles.evidenceRow}>
            <View style={styles.evidenceColumn}>
              <Text style={styles.columnLabel}>REGISTRO FOTOGRÁFICO:</Text>
              <View style={styles.photoContainer}>
                <PhotoCapture photo={photo} setPhoto={setPhoto} />
              </View>
            </View>

            <View style={styles.evidenceColumn}>
              <Text style={styles.columnLabel}>FIRMA DEL TITULAR:</Text>
              <View style={styles.signatureContainer}>
                <SignaturePad ref={sigRef} setSignature={setSignature} />
              </View>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureInfo}>
                Nombre: {formData.nombre}
              </Text>
              <Text style={styles.signatureInfo}>ID: {formData.cedula}</Text>
              <Text style={styles.signatureInfo}>Fecha: {formData.fecha}</Text>
            </View>
          </View>

          {/* BOTÓN NEGRO */}
          <TouchableOpacity
            style={styles.mainButton}
            onPress={manejarGenerarPDF}
          >
            <Text style={styles.mainButtonText}>GENERAR DOCUMENTO LEGAL</Text>
          </TouchableOpacity>
        </View>

        {/* Espacio extra al final para que no pegue con el borde de la pantalla */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scrollContent: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  paperCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 25,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    marginBottom: 25,
  },
  legalBody: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 10.5,
    textAlign: "justify",
    lineHeight: 16,
    color: "#000",
    marginBottom: 12,
  },
  inlineInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    color: "#000", // 1. Letra negra para integrarse
    fontSize: 10.5,
    padding: 0,
    marginHorizontal: 4,
    // 2 y 3. Estas propiedades corrigen la alineación y el amontonamiento:
    includeFontPadding: false,
    textAlignVertical: "bottom",
    minWidth: 50, // Permite que crezca si el nombre es largo
    maxWidth: 200, // Evita que se salga de la pantalla
    height: 18, // Altura ajustada al texto del párrafo
  },
  boldText: {
    fontWeight: "bold",
  },
  linkText: {
    color: "#0056b3",
    textDecorationLine: "underline",
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
    opacity: 0.1,
  },
  evidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  evidenceColumn: {
    width: "48%",
  },
  columnLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  photoContainer: {
    height: 180,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 4,
    overflow: "hidden",
  },
  signatureContainer: {
    height: 110,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 4,
  },
  signatureLine: {
    height: 1,
    backgroundColor: "#000",
    marginTop: 10,
    marginBottom: 5,
  },
  signatureInfo: {
    fontSize: 9,
    color: "#333",
    lineHeight: 12,
  },
  mainButton: {
    backgroundColor: "#000",
    paddingVertical: 18,
    borderRadius: 5,
    marginTop: 35,
    alignItems: "center",
  },
  mainButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 1,
  },
});

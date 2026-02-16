import React, { useRef, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  Alert,
  Image,
  Modal,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    expedicion: "",
    fecha: new Date().toLocaleDateString(),
  });
  const handleSignatureSaved = (img) => {
    setSignature(img);
    setModalVisible(false);
  };

  const manejarGenerarPDF = () => {
    if (!formData.nombre || !formData.cedula || !photo || !signature) {
      Alert.alert(
        "Campos incompletos",
        "Completa datos, toma la foto y agrega la firma.",
      );
      return;
    }

    generarPDF();
  };

  const generarPDF = async () => {
    try {
      const escapeHtml = (text = "") =>
        String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");

      const photoSrc = photo?.base64
        ? `data:image/jpeg;base64,${photo.base64}`
        : photo?.uri;

      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #f2f2f2;
                margin: 0;
                padding: 18px;
                color: #111;
              }
              .page {
                border: 1px solid #111;
                background: #fff;
                padding: 36px 44px 34px 44px;
              }
              h1 {
                font-size: 18px;
                text-align: center;
                margin: 0 0 10px 0;
                text-transform: uppercase;
              }
              h2 {
                font-size: 14px;
                margin: 0 0 12px 0;
                font-weight: bold;
                text-align: center;
              }
              p {
                font-size: 12px;
                line-height: 1.35;
                text-align: justify;
                margin: 0 0 10px 0;
              }
              .bold { font-weight: 700; }
              .link { color: #1a53b0; text-decoration: underline; }
              .fill {
                display: inline-block;
                border-bottom: 1px solid #111;
                padding: 0 4px 1px 4px;
                font-weight: bold;
              }
              .separator {
                height: 1px;
                background: #999;
                margin: 18px 0 14px 0;
              }
              .footerGrid {
                width: 100%;
                margin-top: 8px;
              }
              .col {
                display: inline-block;
                width: 48%;
                vertical-align: middle;
              }
              .colRight {
                margin-left: 4%;
              }
              .colTitle {
                font-size: 11px;
                font-weight: bold;
                margin-bottom: 6px;
              }
              .box {
                border: 1px solid #111;
                height: 120px;
                text-align: center;
                padding: 4px;
              }
              .photoImg {
                max-width: 100%;
                max-height: 110px;
                object-fit: contain;
              }
              .firmaImg {
                max-width: 100%;
                max-height: 110px;
                object-fit: contain;
              }
              .lineBlock {
                margin-top: 10px;
                font-size: 12px;
              }
              .line {
                border-bottom: 1px solid #111;
                height: 18px;
                margin-bottom: 8px;
              }
              .lineLabel {
                float: left;
                width: 130px;
              }
              .lineValue {
                margin-left: 130px;
                white-space: nowrap;
              }
            </style>
          </head>
          <body>
            <div class="page">
              <h1>AUTORIZACION PARA EL TRATAMIENTO DE DATOS PERSONALES</h1>
              <h2>Afiliacion y control de ingreso a GYM WORK</h2>

              <p>
                Yo, <span class="fill">${escapeHtml(formData.nombre)}</span>, identificado(a) con cedula de ciudadania No.
                <span class="fill">${escapeHtml(formData.cedula)}</span> expedida en
                <span class="fill">${escapeHtml(formData.expedicion)}</span>, por medio del presente documento y de
                conformidad con las normas vigentes sobre proteccion de datos personales, en especial la Ley 1581
                de 2012 y el Decreto 1074 de 2015, autorizo de manera libre, expresa e inequivoca a
                <span class="bold">GYM WORK</span>, establecimiento de comercio legalmente constituido, para que
                realice la recoleccion y tratamiento de mis datos personales, los cuales suministro de forma veraz
                y completa.
              </p>
              <p>
                Los datos seran utilizados para aspectos relacionados con mi afiliacion al gimnasio, la gestion
                administrativa del servicio, y especialmente para el
                <span class="bold"> control de ingreso a las instalaciones mediante sistemas biometricos</span>,
                asi como para garantizar la seguridad de las personas, bienes e instalaciones.
              </p>
              <p>
                Autorizo el tratamiento de datos como: nombre, apellidos, numero de identificacion, numero de celular,
                direccion, tipo de sangre y
                <span class="bold"> datos biometricos (huella dactilar y reconocimiento facial)</span>.
              </p>
              <p>
                Declaro que fui informado(a) de que los datos biometricos y el tipo de sangre son
                <span class="bold"> datos sensibles</span>, que no estoy obligado(a) a suministrarlos y que puedo
                solicitar un mecanismo alternativo de ingreso si no deseo utilizar sistemas biometricos.
              </p>
              <p>
                Conozco que tengo derecho a acceder, actualizar, rectificar y suprimir mis datos personales,
                revocar la autorizacion otorgada y presentar consultas o reclamos ante el responsable del tratamiento
                a traves del correo electronico:
                <span class="link">gymwork2021@gmail.com</span>.
              </p>
              <p>
                La presente autorizacion me fue solicitada y puesta de presente antes de entregar mis datos y la
                suscribo de forma libre y voluntaria, una vez leida en su totalidad.
              </p>

              <div class="separator"></div>

              <div class="footerGrid">
                <div class="col">
                  <div class="colTitle">REGISTRO FOTOGRAFICO:</div>
                  <div class="box">
                    ${photoSrc ? `<img src="${photoSrc}" class="photoImg" />` : ""}
                  </div>
                </div>
                <div class="col colRight">
                  <div class="colTitle">FIRMA DEL TITULAR:</div>
                  <div class="box">
                    ${signature ? `<img src="${signature}" class="firmaImg" />` : ""}
                  </div>
                </div>
              </div>

              <div class="lineBlock">
                <div class="line">
                  <span class="lineLabel">Nombre:</span>
                  <span class="lineValue">${escapeHtml(formData.nombre)}</span>
                </div>
                <div class="line">
                  <span class="lineLabel">Identificacion:</span>
                  <span class="lineValue">${escapeHtml(formData.cedula)}</span>
                </div>
                <div class="line">
                  <span class="lineLabel">Fecha:</span>
                  <span class="lineValue">${escapeHtml(formData.fecha)}</span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      const cleanCedula = String(formData.cedula || "")
        .replace(/\D+/g, "")
        .trim();
      const pdfName = cleanCedula
        ? `documento_${cleanCedula}_${Date.now()}.pdf`
        : `documento_sin_cedula_${Date.now()}.pdf`;
      const pdfUri = `${FileSystem.cacheDirectory}${pdfName}`;

      let outputUri = uri;
      try {
        await FileSystem.copyAsync({
          from: uri,
          to: pdfUri,
        });
        outputUri = pdfUri;
      } catch {
        outputUri = uri;
      }

      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(outputUri, {
          dialogTitle: pdfName,
          mimeType: "application/pdf",
        });
      } else {
        Alert.alert("PDF generado", `Archivo guardado en:\n${outputUri}`);
      }
    } catch (error) {
      Alert.alert(
        "Error al generar PDF",
        error?.message || "No fue posible generar el documento.",
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paperCard}>
          <Text style={styles.headerTitle}>
            AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES
          </Text>
          <Text style={styles.headerSubtitle}>
            Afiliación y control de ingreso a GYM WORK
          </Text>

          <View style={styles.legalBody}>
            <Text style={styles.paragraph}>
              Yo,{" "}
              <TextInput
                style={styles.inlineInput}
                placeholder="Nombre completo"
                placeholderTextColor="#999"
                value={formData.nombre}
                onChangeText={(t) => setFormData({ ...formData, nombre: t })}
                scrollEnabled={false}
              />{" "}
              identificado(a) con cedula de ciudadania No.{" "}
              <TextInput
                style={[styles.inlineInput, { width: 90 }]}
                placeholder="Número"
                keyboardType="numeric"
                value={formData.cedula}
                onChangeText={(t) => setFormData({ ...formData, cedula: t })}
              />{" "}
              expedida en{" "}
              <TextInput
                style={[styles.inlineInput, { width: 100 }]}
                placeholder="Ciudad"
                value={formData.expedicion}
                onChangeText={(t) => setFormData({ ...formData, expedicion: t })}
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

          <View style={styles.evidenceRow}>
            <View style={styles.evidenceColumn}>
              <Text style={styles.columnLabel}>REGISTRO FOTOGRÁFICO:</Text>
              <View style={styles.photoContainer}>
                <PhotoCapture
                  photo={photo}
                  setPhoto={setPhoto}
                  cedula={formData.cedula}
                />
              </View>
            </View>

            <View style={styles.evidenceColumn}>
              <Text style={styles.columnLabel}>FIRMA DEL TITULAR:</Text>
              <TouchableOpacity
                style={styles.signatureContainer}
                onPress={() => setModalVisible(true)}
              >
                {signature ? (
                  <Image
                    source={{ uri: signature }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  />
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 45,
                      color: "#999",
                      fontSize: 10,
                    }}
                  >
                    Toca para firmar
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.signatureLine} />
              <Text style={styles.signatureInfo}>Nombre: {formData.nombre}</Text>
              <Text style={styles.signatureInfo}>ID: {formData.cedula}</Text>
              <Text style={styles.signatureInfo}>Fecha: {formData.fecha}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={manejarGenerarPDF}
          >
            <Text style={styles.mainButtonText}>GENERAR DOCUMENTO LEGAL</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#FFF", padding: 20 }}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 40,
              marginBottom: 10,
            }}
          >
            POR FAVOR FIRME EN EL ESPACIO EN BLANCO
          </Text>

          <View
            style={{
              flex: 1,
              marginVertical: 10,
              borderWidth: 1,
              borderColor: "#EEE",
            }}
          >
            <SignaturePad ref={sigRef} setSignature={handleSignatureSaved} />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: "#555",
                borderRadius: 5,
                width: "48%",
              }}
              onPress={() => sigRef.current?.clearSignature()}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                LIMPIAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: "#28a745",
                borderRadius: 5,
                width: "48%",
              }}
              onPress={() => {
                sigRef.current?.readSignature();
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                ACEPTAR
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ padding: 10, alignItems: "center" }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#999" }}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    color: "#000",
    fontSize: 10.5,
    padding: 0,
    marginHorizontal: 4,
    includeFontPadding: false,
    textAlignVertical: "bottom",
    minWidth: 50,
    maxWidth: 200,
    height: 18,
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

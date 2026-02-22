import React, { useMemo, useRef, useState } from "react";
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

function LegalAuthorizationForm() {
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

  const generarPDF = async () => {
    try {
      const escapeHtml = (text = "") =>
        String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;")
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
              .evidenceBlock {
                margin-bottom: 12px;
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
                background: #fafafa;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .signatureBox {
                height: 145px;
              }
              .photoImg {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
              .firmaImg {
                max-width: 100%;
                max-height: 100%;
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
                <div class="evidenceBlock">
                  <div class="colTitle">REGISTRO FOTOGRAFICO:</div>
                  <div class="box">
                    ${photoSrc ? `<img src="${photoSrc}" class="photoImg" />` : ""}
                  </div>
                </div>
                <div class="evidenceBlock">
                  <div class="colTitle">FIRMA DEL TITULAR:</div>
                  <div class="box signatureBox">
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

  return (
    <View style={styles.paperCard}>
      <Text style={styles.headerTitle}>
        AUTORIZACION PARA EL TRATAMIENTO DE DATOS PERSONALES
      </Text>
      <Text style={styles.headerSubtitle}>
        Afiliacion y control de ingreso a GYM WORK
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
            placeholder="Numero"
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
          vigentes sobre proteccion de datos personales, en especial la Ley 1581
          de 2012 y el Decreto 1074 de 2015, autorizo de manera libre, expresa e
          inequivoca a <Text style={styles.boldText}>GYM WORK</Text>,
          establecimiento de comercio legalmente constituido, para que realice la
          recoleccion y tratamiento de mis datos personales, los cuales suministro
          de forma veraz y completa.
        </Text>

        <Text style={styles.paragraph}>
          Los datos seran utilizados para aspectos relacionados con mi afiliacion
          al gimnasio, la gestion administrativa del servicio, y especialmente
          para el{" "}
          <Text style={styles.boldText}>
            control de ingreso a las instalaciones mediante sistemas biometricos
          </Text>
          , asi como para garantizar la seguridad de las personas, bienes e
          instalaciones.
        </Text>

        <Text style={styles.paragraph}>
          Autorizo el tratamiento de datos como: nombre, apellidos, numero de
          identificacion, numero de celular, direccion, tipo de sangre y{" "}
          <Text style={styles.boldText}>
            datos biometricos (huella dactilar y reconocimiento facial)
          </Text>
          .
        </Text>

        <Text style={styles.paragraph}>
          Declaro que fui informado(a) de que los datos biometricos y el tipo de
          sangre son <Text style={styles.boldText}>datos sensibles</Text>, que no
          estoy obligado(a) a suministrarlos y que puedo solicitar un mecanismo
          alternativo de ingreso si no deseo utilizar sistemas biometricos.
        </Text>

        <Text style={styles.paragraph}>
          Conozco que tengo derecho a acceder, actualizar, rectificar y suprimir
          mis datos personales y presentar consultas o reclamos a traves del
          correo electronico: <Text style={styles.linkText}>gymwork2021@gmail.com</Text>.
        </Text>

        <Text style={styles.paragraph}>
          La presente autorizacion me fue solicitada y puesta de presente antes
          de entregar mis datos y la suscribo de forma libre y voluntaria.
        </Text>
      </View>

      <View style={styles.horizontalDivider} />

      <View style={styles.evidenceRow}>
        <View style={styles.evidenceColumn}>
          <Text style={styles.columnLabel}>REGISTRO FOTOGRAFICO:</Text>
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
                style={styles.signatureImage}
              />
            ) : (
              <Text style={styles.signaturePlaceholder}>Toca para firmar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signatureLine} />
          <Text style={styles.signatureInfo}>Nombre: {formData.nombre}</Text>
          <Text style={styles.signatureInfo}>ID: {formData.cedula}</Text>
          <Text style={styles.signatureInfo}>Fecha: {formData.fecha}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.mainButton} onPress={manejarGenerarPDF}>
        <Text style={styles.mainButtonText}>GENERAR DOCUMENTO LEGAL</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>POR FAVOR FIRME EN EL ESPACIO EN BLANCO</Text>

          <View style={styles.signaturePadFrame}>
            <SignaturePad ref={sigRef} setSignature={handleSignatureSaved} />
          </View>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => sigRef.current?.clearSignature()}
            >
              <Text style={styles.modalButtonText}>LIMPIAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => sigRef.current?.readSignature()}
            >
              <Text style={styles.modalButtonText}>ACEPTAR</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCancelText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default function HomeScreen() {
  const [activeFormat, setActiveFormat] = useState(null);

  const formatos = useMemo(
    () => [
      {
        id: "autorizacion_datos",
        title: "Autorizacion de datos",
        description: "Formato con foto, firma y exportacion a PDF.",
        enabled: true,
      },
      {
        id: "inscripcion_general",
        title: "Inscripcion general",
        description: "Registro principal de afiliado.",
        enabled: false,
      },
      {
        id: "consentimiento_salud",
        title: "Consentimiento de salud",
        description: "Declaracion de condiciones medicas.",
        enabled: false,
      },
    ],
    [],
  );

  const formatoActivo = formatos.find((item) => item.id === activeFormat);

  if (activeFormat === "autorizacion_datos") {
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveFormat(null)}
          >
            <Text style={styles.backButtonText}>Volver a formatos</Text>
          </TouchableOpacity>

          <LegalAuthorizationForm />
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.homeContent}>
        <Text style={styles.homeTitle}>Pagina de inicio</Text>
        <Text style={styles.homeSubtitle}>
          Selecciona el formato que deseas llenar.
        </Text>

        {formatos.map((formato) => (
          <TouchableOpacity
            key={formato.id}
            style={[
              styles.formatCard,
              !formato.enabled && styles.formatCardDisabled,
            ]}
            onPress={() => {
              if (!formato.enabled) {
                Alert.alert(
                  "Proximamente",
                  "Este formato aun no esta habilitado.",
                );
                return;
              }

              setActiveFormat(formato.id);
            }}
          >
            <Text style={styles.formatTitle}>{formato.title}</Text>
            <Text style={styles.formatDescription}>{formato.description}</Text>
            <Text style={styles.formatAction}>
              {formato.enabled ? "Abrir formato" : "Disponible proximamente"}
            </Text>
          </TouchableOpacity>
        ))}

        {formatoActivo && (
          <Text style={styles.activeFormatText}>
            Formato activo: {formatoActivo.title}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  homeContent: {
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  homeTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  homeSubtitle: {
    color: "#b8b8b8",
    fontSize: 14,
    marginBottom: 24,
  },
  formatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
  },
  formatCardDisabled: {
    opacity: 0.6,
  },
  formatTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  formatDescription: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
  },
  formatAction: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0056b3",
    textTransform: "uppercase",
  },
  activeFormatText: {
    color: "#bbb",
    marginTop: 8,
    fontSize: 12,
  },
  scrollContent: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  backButton: {
    marginBottom: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
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
    flexDirection: "column",
  },
  evidenceColumn: {
    width: "100%",
    marginBottom: 14,
  },
  columnLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  photoContainer: {
    height: 180,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 4,
    overflow: "hidden",
  },
  signatureContainer: {
    height: 145,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  signatureImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  signaturePlaceholder: {
    textAlign: "center",
    color: "#999",
    fontSize: 10,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  modalTitle: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
  },
  signaturePadFrame: {
    flex: 1,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalButton: {
    padding: 15,
    borderRadius: 5,
    width: "48%",
  },
  modalButtonSecondary: {
    backgroundColor: "#555",
  },
  modalButtonPrimary: {
    backgroundColor: "#28a745",
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalCancelButton: {
    padding: 10,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#999",
  },
});

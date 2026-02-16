import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Signature from "react-native-signature-canvas";

const SignaturePad = forwardRef((props, ref) => {
  const signatureRef = useRef(null);

  useImperativeHandle(ref, () => ({
    readSignature: () => {
      if (signatureRef.current) {
        signatureRef.current.readSignature();
      }
    },
    clearSignature: () => {
      if (signatureRef.current) {
        signatureRef.current.clearSignature();
      }
      props.setSignature(null);
    },
  }));

  return (
    <View style={styles.container}>
      <Signature
        ref={signatureRef}
        onOK={(img) => props.setSignature(img)}
        onClear={() => props.setSignature(null)}
        descriptionText=""
        webStyle={`.m-signature-pad--footer { display: none; } .m-signature-pad { border: none; }`}
      />
      <TouchableOpacity
        style={styles.clearBtn}
        onPress={() => {
          // Cambio corregido: clearCanvas -> clearSignature
          if (signatureRef.current) {
            signatureRef.current.clearSignature();
          }
          props.setSignature(null);
        }}
      >
        <Text style={styles.clearText}>Limpiar</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  clearBtn: { position: "absolute", bottom: 2, right: 2, padding: 4 },
  clearText: { color: "red", fontSize: 10 },
});

export default SignaturePad;
SignaturePad.displayName = "SignaturePad";

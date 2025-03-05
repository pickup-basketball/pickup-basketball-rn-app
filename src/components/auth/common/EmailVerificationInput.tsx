import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../../styles/colors";
import {
  validateEmailFormat,
  checkEmailDuplicate,
  sendVerificationCode,
  verifyEmailCode,
} from "../../../utils/auth/emailVerification";

type EmailVerificationInputProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onVerificationStatusChange: (isVerified: boolean, email: string) => void;
};

const EmailVerificationInput = ({
  email,
  onEmailChange,
  onVerificationStatusChange,
}: EmailVerificationInputProps) => {
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleEmailChange = (text: string) => {
    onEmailChange(text);
    if (text !== verifiedEmail) {
      setIsEmailVerified(false);
      setEmailCheckMessage("");
      setIsCodeSent(false);
      setVerificationCode("");
      onVerificationStatusChange(false, "");
    }
  };

  const handleCheckEmailDuplicate = async () => {
    if (isEmailVerified) return;

    setIsChecking(true);
    const formatResult = validateEmailFormat(email);
    if (!formatResult.isValid) {
      setEmailCheckMessage(formatResult.message);
      setIsChecking(false);
      return;
    }

    const result = await checkEmailDuplicate(email);
    setEmailCheckMessage(result.message);

    if (result.isValid) {
      setIsEmailVerified(true);
      setVerifiedEmail(email);
      setIsCodeSent(true);
      await sendVerificationCode(email);
    } else {
      setIsEmailVerified(false);
      onVerificationStatusChange(false, "");
    }
    setIsChecking(false);
  };

  const handleVerifyCode = async () => {
    const result = await verifyEmailCode(email, Number(verificationCode));
    setCodeMessage(result.message);
    if (result.success) {
      onVerificationStatusChange(true, email);
    }
  };

  return (
    <>
      <View style={styles.emailInputContainer}>
        <TextInput
          style={[
            styles.emailInput,
            isEmailVerified && { borderColor: "green", borderWidth: 1 },
          ]}
          value={email}
          onChangeText={handleEmailChange}
          placeholder="example@gmail.com"
          placeholderTextColor="#666"
          editable={!isEmailVerified}
        />
        <TouchableOpacity
          style={[styles.button, isEmailVerified ? styles.disabledButton : {}]}
          onPress={handleCheckEmailDuplicate}
          disabled={isEmailVerified || isChecking}
        >
          <Text style={styles.buttonText}>
            {isEmailVerified
              ? "확인됨 ✓"
              : isChecking
              ? "확인 중..."
              : "중복 확인"}
          </Text>
        </TouchableOpacity>
      </View>
      {emailCheckMessage ? (
        <Text style={styles.errorText}>{emailCheckMessage}</Text>
      ) : null}
      {isCodeSent && (
        <View style={styles.verificationContainer}>
          <TextInput
            style={styles.codeInput}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="인증 코드 입력"
            placeholderTextColor="#666"
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>인증 확인</Text>
          </TouchableOpacity>
        </View>
      )}
      {codeMessage ? <Text style={styles.errorText}>{codeMessage}</Text> : null}
    </>
  );
};

const styles = StyleSheet.create({
  emailInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emailInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  codeInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
  },
});

export default EmailVerificationInput;

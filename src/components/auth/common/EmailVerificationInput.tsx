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
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEmailChange = (text: string) => {
    onEmailChange(text);
    if (text !== verifiedEmail) {
      setIsEmailVerified(false);
      setEmailCheckMessage("");
      setIsCodeSent(false);
      setVerificationCode("");
      setIsCodeVerified(false);
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
    setIsVerifying(true);
    const result = await verifyEmailCode(email, Number(verificationCode));
    setCodeMessage(result.message);
    if (result.success) {
      setIsCodeVerified(true);
      onVerificationStatusChange(true, email);
    }
    setIsVerifying(false);
  };

  return (
    <>
      <View style={styles.emailInputContainer}>
        <TextInput
          style={[styles.emailInput, isEmailVerified && styles.verifiedInput]}
          value={email}
          onChangeText={handleEmailChange}
          placeholder="example@gmail.com"
          placeholderTextColor="#A0A0A0"
          editable={!isEmailVerified}
          selectionColor={colors.primary}
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
      {isCodeSent && !isCodeVerified && (
        <View style={styles.verificationContainer}>
          <TextInput
            style={[styles.codeInput, isCodeVerified && styles.verifiedInput]}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="인증 코드 입력"
            placeholderTextColor="#A0A0A0"
            keyboardType="number-pad"
            editable={!isCodeVerified}
            selectionColor={colors.primary}
          />
          <TouchableOpacity
            style={[styles.button, isCodeVerified ? styles.disabledButton : {}]}
            onPress={handleVerifyCode}
            disabled={isCodeVerified || isVerifying}
          >
            <Text style={styles.buttonText}>
              {isCodeVerified
                ? "확인됨 ✓"
                : isVerifying
                ? "확인 중..."
                : "인증 확인"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isCodeVerified && (
        <View style={styles.verificationSuccessContainer}>
          <Text style={styles.successText}>이메일 인증이 완료되었습니다 ✓</Text>
        </View>
      )}
      {codeMessage && !isCodeVerified ? (
        <Text style={styles.errorText}>{codeMessage}</Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  emailInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  emailInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#696969",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
    color: colors.primary,
  },
  verifiedInput: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: "rgba(255, 107, 0, 0.1)",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#696969",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18,
  },
  errorText: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  codeInput: {
    flex: 1,
    backgroundColor: "#3E3E3E",
    borderWidth: 1,
    borderColor: "#696969",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
    color: colors.primary,
  },
  verificationSuccessContainer: {
    marginTop: 4,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 107, 0, 0.1)",
    borderRadius: 8,
    borderColor: colors.primary || "#ff6b00",
    borderWidth: 1,
    alignItems: "center",
  },
  successText: {
    color: colors.primary || "#ff6b00",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default EmailVerificationInput;

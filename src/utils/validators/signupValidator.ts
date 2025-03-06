import { TStep1Form, TStep2Form } from "../../types/signup";

export interface EnhancedTStep1Form extends TStep1Form {
  isEmailVerified?: boolean;
  verifiedEmail?: string;
}

export const validateSignupStep1 = (form: TStep1Form) => {
  const errors: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.push("올바른 이메일 형식이 아닙니다.");
  }

  const passwordRegex = /^[A-Za-z\d!@#$%^&*()]{8,16}$/;
  if (!passwordRegex.test(form.password)) {
    errors.push("비밀번호는 8~16자의 영문자와 특수문자로 구성되어야 합니다.");
  }

  const nicknameRegex = /^[A-Za-z0-9가-힣]{2,10}$/;
  if (!nicknameRegex.test(form.nickname)) {
    errors.push("닉네임은 2-10자의 한글, 영문, 숫자만 가능합니다.");
  }

  return errors;
};

// 이메일 인증 여부까지 검증하는 확장된 함수
export const validateSignupStep1WithEmailVerification = (
  form: EnhancedTStep1Form
) => {
  // 기본 검증 실행
  const errors = validateSignupStep1(form);

  // 이메일 인증 여부 검증 추가
  if (!form.isEmailVerified || form.email !== form.verifiedEmail) {
    errors.push("이메일 인증이 필요합니다.");
  }

  return errors;
};

// 빈 필드 검증 함수 추가 (모든 필수 필드가 입력되었는지 확인)
export const checkRequiredFields = (form: TStep1Form) => {
  const emptyFields: string[] = [];

  if (!form.email) emptyFields.push("이메일");
  if (!form.password) emptyFields.push("비밀번호");
  if (!form.nickname) emptyFields.push("닉네임");

  return emptyFields;
};

export const validateSignupStep2 = (form: TStep2Form) => {
  const errors: string[] = [];

  const height = Number(form.height);
  const weight = Number(form.weight);

  if (!height || height < 130 || height > 250) {
    errors.push("키는 130cm에서 250cm 사이여야 합니다.");
  }

  if (!weight || weight < 30 || weight > 200) {
    errors.push("몸무게는 30kg에서 200kg 사이여야 합니다.");
  }

  if (!form.position) {
    errors.push("선호 포지션을 선택해주세요.");
  }

  if (!form.level) {
    errors.push("실력 수준을 선택해주세요.");
  }

  return errors;
};

// Step2 빈 필드 검증 함수 추가
export const checkRequiredFieldsStep2 = (form: TStep2Form) => {
  const emptyFields: string[] = [];

  if (!form.height) emptyFields.push("키");
  if (!form.weight) emptyFields.push("몸무게");
  if (!form.position) emptyFields.push("선호 포지션");
  if (!form.level) emptyFields.push("실력 수준");

  return emptyFields;
};

// src/utils/validators/signupValidator.ts
import { TSignupForm, TStep1Form, TStep2Form } from "../../types/signup";

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

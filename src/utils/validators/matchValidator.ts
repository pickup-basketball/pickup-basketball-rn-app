import { TFormData } from "./types";

export const validateForm = (
  data: TFormData
): { isValid: boolean; errors: { [key: string]: string } } => {
  const errors: { [key: string]: string } = {};

  // 안전한 trim 함수
  const safeTrim = (value: string | undefined): string => {
    return value?.trim() || "";
  };

  // 필수 필드 검사
  if (!safeTrim(data.title)) {
    errors.title = "제목을 입력해주세요";
  }

  // 위치 정보 검사
  if (!safeTrim(data.courtName)) {
    errors.courtName = "코트 이름을 입력해주세요";
  }

  if (!safeTrim(data.district)) {
    errors.district = "지역을 입력해주세요";
  }

  if (!safeTrim(data.locationDetail)) {
    errors.locationDetail = "상세 위치를 입력해주세요";
  }

  // 날짜/시간 검사
  if (!data.date || !data.time) {
    errors.datetime = "날짜와 시간을 선택해주세요";
  }

  // 날짜가 과거인지 검사
  if (data.date) {
    const selectedDate = new Date(`${data.date}T${data.time || "00:00"}`);
    if (selectedDate < new Date()) {
      errors.datetime = "과거 날짜는 선택할 수 없습니다";
    }
  }

  // 인원수 검사
  const maxPlayers = Number(data.maxPlayers) || 0;
  if (maxPlayers < 2) {
    errors.maxPlayers = "최소 2명 이상의 인원이 필요합니다";
  } else if (maxPlayers > 20) {
    errors.maxPlayers = "최대 20명까지만 설정 가능합니다";
  }

  // 참가비 검사
  const cost = Number(data.cost) || 0;
  if (cost < 0) {
    errors.cost = "참가비는 0원 이상이어야 합니다";
  }

  // 설명 검사
  if (!safeTrim(data.description)) {
    errors.description = "매치 설명을 입력해주세요";
  }

  // 규칙 검사 - 최소 1개의 유효한 규칙
  if (Array.isArray(data.rules)) {
    const validRules = data.rules.filter((rule) => safeTrim(rule) !== "");
    if (validRules.length === 0) {
      errors.rules = "최소 1개의 규칙을 입력해주세요";
    }
  } else {
    errors.rules = "규칙을 입력해주세요";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export type TSignupStep1Props = {
  onNext: (data: TStep1Form) => void;
};

export type TStep1Form = {
  email: string;
  password: string;
  nickname: string;
};

export type TStep2Form = {
  height: string;
  weight: string;
  position: TPosition;
  level: string;
};

export type TSignupForm = TStep1Form & TStep2Form;

export type TSignupStep2Props = {
  step1Data: TStep1Form;
  onPrevious: () => void;
  onSubmit: (allData: TSignupForm) => void;
};

export const positionMapping = {
  PG: "포인트 가드 (PG)",
  SG: "슈팅 가드 (SG)",
  SF: "스몰 포워드 (SF)",
  PF: "파워 포워드 (PF)",
  C: "센터 (C)",
} as const;

export const positions = ["PG", "SG", "SF", "PF", "C"] as const;
export type TPosition = (typeof positions)[number];

export const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type TLevel = (typeof levels)[number];

type LevelWithLabel = {
  label: string;
  value: TLevel;
};

export const levelsWithLabel: LevelWithLabel[] = [
  { label: "초급", value: "BEGINNER" },
  { label: "중급", value: "INTERMEDIATE" },
  { label: "상급", value: "ADVANCED" },
];

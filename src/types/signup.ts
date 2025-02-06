// signup.ts
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

export const positions = ["PG", "SG", "SF", "PF", "C"] as const;
export type TPosition = (typeof positions)[number];

export const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type TLevel = (typeof levels)[number];

import type { StackNavigationProp } from "@react-navigation/stack";

type TSignupStep1Props = {
  onNext: (data: TStep1Data) => void;
};

type TStep1Data = {
  email: string;
  password: string;
  nickname: string;
};

type TSignupData = TStep1Data & {
  height: string;
  weight: string;
  position: string;
  level: string;
};

type TSignupStep2Props = {
  step1Data: TStep1Data;
  onPrevious: () => void;
  onSubmit: (allData: TSignupData) => void;
};

type TPosition = {
  position: string;
  value: string;
};

type TLevel = {
  level: string;
  value: string;
};

type RootStackParamList = {
  Matching: undefined;
};

type TNavigationProp = StackNavigationProp<RootStackParamList>;

export {
  TSignupStep1Props,
  TSignupData,
  TStep1Data,
  TSignupStep2Props,
  TPosition,
  TLevel,
  RootStackParamList,
  TNavigationProp,
};

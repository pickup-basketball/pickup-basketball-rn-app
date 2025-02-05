import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
  MainTab: {
    screen: "Matching" | "Courts" | "MyPage";
  };
};

export type MatchingStackParamList = {
  MatchingMain: undefined;
  WriteMatch: undefined;
};

export type WriteScreenNavigationProp = NativeStackNavigationProp<
  MatchingStackParamList,
  "WriteMatch"
>;

export type CourtsStackParamList = {
  CourtMain: undefined;
};

export type GuideStackParamList = {
  GuideMain: undefined;
};

export type MyPageStackParamList = {
  MyPageMain: undefined;
};

export type MainTabParamList = {
  Matching: undefined;
  Courts: undefined;
  MyPage: undefined;
};

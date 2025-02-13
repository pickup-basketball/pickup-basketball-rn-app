import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { Participation } from "./participation";

export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
  MainTab: {
    screen?: "Guide" | "Matching" | "Courts" | "MyPage";
  };
  EditMatch: {
    matchData: any;
    onUpdate?: () => void;
  };
};

export type TNavigationProp = StackNavigationProp<RootStackParamList>;

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
  EditMatch: {
    matchData: any;
    onUpdate?: () => void;
  };
};

type MyPageNavigationProp = StackNavigationProp<MyPageStackParamList>;

export type ParticipationListProps = {
  participations: Participation[];
  onUpdate?: () => void;
  navigation: MyPageNavigationProp;
};

export type MainTabParamList = {
  Guide: undefined;
  Matching: undefined;
  Courts: undefined;
  MyPage: undefined;
};

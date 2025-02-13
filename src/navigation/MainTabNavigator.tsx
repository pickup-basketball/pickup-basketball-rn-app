import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import CourtsScreen from "../screens/main/CourtsScreen";
import GuideScreen from "../screens/main/GuideScreen";
import { MatchingScreen } from "../screens/main/MatchingScreen";
import { MyPageScreen } from "../screens/main/MyPageScreen";
import WriteMatchForm from "../screens/main/WriteMatchFormScreen";
import { EditMatchScreen } from "../components/match/EditMatchScreen";
import { MyPageStackParamList } from "../types/navigation";

// 스택 네비게이터 생성
const GuideStack = createStackNavigator();
const MatchingStack = createStackNavigator();
const CourtsStack = createStackNavigator();
const MyPageStack = createStackNavigator<MyPageStackParamList>();
const Tab = createBottomTabNavigator();

// Guide 스택
const GuideStackNavigator = () => {
  return (
    <GuideStack.Navigator>
      <GuideStack.Screen
        name="GuideMain"
        component={GuideScreen}
        options={{ headerShown: false }}
      />
    </GuideStack.Navigator>
  );
};

// Matching 스택
const MatchingStackNavigator = () => {
  return (
    <MatchingStack.Navigator>
      <MatchingStack.Screen
        name="MatchingMain"
        component={MatchingScreen}
        options={{ headerShown: false }}
      />
      <MatchingStack.Screen
        name="WriteMatch" // 매치 작성 화면 추가
        component={WriteMatchForm}
        options={{ headerShown: false }}
      />
    </MatchingStack.Navigator>
  );
};

// Court 스택
const CourtsStackNavigator = () => {
  return (
    <CourtsStack.Navigator>
      <CourtsStack.Screen
        name="CourtMain"
        component={CourtsScreen}
        options={{ headerShown: false }}
      />
    </CourtsStack.Navigator>
  );
};

// MyPage 스택
const MypageStackNavigator = () => {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="MyPageMain"
        component={MyPageScreen}
        options={{ headerShown: false }}
      />
      <MyPageStack.Screen
        name="EditMatch"
        component={EditMatchScreen}
        options={{ headerShown: false }}
      />
    </MyPageStack.Navigator>
  );
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen
        name="Guide"
        component={GuideStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Matching"
        component={MatchingStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Courts"
        component={CourtsStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="MyPage"
        component={MypageStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

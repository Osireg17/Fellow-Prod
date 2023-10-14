import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Octicons,
  FontAwesome,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, createContext, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

import BiblePost from "../components/BiblePost";
import EditPostPage from "../components/EditPostPage";
import QuestionPost from "../components/QuestionPost";
import { auth } from "../config/firebase";
import CreateProfile from "../screens/Authentication/CreateProfile";
import ForgotPassword from "../screens/Authentication/ForgotPassword";
import Login from "../screens/Authentication/LogIn";
import SignUp from "../screens/Authentication/SignUp";
import BiblePage from "../screens/Bible/BiblePage";
import CommentsPage from "../screens/Comment Pages/BiblePostCommentsPage";
import QuestionCommentsPage from "../screens/Comment Pages/QuestionCommentsPage";
import Activity from "../screens/Feeds/Activity";
import Questions from "../screens/Feeds/Questions";
import Search from "../screens/Feeds/Search";
import Home from "../screens/Home";
import EditProfilePage from "../screens/Profile/EditProfilePage";
import OtherUserProfilePage from "../screens/Profile/OtherUserProfilePage";
import ProfilePage from "../screens/Profile/ProfilePage";
import Settings from "../screens/Profile/Settings";
import Welcome from "../screens/WelcomeScreen";

const AuthenticatedUserContext = createContext({});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function BibleStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BiblePage" component={BiblePage} />
      <Stack.Screen name="BiblePost" component={BiblePost} />
    </Stack.Navigator>
  );
}

function QuestionStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Question" component={Questions} />
      <Stack.Screen name="QuestionPost" component={QuestionPost} />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const ProfileStack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfilePage" component={ProfilePage} />
      <ProfileStack.Screen name="ProfileDrawer" component={ProfileDrawer} />
    </ProfileStack.Navigator>
  );
}

// create a drawer navigator for the profile page
function ProfileDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="ProfilePage"
      drawerType="back"
      edgeWidth={0}
      drawerPosition="right"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: 240,
          drawerPosition: "right",
        },
        // remove the ablility to swipe to open the drawer
        swipeEnabled: false,
      }}
    >
      <Drawer.Screen name="Close" component={Feeds} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}

function Feeds() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          position: "absolute",
          height: 75,
          paddingTop: 20,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="home" size={20} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Questions"
        component={QuestionStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="comment-question-outline"
              size={20}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bible"
        component={BibleStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="bible" size={20} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bell-o" size={20} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={26} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const AuthenticatedUserProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthenticatedUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthenticatedUserContext.Provider
      value={{ authenticatedUser, setAuthenticatedUser }}
    >
      {loading ? (
        <View>
          <ActivityIndicator />
        </View>
      ) : (
        children
      )}
    </AuthenticatedUserContext.Provider>
  );
};

export const useAuthenticatedUser = () => useContext(AuthenticatedUserContext);

const MainStack = () => {
  const { authenticatedUser } = useAuthenticatedUser();

  return (
    <Stack.Navigator>
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="Feeds"
            component={ProfileDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfilePage"
            component={EditProfilePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OtherUserProfilePage"
            component={OtherUserProfilePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CommentsPage"
            component={CommentsPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuestionCommentsPage"
            component={QuestionCommentsPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditPostPage"
            component={EditPostPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SearchPage"
            component={Search}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateProfile"
            component={CreateProfile}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthenticatedUserProvider>
        <MainStack />
      </AuthenticatedUserProvider>
    </NavigationContainer>
  );
}
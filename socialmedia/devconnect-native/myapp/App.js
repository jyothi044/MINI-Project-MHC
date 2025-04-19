import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { AuthProvider } from "./context/AuthContext"

// Import components
import CustomDrawerContent from "./components/CustomDrawerContent"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import EditProfile from "./components/EditProfile"
import CreatePost from "./components/CreatePost"
import Search from "./components/Search"
import AllUsers from "./components/AllUsers"

const Drawer = createDrawerNavigator()

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Register"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerStyle: {
                backgroundColor: "#4a5568",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              drawerStyle: {
                backgroundColor: "#2d3748",
              },
              drawerLabelStyle: {
                color: "#fff",
              },
            }}
          >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Drawer.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Drawer.Screen name="Search" component={Search} />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="EditProfile" component={EditProfile} />
            <Drawer.Screen name="CreatePost" component={CreatePost} />
            <Drawer.Screen name="AllUsers" component={AllUsers} />
          </Drawer.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

export default App
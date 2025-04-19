import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { useAuth } from "../context/AuthContext"

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth()

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>DevConnect</Text>
      </View>
      <DrawerItemList {...props} />
      {user ? (
        <View>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate("Profile", { username: user.username })}
          >
            <Text style={styles.drawerItemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={logout}>
            <Text style={styles.drawerItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate("Login")}>
            <Text style={styles.drawerItemText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate("Register")}>
            <Text style={styles.drawerItemText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: "#4a5568",
    padding: 16,
    marginBottom: 8,
  },
  drawerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerItem: {
    padding: 16,
  },
  drawerItemText: {
    color: "#fff",
    fontSize: 16,
  },
})

export default CustomDrawerContent


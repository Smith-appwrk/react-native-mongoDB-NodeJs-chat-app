import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Chat from './Chat';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';

const Sidebar = createDrawerNavigator();
const Drawer = ({navigation, route}) => {
  const {chatId, userId, otherUserId} = route.params;

  function CustomDrawerContent(props) {
    const width = useWindowDimensions().width * 0.3;

    return (
      <DrawerContentScrollView {...props}>
        <View style={{paddingLeft: 5, paddingRight: 5}}>
          <View style={styles.drawerHeader}>
            <Text style={styles.heading}>CHAT DETAILS</Text>
          </View>
          <View>
            <Text style={styles.text}>CHAT ID : {chatId}</Text>
            <Text style={styles.text}>YOUR ID : {userId}</Text>
            <Text style={styles.text}>OTHER USER ID : {otherUserId}</Text>
          </View>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Sidebar.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#0f58a5',
        },
        headerStyle: {
          backgroundColor: '#0f58a5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: 'white',
        },
      }}
      initialRouteName="Chat">
      <Sidebar.Screen
        name="Chat"
        initialParams={route.params}
        component={Chat}
        options={{headerShown: false}}
      />
    </Sidebar.Navigator>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#eb5526',
    borderRadius: 10,
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 70,
    paddingBottom: 25,
    paddingLeft: 20,
  },
  text: {
    color: '#000',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginTop: 5,
    borderRadius: 10,
    fontWeight: '400',
  },
});

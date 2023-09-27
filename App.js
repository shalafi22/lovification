import { ActivityIndicator, Platform, Text } from "react-native"
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useState, useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import SendNotiScreen from './src/screens/sendNotiScreen';
import SavedNotisScreen from "./src/screens/savedNotisScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { firebase } from "./firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [data, setData] = useState("");
  const [id, setId] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [savedNotifications, setSavedNotifications] = useState([])
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  
  const ref = firebase.firestore().collection("tokens")
 
  
  useEffect(() => {
    async function fetchData() {
      try {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token);
        console.log(token)
        ref.where("token", "==", token).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const userData = doc.data()
             setData(userData)
             setId(doc.id)
             const today = new Date();
            const todayString = today.getDate() + "." + today.getMonth() + "." + today.getFullYear();
            if (todayString !== userData.lastSentDate) {
            ref.doc(doc.id).update(
              {dailySentCount: 0}
            )
            }

             setIsLoading(false);
          })
        })
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    }

    fetchData();
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (data && data.url) {
        Linking.openURL(data.url);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (isLoading)?(<SafeAreaView stlye={{flex: 1, height:"100%", justifyContent: "center", alignItems: "center"}}><ActivityIndicator size="large" color="green" /></SafeAreaView>):(
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName="Send"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Send') {
              iconName = focused ? 'mail' : 'mail-outline';
            } else if (route.name === 'Saved') {
              iconName = focused ? 'bookmark' : 'bookmark-outline'; 
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Send" component={SendNotiScreen} options={{ title: 'Send Lovifications', headerShown: false }} initialParams={{userData: data, userId: id, expoPushToken: expoPushToken}} />
        <Tab.Screen name="Saved" options={{ title: 'Saved Lovifications' }} initialParams={{userData: data, userId: id}}component={SavedNotisScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    await Notifications.setNotificationChannelAsync('longpress', {
      name: 'longpress',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 50, 50, 50, 50],
      lightColor: '#FF231F7C',
      sound: "upset_sound_tone.mp3",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '8c4ddeb1-7e3f-4e28-8ce6-a8826b0caf3d' })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}



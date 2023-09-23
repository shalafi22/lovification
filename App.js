import { useState, useEffect, useRef } from 'react';
import { Text, View, Platform, TouchableOpacity, SafeAreaView, TextInput, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { firebase } from "./firebaseConfig"
import * as Linking from 'expo-linking';
import ButtonContainer from './ButtonContainer';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [tokenToSend, setTokenToSend] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const ref = firebase.firestore().collection("tokens")

  const updateTitle = (newTitle) => {
    setTitle(newTitle)
  }

  const updateBody = (newBody) => {
    setBody(newBody)
  }

  const handlePress = async () => {
    if (title === "" || body === "") {
      alert("Write something")
    } else {
      await schedulePushNotification((expoPushToken === "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]")? "ExponentPushToken[4JdT3eHCYaHdzcTzqAt1ql]" : "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]" , body, title, "default");
    }
    
  }

  const handleLongPress = async () => {
    if (title === "" || body === "") {
      alert("Write something")
    } else {
      await schedulePushNotification((expoPushToken === "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]")? "ExponentPushToken[4JdT3eHCYaHdzcTzqAt1ql]" : "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]", body, title, "longpress");
    }
  }
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      setName((token === "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]")? "bubu": "bibi")
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
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

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.firstContainer}>
          <Text style={styles.welcomeText}>Hello {name}!!!</Text>
          <Text style={{paddingBottom: 6, fontSize: 16}}>Send a custom notification:</Text>
          <View style={styles.notificationProp}>
            <Text style={styles.notificationAppText}>lovification</Text>
            <TextInput placeholder={"Type your title here"} placeholderTextColor={"black"} style={styles.titleTextInp}value={title} onChangeText={setTitle} />
            <TextInput placeholder={"Type your message here"} placeholderTextColor={"black"} style={styles.bodyTextInp}value={body} onChangeText={setBody} />
          </View>
          <TouchableOpacity 
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={styles.sendButton}>
            <Text style={{fontSize: 18, fontWeight: "bold"}}>I Miss You.. :(</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.secondContainer}>
          <Text style={{paddingBottom: 6, fontSize: 16}}>Or use one of the presets: </Text>
          <ButtonContainer name={name} updateTitle={updateTitle} updateBody={updateBody}></ButtonContainer>
          <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress} style={styles.sendButton}>
            <Text style={{fontSize: 18, fontWeight: "bold"}}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    
  );
}

async function schedulePushNotification(targetToken, body, title, channelId) {
  return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: targetToken,
        sound: (channelId === "longpress") ? "upset_sound_tone.mp3" : "default",
        title: title,
        body: body,
        channelId: channelId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
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

const styles = StyleSheet.create({
  firstContainer: {
    width: "100%",
    borderBottomWidth: 1,
    paddingBottom: 40,
    borderBottomColor: "lightgrey",
  },
  secondContainer: {
    width: "100%",
    marginTop: 10
  },
  sendButton: {
    alignSelf: "center",
    backgroundColor: "lightblue",
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
    elevation: 5
  },
  welcomeText: {
    fontSize: 40,
    marginBottom: 40,
    borderBottomWidth: 2
  },
  buttonText: {
    fontSize: 40, 
    textAlign: "center", 
    alignItems: "center"
  },
  button: {
    backgroundColor: "red",
    borderRadius: 150,
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center"
  },
  bodyTextInp: {
    width: "100%",
    marginBottom: 8,
    paddingLeft: 20,
    color: "black",
  },
  notificationAppText: {
    paddingLeft: 20,
    color: "#bababa"
  },
  titleTextInp: {
    marginVertical: 5,
    paddingLeft: 20,
    color: "black",
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center"
  },
  wrapper: {
    flexDirection: "column", 
    justifyContent:"center", 
    flex: 1,
    padding: 10,
  },
  notificationProp: {
    borderWidth: 2,
    width: "100%",
    borderColor: "#eaeaea",
    borderRadius: 15,
  }
})

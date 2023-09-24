import { Text, View, TouchableOpacity, SafeAreaView, TextInput, StyleSheet, Image } from 'react-native';
import ButtonContainer from '../components/ButtonContainer';
import { useState, useEffect } from 'react';
import * as Haptics from "expo-haptics";
import NotificationPopup from '../components/NotificationPopup';
import { firebase } from "../../firebaseConfig";

export default function SendNotiScreen({route}) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [showNotification, setShowNotification] = useState(false);
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
            await schedulePushNotification((route.params.expoPushToken === "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]")? "ExponentPushToken[4JdT3eHCYaHdzcTzqAt1ql]" : "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]" , body, title, "default");
            Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
            )
        }
    }

    const saveNotification = () => {
        ref.where("owner", "==", route.params.name).get().then((querySnaphot) => {
            querySnaphot.forEach(doc => {
            const notificationToAdd = {
                "title": title,
                "body": body
            }
            const userId = doc.id
            const savedNotifications = doc.data().savedNotifications || [];
            savedNotifications.push(notificationToAdd);
            ref.doc(userId).update({
                savedNotifications: savedNotifications,
                })
                .then(() => {
                console.log('Document successfully updated');
                })
                .catch((error) => {
                console.error('Error updating document: ', error);
                });
            });
            setShowNotification(true);
            setTimeout(() => {
            setShowNotification(false);
            }, 3500);
        })
    }

    const handleLongPress = async () => {
    if (title === "" || body === "") {
        alert("Write something")
    } else {
        await schedulePushNotification((route.params.expoPushToken === "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]")? "ExponentPushToken[4JdT3eHCYaHdzcTzqAt1ql]" : "ExponentPushToken[HJ1JkfIk9SucaYln6dfBOI]", body, title, "longpress");
        Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
        )
    }
    }

    useEffect(() => {
      if (route.params?.title && route.params?.body) {
        setTitle(route.params.title);
        setBody(route.params.body);
        delete route.params.title;
        delete route.params.body;
      }
    }, [route.params]);

    return (
        <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.firstContainer}>
          <Text style={styles.welcomeText}>Hello {route.params.name}!!!</Text>
          <Text style={{paddingBottom: 6, fontSize: 16}}>Send a custom notification:</Text>
          <View style={styles.notificationProp}>
            <View style={[styles.row, {paddingLeft: 20}]}>
              <Image style={{width: 26, height: 26}} source={require('../../assets/icon.png')} />
              <Text style={styles.notificationAppText}>lovification</Text>
            </View>
            <TextInput placeholder={"Type your title here"} placeholderTextColor={"black"} style={styles.titleTextInp}value={title} onChangeText={setTitle} />
            <TextInput placeholder={"Type your message here"} placeholderTextColor={"black"} style={styles.bodyTextInp}value={body} onChangeText={setBody} />
          </View>
          <View style={[styles.row, {justifyContent: "space-evenly"}]}>
            <TouchableOpacity 
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={styles.sendButton}>
              <Text style={{fontSize: 18, fontWeight: "bold"}}>I Miss You.. :(</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveNotification} style={[styles.sendButton, {backgroundColor: "yellow"}]}>
              <Text style={{fontSize: 18, fontWeight: "bold"}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.secondContainer}>
          <Text style={{paddingBottom: 6, fontSize: 16}}>Or use one of the presets: </Text>
          <ButtonContainer name={route.params.name} updateTitle={updateTitle} updateBody={updateBody}></ButtonContainer>
          <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress} style={styles.sendButton}>
            <Text style={{fontSize: 18, fontWeight: "bold"}}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showNotification && (
        <NotificationPopup message="Notification saved successfully!!" />
      )}
    </SafeAreaView>
    )
}

async function schedulePushNotification(targetToken, body, title, channelId) {
    return fetch('https://exp.host/--/api/v2/push/send', {
        body: JSON.stringify({
          to: targetToken,
          sound: (channelId === "longpress") ? "upset_sound_tone.mp3" : "default",
          title: title,
          body: body,
          channelId: channelId,
  
          data: {
            backgroundColor: "red"
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
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
      paddingLeft: 10,
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
      backgroundColor: "white",
      borderRadius: 15,
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
  })
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, StyleSheet, Image } from 'react-native';
import ButtonContainer from '../components/ButtonContainer';
import { useState, useEffect } from 'react';
import * as Haptics from "expo-haptics";
import NotificationPopup from '../components/NotificationPopup';
import { firebase } from "../../firebaseConfig";
import {StatusBar} from "expo-status-bar";

export default function SendNotiScreen({route}) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("Notification saved successfully!!")
    const [sentNotificationCount, setSentNotificationCount] = useState(0);
    const [isSendDisabled, setIsSendDisabled] = useState(false);

    const ref = firebase.firestore().collection("tokens")

    const updateTitle = (newTitle) => {
        setTitle(newTitle)
    }
    
    const updateBody = (newBody) => {
        setBody(newBody)
    }

    const handlePress = async () => {
      if (!isSendDisabled) {
        if (title === "" || body === "") {
          setMessage("An empty Lovification is no sign of love!")
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          setShowNotification(true);
          setTimeout(() => {
          setShowNotification(false);
          }, 3500);
      } else {
          await schedulePushNotification(route.params.userData.partnerToken, body, title, "default")
          .then((response) => {
            console.log(response)
            Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
            )
                const today = new Date()
                const todayString = today.getDate() + "." + today.getMonth() + "." + today.getFullYear();
                ref.doc(route.params.userId).update({
                  lastSentDate: todayString,
                  dailySentCount: route.params.userData.dailySentCount + 1
                })
             
            
            const tempCount = sentNotificationCount + 1;
            setSentNotificationCount(tempCount)
          }) 
        }
        setIsSendDisabled(true);
        setTimeout(() => {
          setIsSendDisabled(false);
        }, 500)
      }
        
    }

    const saveNotification = () => {           
            const notificationToAdd = {
                "title": title,
                "body": body
            }
            const savedNotifications = route.params.userData.savedNotifications || [];
            if (savedNotifications.some((obj) => {
              return obj.title === title && obj.body === body;
            })) {
              setMessage("That notification already exists!")
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
              setShowNotification(true);
              setTimeout(() => {
              setShowNotification(false);
              }, 3500);
            }
            else {
              savedNotifications.push(notificationToAdd);
              ref.doc(route.params.userId).update({
                  savedNotifications: savedNotifications,
                  })
                  .then(() => {
                    setMessage("Notification saved successfully!!")
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                    setShowNotification(true);
                    setTimeout(() => {
                    setShowNotification(false);
                    }, 3500);
                  })
                  .catch((error) => {
                  console.error('Error updating document: ', error);
                  });
            }
    }

    const clearNotification = () => {
      setBody("")
      setTitle("")
      Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
      )
    }

    useEffect(() => {
      if (route.params?.title && route.params?.body) {
        setTitle(route.params.title);
        setBody(route.params.body);
        delete route.params.title;
        delete route.params.body;
      }
    }, [route.params]);

    useEffect(() => {
          const today = new Date();
          const todayString = today.getDate() + "." + today.getMonth() + "." + today.getFullYear();
          if (todayString !== route.params.userData.lastSentDate) {
            ref.doc(route.params.userId).update(
              {dailySentCount: 0}
            ).then(() => {
              setSentNotificationCount(0);
            }) 
          } else {
            setSentNotificationCount(route.params.userData.dailySentCount)
          }
    }, [])

    return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.firstContainer}>
          <Text style={styles.welcomeText}>Hello {route.params.userData.owner}!!!</Text>
          <Text style={{paddingBottom: 6, fontSize: 16}}>Send a custom notification:</Text>
          <View style={styles.notificationProp}>
            <View style={[styles.row, {paddingLeft: 20}]}>
              <Image style={{width: 26, height: 26}} source={require('../../assets/icon.png')} />
              <Text style={styles.notificationAppText}>lovification</Text>
            </View>
            <TextInput placeholder={"Type your title here"} placeholderTextColor={"black"} style={styles.titleTextInp}value={title} onChangeText={setTitle} />
            <TextInput multiline={true} placeholder={"Type your message here"} placeholderTextColor={"black"} style={styles.bodyTextInp}value={body} onChangeText={setBody} />
          </View>
          <View style={[styles.row, {justifyContent: "space-evenly"}]}>
            <TouchableOpacity onPress={saveNotification} style={[styles.sendButton, {backgroundColor: "yellow"}]}>
              <Text style={{fontSize: 18, fontWeight: "bold"}}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearNotification} style={[styles.sendButton, {backgroundColor: "red"}]}>
              <Text style={{fontSize: 18, fontWeight: "bold"}}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            disabled={isSendDisabled}
            onPress={handlePress}
            style={styles.sendButton}>
              <Text style={{fontSize: 18, fontWeight: "bold"}}>Send</Text>
            </TouchableOpacity>
          </View>
          <Text style={{alignSelf: "center", paddingTop: 10, marginBottom: -20, fontSize: 22, fontWeight: "bold"}}>You sent <Text style={{color: "red"}}>{sentNotificationCount}</Text> Lovification(s) today!</Text>
        </View>
        <View style={styles.secondContainer}>
          <Text style={{paddingBottom: 6, fontSize: 16}}>Or use one of the presets: </Text>
          <ButtonContainer presets={route.params.userData.presets} name={route.params.userData.name} updateTitle={updateTitle} updateBody={updateBody}></ButtonContainer>
        </View>
      </View>
      {showNotification && (
        <NotificationPopup message={message} />
      )}
      <StatusBar style="dark"
                       translucent={true}
                       hidden={false}
            />
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
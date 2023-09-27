import { Text, View, TouchableOpacity, SafeAreaView, TextInput, StyleSheet, Image } from 'react-native';
import ButtonContainer from '../components/ButtonContainer';
import { useState, useEffect } from 'react';
import * as Haptics from "expo-haptics";
import NotificationPopup from '../components/NotificationPopup';
import { firebase } from "../../firebaseConfig";
import {StatusBar} from "expo-status-bar";
import Ionicons from '@expo/vector-icons/Ionicons';

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
          .then(() => {
            Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
            )
            const today = new Date()
            const todayString = today.getDate() + "." + today.getMonth() + "." + today.getFullYear();
            ref.doc(route.params.userId).update({
              lastSentDate: todayString,
              dailySentCount: sentNotificationCount + 1
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
            setSentNotificationCount(route.params.userData.dailySentCount)
    }, [])

    return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.firstContainer}>
          <Text style={styles.welcomeText}>Welcome, {route.params.userData.owner}!!!</Text>
          <Image style={{width: 54, height: 142, position: "absolute", right: "8%", top: "16%", zIndex: 5}} source={require("../../assets/penguin.png")} />
          <View style={styles.countTextContainer}>
          <Text style={styles.countText}>You sent </Text>
          <View style={styles.numberTextContainer}>
           <Text style={styles.countText}>{sentNotificationCount}</Text>
          </View>
          <Text style={styles.countText}> Lovification(s) today!</Text>
          </View>
        </View>

        <View style={styles.secondContainer}>
        <Text style={{paddingBottom: 6, fontSize: 16}}>Send a custom lovification:</Text>
          <View style={styles.notificationProp}>
            <View style={[styles.row, {paddingLeft: 20}]}>
            <Image style={{width: 30, height: 30, marginLeft: -5}} source={require('../../assets/prop-icon.png')} />
              <Text style={styles.notificationAppText}>lovification</Text>
            </View>
            <TextInput placeholder={"Type your title here"} placeholderTextColor={"black"} style={styles.titleTextInp}value={title} onChangeText={setTitle} />
            <TextInput multiline={true} placeholder={"Type your message here"} placeholderTextColor={"black"} style={styles.bodyTextInp}value={body} onChangeText={setBody} />
          </View>
          <View style={[styles.row, {justifyContent: "space-evenly", paddingTop: 10}]}>
            <TouchableOpacity onPress={saveNotification} style={styles.sendButton}>
              <Text style={{fontSize: 18, fontWeight: "bold",  marginRight: 8}}>Save</Text>
              <Image source={require("../../assets/SaveIcon.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearNotification} style={styles.sendButton}>
              <Text style={{fontSize: 18, fontWeight: "bold", marginRight: 8}}>Clear</Text>
              <Image source={require("../../assets/ClearIcon.png")} />
            </TouchableOpacity>
            <TouchableOpacity 
            disabled={isSendDisabled}
            onPress={handlePress}
            style={styles.sendButton}>
              <Text style={{fontSize: 18, fontWeight: "bold", marginRight: 8}}>Send</Text>
              <Image source={require("../../assets/SendIcon.png")} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.thirdContainer}>
          <View style={styles.row}>
            <Text style={{paddingBottom: 6, fontSize: 16}}>Or use one of the presets: </Text>
            <TouchableOpacity style={{marginLeft: "20%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
              <Ionicons name="pencil" size={24} color="black" />
              <Text style={{paddingHorizontal: 10}}>Edit</Text>
            </TouchableOpacity>
          </View>
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
      marginTop: 10,
      width: "100%",
      borderWidth: 1,
      borderColor: "lightgrey",
      backgroundColor: "#4C7EE1",
      borderRadius: 12,
      flex: 0.3,
      elevation: 5
    },
    secondContainer: {
      flex: 0.3,
      width: "100%"
    },
    countTextContainer: {
      alignSelf: "center", 
      textAlign: "center",
      paddingTop: 10,
      backgroundColor: "#c6def1",
      borderRadius: 12,
      paddingBottom: 44,
      width: "95%",
      marginTop: "8%",
      elevation: 14,
      flexDirection: "row",
      justifyContent: "center"
    },
    numberTextContainer: {
      paddingHorizontal: 26,
      backgroundColor: "#4c7ee1",
      borderRadius: 5
    },
    countText: {
      fontWeight: "500",
    },
    thirdContainer: {
      width: "100%",
      marginTop: 10,
      flex: 0.3
    },
    sendButton: {
      alignSelf: "center",
      backgroundColor: "#4c7ee1",
      borderRadius: 15,
      padding: 10,
      marginTop: 10,
      elevation: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    welcomeText: {
      fontSize: 26,
      fontWeight: "700",
      paddingTop: "16%",
      paddingLeft: 10,
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
      justifyContent: "space-evenly",
    },
    wrapper: {
      flexDirection: "column", 
      justifyContent:"center", 
      flex: 1,
      padding: 10,
      backgroundColor: "#eaedf6"
    },
    notificationProp: {
      borderWidth: 2,
      width: "100%",
      borderColor: "#eaeaea",
      backgroundColor: "white",
      borderRadius: 15,
      borderWidth: 2,
      borderColor: "black"
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
  })
import { SafeAreaView, TextInput, ActivityIndicator, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Modal } from "react-native";
import { firebase } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import {StatusBar} from "expo-status-bar";
import ActionModal from "../components/SavedActionModal";
import SavePresetModal from "../components/SavePresetModal";
import * as Haptics from "expo-haptics";

const SavedNotificationItem = (props) => {    
    return (
            <TouchableOpacity onPress={() => {props.handlePress({"title": props.title, "body": props.body})}} style={styles.notificationProp}>
                <View style={{width: "100%", borderWidth: 2, borderRadius: 15}}>
                    <View style={[styles.row, {paddingLeft: 20}]}>
                        <Image style={{width: 26, height: 26}} source={require('../../assets/icon.png')} />
                        <Text style={styles.notificationAppText}>lovification</Text>
                    </View>
                    <Text style={styles.titleTextInp} >{props.title}</Text>
                </View>
            </TouchableOpacity>
    )
}

export default function SavedNotisScreen({route, navigation}) {
    const [savedNotifications, setSavedNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isActionModalVisible, setIsActionModalVisible] = useState(false);
    const [isSavePresetModalVisible, setIsSavePresetModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState({"title": "", "body": ""});

    const ref = firebase.firestore().collection("tokens")

    const handlePress = (item) => {
      setIsActionModalVisible(true);
      setSelectedItem(item);
    }

    const handleActionModalClose = () => {
      setIsActionModalVisible(false);
      setSelectedItem({"title": "", "body": ""});
    }

    const handleSaveModalClose = () => {
      setIsSavePresetModalVisible(false);
    }

    const saveAsPreset = (title, body, color, name) => {
      const obj = {
        title: title,
        body: body,
        color: color,
        name: name
      };
          const presets = (route.params.userData.presets) ? route.params.userData.presets : []
          presets.push(obj)
          ref.doc(route.params.userId).update({
            presets: presets
          }).then(() => {
            Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
            )
            setIsSavePresetModalVisible(false);
            setSelectedItem({"title": "", "body": ""})
          })
    }

    const handleSavePreset = () => {
          if (route.params.userData.presets.length < 4) {
            setIsActionModalVisible(false);
            setIsSavePresetModalVisible(true);
          } else {
            alert("maximum 4 presets permitted")
          }
      
    }

    const handleDelete = (title, body) => {
      const newArray = savedNotifications.filter((obj) => {
        return !(obj.title === title && obj.body === body);
      });
          ref.doc(route.params.userId).update({
            savedNotifications: newArray
          }).then(() => {
            setSavedNotifications(newArray)
          }).catch((err) => console.error(`Error deleting doc: ${err}`))
          .finally(() => {
            handleActionModalClose();
          })
    }
    const handleSendPress = (title, body) => {
      handleActionModalClose();
      navigation.navigate('Send', {
          title: title,
          body: body,
        })
  }

    const handleSaveChanges = (oldTitle, oldBody, newTitle, newBody) => {
      if (oldTitle !== newTitle || oldBody !== newBody){
      const newArray = savedNotifications.map((obj) => {
        if (obj.title === oldTitle && obj.body === oldBody) {
          return {
            ...obj,
            title: newTitle,
            body: newBody,
          };
        }
        return obj;
      });
          ref.doc(route.params.userId).update({
            savedNotifications: newArray
          }).then(() => {
            setSavedNotifications(newArray)
          }).catch((err) => console.error(`Error updating doc: ${err}`))
          .finally(() => {
            handleActionModalClose();
          })}
      else {
        alert("Make some changes on the notification to save!")
      }
    }

    const fetchSaved = async () => {
      try {
        const notificationsData = [];
    
        const savedNotificationsArray = route.params.userData.savedNotifications || [];

        await savedNotificationsArray.forEach((notification) => {
          notificationsData.push(notification);
        });

        setSavedNotifications(notificationsData);
      } catch (e) {
          console.error('Error fetching data:', error);
      } finally {
          setIsLoading(false);
      }
            
    }
    useEffect(() => {
        fetchSaved();
      }, []);

    return (isLoading) ? (<SafeAreaView style={{flex: 1, height:"100%", justifyContent: "center", alignItems: "center"}}><ActivityIndicator size="large" color="green" /></SafeAreaView>):( 
      <SafeAreaView style={{flex: 1, alignItems: "center", paddingHorizontal: 20}}>
        <View style={styles.topTab}>
          <Text style={{fontSize: 20, fontWeight: "500"}}>Saved Lovifications</Text>
        </View>
        <View style={{width: "100%"}}>
          <FlatList 
            data={savedNotifications}
            renderItem={({item}) => <SavedNotificationItem handlePress={handlePress} navigation={navigation} title={item.title} body={item.body}/>}
        />
        </View>
        <ActionModal handleSendPress={handleSendPress} handleSavePreset={handleSavePreset} handleSaveChanges={handleSaveChanges} visible={isActionModalVisible} title={selectedItem.title} handleDelete={handleDelete} body={selectedItem.body} handleModalClose={handleActionModalClose}/>
        <SavePresetModal title={selectedItem.title} body={selectedItem.body} visible={isSavePresetModalVisible} handleModalClose={handleSaveModalClose} saveAsPreset={saveAsPreset}/>
        
        <StatusBar style="dark"
        translucent={false}
        hidden={false}
        />
      </SafeAreaView>
        
        
        
    )
}

const styles = StyleSheet.create({
  topTab: {
    width: "100%",
    backgroundColor: "#4c7ee1",
    borderRadius: 15,
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 20,
    paddingLeft: 10
  },
  bodyTextInp: {
      width: "100%",
      marginBottom: 8,
      paddingLeft: 20,
      paddingRight: 5,
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
    notificationProp: {
      borderWidth: 2,
      width: "100%",
      borderColor: "#eaeaea",
      backgroundColor: "white",
      borderRadius: 15,
      marginBottom: 5,
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
})
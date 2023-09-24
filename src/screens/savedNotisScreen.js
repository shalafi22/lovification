import { SafeAreaView, TextInput, ActivityIndicator, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Modal } from "react-native";
import { firebase } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import {StatusBar} from "expo-status-bar";

const ActionModal = (props) => {
  const [titleTemp, setTitleTemp] = useState(props.title);
  const [bodyTemp, setBodyTemp] = useState(props.body);

  useEffect(() => {
    setTitleTemp(props.title)
    setBodyTemp(props.body)
  }, [props.visible])

  return (
    <Modal visible={props.visible} transparent={true} animationType="fade">
      <TouchableOpacity onPress={props.handleModalClose} activeOpacity={1} style={[styles.modalContainer, {backgroundColor: 'rgba(52, 52, 52, 0.8)'}]}>
          <View style={{flexDirection: "column", position: "absolute", top: "30%", width: "100%", paddingHorizontal: 5}}>
            <TouchableOpacity activeOpacity={1} style={[styles.notificationProp]}>
                <View>
                    <View style={[styles.row, {paddingLeft: 20}]}>
                        <Image style={{width: 26, height: 26}} source={require('../../assets/icon.png')} />
                        <Text style={styles.notificationAppText}>lovification</Text>
                    </View>
                    <TextInput multiline={true} style={styles.titleTextInp} value={titleTemp} onChangeText={setTitleTemp} />
                    <TextInput multiline={true} style={styles.bodyTextInp} value={bodyTemp} onChangeText={setBodyTemp} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconRow} onPress={() => {props.handleDelete(props.title, props.body)}}>
                <Ionicons name="trash-bin" size={20} color="red" />
                <Text style={{paddingLeft: 10}}>Delete Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {props.handleSaveChanges(props.title, props.body, titleTemp, bodyTemp)}} style={styles.iconRow}>
                <Ionicons name="save" size={20} color="blue" />
                <Text style={{paddingLeft: 10}}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconRow}>
                <Ionicons name="star" size={20} color="gold" />
                <Text style={{paddingLeft: 10}}>Save Notification as Preset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {props.handleSendPress(props.title, props.body)}} style={styles.iconRow}>
                <Ionicons name="send" size={20} color="green" />
                <Text style={{paddingLeft: 10}}>Send Notification</Text>
            </TouchableOpacity>
          </View>
      </TouchableOpacity>
    </Modal>
  )
}

const SavedNotificationItem = (props) => {    
    return (
            <TouchableOpacity onPress={() => {props.handlePress({"title": props.title, "body": props.body})}} style={styles.notificationProp}>
                <View>
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState({"title": "", "body": ""});

    const ref = firebase.firestore().collection("tokens")

    const handlePress = (item) => {
      setIsModalVisible(true);
      setSelectedItem(item);
    }

    const handleModalClose = () => {
      setIsModalVisible(false);
      setSelectedItem({"title": "", "body": ""});
    }

    const handleDelete = (title, body) => {
      const newArray = savedNotifications.filter((obj) => {
        return !(obj.title === title && obj.body === body);
      });

      ref.where("owner", "==", route.params.name).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          const userId = doc.id
          ref.doc(userId).update({
            savedNotifications: newArray
          }).then(() => {
            setSavedNotifications(newArray)
          }).catch((err) => console.error(`Error deleting doc: ${err}`))
          .finally(() => {
            handleModalClose();
          })
        });
      })
    }
    const handleSendPress = (title, body) => {
      handleModalClose();
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
      ref.where("owner", "==", route.params.name).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          const userId = doc.id
          ref.doc(userId).update({
            savedNotifications: newArray
          }).then(() => {
            setSavedNotifications(newArray)
          }).catch((err) => console.error(`Error updating doc: ${err}`))
          .finally(() => {
            handleModalClose();
          })
        });
      })}
      else {
        alert("Make some changes on the notification to save!")
      }
    }

    const fetchSaved = (name) => {
        ref.where('owner', '==', name).get().then((querySnapshot) => {
            const notificationsData = [];
    
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const savedNotificationsArray = data.savedNotifications || [];
    
              savedNotificationsArray.forEach((notification) => {
                notificationsData.push(notification);
              });
            });
    
            setSavedNotifications(notificationsData);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          }).finally(() => setIsLoading(false));
    }
    useEffect(() => {
        fetchSaved(route.params.name);
      }, []);

    useEffect(() => {
      if (route.params?.isNewSaved) {
        fetchSaved(route.params.name);
      }
    }, [route.params])

    return (isLoading) ? (<SafeAreaView stlye={{flex: 1, height:"100%", justifyContent: "center", alignItems: "center"}}><ActivityIndicator size="large" color="green" /></SafeAreaView>):( 
      <SafeAreaView stlye={{flex: 1, height:"100%", justifyContent: "center", alignItems: "center"}}>
        <View>
          <FlatList 
            data={savedNotifications}
            renderItem={({item}) => <SavedNotificationItem handlePress={handlePress} navigation={navigation} title={item.title} body={item.body}/>}
        />
        <ActionModal handleSendPress={handleSendPress} handleSaveChanges={handleSaveChanges} visible={isModalVisible} title={selectedItem.title} handleDelete={handleDelete} body={selectedItem.body} handleModalClose={handleModalClose}/>
        </View>
        <StatusBar style="dark"
        translucent={true}
        hidden={false}
        />
      </SafeAreaView>
        
        
        
    )
}

const styles = StyleSheet.create({
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
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
      },
      iconRow: {
        width: "90%",
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#bababa",
        backgroundColor: "#ffffff",
        alignSelf: "flex-end",
        flexDirection: "row",
        alignItems: "center"
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
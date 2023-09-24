import { SafeAreaView, ActivityIndicator, StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { firebase } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SavedNotificationItem = (props) => {

    const handlePress = (title, body) => {
        props.navigation.navigate('Send', {
            title: title,
            body: body,
          })
    }

    
    return (
        <View style={[styles.row, {justifyContent: "space-evenly"}]}>
            <TouchableOpacity onPress={() => {handlePress(props.title, props.body)}} style={styles.notificationProp}>
                <View>
                    <View style={[styles.row, {paddingLeft: 20}]}>
                        <Image style={{width: 26, height: 26}} source={require('../../assets/icon.png')} />
                        <Text style={styles.notificationAppText}>lovification</Text>
                    </View>
                    <Text style={styles.titleTextInp} >{props.title}</Text>
                    <Text style={styles.bodyTextInp} >{props.body}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {props.handleDelete(props.title, props.body)}}>
                <Ionicons name="trash-bin" size={20} color="red" />
            </TouchableOpacity>
        </View>
    )
}

export default function SavedNotisScreen({route, navigation}) {
    const [savedNotifications, setSavedNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const ref = firebase.firestore().collection("tokens")

    const handleDelete = (title, body) => {
      const newArray = savedNotifications.filter((obj) => {
        return !(obj.title === title && obj.body === body);
      });
      setSavedNotifications(newArray)

      ref.where("owner", "==", route.params.name).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          const userId = doc.id
          ref.doc(userId).update({
            savedNotifications: newArray
          }).then(() => {
            console.log("Delete successful")
          }).catch((err) => console.error(`Error deleting doc: ${err}`))
        });
      })

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
        <FlatList 
            data={savedNotifications}
            renderItem={({item}) => <SavedNotificationItem handleDelete={handleDelete} navigation={navigation} title={item.title} body={item.body}/>}
        />
    )
}

const styles = StyleSheet.create({
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
      notificationProp: {
        borderWidth: 2,
        width: "85%",
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
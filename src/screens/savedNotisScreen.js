import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { firebase } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SavedNotificationItem = (props) => {
    const navigation = useNavigation()

    const handlePress = (title, body) => {
        navigation.navigate('Send', {
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
            <TouchableOpacity>
                <Ionicons name="trash-bin" size={20} color="red" />
            </TouchableOpacity>
        </View>
    )
}

export default function SavedNotisScreen({route}) {
    const [savedNotifications, setSavedNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const ref = firebase.firestore().collection("tokens")

    useEffect(() => {
        const owner = route.params.name;
        ref.where('owner', '==', owner).get().then((querySnapshot) => {
            const notificationsData = [];
    
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const savedNotificationsArray = data.savedNotifications || [];
    
              savedNotificationsArray.forEach((notification) => {
                notificationsData.push(notification);
              });
            });
    
            setSavedNotifications(notificationsData);
            setIsLoading(false)
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setIsLoading(false)
          });
      }, []);

    return (isLoading) ? (<Text>Loading...</Text>):( 
        <FlatList 
            data={savedNotifications}
            renderItem={({item}) => <SavedNotificationItem title={item.title} body={item.body}/>}
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
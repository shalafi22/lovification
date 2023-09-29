import { View, StyleSheet, Text, Image, TouchableOpacity  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
    return(
        <SafeAreaView style={styles.wrapper}>
            <View style={{height: "40%", elevation: 15, borderRadius: 12, width: "100%"}}>
                <Text style={{fontWeight: "bold", fontSize: 24, alignSelf: "center", paddingTop: 20}}>Welcome to Lovification!!!</Text>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{height: "100%", borderRadius: 12, position: "absolute", top: 0, left: 0, width: "100%", zIndex: -5}}
                    locations={[0.16, 0.26, 0.35, 0.38, 0.42, 0.55, 0.58, 0.62, 0.65, 0.74, 0.84]}
                    colors={['#869ec4', '#7193e4', "#5382df", "#5784dd", "#5a86dc", "#4c7ee1", "#5a86dc", "#5784dd", "#5382df", "#7193d4", "#869ec4"]}>
                    <Text style={{padding: 20}}></Text>
                </LinearGradient>
                <Image style={{position: "absolute", right: "5%", top: "38%"}} source={require("../../assets/penguin.png")} />
                <Image style={{position: "absolute", left: "5%", top: "38%", transform: [{scaleX : -1}]}} source={require("../../assets/penguin.png")} />
                <Image style={{position: "absolute", top: "38%", right: "15%"}} source={require("../../assets/plane-line.png")} />
                <View style={styles.textContainer}>
                    <Text>
                    Spam your Bibi/Bubu with custom lovifications! (because texting just doesn’t quite cut it)
                    </Text>
                </View>
                </View>
                <View style={styles.notificationProp}>
                    <View style={{width: "100%", borderWidth: 2, borderRadius: 15}}>
                        <View style={[styles.row, {paddingLeft: 20}]}>
                            <Image style={{width: 30, height: 30, marginLeft: -5}} source={require('../../assets/prop-icon.png')} />
                            <Text style={styles.notificationAppText}>lovification</Text>
                        </View>
                        <Text style={styles.titleTextInp} >Your pairing code is:</Text>
                        <Text style={styles.bodyTextInp}>19092003</Text>

                    </View>
                </View>
                <View style={styles.notificationProp}>
                    <View style={{width: "100%", borderWidth: 2, borderRadius: 15}}>
                        <View style={[styles.row, {paddingLeft: 20}]}>
                            <Image style={{width: 30, height: 30, marginLeft: -5}} source={require('../../assets/prop-icon.png')} />
                            <Text style={styles.notificationAppText}>lovification</Text>
                        </View>
                        <Text style={styles.titleTextInp} >Enter your partner's code:</Text>
                        <Text style={styles.bodyTextInp}>19082003</Text>

                    </View>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={{fontSize: 24}}>Access</Text>
                </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles= StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#eaedf6",
        alignItems: "center",
        paddingTop: 26, 
        paddingHorizontal: 10
    },
    textContainer: {
        width: "90%", 
        alignSelf: "center", 
        backgroundColor: "#c6def1", 
        elevation: 10, 
        borderRadius: 12, 
        padding: 10, 
        position: "absolute", 
        bottom: "10%", 
        zIndex: -4
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
      notificationProp: {
        marginVertical: 20,
        borderWidth: 2,
        width: "100%",
        borderColor: "#eaeaea",
        backgroundColor: "white",
        borderRadius: 25,
        marginBottom: 5,
      },
      row: {
        flexDirection: "row",
        alignItems: "center"
      },
      bodyTextInp: {
        width: "100%",
        marginBottom: 8,
        paddingLeft: 20,
        color: "black",
      },
      button: {
        padding: 10,
        backgroundColor: "#4c7ee1",
        elevation: 15,
        borderRadius: 12
      },
})
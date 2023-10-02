import { useState, useEffect } from "react"
import { Text, View, StyleSheet, TouchableOpacity} from "react-native"

const ButtonContainer = (props) => {
    const [buttons, setButtons] = useState([{"title": "", "body": "", "color": "grey", "name": "XXX"},{"title": "", "body": "", "color": "grey", "name": "XXX"},{"title": "", "body": "", "color": "grey", "name": "XXX"},{"title": "", "body": "", "color": "grey", "name": "XXX"}, {"title": "", "body": "", "color": "grey", "name": "XXX"}, {"title": "", "body": "", "color": "grey", "name": "XXX"}])


    const presetChangeNoti = (title, body) => {
        props.updateTitle(title)
        props.updateBody(body)
    }

    useEffect(() => {
        let buttonsTemp = [...props.presets]
        while (buttonsTemp.length < 6) {
            buttonsTemp.push({"title": "", "body": "", "color": "grey", "name": "XXX"})
        }
        setButtons(buttonsTemp)
    }, [])


    return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => {presetChangeNoti(buttons[0].title, buttons[0].body)}} style={[styles.button,{backgroundColor: buttons[0].color}]}><Text style={styles.buttonText}>{buttons[0].name}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {presetChangeNoti(buttons[1].title, buttons[1].body)}} style={[styles.button,{backgroundColor: buttons[1].color}]}><Text style={styles.buttonText}>{buttons[1].name}</Text></TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => {presetChangeNoti(buttons[2].title, buttons[2].body)}} style={[styles.button,{backgroundColor: buttons[2].color}]}><Text style={styles.buttonText}>{buttons[2].name}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {presetChangeNoti(buttons[3].title, buttons[3].body)}} style={[styles.button,{backgroundColor: buttons[3].color}]}><Text style={styles.buttonText}>{buttons[3].name}</Text></TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => {presetChangeNoti(buttons[4].title, buttons[4].body)}} style={[styles.button,{backgroundColor: buttons[4].color}]}><Text style={styles.buttonText}>{buttons[4].name}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {presetChangeNoti(buttons[5].title, buttons[5].body)}} style={[styles.button,{backgroundColor: buttons[5].color}]}><Text style={styles.buttonText}>{buttons[5].name}</Text></TouchableOpacity>
                </View>
            </View>        
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 10
    },
    button: {
        borderRadius: 15,
        width: "40%",
        paddingVertical: 20,
        alignItems: "center",
        elevation: 5
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold"
    },
})

export default ButtonContainer;
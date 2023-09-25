import { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native";
import ColorBox from "./ColorBox";

export default function SavePresetModal(props) {
    const [name, setName] = useState("")
    const [colorArray, setColorArray] = useState([true, false, false, false, false, false])
    const [colorCodesArray, setColorCodesArray] = useState(["red", "navy", "grey", "lightblue", "lightgreen", "pink"])

    const modifyArray = (index) => {
        if (!colorArray[index]) {
            let newArray = [false, false, false, false, false, false]
            newArray[index] = true
            setColorArray(newArray)
        }
    }

    const handleSave = () => {
        if (name === "") {
            alert("Give a name to your preset")
        } else {
            const idx = colorArray.indexOf(true);
            props.saveAsPreset(props.title, props.body, colorCodesArray[idx], name)
            setName("")
        }
    }
    return(
        <Modal transparent={true} visible={props.visible} animationType="fade">
            <TouchableOpacity onPress={props.handleModalClose} activeOpacity={1} style={[styles.modalContainer, {backgroundColor: 'rgba(52, 52, 52, 0.8)'}]}>
                <TouchableOpacity style={styles.container} activeOpacity={1}>
                    <Text style={{fontSize: 22, fontWeight: "600"}}>Save to Main Page:</Text>
                    <View style={styles.row}>
                        <Text>Name:</Text>
                        <TextInput value={name} onChangeText={setName} style={{borderBottomWidth: 2, width: "80%", marginLeft: 5}}/>
                    </View>
                    <View style={[styles.row, {paddingTop: 10, alignSelf: "center", justifyContent: "space-evenly", width: "100%"}]}>
                        <ColorBox color={colorCodesArray[0]} idx={0} selected={colorArray[0]} modifyArray={modifyArray}/>
                        <ColorBox color={colorCodesArray[1]} idx={1} selected={colorArray[1]} modifyArray={modifyArray}/>
                        <ColorBox color={colorCodesArray[2]} idx={2} selected={colorArray[2]} modifyArray={modifyArray}/>
                        <ColorBox color={colorCodesArray[3]} idx={3} selected={colorArray[3]} modifyArray={modifyArray}/>
                        <ColorBox color={colorCodesArray[4]} idx={4} selected={colorArray[4]} modifyArray={modifyArray}/>
                        <ColorBox color={colorCodesArray[5]} idx={5} selected={colorArray[5]} modifyArray={modifyArray}/>
                    </View>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={{fontSize: 20, fontWeight: "600"}}>Save</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    container: {
        padding: 10,
        backgroundColor: "#ffffff",
        width: "90%",
        borderColor: "#bababa",
        borderRadius: 15,
        bottom: "10%"
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    saveButton: {
        alignSelf: "center", 
        marginTop: 10, 
        padding: 10, 
        borderRadius: 15, 
        borderWidth: 1, 
        borderColor: "yellow", 
        elevation: 5, 
        backgroundColor: "yellow"
    }
})
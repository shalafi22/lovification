import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ColorBox(props) {
    const boxStyle = {
        backgroundColor: props.color
    }
    const containerStyle = {
        borderWidth: 2,
        borderColor: (props.selected) ? "black" : "white"
    }
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => {props.modifyArray(props.idx)}} style={[styles.container, containerStyle]}>
            <View style={[styles.box, boxStyle]}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        elevation: 5,
    },
    box: {
        width: 36,
        height: 36,
        borderRadius: 5,
        elevation: 5
    }
})
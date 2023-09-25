import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ColorBox(props) {
    const boxStyle = {
        backgroundColor: props.color
    }
    const containerStyle = {
        borderWidth: 1,
        borderColor: (props.selected) ? "black" : "white"
    }
    return (
        <TouchableOpacity onPress={() => {props.modifyArray(props.idx)}} style={[styles.container, containerStyle]}>
            <View style={[styles.box, boxStyle]}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        padding: 2,
        
    },
    box: {
        width: 24,
        height: 24,
        borderRadius: 5
    }
})
import { Moda, TouchableOpacity, StyleSheet } from "react-native";

export default function EditPresetsModal(props) {
    return (
        <Modal visible={props.visible} transparent={true} animationType="fade">
            <TouchableOpacity onPress={props.handleModalClose} activeOpacity={1} style={[styles.modalContainer, {backgroundColor: 'rgba(52, 52, 52, 0.8)'}]}>
                <TouchableOpacity activeOpacity={1} >

                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {

    },
})
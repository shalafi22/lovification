import { TextInput, Text, View, Image, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

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
              <TouchableOpacity style={[styles.iconRow, {backgroundColor: "#ffabab"}]} onPress={() => {props.handleDelete(props.title, props.body)}}>
                  <Image style={{height: 30, width: 30}} source={require("../../assets/modal-delete.png")} />
                  <Text style={{paddingLeft: 10}}>Delete Notification</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {props.handleSaveChanges(props.title, props.body, titleTemp, bodyTemp)}} style={[styles.iconRow, {backgroundColor: "#c1fd9b"}]}>
                <Image style={{height: 30, width: 30}} source={require("../../assets/modal-save-as.png")} />
                  <Text style={{paddingLeft: 10}}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconRow, {backgroundColor: "#fdffaa"}]} onPress={() => {props.handleSavePreset()}}>
                  <Image style={{height: 30, width: 30}} source={require("../../assets/modal-save-preset.png")} />
                  <Text style={{paddingLeft: 10}}>Save Notification as Preset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {props.handleSendPress(props.title, props.body)}} style={[styles.iconRow, {backgroundColor: "#aefef9"}]}>
                  <Image style={{height: 30, width: 30}} source={require("../../assets/modal-send.png")} />
                  <Text style={{paddingLeft: 10}}>Send Notification</Text>
              </TouchableOpacity>
            </View>
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
      iconRow: {
        width: "90%",
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "black",
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
        borderColor: "black",
        backgroundColor: "white",
        borderRadius: 15,
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
        paddingRight: 5,
        color: "black",
      },
})

  export default ActionModal;
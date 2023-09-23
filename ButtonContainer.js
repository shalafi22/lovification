import { Text, View, StyleSheet, TouchableOpacity} from "react-native"

const ButtonContainer = (props) => {
    const presetChangeNoti = (type) => {
        if (type === "wotur") {
            props.updateTitle("Su Hatırlatması!!")
            props.updateBody("Su içtin mi?? Su iç!!")
        } else if (type === "missed") {
            props.updateTitle("Özlendin!!")
            props.updateBody("Gle bura ösledm")
        } else if (type === "lookie") {
            props.updateTitle("BAKİM!!")
            props.updateBody("Kim izin verdi?? Bakim!!")
        } else if (type === "pingu") {
            props.updateTitle("Bu ne hal?")
            props.updateBody("Pingu Musun??")
        } else if (type === "attention") {
            props.updateTitle("ÖLCEMM")
            props.updateBody("Biraz daha ilgi görmezsem ölcem...")
        }
    }
    return (
        (props.name ==="bibi" ? (
            <View style={styles.container}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => {presetChangeNoti("attention")}} style={[styles.button,{backgroundColor: "crimson"}]}><Text style={styles.buttonText}>ACİL İLGİ</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {presetChangeNoti("missed")}} style={[styles.button,{backgroundColor: "aqua"}]}><Text style={styles.buttonText}>Ösledimmm</Text></TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => {presetChangeNoti("lookie")}} style={[styles.button,{backgroundColor: "lightgoldenrodyellow"}]}><Text style={styles.buttonText}>Bakim</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {presetChangeNoti("pingu")}} style={[styles.button,{backgroundColor: "slategray"}]}><Text style={styles.buttonText}>Pingu Musun?</Text></TouchableOpacity>
                </View>
            </View>
        ) : (
            <View style={styles.container}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => {presetChangeNoti("wotur")}} style={[styles.button,{backgroundColor: "aqua"}]}><Text style={styles.buttonText}>Wotur İç</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {presetChangeNoti("missed")}} style={[styles.button,{backgroundColor: "crimson"}]}><Text style={styles.buttonText}>Ösledimmm</Text></TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => {presetChangeNoti("lookie")}} style={[styles.button,{backgroundColor: "lightgoldenrodyellow"}]}><Text style={styles.buttonText}>Bakim</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {presetChangeNoti("pingu")}} style={[styles.button,{backgroundColor: "slategray"}]}><Text style={styles.buttonText}>Pingu Musun?</Text></TouchableOpacity>
                </View>
            </View>
        ))
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
//acil ilgi, bakim, wotur iç, pingu musun, ösledim

export default ButtonContainer;
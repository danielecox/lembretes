import React from 'react'
import {StyleSheet,Text,View} from 'react-native'

const Cabecalho = (props)=>{

    return(
        <View>
            <Text style={styles.cabecalho} >{props.titulo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cabecalho:{
        fontSize:20,
        paddingTop: 35,
        backgroundColor:'#007acc',
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold'
    }
})
export default Cabecalho
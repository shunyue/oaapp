/**
 * Created by Administrator on 2017/6/7.
 * 选择客户
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableHighlight,
    ScrollView,
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";

const screenW = Dimensions.get('window').width;
export default class Info extends Component {
    OpBack() {
        this.props.navigation.goBack(null)
    }
    goPage_choseCustomer(){
        this.props.navigation.navigate('ChoseCustomer')
    }
    render() {
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text  style={{color:'#333',fontSize:16}}>选择客户</Text>
                    <TouchableOpacity style={[styles.goRight,styles.go]} onPress={()=>this.goPage_choseCustomer()}>
                        <Text  style={styles.back_text}>新增客户</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(text) => {this.setState({text:text});this.show(text)}}
                            placeholder ={'搜索'}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            autoFocus={true}
                            selectTextOnFocus={true}
                            />
                    </View>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={{height:40,justifyContent:'center',marginLeft:15}}
                        onPress={()=>{}}
                        >
                        <Text>取消</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                    <View style={{backgroundColor:'#fff',height:35,justifyContent:'center',paddingLeft:15,borderColor:'#ccc',borderBottomWidth:1}}>
                        <Text style={{color:'#333'}}>张三</Text>
                    </View>
                    <View style={{backgroundColor:'#fff',height:35,justifyContent:'center',paddingLeft:15,borderColor:'#ccc',borderBottomWidth:1}}>
                        <Text style={{color:'#333'}}>李四</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    container: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'center',

    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:15,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    search_bj:{
        backgroundColor:'#ddd',
        height:44,
        width:screenW,
        flexDirection:'row',
        alignContent:'center',
    },
    search_border:{
        width:screenW*0.82,
        height:28,
        backgroundColor:'#fff',
        marginLeft:8,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.8,
        padding:0,
    },
});
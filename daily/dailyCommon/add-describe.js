/**
 * Created by Administrator on 2017/6/7.
 * 描述
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableHighlight,
    DeviceEventEmitter
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;

export default class AddDescribe extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
       let {params} = this.props.navigation.state;
        this.state = {
            content:params.describe.content
        };
      }
    OpBack() {
        DeviceEventEmitter.emit('visitDescibe',this.state.content);
        this.props.navigation.goBack(null);
    }
    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight
                        underlayColor={'#fff'}
                        style={[styles.goback,styles.go]}
                        onPress={()=>this.OpBack()}>
                        <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>{params.describe.title}描述</Text>
                    <TouchableHighlight
                        underlayColor={'#fff'}
                        style={[styles.goRight,styles.go]}
                        onPress={()=>this.OpBack()}
                        >
                        <Text>确定</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.follow}>
                    <TextInput
                        style={styles.input_text}
                        onChangeText={(content) => this.setState({content})}
                        placeholder={"说点什么..."}
                        value={this.state.content}
                        placeholderTextColor={"#aaaaaa"}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        autoFocus={true}
                        />
                </View>
                {/*  <TouchableHighlight underlayColor={'#fff'} style={{padding:11,alignItems:'flex-end',borderColor:'#d5d5d5',borderBottomWidth:1}}>
                    <Image tintColor={'#e15151'} style={styles.back_icon} source={require('../imgs/customer/business/sound.png')}/>
                </TouchableHighlight>*/}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#eee',
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
        marginTop: 1
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16,
        color:'#333'
    },
    follow:{
        marginTop:8,
        backgroundColor:'#fff',
        borderColor:'#d5d5d5',
        borderWidth:1,
    },
    border:{
        borderColor:'#d5d5d5',
        borderBottomWidth:1,
    },
    follow_p:{
        flexDirection:'row',
        alignItems:'center',
        padding:5
    },
    input_text:{
        width:screenW,
        height:200,
        textAlignVertical:'top',
    },
});
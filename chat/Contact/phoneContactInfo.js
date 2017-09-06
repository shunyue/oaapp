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
    ScrollView,
    TouchableHighlight,
    DeviceEventEmitter,
    Linking
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';
import com from '../../public/css/css-com';
var Contacts = require('react-native-contacts');
const screenW = Dimensions.get('window').width;
export default class PhoneContactInfo extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            contactInfo:[],
            contactArr:[]
        };
    }
    OpBack() {
        this.props.navigation.goBack(null)
    }
    callPhone(number){//调用打电话的接口
        return Linking.openURL('tel:' + number)
    }
    sendMessage(number){//发短信的接口
        return Linking.openURL('sms:' + number)
    }

    render() {
        let  {params}=this.props.navigation.state;
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>个人资料</Text>
                </View>
                <ScrollView>
                    <View style={[{backgroundColor:'#fff',justifyContent:'space-between',},styles.flex_row,styles.borderBottom,styles.borderTop]}>
                            <View style={[{width:screenW,flexDirection:'row',paddingTop:10,paddingBottom:10}]}>
                                {/* <Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}
                                 source={require('../imgs/customer/headPortrait.png')}/>*/}
                                {(params.contactInfo.hasPic == false) ? (
                                    <Image
                                        style={{width:40,height:40,marginLeft:10,marginRight:10,borderRadius: 200}}
                                        source={require('../../imgs/tx.png')}/>
                                ) : (<Image
                                    style={{width:40,height:40,marginLeft:10,marginRight:10,borderRadius: 200}}
                                    source={{uri:params.contactInfo.picPath}}/>)}
                                <View>
                                    <Text style={{color:'#333'}}>{params.contactInfo.name}</Text>
                                    <Text style={{marginTop:2,fontSize:12}}>{params.contactInfo.number}</Text>
                                </View>
                            </View>
                        <View style={{position:'absolute',top:20,right:40,flexDirection:'row'}}>
                            <TouchableHighlight underlayColor={'#fff'}
                                             onPress={()=>{this.sendMessage(params.contactInfo.number)}}>
                                <Image style={{width:24,height:24,marginRight:15}} tintColor={'#e15151'}
                                   source={require('../../imgs/customer/message.png')}/>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={'#fff'}
                                                onPress={()=>{this.callPhone(params.contactInfo.number)}}>
                                <Image style={{width:20,height:20}} tintColor={'#e15151'}
                                   source={require('../../imgs/customer/phone.png')}/>
                            </TouchableHighlight>
                        </View>
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
        marginLeft:2
    },
    formHeader:{
        fontSize:16
    },
    sure:{
        fontSize:16
    },
    search:{
        width:screenW*0.95,
        height:30,
        backgroundColor:'#fff',
        justifyContent:'center',
        margin:screenW*0.02,
        borderRadius:7,
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:25,
        height:25,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.7,
        height:28,
        padding:0,
    },
    borderBottom:{
        borderBottomWidth:0.5,
        borderColor:'#ccc'
    },
    borderTop:{
        borderTopWidth:0.5,
        borderColor:'#ccc'
    },
    flex_row :{
        flexDirection:'row',
        alignItems:'center',
    },
    departLevel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 6,
    },
    departText: {
        fontSize: 14,
        marginLeft: 10
    },

});
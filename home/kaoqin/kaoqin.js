/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    Modal,
    TextInput,
    } from 'react-native';
import Header from '../../common/header';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
export default class KaoQin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qiandao: false,
            qiantui: false,
        };
    }
    render() {
        const {navigate}=this.props.navigation
        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = {"考勤"}
                    />
                <View>
                    <View style={[{height:35,backgroundColor:'#fff',justifyContent:'space-between'},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                        <View>
                            <Text style={{color:'#333',fontSize:15}}>9月15日&nbsp;&nbsp;星期五</Text>
                        </View>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            onPress={()=>{navigate('KaoQinHistory')}}
                            >
                            <View style={styles.flex_row}>
                                <Text>排班计划和历史记录</Text>
                                <Image style={{width:10,height:10,marginLeft:5}}
                                       source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{alignItems:'center',backgroundColor:'#fff'}}>
                        <View style={{width:Width*0.8,borderColor:'#e5e5e5',borderWidth:1,borderRadius:5,height:Height*0.6,marginTop:40,alignItems:'center',}}>
                            <View style={{height:Height*0.6-70}}>
                                <View style={styles.qianBK}>
                                    <Text style={{fontSize:25}}>未开始签到</Text>
                                    <View style={styles.flex_row}>
                                        <Image style={{width:14,height:14,marginRight:5}}
                                               source={require('../../imgs/customer/time.png')}/>
                                        <Text>签到时间09:00</Text>
                                    </View>
                                </View>
                                <View style={styles.qianBK}>
                                    <Text style={{fontSize:25}}>未开始签退</Text>
                                    <View style={styles.flex_row}>
                                        <Image style={{width:14,height:14,marginRight:5}}
                                               source={require('../../imgs/customer/time.png')}/>
                                        <Text>签到时间18:00</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[{width:Width*0.8,marginTop:20,justifyContent:'center'},styles.flex_row]}>
                                <TouchableHighlight
                                    underlayColor={'#e14151'}
                                    onPress={() => { this.setState({qiandao: !this.state.qiandao})}}
                                    style={[styles.qian,{ backgroundColor:'#e15151',marginRight:3}]}
                                    >
                                        <Text style={{color:'#fff'}}>签到</Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    underlayColor={'#3388ff'}
                                    onPress={() => { this.setState({qiantui: !this.state.qiantui})}}
                                    style={[styles.qian,{backgroundColor:'#3399ff',marginLeft:3}]}>
                                    <Text style={{color:'#fff'}}>签退</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
                {/* 签到*/}
                <View>
                    <Modal
                        backdropOpacity={0}
                        transparent={true}
                        animationType={"fade"}
                        visible={this.state.qiandao}
                        onRequestClose={() => { this.setState({qiandao: !this.state.qiandao})}}
                        >
                        <View style={{width:Width,height:Height,backgroundColor:'#000',opacity:0}}>
                            <TouchableOpacity style={{flex:1,height:Height}} onPress={() => {this.setState({qiandao: !this.state.qiandao})}}></TouchableOpacity>
                        </View>
                        <View style={{position: 'absolute',width:Width,height:Platform.OS==='ios'?Height-95:Height-75,backgroundColor:'#fff',top:Platform.OS==='ios'?95:75}}>
                           <View style={[{height:40,paddingLeft:15,paddingRight:15,marginTop:10},styles.flex_row,styles.border_bottom]}>
                               <Image style={{width:20,height:20,marginRight:30}}
                                      source={require('../../imgs/customer/dingwei.png')}/>
                               <Text>点击识别你的位置</Text>
                           </View>
                            <View style={[{height:50,paddingLeft:15,paddingRight:15,justifyContent:'center'},styles.border_bottom]}>
                                <Text style={{color:'#333',fontSize:15}}>15:19:01</Text>
                                <Text style={{fontSize:12}}>9月15日 星期五</Text>
                            </View>
                            <View style={[{height:50,paddingLeft:15,paddingRight:15,justifyContent:'space-between'},styles.flex_row,styles.border_bottom]}>
                                <Text style={{fontSize:13}}>拍照</Text>
                                <Image style={{width:20,height:20,tintColor:'#666'}}
                                       source={require('../../imgs/customer/camera.png')}/>
                            </View>
                            <View style={[{height:50,paddingLeft:15,paddingRight:15},styles.flex_row]}>
                                <TextInput
                                    placeholder={'可填写备注'}
                                    underlineColorAndroid={"transparent"}
                                    placeholderTextColor ={"#A2A2A2"}
                                    onChangeText={(t)=>{}}
                                    multiline={true}
                                    style={styles.inputStyle}
                                    />
                            </View>
                            <TouchableHighlight
                                underlayColor={'#e14151'}
                                onPress={() => { this.setState({qiandao: !this.state.qiandao})}}
                                style={{width:Width-30,marginLeft:15,height:30,alignItems:'center',justifyContent:'center',backgroundColor:'#e15151',marginTop:Height*0.1}}>
                                <Text style={{color:'#fff'}}>立即签到</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>
                </View>
                {/* 签退*/}
                <View>
                    <Modal
                        backdropOpacity={0}
                        transparent={true}
                        animationType={"fade"}
                        visible={this.state.qiantui}
                        onRequestClose={() => { this.setState({qiantui: !this.state.qiantui})}}
                        >
                        <View style={{width:Width,height:Height,backgroundColor:'#000',opacity:0}}>
                            <TouchableOpacity style={{flex:1,height:Height}} onPress={() => {this.setState({qiantui: !this.state.qiantui})}}></TouchableOpacity>
                        </View>
                        <View style={{position: 'absolute',width:Width,height:Platform.OS==='ios'?Height-95:Height-75,backgroundColor:'#fff',top:Platform.OS==='ios'?95:75}}>
                            <View style={[{height:40,paddingLeft:15,paddingRight:15,marginTop:10},styles.flex_row,styles.border_bottom]}>
                                <Image style={{width:20,height:20,marginRight:30}}
                                       source={require('../../imgs/customer/dingwei.png')}/>
                                <Text>点击识别你的位置</Text>
                            </View>
                            <View style={[{height:50,paddingLeft:15,paddingRight:15,justifyContent:'center'},styles.border_bottom]}>
                                <Text style={{color:'#333',fontSize:15}}>15:19:01</Text>
                                <Text style={{fontSize:12}}>9月15日 星期五</Text>
                            </View>
                            <View style={[{height:50,paddingLeft:15,paddingRight:15,justifyContent:'space-between'},styles.flex_row,styles.border_bottom]}>
                                <Text style={{fontSize:13}}>拍照</Text>
                                <Image style={{width:20,height:20,tintColor:'#666'}}
                                       source={require('../../imgs/customer/camera.png')}/>
                            </View>
                            <View style={[{height:50,paddingLeft:15,paddingRight:15},styles.flex_row]}>
                                <TextInput
                                    placeholder={'可填写备注'}
                                    underlineColorAndroid={"transparent"}
                                    placeholderTextColor ={"#A2A2A2"}
                                    onChangeText={(t)=>{}}
                                    multiline={true}
                                    style={styles.inputStyle}
                                    />
                            </View>
                            <TouchableHighlight
                                underlayColor={'#3388ff'}
                                onPress={() => { this.setState({qiantui: !this.state.qiantui})}}
                                style={{width:Width-30,marginLeft:15,height:30,alignItems:'center',justifyContent:'center',backgroundColor:'#3399ff',marginTop:Height*0.1}}>
                                <Text style={{color:'#fff'}}>立即签退</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    border_top:{
        borderTopWidth:1,
        borderColor:'#ccc'
    },
    border_bottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    flex_row:{
        flexDirection:'row',
        alignItems:'center'
    },
    paddingLR:{
        paddingLeft:15,
        paddingRight:15
    },
    qian:{
        width:Width*0.4-10,
        height:30,
        alignItems:'center',
        justifyContent:'center'
    },
    qianBK:{
        borderColor:'#ddd',
        borderWidth:1,
        height:Height*0.2,
        width:Width*0.65,
        marginTop:20,
        alignItems:'center',
        justifyContent:'center'
    },
    inputStyle:{
        padding:0,
        width:Width-30
    }
});

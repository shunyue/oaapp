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
    ScrollView,
    } from 'react-native';
import Header from '../../common/header';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
export default class Page extends Component {
    render() {
        const {navigate}=this.props.navigation
        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = {"排班计划和历史记录"}
                    />
                <View>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        onPress={()=>{navigate('History')}}
                        >
                        <View style={[{height:35,backgroundColor:'#fff',justifyContent:'space-between'},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                            <Text>历史记录</Text>
                            <Image style={{width:12,height:12,marginLeft:5}}
                                   source={require('../../imgs/customer/arrow_r.png')}/>
                        </View>
                    </TouchableHighlight>
                    <View style={[{height:30,},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                        <Text>排班计划</Text>
                    </View>
                    <ScrollView style={{height:Platform.OS==='ios'?Height-120:Height-130}}>
                        <View style={{backgroundColor:'#fff'}}>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:10}}>
                                    <Text style={{color:'#333'}}>明天</Text>
                                    <Text style={{color:'#333'}}>星期六</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:10}}>
                                    <Text style={{color:'#333'}}>2017-09-17</Text>
                                    <Text style={{color:'#333'}}>星期日</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:10}}>
                                    <Text style={{color:'#333'}}>2017-09-18</Text>
                                    <Text style={{color:'#333'}}>星期一</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:10}}>
                                    <Text style={{color:'#333'}}>2017-09-19</Text>
                                    <Text style={{color:'#333'}}>星期二</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:20}}>
                                    <Text style={{color:'#333'}}>2017-09-20</Text>
                                    <Text style={{color:'#333'}}>星期san</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:20}}>
                                    <Text style={{color:'#333'}}>2017-09-20</Text>
                                    <Text style={{color:'#333'}}>星期san</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:20}}>
                                    <Text style={{color:'#333'}}>2017-09-20</Text>
                                    <Text style={{color:'#333'}}>星期san</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:20}}>
                                    <Text style={{color:'#333'}}>2017-09-20</Text>
                                    <Text style={{color:'#333'}}>星期san</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:20}}>
                                    <Text style={{color:'#333'}}>2017-09-20</Text>
                                    <Text style={{color:'#333'}}>星期san</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                            <View style={[{height:50},styles.border_bottom,styles.flex_row,styles.paddingLR]}>
                                <View style={{width:Width*0.25,alignItems:'center',justifyContent:"center",marginRight:20}}>
                                    <Text style={{color:'#333'}}>2017-09-20</Text>
                                    <Text style={{color:'#333'}}>星期san</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#333'}}>考勤：09:00-18:00</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

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
    }
});

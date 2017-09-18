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
    ScrollView,
    } from 'react-native';
import moment from 'moment';
import Header from '../../common/header';
import Picker from 'react-native-picker';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
export default class History extends Component {
    OpBack() {
        this.props.navigation.goBack(null)
    }
    _showYearPicker() {
        var month = [];
        for(var i = 1;i<13;i++) {
            month.push(i+'月');
        }
        let year = [];
        let year1 = moment().format("YYYY");
        for(var i=2010;i<year1+1;i++){
            year.push(i);
        }
        var pickerData = [
            year,month
        ]
        var valuePickerData=[moment().format("YYYY"),moment().format("M月")]
        Picker.init({
            pickerData:pickerData ,
            pickerTitleText: '选择时间',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            selectedValue:valuePickerData,
            onPickerConfirm: data => {
                this.setState({yearMonth:data[1]+'年'+data[2]});
            },
        });
        Picker.show();
    }
    _hide(){
        Picker.hide();
    }
    render() {
        const {navigate}=this.props.navigation
        return (
            <View style={styles.container}>
                <View style={[{height:Platform.OS==='ios'?60:40,justifyContent:'space-between'},styles.flex_row,styles.paddingLR]}>
                    <TouchableOpacity onPress={()=>{this.OpBack()}}>
                        <View style={[{flexDirection:'row',width:60}]}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={{color:'#e15151'}}>返回</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize:16,color:'#333'}}>9月考勤记录</Text>
                    <View style={{width:60}}></View>
                </View>
                <View style={[{height:80},styles.flex_row,styles.paddingLR]}>
                    <View style={{marginRight:10}}>
                        <Image  style={{width:40,height:40}} source={require('../../imgs/customer/headPortrait.png')}/>
                    </View>
                    <View>
                        <Text>张三</Text>
                        <Text>上海顺越</Text>
                    </View>
                </View>
                <View style={[styles.border_top,styles.border_bottom,{flexDirection:'row'}]}>
                    <View style={{width:Width*0.2,height:40,borderColor:"#ccc",borderRightWidth:1,alignItems:'center',justifyContent:'center'}}>
                        <Text>0天</Text>
                        <Text style={{fontSize:12}}>按时出勤</Text>
                    </View>
                    <View style={{width:Width*0.2,height:40,borderColor:"#ccc",borderRightWidth:1,alignItems:'center',justifyContent:'center'}}>
                        <Text>0天</Text>
                        <Text style={{fontSize:12}}>缺勤</Text>
                    </View>
                    <View style={{width:Width*0.2,height:40,borderColor:"#ccc",borderRightWidth:1,alignItems:'center',justifyContent:'center'}}>
                        <Text>0天</Text>
                        <Text style={{fontSize:12}}>迟到早退</Text>
                    </View>
                    <View style={{width:Width*0.2,height:40,borderColor:"#ccc",borderRightWidth:1,alignItems:'center',justifyContent:'center'}}>
                        <Text>0天</Text>
                        <Text style={{fontSize:12}}>请假出差</Text>
                    </View>
                    <View style={{width:Width*0.2,height:40,borderColor:"#ccc",borderRightWidth:1,alignItems:'center',justifyContent:'center'}}>
                        <Text>0天</Text>
                        <Text style={{fontSize:12}}>休息</Text>
                    </View>
                </View>
                <ScrollView  style={{height:Platform.OS==='ios'?Height-160:Height-180}}>
                    <View>
                        <View style={[styles.flex_row,{backgroundColor:'#fff'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text>今天</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <View>
                                    <Text style={{fontSize:12}}>考勤签到&nbsp;未签到</Text>
                                    <Text style={{fontSize:12}}>考勤签退&nbsp;未签退</Text>
                                </View>
                                <Text></Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#eee'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月17日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <Text style={{color:'#333'}}>休息</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#fff'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月16日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <Text style={{color:'#333'}}>休息</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#eee'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月15日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <View>
                                    <Text style={{fontSize:12}}>考勤签到&nbsp;10:20</Text>
                                    <Text style={{fontSize:12}}>考勤签退&nbsp;17:30</Text>
                                </View>
                               <View style={{marginLeft:30}}>
                                   <Text style={{fontSize:12,color:'#e15151'}}>迟到</Text>
                                   <Text style={{fontSize:12,color:'#e15151'}}>早退</Text>
                               </View>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#fff'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月14日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <Text style={{color:'#e15151'}}>缺勤</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#eee'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月13日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <View>
                                    <Text style={{fontSize:12}}>考勤签到&nbsp;9:00</Text>
                                    <Text style={{fontSize:12}}>考勤签退&nbsp;18:30</Text>
                                </View>
                                <View style={{marginLeft:30}}>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#fff'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月14日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <Text style={{color:'#e15151'}}>缺勤</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#eee'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月13日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <View>
                                    <Text style={{fontSize:12}}>考勤签到&nbsp;9:00</Text>
                                    <Text style={{fontSize:12}}>考勤签退&nbsp;18:30</Text>
                                </View>
                                <View style={{marginLeft:30}}>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#fff'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月14日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <Text style={{color:'#e15151'}}>缺勤</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#eee'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月13日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <View>
                                    <Text style={{fontSize:12}}>考勤签到&nbsp;9:00</Text>
                                    <Text style={{fontSize:12}}>考勤签退&nbsp;18:30</Text>
                                </View>
                                <View style={{marginLeft:30}}>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#fff'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月14日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <Text style={{color:'#e15151'}}>缺勤</Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row,{backgroundColor:'#eee'}]}>
                            <View style={styles.pStyle}>
                                <View style={{width:5,height:5,borderRadius:5,backgroundColor:'#ccc'}}></View>
                            </View>
                            <View style={{width:Width*0.2,height:40,justifyContent:'center',alignItems:'flex-end',paddingRight:10,borderColor:'#ccc',borderRightWidth:1}}>
                                <Text style={{fontSize:12}}>9月13日</Text>
                            </View>
                            <View style={[styles.flex_row,{height:40,justifyContent:'center',paddingLeft:10}]}>
                                <View>
                                    <Text style={{fontSize:12}}>考勤签到&nbsp;9:00</Text>
                                    <Text style={{fontSize:12}}>考勤签退&nbsp;18:30</Text>
                                </View>
                                <View style={{marginLeft:30}}>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                    <Text style={{fontSize:12,color:'#e15151'}}></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={[styles.border_top,styles.flex_row,{justifyContent:'space-between',paddingLeft:Width*0.15,paddingRight:Width*0.15,height:50}]}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Image  style={{width:18,height:18,tintColor:'#e15151'}} source={require('../../imgs/customer/arrow_l.png')}/>
                        <Text style={{fontSize:12,color:'#e15151'}}>上一月</Text>
                    </View>
                    <TouchableHighlight onPress={this._showYearPicker.bind(this)}>
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                            <Image  style={{width:18,height:18,tintColor:'#e15151'}} source={require('../../imgs/cal.png')}/>
                            <Text style={{fontSize:12,color:'#e15151'}}>选择月份</Text>
                        </View>

                    </TouchableHighlight>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Image  style={{width:18,height:18,tintColor:'#e15151'}} source={require('../../imgs/customer/arrow_rr.png')}/>
                        <Text style={{fontSize:12,color:'#e15151'}}>下一月</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    flex_row:{
        flexDirection:'row',
        alignItems:'center'
    },
    paddingLR:{
        paddingLeft:15,
        paddingRight:15
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 2,
        marginRight:3
    },
    border_bottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    border_top:{
        borderTopWidth:1,
        borderColor:'#ccc'
    },
    pStyle:{
        width:10,
        height:10,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:10,
        position:'absolute',
        top:15,left:Width*0.2-5,
        alignItems:'center',
        justifyContent:'center',
    }
});

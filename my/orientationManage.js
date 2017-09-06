/**
 * Created by Administrator on 2017/7/5.
 * 员工定位管理
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    TextInput,
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";


const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class OrientationManage extends Component {
    OpBack() {
        this.props.navigation.goBack('OrientationManage')
    }
    constructor(props) {
        super(props);

    }
    render(){
        const {navigate} = this.props.navigation;
        const {state} = this.props.navigation;

        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>{state.params.title}</Text>
                </View>
                <View style={[styles.borderBottom,styles.borderColor,]}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={() => { navigate('Myself',{ title: '考勤管理'});}}>
                        <View style={[styles.common,styles.spaceBetween,styles.padding]}>
                            <View style={[styles.common]}>
                                <Image style={{width:35,height:35,}} source={require('../imgs/my/company_1.png')}/>
                                <View style={{marginLeft: 10}}>
                                    <Text style={{color:'#333'}}>定位分组</Text>
                                    <Text style={{fontSize:12}}>配置定位人员、配置列表</Text>
                                </View>
                            </View>
                            <Image style={[styles.arrow_r]} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={[styles.borderBottom,styles.borderColor,]}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={() => { navigate('Myself',{ title: '考勤管理'});}}>
                        <View style={[styles.common,styles.spaceBetween,styles.padding]}>
                            <View style={[styles.common]}>
                                <Image style={{width:35,height:35,}} source={require('../imgs/my/company_1.png')}/>
                                <View style={{marginLeft: 10}}>
                                    <Text style={{color:'#333'}}>电子围栏</Text>
                                    <Text style={{fontSize:12}}>配置定位员工的定位范围</Text>
                                </View>
                            </View>
                            <Image style={[styles.arrow_r]} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={[styles.borderBottom,styles.borderColor,]}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={() => { navigate('Myself',{ title: '考勤管理'});}}>
                        <View style={[styles.common,styles.spaceBetween,styles.padding]}>
                            <View style={[styles.common]}>
                                <Image style={{width:35,height:35,}} source={require('../imgs/my/company_1.png')}/>
                                <View style={{marginLeft: 10}}>
                                    <Text style={{color:'#333'}}>人员列表</Text>
                                    <Text style={{fontSize:12}}>按员工查看定位配置表</Text>
                                </View>
                            </View>
                            <Image style={[styles.arrow_r]} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </TouchableHighlight>
                </View>
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
        right:15
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

    borderBottom:{
        borderColor:'#ccc',
        borderBottomWidth:1
    },
    borderColor:{
        borderColor:'#ddd',
    },
    arrow_r:{
        width:16,
        height:16,
    },
    spaceBetween:{
        justifyContent:'space-between',
    },
    padding:{
        padding:10,paddingLeft:20,
    },
    common:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#fff'
    },
});

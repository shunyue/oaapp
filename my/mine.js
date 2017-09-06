/**
 * Created by Administrator on 2017/7/3.
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions
    } from 'react-native';
import Header from '../common/header';
export default class Mine extends Component {
    OpBack() {
        this.props.navigation.goBack('Mine');
        //this.props.navigation.navigate('My',{id:this.props.navigation.state.params.id});
    }
    constructor(props) {
        super(props);
    }
    shouye(){
        this.props.navigation.navigate('Set')
    }
    account(){
        this.props.navigation.navigate('AccountSafe',{id:this.props.navigation.state.params.id})
    }
    render() {
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "设置"
                        onPress={()=>this.OpBack()}/>
                <ScrollView style={styles.childContent}>
                    <TouchableOpacity
                        onPress={()=>this.shouye()}
                        >
                        <View style={[styles.border_top,styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35,marginTop:8}]}>
                            <Text style={{fontSize:15,color:'#333'}} >首页设置</Text>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>this.account()}
                        >
                        <View style={[styles.border_top,styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35,marginTop:8}]}>
                            <Text style={{fontSize:15,color:'#333'}} >账号与安全</Text>
                            <View style={[styles.flexRow]}>
                                <Text style={{fontSize:12}} >已保护</Text>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>

                        </View>
                    </TouchableOpacity>
                    <View style={[styles.border_top,{marginTop:8}]}>
                        <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                            <Text style={{fontSize:15,color:'#333'}} >新消息通知</Text>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                            <Text style={{fontSize:15,color:'#333'}} >手动同步</Text>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                            <Text style={{fontSize:15,color:'#333'}} >个性化设置</Text>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                            <Text style={{fontSize:15,color:'#333'}} >系统状态</Text>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                        <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                            <Text style={{fontSize:15,color:'#333'}} >清理储存空间</Text>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>
                    <View style={[styles.flexRow,styles.padding,styles.border_top,styles.border_bottom,{justifyContent:'space-between',height:35,marginTop:8}]}>
                        <Text style={{fontSize:15,color:'#333'}} >关于我们</Text>
                        <View style={[styles.flexRow]}>
                            <Text style={{fontSize:12}} >7.1.1</Text>
                            <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>
                    <View style={[styles.flexRow,styles.border_top,styles.border_bottom,{height:35,justifyContent:'center',marginTop:8}]}>
                        <Text style={{color:'#e15151'}}>退出登录</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    childContent: {//子容器页面级
        flex: 1
        //justifyContent: 'space-between',
    },
    flexRow:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
    },
    flexRow_width:{
        width:screenW*0.25,
        justifyContent:'center',
        alignItems:'center'
    },
    padding:{
        paddingLeft:15,
        paddingRight:15
    },
    border_top:{
        borderTopWidth:1,
        borderColor:'#e8e8e8'
    },
    border_bottom:{
        borderBottomWidth:1,
        borderColor:'#e8e8e8'
    },
});
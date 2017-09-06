/**
 * Created by Administrator on 2015/6/7.
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Switch,
    TouchableOpacity,
    TouchableHighlight,
    DeviceEventEmitter
    } from 'react-native';
import Header from '../../common/header';
const screenW = Dimensions.get('window').width;
export default class app extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            classify: params.classify,
            falseSwitchIsOn:false,
        };
    }
    _classify(position) {
        var list = []
        if(this.state.classify[position]) {
            return ;
        }
        for(var i in this.state.classify) {
            if(i == position ) {
                list.push(!this.state.classify[i])
            }else{
                list.push(false)
            }
        }

        this.setState({
            classify: list
        })
    }
    _confirm() {
        DeviceEventEmitter.emit('remindTime',{classify: this.state.classify,confirm_recept: this.state.falseSwitchIsOn?1:0});
        this.props.navigation.goBack(null)
    }
    render() {
        return (
            <View style={styles.ancestorCon}>
                <Header navigation={this.props.navigation}
                        title="提醒"
                        rightText="确定"
                        onPress={()=>{this._confirm()}}/>
                <TouchableHighlight underlayColor={'transparent'} onPress={()=>this._classify(0)}>
                    <View style={[styles.padding_TB,styles.borderBottom,styles.borderTop,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>不提醒</Text>
                        <Image  style={[this.state.classify[0]?{width:20,height:20}:{display: 'none'},]} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this._classify(1)}>
                    <View style={[styles.borderBottom,styles.borderTop,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>开始工作时间</Text>
                        <Image  style={this.state.classify[1]?{width:20,height:20}:{display: 'none'}} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this._classify(2)}>
                    <View style={[styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>5分钟前</Text>
                        <Image  style={this.state.classify[2]?{width:20,height:20}:{display: 'none'}} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this._classify(3)}>
                    <View style={[styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>15分钟前</Text>
                        <Image  style={this.state.classify[3]?{width:20,height:20}:{display: 'none'}} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this._classify(4)}>
                    <View style={[styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>30分钟前</Text>
                        <Image  style={this.state.classify[4]?{width:20,height:20}:{display: 'none'}} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this._classify(5)}>
                    <View style={[styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>1小时前</Text>
                        <Image  style={this.state.classify[5]?{width:20,height:20}:{display: 'none'}} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this._classify(6)}>
                    <View style={[styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>2小时前</Text>
                        <Image  style={this.state.classify[6]?{width:20,height:20}:{display: 'none'}} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#fff'} onPress={()=>this._classify(7)}>
                    <View style={[styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={{color:'#333',fontSize:15}}>1天前</Text>
                        <Image  style={this.state.classify[7]?{width:20,height:20}:{display: 'none'}} source={require('../../imgs/customer/true.png')}/>
                    </View>
                </TouchableHighlight>
                <View style={[{height:30,paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',}]}>
                    <Text style={{fontSize:13}}>默认使用工作消息提醒</Text>
                </View>
                <View style={[styles.borderBottom,styles.borderTop,{height:40,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                    <Text style={{color:'#333',fontSize:15}}>必达提醒</Text>
                    <Switch
                        onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                        style={{marginBottom:10,marginTop:10}}
                        value={this.state.falseSwitchIsOn} />
                </View>

                {this.state.falseSwitchIsOn &&<View style={[styles.borderBottom,{height:45,backgroundColor:'#fff',paddingLeft:20,paddingRight:20,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}]}>
                    <View>
                        <Text style={{color:'#333',fontSize:15}}>应用内</Text>
                        <Text style={{color:'#333',fontSize:12}}>仅在应用内提醒接收人</Text>
                    </View>
                    <Image  style={{width:20,height:20}} source={require('../../imgs/customer/true.png')}/>
                </View>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },

    place:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'

    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    padding_TB:{
        marginTop:10,
        marginBottom:10
    },
    flex_row:{
        flexDirection:'row',
        alignItems:'center',
    },
});
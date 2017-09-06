
/**
 * Created by Administrator on 2017/6/19.
 * 企业查询
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    WebView,
    ScrollView,
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import Header from '../common/header';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {

    render(){
        const {params} = this.props.navigation.state;

        return (

            <View style={{flex:1,backgroundColor:'#fff'}}>
                <Header navigation = {this.props.navigation}
                        title = "工商信息"
                        source={require('../imgs/customer/slh32.png')}
                        onPress={()=>{}}/>
                <ScrollView>
                    <WebView
                        source={{uri: 'http://link.qichacha.com/open-app-v2/index.html#/search-company/ea201230d6a31e4088aecbee88b171d7/05560740aa175a0bba6e2d567bd41b58/hecom_hongquantong_android_qichacha_token/'+encodeURI(params.name)}}
                        style={{width:screenW,height:screenH,}}
                        />
                </ScrollView>

            </View>
        );
    }
}

/**
 * Created by Administrator on 2017/6/9.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    Text,
    WebView,
    Dimensions,
    TouchableOpacity,
    } from 'react-native';

const {width, height} = Dimensions.get('window');
import Header from '../common/header';
const url = "http://www.qichacha.com/";
export default class WebViewExample extends Component {

    constructor(props) {
        super(props);
    }
    OpBack() {
        this.props.navigation.goBack('WebViewExample')
    };
    render() {
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "企业工商查询"
                        rightText = "关闭"
                        onPress={()=>this.OpBack()}/>
                <WebView
                    style={{width:width,height:height-20,backgroundColor:'#F0F1F2'}}
                    source={{uri:url,method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon: {
        flex: 1,
        backgroundColor: '#F0F1F2',
    },

});


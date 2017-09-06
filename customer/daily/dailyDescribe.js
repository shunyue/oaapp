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
import Header from '../../common/header';
const screenW = Dimensions.get('window').width;

export default class AddDescribe extends Component {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            description: params.description
        };
    }
    _complete() {
        DeviceEventEmitter.emit('workDescription',{des: this.state.description})
        this.props.navigation.goBack(null);
    }

    render() {
        const {state} = this.props.navigation;
        return (

            <View style={styles.ancestorCon}>
                <Header title="会议描述"
                        navigation={this.props.navigation}
                        rightText="确定"
                        onPress={()=>{this._complete()}}/>
                <View style={styles.follow}>
                    <TextInput
                        style={styles.input_text}
                        onChangeText={(description) => this.setState({description})}
                        value={this.state.description}
                        placeholder ={'请输入描述信息'}
                        placeholderTextColor={"#aaaaaa"}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        />
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
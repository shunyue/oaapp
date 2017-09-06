/**
 * Created by Administrator on 2017/6/7.
 * 跟进记录
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
    DeviceEventEmitter,
    } from 'react-native';
import Header from '../common/header';
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            content: null
        };
    }


    _complete() {
        if(!this.state.title) {
            return toast.bottom('跟进的标题不能为空');
        }
        if(!this.state.description) {
            return toast.bottom('跟进的内容不能为空');
        }

        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.addFollowRecord;
        request.post(url, {
            target_id: params.target_id,
            executor: params.user_id,
            title: this.state.title,
            description: this.state.description,
            company_id: params.company_id,
            type: params.type
        }).then((result) => {
            if (result.status == 1) {
                toast.center(result.message);
                if(params.type == 1) {
                    DeviceEventEmitter.emit('loadDaily');
                }else if(params.type == 2) {
                    DeviceEventEmitter.emit('loadFollowRecord');
                }
                this.props.navigation.goBack(null);
            }
        }).catch((error) => {
            toast.bottom('网络连接失败，请检查网络后重试');
        });

    }


    render() {

        return (
            <View style={styles.ancestorCon}>
                <Header navigation={this.props.navigation}
                        title="跟进记录"
                        rightText="提交"
                        onPress={()=>{this._complete()}}/>
                <View style={styles.follow}>
                    <View style={[styles.follow_p,styles.border]}>
                        <Text style={styles.textTitle}>标题</Text>
                        <TextInput
                            placeholder={'请填写名称'}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor ={"#CFCFCF"}
                            onChangeText={(title)=>{this.setState({title})}}
                            style={styles.inputStyle}
                        />
                    </View>
                </View>
                <View style={styles.follow}>
                    <TextInput
                        style={styles.input_text}
                        onChangeText={(description) => this.setState({description})}
                        placeholder ={"请输入描述信息"}
                        placeholderTextColor={"#aaaaaa"}
                        underlineColorAndroid="transparent"
                        multiline={true}
                        autoFocus={true}
                        />

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    inputStyle: {
        textAlign: 'right',
        width: screenW*0.5,
        height: 40
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
        padding:5,
        justifyContent: 'space-between'
    },
    textTitle: {
        marginLeft: 5
    },
    input_text:{
        width:screenW,
        height:150,
        textAlignVertical:'top',
    },
});
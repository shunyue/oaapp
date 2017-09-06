import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    AsyncStorage,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
//引入聊天组件
import { GiftedChat,Bubble } from 'react-native-gifted-chat';
//配置文件
import config from '../common/config';
import request from '../common/request';
import toast from  '../common/toast';
import Header from '../common/header';
import Loading from '../common/loading';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadEarlier: false,
            messages: [],
            //是否和当前对象聊过天
            isChat: false,
            visible: false
        };
        this.onSend = this.onSend.bind(this);
    }

    componentDidMount() {

        this.listener = DeviceEventEmitter.addListener('getChatMessage',()=>this._onReceive());
        this._getChatMsg();

    }

    componentWillUnmount() {
        // 移除监听
        this.listener.remove();

        //获取聊天人的信息放入内存
        if(this.state.isChat) {
            const {params} = this.props.navigation.state;
            var url =config.api.base + config.api.chatLastWord;
            request.post(url,{
                from_user: params.from_user,
                to_user: params.to_user
            }).then((res) => {
                if (res.status == 1) {
                    AsyncStorage.setItem('SP-'+ res.data.id + '-SP',JSON.stringify(res.data));
                    DeviceEventEmitter.emit('getAllUnRead');
                }
            }).catch((error)=> {
                toast.bottom('网络连接失败，请检查网络后重试');
            });
        }
    }
    //获取未读的聊天信息
    _getChatMsg() {
        var url =config.api.base + config.api.getUnRead;
        const {params} = this.props.navigation.state;
        request.post(url,{
            from_user: params.from_user,
            to_user: params.to_user
        }).then((res) => {
            if(res.status == 1) {
                let list = [];
                for (var i in res.data) {
                    list.push(
                        {
                            _id: Math.round(Math.random() * 1000000),
                            text: res.data[i].text,
                            createdAt: new Date(res.data[i].createdAt),
                            user: {
                                _id: res.data[i]._id,
                                name: res.data[i].name,
                                avatar: res.data[i].avatar
                            }
                        }
                    )
                }
                this.setState({
                    messages: list,
                    isChat: true
                })
            }else if(res.status == 2) {
                this.setState({
                    loadEarlier: true
                })
            }
        })
            .catch((error)=> {
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    }


    _onReceive() {
        var url =config.api.base + config.api.getUnRead;
        const {params} = this.props.navigation.state;
        request.post(url,{
            from_user: params.from_user,
            to_user: params.to_user
        }).then((res) => {
            if(res.status == 1) {
                let list = [];
                for (var i in res.data) {
                    list.push(
                        {
                            _id: Math.round(Math.random() * 1000000),
                            text: res.data[i].text,
                            createdAt: new Date(res.data[i].createdAt),
                            user: {
                                _id: res.data[i]._id,
                                name: res.data[i].name,
                                avatar: res.data[i].avatar
                            }
                        }
                    )
                }
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, list)
                    }
                });
                this.setState({
                    isChat: true
                });
            }
        });
    }
    //获取历史聊天信息
    _getHistoryMsg() {
        this.setState({
            visible: true
        });
        var url =config.api.base + config.api.OAChatMsg;
        const {params} = this.props.navigation.state;
        request.post(url,{
            from_user: params.from_user,
            to_user: params.to_user
        }).then((res) => {
            if(res.status == 1) {
                let list = [];
                for (var i in res.data) {
                    list.push(
                        {
                            _id: i,
                            text: res.data[i].text,
                            createdAt: new Date(res.data[i].createdAt),
                            user: {
                                _id: res.data[i]._id,
                                name: res.data[i].name,
                                avatar: res.data[i].avatar
                            }
                        }
                    )
                }
                this.setState({
                    messages: list,
                    loadEarlier: false,
                    visible: false
                });
            }
        }).catch((error)=> {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }

    //发送信息
    onSend(messages = []) {
        const {params} = this.props.navigation.state;
        var url =config.api.base + config.api.sendChatMsg;
        request.post(url,{
            from_user: params.from_user,
            to_user: params.to_user,
            send_date: new Date(),
            message: messages[0].text,
            type: 1,
        }).then((res) => {
            if(res.status == 1) {
                this.setState((previousState) => {
                    return {
                        messages: GiftedChat.append(previousState.messages, messages)
                    };
                });
                this.setState({
                    isChat: true
                });
            }
        })
            .catch((error)=> {
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    }
    //设置
    _chatSetting() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('ChatSetting',{from_user: params.from_user,to_user: params.to_user,company_id:params.company_id,userData: [{id: params.to_user,name: params.name,avatar: params.avatar}]})
    }

    //气泡的样式
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#fff'
                    }
                }}
            />
        );
    }

    render() {
        if(this.state.visible) {
            return <Loading />
        }
        return (
            <View style={styles.container}>
                <Header navigation = {this.props.navigation}
                        title = {this.props.navigation.state.params.name}
                        // source={require('../imgs/chat/kehu.png')}
                        // onPress={()=>{this._chatSetting()}}
                        />
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend}
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={this._getHistoryMsg.bind(this)}
                    renderBubble={this.renderBubble.bind(this)}
                    user={{
                        _id: 1
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBECF0'
    }
});
/**
 * Created by Administrator on 2017/6/7.
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter
    } from 'react-native';
import ScrollableTabView, { DefaultTabBar} from 'react-native-scrollable-tab-view';
//配置文件
import config from '../common/config';
import request from '../common/request';
import toast from  '../common/toast';
import Header from '../common/header';
import Loading from '../common/loading';
const screenW = Dimensions.get('window').width;

export default class app extends Component {
    constructor(props) {
        super(props)
        this.state = {
            waitApply: []
        }
    }
    componentDidMount() {
        this._getApplyNotice();
    }

    _getApplyNotice() {
        var url =config.api.base + config.api.getApplyNotice;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
        }).then((res) => {
            if(res.status == 1) {

                this.setState({
                    waitApply: res.data.waitApply,
                    dealApply: res.data.dealApply
                })
            }

        }).catch((error)=> {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    //处理请求，通过或拒绝
    _dealApply(id,apply_id,status) {
        var url =config.api.base + config.api.dealApplyNotice;
        const {params} = this.props.navigation.state;
        request.post(url,{
            company_id: params.company_id,
            id: id,
            apply_id: apply_id,
            deal_id: params.user_id,
            status: status
        }).then((res) => {
            if(res.status == 1) {
                this.setState({
                    waitApply: res.data.waitApply,
                    dealApply: res.data.dealApply
                });
                DeviceEventEmitter.emit('lastApplyTime');
            }

        }).catch((error)=> {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    render() {
        var waitApply = this.state.waitApply;
        var waitList = [];
        for(var i in waitApply) {
            waitList.push(
                <View style={{marginTop:10}} key={i}>
                    <View style={[styles.borderTop,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,paddingRight:15,paddingTop:5}]}>
                        <View style={[styles.place,styles.borderBottom,{backgroundColor:'#fff',paddingBottom:5}]}>
                            <View>
                                <Text style={{color:'#333'}}>{waitApply[i].apply_name}</Text>
                                <Text>{waitApply[i].apply_tel}</Text>
                            </View>
                            <View style={[styles.place,{justifyContent:'flex-end'}]}>
                                <TouchableWithoutFeedback onPress={this._dealApply.bind(this,waitApply[i].id,waitApply[i].apply_id,2)}>
                                <View style={{width:45,height:20,borderColor:'#aaa',borderWidth:1,borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                                    <Text>拒绝</Text>
                                </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={this._dealApply.bind(this,waitApply[i].id,waitApply[i].apply_id,1)}>
                                <View style={{width:45,height:20,backgroundColor:'#e15151',borderRadius:4,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                                    <Text style={{color:'#fff'}}>同意</Text>
                                </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{paddingBottom:5,paddingTop:3}}>
                            <Text style={{fontSize:12}}>附言：{waitApply[i].message}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        var dealApply = this.state.dealApply;
        var dealList = [];
        for(var i in dealApply) {
            dealList.push(
                <View style={{marginTop:10}} key={i}>
                    <View style={[styles.place,styles.borderTop,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,paddingRight:15,paddingTop:5,paddingBottom:5,alignItems:'flex-start'}]}>
                        <View>
                            <Text style={{color:'#333'}}>{dealApply[i].apply_name}</Text>
                            <Text>{dealApply[i].apply_tel}</Text>
                        </View>
                        <Text>{dealApply[i].name}已{dealApply[i].status == 1? '同意': '拒绝'}</Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title="团队申请"/>
                <ScrollableTabView
                    initialPage = {0}
                    renderTabBar={() => <DefaultTabBar/>}
                    tabBarUnderlineStyle={{height:1,backgroundColor: '#e15151',}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#e15151'
                    tabBarInactiveTextColor='#333'
                    locked ={ false}
                    >
                    <View tabLabel='待处理'>
                        <ScrollView>
                            {waitList}
                        </ScrollView>
                    </View >
                    <View  tabLabel='已处理'  ref={ (e) => this._name = e }>
                        <ScrollView>
                            {dealList}
                        </ScrollView>
                    </View >
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
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
        right:20
    },

    back_icon:{
       width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
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
});
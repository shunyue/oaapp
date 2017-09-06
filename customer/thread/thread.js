/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 线索
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    } from 'react-native';
import Modal from 'react-native-modal';
import Header from '../../common/header';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {

    constructor(props,status,status_) {
        super(props);
        this.state = {
            threadData: [],
            type: 1,
            messageVisible:'名称排序',
            isModalVisible: false,//下拉模型
            classify: []
        };
    }

    componentWillUnmount() {
        this._listenter1.remove();
        this._listenter2.remove();
    }

    componentDidMount() {
        this._listenter1 = DeviceEventEmitter.addListener('ReloadThread',()=>{
            this._getThreadMsg(this.state.type,this.state.classify.source,this.state.classify.start_time,this.state.classify.stop_time,this.state.classify.day);
        });

        this._listenter2 = DeviceEventEmitter.addListener('threadClassify',(data)=>{
            this.setState({classify: data});
            this._getThreadMsg(this.state.type,data.source,data.start_time,data.stop_time,data.day);
        });

        this._getThreadMsg(this.state.type,null,null,null,null);
    }

    _getThreadMsg(type, source, start_time, stop_time, day) {

        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.getThreadMsg;
        request.post(url, {
            user_id: params.user_id,
            company_id: params.company_id,
            type: type,
            source: source,
            start_time: start_time,
            stop_time: stop_time,
            day: day
        }).then((result) => {
            if (result.status == 1) {

                this.setState({
                    threadData: result.data
                })
            }
        }).catch((error) => {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    goPage_xiansuoDetail(threadData) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('ThreadDetail',{thread: threadData,user_id: params.user_id,company_id: params.company_id})
    }


    //动态信息下拉
    selectMessage(type){
        this.setState({isModalVisible: !this.state.isModalVisible});
        if(type==1){
            this.state.messageVisible="名称排序"
        }else if(type==2){
            this.state.messageVisible="最近新增"
        }else if(type==3){
            this.state.messageVisible="长期未跟进"
        }
        this.state.type = type;
        this._getThreadMsg(type,this.state.classify.source,this.state.classify.start_time,this.state.classify.stop_time,this.state.classify.day);

    }


    render() {

        var threadList = [];
        var threadData = this.state.threadData;
        if(this.state.threadData.length == 0) {
            threadList.push (
                <View style={styles.emptyContent} key="1">
                    <Image source={require('../../imgs/customer/empty-content.png')}/>
                    <Text>暂无相关内容</Text>
                </View>
            )
        }

        for(var i in threadData) {
            threadList.push(
                <TouchableHighlight underlayColor={'#eee'} onPress={this.goPage_xiansuoDetail.bind(this,threadData[i])} key={i}>
                    <View style={[styles.newMessage_content,{backgroundColor: '#fff'}]}>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <Text style={{fontSize:14,color:'#000'}}>{threadData[i].thread_name}</Text>
                        </View>
                        <View style={[styles.newMessage_customer]}>
                            <Image style={{width:16,height:16,marginRight:5}} source={require('../../imgs/customer/customer.png')}/>
                            <Text>{threadData[i].address?threadData[i].address: "未填写地址"}</Text>
                        </View>
                        <View style={[styles.newMessage_customer]}>
                            <Image style={{width:15,height:15,marginRight:5}} source={require('../../imgs/customer/person.png')}/>
                            <Text numberOfLines={1} style={{fontSize:12,width: screenW*0.7}}>{threadData[i].user_name}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }



        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        return (
        <View style={styles.container}>
            <Header navigation={this.props.navigation}
                    title="我的线索"
                    source={require('../../imgs/customer/add.png')}
                    onPress={()=>{navigate('addThread',{user_id: params.user_id,company_id: params.company_id,thread:[]})}}
                    />
            <View style={styles.subNav}>
                <TouchableHighlight underlayColor={'#eee'} onPress={()=>{this.setState({isModalVisible: !this.state.isModalVisible});}}>
                    <View style={styles.subNav_sub}>
                        <Text style={{marginRight:6,}}>{this.state.messageVisible}</Text>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/arrowU.png')}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#eee'} style={styles.subNav_sub_border} onPress={()=>this.props.navigation.navigate('threadClassify',{classify: this.state.classify})}>
                    <View style={styles.subNav_sub} >
                        <Image style={[styles.subNav_img,{tintColor:'#aaa'}]} source={require('../../imgs/customer/shaixuan.png')}/>
                        <Text>筛选</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#eee'} style={[styles.subNav_sub,styles.subNav_sub_border]} onPress={()=>{navigate('SearchThread',{user_id: params.user_id,company_id: params.company_id})}}>
                    <View style={styles.subNav_sub} >
                        <Image style={[styles.subNav_img,{ tintColor:'#aaa'}]} source={require('../../imgs/customer/search.png')}/>
                        <Text>搜索</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <ScrollView style={{flex:1}}>
                {threadList}
            </ScrollView>
            {/*客户  动态信息*/}
            <View>
                <Modal
                    backdropOpacity={0}
                    transparent={true}
                    animationType={"fade"}
                    visible={this.state.isModalVisible}
                    onRequestClose={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}
                    >
                    <TouchableWithoutFeedback onPress={() => {this.setState({isModalVisible: !this.state.isModalVisible})}}>
                        <View style={{flex:1}}>
                            <View style={{width:screenW,height:(screenH-80),opacity:0.4,backgroundColor:'#000',top:80,position:'absolute'}}></View>
                            <View style={styles.modelUp}>
                                <TouchableHighlight underlayColor={'#eee'} style={styles.xinxiiala} onPress={()=>{this.selectMessage(1)}}>
                                    <Text>名称排序</Text>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#eee'} style={styles.xinxiiala} onPress={()=>{this.selectMessage(2)}}>
                                    <Text>最近新增</Text>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#eee'} style={[styles.xinxiiala,styles.bordernone]} onPress={()=>{this.selectMessage(3)}}>
                                    <Text>长期未跟进</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F8F8F8'
    },


    subNav: {
        height:40,
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        borderColor:'#ccc',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },
    subNav_sub:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingLeft: 17,
        paddingRight: 17,
        width:screenW*0.33,
        height:36,
    },
    subNav_sub_border:{
        borderLeftWidth: 1,
        borderColor:'#ECECEC',
    },
    subNav_subColor:{
        color:'#e15151',
    },
    subNav_img:{
        marginTop:3,
        marginRight:4,
        width:15,
        height:15
    },
    choose:{
        width:screenW*0.9,
        height:screenH,
        backgroundColor:'#fff',
        position:'absolute',
        right:0,
    },
    customer_fenlei:{
        height:80,
        borderColor:'#ECECEC',
        borderBottomWidth:1,
    },
    textIput:{
        flexDirection:'row',
        alignItems:'center',
        width:screenW,
        height:40,
        borderColor:'#ECECEC',
        borderBottomWidth:1,
    },
    input_title:{
        width:screenW*0.3,
        paddingLeft:12
    },
    input_text:{
        width:screenW*0.48,
        height:40
    },
    input_content:{
        color:'#a5a5a5',
        width:screenW*0.48,
    },
    touch_a:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:5,
        height:40

    },
    textINput_arrow:{
        width:16,
        height:16,
        marginLeft:16
    },
    newMessage_head:{
        width:screenW,
        height:36,
        backgroundColor:'#d5d5d5',
        justifyContent:'center',
        alignItems:'center'
    },
    newMessage_con:{
        width:screenW*0.95,
        height:26,
        backgroundColor:'#fff',
        borderRadius:4,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    newMessage_content:{
        width:screenW,
        borderColor:'#ECECEC',
        borderBottomWidth:1,
        height:100,
        justifyContent: 'center',
        paddingLeft: 10
    },
    newMessage_customer:{
        flexDirection:'row',
        alignItems:'center',
        height:22,
    },
    newMessage_customer_sty:{
        justifyContent:'space-between',
    },
    //动态信息
    modelUp:{
        width:screenW,
        height:110,
        position: 'absolute',
        left:0,
        top:80,
        backgroundColor:'#fff'
    },
    xinxiiala:{
        width:screenW,
        height:35,
        paddingLeft:25,
        borderColor:'#ECECEC',
        borderBottomWidth:1,
        justifyContent:'center'
    },
    bordernone:{
        borderBottomWidth:0,
    },
    changeColor:{
        color:'#e15151'
    },
    input_text2:{
        textAlign:'center',
        height:22,
    },
    emptyContent: {
        flex: 1,
        marginTop: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

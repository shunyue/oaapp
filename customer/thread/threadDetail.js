/**
 * Created by Administrator on 2017/6/7.
 * 商机列表信息详情页
 * 子页面在customer/addContent 中
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Modal,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    Picker,
    WebView,
    TouchableWithoutFeedback,
    Linking,
    DeviceEventEmitter,
    Alert
    } from 'react-native';
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;

export default class app extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            handle:false,
            thread: params.thread,
            followRecord: []
        };
    }

    componentDidMount() {
        this._loadData();

        this._listenter1 =DeviceEventEmitter.addListener('choosePeople',(e)=>{

            const {params} = this.props.navigation.state;
            var url = config.api.base + config.api.addUserId;
            request.post(url, {
                thread_id: params.thread.id,
                userData: e.checkedData,
                type: 2
            }).then((result) => {
                if (result.status == 1) {
                    toast.center(result.message);
                    this.setState({
                        userData: e.checkedData
                    });
                }
            }).catch((error) => {
                toast.bottom('网络连接失败，请检查网络后重试');
            });

        });
        this._listenter2 =DeviceEventEmitter.addListener('editThread',(e)=>{
            this.setState({
                thread: e
            })
        });
        //重新更新跟进的信息
        this._listenter3 =DeviceEventEmitter.addListener('loadFollowRecord',(e)=>{
            this._loadData();
        })
    }



    componentWillUnmount() {
        this._listenter1.remove();
        this._listenter2.remove();
        this._listenter3.remove();
        DeviceEventEmitter.emit('ReloadThread');
    }

    //更进人和更进记录
    _loadData() {
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.threadDailyAndFollow;
        request.post(url, {
            thread_id: params.thread.id,
            user_id: params.thread.user_id,
            company_id: params.company_id
        }).then((result) => {
            if (result.status == 1) {

                this.setState({
                    followRecord: result.data.followRecord,
                    userData: result.data.userData
                });

            }
        }).catch((error) => {

            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    setHandleModal(visible){
        this.setState({handle: visible});
    }
    _callPhone(tel) {
        return Linking.openURL('tel:' + tel)
    }
    _callSMS(tel) {
        return Linking.openURL('sms:' + tel)
    }
    renderViewSource(id) {
        if(id == 1) {
            return <Text style={{fontSize: 13}}>市场活动</Text>
        }else if(id == 2) {
            return <Text style={{fontSize: 13}}>网络信息</Text>
        }else if(id == 3) {
            return <Text style={{fontSize: 13}}>客户介绍</Text>
        }else if(id == 4) {
            return <Text style={{fontSize: 13}}>其他</Text>
        }
    }
    //修改客户
    _editThread() {
        this.setHandleModal(!this.state.handle);
        this.props.navigation.navigate('Add_xiansuo',this.props.navigation.state.params)
    }

    //转为客户
    _reverseCustomer() {
        this.setHandleModal(!this.state.handle);
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('Customer_add', {customer: {cus_name: this.state.thread.thread_company_name, contactsData: [{con_name: this.state.thread.thread_name,tel: this.state.thread.tel,email:null,department: null,position: null}]},
                user_id: params.user_id, company_id: params.company_id,thread_id: params.thread.id});

    }
    //不再跟进
    _notFollow() {
        this.setHandleModal(!this.state.handle);
        return Alert.alert(
            '提示',
            '您确定不再跟进此客户？',
            [{text: '取消'},{text: '不再跟进', onPress: ()=>{this._notFollowWay()}}]
        )
    }
    _notFollowWay() {

        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.delFollow;
        request.post(url, {
            user_id: params.user_id,
            thread_id: params.thread.id,
            type: 2
        }).then((result) => {
            if (result.status == 1) {
                toast.center(result.message);
                this.props.navigation.goBack('XianSuoDetail');
            }else{
                return Alert.alert(
                    '提示',
                    result.message,
                    [{text: '确定'}]
                )
            }
        }).catch((error) => {

            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    //删除客户
    _delFollow() {
        this.setHandleModal(!this.state.handle);
        return Alert.alert(
            '提示',
            '删除后可在回收站中恢复，确定删除？',
            [{text: '取消'},{text: '删除', onPress: ()=>{this._delFollowWay()}}]
        )
    }
    _delFollowWay() {
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.delThread;
        request.post(url, {
            thread_id: params.thread.id
        }).then((result) => {
            if (result.status == 1) {
                toast.center(result.message);
                this.props.navigation.goBack('XianSuoDetail');

            }else{
                return Alert.alert(
                    '提示',
                    result.message,
                    [{text: '确定'}]
                )
            }
        }).catch((error) => {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    _followContent(thread_name,user_name,datetime,description) {
        this.props.navigation.navigate('FollowContent',{thread_name:thread_name,user_name: user_name,datetime: datetime,description: description})
    }
    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        var userData = this.state.userData;
        var userList = [];
        for (var i in userData) {
            userList.push(
                <TouchableHighlight underlayColor={"transparent"} onPress={() => {
                    navigate('SelfData', {user_id: params.user_id, company_id: params.company_id, accept_id: 3})
                }} key={i}>
                    <View style={{width: 60, alignItems: 'center'}}>
                        <Image style={{width: 34, height: 34, borderRadius: 17}}
                               source={ userData[i].avatar ? {uri: userData[i].avatar} : require('../../imgs/avatar.png')}/>
                        <Text style={{color: '#333'}}>{userData[i].name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }

        var recordList = [];
        var followRecord = this.state.followRecord;
        if(this.state.followRecord.length == 0) {
            recordList.push (
                <View style={styles.emptyContent} key="1">
                    <Image source={require('../../imgs/customer/empty-content.png')}/>
                    <Text>暂无相关内容</Text>
                </View>
            )
        }

        for (var i in followRecord) {
            recordList.push(
                <TouchableHighlight underlayColor={'#fff'} onPress={this._followContent.bind(this,followRecord[i].thread_name,followRecord[i].name,followRecord[i].datetime,followRecord[i].description)} key={i}>
                    <View style={[styles.place, styles.borderBottom, {minHeight: 60, backgroundColor: '#fff', paddingLeft: 15, paddingRight: 15}]}>
                        <View style={[styles.place2, {height: 25, paddingTop: 5}]}>
                            <Text style={{fontSize: 14}}>{followRecord[i].title}</Text>
                            <Text style={{fontSize: 12}}>{followRecord[i].datetime}</Text>
                        </View>
                        <View style={[styles.place2, {justifyContent: 'flex-start', height: 25, paddingBottom: 5}]}>

                            <Text style={{fontSize: 12, backgroundColor: '#e15215', paddingLeft: 3, paddingRight: 3, borderRadius: 4, marginRight: 10, color: '#fff'}}>跟进记录</Text>
                            <Text style={{fontSize: 12}}>{followRecord[i].name}</Text>
                        </View>
                        {followRecord[i].description &&
                        <View style={[styles.borderTop, {paddingTop: 5, paddingBottom: 5,}]}>
                            <Text>{followRecord[i].description}</Text>
                        </View>}
                    </View>

                </TouchableHighlight>
            )
        }

        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableHighlight underlayColor={'#ed2437'} style={[styles.goback, styles.go]}
                                            onPress={() => this.props.navigation.goBack(null)}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Image style={[styles.back_icon,{tintColor:'#fff'}]}
                                       source={require('../../imgs/customer/back.png')}/>
                                <Text style={styles.back_text}>返回</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#e15151'} style={[styles.goRight, styles.go]}
                                            onPress={() => {this.setState({handle: !this.state.handle})}}>
                            <Image style={{width: 25, height: 25,tintColor:'#fff'}}
                                   source={require('../../imgs/customer/slh32.png')}/>
                        </TouchableHighlight>
                    </View>
                    <View style={{width: screenW, alignItems: 'center', marginTop: 3}}>
                        <Text style={{fontSize: 18, color: '#fff'}}>{this.state.thread.thread_name}</Text>
                        <Text style={{marginTop: 5, color: '#fff'}}>{this.state.thread.thread_company_name}</Text>
                    </View>
                </View>
                <View style={{width: screenW, height: screenH * 0.1, position: 'absolute', top: 95,}}>
                    <Image style={{width: screenW, height: 30}} source={require('../../imgs/customer/detail_bj.png')}/>
                </View>
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() => <ScrollableTabBar
                        style={styles.tabar_scroll}
                    />}
                    tabBarUnderlineStyle={{height: 2, backgroundColor: '#e15151', borderRadius: 2}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#e15151'
                    tabBarInactiveTextColor='#333'
                >
                    <View tabLabel='基本信息'>
                        <ScrollView style={{height: screenH - 204}}>
                            <View style={[styles.borderTop, styles.customerCard_content2, {backgroundColor: '#fff', marginTop: 45, padding: 15, paddingTop: 3, paddingBottom: 3}]}>
                                <View style={[styles.place2,]}>
                                    <View style={[styles.place, {height: 50}]}>
                                        <Text style={{color: '#333'}}>电话</Text>
                                        <Text>{this.state.thread.tel}</Text>
                                    </View>
                                    <View style={[styles.place2,]}>
                                        <TouchableWithoutFeedback onPress={() => this._callSMS(this.state.thread.tel)}>
                                            <Image style={{width: 22, height: 22, marginRight: 15,tintColor:'#e15151'}}
                                                   source={require('../../imgs/customer/sendMessage.png')}/>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => this._callPhone(this.state.thread.tel)}>
                                            <Image style={{width: 22, height: 22,tintColor:'#e15151'}}
                                                   source={require('../../imgs/customer/phone.png')}/>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.customerCard_content2, {backgroundColor: '#fff', paddingLeft: 15, paddingRight: 15, height: 50, justifyContent: "center"}]}>
                                <Text style={{color: '#333'}}>线索来源</Text>
                                {this.renderViewSource(this.state.thread.source)}
                            </View>
                            {this.state.thread.address && <View style={[styles.customerCard_content2, {backgroundColor: '#fff', paddingLeft: 15, paddingRight: 15, height: 50, justifyContent: "center"}]}>
                                <Text style={{color: '#333'}}>地址</Text>
                                <Text style={{fontSize: 13}}>{this.state.thread.address}</Text>
                            </View>}
                            {this.state.thread.department && <View style={[styles.customerCard_content2, {backgroundColor: '#fff', paddingLeft: 15, paddingRight: 15, height: 50, justifyContent: "center"}]}>
                                <Text style={{color: '#333'}}>部门</Text>
                                <Text style={{fontSize: 13}}>{this.state.thread.department}</Text>
                            </View>}
                            {this.state.thread.position && <View style={[styles.customerCard_content2, {backgroundColor: '#fff', paddingLeft: 15, paddingRight: 15, height: 50, justifyContent: "center"}]}>
                                <Text style={{color: '#333'}}>职位</Text>
                                <Text style={{fontSize: 13}}>{this.state.thread.position}</Text>
                            </View>}
                            {this.state.thread.email && <View style={[styles.customerCard_content2, {backgroundColor: '#fff', paddingLeft: 15, paddingRight: 15, height: 50, justifyContent: "center"}]}>
                                <Text style={{color: '#333'}}>邮箱</Text>
                                <Text style={{fontSize: 13}}>{this.state.thread.email}</Text>
                            </View>}


                            <View style={[styles.place, styles.borderTop, styles.customerCard_content2, {backgroundColor: '#fff', padding: 15, paddingTop: 3, paddingBottom: 3, marginTop: 10}]}>
                                <View style={[styles.customerCard_content2, styles.place2,]}>
                                    <Text>跟进人</Text>
                                    <View style={[styles.place2, {height: 30}]}>
                                        <Text style={{color: '#e15151'}}>1人</Text>
                                        <Image style={{width: 12, height: 12,tintColor:'#e15151'}}
                                               source={require('../../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </View>

                                <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingLeft: 6, paddingTop: 10,paddingBottom: 10,flexWrap: 'wrap'}}>
                                    {userList}
                                    <TouchableWithoutFeedback onPress={() => {navigate('ChoosePeople', {company_id: params.company_id, userData: this.state.userData})}}>
                                        <Image style={{width: 35, height: 35, marginLeft: 10,tintColor:'#aaa'}}
                                               source={require('../../imgs/customer/add_c.png')}/>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => {navigate('ChoosePeople', {company_id: params.company_id, userData: this.state.userData, subtract: this.state.userData})}}>
                                        <Image style={{width: 35, height: 35, marginLeft: 10,tintColor:'#aaa'}}
                                               source={require('../../imgs/customer/add_l.png')}/>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View tabLabel='工作记录'>
                        <ScrollView style={{height: screenH - 204}}>
                            <View style={{marginTop: 45,}}>

                                {recordList}
                            </View>
                        </ScrollView>
                    </View>

                </ScrollableTabView>
                <View style={{height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderColor: '#ddd', borderTopWidth: 1, backgroundColor: '#fff'}}>
                    <TouchableHighlight underlayColor={'#fff'}
                                        onPress={() => {navigate('FollowRecord', {user_id: params.user_id, company_id: params.company_id, target_id: params.thread.id, type: 2})}}>
                        <View style={{justifyContent: 'center', alignItems: 'center',}}>
                            <Image style={{width: 25, height: 24,tintColor:'#e15151'}}
                                   source={require('../../imgs/customer/add_1.png')}/>
                            <Text style={{fontSize: 12, color: '#e15151'}}>跟进记录</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                {/* 添加模型 头部右侧 客户调整  */}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.handle}
                        onRequestClose={() => {this.setState({handle: !this.state.handle})}}>
                        <View style={{width: screenW, height: screenH, backgroundColor: '#555', opacity: 0.6}}>
                            <TouchableOpacity style={{flex: 1, height: screenH}} onPress={() => {this.setHandleModal(!this.state.handle)}}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer2}>
                            <View style={[styles.addCustomer_card22, {height: 235}]}>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => {this._editThread()}}>
                                    <View style={styles.customerCard_content22}>
                                        <Text style={{color: '#333'}}>编辑</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => {this._reverseCustomer()}}>
                                    <View style={styles.customerCard_content22}>
                                        <Text style={{color: '#333'}}>转为客户</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => {this._notFollow()}}>
                                    <View style={styles.customerCard_content22}>
                                        <Text style={{color: '#333'}}>不再跟进</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => {this._delFollow()}}>
                                    <View style={styles.customerCard_content22}>
                                        <Text style={{color: '#e15151'}}>删除</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => {this.setHandleModal(!this.state.handle)}}>
                                    <View style={[styles.customerCard_content22, styles.customerCard_content23]}>
                                        <Text style={{color: '#555'}}>取消</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
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
    container: {
        height: 120,
        backgroundColor: '#ed2437',
    },
    header:{
        height:40,
        flexDirection :'row',
        alignItems:'center',
        justifyContent:'center',
    },

    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:20,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 1
    },
    back_text:{
        color:'#fff',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    add:{
        width:24,
        height:24,
    },
    tabar_scroll:{
        width:screenW,
        height:45,
        position:'absolute',
        top:0,
        zIndex:1000
    },
    place:{
        justifyContent:'center',
    },
    place2:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ECECEC'
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ECECEC'
    },
    /*模型*/
    addCustomer:{
        flex:1,
        position:'absolute',
        top:screenH*0.2,
        left:screenW*0.05
    },
    addCustomer_2:{
        flex:1,
        position:'absolute',
        bottom:0
    },
    addCustomer_bm:{
        width:screenW,
        position:'absolute',
        bottom:0,
        height:screenH*0.52,
        backgroundColor:'#ddd'
    },

    addCustomer_c:{
        flex:1,
        position:'absolute',
        bottom:screenH*0.015,
    },
    addCustomer_card2:{
        width:screenW*0.9,
        height:screenH*0.55,
        backgroundColor:'#fff',
        paddingLeft:10,
        paddingRight:10,
    },
    addCustomer_card:{
        width:screenW,
        height:screenH*0.25,
        backgroundColor:'#fff',
    },
    addCustomer_card_h:{
        width:screenW*0.92,
        backgroundColor:'#fff',
        height:screenH*0.47,
        margin:15
    },
    addCustomer_card_1:{
        height:screenH*0.15,
    },
    addCustomer_card_2:{
        marginTop:7,
        height:screenH*0.075,
    },
    customerCard_content:{
        justifyContent:'center',
        alignItems:'flex-start',
        width:screenW*0.9-20,
        height:screenH*0.078,
        borderBottomColor:'#fff',
        paddingLeft:10,
    },
    customerCard_content3:{
        justifyContent:'center',
        alignItems:'flex-start',
        width:screenW,
        height:screenH*0.078,
        borderBottomColor:'#fff',
        paddingLeft:10,
    },
    customerCard_content_p:{
        justifyContent:'center',
        alignItems:'center',
        height:45
    },
    customerCard_content_border:{
        borderBottomWidth: 1,
        borderBottomColor:'#c5c5c5',
    },
    customerCard_content2:{
        borderBottomWidth:1,
        borderColor:'#e5e5e5',
    },
    addImg:{
        width:20,
        height:20
    },
    addImg2:{
        width:20,
        height:18
    },
    addCustomer2:{
        flex:1,
        position:'absolute',
        bottom:0,
    },
    addCustomer_card22:{
        width:screenW,
        height:screenH*0.24,
        backgroundColor:'#fff',
    },
    customerCard_content22:{
        justifyContent:'center',
        alignItems:'center',
        height:screenH*0.08,
        width:screenW,
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
    },
    customerCard_content23:{
        borderBottomWidth:0,
    },
    emptyContent: {
        flex: 1,
        marginTop: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
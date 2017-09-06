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
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Linking
    } from 'react-native';
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import moment from 'moment';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';

export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: []

        };
    }

    componentDidMount() {
        var url = config.api.base + config.api.getDailyAndUser;
        const {params} = this.props.navigation.state;
        request.post(url,{
            user_id: params.accept_id
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    userData: result.data.userData,
                    customerData: result.data.customerData,
                    dailyPlant: result.data.dailyData
                })

            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    OpBack() {
        this.props.navigation.goBack(null)
    }

    _plantType(type) {
        if(type == 1) {
            return (<Text style={{fontSize:12,backgroundColor:'#00E5B5',paddingLeft:4,paddingRight:4,borderRadius:8,marginRight:10,color: '#fff'}}>拜访</Text>)
        }else if(type == 2) {
            return (<Text style={{fontSize:12,backgroundColor:'#00C7F7',paddingLeft:4,paddingRight:4,borderRadius:8,marginRight:10,color: '#fff'}}>任务</Text>)
        }else if(type == 3) {
            return (<Text style={{fontSize:12,backgroundColor:'#FF5E60',paddingLeft:4,paddingRight:4,borderRadius:8,marginRight:10,color: '#fff'}}>会议</Text>)
        }else if(type == 4) {
            return (<Text style={{fontSize:12,backgroundColor:'#00FFA5',paddingLeft:4,paddingRight:4,borderRadius:8,marginRight:10,color: '#fff'}}>培训</Text>)
        }
    }

    _userMsg() {

        return (
            <View>
                <View style={[styles.customerCard_content2, styles.place2, {height: 60}]}>
                    <View style={[styles.place]}>
                        <Text style={{fontSize: 14}}>移动电话</Text>
                        <Text style={{color: '#333'}}>{this.state.userData.tel}</Text>
                    </View>
                    <View style={styles.place2}>
                        <TouchableWithoutFeedback
                            onPress={() => this._callSMS(this.state.userData.tel)}>
                            <Image style={{width: 18, height: 18,tintColor:'#e15151'}}
                                   source={require('../imgs/customer/sendMessage.png')}/>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => this._callPhone(this.state.userData.tel)}>
                            <Image style={{width: 18, height: 18, marginLeft: 10,tintColor:'#e15151'}}

                                   source={require('../imgs/customer/phone.png')}/>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <View style={[styles.customerCard_content2, styles.place, {height: 60}]}>
                    <Text style={{fontSize: 14}}>公司</Text>
                    <Text style={{color: '#333'}}>{this.state.userData.company_name}</Text>
                </View>

                <View style={[styles.place2, {height: 60}]}>
                    <View style={[styles.place]}>
                        <Text style={{}}>角色</Text>
                        <Text style={{color: '#333',}}>{this.state.userData.role_name}</Text>
                    </View>
                </View>
            </View>
        )
    }



    _dailyDetail(daily_type, title, customer_name, executor_name,position,start_time) {
        this.props.navigation.navigate('DailyDetail',{daily_type: daily_type,title: title,customer_name: customer_name, executor_name: executor_name,position: position,start_time: start_time})
    }
    _customerDetail(data) {
        this.props.navigation.navigate('CustomerDetail',{customer:data,user_id: this.state.user_id,company_id: this.state.company_id});
    }
    _chatMsg() {

        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('ChatMsg',{from_user: params.user_id,to_user: params.accept_id,name: this.state.userData.name,avatar: this.state.userData.avatar,company_id: params.company_id})
    }
    _callPhone(tel) {
        return Linking.openURL('tel:' + tel)
    }
    _callSMS(tel) {
        return Linking.openURL('sms:' + tel)
    }
    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;

        //日程计划
        var plantList = [];
        var dailyPlant = this.state.dailyPlant;

        for(var i in dailyPlant) {
            var plant = [];
            for( var j in dailyPlant[i]){
                plant.push(
                    <TouchableHighlight underlayColor={'#e5e5e5'} onPress={this._dailyDetail.bind(this, dailyPlant[i][j].daily_type,dailyPlant[i][j].title?dailyPlant[i][j].title: dailyPlant[i][j].customer_name,dailyPlant[i][j].customer_name,dailyPlant[i][j].executor_name, dailyPlant[i][j].position, dailyPlant[i][j].start_time)} key={j}>
                        <View style={[styles.place2,styles.borderBottom,{height:58,paddingLeft:15,backgroundColor:'#fff',paddingRight:15,}]}>
                            <View style={[styles.place2]}>
                                <Text style={{fontSize:14}}>{dailyPlant[i][j].time}</Text>
                                <View style={{marginLeft:10}}>
                                    <Text style={{fontSize:14,color: '#333',marginBottom: 4}}>{dailyPlant[i][j].title?dailyPlant[i][j].title: dailyPlant[i][j].customer_name}</Text>
                                    <View style={[styles.place2,{justifyContent:'flex-start'}]}>
                                        {this._plantType(dailyPlant[i][j].daily_type)}
                                        <Text numberOfLines={1} style={{fontSize:12,width: screenW*0.5}}>{dailyPlant[i][j].executor_name}</Text>
                                    </View>
                                </View>
                            </View>
                            {(dailyPlant[i][j].confirm_recept == 0)?<Text style={{fontSize:14,color: '#E0324F'}}>无进展</Text>:<Text style={{fontSize:14,color: '#55CEE8'}}>有进展</Text>}
                        </View>
                    </TouchableHighlight>
                )
            }

            plantList.push(
                <View key={i}>
                    <View style={{backgroundColor:'#F8F8F8',width:screenW,height:40,paddingLeft:10,justifyContent:'center'}}>
                        <Text>{dailyPlant[i][0].date}</Text>
                    </View>
                    <View style={[{borderColor:'#ECECEC'},styles.borderTop,]}>
                        {plant}
                    </View>
                </View>
            )
        }

        //跟进客户
        var followList = [];
        var customerData = this.state.customerData;
        for(var i in customerData) {
            followList.push(
                <TouchableHighlight underlayColor={'#eee'} onPress={this._customerDetail.bind(this,customerData[i])} key={i}>
                    <View style={[styles.newMessage_content,{backgroundColor: '#fff'}]}>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <Text style={{fontSize:14,color:'#000'}}>{customerData[i]['cus_name']}</Text>
                            <Text style={{color:'#e15151'}}>{customerData[i].classify?customerData[i].classify+"级":"未分类"}级</Text>
                        </View>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <View style={[styles.newMessage_customer,]}>
                                <Image style={{width:16,height:16,marginRight:5}} source={require('../imgs/customer/dingwei.png')}/>
                                <Text>{customerData[i].provice?customerData[i].provice+customerData[i].city+customerData[i].district: "未填写地址"}</Text>
                            </View>
                        </View>
                        <View style={[styles.newMessage_customer]}>
                            <Image style={{width:15,height:15,marginRight:5}} source={require('../imgs/customer/person.png')}/>
                            <Text>{customerData[i]['user_name']}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }

        if(params.accept_id != params.user_id) {
            return (
                <View style={styles.ancestorCon}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                                <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                                    <Image  style={[styles.back_icon,{tintColor:'#fff'}]}  source={require('../imgs/customer/back.png')}/>
                                    <Text style={styles.back_text}>返回</Text>
                                </View>
                            </TouchableHighlight>
                            <Text style={[styles.back_text,{backgroundColor:'transparent'}]}>个人资料</Text>

                        </View>
                        <View style={{position:'absolute',zIndex:1}}>
                            <Image  style={{width:screenW,height:screenH*0.19}}  source={require('../imgs/customer/selfData.png')}/>
                        </View>
                        <View style={{flexDirection:'row',position:'absolute',left:20,top:50,zIndex:100}}>
                            <Image  style={{width:46,height:46,marginRight:5,borderRadius: 23,borderWidth: 2,borderColor: '#F5D7CE'}}  source={ this.state.userData.avatar? {uri: this.state.userData.avatar}: require('../imgs/avatar.png')}/>
                            <View>
                                <Text style={{fontSize:17,color:'#fff',backgroundColor:'transparent'}}>{this.state.userData.name}</Text>
                                <Text style={{marginTop:2,color:'#fff',backgroundColor:'transparent'}}>{this.state.userData.company_name}</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{flex: 1}}>
                        <View style={[styles.customerCard_content2, {backgroundColor: '#fff',paddingLeft: 15,paddingRight: 15}]}>
                            {this._userMsg()}
                        </View>
                    </ScrollView>
                    <TouchableWithoutFeedback onPress={()=>this._chatMsg()}>
                        <View style={styles.btnStyle}>
                            <Image source={require('../imgs/customer/message.png')} style={styles.imgStyle}/>
                            <Text style={{color: '#e15151'}}>发消息</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }


        return (

            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                            <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                                <Image  style={[styles.back_icon,{tintColor:'#fff'}]} source={require('../imgs/customer/back.png')}/>
                                <Text style={styles.back_text}>返回</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={[styles.back_text,{backgroundColor:'transparent'}]}>个人资料</Text>

                    </View>
                    <View style={{position:'absolute',zIndex:1}}>
                        <Image  style={{width:screenW,height:screenH*0.19}}  source={require('../imgs/customer/selfData.png')}/>
                    </View>
                    <View style={{flexDirection:'row',position:'absolute',left:20,top:50,zIndex:100}}>

                        <Image  style={{width:46,height:46,marginRight:5,borderRadius: 23,borderWidth: 2,borderColor: '#F5D7CE'}}  source={ this.state.userData.avatar? {uri: this.state.userData.avatar} : require('../imgs/avatar.png')}/>
                        <View style={{backgroundColor:'transparent'}}>
                            <Text style={{fontSize:17,color:'#fff',backgroundColor:'transparent'}}>{this.state.userData.name}</Text>
                            <Text style={{marginTop:2,color:'#fff',backgroundColor:'transparent'}}>{this.state.userData.company_name}</Text>
                        </View>
                    </View>
                </View>
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={() =>
                    <ScrollableTabBar style={styles.tabar_scroll}/>}
                    tabBarUnderlineStyle={{height: 2, backgroundColor: '#e15151', borderRadius: 2}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#e15151'
                    tabBarInactiveTextColor='#333'
                >
                    <View tabLabel='基本信息' style={{flex: 1}}>
                        <ScrollView style={{flex: 1}}>
                            <View style={[styles.customerCard_content2, {
                                backgroundColor: '#fff',
                                marginTop: 45,
                                paddingLeft: 15,
                                paddingRight: 15
                            }]}>
                                {this._userMsg()}
                            </View>
                        </ScrollView>
                    </View>
                    <View tabLabel='日程计划' style={{backgroundColor: '#fff', flex: 1}}>
                        <ScrollView style={{flex: 1}}>
                            <View style={{marginTop: 45}}>
                                {plantList}
                            </View>
                        </ScrollView>
                    </View>
                    <View tabLabel='跟进客户' style={{flex: 1}}>
                        <ScrollView style={{flex: 1}}>
                            <View style={[{
                                marginTop: 45,
                                alignItems: 'flex-start',
                                paddingLeft: 15,
                                justifyContent: 'center',
                                height: 30
                            }]}>
                                <Text>共{this.state.customerData ? this.state.customerData.length : ''}家客户</Text>
                            </View>
                            {followList}
                        </ScrollView>
                    </View>
                    <View tabLabel='相关工作' style={{flex: 1}}>
                        <ScrollView style={{height: screenH - 204}}>
                            <View style={[{
                                borderColor: '#ccc',
                                marginTop: 40,
                                backgroundColor: '#fff',
                            }, styles.borderTop,]}>
                                <TouchableHighlight underlayColor={'#e5e5e5'} onPress={() => {
                                    navigate('Approve')
                                }}>
                                    <View style={[styles.place2, styles.borderBottom, {
                                        height: 40,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        justifyContent: 'flex-start'
                                    }]}>
                                        <Image style={{width: 20, height: 20, marginRight: 10,tintColor:'#22cdd3'}}
                                                source={require('../imgs/gz32.png')}/>
                                        <Text style={{color: '#333'}}>审批</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#e5e5e5'} onPress={() => {
                                    navigate('Log')
                                }}>
                                    <View style={[styles.place2, styles.borderBottom, {
                                        height: 40,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        justifyContent: 'flex-start'
                                    }]}>
                                        <Image style={{width: 20, height: 20, marginRight: 10,tintColor:'#f9b133'}}
                                               source={require('../imgs/customer/log.png')}/>
                                        <Text style={{color: '#333'}}>日志</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </ScrollView>
                    </View>
                </ScrollableTabView>
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
    },
    header:{
        width:screenW,
        height:40,
        flexDirection :'row',
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        top:0,
        zIndex:100
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
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    customerCard_content2:{
        borderBottomWidth:1,
        borderColor:'#ddd'
   },

    /*最新动态*/
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
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
        height:90,
        padding:10
    },
    newMessage_customer:{
        flexDirection:'row',
        alignItems:'center',
        height:22,
    },
    newMessage_customer_sty:{
        justifyContent:'space-between',
    },
    imgStyle: {
        width: 30,
        height: 30,
        tintColor:'#e15151'
    },
    btnStyle: {
        backgroundColor: '#fff',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
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
    Alert,
    DeviceEventEmitter
} from 'react-native';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;

export default class GonghaiDetail extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            contactsData: [],
            customer: params.customer,
            private:(params.customer.private == 1)?'私有客户':'共享客户',
        };
    }




    componentDidMount() {
        this._loadData(null);

        this._listenter1 = DeviceEventEmitter.addListener('addPeople',(e)=>{

            var url = config.api.base + config.api.addContacts;
            const {params} = this.props.navigation.state;
            if(params.customer.contacts_id || params.customer.user_id) {
                request.post(url, {
                    contactsData: e,
                    contacts_id: params.customer.contacts_id,
                    id: params.customer.id
                }).then((result) => {
                    if (result.status == 1) {
                        this.state.contactsData.push(e);
                        this.setState({})
                    }
                }).catch((error) => {
                    toast.bottom('网络连接失败，请检查网络后重试');
                });
            }
        });


    }

    componentWillUnmount() {
        this._listenter1.remove();

        //重新加载客户信息
        DeviceEventEmitter.emit('ReloadCommon');
    }



    _changePrivate() {
        Alert.alert(
            '提示',
            '添加到我的客户后，该客户将属于你的私有客户',
            [{text: '取消'},{text: '确定', onPress: ()=>{this._changePrivateWay()}}])
    }



    //改变客户的共享和私有的属性
    _changePrivateWay() {

        var url = config.api.base + config.api.updatePrivate;
        const {params} = this.props.navigation.state;
        request.post(url,{
            id: params.customer.id,
            user_id: params.user_id,
            private: 1
        }).then((result)=> {
            if(result.status == 1) {
                toast.center(result.message);
                DeviceEventEmitter.emit('ReloadCustomer');
                this.props.navigation.goBack(null)
            }else{
                return Alert.alert(
                    '提示',
                    result.message,
                    [{text: '确定'}]
                )
            }
        }).catch((error)=>{

            toast.bottom('网络连接失败，请检查网络后重试');
        });
    };


    //获取联系人、跟进人、工作记录、日程计划等数据
    _loadData(type) {
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.customerMsgAndDaily;
        if(params.customer.contacts_id || params.customer.user_id) {
            request.post(url, {
                contacts_id: params.customer.contacts_id,
                user_id: params.customer.user_id,
                customer_id: params.customer.id,
                company_id: params.company_id,
                daily_type: type
            }).then((result) => {
                if (result.status == 1) {
                    this.setState({

                        contactsData: result.data.contactsData,

                    });
                }
            }).catch((error) => {

                toast.bottom('网络连接失败，请检查网络后重试');
            });
        }
    }
    _callPhone(tel) {
        return Linking.openURL('tel:' + tel)
    }


    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        //联系人
        var contactsData = this.state.contactsData;
        var contactsList = [];
        for(var i in contactsData) {
            contactsList.push(<TouchableHighlight underlayColor={"#fff"} onPress={()=>{navigate('AddPeople')}} key={i}>
                <View style={[styles.place2,contactsData[i-(-1)]? styles.borderBottom:null]}>
                    <View style={[styles.place,{height:40}]}>
                        <Text style={{color:'#000',}}>{contactsData[i].con_name}</Text>
                        <Text>{contactsData[i].tel}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this._callPhone.bind(this,contactsData[i].tel)}>
                        <Image style={{width:25,height:25,tintColor:'#e15151'}} source={require('../../imgs/customer/phone.png')}/>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableHighlight>)
        }


        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableHighlight underlayColor={'#ed2437'} style={[styles.goback,styles.go]} onPress={()=>this.props.navigation.goBack(null)}>
                            <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                                <Image  style={[styles.back_icon,{tintColor:'#fff'}]} source={require('../../imgs/customer/back.png')}/>
                                <Text style={styles.back_text}>返回</Text>
                            </View>
                        </TouchableHighlight>

                    </View>
                    <View style={{marginLeft:20,marginTop:3}}>
                        <Text style={{fontSize:18,color:'#fff'}}>{this.state.customer.cus_name}</Text>
                        <Text style={{marginTop:5,color:'#fff'}}>{this.state.customer.position?this.state.customer.position: null}</Text>
                    </View>
                </View>
                <View style={{width:screenW,height:screenH*0.1,position:'absolute',top:95}}>
                    <Image style={{width:screenW,height:screenH*0.045}} source={require('../../imgs/customer/detail_bj.png' )}/>
                </View>
                <View style={{height: 40,justifyContent: 'center',paddingLeft: 12,backgroundColor: '#fff',borderBottomWidth: 1,borderColor: '#e3e3e3'}}>
                    <Text style={{color:'#e15151'}}>基本信息</Text>
                </View>
                    <View tabLabel='基本信息' style={{flex: 1}}>
                        <ScrollView style={{flex: 1}}>
                            <View style={[styles.customerCard_content2,{backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                <View style={[styles.customerCard_content2,styles.place2,{height:60}]}>
                                    <View style={[styles.place]}>
                                        <Text style={{fontSize:14}}>名称</Text>
                                        <Text style={{color:'#333'}}>{this.state.customer.cus_name}</Text>
                                    </View>
                                    <TouchableHighlight underlayColor={'#fff'} onPress={()=>{navigate('CustomerSearch',{name:this.state.customer.cus_name})}}>
                                        <View style={[styles.place,{alignItems:'center'}]}>
                                            <Image  style={{width:25,height:25,tintColor:'#e15151'}}  source={require('../../imgs/customer/see.png')}/>
                                            <Text style={{fontSize:12}}>工商查询</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={[styles.customerCard_content2,styles.place,{height:60}]}>
                                    <Text style={{fontSize:14}}>分类</Text>
                                    <Text style={{color:'#333'}}>{this.state.customer.classify?this.state.customer.classify+"级":"未分类"}</Text>
                                </View>
                                <View style={[styles.customerCard_content2,styles.place,{height:60}]}>
                                    <Text style={{fontSize:14}}>地址</Text>
                                    <Text style={{color:'#333'}}>{this.state.customer.provice?this.state.customer.provice+this.state.customer.city+this.state.customer.district: "未填写地址"}</Text>
                                </View>
                                {this.state.customer.position?<View style={[styles.customerCard_content2,styles.place2,{height:60}]}>
                                    <View style={[styles.place]}>
                                        <Text style={{fontSize:14}}>地图定位</Text>
                                        <Text style={{color:'#333'}}>{this.state.customer.position}</Text>
                                    </View>
                                    <Image  style={{width:20,height:20}} source={require('../../imgs/customer/arrow_r.png')}/>
                                </View>: <View style={[styles.customerCard_content2,styles.place,{height:60}]}>
                                    <Text style={{fontSize:14}}>地图定位</Text>
                                    <Text  style={{color:'#e15151',textDecorationLine:'underline'}}>未标注客户定位，点击可标注</Text>
                                </View>}

                                <View style={[styles.customerCard_content2,styles.place2,{height:60,borderBottomWidth: 0}]}>
                                    <View style={[styles.place]}>
                                        <Text style={{fontSize:14}}>客户属性</Text>
                                        <Text style={{color:'#333'}}>{this.state.private}</Text>
                                    </View>

                                </View>


                            </View>
                            <View style={[styles.borderTop,styles.customerCard_content2,{backgroundColor:'#fff',padding:15,paddingTop:3,paddingBottom:3}]}>
                                <TouchableHighlight underlayColor={"#fff"} onPress={()=>{navigate('Add_people')}}>
                                    <View style={[styles.place2,styles.customerCard_content2,contactsData[0]?null:({borderBottomWidth: 0})]}>
                                        <Text>联系人</Text>
                                        <View style={[styles.place2]}>
                                            <Text style={{color:'#e15151',fontSize:27,marginTop:-4,marginRight:5}}>+</Text>
                                            <Text style={{color:'#e15151'}}>新增联系人</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                {contactsList}
                            </View>

                        </ScrollView>
                    </View>

                <View style={{height:60,flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderColor: '#ECECEC',borderTopWidth:1,backgroundColor:'#fff'}}>
                    <TouchableHighlight underlayColor={'#fff'}
                                        onPress={()=>this._changePrivate()}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Image style={{width:25,height:24,tintColor:'#e15151'}} source={require('../../imgs/customer/mycustomer.png' )}/>
                            <Text style={{fontSize:12,color:'#e15151'}}>添加到我的客户</Text>
                        </View>
                    </TouchableHighlight>
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
        borderColor:'#ECECEC',
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
    avatarStyle: {
        width:40,
        height:40,
        borderRadius: 20
    },
    emptyContent: {
        flex: 1,
        marginTop: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
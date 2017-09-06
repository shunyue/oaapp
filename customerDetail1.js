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
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';

import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;

export default class app extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            contactsData: [],
            private:(params.customer.private == 1)?'私有客户':'共享客户',
            text:'请输入商机名称',
            show: false,
            visibleModal:false,
            richeng:false,
            handle:false,

        };
    }
    componentDidMount() {


        const {params} = this.props.navigation.state;

        var url = config.api.base + config.api.contactsMsg;
        if(params.customer.contacts_id || params.customer.user_id) {
            request.post(url, {
                contacts_id: params.customer.contacts_id,
                user_id: params.customer.user_id
            }).then((result) => {
                if (result.status == 1) {
                    this.setState({
                        contactsData: result.data.contactsData,
                        userData: result.data.userData
                    })
                }
            }).catch((error) => {
                toast.bottom('网络连接失败，请检查网络后重试');
            });
        }


        this._listenter = DeviceEventEmitter.addListener('addPeople',(e)=>{


            var url = config.api.base + config.api.addContacts;
            if(params.customer.contacts_id || params.customer.user_id) {
                request.post(url, {
                    contactsData: e,
                    contacts_id: params.customer.contacts_id,
                    id: params.customer.id
                }).then((result) => {
                    if (result.status == 1) {
                        alert(JSON.stringify(result.data))
                        this.state.contactsData.push(e);
                        this.setState({})
                    }
                }).catch((error) => {
                    toast.bottom('网络连接失败，请检查网络后重试');
                });
            }
        })

    }

    componentWillUnmount() {
        this._listenter.remove()
    }


    OpBack() {
        this.props.navigation.goBack(null)
    }

    goPage_follow() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('Follow',{user_id: params.customer_id});
    };

    setRichengModal(visible) {
        this.setState({richeng: visible});
    }
    visibleModalSet(visible) {
        this.setState({visibleModal: visible});
    }
    setHandleModal(visible){
        this.setState({handle: visible});
}

    message(cont) {

        var url = config.api.base + config.api.updatePrivate;
        const {params} = this.props.navigation.state;
        request.post(url,{
            id: params.customer.id,
            private: cont
        }).then((result)=> {
            if(result.status == 1) {

                if (cont == 1) {
                    this.setState({
                        private: "私有客户"
                    });
                } else if (cont == 2) {
                    this.setState({
                        private: "共享客户"
                    });
                }
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

    _callPhone(tel) {
        return Linking.openURL('tel:' + tel)
    }
    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;

        var contactsData = this.state.contactsData;
        var contactsList = [];
        for(var i in contactsData) {
            contactsList.push(<TouchableHighlight underlayColor={"#fff"} onPress={()=>{navigate('AddPeople')}} key={i}>
                <View style={[styles.place2,]}>
                    <View style={[styles.place,{height:40}]}>
                        <Text style={{color:'#000',}}>{contactsData[i].con_name}</Text>
                        <Text>{contactsData[i].tel}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this._callPhone.bind(this,contactsData[i].tel)}>
                        <Image style={{width:25,height:25}} tintColor={'#e15151'} source={require('../imgs/customer/phone.png')}/>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableHighlight>)
        }

        var userData = this.state.userData;
        var userList = [];
        for(var i in userData) {
            userList.push(
                <View style={[styles.place,{height:70,width:40,alignItems:'center'}]} key={i}>
                    <Image source={ userData[i].avatar? {uri: userData[i].avatar} : require('../imgs/avatar.png')}
                            style={styles.avatarStyle}  />
                    <Text style={{color:'#333'}}>{userData[i].name}</Text>
                </View>
            )
        }

        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableHighlight underlayColor={'#ed2437'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                            <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                                <Image  style={styles.back_icon} tintColor={'#fff'} source={require('../imgs/customer/back.png')}/>
                                <Text style={styles.back_text}>返回</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#e15151'} style={[styles.goRight,styles.go]} onPress={()=>{this.setState({handle: !this.state.handle})}}>
                            <Image  style={{width:25,height:25}} tintColor={'#fff'} source={require('../imgs/customer/slh32.png')}/>
                        </TouchableHighlight>
                    </View>
                    <View style={{marginLeft:35,marginTop:3}}>
                        <Text style={{fontSize:18,color:'#fff'}}>{params.customer.cus_name}</Text>
                        <Text style={{marginTop:5,color:'#fff'}}>{params.customer.position?params.customer.position: null}</Text>
                    </View>
                </View>
                <View style={{width:screenW,height:screenH*0.1,position:'absolute',top:95,}}>
                    <Image style={{width:screenW,height:screenH*0.045}} source={require('../imgs/customer/detail_bj.png' )}/>
                </View>
                <ScrollableTabView
                    initialPage = {0}
                    renderTabBar={() =>
                        <ScrollableTabBar
                            style={styles.tabar_scroll}/>}
                            tabBarUnderlineStyle={{height:2,backgroundColor: '#e15151',borderRadius:2}}
                            tabBarBackgroundColor='#FFFFFF'
                            tabBarActiveTextColor='#e15151'
                            tabBarInactiveTextColor='#333'
                            >
                            <View tabLabel='基本信息'>
                                <ScrollView style={{height:screenH-210}}>
                                    <View style={[styles.customerCard_content2,{backgroundColor:'#fff',marginTop:45,paddingLeft:15,paddingRight:15}]}>
                                        <View style={[styles.customerCard_content2,styles.place2,{height:60}]}>
                                            <View style={[styles.place]}>
                                                <Text style={{fontSize:14}}>名称</Text>
                                                <Text style={{color:'#333'}}>{params.customer.cus_name}</Text>
                                            </View>
                                            <TouchableHighlight underlayColor={'#fff'} onPress={()=>{navigate('CustomerSearch',{name:params.customer.cus_name})}}>
                                                <View style={[styles.place,{alignItems:'center'}]}>
                                                    <Image  style={{width:25,height:25}} tintColor={'#e15151'} source={require('../imgs/customer/see.png')}/>
                                                    <Text style={{fontSize:12}}>工商查询</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                        <View style={[styles.customerCard_content2,styles.place,{height:60}]}>
                                            <Text style={{fontSize:14}}>分类</Text>
                                            <Text style={{color:'#333'}}>{params.customer.classify?params.customer.classify+"级":"未分类"}</Text>
                                        </View>
                                        <View style={[styles.customerCard_content2,styles.place,{height:60}]}>
                                            <Text style={{fontSize:14}}>地址</Text>
                                            <Text style={{color:'#333'}}>{params.customer.provice?params.customer.provice+params.customer.city+params.customer.district: "未填写地址"}</Text>
                                        </View>
                                        {params.customer.position?<View style={[styles.customerCard_content2,styles.place2,{height:60}]}>
                                            <View style={[styles.place]}>
                                                <Text style={{fontSize:14}}>地图定位</Text>
                                                <Text style={{color:'#333'}}>{params.customer.position}</Text>
                                            </View>
                                            <Image  style={{width:20,height:20}} source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>: <View style={[styles.customerCard_content2,styles.place,{height:60}]}>
                                            <Text style={{fontSize:14}}>地图定位</Text>
                                            <Text  style={{color:'#e15151',textDecorationLine:'underline'}}>未标注客户定位，点击可标注</Text>
                                        </View>}
                                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this.setState({visibleModal: !this.state.visibleModal})}}>
                                            <View style={[styles.customerCard_content2,styles.place2,{height:60}]}>
                                                <View style={[styles.place]}>
                                                    <Text style={{fontSize:14}}>客户属性</Text>
                                                    <Text style={{color:'#333'}}>{this.state.private}</Text>
                                                </View>
                                                <Text style={{color:'#e15151'}}>更改</Text>
                                            </View>
                                        </TouchableHighlight>

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
                                    <View style={[styles.place,styles.borderTop,styles.customerCard_content2,{backgroundColor:'#fff',padding:15,paddingTop:3,paddingBottom:3}]}>
                                        <View style={[styles.customerCard_content2,styles.place2,]}>
                                            <Text>跟进人</Text>
                                            <View style={[styles.place2,{height:25}]}>
                                                <Text style={{color:'#e15151'}}>1人</Text>
                                                <Image  style={{width:12,height:12}} tintColor={'#e15151'} source={require('../imgs/customer/arrow_r.png')}/>
                                            </View>
                                        </View>
                                        {userList}
                                    </View>

                                </ScrollView>
                            </View>
                            <View tabLabel='工作记录' >
                                <ScrollView style={{height:screenH*0.7}}>
                                    <View style={{marginTop:45,width:screenW,height:40,justifyContent:'center',alignItems:'center'}}>
                                        <View style={{width:140,backgroundColor:'#bbb',justifyContent:'center',borderRadius:10,padding:8,paddingLeft:12,marginTop:15,}}>
                                            <Picker
                                                selectedValue={this.state.language}
                                                onValueChange={(lang) => this.setState({language: lang})}>
                                                <Picker.Item label="全部类型" value="全部类型" />
                                                <Picker.Item label="拜访" value="拜访" />
                                                <Picker.Item label="任务" value="任务" />
                                                <Picker.Item label="会议" value="会议" />
                                                <Picker.Item label="跟进记录" value="跟进记录" />
                                            </Picker>
                                        </View>

                                    </View>
                                </ScrollView>
                            </View>
                            <View tabLabel='日程计划'>
                                <View style={{width:screenW,marginTop:145,justifyContent:'center',alignItems:'center'}}>
                                    <Image source={require('../imgs/customer/empty-content.png')}/>
                                    <Text style={{fontSize:14}}>暂无相关内容</Text>
                                </View>
                            </View>

                        </ScrollableTabView>
                <View style={{height:60,flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderColor: '#ddd',borderTopWidth:1,backgroundColor:'#fff'}}>
                    <TouchableHighlight underlayColor={'#fff'}
                                        onPress={()=>this.goPage_follow()}>
                       <View style={{justifyContent:'center',alignItems:'center',}}>
                           <Image style={{width:25,height:24}} tintColor={'#e15151'} source={require('../imgs/customer/add_1.png' )}/>
                           <Text style={{fontSize:12,color:'#e15151'}}>跟进记录</Text>
                       </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#fff'}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Image style={{width:25,height:25}} tintColor={'#e15151'} source={require('../imgs/customer/add_2.png' )}/>
                            <Text style={{fontSize:12,color:'#e15151'}}>开始拜访</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#fff'}
                                        onPress={()=>{this.setState({richeng:!this.state.richeng});}}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Image style={{width:25,height:25}} tintColor={'#e15151'} source={require('../imgs/customer/add_3.png' )}/>
                            <Text style={{fontSize:12,color:'#e15151'}}>新建日程</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                {/* 添加模型 日程计划*/}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.richeng}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setRichengModal(!this.state.richeng)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer_2}>
                            <View style={styles.addCustomer_card}>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:screenH*0.17,borderColor:'#ccc',borderBottomWidth: 1,}}>
                                    <TouchableHighlight underlayColor={'#fff'}
                                                   onPress={() => { navigate('AddPage', {title: '拜访'});this.setState({richeng:!this.state.richeng})}}>
                                        <View style={{width:screenW*0.24,alignItems:'center',}}>
                                            <Image style={{width:40,height:40}}
                                                   source={require('../imgs/icon_shenpi/icon_1.png' )}/>
                                            <Text>新增拜访</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#fff'}
                                               onPress={() => {  navigate('AddPage', {title: '任务'});this.setState({richeng:!this.state.richeng})}}>
                                       <View style={{width:screenW*0.25,alignItems:'center',}}>
                                           <Image style={{width:40,height:40}}
                                                  source={require('../imgs/icon_shenpi/icon_2.png' )}/>
                                           <Text>新增任务</Text>
                                       </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#fff'}
                                               onPress={() => {  navigate('AddPage', {title: '会议'});this.setState({richeng:!this.state.richeng})}}>
                                        <View style={{width:screenW*0.25,alignItems:'center',}}>
                                            <Image style={{width:40,height:40}}
                                                   source={require('../imgs/icon_shenpi/icon_3.png' )}/>
                                            <Text>新增会议</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#fff'}
                                                        onPress={() => {  navigate('AddPage', {title: '培训'});this.setState({richeng:!this.state.richeng})}}>
                                        <View style={{width:screenW*0.25,alignItems:'center',}}>
                                            <Image style={{width:40,height:40}}
                                                   source={require('../imgs/icon_shenpi/icon_4.png' )}/>
                                            <Text>新增培训</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <TouchableHighlight style={[styles.customerCard_content3,{width:screenW,alignItems:'center',}]} underlayColor={'#fff'}
                                         onPress={() => { this.setRichengModal(!this.state.richeng)}}>
                                        <Text  style={{color:'#555',marginTop:15}}>取消</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* 添加模型 头部右侧 客户调整  */}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.handle}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setHandleModal(!this.state.handle)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer2}>
                            <View style={[styles.addCustomer_card22,{height:screenH*0.32}]}>
                                <View style={styles.customerCard_content22}>
                                    <TouchableOpacity onPress={() => { this.setHandleModal(!this.state.handle)}}>
                                        <Text style={{color:'#333'}}>编辑客户</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.customerCard_content22}>
                                    <TouchableOpacity onPress={() => { this.setHandleModal(!this.state.handle);this.goPage_customerAdd()}}>
                                        <Text style={{color:'#333'}}>不再跟进</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.customerCard_content22}>
                                    <TouchableOpacity onPress={() => { this.setHandleModal(!this.state.handle);this.goPage_customerAdd()}}>
                                        <Text style={{color:'#e15151'}}>删除客户</Text>
                                    </TouchableOpacity>
                                </View>
                                <View  style={[styles.customerCard_content22,styles.customerCard_content23]}>
                                    <TouchableOpacity onPress={() => { this.setHandleModal(!this.state.handle)}}>
                                        <Text  style={{color:'#555'}}>取消</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* 添加模型 更改客户类型  私有 共享  */}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.visibleModal}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.visibleModalSet(!this.state.visibleModal)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer2}>
                            <View style={[styles.addCustomer_card22,{height:screenH*0.32}]}>
                                <View style={styles.customerCard_content22}>
                                    <Text style={{color:'#555',fontSize:14}}>设为共享客户后，其他人都可看到该客户</Text>
                                </View>
                                <View style={styles.customerCard_content22}>
                                    <TouchableOpacity onPress={() => { this.message(1);this.setState({chat: !this.state.chat});this.visibleModalSet(!this.state.visibleModal);}}>
                                        <Text style={{color:'#333'}}>设为私有客户</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.customerCard_content22}>
                                    <TouchableOpacity onPress={() => { this.message(2);this.setState({chat: !this.state.chat});this.visibleModalSet(!this.state.visibleModal);}}>
                                        <Text style={{color:'#333'}}>设为共享客户</Text>
                                    </TouchableOpacity>
                                </View>
                                <View  style={[styles.customerCard_content22,styles.customerCard_content23]}>
                                    <TouchableOpacity onPress={() => { this.visibleModalSet(!this.state.visibleModal)}}>
                                        <Text  style={{color:'#555',fontSize:14}}>取消</Text>
                                    </TouchableOpacity>
                                </View>
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
        backgroundColor: '#eaeaea',
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
        marginTop:5
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
    avatarStyle: {
        width:40,
        height:40,
        borderRadius: 20
    },


});
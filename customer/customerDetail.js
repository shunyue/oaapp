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
    DeviceEventEmitter,
    StatusBar
    } from 'react-native';
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';
import CustomerPicker from '../common/customPicker';
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;

export default class app extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            contactsData: [],
            userData: [],
            customer: params.customer,
            private:(params.customer.private == 1)?'私有客户':'共享客户',
            visibleModal:false,
            richeng:false,
            handle:false,
            typeMsg: '全部类型'
        };
    }




    componentDidMount() {
        this._loadData(null);

        this._listenter1 = DeviceEventEmitter.addListener('addPeople',(e)=>{

            this._addContacts(e)
        });

        this._listenter2 =DeviceEventEmitter.addListener('addUserId',(e)=>{
            this.setState({
                userData: e
            })
        });

        this._listenter3 =DeviceEventEmitter.addListener('editCustomer',(e)=>{
            this.setState({
                customer: e
            })
        });

        //重新更新日程的信息
        this._listenter4 =DeviceEventEmitter.addListener('loadDaily',(e)=>{
            this._loadData(this.state.daily_type);
        });
        //修改或删除联系人
        this._listenter5=DeviceEventEmitter.addListener('cusContact', (a)=> {
            this._loadData(this.state.daily_type);
        });



    }

    componentWillUnmount() {
        this._listenter1.remove();
        this._listenter2.remove();
        this._listenter3.remove();
        this._listenter4.remove();
        this._listenter5.remove();

        //重新加载客户信息
        DeviceEventEmitter.emit('ReloadCustomer');
    }

    goPage_follow() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('FollowRecord',{user_id: params.user_id,company_id: params.company_id,target_id: params.customer.id,type: 1});
    };

    setRichengModal(visible) {
        this.setState({richeng: visible});
    }
    setHandleModal(visible){
        this.setState({handle: visible});
    }
    _changePrivate() {
        Alert.alert(
            '设为共享客户？',
            '设为共享客户后，该客户将会在公海中，所有人都可以看到该客户！',
            [{text: '取消'},{text: '确定', onPress: ()=>{this._changePrivateWay()}}])
    }
    //增加联系人
    _addContacts(e) {
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
    }




    //改变客户的共享和私有的属性
    _changePrivateWay() {
        var url = config.api.base + config.api.updatePrivate;
        const {params} = this.props.navigation.state;
        request.post(url,{
            id: params.customer.id,
            private: 2
        }).then((result)=> {
            if(result.status == 1) {
                toast.center(result.message);
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

    //没有日程计划
    _dailyEmpty() {
        if(!this.state.dailyPlant) {
            return (
                <View style={styles.emptyContent} key="1">
                    <Image source={require('../imgs/customer/empty-content.png')}/>
                    <Text>暂无日程计划</Text>
                </View>
            )
        }
    }

    _callPhone(tel) {
        return Linking.openURL('tel:' + tel)
    }
    _dailyType(type) {
        if(type == 1) {
            return (<Text style={{fontSize:12,backgroundColor:'#FF5E60',paddingLeft:3,paddingRight:3,borderRadius:4,marginRight:10,color: '#fff'}}>拜访</Text>)
        }else if(type == 2) {
            return (<Text style={{fontSize:12,backgroundColor:'#A987FF',paddingLeft:3,paddingRight:3,borderRadius:4,marginRight:10,color: '#fff'}}>任务</Text>)
        }else if(type == 3) {
            return (<Text style={{fontSize:12,backgroundColor:'#00DC87',paddingLeft:3,paddingRight:3,borderRadius:4,marginRight:10,color: '#fff'}}>会议</Text>)
        }else if(type == 4) {
            return (<Text style={{fontSize:12,backgroundColor:'#30C6FF',paddingLeft:3,paddingRight:3,borderRadius:4,marginRight:10,color: '#fff'}}>培训</Text>)
        }else if(type == 5) {
            return (<Text style={{fontSize:12,backgroundColor:'#667891',paddingLeft:3,paddingRight:3,borderRadius:4,marginRight:10,color: '#fff'}}>跟进记录</Text>)
        }
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
    _dailyDetail(daily_type, title, customer_name, executor_name,position,start_time) {
        this.props.navigation.navigate('DailyDetail',{daily_type: daily_type,title: title,customer_name: customer_name, executor_name: executor_name,position: position,start_time: start_time})
    }
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
                        dailyPlant: result.data.dailyPlant,
                        dailyData: result.data.dailyData,
                        contactsData: result.data.contactsData,
                        userData: result.data.userData
                    });
                }
            }).catch((error) => {

                toast.bottom('网络连接失败，请检查网络后重试');
            });
        }
    }
    _selectType(type) {
        this.setState({
            daily_type: type
        });

        this._loadData(type)
    }
    _selfData(id) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('UserMsg',{user_id: params.user_id,company_id: params.company_id,accept_id: id});
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
            customer_id: params.customer.id,
            type: 1
        }).then((result) => {
            if (result.status == 1) {
                toast.center(result.message);
                this.props.navigation.goBack(null);
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
    _delCustomer() {
        this.setHandleModal(!this.state.handle);
        return Alert.alert(
            '提示',
            '删除后可在回收站中恢复，确定删除？',
            [{text: '取消'},{text: '删除', onPress: ()=>{this._delCustomerWay()}}]
        )
    }
    _delCustomerWay() {
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.delCustomer;
        request.post(url, {
            customer_id: params.customer.id
        }).then((result) => {
            if (result.status == 1) {
                toast.center(result.message);
                this.props.navigation.goBack(null);

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
    //编辑客户
    _editCustomer() {
        this.setHandleModal(!this.state.handle);
        this.props.navigation.navigate('AddCustomer',this.props.navigation.state.params)
    }

    _CusContactDetail(contact) {
        let {params}=this.props.navigation.state;
        this.props.navigation.navigate('CusContactDetail',{
            user_id:params.user_id,
            company_id:params.company_id,
            contact:contact
        })
    }




    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        //联系人
        var contactsData = this.state.contactsData;
        var contactsList = [];
        for(var i in contactsData) {
            contactsList.push(<TouchableHighlight underlayColor={"#fff"} onPress={this._CusContactDetail.bind(this,contactsData[i])} key={i}>
                <View style={[styles.place2,contactsData[i-(-1)]? styles.borderBottom:null]}>
                    <View style={[styles.place,{height:40}]}>
                        <Text style={{color:'#000',}}>{contactsData[i].con_name}</Text>
                        <Text>{contactsData[i].tel}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this._callPhone.bind(this,contactsData[i].tel)}>
                        <Image style={{width:25,height:25,tintColor:'#e15151'}}  source={require('../imgs/customer/phone.png')}/>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableHighlight>)
        }
        //跟进人
        var userData = this.state.userData;
        var userList = [];
        var day=this.state.date;
        for(var i in userData) {
            userList.push(
                <TouchableHighlight underlayColor={"#fff"} onPress={this._selfData.bind(this,userData[i].id)} key={i}>
                    <View style={[styles.place,{height:70,width:56,alignItems:'center'}]}>
                        <Image source={ userData[i].avatar? {uri: userData[i].avatar} : require('../imgs/avatar.png')}
                               style={styles.avatarStyle}  />
                        <Text style={{color:'#333'}}>{userData[i].name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        //工作记录
        var dailyData = this.state.dailyData;
        var dailyList = [];
        for(var i in dailyData) {
            if(dailyData[i].status == 1 || dailyData[i].daily_type == 5) {

                dailyList.push(
                    <TouchableHighlight underlayColor={'#eee'} style={{marginTop:10}} onPress={this._dailyDetail.bind(this, dailyData[i].daily_type,dailyData[i].title?dailyData[i].title: dailyData[i].customer_name,dailyData[i].customer_name,dailyData[i].executor_name, dailyData[i].position, dailyData[i].start_time)} key={i}>
                        <View style={[styles.place,styles.borderTop,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                            <View style={[styles.place2,{height:25}]}>
                                <Text style={{fontSize:14}}>{dailyData[i].title?dailyData[i].title: dailyData[i].customer_name}</Text>
                                <Text style={{fontSize:12}}>{dailyData[i].start_time}</Text>
                            </View>
                            <View style={[styles.place2,{justifyContent:'flex-start',height:30}]}>

                                {this._dailyType(dailyData[i].daily_type)}

                                <Text numberOfLines={1} style={{fontSize:12,width: screenW*0.7}}>{dailyData[i].executor_name}</Text>
                            </View>
                            {dailyData[i].description &&<View style={{paddingTop: 5,paddingBottom: 5,borderTopWidth:1,borderColor: '#ECECEC'}}>
                                <Text>{dailyData[i].description}</Text>
                            </View>}
                        </View>
                    </TouchableHighlight>
                )
            }
        }

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

        return (
            <View style={styles.ancestorCon}>
                <StatusBar barStyle={'default'}/>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableHighlight underlayColor={'#ed2437'} style={[styles.goback,styles.go]} onPress={()=>this.props.navigation.goBack(null)}>
                            <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                                <Image  style={[styles.back_icon,{tintColor:'#fff'}]}  source={require('../imgs/customer/back.png')}/>
                                <Text style={styles.back_text}>返回</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#e15151'} style={[styles.goRight,styles.go]} onPress={()=>{this.setState({handle: !this.state.handle})}}>
                            <Image  style={{width:25,height:25,tintColor:'#fff'}}  source={require('../imgs/customer/slh32.png')}/>
                        </TouchableHighlight>
                    </View>
                    <View style={{marginLeft:20,marginTop:3}}>
                        <Text style={{fontSize:18,color:'#fff'}}>{this.state.customer.cus_name}</Text>
                        <Text style={{marginTop:5,color:'#fff'}}>{this.state.customer.position?this.state.customer.position: null}</Text>
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
                            <View tabLabel='基本信息' style={{flex: 1}}>
                                <ScrollView style={{flex: 1,marginTop: 40}}>
                                    <View style={[styles.customerCard_content2,{backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                        <View style={[styles.customerCard_content2,styles.place2,{height:60}]}>
                                            <View style={[styles.place]}>
                                                <Text style={{fontSize:14}}>名称</Text>
                                                <Text style={{color:'#333'}}>{this.state.customer.cus_name}</Text>
                                            </View>
                                            <TouchableHighlight underlayColor={'#fff'} onPress={()=>{navigate('CustomerSearch',{name:this.state.customer.cus_name})}}>
                                                <View style={[styles.place,{alignItems:'center'}]}>
                                                    <Image  style={{width:25,height:25,tintColor:'#e15151'}}  source={require('../imgs/customer/see.png')}/>
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
                                            <Image  style={{width:20,height:20}} source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>: <View style={[styles.customerCard_content2,styles.place,{height:60}]}>
                                            <Text style={{fontSize:14}}>地图定位</Text>
                                            <Text  style={{color:'#e15151',textDecorationLine:'underline'}}>未标注客户定位，点击可标注</Text>
                                        </View>}
                                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>this._changePrivate()}>
                                            <View style={[styles.customerCard_content2,styles.place2,{height:60,borderBottomWidth: 0}]}>
                                                <View style={[styles.place]}>
                                                    <Text style={{fontSize:14}}>客户属性</Text>
                                                    <Text style={{color:'#333'}}>{this.state.private}</Text>
                                                </View>
                                                <Text style={{color:'#e15151'}}>更改</Text>
                                            </View>
                                        </TouchableHighlight>

                                    </View>
                                    <View style={[styles.borderTop,styles.customerCard_content2,{backgroundColor:'#fff',padding:15,paddingTop:3,paddingBottom:3}]}>
                                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>{navigate('AddContacts')}}>
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
                                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>{navigate('FollowPeople',{userData: this.state.userData,customer_id: params.customer.id,company_id: params.company_id})}}>
                                          <View style={[styles.customerCard_content2,styles.place2,]}>
                                             <Text>跟进人</Text>
                                             <View style={[styles.place2,{height:25}]}>
                                                <Text style={{color:'#e15151'}}>{this.state.userData.length}人</Text>
                                                <Image  style={{width:12,height:12,tintColor:'#e15151'}}  source={require('../imgs/customer/arrow_r.png')}/>
                                            </View>
                                          </View>
                                        </TouchableHighlight>
                                        <View style={{flexDirection: 'row',alignItems: 'center',flexWrap: 'wrap'}}>
                                            {userList}
                                        </View>

                                    </View>

                                </ScrollView>
                            </View>
                            <View tabLabel='工作记录' style={{flex: 1}}>
                                <ScrollView style={{flex: 1,marginTop: 40}}>
                                    <View style={{width:screenW,height:50,justifyContent:'center',alignItems:'center'}}>
                                        <TouchableWithoutFeedback onPress={()=>this.setState({typeVisible: !this.state.typeVisible})}>
                                        <View style={{width:140,backgroundColor:'#E5E5E5',justifyContent:'center',height:30,borderRadius:15,paddingLeft:12}}>
                                            <CustomerPicker isVisible={false}
                                                            title="数据类型"
                                                            tipValue="全部类型"
                                                            pickerData={[{name: '全部类型',value: ''},
                                                            {name: '拜访',value: '1'},
                                                            {name: '任务',value: '2'},
                                                            {name: '会议',value: '3'},
                                                            {name: '培训',value: '4'},
                                                            {name: '跟进记录',value: '5'}]}
                                                            onClick={(e)=>this._selectType(e)}/>
                                        </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View>

                                        {dailyList}

                                    </View>
                                </ScrollView>
                            </View>
                            <View tabLabel='日程计划' style={{flex: 1}}>
                                <ScrollView style={{flex: 1,marginTop:40}}>
                                    {plantList}
                                    {this._dailyEmpty()}
                                </ScrollView>
                            </View>

                        </ScrollableTabView>
                <View style={{height:60,flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderColor: '#ECECEC',borderTopWidth:1,backgroundColor:'#fff'}}>
                    <TouchableHighlight underlayColor={'#fff'}
                                        onPress={()=>this.goPage_follow()}>
                       <View style={{justifyContent:'center',alignItems:'center',}}>
                           <Image style={{width:25,height:24,tintColor:'#e15151'}} source={require('../imgs/customer/add_1.png' )}/>
                           <Text style={{fontSize:12,color:'#e15151'}}>跟进记录</Text>
                       </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#fff'}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Image style={{width:25,height:25,tintColor:'#e15151'}} source={require('../imgs/customer/add_2.png' )}/>
                            <Text style={{fontSize:12,color:'#e15151'}}>开始拜访</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#fff'}
                                        onPress={()=>{this.setState({richeng:!this.state.richeng});}}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Image style={{width:25,height:25,tintColor:'#e15151'}} source={require('../imgs/customer/add_3.png' )}/>
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
                        onRequestClose={() => {this.setState({richeng: !this.state.richeng})}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {this.setRichengModal(!this.state.richeng)}}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer_2}>
                            <View style={styles.addCustomer_card}>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:screenH*0.17,borderColor:'#ECECEC',borderBottomWidth: 1,}}>
                                    <TouchableHighlight underlayColor={'#fff'}
                                                   onPress={() => { navigate('AddDaily', {title: '拜访',customer :params.customer,user_id: params.user_id,company_id: params.company_id});this.setState({richeng:!this.state.richeng})}}>
                                        <View style={{width:screenW*0.24,alignItems:'center',}}>
                                            <Image style={{width:40,height:40}}
                                                   source={require('../imgs/icon_shenpi/icon_1.png' )}/>
                                            <Text>新增拜访</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#fff'}
                                               onPress={() => {  navigate('AddDaily', {title: '任务',customer :params.customer,user_id: params.user_id,company_id: params.company_id});this.setState({richeng:!this.state.richeng})}}>
                                       <View style={{width:screenW*0.25,alignItems:'center',}}>
                                           <Image style={{width:40,height:40}}
                                                  source={require('../imgs/icon_shenpi/icon_2.png' )}/>
                                           <Text>新增任务</Text>
                                       </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#fff'}
                                               onPress={() => {  navigate('AddDaily', {title: '会议',customer :params.customer,user_id: params.user_id,company_id: params.company_id});this.setState({richeng:!this.state.richeng})}}>
                                        <View style={{width:screenW*0.25,alignItems:'center',}}>
                                            <Image style={{width:40,height:40}}
                                                   source={require('../imgs/icon_shenpi/icon_3.png' )}/>
                                            <Text>新增会议</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#fff'}
                                                        onPress={() => {  navigate('AddDaily', {title: '培训',customer :params.customer,user_id: params.user_id,company_id: params.company_id});this.setState({richeng:!this.state.richeng})}}>
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
                        onRequestClose={() => {this.setState({handle: !this.state.handle})}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setHandleModal(!this.state.handle)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer2}>
                            <View style={[styles.addCustomer_card22,{height:screenH*0.32}]}>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => this._editCustomer()}>
                                    <View style={styles.customerCard_content22}>
                                        <Text style={{color:'#333'}}>编辑客户</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => this._notFollow()}>
                                    <View style={styles.customerCard_content22}>
                                        <Text style={{color:'#333'}}>不再跟进</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => this._delCustomer()}>
                                    <View style={styles.customerCard_content22}>
                                        <Text style={{color:'#e15151'}}>删除客户</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={() => { this.setHandleModal(!this.state.handle)}}>
                                    <View style={[styles.customerCard_content22,styles.customerCard_content23]}>
                                        <Text  style={{color:'#555'}}>取消</Text>
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
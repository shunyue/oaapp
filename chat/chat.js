import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Image,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    AsyncStorage,
    Linking,
    Platform,
    DeviceEventEmitter
    } from 'react-native';
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-modal';
import Loading from '../common/loading';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import Badge from '../common/badge';
import moment from 'moment';
import JPushModule from 'jpush-react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrow: false,
            message:"全部",
            colorChange:[true,false,false,false],
            scroll:[false,true,false],
            modalVisible: false,//添加模型
            showChatModel: false,
            user_id:"",
            company_id:"",
            userInfo:[],
            company:[],
            applyData: []

        };
    }

    componentDidMount() {
        this.listener1 = DeviceEventEmitter.addListener('getAllUnRead',()=>this._getAllUnRead());
        this.listener2 = DeviceEventEmitter.addListener('lastApplyTime',()=>this._lastApplyTime());
        AsyncStorage.getItem('user')
            .then((res) => {
                var data = JSON.parse(res);
                this.setState({
                    user_id: data.user_id,
                    company_id: data.company_id,
                });
                this._searchExecutor();
                this._getAllUnRead();
                this._lastApplyTime();
            });


        //极光推送
        JPushModule.addReceiveCustomMsgListener((message) => {
            // this.setState({pushMsg: message});
        });
        JPushModule.addReceiveNotificationListener((message) => {
            if(JSON.parse(message.extras).type == 'chat') {
                DeviceEventEmitter.emit('getChatMessage');
                this._getAllUnRead();
            }else if(JSON.parse(message.extras).type == 'apply') {
                this._lastApplyTime();
            }
        })

    }

    componentWillUnmount() {
        this.listener1.remove();
        this.listener2.remove();
        JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
        JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);

    }

    _lastApplyTime() {
        var url = config.api.base + config.api.lastApplyTime;
        request.post(url,{
            company_id: this.state.company_id
        }).then((res) => {
            if (res.status == 1) {
                this.setState({
                    applyData: res.data
                })
            }

        }).catch((error)=> {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }

    //获取所有的未读消息
    _getAllUnRead() {

        var url = config.api.base + config.api.getAllUnRead;
        request.post(url,{
            to_user: this.state.user_id
        }).then((res) => {
            if (res.status == 1) {
                for(var i=0;i<res.data.length;i++) {
                    AsyncStorage.setItem('SP-' + res.data[i].id + '-SP', JSON.stringify(res.data[i]));
                }
            }
            this._getChatRecord();
        }).catch((error)=> {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    //获取内存数据
    _getChatRecord() {
        var _that = this;
        AsyncStorage.getAllKeys(function(err,keys){
            let list = [];
            for (var i in keys) {
                if(keys[i]!= 'user' ){
                    list.push(
                        keys[i]
                    )
                }
            }
            AsyncStorage.multiGet(list,function(error,result){
                //得到的结果是二维数组
                //result［i］［0］表示我们存储的键，result［i］［1］表示我们存储的值
                var arr = [];
                for(var i in result){
                    arr.push(JSON.parse(result[i][1]));
                }
                _that.setState({
                    historyChat: null
                });

            });
        })
    }
    _showChatModal(id) {
        this.setState({
            chatId: 'SP-'+ id + '-SP',
            showChatModel:!this.state.showChatModel
        });
    }
    //删除聊天信息，并更新已读状态
    _delChat() {
        AsyncStorage.removeItem(this.state.chatId);
        this.state.showChatModel = !this.state.showChatModel;
        //将该消息置为已读
        var url = config.api.base + config.api.updateChatRead;
        request.post(url,{
            from_chat_id: this.state.chatId,
            to_user: this.state.user_id
        }).then((res) => {
                            alert(JSON.stringify(res.data))
            this._getChatRecord();
        }).catch((error)=> {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    //搜索人员
    _searchExecutor(){
        var url=config.api.base+config.api.searchExecutor;
        request.post(url,{
            title:5,
            company_id:this.state.company_id,
            user_id:this.state.user_id
        }).then((res)=>{
            this.setState({
                load: false,
                userInfo:res.data.executor,
                company:res.data.company
            })
        })
        .catch((error)=>{

             toast.bottom('网络连接失败,请检查网络后重试')
        });
    }
    //个人资料详情页面
    goPage_UserInfo(user){
        this.props.navigation.navigate('UserMsg',{
            accept_id:user.id,
            company_id:this.state.company_id,
            user_id:this.state.user_id
        })
    }
    //人员组织页面
    goPage_Organization(){
        this.props.navigation.navigate('Organization',{
            company_id: this.state.company_id,
            user_id: this.state.user_id,
            company_name:this.state.company.name,
        })
    }
    //搜索员工
    goPage_UserSearch(){
        this.props.navigation.navigate('UserSearch',{
            company_id: this.state.company_id,
            user_id: this.state.user_id
        })
    }
    //客户联系人页面
    goPage_CustomerList(){
        this.props.navigation.navigate('CustomerList',{
            company_id: this.state.company_id,
            user_id: this.state.user_id
        })
    }
    //手机通讯录
    goPage_PhoneContact(){
        this.props.navigation.navigate('PhoneContactList',{
            choose:false
        })
    }
    //调用打电话接口
    callPhone(number){
        return Linking.openURL('tel:' + number)
    }

    setVisibleModal(visible) {
        this.setState({showChatModel: visible});
    }
    goPage() {
        this.props.navigation.navigate('Form')
    };
    scrollPage(index) {
        var list = []
        if(this.state.scroll[index]){
            return;
        }
        for(var i in this.state.scroll) {
            if(i == index) {
                list.push(!this.state.scroll[i])
            }else if(!this.state.scroll[!i]){
                list.push(this.state.scroll[!i])
            }
        }
        this.setState({
            scroll: list
        })
    }
    arrow(){
        if(this.state.arrow==false){
            return(
                <View>
                    <Image style={{width:14,height:14}} source={require('../imgs/customer/arrowU.png')}/>
                </View>
            )
        }else if(this.state.arrow==true){
            return(
                <View>
                    <Image style={{width:16,height:16,tintColor:'#555'}}  source={require('../imgs/customer/arrowD.png')}/>
                </View>
            )
        }
    }
    arrowSub(index) {
        var list = []
        if(this.state.colorChange[index]){
            return;
        }
        for(var i in this.state.colorChange) {
            if(i == index) {
                list.push(!this.state.colorChange[i])
            }else if(!this.state.colorChange[!i]){
                list.push(this.state.colorChange[!i])
            }
        }
        this.setState({
            colorChange: list
        })
    }

    //聊天
    _chatMsg(id,name) {
        this.props.navigation.navigate('ChatMsg',{to_user: id,name: name,from_user: this.state.user_id})
    }


    render() {
        const {navigate} = this.props.navigation;
        //如果查到数据
        var userArr=[];
        var userList=[];
        if(this.state.userInfo!="" && this.state.userInfo !=null){//输入查询客户
            var  user=this.state.userInfo;
            for (var i in user) {
                var userArr = [];
                for(var j in user[i]) {
                    userArr.push(
                        <View  key={j}>
                            <View style={[styles.flex_row,styles.borderBottom,styles.borderTop]}>
                            <TouchableHighlight underlayColor={'#ccc'}
                                                onPress={this.goPage_UserInfo.bind(this,user[i][j])}>
                                <View style={[{width:screenW,height:60,backgroundColor:'#fff',flexDirection:'row',paddingTop:10,paddingBottom:10}]}>
                                    {(user[i][j].avatar == "" || user[i][j].avatar == null) ? (
                                        <Image
                                            style={{width:40,height:40,marginLeft:10,marginRight:10,borderRadius: 20}}
                                            source={require('../imgs/avatar.png')}/>
                                    ) : (<Image
                                        style={{width:40,height:40,marginLeft:10,marginRight:10,borderRadius: 20}}
                                        source={{uri:user[i][j].avatar}}/>)}
                                    <View>
                                        <Text style={{color:'#333'}}>{user[i][j].name}</Text>
                                        <Text style={{marginTop:2,fontSize:12}}>{user[i][j].depart_name}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <View style={{position:'absolute',top:20,right:15}}>
                                <TouchableHighlight underlayColor={'#fff'}
                                                    onPress={this.callPhone.bind(this,user[i][j].tel)}>
                                    <Image style={{width:20,height:20,tintColor:'#e15151'}}
                                           source={require('../imgs/customer/phone.png')}/>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    );
                }
                userList.push(
                    <View key={i}>
                            <View style={styles.departLevel}>
                                <Text style={styles.departText}>{user[i][0].first_char}</Text>
                            </View>
                             {userArr}
                    </View>
                )
            }
        }else{//输入查询数据
            userList.push(
                <View key={0}><Text style={{fontSize: 16,textAlign:'center'}}>没有记录</Text></View>
            );
        }


        var historyList = [];
        var historyChat = this.state.historyChat;
        for(var i in historyChat) {
            historyList.push(
                <TouchableHighlight
                    onLongPress={this._showChatModal.bind(this,historyChat[i].id)}
                    onPress={this._chatMsg.bind(this,historyChat[i].id,historyChat[i].name)}
                    underlayColor={'#F3F3F3'} key={i}>
                    <View style={[{backgroundColor:'#fff',height:60},styles.flex_row,styles.borderBottom]}>
                        <Image style={{width:40,height:40,marginLeft:10,marginRight:10,borderRadius: 20}} source={ historyChat[i].avatar? {uri: historyChat[i].avatar}: require('../imgs/avatar.png')}/>
                        <View style={[{width:screenW-70,flexDirection:'row',justifyContent:'space-between'}]}>
                            <View>
                                <Text style={{color:'#333'}}>{historyChat[i].name}</Text>
                                <Text style={{marginTop:2,fontSize:12,}}>{historyChat[i].message}</Text>
                            </View>
                            <Text>{moment(historyChat[i].time).format('YYYY-MM-DD')}</Text>
                            <Badge num={historyChat[i].badge}/>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }

        return (


            <View style={styles.container}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                <ScrollableTabView
                    initialPage = {1}
                    renderTabBar={() => <ScrollableTabBar
                              style={styles.tabar_scroll}
             />}
                    tabBarUnderlineStyle={{height:2,backgroundColor: '#e15151',}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#e15151'
                    tabBarInactiveTextColor='#333'
                    locked ={ false}
                    showsVerticalScrollIndicator={false}
                    onChangeTab={(obj) => {
                            this.scrollPage(obj.i)
                            console.log('index:' + obj.i);
                        }
                    }>
                    <View tabLabel='通讯录'>
                        <ScrollView>
                            <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.goPage_UserSearch()}}>
                                <View style={[styles.search,styles.margin,styles.flex_row]}>
                                    <Image style={{width:15,height:15,marginRight:7}} source={require('../imgs/customer/search.png')}/>
                                    <Text>搜索</Text>
                                </View>
                            </TouchableHighlight>
                            <View style={[{height:80,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'},styles.flex_row,styles.borderBottom,styles.borderTop]}>
                                { /*  <TouchableHighlight underlayColor={'#ddd'} onPress={()=>{navigate('ChatGroup')}}>
                                    <View style={[styles.padding3,{height:80,justifyContent:'center',alignItems:'center'}]}>
                                        <Image style={{width:40,height:40}} source={require('../imgs/chat/punliao.png')}/>
                                        <Text style={{fontSize:13,color:'#333'}}>我的群聊</Text>
                                    </View>
                                </TouchableHighlight>*/}

                                <TouchableHighlight underlayColor={'#ddd'} onPress={()=>{this.goPage_CustomerList()}}>
                                    <View style={[{width:screenW*0.5,height:80,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}]}>
                                        <Image style={{width:40,height:40,marginBottom:5}} source={require('../imgs/chat/customer-people.png')}/>
                                        <Text style={{fontSize:13,color:'#333'}}>我的客户联系人</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#ddd'} onPress={()=>{this.goPage_PhoneContact()}}>
                                <View style={[{width:screenW*0.5,height:80,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}]}>
                                    <Image style={{width:40,height:40,marginBottom:5}} source={require('../imgs/chat/phone-book.png')}/>
                                    <Text style={{fontSize:13,color:'#333'}}>手机通讯录</Text>
                                </View>
                                </TouchableHighlight>
                            </View>
                            <View style={[{width:screenW,height:60,backgroundColor:'#fff',marginTop:10},styles.flex_row,styles.borderBottom,styles.borderTop]}>
                               <TouchableHighlight underlayColor={'#ccc'} onPress={()=>{this.goPage_Organization()}}>
                                   <View style={[{width:screenW,height:60,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}]}>
                                       <Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}  source={require('../imgs/chat/company.png')}/>
                                       <View>
                                           <Text style={{color:'#333'}}>{this.state.company.name}</Text>
                                           <Text style={{marginTop:2,fontSize:12}}>组织结构 | {this.state.company.count}人</Text>
                                       </View>
                                   </View>
                               </TouchableHighlight>
                                <View style={{position:'absolute',top:20,right:15}}>
                                    <Image  style={{width:15,height:15,tintColor:'#666'}} source={require('../imgs/customer/arrow_r.png')}/>
                                </View>
                            </View>
                            <View>
                                {userList}
                            </View>
                        </ScrollView>
                    </View>
                    <View  tabLabel='消息'>
                        <ScrollView>
                            <TouchableHighlight underlayColor={'transparent'} onPress={()=>{navigate('ChatSearch')}}>
                                <View style={[styles.search,styles.margin,styles.flex_row]}>
                                    <Image style={{width:15,height:15,marginRight:7}} source={require('../imgs/customer/search.png')}/>
                                    <Text>搜索</Text>
                                </View>
                            </TouchableHighlight>
                            <View style={[styles.borderTop]}>
                                <TouchableHighlight underlayColor={'#bbb'} onPress={()=>{navigate('ChatMessage',{user_id:this.state.user_id,company_id: this.state.company_id})}}>
                                    <View style={[{backgroundColor:'#fff',height:60},styles.flex_row,styles.borderBottom]}>
                                        <Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}  source={require('../imgs/chat/clerk.png')}/>
                                        <View style={[{width:screenW-70,flexDirection:'row',justifyContent:'space-between'}]}>
                                            <View>
                                                <Text style={{color:'#333'}}>小秘书</Text>
                                                <Text style={{marginTop:2,fontSize:12,}}>拜访提醒</Text>
                                            </View>
                                            <Text>13:48</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>


                            </View>
                            <View style={[styles.borderTop,{marginTop: 10}]}>
                                {/*<View style={[{backgroundColor:'#fff',height:60},styles.flex_row,styles.borderBottom]}>
                                    <View style={[{width:40,height:40,marginLeft:10,marginRight:10,flexWrap:'wrap'},styles.flex_row]}>
                                        <Image style={{width:18,height:18,margin:1}}  source={require('../imgs/customer/headPortrait.png')}/>
                                        <Image style={{width:18,height:18,margin:1,}}  source={require('../imgs/customer/headPortrait.png')}/>
                                        <Image style={{width:18,height:18,margin:1,}}  source={require('../imgs/customer/headPortrait-2.png')}/>
                                    </View>
                                    <View style={[{width:screenW-70,flexDirection:'row',justifyContent:'space-between'}]}>
                                        <View>
                                            <View style={styles.flex_row}>
                                                <Text style={{color:'#333'}}>全体群 </Text>
                                                <Image style={{width:13,height:13,}} tintColor={'#7cf'} source={require('../imgs/chat/qi.png')}/>
                                            </View>
                                            <Text style={{marginTop:2,fontSize:12,}}>诶无非是工商</Text>
                                        </View>
                                        <View style={{position:'absolute',top:-11,right:-10}}>
                                            <Text style={{width:0,height:0,borderWidth:10,borderColor:'#ff8888',borderLeftColor:'transparent',borderBottomColor:'transparent'}}></Text>
                                        </View>
                                    </View>
                                </View>*
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={()=>this.props.navigation.navigate('ChatGroup',{from_user:3, group_id: 2,name: '群聊('+4+')'})}>
                                <View style={[{backgroundColor:'#fff',height:60},styles.flex_row,styles.borderBottom]}>
                                    <View style={[{width:40,height:40,marginLeft:10,marginRight:10},styles.flex_row]}>
                                        <Image style={{width:20,height:20,}}  source={require('../imgs/customer/headPortrait.png')}/>
                                        <Image style={{width:20,height:20,}}  source={require('../imgs/customer/headPortrait-2.png')}/>
                                    </View>
                                    <View style={[{width:screenW-70,flexDirection:'row',justifyContent:'space-between'}]}>
                                        <View>
                                            <Text style={{color:'#333'}}>张三、李四</Text>
                                            <Text style={{marginTop:2,fontSize:12,}}>张三邀请李四加入群聊</Text>
                                        </View>
                                        <Text>13:48</Text>
                                    </View>
                                </View>
                                </TouchableHighlight>*/}
                                {historyList}
                                {this.state.applyData.apply_name ?<TouchableHighlight underlayColor={'#ccc'} onPress={()=>{navigate('ApplyNotice',{company_id: this.state.company_id,user_id: this.state.user_id})}}>
                                    <View style={[{backgroundColor:'#fff',height:60},styles.flex_row,styles.borderBottom]}>
                                        <Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}  source={require('../imgs/chat/notice.png')}/>
                                        <View style={[{width:screenW-70,flexDirection:'row',justifyContent:'space-between'}]}>
                                            <View>
                                                <Text style={{color:'#333'}}>申请通知</Text>
                                                <Text style={{marginTop:2,fontSize:12,}}>{this.state.applyData.apply_name }申请加入企业！</Text>
                                            </View>
                                            <Text>{this.state.applyData.datetime}</Text>
                                            <Badge num={this.state.applyData.badge} />
                                        </View>
                                    </View>
                                </TouchableHighlight>:null}
                                <TouchableHighlight underlayColor={'#ccc'} onPress={()=>navigate('RequestPeople',{company_id: this.state.company_id})}>
                                    <View style={[{backgroundColor:'#fff',height:60},styles.flex_row,styles.borderBottom]}>
                                        <Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}  source={require('../imgs/chat/invite-colleague.png')}/>
                                        <View>
                                            <Text style={{color:'#333'}}>邀请同事</Text>
                                            <Text style={{marginTop:2,fontSize:12,}}>一个人太孤单，快去召唤千军万马！</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </ScrollView>
                    </View>

                </ScrollableTabView>
                <View style={[Platform.OS === 'ios'?{top:30}:{top: 10},{position:'absolute',left:15}]}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={() => this.goPage()}>
                        <Image style={{width:26,height:26}} source={require('../imgs/customer/baobiao.png')}/>
                    </TouchableHighlight>
                </View>
                <View style={[Platform.OS === 'ios'?{top:30}:{top: 10},this.state.scroll[1]?{position:'absolute',right:15}:{display:'none'}]}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.setState({modalVisible: !this.state.modalVisible})}}>
                        <Image style={{width:26,height:26}} source={require('../imgs/customer/add.png')}/>
                    </TouchableHighlight>
                </View>

                {/* 按钮 新增*/}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {this.setState({modalVisible: !this.state.modalVisible})}}
                        >
                        <TouchableWithoutFeedback
                            onPress = {()=>this.setState({modalVisible: !this.state.modalVisible})}
                            >
                            <View style={{flex:1}}>
                                <View style={styles.model}>
                                    <Text style={styles.model_border}></Text>
                                </View>
                                <View style={styles.model_up}>
                                    <View  style={styles.icon_san}>
                                        <Image style={styles.icon_2} source={require('../imgs/customer/background_san.png')}/>
                                    </View>
                                    {/*<TouchableHighlight underlayColor={'transparent'} onPress={() => {this.setState({modalVisible: !this.state.modalVisible});this.goPage_add_xiansuo()}}>
                                        <View style={styles.model_up_in}>
                                            <Image style={styles.icon_} tintColor={'#fff'} source={require('../imgs/chat/setChat.png')}/>
                                            <Text style={styles.text_color}>发起聊天</Text>
                                        </View>
                                    </TouchableHighlight>*/}

                                    <TouchableHighlight underlayColor={'transparent'} onPress={() => {this.setState({modalVisible: !this.state.modalVisible});navigate('RequestPeople',{company_id: this.state.company_id})}}>
                                        <View style={styles.model_up_in}>
                                            <Image style={[styles.icon_,{tintColor:'#fff'}]}  source={require('../imgs/chat/visit.png')}/>
                                            <Text style={styles.text_color}>邀请同事</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                {/* 添加模型 联系人编辑*/}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.showChatModel}
                        onRequestClose={() => {this.setVisibleModal(!this.state.showChatModel)}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{width:screenW,height:screenH}} onPress={() => {
                      this.setVisibleModal(!this.state.showChatModel)
                    }}></TouchableOpacity>
                        </View>
                        <View style={{position:'absolute',top:screenH*0.5-20,height:40,width:screenW*0.7,left:screenW*0.15,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={() => this._delChat()}>
                                <Text style={{color:'#333'}}>删除该聊天</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    tabar_scroll:{
        height:48,
        justifyContent:'center',
        paddingBottom:8,
        borderBottomWidth:1,
        borderColor:'#ccc',
    },
    search:{
        width:screenW*0.9,
        height:30,
        backgroundColor:'#fff',
        justifyContent:'center',
        marginLeft:screenW*0.05,
        borderRadius:7,
    },
    flex_row :{
        flexDirection:'row',
        alignItems:'center',
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ddd'
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ddd'
    },
    padding:{
        paddingTop:10,
    },
    padding2:{
        paddingLeft:15,
        paddingRight:15
    },
    padding3:{
        paddingLeft:10,
        paddingRight:10
    },
    margin:{
        marginTop:10,
        marginBottom:10
    },
    //动态信息
    modelUp:{
        width:screenW,
        height:140,
        position: 'absolute',
        left:0,
        top:88,
        backgroundColor:'#fff'
    },
    xinxiiala:{
        width:screenW,
        height:35,
        paddingLeft:15,
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
        flexDirection:'row',
        alignItems:'center',
    },
    xinxiiala2:{
        paddingLeft:25,
    },
    bordernone:{
        borderBottomWidth:0,
    },
    model:{
        width:120,
        height:45,
        position: 'absolute',
        right:6,
        top: Platform.OS === 'ios'?70:50,
        backgroundColor:'#000',
        opacity:0.6,
        borderRadius:6
    },
    model_border:{
        borderBottomWidth: 0,
        borderBottomColor:'#bbb',
        padding:17,
    },
    model_up:{
        width:120,
        height:45,
        position: 'absolute',
        right:6,
        top: Platform.OS === 'ios'?70:50,
    },
    model_up_in:{
        height:43,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:18
    },
    text_color:{
        color:'#fff',
        fontSize:14
    },
    icon_:{
        width:20,
        height:20,
        marginRight:7
    },
    icon_1:{
        width:20,
        height:20
    },
    icon_2:{
        width:20,
        height:11,
    },
    icon_san:{
        width:25,
        height:14,
        position: 'absolute',
        right:6,
        top:-11,

    },
    departLevel: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,

    },
    departText: {
        fontSize: 14,
        marginLeft: 10
    },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 客户
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
    AsyncStorage,
    DeviceEventEmitter,
    Alert
    } from 'react-native';

import Modal from 'react-native-modal'
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';

export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            classify: [],
            customerData: [],
            recentData:[],
            modalVisible: false,//添加模型
            isModalVisible: false,//下拉模型
            shaixuan:false,//筛选 全部客户
            switch:1, /* 动态信息切换*/
            messageVisible:'名称排序',
        };
    }

    componentWillUnmount() {
        this._listenter1.remove();
        this._listenter2.remove();
    }

    componentDidMount() {
        this._listenter1 = DeviceEventEmitter.addListener('Classify',(data)=>{
            this.setState({classify: data});
            this._customerInfo(this.state.user_id,this.state.company_id,this.state.type,data.place,data.classify,data.start_time,data.stop_time,data.day);
        });

        this._listenter2 = DeviceEventEmitter.addListener('ReloadCustomer',()=>{
            this._customerInfo(this.state.user_id,this.state.company_id,this.state.type,this.state.classify.place,this.state.classify.classify,this.state.classify.start_time,this.state.classify.stop_time,this.state.classify.day);

        });


        AsyncStorage.getItem('user')
            .then((data) => {
                if(data) {
                    const userJson = JSON.parse(data)
                    this.setState({
                        user_id: userJson.user_id,
                        company_id: userJson.company_id
                    });
                    this._customerInfo(userJson.user_id,userJson.company_id,this.state.type,null,null,null,null,null);
                }
            })
    }
    _customerInfo(user_id,company_id,type,place,classify,start_time,stop_time,day) {

        var url = config.api.base + config.api.customerInfo;
        const {params} = this.props.navigation.state;
        request.post(url,{
            user_id: user_id,
            company_id: company_id,
            type: type,
            place: place,
            classify: classify,
            start_time: start_time,
            stop_time: stop_time,
            day: day,
            private: 1
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    recentData: result.data.recentData,
                    customerData: result.data.customerData
                })
            }
        }).catch((error)=>{

            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }

    goPage() {
        this.props.navigation.navigate('Form')
    };
    goPage_xiansuo() {
        this.props.navigation.navigate('Thread',{user_id: this.state.user_id,company_id: this.state.company_id})
    };
    goPage_gonghai() {
        this.props.navigation.navigate('GongHai',{user_id: this.state.user_id,company_id: this.state.company_id})
    };
    goPage_add_xiansuo() {
        this.props.navigation.navigate('addThread',{user_id: this.state.user_id,company_id: this.state.company_id,thread:[]})
    };

    goPage_customerAdd() {
        this.props.navigation.navigate('AddCustomer',{user_id: this.state.user_id,company_id: this.state.company_id,customer:[]})
    };
    _customerDetail(data) {
        this.props.navigation.navigate('CustomerDetail',{customer:data,user_id: this.state.user_id,company_id: this.state.company_id});
    }

    //动态信息下拉
    selectMessage(type){

        this.setState({isModalVisible: !this.state.isModalVisible,type: type});

        this._customerInfo(this.state.user_id,this.state.company_id,type,this.state.classify.place,this.state.classify.classify,this.state.classify.start_time,this.state.classify.stop_time,this.state.classify.day);
        if(type==1){
            this.state.messageVisible="名称排序"
        }else if(type==2){
            this.state.messageVisible="最新创建"
        }else if(type==3){
            this.state.messageVisible="长期未跟进"
        }

    }
    setMessage(status) {
        this.setState({
            switch: status
        })

    }
    modelVisible() {
        if(this.state.switch == 1) {
            this.setState({isModalVisible: !this.state.isModalVisible});
        }
        this.setMessage(1);
    }

    //动态信息获取 查看 客户
    message(){
        if(this.state.switch==1){
            var customerData = this.state.customerData;
            var customerList = [];
            if(this.state.customerData.length == 0) {
                return (
                    <View style={styles.emptyContent}>
                        <Image source={require('../imgs/customer/empty-content.png')}/>
                        <Text>暂无相关内容</Text>
                    </View>
                )
            }
            for(var i in customerData) {
                customerList.push(
                    <TouchableHighlight key={i} underlayColor={'#F3F3F3'}
                                        onPress={this._customerDetail.bind(this,customerData[i]) }  >
                        <View style={styles.newMessage_content}>
                            <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                                <Text style={{fontSize:14,color:'#000'}}>{customerData[i].cus_name}</Text>
                                <Text style={{color:'#e15151'}}>{customerData[i].classify?customerData[i].classify+"级":"未分类"}</Text>
                            </View>
                            <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                                <View style={[styles.newMessage_customer,]}>
                                    <Image style={{width:16,height:16,marginRight:5}} source={require('../imgs/customer/customer.png')}/>
                                    <Text>{customerData[i].provice?customerData[i].provice+customerData[i].city+customerData[i].district: "未填写地址"}</Text>
                                </View>
                            </View>
                            <View style={[styles.newMessage_customer]}>
                                <Image style={{width:15,height:15,marginRight:5}} source={require('../imgs/customer/person.png')}/>
                                <Text numberOfLines={1} style={{fontSize:12,width: screenW*0.7}}>{customerData[i].user_name}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            }
            return(
                <ScrollView style={{flex:1}}>
                    <View style={styles.newMessage_head}>
                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('SearchCustomer',{company_id: this.state.company_id,user_id: this.state.user_id})}>
                            <View style={styles.newMessage_con}>
                                <Image style={{width:18,height:18,marginRight:10}} source={require('../imgs/customer/search.png')}/>
                                <Text>共{this.state.customerData.length}家客户</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {customerList}
                </ScrollView>
            )
        }else if(this.state.switch==2){
            var recentData = this.state.recentData;
            var recentList = [];
            if(this.state.recentData.length == 0) {
                return (
                    <View style={styles.emptyContent}>
                        <Image source={require('../imgs/customer/empty-content.png')}/>
                        <Text>暂无相关内容</Text>
                    </View>
                )
            }
            for(var i in recentData) {
                recentList.push(
                    <TouchableHighlight key={i} underlayColor={'#F3F3F3'}
                                        onPress={this._customerDetail.bind(this,recentData[i]) }  >
                        <View style={[styles.newMessage_content,{backgroundColor: '#fff'}]} key={i}>
                            <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                                <Text style={{fontSize:14,color:'#000'}}>{recentData[i].cus_name}</Text>
                                <Text style={{color:'#e15151'}}>{recentData[i].classify?recentData[i].classify+"级":"未分类"}</Text>
                            </View>
                            <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                                <View style={[styles.newMessage_customer,]}>
                                    <Image style={{width:16,height:16,marginRight:5}} source={require('../imgs/customer/customer.png')}/>
                                    <Text>{recentData[i].provice?recentData[i].provice+recentData[i].city+recentData[i].district: "未填写地址"}</Text>
                                </View>
                            </View>
                            <View style={[styles.newMessage_customer]}>
                                <Image style={{width:15,height:15,marginRight:5}} source={require('../imgs/customer/person.png')}/>
                                <Text numberOfLines={1} style={{fontSize:12,width: screenW*0.7}}>{recentData[i].user_name}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            }

            return(
                <ScrollView style={{flex:1}}>
                    {recentList}
                </ScrollView>
            )
        }


    }

    render() {

        return (

            <View style={styles.container}>

                <View style={{width:screenW,height:47,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:15,paddingRight:15}}>
                    <TouchableOpacity onPress={() => this.goPage()}>
                        <Image style={styles.icon} source={require('../imgs/customer/baobiao.png')}/>
                    </TouchableOpacity>
                    <Text style={styles.custom}>客 户</Text>
                    <TouchableOpacity onPress={() => { this.setState({modalVisible: !this.state.modalVisible})}}>
                        <Image style={styles.icon} source={require('../imgs/customer/add.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.Nav}>
                    <TouchableOpacity style={styles.Nav_p} onPress={() => this.goPage_xiansuo()}>
                        <View style={styles.imgContainer}>
                            <Image style={styles.icon_nav} source={require('../imgs/customer/xiansuo.png')}/>
                        </View>
                        <Text style={styles.custom_sub}>线索</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Nav_p} onPress={() => this.goPage_gonghai()}>
                        <View style={[styles.imgContainer,{backgroundColor: '#FFBD00'}]}>
                            <Image style={styles.icon_nav} source={require('../imgs/customer/gonghai.png')}/>
                        </View>
                        <Text style={styles.custom_sub}>公海</Text>

                    </TouchableOpacity>
                </View>
                <View style={styles.subNav}>
                    <TouchableHighlight underlayColor={'#eee'} onPress={()=>{this.modelVisible()}}>
                        <View style={styles.subNav_sub}>
                            <Text style={this.state.switch == 1?{color: '#e4393c'}: null}>{this.state.messageVisible}</Text>
                            <Image style={[styles.subNav_img,this.state.switch == 1?{tintColor: '#e4393c'}:null]} source={require('../imgs/customer/arrowU.png')}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#eee'} style={[styles.subNav_sub,styles.subNav_sub_border]} onPress={()=>{this.setMessage(2)}}>
                        <Text style={this.state.switch == 2?{color: '#e4393c'}: null}>最近查看</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'#eee'} style={styles.subNav_sub_border} onPress={()=>this.props.navigation.navigate('Classify',{classify: this.state.classify,type: 'normal'})}>
                        <View style={styles.subNav_sub} >
                            <Image style={[styles.subNav_img,{marginRight: 4},this.state.classify.selected?{tintColor: '#e4393c'}: null]} source={require('../imgs/customer/shaixuan.png')}/>
                            <Text style={this.state.classify.selected?{color: '#e4393c'}: null}>筛选</Text>

                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{flex:1}}>
                    {this.message()}
                </View>
                {/* 按钮 新增*/}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this.setState({modalVisible: !this.state.modalVisible})}}
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
                                    <TouchableOpacity style={styles.model_up_in} onPress={() => {this.setState({modalVisible: !this.state.modalVisible});this.goPage_add_xiansuo()}}>
                                        <Image style={styles.icon_} source={require('../imgs/customer/add_xiansuo.png')}/>
                                        <Text style={styles.text_color}> 新增线索</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.model_up_in} onPress={() => {{this.setState({modalVisible: !this.state.modalVisible});this.goPage_customerAdd()}}}>
                                        <Image style={styles.icon_} source={require('../imgs/customer/add_customer.png')}/>
                                        <Text style={styles.text_color}> 新增客户</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>

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
                                <View style={{width:screenW,height:(screenH-274),opacity:0.4,backgroundColor:'#000',top:190,position:'absolute'}}></View>
                                <View style={styles.modelUp}>
                                    <TouchableHighlight underlayColor={'#eee'} style={styles.xinxiiala} onPress={()=>{this.selectMessage(1)}}>
                                        <Text>名称排序</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#eee'} style={styles.xinxiiala} onPress={()=>{this.selectMessage(2)}}>
                                        <Text>最新创建</Text>
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
        backgroundColor:'#fff'
    },
    icon: {
        width: 26,
        height: 26,
    },
    imgContainer: {
        height: 40,
        width: 40,
        borderRadius: 18,
        backgroundColor: '#4CA9FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    icon_nav: {
        height: 26,
        width: 26,
        tintColor: '#fff'
    },
    custom: {
        color: '#333333',
        fontSize: 18
    },
    Nav: {
        height:100,
        flexDirection :'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        borderTopColor:'#bbb',
        borderTopWidth: 1,
    },
    Nav_p:{
        width:screenW*0.333,
        justifyContent:'center',
        alignItems:'center',
    },
    custom_sub: {
        fontSize: 14,
        color: '#4b4b4b',
    },
    subNav: {
        height:40,
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        borderColor:'#ccc',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    subNav_sub:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:36,
        width:screenW/3,
    },
    subNav_sub_border:{
        borderLeftWidth: 1,
        borderColor:'#ccc',
    },
    subNav_subColor:{
        color:'#e15151',
    },
    subNav_img:{
        marginTop:3,
        marginLeft:4,
        width:15,
        height:15,
        tintColor: '#aaa'
    },
    //动态获取信息  排序 查看等
    scroll_message:{
        width:screenW,
        height:screenH*0.65
    },

    model:{
        width:120,
        height:90,
        position: 'absolute',
        right:3,
        top:48,
        backgroundColor:'#000',
        opacity:0.6,
        borderRadius:6
    },
    model_border:{
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        padding:17,
    },
    model_up:{
        width:120,
        height:90,
        position: 'absolute',
        right:3,
        top:48,
        borderRadius:6
    },
    model_up_in:{
        padding:10,
        flexDirection:'row',
        justifyContent:'center',
        borderRadius:6
    },
    text_color:{
        color:'#fff',
        fontSize:14
    },
    icon_:{
        width:22,
        height:22
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
        right:4,
        top:-11,

    },
    addCustomer:{
        flex:1,
        position:'absolute',
        bottom:0,
    },
    addCustomer_card:{
        width:screenW,
        height:screenH*0.24,
        backgroundColor:'#fff',
    },
    customerCard_content:{
        justifyContent:'center',
        alignItems:'center',
        height:screenH*0.08,
        width:screenW,
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
    },
    customerCard_content2:{
        borderBottomWidth:0,
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
        height:100,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center'
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
        height:105,
        position: 'absolute',
        left:0,
        top:190,
        backgroundColor:'#fff'
    },
    xinxiiala:{
        width:screenW,
        height:35,
        paddingLeft:25,
        borderColor:'#e3e3e3',
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
        justifyContent: 'center',
        alignItems: 'center'
    }
});

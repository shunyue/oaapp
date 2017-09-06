//审批首页
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    Platform,
    ScrollView,
    ListView,
    Alert,
    TouchableWithoutFeedback,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
const screenH = Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Modal from 'react-native-modal'  //下拉

export default class Approval extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listview:[],
            isModalVisible: false  //下拉
        };
    }

    componentDidMount(){

        this.subscription = DeviceEventEmitter.addListener('com_user_id',(value) => {
            //console.log(value['user_id']);
           // console.log(value);
            var url = config.api.base + config.api.select_approve;
            request.post(url,{
                company_id: value['company_id'],//公司id
                user_id:value['user_id'],//公司id
            }).then((responseText) => {
                if(responseText.sing==1){
                    this.setState({
                        listview:responseText.data,
                    })
                }
            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            })
        })
        this.getNet();
    }


    //自己发起 待审批 和 待我审批
    getNet(){



        var url = config.api.base + config.api.select_approve;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//登录者id
        }).then((responseText) => {

           // alert(JSON.stringify (responseText.data))
            if(responseText.sing==1){
                this.setState({
                    listview:responseText.data,
                })
            }


        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }


    //下拉
    _showModal(visible) {
        this.setState({isModalVisible: visible});
    }

    back() {
       // this.props.navigation.goBack(null);
        this.props.navigation.navigate('Home');
    }

    //审批筛选
    newBulidApproval() {
        this.props.navigation.navigate('NewBulidApproval',{user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id})
    }
    //发起审批
    faqiApproval() {
        this.props.navigation.navigate('Approvalfaqi')
    }

    //我接收
    my_receive(){
        var url = config.api.base + config.api.select_approve_already;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//人员id
        }).then((responseText) => {

            //alert(JSON.stringify(responseText.data));
            if(responseText.sing==1){
                this.setState({
                    listview:responseText.data,
                })
            }


        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    //我发起
    my_faqi(){
        var url = config.api.base + config.api.select_approve_myfaqi;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//公司id
        }).then((responseText) => {
            //  alert(JSON.stringify (responseText.data))
            if(responseText.sing==1){
                this.setState({
                    listview:responseText.data,
                })
            }


        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    //待我审批
    my_approve(){
        var url = config.api.base + config.api.select_approve_attime;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//公司id
        }).then((responseText) => {
           // alert(JSON.stringify (responseText.data))
            if(responseText.sing==1){
                this.setState({
                    listview:responseText.data,
                })
            }


        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }


    //判断是 表单  合同 还是合同回款  g是msg值 当时等于我审批时 页面出现 同意还是拒绝
    approve_detail(e,g){
         // var g='等待我审批';

        var url = config.api.base + config.api.judge_approve_type;
        request.post(url,{
           example_id:e,
        }).then((responseText) => {

            //表单
            if(responseText==1){
                this.props.navigation.navigate('form_approve',{example_id:e,user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id,approve_condition:g});
            //合同
            }else if(responseText==2){
                this.props.navigation.navigate('contract_approve',{example_id:e,user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id,approve_condition:g});
            //合同回款
            }else if(responseText==3){
                this.props.navigation.navigate('return_money_approve',{example_id:e,user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id,approve_condition:g});
            }

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }
    render() {

        var list=[];
        for(var i in this.state.listview){
           list.push(

               <View key={i}>
               <TouchableHighlight onPress={this.approve_detail.bind(this,this.state.listview[i]['example_id'],this.state.listview[i]['msg'])}>
                   <View style={[styles.rowCom1]}>
                       <View style={[styles.eleTopCom,{justifyContent:'space-between'}]}>

                           <View style={{flexDirection:'row'}}>
                               <Image style={{width:40,height:40}} source={{uri:this.state.listview[i]['icon']}}/>
                               <View style={{marginLeft:10}}>
                                   <Text>{this.state.listview[i]['whosthing']}</Text>
                                   <Text
                                       style={[styles.elefontCom,this.state.listview[i]['msg'] == '等待我审批'?{color: '#e4393c'}: null]}>{this.state.listview[i]['msg']}</Text>
                               </View>
                           </View>
                           <View style={{paddingRight:15}}>
                               <Text style={{fontSize:10,paddingTop:10}}>{this.state.listview[i]['time']}</Text>
                           </View>
                       </View>
                   </View>
               </TouchableHighlight>
                   </View>

           )

        }


        return (
            <View style={styles.ancestorCon}>
                {/*导航栏*/}
                <View style={styles.nav}>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#d5d5d5"
                    >
                        {/**/}
                        <View style={styles.navltys}>
                            <Image source={require('../../imgs/navxy.png')}/>
                            <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
                        </View>

                    </TouchableHighlight>
                    <Text style={styles.fSelf}>审批</Text>
                    <TouchableHighlight

                        onPress={()=>this.newBulidApproval()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Image source={require('../../imgs/navld16.png')}/>
                        </View>

                    </TouchableHighlight>
                </View>
                {/*内容主题*/}
                <ScrollView style={[styles.childContent,{marginBottom:30}]}>


                        <TouchableHighlight
                            onPress={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}
                            underlayColor="#d5d5d5"
                        >

                                <View style={[styles.rowCom,styles.rowCom_]}>
                                    <Text style={[styles.eleFontCon]}>我的审批</Text>
                                    <Image style={{width:15,height:15}} source={require('../../imgs/customer/arrowU.png')}/>
                                </View>

                        </TouchableHighlight>


                    {/*数据*/}
                                {list}
                    {/*数据*/}

                </ScrollView>


                        <View style={[styles.rowCom,styles.rowCom_foot]}>
                            <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/shenpi/office_shenpi.png')}/>
                            <Text style={[styles.eleFontCon]}  onPress={() => { this.faqiApproval()}}>发起审批</Text>
                        </View>


                {/*分类模型下拉*/}
                <View>
                    <Modal
                        backdropOpacity={0}
                        animationIn={'slideInDown'}
                        animationOut={'slideOutUp'}
                        isVisible={this.state.isModalVisible}
                    >
                            <View style={{flex:1}}>
                                <View style={{width:screenW,height:(screenH-140),opacity:0.4,backgroundColor:'#000',top:75,position:'absolute'}}></View>
                                <View style={styles.model_up}>
                                    {/* 下拉框 内容*/}

                                    <TouchableWithoutFeedback
                                        onPress = {()=>{this.setState({isModalVisible: !this.state.isModalVisible});this.getNet()}}
                                    >
                                    <View style={[styles.rowCom]}>
                                        <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/customer/arrowU.png')}/>
                                        <Text style={[styles.eleFontCon]}>我的审批</Text>
                                    </View>
                                    </TouchableWithoutFeedback>

                                    <TouchableWithoutFeedback
                                        onPress = {()=>{this.setState({isModalVisible: !this.state.isModalVisible});this.my_receive()}}
                                    >
                                    <View style={[styles.rowCom,styles.rowCom_padd]}>
                                        <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/customer/arrowU.png')}/>
                                        <Text style={[styles.eleFontCon]}>我收到的</Text>
                                    </View>
                                    </TouchableWithoutFeedback>

                                    <TouchableWithoutFeedback
                                        onPress = {()=>{this.setState({isModalVisible: !this.state.isModalVisible});this.my_faqi()}}
                                    >

                                    <View style={[styles.rowCom,styles.rowCom_padd]}>
                                        <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/customer/arrowU.png')}/>
                                        <Text style={[styles.eleFontCon]}>我发起的</Text>
                                    </View>
                                    </TouchableWithoutFeedback>

                                    <TouchableWithoutFeedback
                                        onPress = {()=>{this.setState({isModalVisible: !this.state.isModalVisible});this.my_approve()}}
                                    >
                                    <View style={[styles.rowCom,styles.rowCom_padd]}>
                                        <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/customer/arrowU.png')}/>
                                        <Text style={[styles.eleFontCon]}>待我审批</Text>
                                    </View>
                                    </TouchableWithoutFeedback>


                                </View>
                            </View>

                    </Modal>
                </View>
                {/*分类模型下拉*/}

            </View>
        )
            ;
    }
}

const styles = StyleSheet.create({
    navltys: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: (Platform.OS === 'ios') ? 50 : 30,
        alignItems: 'center',
    },
    navltyszt: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#e4393c',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    ancestorCon: {//祖先级容器
        flex: 1,
        backgroundColor: '#EEEFF4',

    },
    nav: {//头部导航
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    sz: {//导航图标
        width: 30,
        height: 30
    },
    fSelf: {//导航字体相关
        color: '#000',
        //height: 30,
        fontSize: 16
    },
//    主题内容
    childContent: {//子容器页面级
        flex: 1,
        backgroundColor: '#fff',
    },
//    公共行级元素
    common: {
        flex: 1,
    },

    //分类模型下拉
    model_up:{
        width:screenW,
        height:140,
        position: 'absolute',
        left:0,
        top:75,
        backgroundColor:'#fff'
    },

    rowCom: {//祖级-行
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 7,
        paddingBottom: 7,
        borderColor:'#F1F2F3',
        flexDirection:'row',
        alignItems:'center',
    },
    rowCom_: {//祖级-行
        justifyContent:'space-between',
        borderBottomWidth:1,
    },
    rowCom_padd:{
        marginLeft:25,
        borderTopWidth:1,
    },
    rowCom_foot:{
        justifyContent:'center',
        borderTopWidth:1,
        position:'absolute',
        bottom:0,
        backgroundColor: '#f7f7f7',
        width:screenW,
        borderColor:'#F1F2F3',
        flexDirection:'row',
        alignItems:'center',
        height:40,

    },

    //divCom: {//祖先级-区域
    //    flex:1,
    //},
    rowCom1: {//祖级-行
        paddingLeft:15,
        paddingRight:15,
        paddingTop:6,
        paddingBottom:6,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#F1F2F3',
    },

    eleTopCom: {//父级-块
        flexDirection: 'row',
        marginBottom:5
    },

    elefontCom:{//子级-E
        fontSize:10,
        paddingTop:6,
        color:'#969696',
    },

});

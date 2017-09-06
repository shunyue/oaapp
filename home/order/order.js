//订单首页  对合同表数据进行 筛选
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
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,

    DeviceEventEmitter,
} from 'react-native';

import Modal from 'react-native-modal';


import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrow: false,
            message:"创建时间",
            isModalVisible:false,
            colorChange:[true,false,false,false],
            scroll:[false,true,false],
            load:false,//判断数据是否存在
            role_id:'',//角色id
            contractdata:[],//合同数据


            custome_id:[],//客户的id
            approve_status:[],//审批状态
            returnmoney_status:[],//回款状态
            approve_time:'',//审批时间
            approve_ks_time:'',//自定义的开始时间
            approve_js_time:'',//自定义的结束时间
            faqi_people:[],//发起人员id



        };
    }
    _showModal(visible) {
        this.setState({isModalVisible: visible});
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
                <View style={{marginTop:3}}>
                    <Image style={{width:12,height:12}} source={require('../../imgs/customer/arrowU.png')}/>
                </View>
            )
        }else if(this.state.arrow==true){
            return(
                <View style={{marginTop:3}}>
                    <Image style={{width:12,height:12}} tintColor={'#e15151'} source={require('../../imgs/customer/arrowD.png')}/>
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
    //动态信息下拉
    selectMessage(contmy){
        if(contmy==1){
            this.state.message="创建时间"
        }else if(contmy==2){
            this.state.message="订单金额"
        }

    }



    //返回
    back(){
        this.props.navigation.goBack(null);
    }



    //订单筛选
    order_filtrate(){
        this.props.navigation.navigate('order_filtrate',{user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id})
    }

    //合同详情
    contract_detail(e){
        this.props.navigation.navigate('contract_detail',{contract_id:e,company_id:this.props.navigation.state.params.company_id,user_id:this.props.navigation.state.params.user_id})
    }


    //创建时间排序
    create_timeby_contract(){
        var url1 = config.api.base + config.api.order_select_contract_bytime;
        request.post(url1,{
            user_id: this.props.navigation.state.params.user_id,//人员id
            company_id: this.props.navigation.state.params.company_id,//公司id


            custome_id:this.state.custome_id,//客户的id
            approve_status:this.state.approve_status,//审批状态
            returnmoney_status:this.state.returnmoney_status,//回款状态
            approve_time:this.state.approve_time,//审批时间
            approve_ks_time:this.state.approve_ks_time,//自定义的开始时间
            approve_js_time:this.state.approve_js_time,//自定义的结束时间
            faqi_people:this.state.faqi_people,//发起人员id




        }).then((responseText) => {

            //alert(JSON.stringify(responseText));
            if(responseText.sing==1){
                this.setState({
                    load: true,
                    contractdata:responseText.data,
                })
            }else{
                toast.bottom('没有数据');
            }
        }).catch((error)=>{
            toast.bottom('没有数据');
        })

    }

    //合同金额
    orderjine_contract(){
        var url1 = config.api.base + config.api.order_select_contract_byjine;
        request.post(url1,{
            user_id: this.props.navigation.state.params.user_id,//人员id
            company_id: this.props.navigation.state.params.company_id,//公司id

            custome_id:this.state.custome_id,//客户的id
            approve_status:this.state.approve_status,//审批状态
            returnmoney_status:this.state.returnmoney_status,//回款状态
            approve_time:this.state.approve_time,//审批时间
            approve_ks_time:this.state.approve_ks_time,//自定义的开始时间
            approve_js_time:this.state.approve_js_time,//自定义的结束时间
            faqi_people:this.state.faqi_people,//发起人员id

        }).then((responseText) => {
           // alert(JSON.stringify(responseText));
            if(responseText.sing==1){
                this.setState({
                    load: true,
                    contractdata:responseText.data,
                })
            }else{
                toast.bottom('没有数据');
            }
        }).catch((error)=>{
            toast.bottom('没有数据');
        })

    }

    componentDidMount(){
        //订单筛选后的合同数据
        this.subscription = DeviceEventEmitter.addListener('order_data',(value) => {
            this.setState({
                load: true,
                contractdata:value['data'],

                custome_id:value['custome_id'],//客户的id
                approve_status:value['approve_status'],//审批状态
                returnmoney_status:value['returnmoney_status'],//回款状态
                approve_time:value['approve_time'],//审批时间
                approve_ks_time:value['approve_ks_time'],//自定义的开始时间
                approve_js_time:value['approve_js_time'],//自定义的结束时间
                faqi_people:value['faqi_people'],//发起人员id

            })
        })

        this.getNet();
    }


    //登录者的角色  判断是有 选择发起人员的 选项
    getNet(){
        var url = config.api.base + config.api.judge_role;
        request.post(url,{
            user_id:this.props.navigation.state.params.user_id,//人员id
        }).then((responseText) => {
            if(responseText.sing==1){
                this.setState({
                    role_id:responseText.role_id,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })


        //合同列表
            var url1 = config.api.base + config.api.order_select_contract;
            request.post(url1,{
                user_id: this.props.navigation.state.params.user_id,//人员id
                company_id: this.props.navigation.state.params.company_id,//公司id
            }).then((responseText) => {
               // alert(JSON.stringify(responseText));
                if(responseText.sing==1){
                    this.setState({
                        load: true,
                        contractdata:responseText.data,
                    })
                }else{
                    toast.bottom('没有数据');
                }
            }).catch((error)=>{
                toast.bottom('没有数据');
            })

    }





    render() {

        //合同
        if(this.state.load){
            var contractlist=this.state.contractdata;
            var list=[];
            for(var i in contractlist){
                var contract_status;
                if(contractlist[i].status==1){
                    contract_status='待审批';
                }else if(contractlist[i].status==2){
                    contract_status='审批通过';
                }
                else if(contractlist[i].status==3){
                    contract_status='审批拒绝';
                }
                else if(contractlist[i].status==4){
                    contract_status='已撤销';
                }

                list.push(
                    <View key={i}>

                        <TouchableHighlight onPress={this.contract_detail.bind(this,contractlist[i].id)}>

                            <View>

                                <View style={[styles.place,styles.borderTop1,{height:40,marginTop:10,backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                    <Text style={{fontSize:14,color:'#333'}}>{contractlist[i].contract_name}</Text>
                                    <Text>{contract_status}</Text>
                                </View>

                                <View style={[styles.borderTop1,styles.borderBottom1,{backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                    <View style={[styles.place,styles.borderBottom1,{height:40,backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                        <Text style={{fontSize:14,color:'#333'}}>合同金额</Text>
                                        <Text style={{color:'#333'}}>{contractlist[i].contract_jine}</Text>
                                    </View>

                                    <View style={[styles.place,{height:30,backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                        <Text style={{fontSize:14,color:'#333'}}>客户名称</Text>
                                        <Text style={{color:'#333'}}>{contractlist[i].cus_name}</Text>
                                    </View>
                                    <View style={[styles.place,{height:30,backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                        <Text style={{fontSize:14,color:'#333'}}>签单业务员</Text>
                                        <Text style={{color:'#333'}}>{contractlist[i].name}</Text>
                                    </View>
                                    <View style={[styles.place,styles.borderTop1,{height:36,backgroundColor:'#fff',paddingLeft:15,paddingRight:15,justifyContent:'flex-start'}]}>
                                        <Text style={{marginRight:15}}>{contractlist[i].name}</Text>
                                        <Text>{contractlist[i].time}</Text>
                                    </View>
                                </View>


                            </View>

                        </TouchableHighlight>
                    </View>
                )
            }
        }else{
            var list=[];
            list.push(<Text>没有数据</Text>);
        }

        //合同




        return (
            <View style={styles.ancestorCon}>
                {/*导航栏*/}
                <View style={styles.nav}>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Image source={require('../../imgs/navxy.png')}/>
                            <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
                        </View>

                    </TouchableHighlight>
                    <Text style={[styles.fSelf,styles.selfPosCenter]}>{this.state.role_id==1?'我的订单':'全部订单'}</Text>

                </View>
                <View style={[styles.flex_row,styles.borderBottom,{backgroundColor:'#fff',justifyContent:'center'},styles.padding2]}>
                    <TouchableHighlight style={[styles.subNav_sub,{height:35}]} underlayColor={'transparent'} onPress={()=>{this.setState({arrow:!this.state.arrow});this.setState({isModalVisible: !this.state.isModalVisible});}}>
                        <View style={[styles.flex_row,{backgroundColor:'#fff',justifyContent:'center'},styles.padding2]}>
                            <Text style={this.state.arrow?{color:'#e15151',marginRight:5}:{marginRight:5}}>{this.state.message}</Text>
                            {this.arrow()}
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.subNav_sub]} underlayColor={'#fff'} onPress={() => {this.order_filtrate()}}>
                        <View style={[styles.subNav_sub,{borderLeftWidth:1,borderColor:"#ccc",height:35,}]}>
                            <Image style={styles.subNav_img} source={require('../../imgs/customer/arrowU.png')}/>
                            <Text> 筛选</Text>
                        </View>
                    </TouchableHighlight>



                </View>
                {/*内容主题*/}
                <ScrollView>
                    <View style={[styles.common]}>


                        {list}

                    </View>
                </ScrollView>
                {/*  下拉*/}
                <View>
                    <Modal
                        backdropOpacity={0}
                        animationIn={'slideInDown'}
                        animationOut={'slideOutUp'}
                        isVisible={this.state.isModalVisible}
                        >
                        <TouchableWithoutFeedback onPress={() => {this.setState({isModalVisible: !this.state.isModalVisible});this.setState({arrow:!this.state.arrow});}}>
                            <View style={{flex:1}}>
                                <View style={{width:screenW,height:(screenH-75),opacity:0.4,backgroundColor:'#000',top:76,position:'absolute'}}></View>
                                <View style={styles.modelUp}>
                                    <TouchableHighlight underlayColor={'#eee'} onPress={()=>{this.selectMessage(1);this.arrowSub(0) ;this.setState({arrow:!this.state.arrow});this.setState({isModalVisible: !this.state.isModalVisible});this.create_timeby_contract()}}>
                                        <View style={[styles.xinxiiala]}>
                                            <Text style={this.state.colorChange[0]?{color:'#e15152'}:{color:'#333'}}>创建时间</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#eee'} onPress={()=>{this.selectMessage(2);this.arrowSub(1) ;this.setState({arrow:!this.state.arrow});this.setState({isModalVisible: !this.state.isModalVisible});this.orderjine_contract()}}>
                                        <View style={[styles.xinxiiala]}>
                                            <Text style={this.state.colorChange[1]?{color:'#e15152'}:{color:'#333'}}>订单金额</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            </View>
        )
            ;
    }
}


const styles = StyleSheet.create({
    ancestorCon: {//body
        flex: 1,
        backgroundColor: '#eee'
    },
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

    nav: {//祖先级-头部导航
        height: 40,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    navltysImgPos: {//私有级-设置定位
        position: 'absolute',
        right: 6,
    },
    selfPosCenter: {//私有级-设置居中
        width: screenW - 88,
        textAlign: 'center'
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
//    公共行级元素
    common: {
        flex: 1,
    },
    navltysImg: {
        width: 24,
        height: 24
    },


    modelUp:{
        width:screenW,
        height:80,
        position: 'absolute',
        left:0,
        top:76,
        backgroundColor:'#fff'
    },
    xinxiiala:{
        width:screenW,
        height:35,
        paddingLeft:15,
        borderColor:'#ccc',
        borderBottomWidth:1,
        flexDirection:'row',
        alignItems:'center',
    },
    flex_row :{
        flexDirection:'row',
        alignItems:'center',
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'
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
    subNav_sub_border:{
        borderColor:'#c5c5c5',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    subNav_subColor:{
        color:'#555',
    },
    subNav_img:{
        width:13,
        height:13,
        marginTop:2,
        marginLeft:4,
        marginRight:4
    },
    subNav_sub:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:screenW*0.5,
    },



    place:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    borderTop1:{
        borderTopWidth:1,
        borderColor:'#ccc'

    },
    borderBottom1:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
});

/*
* 合同回款明细
*
* */
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
    DeviceEventEmitter,
    TouchableWithoutFeedback,
    Platform,
    } from 'react-native';


import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import { StackNavigator,TabNavigator } from "react-navigation";
import Modal from 'react-native-modal'
import Header from '../../common/header';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;


export default class return_money_detail extends Component {

    constructor(props,status,status_) {
        super(props);
        this.state = {
            modalVisible: false,//添加模型
            show: false,//新增客户模型
            Value:'',
            return_money_data:[],//合同回款数据

            return_total_price:'',//合同回款金额
            contract_name:'',//合同名称
            contract_jine:'',//合同金额

           display_new_return_money:false,//是否显示 新增回款按钮 默认是true
        };
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('contract_id',(value) => {

            var url = config.api.base + config.api.return_money_record;
            request.post(url,{
                contract_id: value,//合同id
            }).then((responseText) => {

                if(responseText.sing==1){
                    this.setState({
                        return_money_data:responseText.data,
                        return_total_price:responseText.return_total_price,
                        contract_name:responseText.contract_name,
                        contract_jine:responseText.contract_jine,
                    })
                }else{
                    toast.center('改合同目前没有回款');
                }

            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            })
        })
        this.getNet()
    }

    getNet(){
        var url = config.api.base + config.api.return_money_record;
        request.post(url,{
            contract_id: this.props.navigation.state.params.contract_id,//合同id
        }).then((responseText) => {

            if(responseText.sing==1){
                this.setState({
                    return_money_data:responseText.data,
                    return_total_price:responseText.return_total_price,
                    contract_name:responseText.contract_name,
                    contract_jine:responseText.contract_jine,
            })
            }else{
                toast.center('改合同目前没有回款');
            }

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })



        //判断当前合同的创造者 与等路者是不是同一个 是同一个才能新建回款
        //给订单中 查看合同详情使用
        var url1 = config.api.base + config.api.create_idby_contract_id;
        request.post(url1,{
            contract_id: this.props.navigation.state.params.contract_id,//合同id
        }).then((responseText) => {
            if(responseText==this.props.navigation.state.params.user_id){
                this.setState({
                    display_new_return_money:true
                })
            }

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    //新建回款记录
    new_return_money(){
        this.props.navigation.navigate('new_return_money',{contract_id:this.props.navigation.state.params.contract_id,company_id:this.props.navigation.state.params.company_id,company_id:this.props.navigation.state.params.company_id,user_id:this.props.navigation.state.params.user_id})
    }

    OpBack() {
        this.props.navigation.goBack(null)
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    setVisibleModal(visible) {
        this.setState({show: visible});
    }



    render() {


        var list=[];
        for(var i in this.state.return_money_data ){

            var approve_status
            if(this.state.return_money_data[i]['status']==1){
                approve_status='待审批';
            }else if(this.state.return_money_data[i]['status']==2){
                approve_status='审批通过';
            }else if(this.state.return_money_data[i]['status']==3){
                approve_status='审批拒绝';
            }
            list.push(
                 <View>
                <View style={{flexDirection:'row',justifyContent:'flex-start',borderColor:'#d5d5d5',borderTopWidth:1,padding:10}}>
                    <Text style={{backgroundColor:'#b7cb68',width:3,height:20,marginRight:10}}></Text>
                    <Text style={{color:'#333'}}>第{i-(-1)}期</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'flex-start',borderColor:'#d5d5d5',borderTopWidth:1,padding:10,paddingBottom:20}}>
        <View>
            <Image  style={{width:22,height:22,margin:2}} source={require('../../imgs/customer/backMoney.png')}/>
        </View>
            <View>
            <View style={{flexDirection:'row',justifyContent:'space-between',borderColor:'#d5d5d5',width:screenW*0.88,paddingTop:4,paddingBottom:10,paddingRight:screenW*0.06}}>
            <Text style={{color:'#333'}}>回款记录</Text>
            <Text style={{color:'#333'}}>{this.state.return_money_data[i]['time']}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',borderColor:'#d5d5d5',width:screenW*0.88,paddingBottom:10,paddingRight:screenW*0.06}}>
            <Text style={{color:'#333'}}>预计金额</Text>
            <Text style={{color:'#333'}}>{this.state.return_money_data[i]['return_price']}元</Text>
            </View>

            <View style={{flexDirection:'row',justifyContent:'space-between',borderColor:'#d5d5d5',width:screenW*0.88,paddingLeft:screenW*0.06,paddingRight:screenW*0.06}}>
        <Text style={{color:'#333'}}>回款审核</Text>
            <Text style={{color:'#333'}}>{approve_status}</Text>
            </View>

            </View>
            </View>

             </View>

            )
        }









        const {state} = this.props.navigation;
        return (
            <View style={styles.ancestorCon}>
                <Header title="回款"
                        navigation={this.props.navigation}
                        source={require('../../imgs/navtx.png')}
                        onPress={() => { this.setState({modalVisible: !this.state.modalVisible})}}/>
                <ScrollView>
                <View style={{width:screenW,height:screenH*0.15,backgroundColor:'#fff',marginTop:8,justifyContent:'center',alignItems:'center'}}>
                    <Text>回款合计(元)</Text>
                    <Text style={{fontSize:20,color:'#e15151',marginTop:10}}>{this.state.return_total_price }</Text>
                </View>
                <View style={{width:screenW,backgroundColor:'#fff',}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',borderColor:'#d5d5d5',borderTopWidth:1,backgroundColor:'#efefef',padding:10}}>
                        <Text style={{color:'#333'}}>合同：{this.state.contract_name}</Text>
                        <Text></Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-between',borderColor:'#d5d5d5',borderTopWidth:1,height:30,alignItems:'center',paddingLeft:15,paddingRight:15}}>
                        <Text style={{color:'#333'}}>总计划</Text>
                        <Text style={{color:'#333'}}>{this.state.contract_jine}</Text>
                    </View>

                    {list}

                </View>
                    </ScrollView>



                {/* 按钮 新增*/}

                  <View >
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {this.setState({modalVisible: !this.state.modalVisible})}}
                    >
                        <TouchableWithoutFeedback
                            onPress = {()=>this.setState({modalVisible: !this.state.modalVisible})}
                        >
                            <View style={{width:screenW,height:screenH}}>
                                <View style={styles.model}>
                                    <Text style={styles.model_border}></Text>
                                </View>

                              <View style={styles.model_up}>
                                    <View  style={styles.icon_san}>
                                        <Image style={styles.icon_2} source={require('../../imgs/customer/background_san.png')}/>
                                    </View>

                                    <TouchableHighlight underlayColor={'transparent'}  onPress={() => {this.setState({modalVisible: !this.state.modalVisible});this.new_return_money()}}>
                                        <View style={[styles.model_up_in]}>
                                            <Image style={styles.icon_1} source={require('../../imgs/customer/add_business.png')}/>
                                            <Text style={styles.text_color}> 新建回款记录</Text>

                                        </View>
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
    ancestorCon:{
        flex: 1,
        backgroundColor: '#e6e6e6',
    },
    model:{
        width:130,
        height:40,
        position: 'absolute',
        right:10,
        top:Platform.OS==='ios'?70:60,
        backgroundColor:'#000',
        opacity:0.6,
        borderRadius:3,
    },
    model_border:{
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        padding:17,
    },
    model_up:{
        width:130,
        height:80,
        position: 'absolute',
        right:10,
        top:Platform.OS==='ios'?70:60,
    },
    model_up_in:{
        height:40,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
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
        position:'absolute',
        top:0,
        right:1
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
});

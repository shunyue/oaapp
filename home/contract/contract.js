/*
* 合同首页 合同列表
* */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    ListView,
    DeviceEventEmitter,
    TouchableHighlight,
    Platform,
} from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';
import Header from '../../common/header';
const screenW = Dimensions.get('window').width;
export default class Contract  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contractdata:[],
            load:false,
            load1:false,
        };
    }
    //耗时操作放在这里面
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('user_id',(value) => {
            var url = config.api.base + config.api.select_contract;
            request.post(url,{
                user_id: value,//登录者id
            }).then((responseText) => {

                if(responseText.sing==1){
                    this.setState({
                        load: true,
                        load1: true,
                        contractdata:responseText.data,
                    })
                }else{
                    this.setState({
                        load1: true,
                    })
                }
            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            })
        })
        this.getNet();
    }

    getNet(){
        var url = config.api.base + config.api.select_contract;
        request.post(url,{
            user_id: this.props.navigation.state.params.user_id,//人员id
        }).then((responseText) => {
            if(responseText.sing==1){
                this.setState({
                    load: true,
                    load1: true,
                    contractdata:responseText.data,
                })
            }else{
                this.setState({
                    load1: true,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    OpBack() {
        this.props.navigation.goBack(null)
    }
    newBulidContract() {
        this.props.navigation.navigate('NewBulidContract',{user_id:this.props.navigation.state.params.user_id
            ,company_id:this.props.navigation.state.params.company_id
        })
    }
     //合同详情
    contract_detail(e){
        this.props.navigation.navigate('contract_detail',{contract_id:e,company_id:this.props.navigation.state.params.company_id,user_id:this.props.navigation.state.params.user_id})
    }


    render() {
        if(!this.state.load1){
            return (<Loading/>);
        }

        var contractlist=this.state.contractdata;
        var list=[];
        if(this.state.load){
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
                        <View style={{marginTop:8,marginBottom:5}}>
                            <TouchableHighlight
                                underlayColor={'#fefefe'}
                                onPress={this.contract_detail.bind(this,contractlist[i].id)}>
                                <View style={[styles.place,styles.borderTop,styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                    <Text style={{fontSize:14,color:'#333'}}>{contractlist[i].contract_name}</Text>
                                    <Text>{contract_status}</Text>
                                </View>
                            </TouchableHighlight>

                        </View>
                        <TouchableHighlight
                            underlayColor={'#fefefe'}
                            onPress={this.contract_detail.bind(this,contractlist[i].id)}>
                            <View style={[styles.borderTop,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
                                <View style={[styles.place,styles.borderBottom,{height:40,backgroundColor:'#fff',paddingLeft:15,paddingRight:15}]}>
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
                                <View style={[styles.place,styles.borderTop,{height:36,backgroundColor:'#fff',paddingLeft:15,paddingRight:15,justifyContent:'flex-start'}]}>
                                    <Text style={{marginRight:15}}>{contractlist[i].name}</Text>
                                    <Text>{contractlist[i].time}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            }
        }else{
           list.push(
               <View style={{marginLeft:150,marginTop:100}}>
                   <Image  style={{width:48,height:48,marginLeft:15,marginRight:20}}  source={require('../../imgs/customer/empty-content.png')}/>
                   <Text style={{marginLeft:7}}>暂无数据</Text>
                </View>
           )
        }
        return (
            <View style={styles.ancestorCon}>
                <Header title="合同"
                        navigation={this.props.navigation}
                        source={require('../../imgs/navtx.png')}
                        onPress={()=>this.newBulidContract()}/>

                {list}
           </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    container: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'center',

    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:15,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },

    back_icon:{
        width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    add:{
        width:27,
        height:27,
    },
    backwz:{
        position:'absolute',
        top:5,
        left:25,
        color:'red',
    },
    place:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'

    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
});
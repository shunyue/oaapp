//合同 详情
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
    Dimensions,
    ListView,
    Alert,
    TextInput,
    DeviceEventEmitter,
    TouchableOpacity,
    Picker,
} from 'react-native';
const screenW = Dimensions.get('window').width;

import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class newBulidContract extends Component {

    constructor(props) {
        super(props);
        this.state={
            signtime:'',//签订日期
            customer_name:'',//客户名称
            customer_linkman_name:'',// 客户联系人姓名
            signman_name:'',//签单人姓名
            contract_name:'',//合同名称
            contract_jine:'',//合同金额
            approve_status:'',//审批状态
            approve_status_num:'',//审批状态

            return_money:'',//回款总金额
            product_info:[],//产品信息
        };
    }


    componentDidMount() {
        this.getNet()
    }

    getNet(){


        var url = config.api.base + config.api.contract_detail;
        request.post(url,{
            contract_id: this.props.navigation.state.params.contract_id,//合同id
        }).then((responseText) => {

            if(responseText.sing==1){
                this.setState({
                    signtime:responseText.contract_data[0]['time'],//签订日期
                    customer_name:responseText.contract_data[0]['cus_name'],//客户名称
                    customer_linkman_name:responseText.contract_data[0]['con_name'],// 客户联系人姓名
                    signman_name:responseText.contract_data[0]['name'],//签单人姓名
                    contract_name:responseText.contract_data[0]['contract_name'],//合同名称
                    contract_jine:responseText.contract_data[0]['contract_jine'],//合同金额
                    approve_status:responseText.contract_data[0]['status'],//审批状态

                    product_info:responseText.product_data,//产品信息
                    return_money:responseText.return_money_data//回款总金额
                })
            }else{
                toast.bottom('网络连接失败，请检查网络后重试');
            }

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }


    back() {
        this.props.navigation.goBack(null);
    }


    //审批详情  将合同id 和基本信息传递过去
    approve_detail(){

        this.props.navigation.navigate('approve_detail',{contract_id:this.props.navigation.state.params.contract_id,customer_name:this.state.customer_name,customer_linkman_name:this.state.customer_linkman_name,contract_name:this.state.contract_name,contract_jine:this.state.contract_jine,approve_status:this.state.approve_status,signman_name:this.state.signman_name,signtime:this.state.signtime})
    }

    //回款详情  将合同id  和总的回款金额 合同名称 合同总金额 传递过去 公司id
    return_money_detail(){
        this.props.navigation.navigate('return_money_detail',{contract_id:this.props.navigation.state.params.contract_id,return_money:this.state.return_money,contract_name:this.state.contract_name,contract_jine:this.state.contract_jine,company_id:this.props.navigation.state.params.company_id,user_id:this.props.navigation.state.params.user_id})
    }


    //更多
    submmit(){
       alert(222);
    }


    render() {
        //产品列表
        var product_list=[];
        for(var i in this.state.product_info ){

            product_list.push(
                <View key={i}>

                    <View style={[styles.divRowCom1]}>
                        <Text style={[styles.divFontCom]}>产品信息{i-(-1)}</Text>
                    </View>


                    <View style={[styles.divRowCom]}>
                    <Text style={[styles.divFontCom]}>产品名称</Text>
                    <TextInput
                        style={styles.inputStyle}
                        underlineColorAndroid={'transparent'}
                        editable={false}
                        placeholderTextColor="#A2A2A2"
                        value={this.state.product_info[i]['product_name']}

                    />
                </View>


                <View style={[styles.divRowCom]}>
                <Text style={[styles.divFontCom]}>单价</Text>
                <TextInput
            style={styles.inputStyle}
            underlineColorAndroid={'transparent'}
            placeholderTextColor="#A2A2A2"
            editable={false}
            value={this.state.product_info[i]['product_price']}

                />
                </View>

                <View style={[styles.divRowCom]}>
                <Text style={[styles.divFontCom]}>数量</Text>
                <TextInput
            style={styles.inputStyle}
            underlineColorAndroid={'transparent'}
            placeholderTextColor="#A2A2A2"
            value={this.state.product_info[i]['product_count']}
                />
                </View>

                <View style={[styles.divRowCom]}>
                <Text style={[styles.divFontCom]}>总价</Text>
                <TextInput
            style={styles.inputStyle}
            underlineColorAndroid={'transparent'}
            placeholderTextColor="#A2A2A2"
            value={this.state.product_info[i]['product_total']}
                />
                </View>

                    </View>

        );
        }

        var contract_status;
        if(this.state.approve_status==1){
            contract_status='待审批';
        }else if(this.state.approve_status==2){
            contract_status='审批通过';
        }
        else if(this.state.approve_status==3){
            contract_status='审批拒绝';
        }
        else if(this.state.approve_status==4){
            contract_status='已撤销';
        }

        return (
            <View style={styles.body}>
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
                    <Text style={styles.fSelf}>合同详情</Text>
                    <TouchableHighlight

                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Text  onPress={this.submmit.bind(this)} style={styles.navFont}>更多</Text>
                        </View>

                    </TouchableHighlight>
                </View>



                <ScrollView style={styles.childContent}>
                    <View style={[styles.ancestorCon]}>
                        <View style={[styles.divCom]}>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>审批状态</Text>

                                <Text style={{marginRight:10}}>{contract_status}</Text>
                                <View>
                                    <TouchableHighlight  onPress={()=>this.approve_detail()}>
                                    <Text style={{marginRight:53,color:'red'}}>审批详情</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>



                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>回款金额</Text>
                                <Text style={{marginRight:10}}>{this.state.return_money}/{this.state.contract_jine}</Text>
                                <View>
                                    <TouchableHighlight  onPress={()=>this.return_money_detail()}>
                                    <Text style={{marginRight:50,color:'red'}}>回款详情</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>



                                <View style={[styles.divRowCom]}>
                                    <Text style={[styles.divFontCom]}>客户名称</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholderTextColor="#A2A2A2"
                                        value={this.state.customer_name}
                                        editable={false}

                                    />
                                </View>




                                <View style={[styles.divRowCom]}>
                                    <Text style={[styles.divFontCom]}>客户联系人</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholderTextColor="#A2A2A2"
                                        value={this.state.customer_linkman_name}
                                        editable={false}

                                    />

                                </View>






                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>合同名称</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    value={this.state.contract_name}
                                />
                            </View>





                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>签订日期</Text>

                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    editable={false}
                                    value={this.state.signtime}
                                />


                            </View>

                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>签单人</Text>


                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.signman_name}
                                    placeholderTextColor="#A2A2A2"
                                    editable={false}
                                />
                            </View>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>合同金额</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    value={this.state.contract_jine}
                                />

                            </View>

                            {product_list}

                        </View>
                    </View>
                </ScrollView>






            </View>
        )

    }
}

const styles = StyleSheet.create({
    //nav
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
    body: {//祖先级容器
        flex: 1,
        backgroundColor: '#f8f8f8'
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
    navltysImg: {
        width: 24,
        height: 24,
    },
//    主题内容
    childContent: {//子容器页面级
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#F8F8F8',
    },

    //页签切换
    ancestorCon: {//祖先级
        //flex: 1,
    },
    divTit: {//祖级--区域-主题内容title部分
        flexDirection: 'row',
        //justifyContent: 'space-around',
        height: 30,
        paddingTop: 5,
        marginBottom: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleCon: {//父级-块
        width: screenW * 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#a4a4a4',
    },
    eleFontCon: {//子级-字体
        fontSize: 12,
    },
    eleSelf: {//私有级
        borderRightWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleImgCon: {//子级-图片
        marginRight: 5,
    },

    //内容模块
    divCom: {//祖先级-区域
        flex:1,
    },
    rowCom: {//祖级-行
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#F1F2F3',
    },

    eleTopCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:5
    },
    comLeft:{//次父级-次级块

    },
    comRight:{//次父级-次级块

    },
    elefontCom:{//子级-E
        fontSize:10,
        color:'#969696',
    },


    eleBottomCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },
    navltysImgSelf:{//子级-E-图片-文件夹
        width:14,
        height:14,
    },


//    内容区域
    divRowCom:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 40,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },

    divRowCom1:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#F8F8F8',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 30,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },
    divFontCom:{//子级-E
        color:'#939393',
    },
    divFontCom1:{//子级-E
        color:'red',
    },
    divRowSelf:{//私有级
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
    },
    divFontSelf:{//私有级
        marginTop:10
    },
    divRowSelfBottomBorder:{
        borderBottomWidth:1,
        borderBottomColor:'#E9E9E9',
    },
    inputStyle: {
        height: 40,
        width:245,
        fontSize: 12,
        color: '#333'
    }
});

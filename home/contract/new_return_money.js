//新增合同回款
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
import ImagePicker from 'react-native-image-crop-picker';

export default class newBulidContract extends Component {

    constructor(props) {
        super(props);
        this.state={
                  return_price:'',//回款金额
                  return_time:'',//回款时间
                  return_proof:[],//回款凭证
                  return_state:'',//回款说明
                  return_account_name:'',//回款账户名称
                  return_account_nb:'',//回款账户号

                  approver_people:[],//审批人



        };

    }




    componentDidMount() {


        //审批人
        this.subscription = DeviceEventEmitter.addListener('choosePeople',(value) => {
            this.setState({
                approver_people:value,
            })
        })


    }


    componentWillUnmount() {
        this.subscription.remove();
    }


    back() {
        this.props.navigation.goBack(null);
    }


    //选择审批人
    select_approve_peopel(){
        this.props.navigation.navigate('select_approve_peopel',{selected_peopel:this.state.approver_people,company_id:this.props.navigation.state.params.company_id});
    }



    //选择图片
    pic(){
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.state.return_proof.push(image.path);
            this.setState({
            })
        });
    }
    //选择图片


    //点击确认按钮
    submmit() {


        if(this.state.approver_people.length==0){
            return toast.center('审批人不能为空');
        }

       if(this.state.return_price==''||this.state.return_time==''||this.state.return_state==''||this.state.return_account_name==''||this.state.return_account_nb==''){
           return toast.center('请完善信息');
       }


        //回款凭证 图片 formdata
        let formData = new FormData();
        for(var imgi in this.state.return_proof){
            let file = {uri: this.state.return_proof[imgi], type: 'multipart/form-data',name:this.state.return_proof[imgi]};
            formData.append(this.state.return_proof[imgi],file);
        }


        //将审批人放入 formdata  只能传递字符串
        var appprover_people_info=[];
        for(var i in this.state.approver_people){
            appprover_people_info.push(this.state.approver_people[i].id+','+this.state.approver_people[i].depart_id+','+this.state.approver_people[i].company_id);
        }
        formData.append('approver_peopel',appprover_people_info.join("--"));

        //回款金额
        formData.append('return_price',this.state.return_price);
        //回款时间
        formData.append('return_time',this.state.return_time);
        //回款说明
        formData.append('return_state',this.state.return_state);
        //回款账户名称
        formData.append('return_account_name',this.state.return_account_name);
        //回款账户号
        formData.append('return_account_nb',this.state.return_account_nb);

        //合同id
        formData.append('contract_id',this.props.navigation.state.params.contract_id);
        //公司id
        formData.append('company_id',this.props.navigation.state.params.company_id);
        //当前用户id
        formData.append('user_id',this.props.navigation.state.params.user_id);



        var url=config.api.base + config.api.add_return_money_record;
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data'
            },
            body:formData
        })
            .then((response) => response.json() )
            .then((res)=>{

                if(res.sing==0){
                    toast.center(res.msg);
                }else if(res.sing==1){
                    toast.center(res.msg);
                    DeviceEventEmitter.emit('contract_id', this.props.navigation.state.params.contract_id);
                    this.props.navigation.goBack(null);

                }

            })
            .catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    };
    //点击确认按钮




    render() {


        var isPickerVisible=''; //时间插件用

        //审批人
        var approverlist=[];
        for(var i in this.state.approver_people){
            approverlist.push(
                <View style={{flexDirection: 'row',alignItems: 'center'}} key={i}>
                    <View style={{paddingLeft:screenW*0.025,paddingTop:screenW*0.02,}}>
                        <Image style={{width:screenW*0.1,height:screenW*0.1,borderColor:'#d3d3d3',borderWidth:1,borderRadius:screenW*0.05}} source={{uri: this.state.approver_people[i]['avatar']}}/>
                        <Text style={{fontSize:12}}>{this.state.approver_people[i]['name']}</Text>
                    </View>
                    {this.state.approver_people[i-(-1)] &&<Image style={{height:16,width: 16}}
                                                                 source={require('../../imgs/rjt.png')}/>}
                </View>
            )
        }
        //审批人



        //图片
        var imglist=[];
        for(var i in this.state.return_proof){
            imglist.push(
                <View style={{paddingLeft:screenW*0.025,paddingTop:screenW*0.02,}}>
                    <Image style={{width:screenW*0.22,height:screenW*0.22,borderColor:'#d3d3d3',borderWidth:1}} source={{uri: this.state.return_proof[i]}}/>
                </View>
            )
        }
        //图片




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
                    <Text style={styles.fSelf}>申报回款</Text>
                    <TouchableHighlight

                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Text  onPress={this.submmit.bind(this)} style={styles.navFont}>确定</Text>
                        </View>

                    </TouchableHighlight>
                </View>



                <ScrollView style={styles.childContent}>
                    <View style={[styles.ancestorCon]}>
                        <View style={[styles.divCom]}>


                                <View style={[styles.divRowCom]}>
                                    <Text style={[styles.divFontCom]}>回款金额</Text>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        placeholderTextColor="#A2A2A2"
                                        onChangeText={(return_price) => this.setState({return_price})}
                                    />

                                </View>






                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>回款时间</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    placeholder="请选择时间(必填)"
                                    editable={false}
                                    value={this.state.return_time}
                                />
                                <TouchableOpacity  onPress= { () => {this.setState({ [isPickerVisible]:true });}}>
                                    <Image style={{marginLeft:10,width:20,height:20}} source={require('../../imgs/icon_shenpi/rili.png')}/>
                                </TouchableOpacity>

                                <DateTimePicker
                                    cancelTextIOS = "取消"
                                    confirmTextIOS = "确定"
                                    titleIOS = "选择日期"
                                    mode="date"
                                    is24Hour={true}
                                    datePickerModeAndroid="spinner"
                                    isVisible={this.state[isPickerVisible]}
                                    onConfirm={(date) => {this.setState({return_time: moment(date).format('YYYY-MM-DD'),[isPickerVisible]: false })}}
                                    onCancel={() => this.setState({ [isPickerVisible]: false })}
                                />
                            </View>




                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>回款凭证</Text>
                                <TouchableOpacity onPress={()=>this.pic()} >
                                    <Image style={{marginLeft:255,width:20,height:20}} source={require('../../imgs/icon_shenpi/xiangji.png')}/>
                                </TouchableOpacity>
                            </View>


                            <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:screenW*0.02}}>
                                {imglist}
                            </View>


                            <View style={[styles.divRowCom,{height: 120,alignItems: 'flex-start',paddingTop: 6}]}>
                                <Text style={[styles.divFontCom]}>回款说明</Text>
                                <TextInput
                                    style={styles.inputStyle1}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    multiline={true}
                                    placeholder="请输入文本(必填)"
                                    onChangeText={(return_state) => this.setState({return_state})}
                                />
                            </View>





                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>汇款账户名称</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(return_account_name) => this.setState({return_account_name})}
                                    placeholderTextColor="#A2A2A2"
                                    placeholder="请输入文本(必填)"
                                />
                            </View>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>汇款账户号</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(return_account_nb) => this.setState({return_account_nb})}
                                    placeholderTextColor="#A2A2A2"
                                    placeholder="请输入文本(必填)"
                                />
                            </View>



                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>审批人</Text>
                                <TouchableOpacity   onPress={()=>this.select_approve_peopel()}>
                                    <Image style={{marginLeft:30,width:20,height:20}} source={require('../../imgs/icon_shenpi/jiahao.png')}/>
                                </TouchableOpacity>
                            </View>





                            <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:screenW*0.02}}>
                                {approverlist}
                            </View>



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
    },


    inputStyle1: {
        height: 120,
        width:245,
        fontSize: 12,
        color: '#333',
        textAlignVertical: 'top'
    }
});

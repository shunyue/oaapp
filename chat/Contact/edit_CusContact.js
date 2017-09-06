/**
 * Created by Administrator on 2017/6/7.
 * 新增联系人
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    DeviceEventEmitter,
    } from 'react-native';
import Header from '../../common/header';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
export default class EditCusContact extends Component {
    constructor(props) {
        super(props);
        let {params}=this.props.navigation.state;
        this.state = {
            con_name:params.contact.con_name,
            tel: params.contact.tel,
            email: params.contact.email,
            department: params.contact.department,
            position: params.contact.position,
            show: false,
            visibleModal:false,
        };
    }
    componentDidMount() {
        this._listenter = DeviceEventEmitter.addListener('ChoosePhoneContact',(contact)=>{
            this.setState({
                con_name: contact.con_name,
                tel: contact.tel
            })
        })
    }
    componentWillUnmount() {
        this._listenter.remove();
    }
    setVisibleModal(visible) {
        this.setState({show: visible});
    }
    OpBack() {
        this.props.navigation.goBack(null)
    }
    goPage_ChooseContacts(){
        this.props.navigation.navigate('PhoneContactList',{
            choose:true
        })
    }
    goPage_editContact(){
        this.setState({
            load: true
        })
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.editMyCustomerContact;
        request.post(url,{
            id:params.contact.id,
            con_name:this.state.con_name,
            tel:this.state.tel,
            email:this.state.email,
            department:this.state.department,
            position:this.state.position,
        }).then((res)=>{
            this.setState({
                load: false
            })
            if(res.status==1){
                toast.center(res.message);
                DeviceEventEmitter.emit('editCusContact',{
                    contact:res.data
                }); //发监听
                this.OpBack()
            }else{
                toast.bottom(res.message);
                return false;
            }
        })
        .catch((error)=>{
            toast.bottom('网络连接失败,请检查网络后重试')
        });
    }
    render() {
        if(this.state.load){
            return(
                <View style={[com.hh9,com.jcc,com.aic]}>
                    <Loading/>
                </View>
            )
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>编辑联系人</Text>
                    <TouchableOpacity style={[styles.goRight,styles.go]} onPress={()=>this.goPage_editContact()}>
                        <Text style={styles.back_text}>确定</Text>
                    </TouchableOpacity>
                </View>
                {/*输入信息*/}
                <ScrollView>

                    <View style={styles.message_o}>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>姓名</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(con_name) => this.setState({con_name})}
                                value={this.state.con_name}
                                placeholder ={"请输入姓名（必填）"}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                multiline={false}
                                />
                            <TouchableOpacity onPress={()=>{this.goPage_ChooseContacts()}}>
                                <Image style={styles.textINput_phone}
                                        source={require('../../imgs/customer/dianhuabo.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>电话</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(tel) => this.setState({tel})}
                                value={this.state.tel}
                                keyboardType={'numeric'}
                                placeholder ={"请输入电话号码（必填）"}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                />
                            <TouchableOpacity>
                                <Image style={styles.textINput_phone}
                                       source={require('../../imgs/customer/sousuo.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>邮箱</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(email) => this.setState({email})}
                                placeholder ={"请输入文本"}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                value={this.state.email}
                                />
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>部门</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(department) => this.setState({department})}
                                placeholder ={"请输入文本"}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                value={this.state.department}
                                />
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>职位</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(position) => this.setState({position})}
                                placeholder ={"请输入文本"}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                value={this.state.position}
                                />
                        </View>
                    </View>
                </ScrollView>
                {/* 添加模型  线索来源*/}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setVisibleModal(!this.state.show)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer}>
                            <View style={[styles.addCustomer_card,styles.addCustomer_card_3]}>
                                <TouchableOpacity  style={[styles.customerCard_content,styles.customerCard_content2,styles.customerCard_content_3]}>
                                    <Text style={{color:'#333'}}>市场活动</Text>
                                </TouchableOpacity>
                                <TouchableOpacity  style={[styles.customerCard_content,styles.customerCard_content2,styles.customerCard_content_3]}>
                                    <Text style={{color:'#333'}}>网络信息</Text>
                                </TouchableOpacity>
                                <TouchableOpacity  style={[styles.customerCard_content,styles.customerCard_content2,styles.customerCard_content_3]}>
                                    <Text style={{color:'#333'}}>客户介绍</Text>
                                </TouchableOpacity>
                                <TouchableOpacity  style={[styles.customerCard_content,styles.customerCard_content_3]}>
                                    <Text  style={{color:'#555'}}>其他</Text>
                                </TouchableOpacity>
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
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    backwz:{
        position:'absolute',
        top:5,
        left:25,
        color:'red',
    },
    //输入框
    message_o:{
        borderColor:'#e6e6e6',
        borderBottomWidth:1,
    },
    message_t:{
        paddingTop:10,
        backgroundColor:'#eee',
    },
    textIupt_b:{
        borderTopWidth:1,
        borderColor:'#e6e6e6',
    },
    textIput:{
        flexDirection:'row',
        alignItems:'center',
        width:screenW,
        height:40,
        backgroundColor:'#fff',
        borderColor:'#e6e6e6',
        borderTopWidth:1,
    },
    input_title:{
        paddingLeft:25,
        width:screenW*0.3
    },
    input_text:{
        width:screenW*0.48,
        height:40
    },
    input_content:{
        color:'#a5a5a5',
        width:screenW*0.48,
    },
    touch_a:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:5,
        height:40

    },
    textINput_phone:{
        width:30,
        height:30,
        marginLeft:15
    },
    textINput_arrow:{
        width:20,
        height:20,
        marginLeft:16
    },
    someMessage:{
        borderColor:'#ddd',
        borderBottomWidth:1,
        borderTopWidth:1,
        paddingLeft:24,
        backgroundColor:'#eee',
        height:30,
        justifyContent:'center'
     },
    moreMessage:{
        alignItems:'center',
        flexDirection:'row',
        height:40,
        paddingLeft:24
    },
    addCustomer:{
        flex:1,
        position:'absolute',
        top:screenH*0.3,
    },
    addCustomer_c:{
        flex:1,
        position:'absolute',
        bottom:screenH*0.02,
    },
    addCustomer_card:{
        width:screenW*0.9,
        height:screenH*0.3,
        backgroundColor:'#fff',
        marginLeft:screenW*0.05,

    },
    addCustomer_card_1:{
        height:screenH*0.15,
        borderRadius:4
    },
    addCustomer_card_2:{
        marginTop:10,
        height:screenH*0.07,
        borderRadius:4
    },
    addCustomer_card_3:{
        paddingLeft:screenW*0.02,
        paddingRight:screenW*0.02,
    },
    customerCard_content:{
        justifyContent:'center',
        alignItems:'flex-start',
        height:screenH*0.075,
        borderBottomColor:'#ddd',
    },
    customerCard_content_2:{
        alignItems:'center',
    },
    customerCard_content_3:{
        paddingLeft:10,
    },
    customerCard_content2:{
        borderBottomWidth:1,
    },


});
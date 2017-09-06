/**
 * Created by Administrator on 2017/6/7.
 * 新增线索
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
    TouchableWithoutFeedback,
    TouchableHighlight,
    TextInput,
    ScrollView,
    Modal,
    DeviceEventEmitter,
    Alert,
    } from 'react-native';
import Header from '../../common/header'
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class Info extends Component {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            modeVisible: false,
            thread_name:params.thread.thread_name?params.thread.thread_name: null,
            tel:params.thread.tel?params.thread.tel:  null,
            thread_company_name:params.thread.thread_company_name?params.thread.thread_company_name:null,
            source: params.thread.source?params.thread.source: null,
            address: params.thread.address?params.thread.address: null,
            department:params.thread.department?params.thread.department: null,
            position:params.thread.position?params.thread.position: null,
            email:params.thread.email?params.thread.email: null
        };
    }

    componentDidMount() {

        this._listenter = DeviceEventEmitter.addListener('chooseContacts',(params)=>{

            this.setState({
                thread_name: params.name,
                tel: params.tel
            })
        })
    }
    componentWillUnmount() {
        this._listenter.remove();
    }

    setVisibleModal(visible) {
        this.setState({modeVisible: visible});
    }
    _threadSource(id) {
        this.setState({
            source: id,
            modeVisible: !this.state.modeVisible
        })
    }


    _complete() {
        if(!this.state.thread_name) {
            return Alert.alert(
                '提示',
                '请填写线索名称',
                [{text: '确定'}]
            )
        }
        if(!this.state.tel) {
            return Alert.alert(
                '提示',
                '请填写线索电话',
                [{text: '确定'}]
            )
        }
        if(!this.state.thread_company_name) {
            return Alert.alert(
                '提示',
                '请填写线索公司名称',
                [{text: '确定'}]
            )
        }
        if(!this.state.source) {
            return Alert.alert(
                '提示',
                '请填写线索来源',
                [{text: '确定'}]
            )
        }
        //编辑线索
        const {params} = this.props.navigation.state;
        if(params.thread.id) {
            var url = config.api.base + config.api.editThread;
            request.post(url, {
                thread_id: params.thread.id,
                thread_name: this.state.thread_name,
                tel: this.state.tel,
                thread_company_name: this.state.thread_company_name,
                source: this.state.source,
                address: this.state.address,
                department: this.state.department,
                position: this.state.position,
                email: this.state.email
            }).then((result) => {
                if (result.status == 1) {
                    toast.center(result.message);
                    DeviceEventEmitter.emit('editThread',{thread_name: this.state.thread_name,tel: this.state.tel,thread_company_name: this.state.thread_company_name,source: this.state.source,address: this.state.address,department: this.state.department,position: this.state.position, email: this.state.email});
                    this.props.navigation.goBack(null)
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
        }else{
            //增加线索
            var url = config.api.base + config.api.addThread;
            request.post(url, {
                user_id: params.user_id,
                company_id: params.company_id,
                thread_name: this.state.thread_name,
                tel: this.state.tel,
                thread_company_name: this.state.thread_company_name,
                source: this.state.source,
                address: this.state.address,
                department: this.state.department,
                position: this.state.position,
                email: this.state.email
            }).then((result) => {
                if (result.status == 1) {
                    toast.center(result.message);
                    DeviceEventEmitter.emit('ReloadThread');
                    this.props.navigation.goBack(null)
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



    }
    _renderViewSource() {
        if(this.state.source ==1) {
            return <Text>市场活动</Text>
        }else if(this.state.source ==2) {
            return <Text>网络信息</Text>
        }else if(this.state.source ==3) {
            return <Text>客户介绍</Text>
        }else if(this.state.source == 4) {
            return <Text>其他</Text>
        }else{
            return <Text style={styles.input_content}>请选择（必填）</Text>
        }
    }



    render() {
        return (
            <View style={styles.ancestorCon}>
                <Header navigation={this.props.navigation}
                        title={this.props.navigation.state.params.thread.id?'编辑线索': '新增线索'}
                        rightText="确定"
                        onPress={()=>{this._complete()}} />
                {/*输入信息*/}
                <ScrollView>

                    <View style={styles.message_o}>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>姓名</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(thread_name) => this.setState({thread_name})}
                                value={this.state.thread_name}
                                placeholder ={'请输入姓名（必填）'}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                multiline={false}
                                />
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('ChooseContacts')}>
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
                                placeholder ={'请输入电话号码（必填）'}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                />
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>公司名称</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(thread_company_name) => this.setState({thread_company_name})}
                                value={this.state.thread_company_name}
                                placeholder ={'请输入公司名称（必填）'}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                multiline={false}
                                />
                        </View>
                        <TouchableWithoutFeedback onPress={() => {this.setState({modeVisible: !this.state.modeVisible})}}>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>线索来源</Text>
                            <View style={styles.sourceStyle}>
                            {this._renderViewSource()}
                            <Image style={styles.textINput_arrow}
                                   source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.message_t}>
                        <View style={[styles.textIput,styles.textIupt_b]}>
                            <Text style={styles.input_title}>地址</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(address) => this.setState({address})}
                                value={this.state.address}
                                placeholder ={'请输入文本'}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                />
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>部门</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(department) => this.setState({department})}
                                value={this.state.department}
                                placeholder ={'请输入文本'}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                />
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>职位</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(position) => this.setState({position})}
                                value={this.state.position}
                                placeholder ={'请输入文本'}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                />
                        </View>
                        <View style={styles.textIput}>
                            <Text style={styles.input_title}>邮箱</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                                placeholder ={'请输入文本'}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                />
                        </View>
                    </View>

                </ScrollView>
                {/* 添加模型  线索来源*/}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.modeVisible}
                        onRequestClose={() => { this.setState({modeVisible: !this.state.modeVisible})}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setVisibleModal(!this.state.modeVisible)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer}>
                            <View style={styles.addCustomer_card}>

                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={()=>{this._threadSource(1)}}>
                                    <View style={[styles.customerCard_content,styles.customerCard_content2,styles.customerCard_content_3]}>
                                        <Text style={{color:'#333'}}>市场活动</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={()=>{this._threadSource(2)}}>
                                    <View  style={[styles.customerCard_content,styles.customerCard_content2,styles.customerCard_content_3]}>
                                        <Text style={{color:'#333'}}>网络信息</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={()=>{this._threadSource(3)}}>
                                    <View style={[styles.customerCard_content,styles.customerCard_content2,styles.customerCard_content_3]}>
                                        <Text style={{color:'#333'}}>客户介绍</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#F3F3F3'} onPress={()=>{this._threadSource(4)}}>
                                    <View style={[styles.customerCard_content,styles.customerCard_content_3]}>
                                        <Text  style={{color:'#555'}}>其他</Text>
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
    //输入框
    message_o:{
        borderColor:'#e6e6e6',
        borderBottomWidth:1,
    },
    message_t:{
        marginTop: 10
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
        width:25,
        height:25,
        marginLeft:15
    },
    textINput_arrow:{
        width:16,
        height:16,
        marginLeft:16
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
    sourceStyle: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 40,
        justifyContent:'space-between'
    }


});
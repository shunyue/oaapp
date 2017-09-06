/**
 * Created by Administrator on 2017/6/7.
 * 新增客户
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
    Modal,
    Switch,
    Picker,
    DeviceEventEmitter,
    NativeModules,
    Alert
    } from 'react-native';
import Header from '../common/header';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import AreaPicker from 'react-native-picker';
import area from '../common/area.json';

import config from '../common/config';
import toast from '../common/toast';
import request from '../common/request';
import CustomPicker from '../common/customPicker';

export default class Info extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            private: (params.customer.private == 2)? true: false,
            cus_name: params.customer.cus_name,
            classify: params.customer.classify,
            provice: params.customer.provice,
            city: params.customer.city,
            district: params.customer.district,
            place: params.customer.provice?(params.customer.provice+' '+params.customer.city+' '+params.customer.district): '省/市/区',
            position: params.customer.position?params.customer.position:'地图定位',
            contactsData: params.customer.contactsData? params.customer.contactsData :[]
        };
    }
    componentDidMount() {
        this.listener1 = DeviceEventEmitter.addListener('addPeople',(params)=>{
            this.state.contactsData.push(params);
            this.setState({})
        });

        // //监听事件名为EventName的事件
        this.listener2 = DeviceEventEmitter.addListener(
            'EventReminder',
            (reminder)=> {
                this.setState({position: reminder.name});
            }
        );
    }
    componentWillUnmount() {
        this.listener1.remove();

        this.listener2.remove();
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for(let i=0;i<len;i++){
            let city = [];
            for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    _showAreaPicker() {
        AreaPicker.init({
            pickerData: this._createAreaData(),
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '省市区',
            onPickerConfirm: pickedValue => {
                this.setState({
                    place: pickedValue[0]+' '+pickedValue[1]+' '+pickedValue[2],
                    provice: pickedValue[0],
                    city: pickedValue[1],
                    district: pickedValue[2]
                })
            },
        });
        AreaPicker.show();
    }


    //提交
    _complete() {
        //修改
        const {params} = this.props.navigation.state;
        if(!this.state.cus_name) {
            return  Alert.alert(
                '提示',
                '客户名称不能为空',
                [{text: '确定'}]
            )
        }
        if(params.customer.id) {
            var url = config.api.base + config.api.editCustomer;
            request.post(url,{
                cus_id: params.customer.id,
                cus_name: this.state.cus_name,
                classify: this.state.classify,
                provice: this.state.provice,
                city: this.state.city,
                district: this.state.district,
                street: this.state.street,
                private: this.state.private? '2': '1',
            }).then((result)=> {
                if(result.status == 1) {
                    toast.center(result.message);
                    DeviceEventEmitter.emit('editCustomer',{cus_id: params.customer.id,cus_name: this.state.cus_name,classify: this.state.classify,provice: this.state.provice,city: this.state.city,district: this.state.district,street: this.state.street,private: this.state.private? '2': '1'})
                    this.props.navigation.goBack(null);

                }else{
                    return Alert.alert(
                        '提示',
                        result.message,
                        [{text: '确定'}]
                    )
                }
            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            });
        }else{
            //增添(如果有thread_id则表示从线索添加进来)
            var url = config.api.base + config.api.addCustomer;
            request.post(url,{
                thread_id: params.thread_id,
                cus_name: this.state.cus_name,
                classify: this.state.classify,
                provice: this.state.provice,
                city: this.state.city,
                district: this.state.district,
                street: this.state.street,
                private: this.state.private? '2': '1',
                contacts: this.state.contactsData,
                user_id: params.user_id,
                company_id: params.company_id
            }).then((result)=> {
                if(result.status == 1) {
                    DeviceEventEmitter.emit('ReloadCustomer');
                    if(params.thread_id) {
                        toast.center('已转为客户');
                        this.props.navigation.goBack('XianSuoDetail');
                    }else{
                        toast.center(result.message);
                        this.props.navigation.goBack(null);
                    }
                }else{
                    return Alert.alert(
                        '提示',
                        result.message,
                        [{text: '确定'}]
                    )
                }
            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            });
        }

    }

    //定位
    getLocation() {
        NativeModules.RNBridgeModule.RNLocation();
    }
    render() {

        var contactsList = [];
        var contactsData = this.state.contactsData;
        for(var i in contactsData) {
            contactsList.push(
                <View style={styles.userListRow} key={i}>
                    <Text>{contactsData[i].con_name}</Text>
                    <Image source={require('../imgs/jtxr.png')}
                           style={styles.imgStyle} />
                </View>
            )
        }
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = {params.customer.id?"编辑客户": "新增客户"}
                        rightText = "完成"
                        onPress={()=>this._complete()}/>
                <View style={[styles.container_content,styles.margin_top]}>
                    <View style={styles.textIput}>
                        <Text style={styles.input_title}>客户名称</Text>
                        <TextInput
                            style={styles.input_text2}
                            onChangeText={(cus_name) => this.setState({cus_name})}
                            value={this.state.cus_name}
                            placeholder ={"请填写客户名称"}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            />
                    </View>
                    <View style={[styles.textIput,styles.margin_top,{justifyContent: 'space-between'}]}>
                        <Text style={styles.input_title}>客户分类</Text>



                        <View style={{width: screenW*0.5}}>
                            <CustomPicker isVisible={false}
                                          title="请选择"
                                          tipValue="请选择客户分类"
                                          pickerData={[{name: 'A级',value: 'A'},
                                              {name: 'B级',value: 'B'},
                                              {name: 'C级',value: 'C'},
                                              {name: 'A级',value: 'A'},]}
                                          onClick={(e)=>this.setState({classify: e})}/>
                        </View>


                    </View>
                    <View style={styles.customer_address}>
                        <View style={[styles.customer_addressName]}>
                            <Text style={{marginLeft:24}}>客户地址</Text>
                        </View>
                        <View style={{flex:1,paddingRight: 20}}>
                            <View style={[styles.textIput2]}>
                                <TouchableOpacity style={styles.text_input}>

                                    <View style={{width: screenW*0.5,alignItems:'flex-end'}}>
                                        <Text onPress={this._showAreaPicker.bind(this)}>{this.state.place}</Text>
                                    </View>

                                    <Image style={styles.textInput_arrow}
                                           source={require('../imgs/customer/arrowU.png')}/>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.textIput2]}>
                                <TextInput
                                    style={styles.input_text3}
                                    onChangeText={(street) => this.setState({street})}
                                    placeholder = {"街道"}
                                    placeholderTextColor={"#aaaaaa"}
                                    underlineColorAndroid="transparent"
                                    />

                            </View>
                            <View style={[styles.textIput2 ]}>
                                <TouchableOpacity style={[styles.text_input]} onPress={()=>this.getLocation()}>
                                    <View style={{width: screenW*0.5,alignItems:'flex-end'}}>
                                        <Text >{this.state.position}</Text>
                                    </View>
                                    <Image style={styles.textInput_arrow}
                                           source={require('../imgs/customer/dingwei.png')}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {contactsList}
                    {!params.customer.id && <TouchableOpacity  style={[styles.textIput,styles.add_message]} onPress={() => this.props.navigation.navigate('AddContacts')}>
                            <Image style={styles.textInput_arrow}
                                   source={require('../imgs/customer/add_man.png')}/>
                            <Text style={styles.addContacts}>添加联系人</Text>
                    </TouchableOpacity>}

                    <View style={[styles.textIput,styles.margin_top,styles.space_between]}>
                        <Text style={styles.input_title}>共享客户</Text>
                        <Switch
                            onValueChange={()=>this.setState({private: !this.state.private})}
                            value={this.state.private}
                            tintColor="#f4f4f4"
                            thumbTintColor="#fff"
                            onTintColor="#00FF00"

                            />
                    </View>
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
    userListRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        height: 40,
        backgroundColor: '#fff',
        borderColor:'#e6e6e6',
        borderTopWidth:1
    },
    imgStyle: {
        width: 16,
        height: 16
    },

    /*内容*/
    container_content:{
        width:screenW,
        height:screenH,
        backgroundColor:'#eee',
    },
    margin_top:{
        marginTop:12
    },
    text_input:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'flex-end'
    },
    textIput:{
        flexDirection:'row',
        alignItems:'center',
        height:40,
        backgroundColor:'#fff',
        borderColor:'#e6e6e6',
        borderTopWidth:1,
        borderBottomWidth:1,
    },
    textIput2:{
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems:'center',
        height:40,
        borderColor:'#e6e6e6',
        borderBottomWidth:1,
    },
    input_title:{
        paddingLeft:25,
        width:screenW*0.3
    },
    input_text:{
        width:screenW*0.5,
        height:40,
        textAlign:'right',
    },
    input_text2:{
        width:screenW*0.55,
        height:40,
        textAlign:'right',
    },
    input_text3:{
        width:screenW*0.58,
        height:40,
        textAlign:'right',
    },
    textInput_phone:{
        width:23,
        height:23,
        marginLeft:8
    },
    textInput_arrow:{
        width:16,
        height:16,
        marginLeft:10
    },
    /*客户地址*/
    customer_address:{
        flexDirection:'row',
        height:120,
        backgroundColor: '#fff',
        marginBottom: 12

    },
    customer_addressName:{
        borderWidth:1,
        borderColor:'#e6e6e6',
        justifyContent:'center',
        width:screenW*0.35,
        backgroundColor:'#fff',
        borderTopWidth:0
    },
    add_message:{
        borderColor:'#e6e6e6',
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:20,
    },
    space_between:{
        justifyContent:'space-between',
        paddingRight:10
    },
    addContacts: {
        fontSize: 12,
        marginLeft: 6
    }
});
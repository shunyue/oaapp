/**
 * Created by Administrator on 2017/6/7.
 * 新增培训
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter,
    } from 'react-native';

import Picker from 'react-native-picker';
import moment from 'moment';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const screenW = Dimensions.get('window').width;

export default class app extends Component {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            start_time: moment(new Date()).format('YYYY年MM月DD日 HH:mm'),
            stop_time: moment(new Date()).add(1,'hour').format('YYYY年MM月DD日 HH:mm'),
            userData: [{id:params.user_id}],
            executor: [params.user_id],
            description: null,
            classify: [false,false,false,true,false,false,false,false],
            remindTime: '15分钟前',
            confirm_recept: 0

        };
    }

    componentDidMount() {
        this._listenter1 =DeviceEventEmitter.addListener('choosePeople',(e)=>{
            var executor = [];
            for(var i in e.checkedData) {
                executor.push(
                    e.checkedData[i].id
                )
            }
            this.setState({
                executor: executor,
                userData: e.checkedData
            });
        });
        this._listenter2 =DeviceEventEmitter.addListener('workDescription',(e)=>{
            this.setState({
                description: e.des
            });

        });

        this._listenter3 = DeviceEventEmitter.addListener('remindTime',(e)=>{
            var remindTime = '';
            for(var i in e.classify) {
                if(e.classify[i] && i== 0) {
                    remindTime= '不提醒'
                }else if(e.classify[i] && i== 1) {
                    remindTime= '开始工作时间'
                }else if(e.classify[i] && i== 2) {
                    remindTime= '5分钟前'
                }else if(e.classify[i] && i== 3) {
                    remindTime= '15分钟前'
                }else if(e.classify[i] && i== 4) {
                    remindTime= '30分钟前'
                }else if(e.classify[i] && i== 5) {
                    remindTime= '1小时前'
                }else if(e.classify[i] && i== 6) {
                    remindTime= '2小时前'
                }else if(e.classify[i] && i== 7) {
                    remindTime= '1天前'
                }
            }
            this.setState({
                classify: e.classify,
                remindTime: remindTime,
                confirm_recept: e.confirm_recept
            });
        })

    }

    componentWillUnmount() {
        Picker.hide();
        this._listenter1.remove();
        this._listenter2.remove();
        this._listenter3.remove();
    }

    _showTimePicker(type) {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for(let i=1;i<51;i++){
            years.push(i+1980);
        }
        for(let i=1;i<13;i++){
            months.push(i);
            hours.push(i);
        }
        for(let i=1;i<32;i++){
            days.push(i);
        }
        for(let i=1;i<25;i++){
            hours.push(i);
        }
        for(let i=1;i<61;i++){
            minutes.push(i);
        }
        let pickerData = [years, months, days,  hours, minutes];
        let date = new Date();
        let selectedValue = [
            [date.getFullYear()],
            [date.getMonth()+1],
            [date.getDate()],
            [date.getHours()],
            [date.getMinutes()]
        ];
        Picker.init({
            pickerData,
            selectedValue: [date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes()],
            pickerTitleText: '选择时间',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            wheelFlex: [2, 1, 2, 2, 1],
            onPickerConfirm: pickedValue => {
                if(type == 1) {
                    this.setState({
                        start_time: pickedValue[0]+'年'+((pickedValue[1].length>1)?pickedValue[1]:'0'+pickedValue[1])+'月'+((pickedValue[2].length>1)?pickedValue[2]:'0'+pickedValue[2])+'日 '+((pickedValue[3].length>1)?pickedValue[3]:'0'+pickedValue[3])+':'+((pickedValue[4].length>1)?pickedValue[4]:'0'+pickedValue[4])
                    })
                } else {
                    this.setState({
                        stop_time: pickedValue[0]+'年'+((pickedValue[1].length>1)?pickedValue[1]:'0'+pickedValue[1])+'月'+((pickedValue[2].length>1)?pickedValue[2]:'0'+pickedValue[2])+'日 '+((pickedValue[3].length>1)?pickedValue[3]:'0'+pickedValue[3])+':'+((pickedValue[4].length>1)?pickedValue[4]:'0'+pickedValue[4])
                    })
                }

            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if(parseInt(targetValue[1]) === 2){
                    if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                        targetValue[2] = 29;
                    }
                    else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                        targetValue[2] = 28;
                    }
                }
                else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                    targetValue[2] = 30;

                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if(k !== 3){
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
    }


    goPage_addChosePeople(){
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('ChoosePeople',{company_id: params.company_id,userData: this.state.userData});
    }
    _complete() {

        const {params} = this.props.navigation.state;


        if(!this.state.title && params.title != "拜访") {
            return toast.center(params.title+"名不能为空");
        }

        var url = config.api.base + config.api.addCustomerDaily;
        var daily_type = '';
        if(params.title == '拜访') {
            daily_type= 1;
        }else if(params.title == '任务') {
            daily_type= 2;
        }else if(params.title == '会议') {
            daily_type= 3;
        }else if(params.title == '培训') {
            daily_type= 4;
        }

        request.post(url, {
            executor: this.state.executor.join(","),
            confirm_recept: this.state.confirm_recept,
            create_id: params.user_id,
            company_id: params.company_id,
            customer_id: params.customer.id,
            title: this.state.title,
            daily_type: daily_type,
            position: this.state.position,
            place: this.state.place,
            start_time: this.state.start_time.replace(/年/g,"-").replace(/月/g,"-").replace(/日/g,""),
            stop_time: this.state.stop_time.replace(/年/g,"-").replace(/月/g,"-").replace(/日/g,""),
            description: this.state.description,
            remindTime: this.state.remindTime
        }).then((result) => {
            if (result.status == 1) {
                toast.center(result.message);
                DeviceEventEmitter.emit('loadDaily');

                this.props.navigation.goBack(null);
            }
        }).catch((error) => {
            toast.bottom('网络连接失败，请检查网络后重试');
        });



    }

    _typeView() {
        const {params} = this.props.navigation.state;

        if(params.title=='拜访') {
            return (
                <View>
                    <View style={[styles.customerName, styles.borderStyle, styles.flex_position, styles.padding_value]}>
                        <Text style={{color: '#333'}}>客户</Text>
                        <Text style={{marginRight: screenW * 0.045}}>{params.customer.cus_name}</Text>
                    </View>
                </View>
            )
        }else{
            return(
                <View style={[styles.customerName,styles.borderStyle,]}>
                    <View style={[styles.customerName2,styles.flex_position,styles.padding_value,styles.borderStyle_bottom]}>
                        <TextInput
                            style={[styles.textInput]}
                            onChangeText={(title) => this.setState({title})}
                            placeholder = {params.title+'名称'}
                            underlineColorAndroid="transparent"
                            placeholderTextColor='#aaa'
                        />
                    </View>
                    <View style={[styles.customerName2,styles.flex_position,styles.padding_value,]}>
                        <TextInput
                            style={[styles.textInput]}
                            onChangeText={(position) => this.setState({position})}
                            placeholder ={'地点'}
                            underlineColorAndroid="transparent"
                            placeholderTextColor='#aaa'
                        />
                    </View>
                </View>
            )
        }
    }



    render() {

        var userData = this.state.userData;
        var userList = [];
        for(var i in userData) {
            userList.push(
                userData[i].name
            )
        }

        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;

        return (
            <View style={styles.ancestorCon}>

                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goback,styles.go]} onPress={()=> this.props.navigation.goBack(null)}>
                        <Text style={styles.back_text}>取消</Text>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>新增{params.title}</Text>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goRight,styles.go]} onPress={()=>{this._complete()}}>
                        <Text style={styles.back_text}>完成</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                    {this._typeView()}
                    <TouchableHighlight underlayColor={'#fff'}
                                        style={[styles.customerName, styles.borderStyle, styles.flex_position, styles.padding_value]}
                                        onPress={() => this.goPage_addChosePeople()}>
                        <View style={{width: screenW - 50, flexDirection: 'row', justifyContent: 'space-between',}}>
                            <Text style={{color: '#333'}}>执行人</Text>
                            <View style={{flexDirection: 'row',}}>
                                <Text numberOfLines={1} style={styles.pickerPeople}>{userList[0]?userList.join(","):"我自己"}</Text>
                                <Image style={styles.textINput_arrow}
                                       source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.customerName,styles.borderStyle,]}>


                        <View style={[styles.customerName2,styles.flex_position,]}>

                                <View style={{width:screenW*0.28,height:80,alignItems:'center',justifyContent:'center',borderColor:'#d5d5d5',borderRightWidth:1}}>
                                    <Text style={{marginBottom:5}}>起止时间</Text>
                                </View>
                            <View style={{width:screenW*0.72,}}>
                                <TouchableOpacity  onPress={this._showTimePicker.bind(this,1)}>
                                    <View style={[styles.flex_position3,styles.padding_value,styles.borderStyle_bottom]}>
                                        <Text>{this.state.start_time}</Text>
                                        <Image style={styles.textINput_arrow}
                                               source={require('../../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={this._showTimePicker.bind(this,2)}>
                                    <View  style={[styles.flex_position3,styles.padding_value]}>
                                        <Text>{this.state.stop_time}</Text>
                                        <Image style={styles.textINput_arrow}
                                               source={require('../../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.customerName,styles.borderStyle]}>
                        <TouchableHighlight underlayColor={'#fff'} onPress={()=>{ navigate('DailyDescribe', {title: params.title,description: this.state.description});}}>
                            <View>
                                <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                    <Text style={{color:'#333'}}>{params.title}描述</Text>
                                    <Image style={styles.textINput_arrow}
                                           source={require('../../imgs/customer/arrow_r.png')}/>

                                </View>
                                <Text style={this.state.description?{marginLeft: 20,marginRight: 20,marginBottom: 5}:null}>{this.state.description}</Text>
                            </View>
                        </TouchableHighlight>

                    </View>

                    {(params.title != "拜访") &&<View style={[styles.customerName, styles.borderStyle, styles.flex_position, styles.padding_value]}>
                        <Text style={{color: '#333'}}>关联客户</Text>
                        <Text style={{marginRight: screenW * 0.045}}>{params.customer.cus_name}</Text>
                    </View>}


                    <TouchableHighlight underlayColor={'#eee'} onPress={()=>{navigate('Remind',{classify: this.state.classify})}}>
                    <View style={[styles.customerName,styles.borderStyle]}>
                        <View style={[styles.customerName2,styles.flex_position,styles.padding_value,]}>
                            <Text style={{color:'#333'}}>提醒</Text>
                            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text>{this.state.remindTime}</Text>
                                <Image style={styles.textINput_arrow}
                                       source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#eee',
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
    customerName:{
        width:screenW,
        backgroundColor:'#fff',
        marginTop:10,
    },
    customerName2:{
        width:screenW,
        backgroundColor:'#fff',
    },
    flex_position:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    flex_position3:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    padding_value:{
        paddingLeft:20,
        paddingRight:20,
        height:40,
    },
    Height:{
        height:80
    },
    borderStyle:{
        borderColor:'#d5d5d5',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    borderStyle_bottom:{
        borderColor:'#d5d5d5',
        borderBottomWidth: 1,
    },
    textINput_arrow:{
        width:16,
        height:16,
        marginLeft:10
    },
    textInput:{
        width:screenW*0.9,
        height:25,
        backgroundColor:'#fff',
        padding:0,
    },
    pickerPeople: {
        flexWrap: 'nowrap',
    }
});
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
    DeviceEventEmitter,
    Platform,
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import moment from 'moment';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Picker from 'react-native-picker';
export default class EditVisit extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            text2:'地点',
            customer:[],
            executor:[],
            starttime: params.dailyInfo.start_time,
            stoptime: params.dailyInfo.stop_time,
            content:params.dailyInfo.description,
            confirm_recept:false,
            selectNum:1,
            alertName:'不提醒',
            executorId:[],
            customerId:params.dailyInfo.customer_id,
            position:params.dailyInfo.position
        };
    }
    componentDidMount() {
        this._getDailyMessage();
        //选择客户
        this.listener = DeviceEventEmitter.addListener('cusData', (e)=> {
            this.setState({
                customer: e,
            })
        });
        //选择员工
        this.executorListener= DeviceEventEmitter.addListener('Executor', (a)=> {
            var executorIds=[];
            if(a!=null && a.length!=0) {
                for (var i = 0; i < a.length; i++) {
                    executorIds[i]=a[i].id;
                }
            }else{
                executorIds=this.state.executorId;
            }
            this.setState({
                executor: a,
                executorId:executorIds
            })
        });
        //拜访描述
        this.describeListener=DeviceEventEmitter.addListener('visitDescibe',(a)=>{
            this.setState({
                content:a
            })
        });
        //提醒页面
        this.alertListener=DeviceEventEmitter.addListener('alertData',(a)=>{
            this.setState({
                alertTime:a.alertTime,
                confirm_recept:a.confirm_recept,
                selectNum:a.selectNum,
                alertName:a.alertName
            })
        });
    }
    componentWillUnmount() {
        // 移除监听
        this.listener.remove();
        this.executorListener.remove();
        this.describeListener.remove();
        this.alertListener.remove();
    }
    _getDailyMessage(){
        let {params} = this.props.navigation.state;
        if(params.dailyInfo.confirm_recept==1){
            var confirm_recept=true;
        }else{
            var confirm_recept=false;
        }
        if(params.dailyInfo.remind_time!=null && params.dailyInfo.remind_time!="0000-00-00 00:00:00"){
            var alertName=params.dailyInfo.remind_time;
        }else{
            var alertName='不提醒';
        }
        if(params.dailyInfo.remind_time!=null && params.dailyInfo.remind_time!="0000-00-00 00:00:00"){
            var alertTime=this.get_unix_time(params.dailyInfo.remind_time);
        }else{
            var alertTime=0;
        }

        var  startstamp=this.get_unix_time(this.state.starttime);
        var executor=params.dailyInfo.executor;
        var  executorId= executor.split(",");
        this.setState({
            confirm_recept:confirm_recept,
            executorId:executorId,
            alertName:alertName,
            startstamp:startstamp,
            alertTime:alertTime
        });
    }
    //返回上一页
    OpBack(daily=null){
        DeviceEventEmitter.emit('Daily',daily);
        this.props.navigation.goBack(null);
    }
    //提交
    submit(){
        var create_time=moment(new Date()).format('YYYY-MM-DD  HH:mm:ss');
        if(this.state.starttime <create_time){
            toast.bottom('只能创建当前时间以后的日程');
            return false;
        }
        let {params} = this.props.navigation.state;
        //添加拜访
        if(this.state.customer!=null && this.state.customer.length!=0) {
            var  customer =this.state.customer.id;
        }else{
            var  customer =this.state.customerId;
        }
        var executor =this.state.executorId.join(",");
        if(this.state.confirm_recept==true){
            var confirm_recept=1;
        }else{
            var confirm_recept=0;
        }
        if(this.state.starttime>=this.state.stoptime){
            toast.bottom('结束时间要大于开始时间');
            return false;
        }
        if(this.state.content==""||this.state.content==null){
            toast.bottom('请输入拜访描述');
            return false;
        }
        var url=config.api.base+config.api.editDailyInfo;
        request.post(url,{
            daily_id:params.dailyInfo.id,
            customer_id:customer,
            executor:executor,
            start_time:this.state.starttime,
            stop_time:this.state.stoptime,
            description:this.state.content,
            remind_time:this.state.alertTime,
            confirm_recept:confirm_recept,
            create_time:moment(new Date()).format('YYYY-MM-DD  HH:mm'),
            position:this.state.position
        }).then((res)=>{
            if(res.status==1){
                toast.center(res.message);
                this.OpBack(res.data);
            }else{
                toast.bottom(res.message);
            }

        })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    //拜访描述
    goPage_addDescribe(){
        let describe={
            title:'拜访',
            content:this.state.content
        }
        this.props.navigation.navigate('AddDescribe',{describe:describe});
    }

    //选择客户
    goPage_chooseCustomer(){
        let {params} = this.props.navigation.state;
        if(this.state.customer!=null && this.state.customer.length!=0) {
            var  customer =this.state.customer.id;
        }else{
            var  customer =this.state.customerId;
        }
        this.props.navigation.navigate('ChooseCustomer',{
            customer:customer,
            user_id:params.user_id,
            company_id: params.company_id
        });
    }
    //选择任务人
    goPage_chooseEmployee(){
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('ChooseExecutor',{
            user_id:params.user_id,
            company_id: params.company_id,
            executor:this.state.executor,
            executorIds:this.state.executorId
        });
    }
    //选择提醒
    goPage_AddAlert(){
        let data={
            confirm_recept:this.state.confirm_recept,
            selectNum:this.state.selectNum,
            startstamp:this.state.startstamp,
            alertName:this.state.alertName
        }
        this.props.navigation.navigate('AddAlert',{timeData:data});
    }
    _showTimePicker(title) {
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
        let pickerData = [years, months, days, hours, minutes];
        let date = new Date();
        let selectedValue = [
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        ];
        Picker.init({
            pickerData,
            selectedValue:selectedValue,
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择日期和时间',
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            wheelFlex: [2, 1, 2, 2, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                for(i=0;i<pickedValue.length;i++){
                    if(pickedValue[i]<10){
                        pickedValue[i]='0' + pickedValue[i];
                    }
                }
                var date = pickedValue[0]+'-'+pickedValue[1]+'-'+pickedValue[2]
                    +'  '+pickedValue[3]+':'+pickedValue[4];
                var timestamp=this.get_unix_time(date);
                if(title==1){
                    this.setState({
                        starttime: date,
                        startstamp:timestamp
                    });
                }else if(title==2){
                    this.setState({
                        stoptime: date
                    });
                }

            },
            onPickerCancel: pickedValue => {
                Picker.hide();
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
    get_unix_time(str) {
        str = str.replace(/-/g,'/');
        var date = new Date(str);
        var time = parseInt(date.getTime()/1000);
        return time;
    }
    render() {
        const {navigate} = this.props.navigation;
        let {params} =this.props.navigation.state;
        var executorArr=[];
        var  executor=this.state.executor;
        if(executor!= null && executor.length>=3){
            for (var i = 0; i <3; i++) {
                executorArr.push(
                    <View key={i}>
                        <Text> &nbsp;{executor[i].name}</Text>
                    </View>
                );
            }
            executorArr.push(
                <View key={i-(-1)}>
                    <Text>等{executor.length}人</Text>
                </View>
            );
        }else if(executor!=null && executor.length>0){
            for (var i = 0; i <executor.length; i++) {
                executorArr.push(
                    <View  key={i}>
                        <Text> &nbsp;{executor[i].name}&nbsp;</Text>
                    </View>
                );
            }
        }else{
            executorArr.push(
                <View  key={0}>
                    <Text>{params.dailyInfo.executorName}</Text>
                </View>
            );
        }
        return (
            <View style={styles.ancestorCon}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Text style={styles.back_text}>取消</Text>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>编辑拜访</Text>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goRight,styles.go]} onPress={()=>this.submit()}>
                        <Text style={styles.back_text}>完成</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                    <TouchableHighlight underlayColor={'#fff'} onPress={this.goPage_chooseCustomer.bind(this)}>
                        <View style={[styles.customerName,styles.borderStyle,styles.flex_position,styles.padding_value,styles.rowheight]}>
                            <Text>客户</Text>
                            <View style={{flexDirection:'row'}}>
                                {(this.state.customer=="" || this.state.customer==null)?(<Text>{params.dailyInfo.customerName}</Text>):(
                                    <Text>{this.state.customer.cus_name}</Text>)}
                                <Image style={styles.textINput_arrow}
                                       source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'#fff'}
                        style={[styles.customerName,styles.borderStyle,styles.flex_position,styles.padding_value,styles.rowheight]}
                        onPress={this.goPage_chooseEmployee.bind(this)}>
                        <View style={{width:screenW-50,flexDirection:'row',justifyContent:'space-between',}}>
                            <Text style={{color:'#333'}}>执行人</Text>
                            <View style={{flexDirection:'row',}}>
                                {executorArr}
                                <Image style={styles.textINput_arrow}
                                       source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.customerName,styles.borderStyle,]}>
                        <View style={[styles.customerName2,styles.flex_position,]}>
                            <View style={{width:screenW*0.28,height:80,alignItems:'center',justifyContent:'center',borderColor:'#d5d5d5',borderRightWidth:1}}>
                                <Text style={{marginBottom:5}}>起止时间</Text>
                                <View style={{padding:2,paddingLeft:5,paddingRight:5,borderRadius:5,backgroundColor:'#e15151'}}>
                                    <Text style={{fontSize:10,color:'#fff'}}>查看可用时间</Text>
                                </View>
                            </View>
                            <View style={{width:screenW*0.72,}}>
                                <TouchableHighlight underlayColor={'#fff'} onPress={this._showTimePicker.bind(this,1)}>
                                    <View style={[styles.flex_position3,styles.padding_value,styles.borderStyle_bottom,styles.rowheight]}>
                                        <Text>{this.state.starttime}</Text>
                                        <Image style={styles.textINput_arrow}
                                               source={require('../../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#fff'} onPress={this._showTimePicker.bind(this,2)}>
                                    <View  style={[styles.flex_position3,styles.padding_value,styles.rowheight]}>
                                        <Text>{this.state.stoptime}</Text>
                                        <Image style={styles.textINput_arrow}
                                               source={require('../../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableHighlight>
                                {/* <DateTimePicker
                                 isVisible={this.state.isStartPickerVisible}
                                 onConfirm={(e)=>{this._handleStartPicked(e)}}
                                 onCancel={()=>this._hideDateTimePicker()}
                                 mode='datetime'
                                 is24Hour={true}
                                 />
                                 <DateTimePicker
                                 isVisible={this.state.isStopPickerVisible}
                                 onConfirm={(e)=>{this._handleStopPicked(e)}}
                                 onCancel={()=>this._hideDateTimePicker()}
                                 mode='datetime'
                                 is24Hour={true}
                                 />*/}
                            </View>
                        </View>
                    </View>
                    <View style={[styles.customerName,styles.borderStyle]}>
                        <TouchableHighlight underlayColor={'#fff'} onPress={this.goPage_addDescribe.bind(this)}>
                            <View style={[styles.customerName2,styles.padding_value,styles.padding_topBottom,styles.borderStyle_bottom,]}>
                                <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',}]}>
                                    <Text style={{color:'#333'}}>拜访描述</Text>
                                    <Image style={styles.textINput_arrow}
                                           source={require('../../imgs/customer/arrow_r.png')}/>
                                </View>
                                {this.state.content!=null ||this.state.content!=""?(
                                    <View>
                                        <Text>{this.state.content}</Text>
                                    </View>
                                ):(null)}
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.customerName,styles.borderStyle]}>
                        <View style={[styles.customerName2,styles.padding_value,styles.padding_topBottom,styles.borderStyle_bottom,]}>
                            <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',}]}>
                                <Text style={{color:'#333'}}>地点</Text>
                            </View>
                            <View>
                                <TextInput
                                    style={[styles.textInput]}
                                    onChangeText={(position) => this.setState({position:position})}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor='#aaa'
                                    value={this.state.position}
                                    />
                            </View>

                        </View>
                    </View>
                    <View style={[styles.customerName,styles.borderStyle]}>
                        <TouchableHighlight underlayColor={'#fff'} onPress={this.goPage_AddAlert.bind(this)}>
                            <View style={[styles.customerName2,styles.flex_position,styles.padding_value,styles.rowheight]}>
                                <Text style={{color:'#333'}}>提醒</Text>
                                <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                    <Text>{this.state.alertName}</Text>
                                    <Image style={styles.textINput_arrow}
                                           source={require('../../imgs/customer/arrow_r.png')}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
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
    flex_position2:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    flex_position3:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    padding_value:{
        paddingLeft:25,
        paddingRight:25,
    },
    padding_topBottom:{
        paddingTop:10,
        paddingBottom:10,
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
    rowheight:{
        height:40,
    },

});
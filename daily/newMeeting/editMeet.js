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
    DeviceEventEmitter
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import moment from 'moment';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Picker from 'react-native-picker';
export default class EditMeeting extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            text2:'地点',
            customer:[],
            executor:[],
            starttime: params.dailyInfo.start_time,
            stoptime:params.dailyInfo.stop_time,
            content:params.dailyInfo.description,
            confirm_recept:false,
            selectNum:1,
            alertName:"不提醒",
            title:params.dailyInfo.title,
            position:params.dailyInfo.position,
            executorId:[],
            customerId:[]
        };
    }
    componentDidMount() {
        this._getDailyMessage();
        //选择客户
        this.customerListener= DeviceEventEmitter.addListener('Customer', (a)=> {
            var customerIds=[];
            if(a!=null && a.length!=0) {
                for (var i = 0; i < a.length; i++) {
                    customerIds[i]=a[i].id;
                }
            }else{
                customerIds=this.state.customerId;
            }
            this.setState({
                customer: a,
                customerId:customerIds
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
        //培训描述
        this.describeListener=DeviceEventEmitter.addListener('visitDescibe',(a)=>{
            this.setState({
                content:a
            })
        });
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
        this.customerListener.remove();
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
        var executor=params.dailyInfo.executor;
        if(executor!=null){
            var  executorId= executor.split(",");
        }else{
            var  executorId=[];
        }
        var customer=params.dailyInfo.customer_id;
        if(customer!=null){
            var  customerId=customer.split(",");
        }else{
            var  customerId=[];
        }
        if(params.dailyInfo.remind_time!=null && params.dailyInfo.remind_time!="0000-00-00 00:00:00"){
            var alertTime=this.get_unix_time(params.dailyInfo.remind_time);
        }else{
            var alertTime=0;
        }

        var startstamp=this.get_unix_time(this.state.starttime);
        this.setState({
            confirm_recept:confirm_recept,
            executorId:executorId,
            customerId: customerId,
            alertName:alertName,
            startstamp:startstamp,
            alertTime:alertTime
        });
    }
    //返回上一页
    OpBack(daily=null) {
        DeviceEventEmitter.emit('Daily',daily);
        this.props.navigation.goBack(null)
    }
    //提交
    submit(){
        var create_time=moment(new Date()).format('YYYY-MM-DD  HH:mm:ss');
        if(this.state.starttime <create_time){
            toast.bottom('只能创建当前时间以后的日程');
            return false;
        }
        let {params} = this.props.navigation.state;
        if(this.state.title ==" "|| this.state.title==null){
            toast.bottom('会议名称不能为空');
            return false;
        }
        if(this.state.position==" "|| this.state.position==null){
            toast.bottom('会议地点不能为空');
            return false;
        }
        var executor = this.state.executorId.join(",");
        var customer = this.state.customerId.join(",");
        if(this.state.confirm_recept==true){
            var confirm_recept=1;
        }else{
            var confirm_recept=0;
        }
        if(this.state.starttime>=this.state.stoptime) {
            toast.bottom('结束时间要大于开始时间');
            return false;
        }

        if(this.state.content==""||this.state.content==null){
            toast.bottom('请输入会议描述');
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
            title:this.state.title,
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
            title:'会议',
            content:this.state.content
        }
        this.props.navigation.navigate('AddDescribe',{describe:describe});
    }

    //选择客户
    goPage_chooseCustomer(){
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('ChooseMultipleCustomer',{
            customer:this.state.customer,
            user_id:params.user_id,
            company_id: params.company_id,
            customerIds:this.state.customerId
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
    //选择开始时间
    _showStartDateTimePicker(){
        this.setState({isStartPickerVisible: true});
    }
    _showStopDateTimePicker(){
        this.setState({isStopPickerVisible: true});
    }
    //选择结束日期
    _hideDateTimePicker(){
        this.setState({
            isStartPickerVisible: false,
            isStopPickerVisible: false
        });
    }
    //选择开始时间后执行的方法
    _handleStartPicked(e){//开始时间
        this.setState({
            starttime: moment(e).format('YYYY-MM-DD  HH:mm'),
            startstamp:moment(e)
        });
        this._hideDateTimePicker();
    }
    //选择结束时间后的方法
    _handleStopPicked(e){//结束时间
        this.setState({
            stoptime: moment(e).format('YYYY-MM-DD  HH:mm'),
            stopstamp:moment(e)
        });
        this._hideDateTimePicker();
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
        var customerArr=[];
        var  customer=this.state.customer;
        if(customer!= null && customer.length>=3){
            for (var i = 0; i <3; i++) {
                customerArr.push(
                    <View key={i}>
                        <Text> &nbsp;{customer[i].cus_name}</Text>
                    </View>
                );
            }
            customerArr.push(
                <View key={i-(-1)}>
                    <Text>等{customer.length}家</Text>
                </View>
            );
        }else if(customer!=null && customer.length>0){
            for (var i = 0; i <customer.length; i++) {
                customerArr.push(
                    <View  key={i}>
                        <Text> &nbsp;{customer[i].cus_name}&nbsp;</Text>
                    </View>
                );
            }
        }else{
            customerArr.push(
                <View  key={0}>
                    <Text>请选择</Text>
                </View>
            );
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Text style={styles.back_text}>取消</Text>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>编辑会议</Text>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goRight,styles.go]} onPress={()=>this.submit()}>
                        <Text style={styles.back_text}>完成</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                    <View style={[styles.customerName,styles.borderStyle]}>
                        <View style={[styles.customerName2,styles.flex_position,styles.padding_value,styles.borderStyle_bottom]}>
                            <TextInput
                                style={[styles.textInput]}
                                onChangeText={(title) => this.setState({title:title})}
                                placeholder = {'会议名称'}
                                underlineColorAndroid="transparent"
                                placeholderTextColor='#aaa'
                                value={this.state.title}
                                />
                        </View>
                        <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                            <TextInput
                                style={[styles.textInput]}
                                onChangeText={(position) => this.setState({position:position})}
                                placeholder ={this.state.text2}
                                underlineColorAndroid="transparent"
                                placeholderTextColor='#aaa'
                                value={this.state.position}
                                />
                        </View>
                    </View>

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
                                <Text style={{marginBottom:5,color:'#333'}}>起止时间</Text>

                            </View>
                            <View style={{width:screenW*0.72,}}>
                                <TouchableHighlight underlayColor={'#fff'} onPress={this._showStartDateTimePicker.bind(this)}>
                                    <View style={[styles.flex_position3,styles.padding_value,styles.borderStyle_bottom,styles.rowheight]}>
                                        <Text>{this.state.starttime}</Text>
                                        <Image style={styles.textINput_arrow}
                                               source={require('../../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#fff'} onPress={this._showStopDateTimePicker.bind(this)}>
                                    <View  style={[styles.flex_position3,styles.padding_value,styles.rowheight]}>
                                        <Text>{this.state.stoptime}</Text>
                                        <Image style={styles.textINput_arrow}
                                               source={require('../../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableHighlight>
                                <DateTimePicker
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
                                    />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.customerName,styles.borderStyle]}>
                        <TouchableHighlight underlayColor={'#fff'} onPress={this.goPage_addDescribe.bind(this)}>
                            <View style={[styles.customerName2,styles.padding_value,styles.padding_topBottom,styles.borderStyle_bottom,]}>
                                <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',}]}>
                                    <Text style={{color:'#333'}}>会议描述</Text>
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

                    <TouchableHighlight underlayColor={'#fff'} onPress={this.goPage_chooseCustomer.bind(this)}>
                        <View style={[styles.customerName,styles.borderStyle,styles.flex_position,styles.padding_value,styles.rowheight]}>
                            <Text style={{color:'#333'}}>关联客户</Text>
                            <View style={{flexDirection:'row',}}>
                                {customerArr}
                                <Image style={styles.textINput_arrow}
                                       source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
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
        height:36,
        backgroundColor:'#fff',
        padding:0,
    },
    rowheight:{
        height:40,
    },

});
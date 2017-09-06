/**
 * Created by Administrator on 2017/7/10.
 * 设置考勤分组
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    TextInput,
    DeviceEventEmitter,
    TouchableOpacity,
    Alert,
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
var PropTypes = React.PropTypes;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import CheckBox from 'react-native-check-box';

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class AttendanceSetting extends Component {
    OpBack() {
        //this.props.navigation.navigate('AttendanceWhiteDetail',{companyid:this.props.navigation.state.params.companyid});
        this.props.navigation.goBack('AttendanceSetting')
    }
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            select_value: ''
        }

    }
    componentDidMount() {
        this._firstWhiteUser() ;

    }

    //页面一加载进来，就获取数据
    _firstWhiteUser(){
        var url = config.api.base + config.api.changeAttendance;
        var id=this.props.navigation.state.params.companyid;
        request.post(url,{
            attendanceCompany: id,
        }).then((responseJson) => {
            this.setState({
                attendanceData: responseJson,
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    _pressUser(id) {
        this.state.checkBoxData[id].onClick();
    }
    //选中时设置属性
    onSelect(index, value){
        this.setState({
            select_value:`${value}`
        });
    }
    _confirm() {

        var url = config.api.base + config.api.changeAttendance;
        if(this.state.select_value==''){
            return toast.center('请选择一个分组！');
        }
        request.post(url,{
            checkedata: this.state.select_value,   //分组名称id
            checked_cancel: this.props.navigation.state.params.checkdata,   //划分到该组的员工id
            company:this.props.navigation.state.params.companyid,
        }).then((result)=> {
            if(result.status == 1) {
                return toast.center(result.message);
            }else if(result.status ==0){
                return toast.center(result.message);
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });



        //监听事件
        //DeviceEventEmitter.emit('firstWhiteUser');
        //考勤白名单页面
        this.props.navigation.navigate('AttendanceWhiteDetail',{companyid:this.props.navigation.state.params.companyid})


    }


    render(){
        const {navigate} = this.props.navigation;
        const {state} = this.props.navigation;
        var attendance = this.state.attendanceData;//考勤分组信息
        var attendanceList = [];
        for(var i in attendance) {
            attendanceList.push(
                <RadioButton value={attendance[i].id} key={i}
                             style={{borderBottomWidth: 1,
                                        borderBottomColor: '#F0F0F0',
                                         flexDirection :'row',
                                   alignItems:'center',}}
                    >
                    <View style={{flexDirection :'column',
                                   alignItems:'flex-start',
                                   }}
                        >
                        <Text style={{color:'#333', fontSize:12}}>{attendance[i].groupname}</Text>
                        <Text style={{fontSize:10}}>{attendance[i].timename}:{attendance[i].time}</Text>
                    </View>
                </RadioButton>
            )
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>设置考勤分组</Text>
                    <TouchableHighlight
                         underlayColor={'transparent'}
                         style={[styles.goRight,styles.go]}
                         onPress={() => this._confirm()}
                        >
                        <Text style={[styles.back_text,{color:'#e15151'}]}>确定</Text>
                    </TouchableHighlight>
                </View>

                <ScrollView>
                    <View style={[styles.content]}>
                        <RadioGroup  onSelect = {(index, value) => this.onSelect(index, value)}>
                            {attendanceList}
                        </RadioGroup>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#eed',
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
        right:15
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
        fontSize:16,
        color:'#333'
    },

    arrow_r:{
        width:16,
        height:16,
    },
    spaceBetween:{
        justifyContent:'space-between',
    },
    padding:{
        padding:10,paddingLeft:20,
    },
    common:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#fff'
    },
    content:{
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    } ,
    listRowContent: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        width:screenW,
        backgroundColor: '#fff',
    },
    checkStyle: {
        width: 50,
        height: 50,
        padding: 14
    },
    listRowSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarStyle: {
        width:34,
        height:34,
        marginRight:10,
        borderRadius: 20,
    },
});

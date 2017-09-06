/**
 * Created by Administrator on 2017/7/5.
 */
/**
 * Created by Administrator on 2017/7/05.
 * 考勤管理
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
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class AttendanceManage extends Component {
    OpBack() {
        this.props.navigation.goBack('AttendanceManage')
        //this.props.navigation.navigate('CompanySetting',{companyid:this.props.navigation.state.params.companyid})
    }
    constructor(props) {
        super(props);
        const params= this.props.navigation.state.params.companyid;
        this.state = {
            value:'',
            select_value: '' ,
            companyid:params,
        }

    }
    componentDidMount() {
        //根据新建分组监听
        this.newGroup = DeviceEventEmitter.addListener('newgroup',
            (a)=>{
                var url = config.api.base + config.api.changeAttendance;
                var id=a;
                request.post(url,{
                    attendanceCompany: id,
                }).then((responseJson) => {
                    this.setState({
                        attendanceData: responseJson,
                    })
                }).catch((error)=>{
                    toast.bottom('网络连接失败，请检查网络后重试');
                })
             });
        //根据修改或删除分组监听
        this.editGroup = DeviceEventEmitter.addListener('editgroup',
            (a)=>{
                var url = config.api.base + config.api.changeAttendance;
                var id=a;
                request.post(url,{
                    attendanceCompany: id,
                }).then((responseJson) => {
                    this.setState({
                        attendanceData: responseJson,
                    })
                }).catch((error)=>{
                    toast.bottom('网络连接失败，请检查网络后重试');
                })
            }) ;
        this.deleteGroup = DeviceEventEmitter.addListener('deletegroup',
            (a)=>{
                var url = config.api.base + config.api.changeAttendance;
                var id=a;
                request.post(url,{
                    attendanceCompany: id,
                }).then((responseJson) => {
                    this.setState({
                        attendanceData: responseJson,
                    })
                }).catch((error)=>{
                    toast.bottom('网络连接失败，请检查网络后重试');
                })
            }) ;
        this._firstWhiteUser() ;
    }

    componentWillUnmount() {
        this.newGroup.remove();
        this.editGroup.remove();
        this.deleteGroup.remove();
    }
    //页面一加载进来，就获取数据
    _firstWhiteUser(){
        var url = config.api.base + config.api.changeAttendance;
        var id=this.state.companyid;
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
    skipEdit(web,data){
         this.props.navigation.navigate(web,data);
    }
    render(){
        const {navigate} = this.props.navigation;
        const {state} = this.props.navigation;
        var attendance = this.state.attendanceData;//考勤分组信息
        var attendanceList = [];
        for(var i in attendance) {
            attendanceList.push(
                <TouchableHighlight  key={i}  underlayColor={'transparent'} onPress={this.skipEdit.bind(this,'ManageEditGroup',{attendance:attendance[i],companyid:this.props.navigation.state.params.companyid})}>
                    <View key={i} style={[styles.common,styles.spaceBetween,styles.padding,styles.borderBottom]}>
                        <View>
                            <Text style={{color:'#333', fontSize:13}}>{attendance[i].groupname}</Text>
                            <Text style={{fontSize:10}}>{attendance[i].timename}:{attendance[i].time}</Text>
                        </View>
                        <Image style={[styles.arrow_r]} source={require('../imgs/customer/arrow_r.png')}/>
                    </View>
                </TouchableHighlight>
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
                    <Text style={styles.formHeader}>考勤管理</Text>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goRight,styles.go]} onPress={() => { navigate('ManageNewGroup',{companyid:this.props.navigation.state.params.companyid});}}>
                        <Text style={[styles.back_text,{color:'#e15151'}]}>新建</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                <View style={[styles.borderBottom]}>
                    <TouchableHighlight underlayColor={'transparent'} onPress={() => { navigate('AttendanceWhiteDetail',{companyid:3});}}>
                        <View style={[styles.common,styles.spaceBetween,styles.padding]}>
                            <View>
                                <Text style={{color:'#333', fontSize:13}}>考勤白名单</Text>
                                <Text style={{fontSize:10}}>白名单成员，无需考勤</Text>
                            </View>
                            <Image style={[styles.arrow_r]} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </TouchableHighlight>
                </View>

                    <View >
                        {attendanceList}
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

    borderBottom:{
        borderColor:'#F0F0F0',
        borderBottomWidth:1
    },
    //borderColor:{
    //    borderColor:'#ddd',
    //},
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
        backgroundColor: '#fff' ,

    },
});

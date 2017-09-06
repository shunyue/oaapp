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
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    CheckBox,
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Modal from 'react-native-modal';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';
import moment from 'moment';
//import DateTimePicker from 'react-native-modal-datetime-picker';
import Picker from 'react-native-picker';
export default class SubordinateLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            load:true,
            daily_report:[],
            week_report:[],
            month_report:[],
            time: moment(new Date()).format('YYYY-MM-DD'),
            title:'今天日志',
            isPickerVisible: false,
        };
    }
    componentDidMount() {
        this.getData(this.state.time);
    }
    getData(time){
        let {params} = this.props.navigation.state;
        var url = config.api.base + config.api.getLogs;
        request.post(url, {
            title:4,
            employee_id:params.user_id,
            company_id:params.company_id,
            datetime:time
        }).then((res) => {
            var data=res.data;
            this.setState({
                daily_report:data.daily,
                week_report:data.week,
                month_report:data.month,
                companyname:data.companyname,
                load:false
            })
        })
        .catch((error)=> {
                toast.bottom('网络连接失败，请检查网络后重试');
        });
    }

    componentWillUnmount() {
        Picker.hide();
    }
    back() {
        Picker.hide();
        this.props.navigation.goBack(null);
    }
    go_PageDetail(status,userInfo){
        Picker.hide();
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('SubordinateLogDetail',{
         user_id:params.user_id,
         company_id:params.company_id,
         log_type: status,
         userInfo:userInfo
        })
    }
    _createDateData() {
        let date = [];
        for(let i=1950;i<2050;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k);
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29);
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k);
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k);
                    }
                }
                let _month = {};
                _month[j] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i] = month;
            date.push(_date);
        }
        return date;
    }
    _hide(){
        Picker.hide();
    }
    ////选择日期
    _showDatePicker(){
       // this.setState({isPickerVisible: true});
       var year=moment(new Date()).format('YYYY');
       var month=moment(new Date()).format('M');
       var day=moment(new Date()).format('D');
        Picker.init({
            pickerData: this._createDateData(),
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择日期',
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            selectedValue: [year,month,day],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                var datetime=pickedValue.join("-");
                var title= pickedValue[0]+'年'+pickedValue[1]+'月'+pickedValue[2]+'日';
                this.setState({
                    datetime: datetime,
                    title: title,
                    load:true
                });
                this.getData(datetime);
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                Picker.hide();
            },
            onPickerSelect: (pickedValue, pickedIndex) => {

            }
        });
     Picker.show();
      //Picker.toggle();
    }
    ////选择
    //_handlePicked(e){//开始
    //    this.setState({
    //        datetime: moment(e).format('YYYY-MM-DD'),
    //        title:moment(e).format('YYYY年MM月DD日'),
    //        load:true
    //    });
    //    this.getData(moment(e).format('YYYY-MM-DD'))
    //    this._hideDateTimePicker();
    //}
    ////取消选择日期
    //_hideDateTimePicker(){
    //    this.setState({
    //        isPickerVisible: false,
    //    });
    //}
    render() {
        //加载过程
        if (this.state.load) {
            return (
                <Loading/>
            )
        }

        var status=this.state.status;
        if(status==1){//日报
          var data=this.state.daily_report;
        }else if(status==2){
          var data=this.state.week_report;
        }else if(status==3){
            var data=this.state.month_report;
        }
        var logArr=[];
        if(data.length!=0){
           for(var i=0;i<data.length;i++){
               if(data[i].Report!=null && data[i].Report.length!=0){
                   var statusName='已提交';
               }else{
                   var statusName='未提交';
               }
               logArr.push(
                   <TouchableHighlight
                       onPress={this.go_PageDetail.bind(this,status,data[i].userInfo)}
                       underlayColor="#f3f3f3"
                       key={i}
                       >
                       <View style={[com.bckfff,com.pdt5l10,com.row,com.AIC,com.bbwc]}>
                           <View
                               style={[com.aic,com.row,com.jcsb,{width:screenW*0.95}]}>
                               <View style={[com.row,]}>
                                   <View style={[com.bweb,com.br200,com.mgr5]}>
                                       {(data[i].userInfo.avatar==""||data[i].userInfo.avatar==null)?(
                                           <Image style={[com.br200,com.wh32]} source={require('../../imgs/tx.png')}/>
                                       ):(<Image style={[com.br200,com.wh32]} source={{uri:data[i].userInfo.avatar}}/>)}
                                   </View>
                                   <View style={[com.jcc]}>
                                       <Text>{data[i].userInfo.name}</Text>
                                   </View>
                               </View>
                               <View>
                                   <Text style={[com.fs12,com.cbe]}>{statusName}</Text>
                               </View>
                           </View>

                       </View>
                   </TouchableHighlight>
               )
           }
        }else{
            logArr.push(
            <View style={[com.jcc,com.aic]} key={0}>
                <Text>没有数据</Text>
            </View>)
        }
        return (
            <View style={[com.flex]}>
                <TouchableWithoutFeedback onPress={()=>{this._hide()}}>
                    <View style={[com.flex]}>
                        {/*导航栏*/}
                        <View style={[com.row,com.jcsb,com.pdlr5,com.bgcfff,com.bbwcc,com.aic,com.h35,]}>
                            <TouchableHighlight
                                style={{width:60,alignItems:'center',}}
                                onPress={()=>this.back()}
                                underlayColor="#f3f3f3"
                                >
                                <View style={[com.row,]}>
                                    <Image source={require('../../imgs/navxy.png')}/>
                                    <Text style={[com.mgr15,com.cr]}>返回</Text>
                                    {/*  <Text style={[com.cr]}>关闭</Text>*/}
                                </View>
                            </TouchableHighlight>
                            <Text>{this.state.title}</Text>
                            <TouchableHighlight
                                style={{width:60,alignItems:'center'}}
                                onPress={this._showDatePicker.bind(this)}
                                underlayColor="#f3f3f3"
                                >
                                <View style={[com.jcfe,]}>
                                    <Image style={[com.wh20,com.tcr]} source={require('../../imgs/iconsj.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        {/*    <DateTimePicker
                         isVisible={this.state.isPickerVisible}
                         onConfirm={(e)=>{this._handlePicked(e)}}
                         onCancel={()=>this._hideDateTimePicker()}
                         mode='date'
                         />*/}
                        {/*内容主题*/}
                        <View style={[com.row,com.jcsa,com.bckfff]}>
                            <TouchableHighlight
                                style={[com.jcc,]}
                                onPress={()=>{ Picker.hide();this.setState({status:1});}}
                                underlayColor="#f3f3f3"
                                >
                                <View style={[com.aic,com.jcc]}>
                                    <Text style={[this.state.status==1?com.cr:null,com.pdb6,com.pdt6]}>日报</Text>
                                    {this.state.status==1?(<Image style={[{height:1,width:screenW*0.3},com.tcr]}
                                                                  source={require('../../imgs/daily/straightLine.png')}/>) : (
                                        <Image style={[{height:1,width:screenW*0.3},com.tcr]}
                                               source={require('../../imgs/daily/straightLinefz.png')}/>)}
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[com.jcc,]}
                                onPress={()=>{ Picker.hide();this.setState({status:2});}}
                                underlayColor="#f3f3f3"
                                >
                                <View style={[com.aic,com.jcc]}>
                                    <Text style={[this.state.status==2?com.cr:null,com.pdb6,com.pdt6]}>周报</Text>
                                    {this.state.status==2?(<Image style={[{height:1,width:screenW*0.3},com.tcr]}
                                                                  source={require('../../imgs/daily/straightLine.png')}/>) : (
                                        <Image style={[{height:1,width:screenW*0.3},com.tcr]}
                                               source={require('../../imgs/daily/straightLinefz.png')}/>)}
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[com.jcc,]}
                                onPress={()=>{ Picker.hide();this.setState({status:3});}}
                                underlayColor="#f3f3f3"
                                >
                                <View style={[com.aic,com.jcc]}>
                                    <Text style={[this.state.status==3?com.cr:null,com.pdb6,com.pdt6]}>月报</Text>
                                    {this.state.status==3?(<Image style={[{height:1,width:screenW*0.3},com.tcr]}
                                                                  source={require('../../imgs/daily/straightLine.png')}/>) : (
                                        <Image style={[{height:1,width:screenW*0.3},com.tcr]}
                                               source={require('../../imgs/daily/straightLinefz.png')}/>)}
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View  style={[com.row,com.pdt5l10]}>
                            <Text style={[com.fs12]}>{this.state.companyname}</Text>
                        </View>
                        <ScrollView style={[com.flex,{height:screenH}]}>
                            <View style={[com.bckf5,com.btwc,]}>
                                {logArr}
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>


            </View>
        )
    }
}


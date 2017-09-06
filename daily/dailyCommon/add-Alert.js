/**
 * Created by Administrator on 2017/6/30.
 * 选择项目
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
    TextInput,
    ScrollView,
    DeviceEventEmitter,
    Switch,
    Alert
    } from 'react-native';
import CheckBox from 'react-native-check-box';
import {StackNavigator,TabNavigator } from "react-navigation";
//import DateTimePicker from 'react-native-modal-datetime-picker';
import Picker from 'react-native-picker';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import moment from 'moment';
export default class AddAlert extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            switchValue:params.timeData.switchValue,
            selectNum:params.timeData.selectNum,
            isPickerVisible:false,
            alertTime:0,
            starttime:params.timeData.startstamp,
            showTime:"",
            alertName:"不提醒"
        };
    }
    OpBack(e) {
        if(e){//确定
            var  alertData={
                alertTime:this.state.alertTime,
                confirm_recept:this.state.switchValue,
                selectNum:this.state.selectNum,
                alertName:this.state.alertName
            }
        }else{//返回
            let {params} = this.props.navigation.state;
            var alertData={
                alertTime:params.timeData.startstamp,
                confirm_recept:params.timeData.confirm_recept,
                selectNum:params.timeData.selectNum,
                alertName:params.timeData.alertName
            }
        }
        DeviceEventEmitter.emit('alertData',alertData);
        this.props.navigation.goBack(null)
    }
    HandelAlert(num){
       this.setState({
           selectNum:num
       })
        if(num==8){
            this._showTimePicker();
        }else if(num==1){
            this.setState({
                alertTime:0,
                alertName:"不提醒"
            })
        }else if(num==2){
            this.setState({
                alertTime: this.state.starttime,
                alertName:"开始工作时"
            })
        }else if(num==3){
            this.setState({
                alertTime: this.state.starttime-5*60,
                alertName:"5分钟前"
            })
        }else if(num==4){
            this.setState({
                alertTime: this.state.starttime-15*60,
                alertName:"15分钟前"
            })
        }else if(num==5){
            this.setState({
                alertTime: this.state.starttime-30*60,
                alertName:"30分钟前"
            })
        }else if(num==6){
            this.setState({
                alertTime: this.state.starttime-60*60,
                alertName:"1小时前"
            })
        }else if(num==7){
            this.setState({
                alertTime: this.state.starttime-60*60*24,
                alertName:"1天前"
            })
        }
    }
    _handlePicked(e){
        this.setState({
            showTime:moment(e).format('MM-DD h:mm'),
            alertTime: moment(e).format('YYYY-MM-DD h:mm'),
            alertName:"自定义"
        });
        this._hideDateTimePicker();
    }
    _hideDateTimePicker(){
        this.setState({
            isPickerVisible: false
        })
    }
    _showTimePicker() {
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
        for(let i=1;i<61;i++){
            minutes.push(i);
        }
        let pickerData = [years, months, days, ['am', 'pm'], hours, minutes];
        let date = new Date();
        let selectedValue = [
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate(),
            date.getHours() > 11 ? 'pm' : 'am',
            date.getHours() === 12 ? 12 : date.getHours()%12,
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
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                for(i=0;i<pickedValue.length;i++){
                    if(pickedValue[i]<10){
                        pickedValue[i]='0' + pickedValue[i];
                    }
                }
                if(pickedValue[3]=='pm'){
                    pickedValue[4]=pickedValue[4]-(-12);
                }
                var date = pickedValue[0]+'-'+pickedValue[1]+'-'+pickedValue[2]
                    +'  '+pickedValue[4]+':'+pickedValue[5];
                var timestamp=this.get_unix_time(date);
                    this.setState({
                        showTime:date,
                        alertTime: timestamp,
                        alertName:"自定义"
                    });
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
        var time = parseInt(date.getTime())/1000;
        return time;
    }
    render(){
       const {params} = this.props.navigation.state;
           return (
               <View style={styles.ancestorCon}>
                   <View style={styles.container}>
                       <TouchableHighlight underlayColor={'#fff'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack(false)}>
                           <View style={{flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                               <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                               <Text style={styles.back_text}>取消</Text>
                           </View>
                       </TouchableHighlight>
                       <Text style={styles.formHeader}>提醒</Text>
                       <TouchableHighlight underlayColor={'#fff'} style={[styles.goRight,styles.go]} onPress={()=>this.OpBack(true)}>
                           <Text style={styles.back_text}>确定</Text>
                       </TouchableHighlight>
                   </View>
                   <ScrollView>
                         <TouchableHighlight underlayColor={'#fff'} onPress={this.HandelAlert.bind(this,1)}>
                           <View style={[styles.customerName,styles.borderStyle,styles.flex_position,styles.padding_value,styles.marginTop]}>
                               <Text>不提醒</Text>
                               {this.state.selectNum==1?(
                                   <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                               ):(null)}
                           </View>
                       </TouchableHighlight>
                        <TouchableHighlight
                           underlayColor={'#fff'}
                           style={[styles.customerName,styles.borderStyle,styles.flex_position,styles.padding_value,styles.marginTop]}
                           onPress={this.HandelAlert.bind(this,2)}>
                           <View style={{width:screenW-50,flexDirection:'row',justifyContent:'space-between',}}>
                               <Text style={{color:'#333'}}>开始工作时</Text>
                               {this.state.selectNum==2?(
                                   <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                               ):(null)}
                           </View>
                       </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'} onPress={this.HandelAlert.bind(this,3)}>
                            <View style={[styles.customerName,styles.borderStyle,]}>
                               <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                   <Text style={{color:'#333'}}>5分钟前</Text>
                                   {this.state.selectNum==3?(
                                       <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                                   ):(null)}
                                   </View>
                            </View>
                       </TouchableHighlight>
                      <TouchableHighlight underlayColor={'#fff'} onPress={this.HandelAlert.bind(this,4)}>
                       <View style={[styles.customerName,styles.borderStyle]}>
                               <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                   <Text style={{color:'#333'}}>15分钟前</Text>
                                   {this.state.selectNum==4?(
                                       <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                                   ):(null)}
                               </View>
                       </View>
                       </TouchableHighlight>
                       <TouchableHighlight underlayColor={'#fff'} onPress={this.HandelAlert.bind(this,5)}>
                           <View style={[styles.customerName,styles.borderStyle]}>
                               <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                   <Text style={{color:'#333'}}>30分钟前</Text>
                                   {this.state.selectNum==5?(
                                       <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                                   ):(null)}
                               </View>
                           </View>
                       </TouchableHighlight>
                       <TouchableHighlight underlayColor={'#fff'} onPress={this.HandelAlert.bind(this,6)}>
                           <View style={[styles.customerName,styles.borderStyle]}>
                               <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                   <Text style={{color:'#333'}}>1小时前</Text>
                                   {this.state.selectNum==6?(
                                       <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                                   ):(null)}
                               </View>
                           </View>
                       </TouchableHighlight>
                       <TouchableHighlight underlayColor={'#fff'} onPress={this.HandelAlert.bind(this,7)}>
                           <View style={[styles.customerName,styles.borderStyle]}>
                               <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                   <Text style={{color:'#333'}}>1天前</Text>
                                   {this.state.selectNum==7?(
                                       <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                                   ):(null)}
                               </View>
                           </View>
                       </TouchableHighlight>
                       <TouchableHighlight underlayColor={'#fff'} onPress={this.HandelAlert.bind(this,8)}>
                       <View style={[styles.customerName,styles.borderStyle]}>
                               <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                   <Text style={{color:'#333'}}>自定义</Text>
                                   {this.state.selectNum==8?(
                                   <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                       <Text>{this.state.showTime}</Text>
                                    <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                                    </View>
                                   ):(null)}
                               </View>
                       </View>
                       </TouchableHighlight>
                       {/*  <DateTimePicker
                           isVisible={this.state.isPickerVisible}
                           onConfirm={(e)=>{this._handlePicked(e)}}
                           onCancel={()=>this._hideDateTimePicker()}
                           mode='datetime'
                           is24Hour={true}
                           />*/}
                       <View style={[styles.customerName,styles.borderStyle,styles.marginTop]}>
                               <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                   <Text style={{color:'#333'}}>必达提醒</Text>
                                   <Switch
                                       style={[styles.switchCon]}
                                       value={this.state.switchValue}
                                       //当切换开关回调此方法
                                       onValueChange={(switchValue)=>{this.setState({switchValue:switchValue})}}
                                       />
                               </View>
                           </View>
                       {this.state.switchValue==true?
                                   (<TouchableHighlight underlayColor={'#fff'} onPress={()=>{navigate('AddProject', {title: '模板'})}}>
                                       <View style={[styles.customerName,styles.borderStyle]}>
                                           <View style={[styles.customerName2,styles.flex_position,styles.padding_value]}>
                                               <View style={{ flexDirection :'column',alignItems:'flex-start',justifyContent:'center'}}>
                                                   <Text style={{color:'#333',fontSize: 14,}}>应用内</Text>
                                                   <Text style={{ fontSize:10}}>在应用内提醒接收人</Text>
                                               </View>
                                               <Image style={[styles.row_img]}  source={require('../../imgs/daily/true.png')}/>
                                           </View>
                                       </View>
                           </TouchableHighlight>):(null)}
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
    search_bj:{
        backgroundColor:'#ddd',
        height:44,
        width:screenW,
        flexDirection:'row',
        alignContent:'center',
    },
    search_border:{
        width:screenW*0.95,
        height:28,
        backgroundColor:'#fff',
        marginLeft:8,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    search_border2:{
        width:screenW*0.85,
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:25,
        height:25,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.8,
        height:30,
        padding:0,
    },

    customerName:{
        width:screenW,
        backgroundColor:'#fff',
    },
    marginTop:{
        marginTop:10,
    },
    flex_position:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    padding_value:{
        paddingLeft:25,
        paddingRight:25,
        height:40,
    },
    borderStyle:{
        borderColor:'#d5d5d5',
        borderBottomWidth: 1,
    },
    textINput_arrow:{
        width:16,
        height:16,
        marginLeft:10
    },
    row_img:{
        width:15,
        height:15,
    },
});

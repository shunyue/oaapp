/**
 * Created by Administrator on 2017/6/7.
 * 负责人：周飞飞 ，界面设计：候占山
 */
'use strict'
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ScrollView,

    } from 'react-native';
import PieChart from 'react-native-pie-chart';
import Picker from 'react-native-picker';

import moment from 'moment';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
const screenW = Dimensions.get('window').width;
export default class HomePlanPerformance extends Component {
    OpBack() {
        this.props.navigation.goBack('HomePlanPerformance')
    }
    constructor(props) {
        super(props);
        this.state = {
            yearMonth:this.props.navigation.state.params.yearMonth,
            total_money:this.props.navigation.state.params.total_money,
            aimsell: this.props.navigation.state.params.aimsell,
            achievemoney: this.props.navigation.state.params.achievemoney,
            achievesell: this.props.navigation.state.params.achievesell,
            result:this.props.navigation.state.params.result,
            sellresult:this.props.navigation.state.params.sellresult,
            change:false,
            color:false
        }
    }

    componentDidMount() {
        this.firstProduce();
    }
    firstProduce(){
        var url=config.api.base + config.api.achievement;
        var temp= this.props.navigation.state.params.yearMonth;
        var realLength = 0, len = temp.length, charCode = -1;
        var change;   //3代表年度，2代表季度，1代表月度
        for (var i = 0; i < len; i++) {
            charCode = temp.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        if(Number(realLength)==6){
            change=3
        }else if(Number(realLength)==11){
            change=2
        }else{
            change=1
        }
        request.post(url,{
            companyid:this.props.navigation.state.params.company_id,
            yearMonth:this.props.navigation.state.params.yearMonth,
            status:change
        }).then((responseJson) => {
            alert(JSON.stringify(responseJson.data));
            this.setState({
                reslovedata:responseJson.data,
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    _showYearPicker() {
        var month = [];
        for(var i = 1;i<13;i++) {
            month.push(i+'月');
        }
        var jidu = [];
        for(var i = 1;i<5;i++) {
            jidu.push(i+'季度');
        }
        let year = [];
        for(var i=2017;i<2051;i++){
            year.push({[i]:month});
        }
        let year1 = [];
        for(var i=2017;i<2051;i++){
            year1.push({[i]:jidu});
        }
        let year2 = [];
        for(var i=2017;i<2051;i++){
            year2.push({[i]:[""]});
        }
        // return alert(JSON.stringify(year))

        var jidu2;
        var season;
        if(moment().format("M")>=1&&moment().format("M")<=3 ){
            jidu2='1季度';
        }else if(moment().format("M")>=4 && moment().format("M")<=6 ){
            jidu2='2季度';
        }else if(moment().format("M")>=7 && moment().format("M")<=9 ){
            jidu2='3季度';
        }else if(moment().format("M")>=10 && moment().format("M")<=12 ){
            jidu2='4季度'
        }
        season= moment().format("YYYY")+'年'+ jidu2;
        var yue= moment().format("YYYY")+'年'+moment().format("M月");
        var yearing= moment().format("YYYY")+'年';
        var pickerData = [
            {
                '月': year,
            }, {
                '季': year1,
            }, {
                '年': year2,
            }
        ]
        var valuePickerData=['',moment().format("YYYY"),moment().format("M月")]
        Picker.init({
            pickerData:pickerData ,
            pickerTitleText: '选择时间',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            selectedValue:valuePickerData,
            onPickerConfirm: data => {
                this.setState({yearMonth:data[1]+'年'+data[2]});
            },
        });
        Picker.show();
        //number=1，代表是月度目标
        //number=2，代表是季度目标
        //number=3，代表是年度目标
        if(this.state.yearMonth==season){
            this.setState({
                number:1
            })
        } else if(this.state.yearMonth==yue){
            this.setState({
                number:2
            })
        }  else if(this.state.yearMonth==yearing){
            this.setState({
                number:3
            })
        }
    }
    _hide(){
        Picker.hide();
    }
    changeM(index){
        /* 金额目标*/
        const chart_wh = 150
        var percent=Number(this.state.achievemoney)/Number(this.state.total_money);  /* 完成目标除以总金额目标*/
        var reach =Number(this.state.result);   /* 金额完成量 指针图表位置*/
        var series = [reach, 1-reach]
        var deg = reach*180+'deg'
        const sliceColor = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800'] ;
        var moneylist=[];
        var datalist=this.state.reslovedata;
        for(var i in datalist){
            moneylist.push(
                <View key={i} style={styles.rowStyle}>
                    <View style={[styles.mean,styles.bg]}>
                        <Text style={{color:'#64b0f0'}}>{datalist[i].name}</Text>
                    </View>
                    <View style={[styles.mean]}>
                        <Text>{(datalist[i].percent1*100).toFixed(2)+'%'}</Text>
                    </View>
                    <View style={[styles.mean]}>
                        <Text>{datalist[i].sum1}</Text>
                    </View>
                    <View style={[styles.mean]}>
                        <Text>{datalist[i].total_money}</Text>
                    </View>
                </View>
            )
        }
        /* 销量目标*/
        var sellpercent=Number(this.state.achievesell)/Number(this.state.aimsell);
        var complete=Number(this.state.sellresult); /* 销量完成量*/
        var reach2 =Number(this.state.sellresult);  /* 指针图表位置*/
        const series2 = [reach2, 1-reach2]
        const deg2 = reach2*180+'deg' ;
        var selllist=[];
        var selldata=this.state.reslovedata;
        for(var i in selldata) {
            selllist.push(
                <View key={i} style={styles.rowStyle}>
                    <View style={[styles.mean,styles.bg]}>
                        <Text style={{color:'#64b0f0'}}>{datalist[i].name}</Text>
                    </View>
                    <View style={[styles.mean]}>
                        <Text>{(datalist[i].sellpercent1*100).toFixed(2)+'%'}</Text>
                    </View>
                    <View style={[styles.mean]}>
                        <Text>{datalist[i].num1}</Text>
                    </View>
                    <View style={[styles.mean]}>
                        <Text>{datalist[i].sell_number}</Text>
                    </View>
                </View>
            )
        }
        if(!index){
            return (
                <View>
                    <View  style={{height:160,justifyContent:'center',alignItems:'center',backgroundColor: '#fff',marginBottom:10,}}>
                        <View style={{justifyContent:'center',alignItems:'center',marginTop:50}}>
                            <PieChart
                                chart_wh={chart_wh}
                                series={series}
                                sliceColor={sliceColor}
                                doughnut={true}
                                coverRadius={0.5}
                                coverFill={'#FFF'}
                                />

                            <View style={{position:'absolute',transform:[{translate:[0,-0.5,0]},{rotateZ:deg}]}}>
                                <Image style={{width:66,height:12}} tintColor={'#aaa'} source={require('../imgs/pointer.png')}/>
                            </View>
                            <View style={{width:195,height:14,position:'absolute',transform:[{translate:[0,-2,0]},{rotateZ:deg}]}}>
                                <Text style={reach?{fontSize:12}:{display:'none'}}>{reach}</Text>
                            </View>
                            <View style={{position:'absolute',width:140,top:70,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <View style={{width:30,alignItems:'flex-start'}}>
                                    <Text style={{fontSize:12}}>0 </Text>
                                </View>

                                <Text style={{color:'#333',marginTop:15,fontSize:12}}>{reach}</Text>

                                <View style={{width:30,alignItems:'flex-end'}}>
                                    <Text style={{fontSize:12}}>1</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#fff'}}>
                        <View style={[styles.rowStyle,styles.bordeTop]}>
                            <View style={[styles.mean]}>
                                <Text>部门/人员</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>达成率</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>回款额</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>目标额</Text>
                            </View>
                        </View>
                        <View style={styles.rowStyle}>
                            <View style={[styles.mean,styles.bg]}>
                                <Text>总目标</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{(percent*100).toFixed(2)+'%'}</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.achievemoney}</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.total_money}</Text>
                            </View>
                        </View>
                        {moneylist}
                    </View>
                </View>
            );
        }else  if(index){
            return(
                <View>
                    <View  style={{height:160,justifyContent:'center',alignItems:'center',backgroundColor: '#fff',marginBottom:10,}}>
                        <View style={{justifyContent:'center',alignItems:'center',marginTop:50}}>
                            <PieChart
                                chart_wh={chart_wh}
                                series={series2}
                                sliceColor={sliceColor}
                                doughnut={true}
                                coverRadius={0.5}
                                coverFill={'#FFF'}
                                />

                            <View style={{position:'absolute',transform:[{translate:[0,-0.5,0]},{rotateZ:deg2}]}}>
                                <Image style={{width:66,height:12}} tintColor={'#aaa'} source={require('../imgs/pointer.png')}/>
                            </View>
                            <View style={{width:195,height:14,position:'absolute',transform:[{translate:[0,-2,0]},{rotateZ:deg2}]}}>
                                <Text style={reach2?{fontSize:12}:{display:'none'}}>{complete}</Text>
                            </View>
                            <View style={{position:'absolute',width:140,top:70,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <View style={{width:30,alignItems:'flex-start'}}>
                                    <Text style={{fontSize:12}}>0</Text>
                                </View>
                                <Text style={{color:'#333',marginTop:15,fontSize:12}}>{complete}</Text>
                                <View style={{width:30,alignItems:'flex-end',}}>
                                    <Text style={{fontSize:12}}>1</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#fff'}}>
                        <View style={[styles.rowStyle,styles.bordeTop]}>
                            <View style={[styles.mean]}>
                                <Text>部门/人员</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>达成率</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>订单量</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>目标量</Text>
                            </View>
                        </View>
                        <View style={styles.rowStyle}>
                            <View style={[styles.mean,styles.bg]}>
                                <Text>总目标</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{(sellpercent*100).toFixed(2)+'%'}</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.achievesell}</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.aimsell}</Text>
                            </View>
                        </View>
                        {selllist}
                    </View>
                </View>
            )
        }
    }
    render() {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.ancestorCon}>
                <TouchableWithoutFeedback onPress={()=>this._hide()}>
                    <View style={styles.ancestorCon}>
                        <View style={[styles.container,{justifyContent:'space-between',paddingLeft:15,paddingRight:15}]}>
                            <TouchableHighlight underlayColor={'transparent'} style={{width:50}} onPress={()=>{this.OpBack();this._hide()}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                                    <Text style={styles.back_text}>返回</Text>
                                </View>
                            </TouchableHighlight>
                            <Text style={{color:'#333',fontSize:17}}>销售业绩排行</Text>
                            <TouchableHighlight underlayColor={'transparent'} style={{width:50}} onPress={()=>{this._showYearPicker()}}>
                                <Text style={[styles.back_text,{textAlign:'right'}]}>筛选</Text>
                            </TouchableHighlight>
                        </View>
                        <View  style={{height:60,backgroundColor: '#fff',justifyContent:'center',}}>
                            <View style={[{height:30,flexDirection:"row",justifyContent:'space-between'},styles.padding]}>
                               <View style={{width:80}}>
                                   <Text style={this.state.change?{display:'none'}:{fontSize:11,}}>单位：元</Text>
                               </View>
                                <Text style={{color:'#333'}}>{this.state.yearMonth}</Text>
                                <TouchableHighlight style={{width:80,height:25,borderColor:'#e15151',borderWidth:1,borderRadius:4,justifyContent:'center'}} underlayColor={'transparent'} onPress={()=>{this.setState({change:!this.state.change})}}>
                                    <View style={{width:80,height:25,borderColor:'#e15151',borderWidth:1,borderRadius:4,justifyContent:'center'}}>
                                        <Text style={this.state.change?{display:'none'}:{fontSize:11,textAlign:'center',color:'#e15151'}}>查看销量目标</Text>
                                        <Text style={this.state.change?{fontSize:11,textAlign:'center',color:'#e15151'}:{display:'none'}}>查看金额目标</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        {this.changeM(this.state.change)}
                    </View>
                </TouchableWithoutFeedback>
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
    tabar_scroll:{
        height:44,
        justifyContent:'center',
        borderColor:'#fff'
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    add:{
        width:22,
        height:22,
    },
    place:{
        flexDirection:'row',
        alignItems:'center',
    },
    bordeTop:{
        borderTopWidth:1,
        borderColor:'#ccc'

    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    monthStyle:{
        paddingLeft:10,
        marginRight:20,
        borderColor:'#fb9819',
        borderLeftWidth:4,
        height:60,
    },
    monthStyle_N:{
        paddingLeft:10,
        paddingRight:10,
        marginRight:10,
        backgroundColor:'#fb9819',
        height:60,
    },
    quarterStyle:{
        paddingLeft:10,
        marginRight:20,
        borderColor:'#62b8f4',
        borderLeftWidth:4,
        height:60,
    },
    quarterStyle_N:{
        paddingLeft:10,
        paddingRight:10,
        marginRight:10,
        backgroundColor:'#62b8f4',
        height:60,
    },
    chart: {
        width: 200,
        height: 200,
    },
    padding:{
        paddingLeft:15,
        paddingRight:15
    },
    rowStyle:{
        flexDirection:'row',
        alignItems:'center',
        height:30,
        borderColor:'#ccc',
        borderBottomWidth:1
    },
    mean:{
        width:screenW*0.25,
        height:30,
        alignItems:'center',
        justifyContent:'center',
    },
    borderTop:{
        borderColor:'#ccc',
        borderTopWidth:1
    },
    bg:{
        backgroundColor:'#e5e5e5'
    },

});
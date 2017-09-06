/**
 * 最新业绩 展开
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

import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';


const screenW = Dimensions.get('window').width;
export default class HomePlan extends Component {
    OpBack() {
        this.props.navigation.goBack(null)
    }
    constructor(props) {
        super(props);
        this.state = {
            yearMonth:moment().format("YYYY年MM月"),
            listview:[],//个人情况
            performance_month:'',//平均总业绩
            performance_month_back:'',//平均回款
            performance_month_unback:'',//平均未回款
        }
    }



    componentDidMount(){
        this.getNet();
    }


    getNet(year,monthorquarter){


        var url = config.api.base + config.api.newer_performance_unwind;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//登录者id
            year:year,//年
            monthorquarter:monthorquarter,//月or季度
        }).then((responseText) => {
           //alert(JSON.stringify (responseText))
            if(responseText.sing==1){
                this.setState({
                    listview:responseText.peopel_detail,
                    performance_month:responseText.performance_month,//平均总业绩
                    performance_month_back:responseText.performance_month_back,//平均回款
                    performance_month_unback:responseText.performance_month_unback,//平均未回款
                })
            }else{
                toast.center('没有数据');
                this.setState({
                    listview:[],
                    performance_month:0,//平均总业绩
                    performance_month_back:0,//平均回款
                    performance_month_unback:0,//平均未回款
                })
            }
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
        let y2 = Number(moment().format("YYYY")) + Number(5);
        let y0 = Number(moment().format("YYYY"))- Number(5);
        let year = [];
        for(var i=y0;i<y2;i++){
            year.push({[i]:month});
        }
        let year1 = [];
        for(var i=y0;i<y2;i++){
            year1.push({[i]:jidu});
        }
        let year2 = [];
        for(var i=y0;i<y2;i++){
            year2.push({[i]:[""]});
        }

        // return alert(JSON.stringify(year))

        var jidu2;
        if(moment().format("M")>=1&&moment().format("M")<=3 ){
            jidu2='1季度'
        }else if(moment().format("M")>=4 && moment().format("M")<=6 ){
            jidu2='2季度';
        }else if(moment().format("M")>=7 && moment().format("M")<=9 ){
            jidu2='3季度';
        }else if(moment().format("M")>=10 && moment().format("M")<=12 ){
            jidu2='4季度'
        }

        var pickerData = [
            {
                '月': year,
            }, {
                '季': year1,
            }, {
                '年': year2,
            }

        ]

        //alert(JSON.stringify(pickerData))
        var valuePickerData=['',moment().format("YYYY"),moment().format("M月")]
        Picker.init({
            pickerData:pickerData ,
            pickerTitleText: '选择时间',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            selectedValue:valuePickerData,
            onPickerConfirm: data => {
               this.setState({yearMonth:data[1]+'年'+data[2]});
                this.getNet(data[1],data[2]);
            },
        });
        Picker.show();
    }
    _hide(){
        Picker.hide();
    }
    render() {


        //人员

        var people_list=[];
        var total_performance=[];
        var total_performance_back=[];
        var total_performance_unback=[];

        for(var i in this.state.listview ){
            people_list.push(
                <View key={i}>
                <View style={[styles.mean]}>
                    <Text style={{color:'#64b0f0'}}>{this.state.listview[i].people_id}</Text>
                </View>
                 </View>
            )

            total_performance.push(
                <View key={i}>
                <View style={[styles.mean]}>
                    <Text>{this.state.listview[i].people_performance_month==null?0:this.state.listview[i].people_performance_month}</Text>
                </View>
                </View>
            )
            total_performance_back.push(
                <View key={i}>
                    <View style={[styles.mean]}>
                        <Text>{this.state.listview[i].people_performance_month_back==null?0:this.state.listview[i].people_performance_month_back}</Text>
                    </View>
                </View>
            )
            total_performance_unback.push(
                <View key={i}>
                    <View style={[styles.mean]}>
                        <Text>{this.state.listview[i].people_performance_month_unback}</Text>
                    </View>
                </View>
            )



        }




        const {navigate} = this.props.navigation;
        const chart_wh = 150
        const reach =0.3
        const series = [reach, 1-reach]
        const deg = reach*180+'deg'
        const sliceColor = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800']
        return (
            <View style={styles.ancestorCon}>
                <View style={[styles.container,{justifyContent:'space-between',paddingLeft:15,paddingRight:15}]}>
                    <TouchableHighlight underlayColor={'transparent'} style={{width:50}} onPress={()=>{this.OpBack();this._hide()}}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:17}}>销售区域排行</Text>
                    <TouchableHighlight underlayColor={'transparent'} style={{width:50}} onPress={()=>{this._showYearPicker()}}>
                        <Text style={[styles.back_text,{textAlign:'right'}]}>筛选</Text>
                    </TouchableHighlight>
                </View>
                <View  style={{height:60,paddingTop:15,backgroundColor: '#fff',}}>
                    <View style={[{height:30,flexDirection:"row",justifyContent:'space-between'},styles.padding]}>
                        <Text style={{width:80,fontSize:11,}}>单位：万元</Text>
                        <Text style={{color:'#333'}}>{this.state.yearMonth}</Text>
                        <View style={{width:80}}></View>
                    </View>
                </View>
                <View style={{backgroundColor:'#fff', flexDirection :'row',}}>
                    <View style={[styles.bordeTop,{width:100,backgroundColor:'#e1e1e1',}]}>
                        <View style={[styles.mean,{backgroundColor:'#fff',}]}>
                            <Text>部门/人员</Text>
                        </View>
                        <View style={[styles.mean]}>
                            <Text>平均</Text>
                        </View>
                        {people_list}

                    </View>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        >
                        <View style={[styles.bordeTop,{width:100}]}>
                            <View style={[styles.mean]}>
                                <Text>总业绩</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.performance_month}</Text>
                            </View>
                            {total_performance}

                        </View>
                        <View style={[styles.bordeTop,{width:100}]}>
                            <View style={[styles.mean]}>
                                <Text>已确认回款</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.performance_month_back}</Text>
                            </View>
                            {total_performance_back}
                        </View>
                        <View style={[styles.bordeTop,{width:100}]}>
                            <View style={[styles.mean]}>
                                <Text>未确认回款</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.performance_month_unback}</Text>
                            </View>
                            {total_performance_unback}
                        </View>
                    </ScrollView>
                </View>
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
        width:100,
        height:35,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ccc',
        borderBottomWidth:1
    },
    borderTop:{
        borderColor:'#ccc',
        borderTopWidth:1
    },


});
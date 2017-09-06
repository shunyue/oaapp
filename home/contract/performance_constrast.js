/**
 * 业绩对比展开
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
            listview:[],
            avarage_current:'',
            avarage_last:'',
        }
    }

    componentDidMount(){
        this.getNet();
    }

    getNet(year,month){

        var url = config.api.base + config.api.performance_contrast_unwind;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//登录者id
            year:year,
            month:month,
        }).then((responseText) => {
           // alert(JSON.stringify (responseText))
            if(responseText.sing==1){
                this.setState({
                    listview:responseText.people_data,
                    avarage_current:responseText.avarage_current,
                    avarage_last:responseText.avarage_last,
                })
            }else{

                toast.center('没有数据');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }






    _showYearPicker() {
        var month = [];
        for(var i = 1;i<13;i++) {
            month.push(i);
        }
        var month2 = [];
        var M=Number(moment().format("M")) + Number(1);
        for(var i = 1;i<M;i++) {
            month2.push(i);
        }
        let year = Number(moment().format("YYYY")) + Number(1);
        let year0 = Number(moment().format("YYYY"))- Number(5);
        let pickerData = [];
        for(var i=year0;i<year;i++){
            if(i==moment().format("YYYY")){
                pickerData.push({[i]:month2});
            }else{
                pickerData.push({[i]:month});
            }
        }


        //alert(JSON.stringify(pickerData))
        var valuePickerData=[moment().format("YYYY"),moment().format("M")]
        Picker.init({
            pickerData:pickerData ,
            pickerTitleText: '选择时间',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            selectedValue:valuePickerData,
            onPickerConfirm: data => {
                this.getNet(data[0],data[1]);
                this.setState({yearMonth:data[0]+'年'+data[1]+'月'});
            },
        });
        Picker.show();
    }
    _hide(){
        Picker.hide();
    }
    render() {


        const {navigate} = this.props.navigation;
        const chart_wh = 150
        const reach =0.3
        const series = [reach, 1-reach]
        const deg = reach*180+'deg'
        const sliceColor = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800']


        var people_name=[];
        var avarage_current=[];
        var avarage_last=[];

　　　　　　


        for(var i in this.state.listview) {

             //alert(JSON.stringify(this.state.listview[i][1].return_money_current))
            people_name.push(
                    <View key={i}>
                        <View style={[styles.mean]}>
                            <Text>{this.state.listview[i][0].name}</Text>
                        </View>
                    </View>
            )

            avarage_current.push(
                <View key={i}>
                    <View style={[styles.mean]}>
                        <Text>{this.state.listview[i][1].return_money_current==null?0:this.state.listview[i][1].return_money_current}</Text>
                    </View>
                </View>
            )

            avarage_last.push(
                <View key={i}>
                    <View style={[styles.mean]}>
                        <Text>{this.state.listview[i][2].return_money_last==null?0:this.state.listview[i][1].return_money_last}</Text>
                    </View>
                </View>
            )

        }
    　　　

        return (
            <View style={styles.ancestorCon}>
                <View style={[styles.container,{justifyContent:'space-between',paddingLeft:15,paddingRight:15}]}>
                    <TouchableHighlight underlayColor={'transparent'} style={{width:50}} onPress={()=>{this.OpBack();this._hide()}}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:17}}>销售业绩对比</Text>
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
                        {people_name}
                    </View>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        >
                        <View style={[styles.bordeTop,{width:100}]}>
                            <View style={[styles.mean]}>
                                <Text>本月累计回款</Text>
                            </View>
                            <View style={[styles.mean]}>
                                <Text>{this.state.avarage_current}</Text>
                            </View>
                            {avarage_current}
                        </View>
                        <View style={[styles.bordeTop,{width:120}]}>
                            <View style={[styles.mean,{width:120}]}>
                                <Text>上月同期累计回款</Text>
                            </View>
                            <View style={[styles.mean,{width:120}]}>
                                <Text>{this.state.avarage_last}</Text>
                            </View>
                            {avarage_last}
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
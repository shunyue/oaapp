import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Platform,
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Modal from 'react-native-modal';
import wds from '../../public/css/css-window-single';
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';
export default class DailySearch extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props){
        super(props);
        let {params} = this.props.navigation.state;
        // 初始状态
        this.state = {
            value: false,
            text: '',
            search: "",
            placeholder:params.daily_title==1?'搜索我的日程名称':'搜索下属日程名称',
            daily: [],
        };
    }
    //搜索日程
    searchDaily(name) {//由日程名称搜索人员
        let {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchDailyByName;
        request.post(url, {
            title:params.daily_title,//1.代表搜索我的日程名称,2.代表搜索下属日程名称
            user_id:params.user_id,
            company_id: params.company_id,//(人员的id,从缓存文件中获取)
            name:name
        }).then((res)=> {
         //   alert(JSON.stringify(res))
            this.setState({
                daily: res.data
            })
        })
        .catch((error)=> {
            toast.bottom('网络连接失败,请检查网络后重试')
        });
    }
    //日程详情页面
    dailyDetail(id){
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('DailyDetail',
            {   user_id:params.user_id,
                company_id:params.company_id,
                daily_id:id,
            });
    }
    //获取日程状态名称
    getStatusName(status,start_time){
        var today=moment(new Date()).format('YYYY-MM-DD');
        if(status=='1' && today < start_time){
            return(<Text style={[com.fs10]}>未开始</Text>)
        }else if(status=='1' && today >= start_time){
            return(<Text style={[com.cr,com.fs10]}>无进展</Text>)
        }else if(status=='2'){
            return(<Text style={[com.c62,com.fs10]}>有进展</Text>)
        }else if(status=='3'){
            return(<Text style={[com.cbe,com.fs10]}>已结束</Text>)
        }
    }
    render() {
        if(this.state.load){
            return(
                <View style={[com.hh9,com.jcc,com.aic]}>
                    <Loading/>
                </View>
            )
        }
        var daily=this.state.daily;
        if(daily !=""){
            var dailylist = [];
            for(var i in daily){
                dailylist.push(
                    <View key={i}>
                        <TouchableHighlight
                            style={[com.bgcfff]}
                            onPress={this.dailyDetail.bind(this,daily[i].id)}
                            underlayColor="#f5f5f5"
                            >
                            <View style={[com.row,com.aic,com.pdt5l15,com.bbwc]}>
                                <View style={[com.mgr10]}>
                                    <Text style={[com.cbe,com.fs10]}>{daily[i].timestart}</Text>
                                </View>
                                <View style={[com.row,com.aic,com.jcsb,com.flex]}>
                                    <View>
                                        {daily[i].daily_type==1?
                                            <Text>{daily[i].customerName}</Text>:<Text>{daily[i].title}</Text>}
                                        <View style={[com.row,com.aic,com.mgt5]}>
                                            <Text style={[com.mgr5,com.cfff,com.fs10,com.bgcr,com.pdt1l10,com.br10]}>{daily[i].typeName}</Text>
                                            <Text style={[com.cb4,com.fs10]}>{daily[i].executorName}</Text>
                                        </View>
                                    </View>
                                    <View style={[]}>
                                        {this.getStatusName(daily[i].status,daily[i].start_time)}
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            }

        }else{
            var dailylist = [];
            dailylist.push(
                <View style={[com.jcc,com.aic,com.bgce6]} key={0}>
                    <View style={[com.jcc,com.aic,com.bgce6]}>
                        <Image style={[com.wh64]} source={require('../../imgs/noContent.png')}/>
                        <Text>暂无日程</Text>
                    </View>
                </View>)
        }
        return (
            <View style={[com.flex]}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                <View style={[com.bckfff,com.row,com.aic,com.pdt5l10,com.bbwe9,]}>
                   <View style={[com.ROW,com.AIC,com.bcke6,com.PD5,com.BR,com.mgr10]}>
                        <Image
                            style={[com.wh16,]} source={require('../../imgs/search.png')}/>
                        <TextInput
                            style={[com.FS12,com.PDB0,com.PDT0,{height: 19,width:screenW*0.75,}]}
                            underlineColorAndroid={'transparent'}
                            placeholder={this.state.placeholder}
                            placeholderTextColor='#bebebe'
                            secureTextEntry={false}
                            onChangeText={(search) =>{this.setState({search});this.searchDaily(search)}}
                            value={this.state.search}
                            />
                    </View>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#fff"
                        >
                        <Text style={[com.cbe]}>取消</Text>
                    </TouchableHighlight>
                </View>
                {/*内容主题*/}
                {this.state.search == "" ? (
                    <View style={[com.aic,com.hh9,{marginTop: 10}]}>
                        <View style={[com.row,com.mgb15]}>
                            <Text style={[com.cbe,com.ft5]}>______</Text>
                            <Text style={[com.cbe,com.mglr10]}>搜索内容</Text>
                            <Text style={[com.cbe,com.ft5]}>______</Text>
                        </View>
                        <View style={[com.row,com.ww5,com.aic,com.jcc]}>
                            <View style={[com.aic]}>
                                <Image style={[com.wh32,com.tcccc]} source={require('../../imgs/yg.png')}/>
                                <Text>日程</Text>
                            </View>
                        </View>
                    </View>) : ( <ScrollView><View style={[com.ww]}>
                        <View style={[com.bbwc,com.pdb10]}>
                            <View style={[com.bgcfff]}>
                                    {dailylist}
                            </View>
                      </View>
                </View></ScrollView>)}
            </View>
        );
    }
}



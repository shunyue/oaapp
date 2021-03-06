/*
* 首页主页面
* */
import React, { Component } from 'react';
import { AppRegistry,
    ListView,
    StyleSheet,
    View,
    Text,
    Button,
    ScrollView,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage,
    Dimensions,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import PieChart from 'react-native-pie-chart';
const horizontalMargin = 15;
const sliderWidth = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const slideWidth = sliderWidth*0.85;
const itemWidth = slideWidth;
const itemHeight = 170;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import CodePush from "react-native-code-push";
import com from '../public/css/css-com';
import moment from 'moment';
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            colorChange:[true,false,false],
            colorChange2:[true,false,false],
            //最新业绩
            total_performance_month:0,
            return_money_month:0,
            unreturn_money_month:0,
            target_month:0,
            total_performance_quarter:0,
            return_money_quarter:0,
            unreturn_money_querter:0,
            target_quarter:0,
            total_performance_year:0,
            return_money_year:0,
            unreturn_money_year:0,
            target_year:0,
            //业绩对比
            performance_current_month:0,
            performance_last_month:0,
            performance_max_month:0,
            performance_current_quarter:0,
            performance_last_quarter:0,
            performance_max_quarter:0,
            performance_current_year:0,
            performance_last_year:0,
            performance_max_year:0,
            result:0,

        };
    }
    componentDidMount() {
        this.syncImmediate();

        this.subscription = DeviceEventEmitter.addListener('com_user_id',(value) => {
           if(value){
               this.daishenpi(value['user_id']);//待审批
           }
        })

        AsyncStorage.getItem('user')
            .then((res) => {
                var data = JSON.parse(res);
                this.setState({
                    user_id: data.user_id,
                    company_id: data.company_id,
                })
                this.getNet(data.user_id,data.company_id);//最新业绩
                this.getNet1(data.user_id,data.company_id);//业绩对比
                this.requestData(data.company_id);//周飞飞  添加获取目标达成数据的方法
                this.searchDaily(data.user_id,data.company_id); //获取日程
                this.daishenpi(data.user_id);//待审批
            })

    }
//获取目标达成中的数据
    //周飞飞
    requestData(e){
        var url=config.api.base + config.api.achievement;
        request.post(url,{
            company_id:e,
        }).then((responseJson) => {
            this.setState({
                yearMonth:responseJson.data.yearMonth,
                total_money: responseJson.data.total_money,
                aimsell: responseJson.data.aimsell,
                achievemoney:  responseJson.data.achievemoney,
                result: responseJson.data.result,
                achievesell:  responseJson.data.achievesell,
                sellresult: responseJson.data.sellresult,
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    syncImmediate() {
        CodePush.sync(
            { updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix:'\n\n更新内容：\n',
                title:'更新提示',
                optionalUpdateMessage: '有新版本了，是否更新？',
                optionalIgnoreButtonLabel: '稍后',
                optionalInstallButtonLabel: '后台更新'
            },installMode: CodePush.InstallMode.IMMEDIATE},this.codePushStatusDidChange.bind(this),{}
        );
    }

    codePushStatusDidChange(syncStatus) {
        switch(syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                //this.setState({ syncMessage: "Checking for update." });
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                //this.setState({ syncMessage: "Downloading package." });
                toast.bottom('正在下载安装包...');
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                //this.setState({ syncMessage: "Installing update." });
                toast.bottom('正在安装');
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                //this.setState({ syncMessage: "App up to date.", progress: false });
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                //this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                //this.setState({ syncMessage: "An unknown error occurred.", progress: false });
                break;
        }
    }



    //最新业绩
    getNet(e,g){
        var url = config.api.base + config.api.newer_performance;
        request.post(url,{
            company_id: g,//公司id
            user_id:e,//登录者id
        }).then((responseText) => {
           // alert(JSON.stringify (responseText))
            if(responseText.sing==1){
                this.setState({
                    total_performance_month:responseText.total_performance_month,
                    return_money_month:responseText.return_money_month,
                    unreturn_money_month:responseText.unreturn_money_month,
                    target_month:responseText.target_month,
                    total_performance_quarter:responseText.total_performance_quarter,
                    return_money_quarter:responseText.return_money_quarter,
                    unreturn_money_querter:responseText.unreturn_money_querter,
                    target_quarter:responseText.target_quarter,
                    total_performance_year:responseText.total_performance_year,
                    return_money_year:responseText.return_money_year,
                    unreturn_money_year:responseText.unreturn_money_year,
                    target_year:responseText.target_year,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }

    //业绩对比
    getNet1(e,g){
        var url = config.api.base + config.api.performance_contrast;
        request.post(url,{
            company_id: g,//公司id
            user_id:e,//登录者id
        }).then((responseText) => {
            //alert(JSON.stringify (responseText))
            if(responseText.sing==1){
                this.setState({
                    performance_current_month:responseText.performance_current_month,
                    performance_last_month:responseText.performance_last_month,
                    performance_max_month:responseText.performance_max_month,
                    performance_current_quarter:responseText.performance_current_quarter,
                    performance_last_quarter:responseText.performance_last_quarter,
                    performance_max_quarter:responseText.performance_max_quarter,
                    performance_current_year:responseText.performance_current_year,
                    performance_last_year:responseText.performance_last_year,
                    performance_max_year:responseText.performance_max_year,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }



    /*查找我的今日日程*/
    searchDaily(user_id,company_id){
        let time=moment(new Date()).format('YYYY-MM-DD');
        var url=config.api.base+config.api.searchMyDaily;
        request.post(url,{
            user_id:user_id,
            company_id:company_id,
            current_time:time
        }).then((res)=>{
            var data=res.data;
            this.setState({
                count: data.count,
                daily: data.info,
                load: false
            })
        })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    //日程详情页面
    dailyDetail(id) {
        this.props.navigation.navigate('DailyDetail',{
            user_id:this.props.user_id,
            company_id:this.props.company_id,
            daily_id:id
        });
    }
    //获取日程状态名称
    getStatusName(status,start_time){
        var today=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        if(status=='1' && today < start_time){
            return '未开始';
        }else if(status=='1' && today >= start_time){
            return '无进展';
        }else if(status=='2'){
            return '有进展';
        }else if(status=='3'){
            return '已结束';
        }
    }

    //获取待审批的信息
     daishenpi(e){
         var url = config.api.base + config.api.select_approve_attime;
         request.post(url,{
             user_id:e,//公司id
         }).then((responseText) => {
             if(responseText.sing==1){
                 this.setState({
                     process_list:responseText.data,
                 })
             }else{
                 this.setState({
                     process_list:[],
                 })
             }
         }).catch((error)=>{
             toast.bottom('网络连接失败，请检查网络后重试');
         })
     }
    //获取待审批的信息


    //审批详情
    approve_detail(e){
        var url = config.api.base + config.api.judge_approve_type;
        request.post(url,{
            example_id:e,
        }).then((responseText) => {
            //表单
            if(responseText==1){
                this.props.navigation.navigate('form_approve',{example_id:e,user_id:this.state.user_id,company_id:this.state.company_id,approve_condition:'等待我审批'});
                //合同
            }else if(responseText==2){
                this.props.navigation.navigate('contract_approve',{example_id:e,user_id:this.state.user_id,company_id:this.state.company_id,approve_condition:'等待我审批'});
                //合同回款
            }else if(responseText==3){
                this.props.navigation.navigate('return_money_approve',{example_id:e,user_id:this.state.user_id,company_id:this.state.company_id,approve_condition:'等待我审批'});
            }
        })
    }

    //审批详情



    on_press(inder){
        if(inder==0){
            this.setState({
                colorChange:[true,false,false],
            })
        }else  if(inder==1){
            this.setState({
                colorChange:[false,true,false],
            })
        }else  if(inder==2){
            this.setState({
                colorChange:[false,false,true],
            })
        }
    }
    on_press2(position){
        if(position==0){
            this.setState({
                colorChange2:[true,false,false],
            })
        }else if(position==1){
            this.setState({
                colorChange2:[false,true,false],
            })
        }else if(position==2){
            this.setState({
                colorChange2:[false,false,true],
            })
        }
    }


    //报表
    op() {
        this.props.navigation.navigate('Page',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //设置
    set() {
        this.props.navigation.navigate('Set',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //合同
    contract() {
        this.props.navigation.navigate('Contract',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //订单
    order() {
        this.props.navigation.navigate('Order',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //目标
    aim() {
        this.props.navigation.navigate('Aim',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //审批
    approval() {
       this.props.navigation.navigate('Approval',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //日志
    log() {
        this.props.navigation.navigate('Log',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //公告
    notice() {
        this.props.navigation.navigate('Notice',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //考勤
    attendance() {
        this.props.navigation.navigate('KaoQin',{user_id:this.state.user_id,company_id:this.state.company_id})
    }
    //线路拜访
    lineVisit() {
        this.props.navigation.navigate('LineVisit',{user_id:this.state.user_id,company_id:this.state.company_id})
    }

    //产品
    product() {
        this.props.navigation.navigate('Product',{user_id:this.state.user_id,company_id:this.state.company_id})
    }

   //最新业绩展开
    newer_performance(){
        this.props.navigation.navigate('newer_performance',{user_id:this.state.user_id,company_id:this.state.company_id})
    }

    //业绩对比展开
    performance_constrast(){
        this.props.navigation.navigate('performance_constrast',{user_id:this.state.user_id,company_id:this.state.company_id})
    }


    render() {

        const chart_wh = 130
        var reach =Number(this.state.result)
        const series = [reach, 1-reach]
        const deg = reach*180+'deg'
        const sliceColor = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800']
        const {navigate}=this.props.navigation
        //今日日程
        var daily= this.state.daily;
        if(daily !=""){
            var dailylist = [];
            for(var i in daily){
                dailylist.push(
                    <View style={[]} key={i}>
                        <TouchableHighlight
                            onPress={
                                this.dailyDetail.bind(this,daily[i].id)
                            }
                            underlayColor="#f5f5f5"
                            >
                            <View style={[com.row,com.aic,com.pdt5l15,com.bbwc]}>
                                <View style={[com.mgr10]}>
                                    <Text style={[com.cbe]}>{daily[i].datetime}</Text>
                                </View>
                                <View style={[com.row,com.aic,com.jcsb,com.flex]}>
                                    <View>
                                        {(daily[i].daily_type==1)?(
                                            <Text> {daily[i].customerName}</Text>):(<Text>{daily[i].title}</Text>)}
                                        <View style={[com.row,com.aic]}>
                                            <Text style={[com.mgr5,com.cfff,com.fs10,com.bgc24,com.pdt1l10,com.br10]}>{daily[i].typeName}</Text>
                                            <Text style={[com.cb4]}>{daily[i].executorName}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={[com.c62]}>{this.getStatusName(daily[i].status,daily[i].start_time)}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            }

        }else{
            dailylist = [];
            dailylist.push(
                <View style={[styles.threeTwoCenter]} key={0}>
                <View style={[styles.row,{justifyContent:'center',paddingTop:10}]} >
                    <Image source={require('../imgs/rc16.png')}/>
                    <Text style={[styles.threeText]}>
                        您今天还没有日程
                    </Text>
                </View>
                </View>    )
        }
        //今日日程

        //待审批
            if(this.state.process_list!=undefined){
                 var process_info=[];
                if(this.state.process_list.length==0){
                    process_info.push(
                        <View style={[styles.threeTwoCenter]}>
                            <View style={[styles.row,{justifyContent:'center',paddingTop:10}]}>
                                <Image source={require('../imgs/gcon16.png')}/>
                                <Text style={[styles.threeText]}>
                                    您没有待审批的内容
                                </Text>
                            </View>
                        </View>
                    )
                }else{
                    for(var i in this.state.process_list){
                        process_info.push(
                            <View key={i}>

                                <TouchableHighlight onPress={this.approve_detail.bind(this,this.state.process_list[i]['example_id'])}>
                                <View style={[styles.rowCom1,{justifyContent:'space-between'}]}>
                                    <View style={{ flexDirection: 'row',alignItems:'center'}}>
                                        <Image style={styles.flexRow_Img} source={{uri:this.state.process_list[i]['icon']}}/>
                                        <View style={{marginLeft:10}}>
                                            <Text style={[{color: '#333',fontSize:12}]}>{this.state.process_list[i]['whosthing']}</Text>
                                            <Text style={[{color: '#e4393c',fontSize:10}]}>等待我审批</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{fontSize:10}}>{this.state.process_list[i]['time']}</Text>
                                    </View>
                                </View>
                                </TouchableHighlight>

                            </View>
                        )
                    }
                }
            }
        //待审批

        return (
            <View style={styles.ancestorCon}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#EA3B49'}}></View>:null}
                {/*头部导航*/}
                <View style={styles.nav}>
                    { /* <TouchableOpacity
                        onPress={()=>{navigate('Page')}}
                    >
                        <Image style={styles.sz} source={require('../imgs/bb.png')}/>
                    </TouchableOpacity>*/}
                    <Text style={styles.fSelf}>首页</Text>
                    {/*<TouchableHighlight
                        onPress={()=>this.set()}
                        underlayColor="#A0A0A0"
                    >
                        <Image style={styles.sz} source={require('../imgs/sz.png')}/>
                    </TouchableHighlight>*/}
                </View>
               <View style={{width:sliderWidth,height:100,backgroundColor: '#EA3B49',position:'absolute',borderBottomLeftRadius:75, top:Platform.OS==='ios'?55:35,borderBottomRightRadius:75}}></View>

                <ScrollView style={styles.childContent}>
                    {/*顶部滚动模块*/}
                     <View style={{marginBottom:10,marginTop:5}}>
                        <Carousel style={styles.wrapper}
                                  sliderWidth={sliderWidth}
                                  itemWidth={itemWidth}
                                  firstItem ={1}

                            >
                            <TouchableHighlight onPress={()=>{this.newer_performance()}}>
                                <View style={[styles.slide,styles.slideBj]}>
                                    {/*块级导航*/}
                                    <View style={[styles.rowCon,styles.rowConFlexStart,{marginTop:10}]}>
                                        <View style={{position: "absolute",left:0}}>
                                            <Text style={styles.bestMark}>最新业绩</Text>
                                        </View>
                                        <View style={[styles.rowCon,styles.floatLeft,{justifyContent:'space-around'}]}>
                                            <TouchableHighlight underlayColor={'#ccc'} style={{height:20,justifyContent:'center',borderTopLeftRadius: 10,borderBottomLeftRadius: 10}} onPress={()=>{this.on_press(0)}}>
                                                <Text style={[styles.rowConCommonSize,this.state.colorChange[0]?{fontSize:11,color:'#333'}:{fontSize:11}]}>&nbsp;&nbsp;本月&nbsp;&nbsp;</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor={'#ccc'} style={[styles.rowConCommonSize,styles.rowConCommonText,{justifyContent:'center',height:20}]} onPress={()=>{this.on_press(1)}}>
                                                <Text style={[this.state.colorChange[1]?{fontSize: 11,color:'#333'}:{fontSize: 11,}]}>本季度</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor={'#ccc'} style={{justifyContent:'center',height:20,borderTopRightRadius: 10,borderBottomRightRadius: 10}} onPress={()=>{this.on_press(2)}}>
                                                <Text style={[styles.rowConCommonSize,this.state.colorChange[2]?{fontSize: 11,color:'#333'}:{fontSize: 11,}]}>本年度</Text>
                                            </TouchableHighlight>


                                        </View>
                                    </View>
                                    {/*块级中间部分-业绩*/}
                                    <View style={[styles.rowCon,styles.rowConSpaceBetween,this.state.colorChange[0]?{}:{display:'none'}]}>
                                        <View>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.return_money_month}</Text>
                                            <Text style={[styles.textFontSize11]}>已确认回款(万)</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.textAlignCenter,styles.textMarginBottom15,styles.textFontSize30,styles.textTop]}>{this.state.total_performance_month}</Text>
                                            <Text style={[styles.textTop,styles.textFontSize18]}>总业绩(万)</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.unreturn_money_month}</Text>
                                            <Text style={[styles.textFontSize11]}>未确认回款(万)</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.rowCon,styles.rowConSpaceBetween,this.state.colorChange[1]?{}:{display:'none'}]}>
                                        <View>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.return_money_quarter}</Text>
                                            <Text style={[styles.textFontSize11]}>已确认回款(万)</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.textAlignCenter,styles.textMarginBottom15,styles.textFontSize30,styles.textTop]}>{this.state.total_performance_quarter}</Text>
                                            <Text style={[styles.textTop,styles.textFontSize18]}>总业绩(万)</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.unreturn_money_querter}</Text>
                                            <Text style={[styles.textFontSize11]}>未确认回款(万)</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.rowCon,styles.rowConSpaceBetween,this.state.colorChange[2]?{}:{display:'none'}]}>
                                        <View>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.return_money_year}</Text>
                                            <Text style={[styles.textFontSize11]}>已确认回款(万)</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.textAlignCenter,styles.textMarginBottom15,styles.textFontSize30,styles.textTop]}>{this.state.total_performance_year}</Text>
                                            <Text style={[styles.textTop,styles.textFontSize18]}>总业绩(万)</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.unreturn_money_year}</Text>
                                            <Text style={[styles.textFontSize11]}>未确认回款(万)</Text>
                                        </View>
                                    </View>
                                    {/*块级底部部分-居中-目标:0(万)*/}
                                    <View style={[styles.rowCon,styles.rowConCenter,styles.textMarginBottom20,this.state.colorChange[0]?{}:{display:'none'}]}>
                                        <Text>目标:{this.state.target_month}(万)</Text>
                                    </View>
                                    <View style={[styles.rowCon,styles.rowConCenter,styles.textMarginBottom20,this.state.colorChange[1]?{}:{display:'none'}]}>
                                        <Text>目标:{this.state.target_quarter}(万)</Text>
                                    </View>
                                    <View style={[styles.rowCon,styles.rowConCenter,styles.textMarginBottom20,this.state.colorChange[2]?{}:{display:'none'}]}>
                                        <Text>目标:{this.state.target_year}(万)</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>



                            {/*业绩对比*/}
                            <TouchableHighlight onPress={()=>{this.performance_constrast()}}>
                                <View style={[styles.slide,styles.slideBj]}>
                                    {/*块级导航*/}
                                    <View style={[styles.rowCon,styles.rowConFlexStart,{marginTop:10}]}>
                                        <View style={{position: "absolute",left:0}}>
                                            <Text style={styles.bestMark}>业绩对比</Text>
                                        </View>
                                        <View style={[styles.rowCon,styles.floatLeft,{justifyContent:'space-around'}]}>
                                            <TouchableHighlight underlayColor={'#ccc'} style={{height:20,justifyContent:'center',borderTopLeftRadius: 10,borderBottomLeftRadius: 10}} onPress={()=>{this.on_press2(0)}}>
                                                <Text style={[styles.rowConCommonSize,this.state.colorChange2[0]?{fontSize: 11,color:'#333'}:{fontSize: 11,}]}>&nbsp;&nbsp;本月&nbsp;&nbsp;</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor={'#ccc'} style={[styles.rowConCommonSize,styles.rowConCommonText,{justifyContent:'center',height:20}]} onPress={()=>{this.on_press2(1)}}>
                                                <Text style={[this.state.colorChange2[1]?{fontSize: 11,color:'#333'}:{fontSize: 11,}]}>本季度</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight underlayColor={'#ccc'} style={{justifyContent:'center',height:20,borderTopRightRadius: 10,borderBottomRightRadius: 10}} onPress={()=>{this.on_press2(2)}}>
                                                <Text style={[styles.rowConCommonSize,this.state.colorChange2[2]?{fontSize: 11,color:'#333'}:{fontSize: 11,}]}>本年度</Text>
                                            </TouchableHighlight>

                                        </View>
                                    </View>
                                    {/*块级中间部分-业绩*/}
                                    <View style={[styles.rowCon,styles.rowConSpaceBetween,this.state.colorChange2[0]?{marginTop:20}:{display:'none'}]}>
                                        <View style={{width:85,alignItems:'center'}}>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.performance_last_month}</Text>
                                            <Text style={[styles.textFontSize11]}>上月(万)</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.textAlignCenter,styles.textMarginBottom15,styles.textFontSize30,styles.textTop]}>{this.state.performance_current_month}</Text>
                                            <Text style={[styles.textTop,styles.textFontSize18]}>本月(万)</Text>
                                        </View>
                                        <View style={{width:85,alignItems:'center'}}>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.performance_max_month}</Text>
                                            <Text style={[styles.textFontSize11]}>历史最佳月(万)</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.rowCon,styles.rowConSpaceBetween,this.state.colorChange2[1]?{marginTop:20}:{display:'none'}]}>
                                        <View style={{width:85,alignItems:'center'}}>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.performance_last_quarter}</Text>
                                            <Text style={[styles.textFontSize11]}>上季度(万)</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.textAlignCenter,styles.textMarginBottom15,styles.textFontSize30,styles.textTop]}>{this.state.performance_current_quarter}</Text>
                                            <Text style={[styles.textTop,styles.textFontSize18]}>本季度(万)</Text>
                                        </View>
                                        <View style={{width:85,alignItems:'center'}}>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.performance_max_quarter}</Text>
                                            <Text style={[styles.textFontSize11]}>历史最佳季度(万)</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.rowCon,styles.rowConSpaceBetween,this.state.colorChange2[2]?{marginTop:20}:{display:'none'}]}>
                                        <View style={{width:85,alignItems:'center'}}>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.performance_last_year}</Text>
                                            <Text style={[styles.textFontSize11]}>上年度(万)</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.textAlignCenter,styles.textMarginBottom15,styles.textFontSize30,styles.textTop]}>{this.state.performance_current_year}</Text>
                                            <Text style={[styles.textTop,styles.textFontSize18]}>本年度(万)</Text>
                                        </View>
                                        <View style={{width:85,alignItems:'center'}}>
                                            <Text style={[styles.textAlignCenter,styles.textMarginBottom15]}>{this.state.performance_max_year}</Text>
                                            <Text style={[styles.textFontSize11]}>历史最佳年度(万)</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>


                            <TouchableHighlight underlayColor={'#fff'}
                                                onPress={()=>{navigate('HomePlanPerformance',{yearMonth:this.state.yearMonth,
                                                    total_money: this.state.total_money,
                                                    aimsell:this.state.aimsell,
                                                    achievemoney: this.state.achievemoney,
                                                    achievesell: this.state.achievesell,
                                                    result:this.state.result,
                                                    sellresult:this.state.sellresult,
                                                    company_id:this.state.company_id})}}>
                                <View style={[styles.slide,styles.slideBj]}>
                                    {/*块级导航*/}
                                    <View style={[styles.rowCon,{justifyContent:'space-between',marginTop:10,height:30,alignItems:'center',marginBottom:15}]}>
                                        <View style={{width:80}}>
                                            <View style={{width:55,paddingTop:5,paddingBottom:5,alignItems:'center', backgroundColor: '#FF7C7C',}}>
                                                <Text style={[styles.bestMark2]}>目标达成</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.rowConCommonSize,styles.rowConCommonColor]}>{this.state.yearMonth}</Text>
                                        <View style={{width:80}}>
                                            <Text style={[styles.rowConCommonSize,{fontSize:12}]}>单位：万元</Text>
                                        </View>
                                    </View>
                                    <View style={[{justifyContent:'center',alignItems:'center'},Platform.OS === 'ios'?{height: 95}:null]}>
                                        <PieChart
                                            chart_wh={chart_wh}
                                            series={series}
                                            sliceColor={sliceColor}
                                            doughnut={true}
                                            coverRadius={0.5}
                                            coverFill={'#FFF'}
                                        />

                                        <View style={{position:'absolute',top:Platform.OS==='ios'?42:61,transform:[{translate:[0,-0.5,0]},{rotateZ:deg}]}}>
                                            <Image style={{width:55,height:10,tintColor:'#aaa'}}  source={require('../imgs/pointer.png')}/>
                                        </View>
                                        <View style={{position:'absolute',width:140,top:Platform.OS==='ios'?50:65,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                            <Text>0 </Text>
                                            <Text style={{color:'#333',marginTop:15}}>{reach}</Text>
                                            <Text>1</Text>
                                        </View>
                                    </View>

                                </View>
                            </TouchableHighlight>

                        </Carousel>
                    </View>
                    <View style={{  backgroundColor: '#EEEFF4'}}>
                        {/*中间图标导航模块*/}
                        <View style={{backgroundColor:'#fff',marginTop:10,paddingTop:10,paddingBottom:10}}>
                            <View style={styles.flexRow}>
                                <TouchableHighlight
                                    onPress={()=>this.product()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/cp32.png')}/>
                                        <Text>产品</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={()=>this.order()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/dd32.png')}/>
                                        <Text>订单</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={()=>this.approval()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/gz32.png')}/>
                                        <Text>审批</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.flexRow}>
                                <TouchableHighlight

                                    onPress={()=>this.attendance()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/kq32.png')}/>
                                        <Text>考勤</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight

                                    onPress={()=>this.aim()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/mb32.png')}/>
                                        <Text>目标</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight

                                    onPress={()=>this.log()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/rz32.png')}/>
                                        <Text>日志</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.flexRow}>
                                <TouchableHighlight
                                    onPress={()=>this.contract()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/ht32.png')}/>
                                        <Text>合同</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight

                                    onPress={()=>this.notice()}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/gg32.png')}/>
                                        <Text>公告</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={()=>{this.op()}}
                                     underlayColor="transparent"
                                >
                                    <View style={styles.flexRow_width}>
                                        <Image style={styles.flexRow_Img} source={require('../imgs/bb32i.png')}/>
                                        <Text>报表</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        {/*今日日程*/}
                        <View style={[styles.threeDIVCON]}>
                            <View style={[{marginLeft:20},styles.borderLeft,styles.threeSpaceBetween,styles.row]}>
                                <Text
                                    style={[styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>今日日程</Text>

                            </View>
                            <View style={{ borderTopWidth:1,borderColor:'#F1F2F3',}}>
                                {dailylist}
                            </View>

                        </View>
                        {/*待审批*/}
                        <View style={[styles.threeDIVCON]}>
                            <View style={[{marginLeft:20},styles.borderLeft,styles.row]}>
                                <Text
                                    style={[styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>待审批</Text>
                            </View>
                            <View style={{ borderTopWidth:1,borderColor:'#F1F2F3',}}>
                                {process_info}
                            </View>

                        </View>
                    </View>
                </ScrollView>

            </View >

        )
            ;

    }
}
;
const styles = StyleSheet.create({
    ancestorCon: {//祖先级容器
        flex: 1,
        backgroundColor: '#EEEFF4'
    },
    slide: {
        width: itemWidth,
        height: itemHeight
    },
    slideBj:{
        backgroundColor:'#fff',
        borderColor:'#e15151',
        borderWidth:1,
        borderRadius:4
    },

    nav: {//头部导航
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EA3B49',
        paddingLeft:15,
        paddingRight:15,

    },
    sz: {//导航图标
        width: 26,
        height: 26
    },
    fSelf: {//导航字体相关
        color: '#fff',
        fontSize: 17,
        marginLeft:150
    },
    childContent: {//子容器页面级
        height:Height-145,
        //justifyContent: 'space-between',
    },

    row: {//行级布局
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,marginBottom:10
    },
    rowCon: {//行级元素左浮动
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    rowConFlexStart: {//左浮动
        justifyContent: 'center',//左浮动
        width:sliderWidth*0.85
    },
    rowConSpaceBetween: {//公共级平均分布
        justifyContent: 'space-between',//一行平均分布
        padding: 10,
        marginTop: 10
    },
    rowSpaceBetween: {//平均分布
        justifyContent: 'space-between',//一行平均分布
        //alignItems: 'center',
        padding: 10,
    },
    rowConCenter: {//公共级分布
        justifyContent: 'center',//居中
    },
    bestMark: {
        backgroundColor: '#FF7C7C',
        color: '#fff',
        fontSize:11,
        borderRadius: 2,
        padding:5,
        borderTopLeftRadius:0,
        borderBottomLeftRadius:0,
    },
    bestMark2: {
        color: '#fff',
        fontSize:11,
        borderRadius: 2,
        borderTopLeftRadius:0,
        borderBottomLeftRadius:0,
    },
    floatLeft: {
        borderWidth: 1,
        borderColor: '#fcf',
        borderRadius: 10,
        marginTop:2
    },
    rowConCommonText: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
        borderRightWidth: 1,

    },
    rowConCommonSize: {
        paddingLeft:9,
        paddingRight:9
    },
    rowConCommonColor: {
        color: '#000'
    },
    textAlignCenter: {
        textAlign: 'center',
        color: '#FF5362'
    },
    textMarginBottom15: {
        marginBottom: 5
    },
    textFontSize30: {
        fontSize: 25
    },
    textTop: {
        top: -15
    },
    textFontSize18: {
        fontSize: 16,
    },
    textFontSize11: {
        fontSize: 11
    },
    textMarginBottom20: {
        borderColor:'#ccc',
        borderTopWidth:1,
        padding:7,
        marginLeft:10,
        marginRight:10
    },

    //三大功能模块区域
    //公共部分
    //height,marginTop/bottom,bgcolor
    threeDIVCON: {
        minHeight: 100,
        marginTop: 15,
        marginBottom: 5,
        backgroundColor: '#fff',
        paddingTop: 8,
    },
    threeSpaceBetween: {
        justifyContent: 'space-between',//一行平均分布
    },
    borderLeft: {
        borderLeftWidth: 2,
        borderLeftColor: '#7D7D7D',
    },
    paddingLeft: {
        paddingLeft: 15
    },
    threeDIVCONTITHei: {
        height: 14,
        top: -1
    },
    threeDIVCONTITSiz: {
        fontSize: 12,
    },
    threeDIVCONTITPadR: {
        paddingRight: 3
    },
    threeText: {
        fontSize: 12,
        color: '#D0D0D0',
        marginLeft: 5
    },
    rowCom1: {//祖级-行
        height:40,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F1F2F3',
        flexDirection: 'row',
        alignItems:'center'
    },


    //滑动组件样式

    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },

    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },

    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },

    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    flexRow:{
        flexDirection:'row',
        height:70,
        alignItems:'center',
        justifyContent:'space-around'
    },
    flexRow_Img:{
        width:34,
        height:34,
        marginBottom:5
    },
    flexRow_width:{
        width:sliderWidth*0.25,
        justifyContent:'center',
        alignItems:'center'
    }
});

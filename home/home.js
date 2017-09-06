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
    AsyncStorage,
    Dimensions
} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import PieChart from 'react-native-pie-chart';
const horizontalMargin = 15;
const sliderWidth = Dimensions.get('window').width;
const slideWidth = sliderWidth*0.85;
const itemWidth = slideWidth;
const itemHeight = 170;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import CodePush from "react-native-code-push";
export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            colorChange:[true,false,false],
            colorChange2:[true,false,false],
            //最新业绩
            total_performance_month:0,
            return_money_month:'',
            unreturn_money_month:'',
            target_month:'',
            total_performance_quarter:'',
            return_money_quarter:'',
            unreturn_money_querter:'',
            target_quarter:'',
            total_performance_year:'',
            return_money_year:'',
            unreturn_money_year:'',
            target_year:'',
            //业绩对比
            performance_current_month:'',
            performance_last_month:'',
            performance_max_month:'',
            performance_current_quarter:'',
            performance_last_quarter:'',
            performance_max_quarter:'',
            performance_current_year:'',
            performance_last_year:'',
            performance_max_year:'',

        };
    }


    componentDidMount() {
        this.syncImmediate();
        AsyncStorage.getItem('user')
            .then((res) => {
                var data = JSON.parse(res);
                this.setState({
                    user_id: data.user_id,
                    company_id: data.company_id,
                })
                this.getNet();//最新业绩
                this.getNet1();//业绩对比
                this.getNet2();//目标达成
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
    getNet(){
        var url = config.api.base + config.api.newer_performance;
        request.post(url,{
            company_id: this.state.company_id,//公司id
            user_id:this.state.user_id,//登录者id
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

    getNet1(){
        var url = config.api.base + config.api.performance_contrast;
        request.post(url,{
            company_id: this.state.company_id,//公司id
            user_id:this.state.user_id,//登录者id
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

    getNet2(){

    }

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
        this.props.navigation.navigate('Report')
    }

    //设置
    set() {
        this.props.navigation.navigate('Set')
    }

    //商机
    business() {
        //this.props.navigation.navigate('Business'),
        this.props.navigation.navigate('BusinessTest')
    }

    //理单
    sheet() {
        this.props.navigation.navigate('Sheet')
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
        this.props.navigation.navigate('Aim')
    }

    //审批
    approval() {
       this.props.navigation.navigate('Approval',{user_id:this.state.user_id,company_id:this.state.company_id})
    }

    //日志
    log() {
        this.props.navigation.navigate('Log')
    }

    //必达
    mustreach() {
        this.props.navigation.navigate('Mustreach')
    }

    //公告
    notice() {
        this.props.navigation.navigate('Notice')
    }

    //考勤
    attendance() {
        this.props.navigation.navigate('Attendance')
    }

    //线路拜访
    lineVisit() {
        this.props.navigation.navigate('LineVisit')
    }

    //项目
    project() {
        this.props.navigation.navigate('Project')
    }

    //产品
    product() {
        this.props.navigation.navigate('Product',{user_id:this.state.user_id,company_id:this.state.company_id})
    }

    //价格表
    priceList() {
        this.props.navigation.navigate('PriceList')
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
        const chart_wh = 150
        const reach =0.7
        const series = [reach, 1-reach]
        const deg = reach*180+'deg'
        const sliceColor = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800']
        const {navigate}=this.props.navigation
        return (
            <View style={styles.ancestorCon}>
                {/*头部导航*/}
                <View style={styles.nav}>
                    <TouchableHighlight
                        onPress={()=>this.op()}
                        underlayColor="#A0A0A0"
                    >
                        <Image style={styles.sz} source={require('../imgs/bb.png')}/>
                    </TouchableHighlight>
                    <Text style={styles.fSelf}>首页</Text>
                    <TouchableHighlight
                        onPress={()=>this.set()}
                        underlayColor="#A0A0A0"
                    >
                        <Image style={styles.sz} source={require('../imgs/sz.png')}/>
                    </TouchableHighlight>
                </View>
                <ScrollView style={styles.childContent}>
                    {/*顶部滚动模块*/}

                    {/*顶部滚动模块*/}
                    <View style={{width:sliderWidth,height:100,backgroundColor: '#EA3B49',position:'absolute',borderBottomLeftRadius:100, borderBottomRightRadius:100}}></View>

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
                                            <Text style={[styles.rowConCommonSize,this.state.colorChange[0]?{fontSize:12,color:'#333'}:{fontSize:12}]}>&nbsp;&nbsp;本月&nbsp;&nbsp;</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight underlayColor={'#ccc'} style={[styles.rowConCommonSize,styles.rowConCommonText,{justifyContent:'center',height:20}]} onPress={()=>{this.on_press(1)}}>
                                            <Text style={[this.state.colorChange[1]?{fontSize: 12,color:'#333'}:{fontSize: 12,}]}>本季度</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight underlayColor={'#ccc'} style={{justifyContent:'center',height:20,borderTopRightRadius: 10,borderBottomRightRadius: 10}} onPress={()=>{this.on_press(2)}}>
                                            <Text style={[styles.rowConCommonSize,this.state.colorChange[2]?{fontSize: 12,color:'#333'}:{fontSize: 12,}]}>本年度</Text>
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
                                            <Text style={[styles.rowConCommonSize,this.state.colorChange2[0]?{fontSize: 12,color:'#333'}:{fontSize: 12,}]}>&nbsp;&nbsp;本月&nbsp;&nbsp;</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight underlayColor={'#ccc'} style={[styles.rowConCommonSize,styles.rowConCommonText,{justifyContent:'center',height:20}]} onPress={()=>{this.on_press2(1)}}>
                                            <Text style={[this.state.colorChange2[1]?{fontSize: 12,color:'#333'}:{fontSize: 12,}]}>本季度</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight underlayColor={'#ccc'} style={{justifyContent:'center',height:20,borderTopRightRadius: 10,borderBottomRightRadius: 10}} onPress={()=>{this.on_press2(2)}}>
                                            <Text style={[styles.rowConCommonSize,this.state.colorChange2[2]?{fontSize: 12,color:'#333'}:{fontSize: 12,}]}>本年度</Text>
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

                        <View style={[styles.slide,styles.slideBj]}>
                            {/*块级导航*/}
                            <View style={[styles.rowCon,{justifyContent:'space-between',marginTop:10,height:30,alignItems:'center'}]}>
                                <View style={{width:80}}>
                                    <Text style={[styles.bestMark,{width:60}]}>目标达成</Text>
                                </View>
                                <Text style={[styles.rowConCommonSize,styles.rowConCommonColor]}>2017年08月</Text>
                                <View style={{width:80}}>
                                    <Text style={[styles.rowConCommonSize,{fontSize:12}]}>单位：万元</Text>
                                </View>
                            </View>
                            <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
                                <PieChart
                                    chart_wh={chart_wh}
                                    series={series}
                                    sliceColor={sliceColor}
                                    doughnut={true}
                                    coverRadius={0.5}
                                    coverFill={'#FFF'}
                                />
                                <View style={{position:'absolute',transform:[{translate:[0,-0.5,0]},{rotateZ:deg}]}}>
                                    <Image style={{width:66,height:12,tintColor:'#aaa'}} source={require('../imgs/pointer.png')}/>
                                </View>
                                <View style={{width:195,height:14,position:'absolute',transform:[{translate:[0,-2,0]},{rotateZ:deg}]}}>
                                    <Text style={reach?{fontSize:12}:{display:'none'}}>{reach}</Text>
                                </View>
                                <View style={{position:'absolute',width:140,top:70,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <Text>0 </Text>
                                    <Text style={{color:'#333',marginTop:15}}>{reach}</Text>
                                    <Text>1</Text>
                                </View>
                            </View>
                        </View>
                        </Carousel>
                    </View>

                    {/*中间图标导航模块*/}
                    <View style={[styles.DIV]}>
                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight
                                    onPress={()=>this.business()}
                                    underlayColor="#f5f5f5"
                                >

                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/sj32.png')}/>
                                        <Text>商机</Text>
                                    </View>

                                </TouchableHighlight>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight
                                    onPress={()=>this.sheet()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/ld32.png')}/>
                                        <Text>理单</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight
                                    onPress={()=>this.contract()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/ht32.png')}/>
                                        <Text>合同</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight
                                    onPress={()=>this.order()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/dd32.png')}/>
                                        <Text>订单</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight
                                    onPress={()=>this.op()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/bb32i.png')}/>
                                        <Text>报表</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight

                                    onPress={()=>this.aim()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/mb32.png')}/>
                                        <Text>目标</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight
                                    onPress={()=>this.approval()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/gz32.png')}/>
                                        <Text>审批</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>

                            <View style={[styles.DIVRowConDiv]}>

                                <TouchableHighlight

                                    onPress={()=>this.log()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/rz32.png')}/>
                                        <Text>日志</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>



                        </View>
                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight
                                    onPress={()=>this.mustreach()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/bd32.png')}/>
                                        <Text>必达</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>
                            <View style={[styles.DIVRowConDiv]}>

                                <TouchableHighlight

                                    onPress={()=>this.notice()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/gg32.png')}/>
                                        <Text>公告</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>

                                <TouchableHighlight

                                    onPress={()=>this.attendance()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image style={styles.DIVImg} source={require('../imgs/kq32.png')}/>
                                        <Text>考勤</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight

                                    onPress={()=>this.lineVisit()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View style={[styles.DIVRowConDivSelf]}>
                                        <Image style={styles.DIVImg} source={require('../imgs/xlbf32.png')}/>
                                        <Text>线路拜访</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>



                        <View style={[styles.DIVRowCon,styles.row,styles.rowSpaceBetween]}>
                            <View style={[styles.DIVRowConDiv]}>
                                <TouchableHighlight

                                    onPress={()=>this.project()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image  source={require('../imgs/xm32.png')}/>
                                        <Text>项目</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>
                            <View style={[styles.DIVRowConDiv]}>

                                <TouchableHighlight
                                    onPress={()=>this.product()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image  source={require('../imgs/cp32.png')}/>
                                        <Text>产品</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={[styles.DIVRowConDiv]}>

                                <TouchableHighlight
                                    onPress={()=>this.priceList()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image
                                               source={require('../imgs/jgb32.png')}/>
                                        <Text>价格表</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            <View style={[styles.DIVRowConDiv]}>

                                <TouchableHighlight
                                    onPress={()=>this.priceList()}
                                    underlayColor="#f5f5f5"
                                >
                                    <View>
                                        <Image
                                            source={require('../imgs/jgb32.png')}/>
                                        <Text>价格表</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>



                        </View>









                    </View>

                    {/*底部三大功能模块*/}
                    <View style={[styles.threeDIVCON]}>
                        {/*今日日程*/}
                        {/*头部*/}
                        <View style={[styles.threeSpaceBetween,styles.row]}>
                            <Text
                                style={[styles.borderLeft,styles.paddingLeft,styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>今日日程</Text>
                            <View style={[styles.threeSpaceBetween,styles.row]}>
                                <Text style={[styles.threeDIVCONTITSiz,styles.threeDIVCONTITPadR]}>导航</Text>
                                <Image source={require('../imgs/threefj32.png')}/>
                            </View>
                        </View>
                        {/*内容*/}
                        <View style={[styles.threeTwoCenter]}>
                            <View style={[styles.row]}>
                                <Image source={require('../imgs/rc16.png')}/>
                                <Text style={[styles.threeText]}>
                                    您今天还没有日程
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.threeDIVCON]}>
                        {/*重点关注*/}
                        {/*头部*/}
                        <View style={[styles.row]}>
                            <Text
                                style={[styles.borderLeft,styles.paddingLeft,styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>重点关注</Text>
                        </View>
                        {/*内容*/}
                        <View style={[styles.threeTwoCenter]}>
                            <View style={[styles.row]}>
                                <Image source={require('../imgs/gcon16.png')}/>
                                <Text style={[styles.threeText]}>
                                    您还没有关注客户的动态
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.threeDIVCON]}>
                        {/*待审批*/}
                        {/*头部*/}
                        <View style={[styles.row]}>
                            <Text
                                style={[styles.borderLeft,styles.paddingLeft,styles.threeDIVCONTITHei,styles.threeDIVCONTITSiz]}>待审批</Text>
                        </View>
                        {/*内容*/}
                        <View style={[styles.threeTwoCenter]}>
                            <View style={[styles.row]}>
                                <Image source={require('../imgs/gcon16.png')}/>
                                <Text style={[styles.threeText]}>
                                    您没有待审批的内容
                                </Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>

            </
                View >

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
        alignItems: 'flex-start',
        backgroundColor: '#EA3B49',
        padding: 5
    },
    sz: {//导航图标
        width: 30,
        height: 30
    },
    fSelf: {//导航字体相关
        color: '#fff',
        height: 30,
        fontSize: 20
    },
    childContent: {//子容器页面级
        flex: 1,

        //justifyContent: 'space-between',
    },
    topDiv: {
        height: 170,
        backgroundColor: '#fff',
        //width: 290,

        margin: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#fcf',
        justifyContent: 'space-between',
        paddingTop: 10
    },
    row: {//行级布局
        flexDirection: 'row',
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
        padding: 5,
        borderTopLeftRadius:0,
        borderBottomLeftRadius:0,
    },
    floatLeft: {
        borderWidth: 1,
        borderColor: '#fcf',
        borderRadius: 10,
    },
    rowConCommonText: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
        borderRightWidth: 1,

    },
    rowConCommonSize: {
        paddingLeft:10,
        paddingRight:10
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
        fontSize: 16
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
    //图标导航部分
    DIV: {
        height: 350,
        paddingLeft: 10,
        paddingRight: 15,
        backgroundColor: '#fff'
    },
    DIVRowCon: {
        height: 50,
        marginBottom: 37
    },
    DIVImg: {
        marginBottom: 5
    },
    DIVRowConDiv: {
        height: 50,
        width: 72,
        alignItems: 'center'
    },

    //三大功能模块区域
    //公共部分
    //height,marginTop/bottom,bgcolor
    threeDIVCON: {
        height: 100,
        marginTop: 15,
        marginBottom: 5,
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 8,
    },
    threeTwoCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

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

});


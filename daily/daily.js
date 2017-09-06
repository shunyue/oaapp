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
    AsyncStorage,
    DeviceEventEmitter,
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../public/css/css-com';
import wds from '../public/css/css-window-single.js';
import Modal from 'react-native-modal'
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import moment from 'moment';
import MyDailyList from './dailyContent/myDailyList';
import SubordinateDailyList from './dailyContent/subordinateDailyList';
import MyDailySearch from './dailyContent/myDailySearch';
import SubordinateDailySearch from './dailyContent/subordinateDailySearch';
export default class Daily extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            status: 1,
            status_: 4,
            show: false,
            time: moment(new Date()).format('YYYY-MM-DD'),
            tab:1,  //有1,2两种状态  1:我的日程 2:下属日程
            change:true,//有两种状态  true:日程列表 false:搜索日程
            current_day:moment(new Date()).format('DD'),
            current_month:moment(new Date()).format('MM/YYYY'),
            subordinateInfo:[]
        };
    }
    componentDidMount() {
        AsyncStorage.getItem('user')
            .then((res) => {
                var data = JSON.parse(res);
                if(data!=null){
                    this.getSubordinate(data);
                }
                this.setState({
                    user_id: data.user_id,
                    company_id: data.company_id,
                })
            })
        //this.getSubordinate();
    }
    getSubordinate(data,subordinate=""){
        //搜索人员
            let {params} = this.props.navigation.state;
            var url=config.api.base+config.api.searchSubordinate;
            request.post(url,{
                name: subordinate,
                title: 1,
                company_id: data.company_id,
              //  user_id:data.user_id
                user_id:data.user_id
            }).then((res)=>{
                this.setState({
                    subordinateInfo:res.data
                })
            })
            .catch((error)=>{
                    toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    setVisibleModal(visible) {
        this.setState({show: visible});
    }
    //新建拜访页面
    go_newVisit(){
        this.props.navigation.navigate('AddVisit',{user_id:this.state.user_id,company_id:this.state.company_id});
    }
    //拜访路线页面
    go_lineVisit(){
        this.props.navigation.navigate('LineVisit',{user_id:this.state.user_id,company_id:this.state.company_id});
    }
    //新建任务页面
    go_newWork(){
        this.props.navigation.navigate('AddWork',{user_id:this.state.user_id,company_id:this.state.company_id});
    }
    //新建会议页面
    go_newMeeting(){
        this.props.navigation.navigate('AddMeeting',{user_id:this.state.user_id,company_id:this.state.company_id});
    }
    //新建培训页面
    go_newTrain(){
        this.props.navigation.navigate('AddTrain',{user_id:this.state.user_id,company_id:this.state.company_id});
    }

    state = {
        isModalVisible: false
    }
    _showModal = () =>this.setState({isModalVisible: true})
    //动态信息获取 查看 我的客户
    _getContent(user_id,company_id) {
   var params={
       user_id:user_id,
       company_id:company_id,
       navigation:this.props.navigation
    };
        var subordinateInfo=this.state.subordinateInfo;
        if(this.state.tab==1 && this.state.change==true && user_id){//我的日程列表
            return <MyDailyList
                {...params}
                />
        }else if(this.state.tab==2 && this.state.change==true && user_id && subordinateInfo.length!=0){//下属日程列表
            return <SubordinateDailyList {...params}/>
        }else if(this.state.tab==1 && this.state.change==false && user_id){//搜索我的日程
            return <MyDailySearch  {...params}/>
        }else if(this.state.tab==2 && this.state.change==false && user_id && subordinateInfo.length!=0){//搜索下属日程
            return <SubordinateDailySearch {...params}/>
        }
    }
    //获取星期几
    getWeek(){
      var week=moment(new Date()).format('E');
        if(week==1){
          return '星期一'  ;
        }else if(week==2){
            return '星期二'  ;
        }else if(week==3){
            return '星期三'  ;
        }else if(week==4){
            return '星期四'  ;
        }else if(week==5){
            return '星期五'  ;
        }else if(week==6){
            return '星期六'  ;
        }else if(week==7){
            return '星期日'  ;
        }
    }
    getTitle(){
        var subordinateInfo=this.state.subordinateInfo;
        if(subordinateInfo.length!=0){
            return(
                <TouchableHighlight
                    style={[com.jcc,com.pd10]}
                    onPress={()=>{this.setState({tab:2})}}
                    underlayColor="#fff"
                    >
                    <View style={[{}]}>
                        <Text style={[com.mgb5]}>下属日程</Text>
                        {this.state.tab==2?(<Image style={[ {height:1,width:55},com.tcr]} source={require('../imgs/daily/straightLine.png')}/>
                        ):(null)}
                    </View>
                </TouchableHighlight>
            )
        }
    }

    render() {
        var daily=[];
        return (
            <View style={[com.flex]}>
                {/*自定义导航*/}
                {/*自定义导航栏-中间*/}
                <View style={[com.row,com.jcc,com.bckfff,com.pos]}>
                    <View style={[com.row]}>
                        <TouchableHighlight
                            style={[com.jcc,com.pd10]}
                            onPress={()=>{this.setState({tab:1})}}
                            underlayColor="#fff"
                            >
                            <View style={[{}]}>
                                <Text style={[com.mgb5]}>我的日程</Text>
                                {this.state.tab==1 && this.state.subordinateInfo.length!=0?(<Image style={[{height:1,width:55},com.tcr]} source={require('../imgs/daily/straightLine.png')}/>
                                ):(null)}
                            </View>
                        </TouchableHighlight>
                        {this.getTitle()}
                    </View>
                </View>

                {/*自定义导航栏-定位左边*/}
            <TouchableHighlight
                    style={[com.posr,{top:8,left:10}]}
                    onPress={()=>{this.repose()}}
                    underlayColor="#f5f5f5"
                    >
                    <View style={[]}>
                        <Image style={[com.wh24,com.tcr]} source={require('../imgs/bbr32.png')}/>
                    </View>
                </TouchableHighlight>

                {/*自定义导航栏-定位右边*/}
                <View style={[com.row,com.posr,{top:8,right:10}]}>
                    <TouchableHighlight
                        style={[com.mgr15]}
                        onPress={()=>{this.setState({change:!this.state.change})}}
                        underlayColor="#f5f5f5"
                        >
                        <View style={[]}>
                         {this.state.change==true?(
                            <Image style={[com.wh24,com.tcr]} source={require('../imgs/cirmenu32.png')}/>
                         ):(<Image style={[com.wh24,com.tcr]} source={require('../imgs/cal.png')}/>)}
                        </View>
                    </TouchableHighlight>

                    {/*     <TouchableHighlight
                        style={[]}
                        onPress={()=>{this.repose()}}
                        underlayColor="#f5f5f5"
                        >
                        <View style={[]}>
                            <Image style={[com.wh24,com.tcr]} source={require('../imgs/daily/rypz.png')}/>
                        </View>
                    </TouchableHighlight>*/}
                </View>

                <ScrollView style={[com.pos,com.flex,{height:screenH}]}>
                    {this._getContent(this.state.user_id,this.state.company_id)}
                </ScrollView>
                {/*事件触发-加号图标*/}
                <TouchableOpacity style={[com.posr,{top:screenH*0.75,right:30,zIndex:99999}]}
                                  onPress={() => {{this.setState({show: !this.state.show})}}}>
                    <View>
                        <Image
                            style={[com.tcr,com.wh32,]} source={require('../imgs/addr.png')}/>
                    </View>
                </TouchableOpacity>
                {/* 添加模型-加号图标 */}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={[com.flex,com.pos,com.hh99,com.ww,{backgroundColor:'#fff'}]}>
                            <View style={[com.pdl50,com.pdt70]}>
                                <View style={[com.row,com.aic,com.mgb5]}>
                                    <Text style={[com.fs40,com.mgr15]}>{this.state.current_day}</Text>
                                    <View>
                                        <Text style={[com.fs12]}>{this.getWeek()}</Text>
                                        <Text style={[com.fs12]}>{this.state.current_month}</Text>
                                    </View>
                                </View>
                                <Text>心有多大,舞台就有多大!</Text>
                            </View>
                            <View style={[com.posr,{top:345,left:0}]}>
                                <View style={[com.hh3,com.ww,]}>
                                    <View style={[com.row,com.pdt5l15]}>

                                    </View>

                                    <View style={[com.row,com.jcc,com.aic,com.pdt5l15,com.mgt15]}>
                                        <TouchableOpacity style={[com.pdtb5,com.wh75,com.aic,]}
                                                          onPress={() => { this.setVisibleModal(!this.state.show);this.go_newVisit()}}>
                                            <View style={[com.aic,com.jcc]}>
                                                <Image
                                                    style={[com.tcr,com.wh48,com.mgb5]}
                                                    source={require('../imgs/daily/ld200res.png')}/>
                                                <Text>新建拜访</Text>
                                            </View>
                                        </TouchableOpacity>
                                        { /*   <TouchableOpacity style={[com.pdtb5,com.wh75,com.aic,]}
                                         onPress={() => { this.setVisibleModal(!this.state.show);this.go_lineVisit()}}>
                                         <View style={[com.aic,com.jcc]}>
                                         <Image
                                         style={[com.wh48,com.mgb5]}
                                         source={require('../imgs/daily/xlbf200res.png')}/>
                                         <Text>线路拜访</Text>
                                         </View>
                                         </TouchableOpacity>*/}
                                        <TouchableOpacity style={[com.pdtb5,com.wh75,com.aic,]}
                                                          onPress={() => { this.setVisibleModal(!this.state.show);this.go_newWork()}}>
                                            <View style={[com.aic,com.jcc]}>
                                                <Image
                                                    style={[com.wh48,com.mgb5]}
                                                    source={require('../imgs/daily/rw200res.png')}/>
                                                <Text>新建任务</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[com.pdtb5,com.wh75,com.aic,]}
                                                          onPress={() => { this.setVisibleModal(!this.state.show);this.go_newMeeting()}}>
                                            <View style={[com.aic,com.jcc]}>
                                                <Image
                                                    style={[com.tc3,com.wh48,com.mgb5]}
                                                    source={require('../imgs/daily/hyres.png')}/>
                                                <Text>新建会议</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[com.pdtb5,com.wh75,com.aic,]}
                                                          onPress={() => { this.setVisibleModal(!this.state.show);this.go_newTrain()}}>
                                            <View style={[com.aic,com.jcc]}>
                                                <Image
                                                    style={[com.tc2,com.wh48,com.mgb5,]}
                                                    source={require('../imgs/daily/newtrainres.png')}/>
                                                <Text>新建培训</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <TouchableHighlight
                                    style={[com.bgcfff,com.ww,com.aic,com.pdtb5,com.btwd]}
                                    onPress={()=>{this.setVisibleModal(!this.state.show)}}
                                    underlayColor="#f5f5f5"
                                    >
                                    <Text style={[com.fwb,com.fs24,com.aic]}>X</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}


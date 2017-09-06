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
    DeviceEventEmitter
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import wds from '../../public/css/css-window-single.js';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';
import moment from 'moment';
export default class MyDailySearch extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            isModalVisibleTwo: false,
            status_: 4,
            _status: 10,
            show: false,
            showTwo: false,
            value: false,
            text: '',
            tab: 1,
            chooseStaff: 1,
            daily:[],
            status:5,
            daily_type:[],
            checkBoxData:[],
            checkedData: [],
            title:1,
            status_order:1
        };
    }
    componentDidMount() {
        this.searchDaily(1,5);
        this.dailyListener= DeviceEventEmitter.addListener('dailyInfo', (a)=> {
            this.setState({
                load: true,
            })
            this.searchDaily(1,5);
        });
    }
    componentWillUnmount() {
        // 移除监听
        this.dailyListener.remove();
    }

    _checkBokClick(id) {
        this.state.checkBoxData[id].onClick()
    }
  //不限日程类型
    _selectAll() {
            this.refs['item0'].onClick();
            if(this.refs['item1'].state.isChecked==true){
                this.refs['item1'].onClick();
            }
            if(this.refs['item2'].state.isChecked==true){
                this.refs['item2'].onClick();
            }
            if(this.refs['item3'].state.isChecked==true){
                this.refs['item3'].onClick();
            }
            if(this.refs['item4'].state.isChecked==true) {
                this.refs['item4'].onClick();
            }
    }
    //根据日程状态查询日程
    searchDaily(title,status){
        var url=config.api.base+config.api.searchMyDailyByCondition;
        if(title==1){//按照日程状态查询
            this.setState({
                isModalVisible: false,
                load:true
            });
            var condition={
                user_id:this.props.user_id,
                title: title,
                status:status
            }
        }
        if(title==2){//按照日程类型查询
            this.setState({
                isModalVisibleTwo: false,
                load:true
            }) ;
            var status=[];
            if(this.state.status_order==1){//全部状态
                var status=[1,2,3];
            }else if(this.state.status_order==2){//无进展
                var status=[1];
            }else if(this.state.status_order==3){//有进展
                var status=[2];
            }else if(this.state.status_order==4){//未结束
                var status=[1,2];
            }else if(this.state.status_order==5){//已结束
                var status=[3];
            }else if(this.state.status_order==6){//易撤回
                var status=[4];
            }else{
                var status=[1,2,3];
            }
            var daily_type=[];
            if(this.refs['item0'].state.isChecked==true){
                daily_type=[1,2,3,4];
            }else{
                if(this.refs['item1'].state.isChecked==true){
                    daily_type.push(1) ;
                }
                if(this.refs['item2'].state.isChecked==true){
                    daily_type.push(2) ;
                }
                if(this.refs['item3'].state.isChecked==true){
                    daily_type.push(3) ;
                }
                if(this.refs['item4'].state.isChecked==true){
                    daily_type.push(4) ;
                }
            }
            var condition={
                user_id:this.props.user_id,
                title: title,
                daily_type:daily_type,
                status:status
            }
        }
        request.post(url,condition).then((res)=>{
              var data=res.data;
                this.setState({
                    daily:data,
                    load:false
                })
        })
        .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
        });
    }
    setVisibleModal(visible) {
        this.setState({show: visible});
    }
    //日程详情页面
    dailyDetail(daily){
        this.props.navigation.navigate('DailyDetail',
            {   user_id:this.props.user_id,
                company_id:this.props.company_id,
                dailyInfo:daily,
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
    //重置按钮
    _reset(){
        if(this.refs['item0'].state.isChecked==true){
            this.refs['item0'].onClick();
        }
        if(this.refs['item1'].state.isChecked==true){
            this.refs['item1'].onClick();
        }
        if(this.refs['item2'].state.isChecked==true){
            this.refs['item2'].onClick();
        }
        if(this.refs['item3'].state.isChecked==true){
            this.refs['item3'].onClick();
        }
        if(this.refs['item4'].state.isChecked==true){
            this.refs['item4'].onClick();
        }
    }
    //显示状态名称
    show_StatusName(){
        var  status=this.state.status_order;
        if(status==1){
            var name= '全部状态';
        }else if(status==2){
            var name= '无进展';
        }else if(status==3){
            var name= '有进展';
        }else if(status==4){
            var name= '未结束';
        }else if(status==5){
            var name='已结束';
        }else if(status==6){
            var name='已撤销';
        }
        if(this.state.isModalVisible==true){
            return(<View style={[com.row,com.pdlr15,com.aic]}>
                <View>
                    <Text style={[com.cr]}>{name}</Text>
                </View>
                <Image style={[com.wh16,com.tcr,com.mgl5]} source={require('../../imgs/jtxu.png')}/>
            </View>)
        }else{
            return(
                <View style={[com.row,com.pdlr15,com.aic]}>
                    <View>
                        <Text>{name}</Text>
                    </View>
                    <Image style={[com.wh16,com.mgl5]} source={require('../../imgs/jtxx.png')}/>
                </View>
            )
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
                        {/*<View style={[com.mixf3,com.bbwc]}>
                            <Text style={[com.cbe,com.fs10]}>{daily[i].datetime}</Text>
                        </View>*/}
                        <TouchableHighlight
                            style={[com.bgcfff]}
                            onPress={this.dailyDetail.bind(this,daily[i])}
                            underlayColor="#f5f5f5"
                        >
                        <View style={[com.row,com.aic,com.pdt5l15,com.bbwc]}>
                            {/* <View style={[com.mixf3,com.bbwc]}>
                                <Text style={[com.cbe,com.fs10]}>07-18 周二</Text>
                            </View>*/}
                            <View style={[com.mgr10]}>
                                <Text style={[com.cbe,com.fs10]}>{daily[i].timestart}</Text>
                            </View>
                            <View style={[com.row,com.aic,com.jcsb,com.flex]}>
                                <View>
                                    {(daily[i].daily_type==1)?(
                                        <Text> {daily[i].customerName}</Text>):(<Text>{daily[i].title}</Text>)}
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
                <View style={[com.row,com.jcsa,com.pdt5l15,com.bbwc,com.aic,com.bgcfff]}>
                    <TouchableOpacity style={[com.pos]}
                                      onPress={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}>
                        { /*  <View style={[com.row,com.pdlr15,com.aic]}>
                            <Text>全部状态</Text>
                            <Image style={[com.wh16,com.mgl5]} source={require('../../imgs/jtxx.png')}/>
                        </View>*/}
                        {this.show_StatusName()}
                    </TouchableOpacity>
                    <TouchableOpacity style={[com.pos]}
                                      onPress={() => { this.setState({isModalVisibleTwo: !this.state.isModalVisibleTwo})}}>
                        <View style={[com.row,com.pdlr15,com.aic]}>
                            <Text>筛选</Text>
                            <Image style={[com.wh16,com.tcbe,com.mgl5]} source={require('../../imgs/jtxx.png')}/>
                        </View>
                    </TouchableOpacity>
                    {/*  <TouchableOpacity style={[com.pos]}
                                      onPress={() => { this.skipSearch()}}>
                        <View style={[com.row,com.pdlr15,com.aic]}>
                            <Image style={[com.wh16,com.tcbe,com.mgr5]} source={require('../../imgs/search.png')}/>
                            <Text>搜索</Text>
                        </View>
                    </TouchableOpacity>*/}
                </View>
                <ScrollView style={[,com.flex,{height:screenH*0.70}]}>
                    <View style={[com.bckf5,com.btwc,com.btwc]}>
                        {dailylist}
                        {/*  <View style={[]}>
                            <View style={[com.mixf3,com.bbwc]}>
                                <Text style={[com.cbe,com.fs10]}>07-18 周二</Text>
                            </View>
                            <TouchableHighlight
                                style={[com.bgcfff]}
                                onPress={()=>{this.dailyDetail()}}
                                underlayColor="#f5f5f5"
                                >
                                <View style={[com.row,com.aic,com.pdt5l15,com.bbwc]}>
                                    <View style={[com.mgr10]}>
                                        <Text style={[com.cbe]}>16:52</Text>
                                    </View>
                                    <View style={[com.row,com.aic,com.jcsb,com.flex]}>
                                        <View>
                                            <Text>烹羊宰牛且为乐</Text>
                                            <View style={[com.row,com.aic,com.mgt5]}>
                                                <Text style={[com.mgr5,com.cfff,com.fs10,com.bgcr,com.pdt1l10,com.br10]}>会议</Text>
                                                <Text style={[com.cb4,com.fs10]}>刘明</Text>
                                            </View>
                                        </View>
                                        <View style={[]}>
                                            <Text style={[com.c62,com.fs10]}>有进展</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={[com.bgcfff]}
                                onPress={()=>{this.dailyDetail()}}
                                underlayColor="#f5f5f5"
                                >
                                <View style={[com.row,com.aic,com.pdt5l15,com.bbwc]}>
                                    <View style={[com.mgr10]}>
                                        <Text style={[com.cbe]}>16:52</Text>
                                    </View>
                                    <View style={[com.row,com.aic,com.jcsb,com.flex]}>
                                        <View>
                                            <Text>会须一饮三百杯</Text>
                                            <View style={[com.row,com.aic,com.mgt5]}>
                                                <Text style={[com.mgr5,com.cfff,com.fs10,com.bgc24,com.pdt1l10,com.br10]}>拜访</Text>
                                                <Text style={[com.cb4,com.fs10]}>刘明</Text>
                                            </View>
                                        </View>
                                        <View style={[]}>
                                            <Text style={[com.cr,com.fs10]}>无进展</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={[com.bgcfff]}
                                onPress={()=>{this.dailyDetail()}}
                                underlayColor="#f5f5f5"
                                >
                                <View style={[com.row,com.aic,com.pdt5l15,com.bbwc]}>
                                    <View style={[com.mgr10]}>
                                        <Text style={[com.cbe]}>16:52</Text>
                                    </View>
                                    <View style={[com.row,com.aic,com.jcsb,com.flex]}>
                                        <View>
                                            <Text>人如风后入江云</Text>
                                            <View style={[com.row,com.aic,com.mgt5]}>
                                                <Text style={[com.mgr5,com.cfff,com.fs10,com.bgc37,com.pdt1l10,com.br10]}>任务</Text>
                                                <Text style={[com.cb4,com.fs10]}>刘明</Text>
                                            </View>
                                        </View>
                                        <View style={[]}>
                                            <Text style={[com.c62,com.fs10]}>有进展</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={[com.bgcfff]}
                                onPress={()=>{this.dailyDetail()}}
                                underlayColor="#f5f5f5"
                                >
                                <View style={[com.row,com.aic,com.pdt5l15,com.bbwc]}>
                                    <View style={[com.mgr10]}>
                                        <Text style={[com.cbe]}>16:52</Text>
                                    </View>
                                    <View style={[com.row,com.aic,com.jcsb,com.flex]}>
                                        <View>
                                            <Text>情似雨馀粘地絮</Text>
                                            <View style={[com.row,com.aic,com.mgt5]}>
                                                <Text style={[com.mgr5,com.cfff,com.fs10,com.bgc24,com.pdt1l10,com.br10]}>临时拜访</Text>
                                                <Text style={[com.cb4,com.fs10]}>刘明</Text>
                                            </View>
                                        </View>
                                        <View style={[]}>
                                            <Text style={[com.cbe,com.fs10]}>已结束</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>*/}
                        {/*页面级-下拉框*/}
                        <View>
                            <Modal
                                backdropOpacity={0}
                                animationIn={'slideInDown'}
                                animationOut={'slideOutUp'}
                                isVisible={this.state.isModalVisible}
                                >
                                <TouchableWithoutFeedback
                                    onPress={() => this.setState({isModalVisible: !this.state.isModalVisible})}>
                                    <View style={{flex:1}}>
                                        <View
                                            style={[com.posr,com.h200,{top:80,left:0,width:screenW,height:screenH,backgroundColor:'#000',opacity:0.6}]}></View>
                                        <View style={[com.posr,{top:0}]}>
                                            <View style={[com.bckfff,com.mgt70]}>
                                                {/*页面级-下拉框内容*/}
                                                <View style={[com.pdt5,com.pdb5,com.row,]}>
                                                    <View style={[{width:screenW}]}>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,6);this.setState({status_order:1})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={[com.cr]}>全部状态</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,1);this.setState({status_order:2})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={[]}>无进展</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,2);this.setState({status_order:3})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={[]}>有进展</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,5);this.setState({status_order:4})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={[]}>未结束</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,3);this.setState({status_order:5})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={[]}>已结束</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,4);this.setState({status_order:6})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={[]}>已撤销</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                            <Modal
                                backdropOpacity={0}
                                animationIn={'slideInDown'}
                                animationOut={'slideOutUp'}
                                isVisible={this.state.isModalVisibleTwo}
                                >
                                <TouchableWithoutFeedback
                                    onPress={() => this.setState({isModalVisibleTwo:!this.state.isModalVisibleTwo})}>
                                    <View style={{flex:1}}>
                                        <View
                                            style={[com.posr,com.h200,{top:75,left:0,width:screenW,height:screenH,backgroundColor:'#000',opacity:0.6}]}></View>
                                        <View style={[com.posr,{top:0}]}>
                                            <View style={[com.bckfff,com.mgt70]}>
                                                {/*页面级-下拉框内容*/}
                                                <View style={[com.bgcfff,com.ww,com.row,com.hh3]}>
                                                    <View>
                                                        <TouchableHighlight
                                                            style={[com.jcc,]}
                                                            onPress={()=>{this.setState({myChat: !this.state.myChat,chooseStaff:2})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View style={[com.pdt5l15,(this.state.chooseStaff==2) ?(com.bgcfff):(com.bgcf5)]}>
                                                                <Text style={[]}>工作类型</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </View>
                                                    <View style={[com.flex,com.bgcfff]}>
                                                        <View style={[com.bckf5,com.btwc,com.btwc]}>
                                                            <ScrollView>
                                                                <TouchableHighlight
                                                                    onPress={()=>this._selectAll()}
                                                                    underlayColor="#000000"
                                                                    >
                                                                    <View style={[com.bgcfff,com.pos,com.pdb3,com.row,com.AIC]}>
                                                                        <View>
                                                                            <CheckBox
                                                                                ref="item0"
                                                                                value='0'
                                                                                style={[com.flex,com.pdt5l20,com.pdl30,{}]}
                                                                                onClick={()=>{}}
                                                                                isChecked={false}
                                                                                checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                                                                unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                                                                />
                                                                        </View>

                                                                        <View
                                                                            style={[com.aic,com.posr,com.row,com.pdt5,com.pdl40,com.mgl20,{width:screenW*0.90,paddingBottom:6},com.bbwc]}>
                                                                            <Text>不限</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableHighlight>
                                                                <TouchableHighlight
                                                                    onPress={()=>this.refs['item1'].onClick()}
                                                                    underlayColor="#000000"
                                                                    >
                                                                    <View style={[com.bgcfff,com.pos,com.pdb3,com.row,com.AIC]}>
                                                                        <View>
                                                                            <CheckBox
                                                                                ref="item1"
                                                                                value="1"
                                                                                style={[com.flex,com.pdt5l20,com.pdl30,{}]}
                                                                                onClick={()=>{}}
                                                                                isChecked={false}
                                                                                checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                                                                unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                                                                />
                                                                        </View>

                                                                        <View
                                                                            style={[com.aic,com.posr,com.row,com.pdt5,com.pdl40,com.mgl20,{width:screenW*0.90,paddingBottom:6},com.bbwc]}>
                                                                            <Text>拜访</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableHighlight>
                                                                <TouchableHighlight
                                                                    onPress={()=>this.refs['item2'].onClick()}
                                                                    underlayColor="#000000"
                                                                    >
                                                                    <View style={[com.bgcfff,com.pos,com.pdb3,com.row,com.AIC]}>
                                                                        <View>
                                                                            <CheckBox
                                                                               ref="item2"
                                                                                value="2"
                                                                                style={[com.flex,com.pdt5l20,com.pdl30,{}]}
                                                                                onClick={()=>{}}
                                                                                isChecked={false}
                                                                                checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                                                                unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                                                                />
                                                                        </View>
                                                                        <View
                                                                            style={[com.aic,com.posr,com.row,com.pdt5,com.pdl40,com.mgl20,{width:screenW*0.90,paddingBottom:6},com.bbwc]}>
                                                                            <Text>任务</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableHighlight>
                                                                <TouchableHighlight
                                                                    onPress={()=>this.refs['item3'].onClick()}
                                                                    underlayColor="#000000">
                                                                    <View style={[com.bgcfff,com.pos,com.pdb3,com.row,com.AIC]}>
                                                                        <View>
                                                                            <CheckBox
                                                                                ref="item3"
                                                                                value="3"
                                                                                style={[com.flex,com.pdt5l20,com.pdl30,{}]}
                                                                                onClick={()=>{}}
                                                                                isChecked={false}
                                                                                checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                                                                unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                                                                />
                                                                        </View>
                                                                        <View
                                                                            style={[com.aic,com.posr,com.row,com.pdt5,com.pdl40,com.mgl20,{width:screenW*0.90,paddingBottom:6},com.bbwc]}>
                                                                            <Text>会议</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableHighlight>
                                                                <TouchableHighlight
                                                                    onPress={()=>this.refs['item4'].onClick()}
                                                                    underlayColor="#000000">
                                                                    <View style={[com.bgcfff,com.pos,com.pdb3,com.row,com.AIC]}>
                                                                        <View>
                                                                            <CheckBox
                                                                                ref="item4"
                                                                                value="4"
                                                                                style={[com.flex,com.pdt5l20,com.pdl30,{}]}
                                                                                onClick={()=>{}}
                                                                                isChecked={false}
                                                                                checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                                                                unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                                                                />
                                                                        </View>
                                                                        <View
                                                                            style={[com.aic,com.posr,com.row,com.pdt5,com.pdl40,com.mgl20,{width:screenW*0.90,paddingBottom:6},com.bbwc]}>
                                                                            <Text>培训</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableHighlight>
                                                            </ScrollView>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={[com.btwc,com.pd5,com.rsc]}>
                                                    <TouchableHighlight
                                                        style={[com.pdt5l15,com.bbwc]}
                                                        onPress={() => {this._reset()}}
                                                        underlayColor="#f0f0f0"
                                                        >
                                                        <View><Text style={[com.cr]}>重置</Text></View>
                                                    </TouchableHighlight>
                                                    <TouchableHighlight
                                                        style={[com.pdt5l15,com.bbwc]}
                                                        onPress={() =>{this.searchDaily(2)}}
                                                        underlayColor="#f0f0f0"
                                                        >
                                                        <View><Text style={[com.cr]}>确认</Text></View>
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


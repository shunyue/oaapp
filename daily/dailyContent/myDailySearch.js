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
    DeviceEventEmitter,
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
            status_: 4,
            _status: 10,
            show: false,
            showTwo: false,
            value: false,
            text: '',
            tab: 1,
            chooseStaff: 1,
            daily:[],
            daily_type:[],
            checkBoxData:[],
            checkedData: [],
            title:1,
            status_order:1,
            selected:false,
            classify:[false,false,false,false]
        };
    }
    componentDidMount() {
        this.searchDaily(1,this.state.status_order,null);
        //从日程详情页返回的监听
        this.dailyListener= DeviceEventEmitter.addListener('dailyInfo', (a)=> {
            this.setState({
                load: true,
            })
            this.searchDaily(1,this.state.status_order,null);
        });
        //筛选
        this.classifyListener=DeviceEventEmitter.addListener('DailyClassify',(c)=>{
            this.setState({
                load: true,
                status_order:c.status_order,
                classify:c.classify,
                selected:c.selected
            })
            this.searchDaily(2,c.status_order,c.classify);
        })
    }
    componentWillUnmount() {
        // 移除监听
        this.dailyListener.remove();
        this.classifyListener.remove();
    }

    _checkBokClick(id) {
        this.state.checkBoxData[id].onClick()
    }
    //不限日程类型
    _selectAll() {
        this.refs['item0'].onClick();
        alert(this.refs['item1'].state.isChecked)
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
    searchDaily(title,status_order,classify=[]){
        var url=config.api.base+config.api.searchMyDailyByCondition;
        if(status_order==1){//全部状态
            var status=[1,2,3,4];
        }else if(status_order==2){//无进展
            var status=[1];
        }else if(status_order==3){//有进展
            var status=[2];
        }else if(status_order==4){//未结束
            var status=[1,2];
        }else if(status_order==5){//已结束
            var status=[3];
        }else if(status_order==6){//已撤回
            var status=[4];
        }else{
            var status=[1,2,3,4];
        }
        if(title==1){//按照日程状态查询
            this.setState({
                isModalVisible: false,
                selected:false,
                load:true
            });
            var condition={
                user_id:this.props.user_id,
                status:status
            }
        }
        if(title==2){//筛选
            var daily_type=[];
            for(var i in classify) {
                if(classify[i]) {
                    daily_type.push(i-(-1))
                }
            }
            var condition={
                user_id:this.props.user_id,
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
    dailyDetail(id){
        this.props.navigation.navigate('DailyDetail',
            {   user_id:this.props.user_id,
                company_id:this.props.company_id,
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
    //日程类型颜色不同
    getTypeColor(type){
        if(type==1){
          return(com.bgc24)
        }else if(type==2){
            return (com.bgc84)
        }else if(type==4){
            return(com.bgcfd)
        }else if(type==3){
            return(com.bgcr)
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
    //筛选
    goPageClassify(){
        this.props.navigation.navigate('DailyClassify', {
            classify: this.state.classify,
            status_order:this.state.status_order,
            selected:this.state.selected,
            daily_title:1//区分我的日程和下属日程
        });

    }
    //查找日程
    goPageSearch(){
        this.props.navigation.navigate('DailySearch', {
            user_id:this.props.user_id,
            company_id:this.props.company_id,
            daily_title:1//区分我的日程和下属日程
        });
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
                                        {(daily[i].daily_type==1)?(
                                            <Text> {daily[i].customerName}</Text>):(<Text>{daily[i].title}</Text>)}
                                        <View style={[com.row,com.aic,com.mgt5]}>
                                            {Platform.OS === 'ios'?
                                                <View style={[com.pdt1l10,com.mgr5,com.br200,this.getTypeColor(daily[i].daily_type)]}>
                                                    <Text style={[com.cfff,com.fs10]}>{daily[i].typeName}</Text>
                                                </View>
                                                : <Text style={[com.mgr5,com.cfff,com.fs10,com.pdt1l10,com.br10,this.getTypeColor(daily[i].daily_type)]}>
                                                {daily[i].typeName}
                                                </Text>}
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
            <View>
                <View style={[com.row,com.jcsa,com.pdt5l15,com.bbwc,com.aic,com.bgcfff]}>
                    {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                    <TouchableOpacity style={[com.pos]}
                                      onPress={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}>
                        {this.show_StatusName()}
                    </TouchableOpacity>
                    <TouchableOpacity style={[com.pos]}
                                      onPress={() => {this.goPageSearch()}}>
                        <View style={[com.row,com.pdlr15,com.aic]} >
                            <Image
                                style={[com.wh16,com.tcbe,com.mgl5]}
                                source={require('../../imgs/customer/search.png')}/>
                            <Text>搜索</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[com.pos]}
                                      onPress={() => {this.goPageClassify()}}>
                        <View style={[com.row,com.pdlr15,com.aic]} >
                            <Image
                                style={[com.wh16,com.tcbe,com.mgl5,com.br,this.state.selected?com.tcr:null]}
                                   source={require('../../imgs/customer/shaixuan.png')}/>
                            <Text style={[this.state.selected?com.cr:null]}>筛选</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView style={[{height:screenH*0.80}]}>
                    <View style={[com.bckf5,com.btwc]}>
                        {dailylist}
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
                                            style={[com.posr,com.h200,{top:Platform.OS === 'ios'? 91:80,left:0,width:screenW,height:screenH,backgroundColor:'#000',opacity:0.6}]}></View>

                                        <View style={[com.posr,{top:0}]}>
                                            <View style={[com.bckfff,{marginTop:Platform.OS === 'ios'? 91:70}]}>
                                                {/*页面级-下拉框内容*/}
                                                <View style={[com.pdt5,com.pdb5,com.row,]}>
                                                    <View style={[{width:screenW}]}>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,1);this.setState({status_order:1})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={this.state.status_order==1?[com.cr]:null}>全部状态</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,2);this.setState({status_order:2})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={this.state.status_order==2?[com.cr]:null}>无进展</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,3);this.setState({status_order:3})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={this.state.status_order==3?[com.cr]:null}>有进展</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,4);this.setState({status_order:4})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={this.state.status_order==4?[com.cr]:null}>未结束</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,5);this.setState({status_order:5})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={this.state.status_order==5?[com.cr]:null}>已结束</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                        <TouchableHighlight
                                                            style={[com.pdt5l15,com.bbwc]}
                                                            onPress={() => {this.searchDaily(1,6);this.setState({status_order:6})}}
                                                            underlayColor="#f0f0f0"
                                                            >
                                                            <View>
                                                                <Text style={this.state.status_order==6?[com.br]:null}>已撤销</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </View>
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
const styles = StyleSheet.create({
    subNav_sub_border:{
        borderLeftWidth: 1,
        borderColor:'#ccc',
    },
    subNav_sub:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:36,
        width:screenW/3,
    },
    subNav_img:{
        marginTop:3,
        marginLeft:4,
        width:15,
        height:15,
        tintColor: '#aaa'
    }
})


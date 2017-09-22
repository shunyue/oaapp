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
    AsyncStorage,
    DeviceEventEmitter,
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import Loading from '../../common/loading';
import com from '../../public/css/css-com';
import wds from '../../public/css/css-window-single.js';
import Modal from 'react-native-modal'
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Calendar from 'react-native-calendar';
import moment from 'moment';
export default class MyDailyList  extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        this.state = {
            load:true,
            time:moment(new Date()).format('YYYY-MM-DD'),
            count:0,
            daily:[]
        };
    }
    componentDidMount() {
        this.searchDaily(moment(new Date()).format('YYYY-MM-DD'));
        this.dailyListener= DeviceEventEmitter.addListener('dailyInfo', (a)=> {
            this.setState({
                load: true,
            })
            this.searchDaily(moment(new Date()).format('YYYY-MM-DD'));
        });
        this.newDailyListener=DeviceEventEmitter.addListener('newDaily', (e)=> {
            if(e!=null && e!=""){
                this.setState({
                    load: true,
                })
                this.searchDaily(moment(new Date()).format('YYYY-MM-DD'));
            }
        });

    }
    componentWillUnmount() {
        // 移除监听
        this.dailyListener.remove();
        this.newDailyListener.remove();
    }

    searchDaily(time){
        var url=config.api.base+config.api.searchMyDaily;
        request.post(url,{
            user_id:this.props.user_id,
            company_id:this.props.company_id,
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
    onDateSelect(date){
        var time=moment(date).format('YYYY-MM-DD');
        this.searchDaily(time);
        this.setState({
            load:true,
            time:time
        })
    }
    //日程详情页面
    dailyDetail(daily) {
        //this.props.navigation.navigate('DailyDetail',{user_id:this.props.user_id,company_id:this.props.company_id,dailyInfo:daily});
        this.props.navigation.navigate('DailyDetail',{
            user_id:this.props.user_id,
            company_id:this.props.company_id,
            dailyInfo:daily
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
    render() {
        if(this.state.load){
            return(
                <View style={[com.hh9,com.jcc,com.aic]}>
                    <Loading/>
                </View>
            )
        }
        var daily= this.state.daily;
        if(daily !=""){
            var dailylist = [];
            for(var i in daily){
                dailylist.push(
                    <View style={[]} key={i}>
                        <TouchableHighlight
                            style={[]}
                            onPress={
                                this.dailyDetail.bind(this,daily[i])
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
                                    <View style={[]}>
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
                <View style={[com.jcc,com.aic,com.bgce6,com.flex]} key={0}>
                    <View style={[com.jcc,com.aic,com.bgce6]}>
                        <Image style={[com.wh64,com.mgt20]} source={require('../../imgs/noContent.png')}/>
                        <Text>暂无日程</Text>
                    </View>
                </View>)
        }
        return (
            <ScrollView>
                {/*事件插件区域*/}
                <View>
                    <Calendar
                        currentMonth={this.state.time}       // Optional date to set the currently displayed month after initialization
                        //customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
                        dayHeadings={['日', '一', '二', '三', '四', '五','六']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                        monthNames={['1月','2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']}                // Defaults to english names of months
                        nextButtonText={'下一月'}           // Text for next button. Default: 'Next'
                        onDateSelect={(date) => this.onDateSelect(date)} // Callback after date selection
                        onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                        onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                        onTouchNext={this.onTouchNext}    // Callback for next touch event
                        onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                        onTitlePress={this.onTitlePress}  // Callback on title press
                        prevButtonText={'上一月'}           // Text for previous button. Default: 'Prev'
                        removeClippedSubviews={false}     // Set to false for us within Modals. Default: true
                        //renderDay={this.state.time}         // Optionally render a custom day component
                        scrollEnabled={true}              // False disables swiping. Default: False
                        selectedDate={this.state.time}       // Day to be selected
                        showControls={true}               // False hides prev/next buttons. Default: False
                        showEventIndicators={true}        // False hides event indicators. Default:False
                        startDate={this.state.time}          // The first month that will display. Default: current month
                        titleFormat={'YYYY MMMM'}         // Format for displaying current month. Default: 'MMMM YYYY'
                        today={this.state.time}              // Defaults to today
                        weekStart={0} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
                        />
                </View>
                <View style={[com.bckf5,com.btwc,com.btwc,com.flex]}>
                    <View style={[com.row,com.jcsb,com.pdt5l15,com.bbwc]}>
                        <View style={[com.row]}>
                            <Text style={[com.mgr5]}>我的</Text>
                            <Text>日程{this.state.count}项</Text>
                        </View>
                        {/* <View style={[com.row]}>
                         <Text>筛选</Text>
                         <Image style={[com.wh24,com.tcr]} source={require('../../imgs/navld32.png')}/>
                         </View>*/}
                    </View>
                    <View style={{}}>
                        {dailylist}
                    </View>


                </View>
            </ScrollView>
        );
    }
}

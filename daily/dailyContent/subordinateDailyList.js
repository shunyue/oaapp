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
import Loading from '../../common/loading';
import com from '../../public/css/css-com';
import wds from '../../public/css/css-window-single.js';
import Modal from 'react-native-modal'
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Calendar from 'react-native-calendar';
import moment from 'moment';
export default class SubordinateDailyList  extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        this.state = {
            load:true,
            time:moment(new Date()).format('YYYY-MM-DD'),
            count:0,
            daily:[],
            subordinate:[],
        };
    }
    componentDidMount() {
     this.searchDaily(this.state.time);
        this.dailyListener= DeviceEventEmitter.addListener('dailyInfo', (a)=> {
            this.setState({
                load: true,
            })
        this.searchDaily(moment(new Date()).format('YYYY-MM-DD'));
        });
        //选择下属
        this.subordinateListener= DeviceEventEmitter.addListener('Subordinate', (c)=> {
            this.setState({
                load: true,
            })
            this.searchDaily(this.state.time,c);
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
        this.subordinateListener.remove();
        this.newDailyListener.remove();
    }
    //筛选任务人
    goPage_chooseEmployee(){
        var  subordinate=this.state.subordinate;
        var  subordinateIds=[];
        for (var i = 0; i < subordinate.length; i++) {
            subordinateIds[i]=subordinate[i].id;
        }
        this.props.navigation.navigate('ChooseSubordinate',{
            user_id:this.props.user_id,
            company_id:this.props.company_id,
            subordinate:this.state.subordinate,
            subordinateIds:subordinateIds
        });
    }
    searchDaily(time,subordinate=[]){
        if(subordinate.length!=0){
            var subordinateIds=[];
            for (var i = 0; i < subordinate.length; i++) {
                 subordinateIds[i]=subordinate[i].id;
             }
            //添加执行人
            var condition={
                user_id:this.props.user_id,
                current_time:time,
                subordinate:subordinateIds
            }
        }else{
            var condition={
                user_id:this.props.user_id,
                current_time:time,
            }
        }
        var url=config.api.base+config.api.searchSubordinateDaily;
        request.post(url,condition).then((res)=>{
            var data=res.data;
            this.setState({
                subordinate:subordinate,
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
        this.setState({
            load:true,
            time:time
        })
        this.searchDaily(time);

    }
    //日程详情页面
    dailyDetail(daily) {
        //this.props.navigation.navigate('DailyDetail',{user_id:this.props.user_id,company_id:this.props.company_id,dailyInfo:daily});
        this.props.navigation.navigate('DailyDetail',{
            user_id:this.props.user_id,
            company_id:this.props.company_id,
            dailyInfo:daily});
    }
    //获取日程状态名称
    getStatusName(status,start_time){
        var today=moment(new Date()).format('YYYY-MM-DD');
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
        var subordinateArr=[];
        var  subordinate=this.state.subordinate;
        if(subordinate!= null && subordinate.length>=4){
            for (var i = 0; i <4; i++) {
                subordinateArr.push(
                    <View key={i}>
                        <Text>
                            {subordinate[i].name}&nbsp;
                        </Text>
                    </View>
                );
            }
            subordinateArr.push(
                <View key={i-(-1)}>
                    <Text>等{subordinate.length}人</Text>
                </View>
            );
        }else if(subordinate!=null && subordinate.length>0){
            for (var i = 0; i <subordinate.length; i++) {
                subordinateArr.push(
                    <View  key={i}>
                        <Text>{subordinate[i].name}&nbsp;</Text>
                    </View>
                );
            }
        }else{
            subordinateArr.push(
               <View key={0}><Text style={[com.mgr5]}>我的下属</Text></View>
            );
        }
        const customStyle = {
            calendarHeading: {
                backgroundColor: 'blue',
            }
        }
        if (this.state.load) {
            return (
                <ScrollView style={[com.pos,com.flex,{height:screenH}]}>
                    {/*事件插件区域*/}
                    <View style={[com.posr,com.bbwc,com.jcc,com.aic,com.bgce6,com.ww,com.btbwd]}>
                        <Calendar
                            customStyle={customStyle}
                            currentMonth={this.state.time}       // Optional date to set the currently displayed month after initialization
                            //customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
                            dayHeadings={['日', '一', '二', '三', '四', '五','六']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                            eventDates={['2017-07-01']}       // Optional array of moment() parseable dates that will show an event indicator
                            events={[{date:'2017-07-06'}]}// Optional array of event objects with a date property and custom styles for the event indicator
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
                    <View style={[{marginTop:300},com.bckf5,com.btwc,com.btwc]}>
                        <View style={[com.row,com.jcsb,com.pdt5l15,com.bbwc]}>
                            <View style={[com.row]}>
                                {subordinateArr}
                                <Text>日程{this.state.count}项</Text>
                            </View>
                            <TouchableHighlight
                                 style={[]}
                                onPress={
                                this.goPage_chooseEmployee.bind(this)}
                                >
                                <View style={[com.row]}>
                                    <Text>筛选</Text>
                                    <Image style={[com.wh24,com.tcr]} source={require('../../imgs/navld32.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <Loading/>
                    </View>
                </ScrollView>
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
                <View style={[com.jcc,com.aic,com.bgce6]} key={0}>
                    <View style={[com.jcc,com.aic,com.bgce6]}>
                        <Image style={[com.wh64]} source={require('../../imgs/noContent.png')}/>
                        <Text>暂无日程</Text>
                    </View>
                </View>)
        }
        return (
            <ScrollView style={[com.pos,com.flex,{height:screenH}]}>
                {/*事件插件区域*/}
                <View style={[com.posr,com.bbwc,com.jcc,com.aic,com.bgce6,com.ww,com.btbwd]}>
                    <Calendar
                        customStyle={customStyle}
                        currentMonth={this.state.time}       // Optional date to set the currently displayed month after initialization
                        //customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
                        dayHeadings={['日', '一', '二', '三', '四', '五','六']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                        eventDates={['2017-07-01']}       // Optional array of moment() parseable dates that will show an event indicator
                        events={[{date:'2017-07-06'}]}// Optional array of event objects with a date property and custom styles for the event indicator
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
                <View style={[{marginTop:310},com.bckf5,com.btwc,com.btwc]}>
                    <View style={[com.row,com.jcsb,com.pdt5l15,com.bbwc]}>
                        <View style={[com.row]}>
                            {subordinateArr}
                            <Text>日程{this.state.count}项</Text>
                        </View>
                        <TouchableHighlight
                            onPress={()=>this.goPage_chooseEmployee()}
                            underlayColor="#ffffff"
                            >
                            <View style={[com.row]}>
                                <Text>筛选</Text>
                                <Image style={[com.wh24,com.tcr]} source={require('../../imgs/navld32.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    {dailylist}
                </View>
            </ScrollView>
        );
    }
}

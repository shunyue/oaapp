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
    ActivityIndicator
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
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Loading from '../common/loading';
import Calendar from 'react-native-calendar';

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
            mydaily_time: moment(new Date()).format('YYYY-MM-DD'),
            subdaily_time: moment(new Date()).format('YYYY-MM-DD'),
            tab:1,  //有1,2两种状态  1:我的日程 2:下属日程
            change:true,//有两种状态  true:日程列表 false:搜索日程
            current_day:moment(new Date()).format('DD'),
            current_month:moment(new Date()).format('MM/YYYY'),
            subordinateInfo:[],
            load:true,
            mycount:0,
            mydaily:[],
            subcount:0,
            subdaily:[]
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
                this.searchMyDaily(moment(new Date()).format('YYYY-MM-DD'));
            //    this.searchSubDaily(moment(new Date()).format('YYYY-MM-DD'));
            })
        this.dailyListener= DeviceEventEmitter.addListener('DailyInfo', (a)=> {
            this.setState({
                load: true,
            })
            this.searchMyDaily(moment(new Date()).format('YYYY-MM-DD'));
        });
        this.newDailyListener=DeviceEventEmitter.addListener('newDaily', (e)=> {
            if(e!=null && e!=""){
                this.setState({
                    load: true,
                })
                this.searchMyDaily(moment(new Date()).format('YYYY-MM-DD'));
            }
        });

        //选择下属
        this.subordinateListener= DeviceEventEmitter.addListener('Subordinate', (c)=> {
            this.setState({
                load: true,
                subordinate: c
            })
            this.searchSubDaily(this.state.time,c);
        });
    }
    componentWillUnmount() {
        // 移除监听
        this.dailyListener.remove();
        this.newDailyListener.remove();
        this.subordinateListener.remove();
    }
    //搜索下属
    getSubordinate(data,subordinate=""){
        //搜索人员
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.searchSubordinate;
        request.post(url,{
            name: subordinate,
            title: 1,
            company_id: data.company_id,
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
    //报表页面
    goPage_report(){
        this.props.navigation.navigate('Form',{});
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
    //筛选任务人
    goPage_chooseEmployee(){
        var  subordinate=this.state.subordinate;
        var  subordinateIds=[];
        for (var i = 0; i < subordinate.length; i++) {
            subordinateIds[i]=subordinate[i].id;
        }
        this.props.navigation.navigate('ChooseSubordinate',{
            user_id:this.state.user_id,
            company_id:this.state.company_id,
            subordinate:this.state.subordinate,
            subordinateIds:subordinateIds
        });
    }


    state = {
        isModalVisible: false
    }
    _showModal = () =>this.setState({isModalVisible: true})
    //动态信息获取 查看 我的客户
    _getContent(tab) {
        var params={
            user_id:this.state.user_id,
            company_id:this.state.company_id,
            navigation:this.props.navigation
        };
        var subordinateInfo=this.state.subordinateInfo;
        if(tab==1 && this.state.change==true && this.state.user_id){//我的日程列表
          return  this._getMyDailyList()
        }else if(tab==2 && this.state.change==true && this.state.user_id && subordinateInfo.length!=0){//下属日程列表
            //return <SubordinateDailyList {...params}/>
            return this._getSubDailyList()
        }else if(tab==1 && this.state.change==false && this.state.user_id){//搜索我的日程
            return <MyDailySearch  {...params}/>
        }else if(tab==2 && this.state.change==false && this.state.user_id && subordinateInfo.length!=0){//搜索下属日程
            return <SubordinateDailySearch {...params}/>
        }
    }
    //查询我的日程
    searchMyDaily(time){
        var url=config.api.base+config.api.searchMyDaily;
        request.post(url,{
            user_id:this.state.user_id,
            company_id:this.state.company_id,
            current_time:time
        }).then((res)=>{
            var data=res.data;
            this.setState({
                mycount: data.count,
                mydaily: data.info,
                load: false
            })
        })
        .catch((error)=>{
           toast.bottom('网络连接失败,请检查网络后重试')
        });
    }
    //查询下属日程
    searchSubDaily(time,subordinate=[]){
        if(subordinate.length!=0){
            var subordinateIds=[];
            for (var i = 0; i < subordinate.length; i++) {
                subordinateIds[i]=subordinate[i].id;
            }
            //添加执行人
            var condition={
                user_id:this.state.user_id,
                current_time:time,
                subordinate:subordinateIds
            }
        }else{
            var condition={
                user_id:this.state.user_id,
                current_time:time,
            }
        }
        var url=config.api.base+config.api.searchSubordinateDaily;
        request.post(url,condition).then((res)=>{
            var data=res.data;
            this.setState({
                subordinate:subordinate,
                subcount: data.count,
                subdaily: data.info,
                load: false
            })
        })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    //选择时间,查询我的日程
    onMyDateSelect(date){
        var time=moment(date).format('YYYY-MM-DD');
        this.searchMyDaily(time);
        this.setState({
            load:true,
            mydaily_time:time
        })
    }
    //选择时间,查询下属日程
    onSubDateSelect(date){
        var time=moment(date).format('YYYY-MM-DD');
        this.searchSubDaily(time);
        this.setState({
            load:true,
            subdaily_time:time
        })
    }
    //日程详情页面
    dailyDetail(id) {
        //this.props.navigation.navigate('DailyDetail',{user_id:this.props.user_id,company_id:this.props.company_id,dailyInfo:daily});
        this.props.navigation.navigate('DailyDetail',{
            user_id:this.state.user_id,
            company_id:this.state.company_id,
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
    //显示我的日程内容
    _getMyDailyList(){
        if (this.state.load) {
            return (
                <ScrollView>
                    {/*事件插件区域*/}
                    <View style={[com.flex]}>
                        <Calendar
                            currentMonth={this.state.mydaily_time}       // Optional date to set the currently displayed month after initialization
                            dayHeadings={['日', '一', '二', '三', '四', '五','六']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                            monthNames={['1月','2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']}                // Defaults to english names of months
                            nextButtonText={'下一月'}           // Text for next button. Default: 'Next'
                            onDateSelect={(date) => this.onMyDateSelect(date)} // Callback after date selection
                            onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                            onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                            onTouchNext={this.onTouchNext}    // Callback for next touch event
                            onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                            onTitlePress={this.onTitlePress}  // Callback on title press
                            prevButtonText={'上一月'}           // Text for previous button. Default: 'Prev'
                            removeClippedSubviews={false}     // Set to false for us within Modals. Default: true
                            scrollEnabled={true}              // False disables swiping. Default: False
                            selectedDate={this.state.mydaily_time}       // Day to be selected
                            showControls={true}               // False hides prev/next buttons. Default: False
                            showEventIndicators={true}        // False hides event indicators. Default:False
                            startDate={this.state.mydaily_time}          // The first month that will display. Default: current month
                            titleFormat={'YYYY MMMM'}         // Format for displaying current month. Default: 'MMMM YYYY'
                            today={this.state.mydaily_time}              // Defaults to today
                            weekStart={0} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
                            />
                    </View>
                    <View style={[com.bckf5,com.btwc,com.btwc,com.flex]}>
                        <View style={[com.row,com.jcsb,com.pdt5l15,com.bbwc]}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[com.row]}>
                                    <Text>查询中...</Text>
                                </View>
                                <ActivityIndicator
                                    color="#e4393c"
                                    size="small"
                                    />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )
        }
        var daily= this.state.mydaily;
        if(daily !=""){
            var dailylist = [];
            for(var i in daily){
                dailylist.push(
                    <View style={[]} key={i}>
                        <TouchableHighlight
                            style={[]}
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
                        <Image style={[com.wh64,com.mgt20]} source={require('../imgs/noContent.png')}/>
                        <Text>暂无日程</Text>
                    </View>
                </View>)
        }
        return (
            <ScrollView>
                {/*事件插件区域*/}
                <View style={[com.flex]}>
                    <Calendar
                        currentMonth={this.state.mydaily_time}       // Optional date to set the currently displayed month after initialization
                        //customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
                        dayHeadings={['日', '一', '二', '三', '四', '五','六']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                        monthNames={['1月','2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']}                // Defaults to english names of months
                        nextButtonText={'下一月'}           // Text for next button. Default: 'Next'
                        onDateSelect={(date) => this.onMyDateSelect(date)} // Callback after date selection
                        onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                        onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                        onTouchNext={this.onTouchNext}    // Callback for next touch event
                        onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                        onTitlePress={this.onTitlePress}  // Callback on title press
                        prevButtonText={'上一月'}           // Text for previous button. Default: 'Prev'
                        removeClippedSubviews={false}     // Set to false for us within Modals. Default: true
                        scrollEnabled={true}              // False disables swiping. Default: False
                        selectedDate={this.state.mydaily_time}       // Day to be selected
                        showControls={true}               // False hides prev/next buttons. Default: False
                        showEventIndicators={true}        // False hides event indicators. Default:False
                        startDate={this.state.mydaily_time}          // The first month that will display. Default: current month
                        titleFormat={'YYYY MMMM'}         // Format for displaying current month. Default: 'MMMM YYYY'
                        today={this.state.mydaily_time}              // Defaults to today
                        weekStart={0} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
                        />
                </View>
                <View style={[com.bckf5,com.btwc,com.btwc,com.flex]}>
                    <View style={[com.row,com.jcsb,com.pdt5l15,com.bbwc]}>
                        <View style={[com.row]}>
                            <Text style={[com.mgr5]}>我的</Text>
                            <Text>日程{this.state.mycount}项</Text>
                        </View>
                    </View>
                    <View style={{}}>
                        {dailylist}
                    </View>
                </View>
            </ScrollView>
        );
    }
    //显示下属日程
    _getSubDailyList(){
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
                <ScrollView >
                    {/*事件插件区域*/}
                    <View>
                        <Calendar
                            // customStyle={customStyle}
                            currentMonth={this.state.subdaily_time}       // Optional date to set the currently displayed month after initialization
                            //customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
                            dayHeadings={['日', '一', '二', '三', '四', '五','六']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                            monthNames={['1月','2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']}                // Defaults to english names of months
                            nextButtonText={'下一月'}           // Text for next button. Default: 'Next'
                            onDateSelect={(date) => this.onSubDateSelect(date)} // Callback after date selection
                            onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                            onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                            onTouchNext={this.onTouchNext}    // Callback for next touch event
                            onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                            onTitlePress={this.onTitlePress}  // Callback on title press
                            prevButtonText={'上一月'}           // Text for previous button. Default: 'Prev'
                            removeClippedSubviews={false}     // Set to false for us within Modals. Default: true
                            //renderDay={this.state.time}         // Optionally render a custom day component
                            scrollEnabled={true}              // False disables swiping. Default: False
                            selectedDate={this.state.subdaily_time}       // Day to be selected
                            showControls={true}               // False hides prev/next buttons. Default: False
                            showEventIndicators={true}        // False hides event indicators. Default:False
                            startDate={this.state.subdaily_time}          // The first month that will display. Default: current month
                            titleFormat={'YYYY MMMM'}         // Format for displaying current month. Default: 'MMMM YYYY'
                            today={this.state.subdaily_time}              // Defaults to today
                            weekStart={0} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
                            />
                    </View>
                    <View style={[com.bckf5,com.btwc,com.btwc]}>
                        <View style={[com.row,com.jcsb,com.pdt5l15,com.bbwc]}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[com.row]}>
                                    <Text>查询中...</Text>
                                </View>
                                <ActivityIndicator
                                    color="#e4393c"
                                    size="small"
                                    />
                            </View>

                            <TouchableHighlight
                                onPress={
                                this.goPage_chooseEmployee.bind(this)}
                                >
                                <View style={[com.row]}>
                                    <Text>筛选</Text>
                                    <Image style={[com.wh24,com.tcr]} source={require('../imgs/navld32.png')}/>
                                </View>
                            </TouchableHighlight>
                        </View>

                    </View>
                </ScrollView>
            )
        }
        var daily= this.state.subdaily;
        if(daily !=""){
            var dailylist = [];
            for(var i in daily){
                dailylist.push(
                    <View style={[]} key={i}>
                        <TouchableHighlight
                            style={[]}
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
                        <Image style={[com.wh64]} source={require('../imgs/noContent.png')}/>
                        <Text>暂无日程</Text>
                    </View>
                </View>)
        }
        return (
            <ScrollView>
                {/*事件插件区域*/}
                <View>
                    <Calendar
                        //customStyle={customStyle}
                        currentMonth={this.state.subdaily_time}       // Optional date to set the currently displayed month after initialization
                        //customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
                        dayHeadings={['日', '一', '二', '三', '四', '五','六']}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                        monthNames={['1月','2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']}                // Defaults to english names of months
                        nextButtonText={'下一月'}           // Text for next button. Default: 'Next'
                        onDateSelect={(date) => this.onSubDateSelect(date)} // Callback after date selection
                        onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
                        onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
                        onTouchNext={this.onTouchNext}    // Callback for next touch event
                        onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
                        onTitlePress={this.onTitlePress}  // Callback on title press
                        prevButtonText={'上一月'}           // Text for previous button. Default: 'Prev'
                        removeClippedSubviews={false}     // Set to false for us within Modals. Default: true
                        //renderDay={this.state.time}         // Optionally render a custom day component
                        scrollEnabled={true}              // False disables swiping. Default: False
                        selectedDate={this.state.subdaily_time}       // Day to be selected
                        showControls={true}               // False hides prev/next buttons. Default: False
                        showEventIndicators={true}        // False hides event indicators. Default:False
                        startDate={this.state.subdaily_time}          // The first month that will display. Default: current month
                        titleFormat={'YYYY MMMM'}         // Format for displaying current month. Default: 'MMMM YYYY'
                        today={this.state.subdaily_time}              // Defaults to today
                        weekStart={0} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
                        />
                </View>
                <View style={[com.bckf5,com.btwc,com.btwc]}>
                    <View style={[com.row,com.jcsb,com.pdt5l15,com.bbwc]}>
                        <View style={[com.row]}>
                            {subordinateArr}
                            <Text>日程{this.state.subcount}项</Text>
                        </View>
                        <TouchableHighlight
                            onPress={()=>this.goPage_chooseEmployee()}
                            underlayColor="#ffffff"
                            >
                            <View style={[com.row]}>
                                <Text>筛选</Text>
                                <Image style={[com.wh24,com.tcr]} source={require('../imgs/navld32.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    {dailylist}
                </View>
            </ScrollView>
        );
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
       // subordinateInfo=[];
        if(subordinateInfo.length!=0){
            return(
            <ScrollableTabView
                renderTabBar={() => <ScrollableTabBar
                              style={styles.tabar_scroll}
                   />}
                ref={(tabView) => {this.tabView = tabView}}
                tabBarUnderlineStyle={{height:2,backgroundColor: '#e15151',}}
                tabBarBackgroundColor='#FFFFFF'
                tabBarActiveTextColor='#e15151'
                tabBarInactiveTextColor='#333'
                locked ={ false}
                tabBarTextStyle ={{fontSize:16,}}
                showsVerticalScrollIndicator={false}
                >
                <View tabLabel='我的日程'>
                    {this._getContent(1)}
                </View>
                <View  tabLabel='下属日程'>
                    {this._getContent(2)}
                </View>
            </ScrollableTabView>
        )}else{
            return(
                <View>
                <View style={{backgroundColor:'#fff',height:40,alignItems:'center',justifyContent:'center'}}>
                     <Text style={{color:'#333',fontSize:16}}>我的日程</Text>
                </View>
                    {this._getContent(1)}
            </View>
           )
        }
    }
    render() {
        var daily=[];
        var params={
            user_id:this.state.user_id,
            company_id:this.state.company_id,
            navigation:this.props.navigation
        };
        return (
            <View style={[com.flex]}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                {/*自定义导航*/}
                {/*自定义导航栏-中间*/}
                {this.getTitle()}

                {/*自定义导航栏-定位左边*/}
                <TouchableHighlight
                    style={[com.posr,{top:Platform.OS === 'ios'? 28:8,left:10}]}
                    onPress={()=>{this.repose()}}
                    underlayColor="#f5f5f5"
                    >
                    <View style={[]}>
                        <Image style={[com.wh24,com.tcr]} source={require('../imgs/bbr32.png')}/>
                    </View>
                </TouchableHighlight>
                {/*自定义导航栏-定位右边*/}
                <View style={[com.row,com.posr,{ height:40,alignItems:'center',top:Platform.OS==='ios'?20:null,right:15}]}>
                    <TouchableHighlight
                        onPress={()=>{this.setState({change:!this.state.change})}}
                        underlayColor="#f5f5f5"
                        >
                        <View>
                            {this.state.change==true?(
                                <Image style={[com.wh24,com.tcr]} source={require('../imgs/cirmenu32.png')}/>
                            ):(<Image style={[com.wh20,com.tcr]} source={require('../imgs/cal.png')}/>)}
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

                { /*  <ScrollView style={[com.pos,com.flex,{height:screenH}]}>
                 {this._getContent(this.state.user_id,this.state.company_id)}
                 </ScrollView>*/}
                {/*事件触发-加号图标*/}
                <TouchableOpacity style={[com.posr,{top:screenH*0.75,right:30}]}
                                  onPress={() => {{this.setState({show: !this.state.show})}}}>

                        <Image
                            style={[com.tcr,com.wh32]} source={require('../imgs/addr.png')}/>

                </TouchableOpacity>
                {/* 添加模型-加号图标 */}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {this.setState({show: !this.state.show})}}
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
                            <View style={[com.posr,{top:Platform.OS === 'ios'? 445:345,left:0}]}>
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
                                    <Image
                                        style={[com.wh48,com.mgb5,]}
                                        source={require('../imgs/del162.png')}/>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    tabar_scroll: {
        height: 40,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },

})


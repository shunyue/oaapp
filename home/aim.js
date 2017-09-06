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
    DeviceEventEmitter,
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
export default class Aim extends Component {
    back() {
        this.props.navigation.goBack('Aim');
    }
    constructor(props){
        super(props) ;
        this.state={
            //底部选择项 默认不显示
            show: false,
            visibleModal:false,
            company_name:'',
            monthData:'',
            seasonData:'',
            yearData:''
        };
    }
   //新增企业目标
    add() {
        this.props.navigation.navigate('AddGoal',
            {company_id:this.props.navigation.state.params.company_id,
                user_id:this.props.navigation.state.params.user_id,})
    }

    save() {
        alert('save');
    }

    componentDidMount() {
        this.addGoalListen = DeviceEventEmitter.addListener('addgoal',(value) => {
            this.firstProduce();
        });
        this.firstProduce();
    }

    componentWillUnmount() {
        this.addGoalListen.remove();
    }
    firstProduce(){
        var url=config.api.base + config.api.target;
        request.post(url,{
            company_id:this.props.navigation.state.params.company_id,
            user_id:this.props.navigation.state.params.user_id,
        }).then((responseJson) => {
            this.setState({
                companyData:responseJson.data.company,
                monthData:responseJson.data.month,
                seasonData:responseJson.data.season,
                yearData:responseJson.data.year,
                role: responseJson.data.role,
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    AimDetail(name,id,time){
        if(this.state.role){
            this.props.navigation.navigate('AimDetail',
                {company_id:this.props.navigation.state.params.company_id,
                    user_id: this.props.navigation.state.params.user_id,
                    role:this.state.role,
                    company_name:name,target_id:id,time:time});
        }else{
            this.props.navigation.navigate('AimDetail',
                {company_id:this.props.navigation.state.params.company_id,
                    user_id: this.props.navigation.state.params.user_id,
                    role:this.state.role,
                    company_name:name,target_id:id,time:time});
        }
    }
    render() {
        var company=this.state.companyData;
        for(var i in company){
            var iqye=company[i].company_name;
        }
        var yearArray=['2017','2018','2019','2020'] ;
        var myDate = new Date();
        if(this.state.yearData){
            var yearing=myDate.getFullYear();
            var nextyearing= yearing+1;
            var yearData=this.state.yearData;
            var yearList1=[];
            var yearList2=[];
            for(var i in yearData){
                var money_percent=yearData[i].sum/yearData[i].total_money;
                var sell_percent= yearData[i].num/yearData[i].sell_number;
                if(yearData[i].date > yearing) {
                    yearList1.push(
                        <View key={i}>
                            <View style={{height:30,justifyContent:'center',marginLeft:15}}>
                                <Text>{yearData[i].title}</Text>
                            </View>
                            <TouchableHighlight  key={i}
                                                 onPress={this.AimDetail.bind(this,iqye,yearData[i].id,yearData[i].years)}
                                                 underlayColor="#d5d5d5"
                                >
                                <View style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                    <View style={[styles.place,styles.borderBottom,{justifyContent:'space-between',height:60}]}>
                                        <View style={{paddingLeft:15}}>
                                            <Text style={{color:'#333'}}>金额：{yearData[i].total_money}元</Text>
                                            <Text style={{color:'#333'}}>订单：{yearData[i].sell_number}单</Text>
                                        </View>
                                        <View style={[styles.place]}>
                                            <View>
                                                <Text>达成：{(money_percent*100).toFixed(2)+'%'}</Text>
                                                <Text>达成：{(sell_percent*100).toFixed(2)+'%'}</Text>
                                            </View>
                                            <Image style={{width:16,height:16,marginLeft:20,marginRight:10}}
                                                   source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                    )
                }else{
                    yearList2.push(
                        <View key={i}>
                            <View style={{height:30,justifyContent:'center',marginLeft:15}}>
                                <Text>{yearData[i].title}</Text>
                            </View>
                            <TouchableHighlight  key={i}
                                                 onPress={this.AimDetail.bind(this,iqye,yearData[i].id,yearData[i].years)}
                                                 underlayColor="#d5d5d5"
                                >
                                <View style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                    <View style={[styles.place,styles.borderBottom,{justifyContent:'space-between',height:60}]}>
                                        <View style={{paddingLeft:15}}>
                                            <Text style={{color:'#333'}}>金额：{yearData[i].total_money}元</Text>
                                            <Text style={{color:'#333'}}>订单：{yearData[i].sell_number}单</Text>
                                        </View>
                                        <View style={[styles.place]}>
                                            <View>
                                                <Text>达成：{(money_percent*100).toFixed(2)+'%'}</Text>
                                                <Text>达成：{(sell_percent*100).toFixed(2)+'%'}</Text>
                                            </View>
                                            <Image style={{width:16,height:16,marginLeft:20,marginRight:10}}
                                                   source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                    )
                }
            }
        }

        if(this.state.seasonData){
            var yearing=myDate.getFullYear();
            var nextyearing= yearing+1;
            var seasonData=this.state.seasonData;
            var seasonList1=[];
            var seasonList2=[];
            for(var i in seasonData){
                var money_percent=seasonData[i].sum/seasonData[i].total_money;
                var sell_percent= seasonData[i].num/seasonData[i].sell_number;
                if(seasonData[i].date > yearing) {
                    var temp3=1;
                    seasonList1.push(
                        <TouchableHighlight  key={i}
                                             onPress={this.AimDetail.bind(this,iqye,seasonData[i].id,seasonData[i].seasons)}
                                             underlayColor="#d5d5d5"
                            >
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.place,styles.borderBottom,{justifyContent:'space-between',height:60}]}>
                                    <View style={[styles.place]}>
                                        {seasonData[i].choose == 1 ? <View style={[styles.quarterStyle_N]}>
                                            <Text
                                                style={{fontSize:22,color:'#fff',marginTop:6,marginLeft:5}}>{seasonData[i].season}</Text>
                                            <Text style={{fontSize:11,color:'#fff'}}>季度</Text>
                                        </View> : <View style={[styles.quarterStyle]}>
                                            <Text
                                                style={{fontSize:22,color:'#62b8f4',marginTop:6,marginLeft:5}}>{seasonData[i].season}</Text>
                                            <Text style={{fontSize:11,color:'#62b8f4'}}>季度</Text>
                                        </View>}

                                        <View>
                                            <Text style={{color:'#333'}}>金额：{seasonData[i].total_money}元</Text>
                                            <Text style={{color:'#333'}}>订单：{seasonData[i].sell_number}单</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.place]}>
                                        <View>
                                            <Text>达成：{(money_percent*100).toFixed(2)+'%'}</Text>
                                            <Text>达成：{(sell_percent*100).toFixed(2)+'%'}</Text>
                                        </View>
                                        <Image style={{width:16,height:16,marginLeft:20,marginRight:10}}
                                               source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )
                } else{
                    var temp4=1;
                    seasonList2.push(
                        <TouchableHighlight  key={i}
                                             onPress={this.AimDetail.bind(this,iqye,seasonData[i].id,seasonData[i].seasons)}
                                             underlayColor="#d5d5d5"
                            >
                            <View  key={i} style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.place,styles.borderBottom,{justifyContent:'space-between',height:60}]}>
                                    <View style={[styles.place]}>
                                        {seasonData[i].choose == 1 ? <View style={[styles.quarterStyle_N]}>
                                            <Text
                                                style={{fontSize:22,color:'#fff',marginTop:6,marginLeft:5}}>{seasonData[i].season}</Text>
                                            <Text style={{fontSize:11,color:'#fff'}}>季度</Text>
                                        </View> : <View style={[styles.quarterStyle]}>
                                            <Text
                                                style={{fontSize:22,color:'#62b8f4',marginTop:6,marginLeft:5}}>{seasonData[i].season}</Text>
                                            <Text style={{fontSize:11,color:'#62b8f4'}}>季度</Text>
                                        </View>}

                                        <View>
                                            <Text style={{color:'#333'}}>金额：{seasonData[i].total_money}元</Text>
                                            <Text style={{color:'#333'}}>订单：{seasonData[i].sell_number}单</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.place]}>
                                        <View>
                                            <Text>达成：{(money_percent*100).toFixed(2)+'%'}</Text>
                                            <Text>达成：{(sell_percent*100).toFixed(2)+'%'}</Text>
                                        </View>
                                        <Image style={{width:16,height:16,marginLeft:20,marginRight:10}}
                                               source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )
                }
            }
        }

        if(this.state.monthData){
            var yearing=myDate.getFullYear();
            var nextyearing= yearing+1;
            var monthData=this.state.monthData;
            var monthList1=[];
            var monthList2=[];
            for(var i in monthData){
                var money_percent=monthData[i].sum/monthData[i].total_money;
                var sell_percent= monthData[i].num/monthData[i].sell_number;
                if(monthData[i].date>yearing) {
                    var temp1=1;
                    monthList1.push(
                        <TouchableHighlight  key={i}
                                             onPress={this.AimDetail.bind(this,iqye,monthData[i].id,monthData[i].months)}
                                             underlayColor="#d5d5d5"
                            >
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.place,styles.borderBottom,{justifyContent:'space-between',height:60}]}>
                                    <View style={[styles.place]}>
                                        {monthData[i].choose==1 ?<View style={[styles.monthStyle_N]}>
                                            <Text style={{fontSize:22,color:'#fff',marginTop:6}}>{monthData[i].month}</Text>
                                            <Text style={{fontSize:11,color:'#fff'}}>月</Text>
                                        </View> : <View style={[styles.monthStyle]}>
                                            <Text style={{fontSize:22,color:'#fb9819',marginTop:6}}>{monthData[i].month}</Text>
                                            <Text style={{fontSize:11,color:'#fb9819'}}>月</Text>
                                        </View>}
                                        <View>
                                            <Text style={{color:'#333'}}>金额：{monthData[i].total_money}元</Text>
                                            <Text style={{color:'#333'}}>订单：{monthData[i].sell_number}单</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.place]}>
                                        <View>
                                            <Text>达成：{(money_percent*100).toFixed(2)+'%'}</Text>
                                            <Text>达成：{(sell_percent*100).toFixed(2)+'%'}</Text>
                                        </View>
                                        <Image  style={{width:16,height:16,marginLeft:20,marginRight:10}} source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )
                }else{
                    var temp2=2;
                    monthList2.push(
                        <TouchableHighlight   key={i}
                                              onPress={this.AimDetail.bind(this,iqye,monthData[i].id,monthData[i].months)}
                                              underlayColor="#d5d5d5"
                            >
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.place,styles.borderBottom,{justifyContent:'space-between',height:60}]}>
                                    <View style={[styles.place]}>
                                        {monthData[i].choose==1 ?<View style={[styles.monthStyle_N]}>
                                            <Text style={{fontSize:22,color:'#fff',marginTop:6}}>{monthData[i].month}</Text>
                                            <Text style={{fontSize:11,color:'#fff'}}>月</Text>
                                        </View> : <View style={[styles.monthStyle]}>
                                            <Text style={{fontSize:22,color:'#fb9819',marginTop:6}}>{monthData[i].month}</Text>
                                            <Text style={{fontSize:11,color:'#fb9819'}}>月</Text>
                                        </View>}
                                        <View>
                                            <Text style={{color:'#333'}}>金额：{monthData[i].total_money}元</Text>
                                            <Text style={{color:'#333'}}>订单：{monthData[i].sell_number}单</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.place]}>
                                        <View>
                                            <Text>达成：{(money_percent*100).toFixed(2)+'%'}</Text>
                                            <Text>达成：{(sell_percent*100).toFixed(2)+'%'}</Text>
                                        </View>
                                        <Image  style={{width:16,height:16,marginLeft:20,marginRight:10}} source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )
                }
            }
        }

        return (
            <View style={styles.ancestorCon}>
                {/*导航栏*/}
                <View style={styles.navCon}>
                        <TouchableHighlight
                            onPress={()=>this.back()}
                            underlayColor="#d5d5d5"
                        >
                            <View style={styles.navltys}>
                                <Image source={require('../imgs/navxy.png')}/>
                                <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={styles.fSelf}>{iqye}目标</Text>
                        <View style={{width:20,height:20,marginRight:15}}>
                            <TouchableHighlight
                                onPress={()=>this.add()}
                                underlayColor="#d5d5d5"

                                >
                                <Image style={this.state.role ?{width:20,height:20,}:{display:'none'}} source={require('../imgs/add.png')}/>
                            </TouchableHighlight>
                        </View>

                </View>
                {/*内容主题*/}
                <ScrollableTabView
                    renderTabBar={() => <ScrollableTabBar
                              style={styles.tabar_scroll}
             />}
                    tabBarUnderlineStyle={{height:2,backgroundColor: '#e15151',}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#e15151'
                    tabBarInactiveTextColor='#333'
                    >
                    <View  tabLabel=' 月度目标 '>
                        <ScrollView  keyboardShouldPersistTaps={'always'}>
                            <View style={temp1 ? {height:30,justifyContent:'center',marginLeft:15}:{display:'none'}}>
                                <Text style={temp1 ? {}:{display:'none'}}>{nextyearing}年</Text>
                            </View>
                            {monthList1}
                            <View style={temp2 ? {height:30,justifyContent:'center',marginLeft:15}:{display:'none'}}>
                                <Text style={temp2 ? {}:{display:'none'}}>{yearing}年</Text>
                            </View>
                            {monthList2}
                        </ScrollView>
                    </View >
                    <View  tabLabel=' 季度目标 '>
                        <ScrollView  keyboardShouldPersistTaps={'always'}>
                            <View style={temp3 ? {height:30,justifyContent:'center',marginLeft:15}:{display:'none'}}>
                                <Text style={temp3 ? {}:{display:'none'}}>{nextyearing}年</Text>
                            </View>
                            {seasonList1}
                            <View style={temp4 ? {height:30,justifyContent:'center',marginLeft:15}:{display:'none'}}>
                                <Text style={temp4 ? {}:{display:'none'}}>{nextyearing}年</Text>
                            </View>
                            {seasonList2}
                        </ScrollView>
                    </View >
                    <View  tabLabel=' 年度目标 '>
                        <ScrollView  keyboardShouldPersistTaps={'always'}>
                            {yearList1}
                            {yearList2}
                        </ScrollView>
                    </View >
                </ScrollableTabView>
            </View>
        )
            ;
    }
}

const styles = StyleSheet.create({
    navltys: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navltyszt: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#e4393c',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    ancestorCon: {//祖先级容器
        flex: 1,
        backgroundColor: '#EEEFF4'
    },
    navCon: {//头部导航
        height: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    sz: {//导航图标
        width: 30,
        height: 30
    },
    fSelf: {//导航字体相关
        color: '#000',
        //height: 30,
        fontSize: 16
    },
    navFont: {
        color: '#FC2E40'
    },
//    主题内容
    childContent: {//子容器页面级
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#fff',
    },
//    公共行级元素
    common: {
        flex: 1,
    },
    place:{
        flexDirection:'row',
        alignItems:'center',
    },
    borderTop:{
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
    }

});

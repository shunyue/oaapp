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
    RefreshControl,
    DeviceEventEmitter
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
import Header from '../../common/header';
export default class PersonalLog extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            show: false,
            title: 1,
            load: true,
            data: [],
            isRefreshing: false,
            time:moment(new Date()).format('YYYY-MM-DD'),
        };
    }
    //耗时操作放在这里面
    componentDidMount() {
        //收到监听
        this.listener = DeviceEventEmitter.addListener('backData', (e)=> {
            this.setState({
                load: true
            })
            var data = this.state.data;
            for (i = 0; i < e.length; i++) {
                var key = e[i].key;
                data[key].reviewLen = e[i].reviewLen;
                data[key].review = e[i].review;
            }
            this.setState({
                data: data,
                load: false
            })
        });
        this.showLogs();
    }
    componentWillUnmount() {
        // 移除监听
        this.listener.remove();
    }
    setVisibleModal(visible) {
        this.setState({show: visible});
    }
    state = {
        isModalVisible: false
    }
    _showModal = () => this.setState({isModalVisible: true})

    showLogs() {//显示日志内容及评论内容
        let {params} = this.props.navigation.state;
        var url = config.api.base + config.api.getLogs;
        request.post(url, {
            title: 2,
          employee_id: params.employee_id,
        }).then((res) => {
            this.setState({
                data: res.data.log,
                load: false
            })
        })
            .catch((error)=> {
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    }
    employeeInfo(){
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('UserMsg',{
            accept_id:params.employee_id,//要查看的下属员工ID
            company_id:params.company_id,//公司的ID
            user_id:params.user_id//当前登录者的ID
        })
    }
    logDetail(id, i) {//日志详情
        let {params} = this.props.navigation.state;
        let log = {
            logId: id,
            logdata: this.state.data,
            key: i
        }
        this.props.navigation.navigate('LogDetail', {
            log: log,
            user_id:params.user_id,
            company_id:params.company_id})
    }
    render() {
        let {params} = this.props.navigation.state;
        //加载过程
        if (this.state.load) {
            return (
                <Loading/>
            )
        }
        //有数据的情况
        var data = this.state.data;
        var list = [];
        var showToday=0;
        //无数据
        if (data != null && data.length != 0) {
            for (var i in data) {
                var key = i;
                if (data[i].log_type == 1) {
                    var logname = '日报';
                } else if (data[i].log_type == 2) {
                    var logname = '周报';
                } else if (data[i].log_type == 3) {
                    var logname = '月报';
                }
                if(data[i].date==this.state.time){
                    var showToday=1;
                }
                list.push(
                    <View  style={[com.pdlr15]} key={i}>
                        <View style={[com.row,com.aic]}>
                            <Image style={[com.wh28,com.tcccc]} source={require('../../imgs/log/iconld.png')}/>
                            <Text style={[com.cbe,com.fs14]}>{data[i].date}</Text>
                        </View>
                    <TouchableHighlight
                        style={[]}
                        onPress={this.logDetail.bind(this,data[i].id,key)}
                        underlayColor="#fff"
                       >
                        <View style={[com.br10,com.bckfff,com.bwc,com.pd10,]}>
                            <View style={[com.row,com.jcsb,com.bbwc,com.pdb10,com.aic]}>
                                <View style={[com.row,]}>
                                    {(data[i].avatar==""||data[i].avatar==null)?(
                                        <Image style={[com.tcp,com.wh32,com.br200]} source={require('../../imgs/tx.png')}/>
                                    ):(<Image style={[com.wh32,com.br200]} source={{uri:data[i].avatar}}/>)}
                                    <View style={[com.mgl10]}>
                                        <Text>{data[i].employeeName}</Text>
                                        <Text style={[com.fs10,com.cbe]}>{data[i].datetime}</Text>
                                    </View>
                                </View>
                                <View style={[com.row]}>
                                    <Text style={[com.cbe,com.mgr20]}>{data[i].reviewLen} 评论</Text>
                                    <Text>{logname}</Text>
                                </View>
                            </View>
                            {(data[i].day_finish == null || data[i].day_finish == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>今日完成工作</Text>
                                    <Text>{data[i].day_finish}</Text>
                                </View>
                            )}
                            {(data[i].week_finish == null || data[i].week_finish == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>本周完成工作</Text>
                                    <Text>{data[i].week_finish}</Text>
                                </View>
                            )}
                            {(data[i].month_finish == null || data[i].month_finish == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>本月完成工作</Text>
                                    <Text>{data[i].month_finish}</Text>
                                </View>
                            )}

                            {(data[i].unfinish == null || data[i].unfinish == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>未完成工作</Text>
                                    <Text>{data[i].unfinish}</Text>
                                </View>
                            )}
                            {(data[i].weekplan == null || data[i].weekplan == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>下周工作计划</Text>
                                    <Text>{data[i].weekplan}</Text>
                                </View>
                            )}
                            {(data[i].monthplan == null || data[i].monthplan == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>下月工作计划</Text>
                                    <Text>{data[i].monthplan}</Text>
                                </View>
                            )}
                            {(data[i].coordinate == null || data[i].coordinate == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>需协调工作</Text>
                                    <Text>{data[i].coordinate}</Text>
                                </View>
                            )}
                            {(data[i].explain == null || data[i].explain == "") ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>备注</Text>
                                    <Text>{data[i].explain}</Text>
                                </View>
                            )}
                            {(data[i].pic == null || data[i].pic == "" || data[i].picLen == 0) ? (null) : (
                                <View style={[com.bbwc,com.pd5]}>
                                    <Text style={[com.fs12,com.cbe,com.mgb5]}>照片</Text>
                                    <Text>{data[i].picLen}张</Text>
                                </View>
                            )}
                            <View style={[com.jcc,com.pdt10,com.aic]}>
                                <Text style={[com.cr,com.fs12]}
                                      onPress={this.logDetail.bind(this,data[i].id,key)}
                                    >查看更多</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
                )
            }

        }


        return (
            <View style={styles.ancestorCon}>
                <Header title={params.userName+"的日志"}
                        navigation={this.props.navigation}
                        source={require('../../imgs/personal.png')}
                        onPress={()=>this.employeeInfo()}/>
                
                <ScrollView
                    style={[com.pdl15,com.pdr15]}>
                    {showToday==0?( <View style={[com.pdlr15]}>
                        <View style={[com.row,com.aic]}>
                            <Image style={[com.wh28,com.tcccc]} source={require('../../imgs/log/iconld.png')}/>
                            <Text style={[com.cbe,com.fs14]}>{this.state.time}</Text>
                        </View>
                        <View style={[com.bgcfff,com.bweb,com.br10,com.pd6]}>
                            <Text style={[com.cbe,com.fs14]}>今日未提交</Text>
                        </View>
                    </View>):(null)}
                    {list}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navltys: {
        //flex: 1,
        width: 50,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        //height: (Platform.OS === 'ios') ? 50 : 30,
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
        backgroundColor: '#EEEFF4',
    },
    navCon: {//头部导航
        height: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 5,
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


});

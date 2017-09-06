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
export default class Log extends Component {
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
            subordinate:[]
        };
        this._data = [];

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
        this.newlogListener= DeviceEventEmitter.addListener('newLog', (e)=> {
            this.setState({
                load: true
            });
            this.showLogs(this.state.title);
        });
        this.showLogs(this.state.title);
    }

    componentWillUnmount() {
        // 移除监听
        this.listener.remove();
        this.newlogListener.remove();
    }

    setVisibleModal(visible) {
        this.setState({show: visible});
    }
    state = {
        isModalVisible: false
    }

    _showModal = () => this.setState({isModalVisible: true})

    logTodyReport() {//日报表
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('LogTodyReport',{
            user_id:params.user_id,
            company_id:params.company_id})
    }

    logWeekReport() {//周报表
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('LogWeekReport',{
            user_id:params.user_id,
            company_id:params.company_id})
    }

    logMonthReport() {//月报表
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('LogMonthReport',{
            user_id:params.user_id,
            company_id:params.company_id})
    }
    logDetail(id, i) {//日志详情页面
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

    showLogs(title) {//显示日志内容及评论内容
        let {params} = this.props.navigation.state;
        this.setState({isRefreshing: true});
        var url = config.api.base + config.api.getLogs;
        request.post(url, {
            title: title,
            employee_id: params.user_id,
        }).then((res) => {
            this.setState({
                load: false,
                data: res.data.log,
                title: title,
                isRefreshing: false,
                subordinate:res.data.subordinate
            })
        })
        .catch((error)=> {
                toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    //按照人名搜索日志
    goPage_logSearch(){
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('LogSearch',{
            user_id:params.user_id,
            company_id:params.company_id})
    }
    //查看部门人员提交情况
    SubordinateLog(){
        let {params} = this.props.navigation.state;
        this.props.navigation.navigate('SubordinateLog',{
            user_id:params.user_id,
            company_id:params.company_id})
    }

    render() {
        //加载过程
        if (this.state.load) {
            return (
                <Loading/>
            )
        }
        if (this.state.title == 1) {
            var titlename = '全部';
        } else if (this.state.title == 2) {
            var titlename = '我发出的';
        } else if (this.state.title == 3) {
            var titlename = '我收到的';
        }
        //有数据的情况
        var data = this.state.data;
        var list = [];
        //无数据
        if (data == null || data == "" || data.length == 0) {
            list.push(  <View style={[com.jcc,com.aic,com.bgce6]} key={0}>
                <View style={[com.jcc,com.aic]}>
                    <Image style={[com.wh64]} source={require('../../imgs/noContent.png')}/>
                    <Text>暂无日志</Text>
                </View>
            </View>)
        }else{
            for (var i in data) {
                var key = i;
                if (data[i].log_type == 1) {
                    var logname = '日报';
                } else if (data[i].log_type == 2) {
                    var logname = '周报';
                } else if (data[i].log_type == 3) {
                    var logname = '月报';
                }
                list.push(
                    <TouchableHighlight
                        style={[com.mgt5]}
                        onPress={this.logDetail.bind(this,data[i].id,key)}
                        underlayColor="#fff"
                        key={i}>
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
                )
            }

        }


        return (
            <View style={styles.ancestorCon}>
                {/*导航栏*/}
                <View style={[styles.navCon,com.aic]}>
                    <TouchableHighlight
                        style={styles.navltys}
                        onPress={()=>this.back()}
                        underlayColor="#d5d5d5"
                        >
                        <View style={styles.navltys}>
                            <Image source={require('../../imgs/navxy.png')}/>
                            <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.fSelf}>工作日志</Text>
                    {this.state.subordinate!=null && this.state.subordinate.length!=0?(
                        <TouchableHighlight
                            style={styles.navltys}
                            onPress={()=>this.SubordinateLog()}
                            underlayColor="#f5f5f5"
                            >
                            <View style={[com.jcc,styles.navltys]}>
                                <Text style={[styles.fSelf,styles.navltyszt]}>部门</Text>
                            </View>
                        </TouchableHighlight>
                    ):( <TouchableHighlight
                        style={styles.navltys}
                        underlayColor="#f5f5f5"
                        >
                        <View style={[com.jcc,styles.navltys]}>
                        </View>
                    </TouchableHighlight>)}


                </View>
                {/*内容主题*/}
                <TouchableOpacity onPress={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}>
                    <View style={[com.row,com.jcsb,com.aic,com.pdt10l15,com.bckfff,com.bbwc]}>
                        <Text>{titlename}</Text>
                        <Image style={[com.wh16]} source={require('../../imgs/jtxx.png')}/>
                    </View>
                </TouchableOpacity>
                {/*页面级-下拉框*/}
                <View>
                    <Modal
                        animationIn={'slideInDown'}
                        animationOut={'slideOutUp'}
                        isVisible={this.state.isModalVisible}
                        >
                        <TouchableWithoutFeedback
                            onPress={()=>this.setState({isModalVisible: !this.state.isModalVisible})}
                            >
                            <View style={{flex:1}}>
                                <View style={styles.model}></View>
                                <View style={styles.model_up}>
                                    <View style={[com.bckfff,com.mgt75]}>
                                        {/*页面级-下拉框内容*/}
                                        <View style={[com.pdt5,com.pdb5,com.row,]}>
                                            <View style={[{width:screenW}]}>
                                                <TouchableHighlight
                                                    style={[]}
                                                    onPress={()=>{this.showLogs(1);this.setState({isModalVisible:!this.state.isModalVisible})}}
                                                    underlayColor="#f0f0f0"
                                                    >
                                                    <View style={[com.aic,com.row,com.bbwc,com.pdb5,com.mgl15]}>
                                                        <Image style={[com.wh16,com.mgr5]}
                                                               source={require('../../imgs/cp32.png')}/>
                                                        <Text style={[com.cr]}>全部</Text>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight
                                                    style={[]}
                                                    onPress={()=>{this.showLogs(2);this.setState({isModalVisible:!this.state.isModalVisible})}}
                                                    underlayColor="#f0f0f0"
                                                    >
                                                    <View
                                                        style={[com.row,com.aic,com.bbwc,com.pdt5,com.pdb5,com.mgl30,{}]}>
                                                        <Image style={[com.tcccc,com.wh16,com.mgr5]}
                                                               source={require('../../imgs/iconfj.png')}/>
                                                        <Text style={[]}>我发出的</Text>
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight
                                                    style={[]}
                                                    onPress={()=>{this.showLogs(3);this.setState({isModalVisible:!this.state.isModalVisible})}}
                                                    underlayColor="#f0f0f0"
                                                    >
                                                    <View
                                                        style={[com.row,com.aic,com.bbwc,com.pdt5,com.pdb5,com.mgl30,]}>
                                                        <Image style={[com.tcccc,com.wh16,com.mgr5]}
                                                               source={require('../../imgs/iconsj.png')}/>
                                                        <Text style={[]}>我收到的</Text>
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
                <ScrollView
                    style={[com.pdl15,com.pdr15]}
                    refreshControl={
           <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={()=>this.showLogs(this.state.title)}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
             colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
              />
            }>
                    {/*搜索员工*/}
                    {this.state.data.length!=0?( <View style={[]}>
                        <TouchableHighlight
                            style={[]}
                            onPress={()=>this.goPage_logSearch()}
                            underlayColor="#fff"
                            >
                            <View style={[com.ROW,com.jcc,com.AIC,com.BCKFFF,com.PD5,com.mgt5,com.BR]}>
                                <Image
                                    style={[com.wh16,com.mgr5]} source={require('../../imgs/search.png')}/>
                                <Text>搜索员工</Text>
                            </View>
                        </TouchableHighlight>
                    </View>):(null)}
                    {list}
                </ScrollView>

                {/*底部通栏*/}
                <View>
                    <TouchableOpacity style={styles.icon_touch2}
                                      onPress={() => {{this.setState({show: !this.state.show})}}}>
                        <View style={[com.row,com.pdt15,com.bckfff,com.btwc,com.pdb15,com.aic,com.jcc]}>
                            <Image style={[com.wh16,com.mgr5]} source={require('../../imgs/add.png')}/>
                            <Text style={[com.cr]}>发起日志</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 添加模型 */}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH*0.9,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
  this.setVisibleModal(!this.state.show)
}}></TouchableOpacity>
                        </View>
                        <View style={[wds.addCustomer,{height:230},com.bckfff,com.pdt10]}>
                            <View style={[wds.addCustomer_card,com.pdt5,com.pdb5,com.aic,com.jcc]}>
                                <View style={[com.row,com.jcsb,com.aic,{width:screenW*0.8},com.pdb10]}>
                                    <TouchableOpacity style={[wds.customerCard_content,com.pdt5,com.pdb5]}
                                                      onPress={() => { this.setVisibleModal(!this.state.show);this.logTodyReport()}}>
                                        <View style={[com.jcc,com.aic]}>
                                            <Image style={[com.wh32,com.mgr5,com.mgb5]}
                                                   source={require('../../imgs/iconrb.png')}/>
                                            <Text>日报</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[wds.customerCard_content,com.pdt5,com.pdb5]}
                                                      onPress={() => { this.setVisibleModal(!this.state.show);this.logWeekReport()}}>
                                        <View style={[com.jcc,com.aic]}>
                                            <Image style={[com.wh32,com.mgr5,com.mgb5]}
                                                   source={require('../../imgs/iconzb.png')}/>
                                            <Text>周报</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[wds.customerCard_content,com.pdt5,com.pdb5]}
                                                      onPress={() => { this.setVisibleModal(!this.state.show);this.logMonthReport()}}>
                                        <View style={[com.jcc,com.aic]}>
                                            <Image style={[com.wh32,com.mgr5,com.mgb5]}
                                                   source={require('../../imgs/iconyb.png')}/>
                                            <Text>月报</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={[wds.customerCard_content,com.pdt5,com.pdb5]}
                                     onPress={() => { this.setVisibleModal(!this.state.show);this.logTemplate()}}>
                                     <View style={[com.jcc,com.aic]}>
                                     <Image style={[com.wh32,com.mgr5,com.mgb5]} source={require('../../imgs/icontjmb.png')}/>
                                     <Text>添加模板</Text>
                                     </View>
                                     </TouchableOpacity>*/}
                                </View>
                                <TouchableOpacity
                                    style={[wds.customerCard_content,com.pdt5,com.pdb5,wds.customerCard_content2]}
                                    onPress={() => { this.setVisibleModal(!this.state.show)}}>
                                    <Text style={{color:'#555'}}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
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

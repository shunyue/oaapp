/**
 * Created by Administrator on 2017/6/7.
 * 公海
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    ScrollView
} from 'react-native';
import Modal from 'react-native-modal'
import Header from '../../common/header';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            messageVisible:'名称排序',
            type: 1,
            classify: [],
            customerData: [],
        };
    }

    componentWillUnmount() {
        this._listenter1.remove();
        this._listenter2.remove();
    }

    componentDidMount() {
        this._listenter1 = DeviceEventEmitter.addListener('CommonClassify', (data) => {

            this.setState({classify: data});
            this._customerInfo(this.state.type, data.place, data.classify, data.start_time, data.stop_time, data.day);
        });

        this._listenter2 = DeviceEventEmitter.addListener('ReloadCommon',()=>{
            this._customerInfo(this.state.type,this.state.classify.place,this.state.classify.classify,this.state.classify.start_time,this.state.classify.stop_time,this.state.classify.day);

        });

        this._customerInfo(this.state.type, this.state.classify.place, this.state.classify.classify,this.state.classify.start_time,this.state.classify.stop_time,this.state.classify.day);
    }

    _showModal(visible) {
        this.setState({isModalVisible: visible});
    }

    //动态信息下拉
    selectMessage(type){

        this.setState({isModalVisible: !this.state.isModalVisible,type: type});

        this._customerInfo(type,this.state.classify.place,this.state.classify.classify,this.state.classify.start_time,this.state.classify.stop_time,this.state.classify.day);
        if(type==1){
            this.state.messageVisible="名称排序"
        }else if(type==2){
            this.state.messageVisible="最新创建"
        }else if(type==3){
            this.state.messageVisible="长期未跟进"
        }
    }
    goPage_searchGonghai() {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('SearchGonghai',{user_id: params.user_id,company_id: params.company_id})
    };

    _customerInfo(type,place,classify,start_time,stop_time,day) {

        var url = config.api.base + config.api.customerInfo;
        const {params} = this.props.navigation.state;
        request.post(url,{
            user_id: params.user_id,
            company_id: params.company_id,
            type: type,
            place: place,
            classify: classify,
            start_time: start_time,
            stop_time: stop_time,
            day: day,
            private: 2
        }).then((result)=> {
            if(result.status == 1) {

                this.setState({
                    customerData: result.data.customerData
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    _customerDetail(data) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('GongHaiDetail',{customer:data,user_id: params.user_id,company_id: params.company_id});
    }
    render() {


        var customerList = [];
        var customerData = this.state.customerData;
        if(this.state.customerData.length == 0) {
            customerList.push (
                <View style={styles.emptyContent} key="1">
                    <Image source={require('../../imgs/customer/empty-content.png')}/>
                    <Text>暂无相关内容</Text>
                </View>
            )
        }

        for(var i in customerData) {
            customerList.push(
                <TouchableHighlight key={i} underlayColor={'#F3F3F3'}
                                    onPress={this._customerDetail.bind(this,customerData[i]) }  >
                    <View style={styles.newMessage_content}>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <Text style={{fontSize:14,color:'#000'}}>{customerData[i].cus_name}</Text>
                            <Text style={{color:'#e15151'}}>{customerData[i].classify?customerData[i].classify+"级":"未分类"}</Text>
                        </View>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <View style={[styles.newMessage_customer,]}>
                                <Image style={{width:16,height:16,marginRight:5}} source={require('../../imgs/customer/customer.png')}/>
                                <Text>{customerData[i].provice?customerData[i].provice+customerData[i].city+customerData[i].district: "未填写地址"}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }



        return (
            <View style={styles.ancestorCon}>

                <Header navigation={this.props.navigation}
                        title="公海"/>
                <View style={[styles.subNav,{backgroundColor:'#fff'}]}>
                    <TouchableHighlight underlayColor={'#fff'} onPress={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}>
                        <View style={styles.subNav_sub}>
                            <Text style={styles.subNav_subColor}>{this.state.messageVisible}</Text>
                            <Image style={styles.subNav_img} source={require('../../imgs/customer/arrowU.png')}/>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.subNav_sub_border}>
                        <TouchableHighlight underlayColor={'#fff'} onPress={()=>this.props.navigation.navigate('Classify',{classify: this.state.classify,type: 'common'})}>
                            <View style={[styles.subNav_sub]}>
                                <Image style={[styles.subNav_img,{tintColor:'#aaa'}]} source={require('../../imgs/customer/shaixuan.png')}/>
                                <Text>筛选</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.goPage_searchGonghai()}}>
                       <View style={styles.subNav_sub}>
                           <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                           <Text>搜索</Text>
                       </View>
                    </TouchableHighlight>

                </View>
                <ScrollView>
                {customerList}
                </ScrollView>

                {/*动态信息*/}
                <View>
                    <Modal
                        backdropOpacity={0}
                        transparent={true}
                        animationType={"fade"}
                        visible={this.state.isModalVisible}
                        onRequestClose={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}
                        >
                        <TouchableWithoutFeedback onPress={() => {this.setState({isModalVisible: !this.state.isModalVisible})}}>
                            <View style={{flex:1}}>
                                <View style={{width:screenW,height:(screenH-80),opacity:0.4,backgroundColor:'#000',top:80,position:'absolute'}}></View>
                                <View style={styles.modelUp}>
                                    <TouchableHighlight underlayColor={'#eee'} style={styles.xinxiiala} onPress={()=>{this.selectMessage(1)}}>
                                        <Text>名称排序</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#eee'} style={styles.xinxiiala} onPress={()=>{this.selectMessage(2)}}>
                                        <Text>最新创建</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor={'#eee'} style={[styles.xinxiiala,styles.bordernone]} onPress={()=>{this.selectMessage(3)}}>
                                        <Text>最近跟进时间</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                {/* 添加模型  筛选  */}
                <View>
                    <Modal
                        backdropOpacity={0}
                        animationIn={'slideInRight'}
                        animationOut={'slideOutRight'}
                        isVisible={this.state.shaixuan}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#000',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setShaixuanModal(!this.state.shaixuan)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.choose}>
                            <View>
                                <Text style={{marginLeft:12,marginTop:20}}>线索去向</Text>
                                <View style={styles.customer_fenlei}>
                                    <View style={{height:35,flexDirection:'row',marginLeft:5}}>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.41,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>已领取</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.41,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>未领取</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                <Text style={{marginLeft:12,marginTop:10}}>跟进深度</Text>
                                <View style={styles.customer_fenlei}>
                                    <View style={{height:35,flexDirection:'row',marginLeft:5}}>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.41,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>有电话沟通</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.41,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>有拜访记录</Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={{height:35,flexDirection:'row',marginLeft:5}}>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.41,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>有签约合同</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.41,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>成功收款</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={{marginLeft:12,marginTop:20}}>客户分类</Text>
                                <View style={styles.customer_fenlei}>
                                    <View style={{height:35,flexDirection:'row',marginLeft:5}}>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.26,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>A级</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.26,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>B级</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.26,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>C级</Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={{height:35,flexDirection:'row',marginLeft:5}}>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.26,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>D级</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={{backgroundColor:'#e3e3e3',width:screenW*0.26,margin:5,height:30,alignItems:'center',justifyContent:'center',borderRadius:4}}>
                                            <Text>未分级</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                <View style={styles.textIput}>
                                    <Text style={styles.input_title}>客户区域</Text>
                                    <TouchableHighlight onPress={() => {this.setState({shaixuan: !this.state.shaixuan});this.goPage_ChoseAddress()}}>
                                        <View style={styles.touch_a}>
                                            <Text style={styles.input_content}>全部</Text>
                                            <Image style={styles.textINput_arrow}
                                                   source={require('../../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.textIput}>
                                    <Text style={styles.input_title}>选择产品</Text>
                                    <TouchableHighlight onPress={() => {this.setState({shaixuan: !this.state.shaixuan})}}>
                                        <View style={styles.touch_a}>
                                            <Text style={styles.input_content}>全部</Text>
                                            <Image style={styles.textINput_arrow}
                                                   source={require('../../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <View style={{height:40,width:screenW,position:'absolute',bottom:10,backgroundColor:'#f9d2d2',flexDirection:'row',alignItems:'center'}}>
                                <TouchableHighlight style={{height:40,width:screenW*0.2,alignItems:'center',justifyContent:'center'}}>
                                    <Text  style={{color:'#e15151',}}>重置</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={{height:40,width:screenW*0.8,alignItems:'center',backgroundColor:'#e15151',justifyContent:'center'}}>
                                    <Text  style={{color:'#fff',}}>完成</Text>
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
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    newMessage_content:{
        width:screenW,
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
        height:100,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    newMessage_customer:{
        flexDirection:'row',
        alignItems:'center',
        height:22,
    },
    newMessage_customer_sty:{
        justifyContent:'space-between',
    },
    add:{
        width:24,
        height:24,
    },
    backwz:{
        position:'absolute',
        top:5,
        left:25,
        color:'red',
    },
    subNav: {
        height:35,
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        borderColor:'#ccc',
        borderBottomWidth: 1,
    },
    subNav_sub:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:screenW*0.33,
        marginTop:4,
        marginBottom:4,
    },
    subNav_sub_border:{
        borderColor:'#c5c5c5',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    subNav_subColor:{
        color:'#555',
    },
    subNav_img:{
        width:13,
        height:13,
        marginTop:2,
        marginLeft:4,
        marginRight:4
    },

    modelUp:{
        width:screenW,
        height:120,
        position: 'absolute',
        left:0,
        top:75,
        backgroundColor:'#fff'
    },
    choose:{
        width:screenW*0.9,
        height:screenH,
        backgroundColor:'#fff',
        position:'absolute',
        right:0,
    },
    textIput:{
        flexDirection:'row',
        alignItems:'center',
        width:screenW,
        height:40,
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
    },
    input_title:{
        width:screenW*0.3,
        paddingLeft:12
    },
    input_text:{
        width:screenW*0.48,
        height:40
    },
    input_content:{
        color:'#a5a5a5',
        width:screenW*0.48,
    },
    touch_a:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:5,
        height:40

    },
    textINput_arrow:{
        width:16,
        height:16,
        marginLeft:16
    },
    xinxiiala:{
        width:screenW,
        height:40,
        paddingLeft:25,
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
        justifyContent:'center'
    },
    bordernone:{
        borderBottomWidth:0,
    },
    emptyContent: {
        flex: 1,
        marginTop: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
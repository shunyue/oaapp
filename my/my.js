/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StackNavigator,
} from 'react-navigation';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableNativeFeedback,
    TouchableHighlight,
    DeviceEventEmitter,
    Dimensions,
} from 'react-native';
const screenW = Dimensions.get('window').width;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';

export default class My extends Component {
    //查询个人信息
    constructor(props){
        super(props)
        this.state={
            //底部选择项 默认不显示
            show: false,
            visibleModal:false,
            id:"",
            avatar:"",
            name: "",
        };
    }
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('avatar',(value)=>{
            this.setState({
                avatar:value
            })
        });
        this.getNet();
    }

    componentWillUnmount(){
        this.subscription.remove();
    }
    getNet(){
        var url = config.api.base + config.api.myselfInfomation;
        var id=5;
        request.post(url,{
            id: id,
        }).then((responseJson) => {
            this.setState({
                id:responseJson.id,
                avatar:responseJson.avatar,
                name: responseJson.name,
                tel:responseJson.tel,
                email:responseJson.email,
                department:responseJson.department,
                position:responseJson.position,
                address:responseJson.address
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    reportInfo(){
        this.props.navigation.navigate('Report')
    };
    companyQuery(){
        this.props.navigation.navigate('WebViewExample')
    };
    companySetting(){
        this.props.navigation.navigate('CompanySetting',{companyid:3});
        //alert("公司设置！");
    };
    selfSetting(){
        this.props.navigation.navigate('Mine',{id:this.state.id});
    };
    selfGrade(){
        alert("我的积分！");
    };
    selfSuccess(){
        alert("我的成就！");
    };
    explorde(){
        alert("推荐给朋友！");
    };

    render() {
        return (
            <View style={styles.ancestorCon}>
                <View style={{height:40,backgroundColor:'#fff',borderBottomWidth:1,borderColor:"#ccc",flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:15,paddingRight:15}}>
                    <View style={{width:25,height:25}}>
                        <Image style={{width:25,height:25.5,tintColor:'#e15151'}} source={require('../imgs/bb.png')}/>
                    </View>
                    <View>
                        <Text style={{color:'#333',fontSize:16}}>我的</Text>
                    </View>
                    <View  style={{width:25,height:25}}></View>
                </View>
                <ScrollView style={styles.childContent}>
                    {/*头部滚动模块*/}
                    <TouchableHighlight
                        underlayColor={'#c5c5c5'}
                        onPress={() => this.props.navigation.navigate('Info', {id:this.state.id})}>
                        <View style={[styles.topMoudel,{justifyContent:'space-between',borderBottomWidth:1,borderColor:'#e8e8e8'}]}>
                            <View style={{height:60,flexDirection:'row',alignItems:'center'}}>
                                {(this.state.avatar == '' || this.state.avatar ==null)?
                                    (<Image style={styles.myself} source={require('../imgs/avatar.png')}/>)
                                    :(<Image style={styles.myself} source={{uri:this.state.avatar}}/>)
                                }
                                <Text style={styles.info}>{this.state.name}</Text>
                            </View>
                            <View>
                                <Image style={{width:15,height:15,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.border_top,styles.border_bottom,{backgroundColor:'#fff',marginTop:10,paddingTop:10,paddingBottom:10}]}>
                        <View style={[styles.flexRow,{ height:70}]}>
                            <TouchableHighlight
                                onPress={()=>this.business()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/sj32.png')}/>
                                    <Text>商机</Text>
                                </View>

                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.sheet()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/ld32.png')}/>
                                    <Text>理单</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.contract()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/ht32.png')}/>
                                    <Text>合同</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.order()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/dd32.png')}/>
                                    <Text>订单</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={[styles.flexRow,{ height:70}]}>
                            <TouchableHighlight
                                onPress={()=>this.op()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/bb32i.png')}/>
                                    <Text>报表</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight

                                onPress={()=>this.aim()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/mb32.png')}/>
                                    <Text>目标</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.approval()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/gz32.png')}/>
                                    <Text>审批</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight

                                onPress={()=>this.log()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/rz32.png')}/>
                                    <Text>日志</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={[styles.flexRow,{ height:70}]}>
                            <TouchableHighlight
                                onPress={()=>this.mustreach()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/bd32.png')}/>
                                    <Text>必达</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight

                                onPress={()=>this.notice()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/gg32.png')}/>
                                    <Text>公告</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight

                                onPress={()=>this.attendance()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/kq32.png')}/>
                                    <Text>考勤</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight

                                onPress={()=>this.lineVisit()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image style={styles.flexRow_Img} source={require('../imgs/xlbf32.png')}/>
                                    <Text>线路拜访</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={[styles.flexRow,{ height:70}]}>
                            <TouchableHighlight

                                onPress={()=>this.project()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image  source={require('../imgs/xm32.png')}/>
                                    <Text>项目</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.product()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image  source={require('../imgs/cp32.png')}/>
                                    <Text>产品</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.priceList()}
                                underlayColor="transparent"
                                >
                                <View style={styles.flexRow_width}>
                                    <Image
                                        source={require('../imgs/jgb32.png')}/>
                                    <Text>价格表</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={()=>this.priceList()}
                                underlayColor="transparent">
                                <View style={styles.flexRow_width}>
                                    <Image
                                        source={require('../imgs/jgb32.png')}/>
                                    <Text>价格表</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{marginTop:10,marginBottom:10}}>
                        <TouchableHighlight
                            onPress={()=>this.companyQuery()}
                            underlayColor={'#c5c5c5'}
                            >
                            <View style={[styles.flexRow,styles.padding,styles.border_top,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <View style={styles.flexRow}>
                                    <Image style={{width:22,height:22,marginRight:15}} source={require('../imgs/qyquery.png')}/>
                                    <Text style={{fontSize:15,color:'#333'}} >企业工商查询   </Text>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.border_top,{marginBottom:10}]}>
                        <TouchableHighlight
                            onPress={()=>this.companySetting()}
                            underlayColor={'#c5c5c5'}
                            >
                            <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <View style={[styles.flexRow]}>
                                    <Image style={{width:18,height:18,marginRight:15,tintColor:'#666'}} source={require('../imgs/my/qi.png')}/>
                                    <Text style={{fontSize:15,color:'#333'}} >企业设置</Text>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={()=>this.selfSetting()}
                            underlayColor={'#c5c5c5'}
                            >
                            <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <View style={styles.flexRow}>
                                    <Image style={{width:17,height:17,marginRight:15,tintColor:'#666'}} source={require('../imgs/my/set.png')}/>
                                    <Text style={{fontSize:15,color:'#333'}} >个人设置</Text>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={()=>this.selfGrade()}
                            underlayColor={'#c5c5c5'}
                            >
                            <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <View style={styles.flexRow}>
                                    <Image style={{width:22,height:22,marginRight:15,tintColor:'#666'}} source={require('../imgs/my/jifen.png')}/>
                                    <Text style={{fontSize:15,color:'#333'}} >我的积分</Text>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={'#c5c5c5'}
                            onPress={()=>this.selfSuccess()}
                            >
                            <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <View style={styles.flexRow}>
                                    <Image style={{width:18,height:18,marginRight:15,tintColor:'#666'}} source={require('../imgs/my/chengjiu.png')}/>
                                    <Text style={{fontSize:15,color:'#333'}} >我的成就</Text>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={()=>this.explorde()}
                            underlayColor={'#c5c5c5'}
                            >
                            <View style={[styles.flexRow,styles.padding,styles.border_bottom,{justifyContent:'space-between',height:35}]}>
                                <View style={styles.flexRow}>
                                    <Image style={{width:18,height:18,marginRight:15,tintColor:'#666'}} source={require('../imgs/my/tuijian.png')}/>
                                    <Text style={{fontSize:15,color:'#333'}} >推荐[手机OA]给朋友</Text>
                                </View>
                                <Image style={{width:12,height:12,tintColor:'#888'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon: {//祖先级容器
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    childContent: {//子容器页面级
        flex: 1
        //justifyContent: 'space-between',
    },
    topMoudel:{
        height:60,
        backgroundColor:'#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#F0F0F0',
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15
    },
    myself:{
        width:40,
        height:40
    },
    info:{
        fontSize:15,
        marginLeft:15,
        color:'#333'
    },
    mrjt:{
        width: 20,
        height: 20,
        tintColor:'#888'
    },
    flexRow:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
    },
    flexRow_Img:{
        width:30,
        height:30,
        marginBottom:2
    },
    flexRow_width:{
        width:screenW*0.25,
        justifyContent:'center',
        alignItems:'center'
    },
    padding:{
        paddingLeft:15,
        paddingRight:15
    },
    border_top:{
        borderTopWidth:1,
        borderColor:'#e8e8e8'
    },
    border_bottom:{
        borderBottomWidth:1,
        borderColor:'#e8e8e8'
    },
});

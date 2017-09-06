/**
 * Created by Administrator on 2017/7/24.
 * 目标详情页面
 * 周飞飞
 */
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

const screenW = Dimensions.get('window').width;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';

export default class AimDetail extends Component {
    back() {
        this.props.navigation.goBack('AimDetail');
    }
    constructor(props){
        super(props) ;
        this.state={
            //底部选择项 默认不显示
            show: false,
            visibleModal:false,
            company_name:this.props.navigation.state.params.company_name,
            date:this.props.navigation.state.params.time,
            target_id:this.props.navigation.state.params.target_id,
            dataInfo:[],
            changePage:[]
        };
    }

    //编辑企业目标
    edit(id) {
        this.props.navigation.navigate('AimEditContent',
            {target_id:this.props.navigation.state.params.target_id,
             company_id:this.props.navigation.state.params.company_id,
            user_id:this.props.navigation.state.params.user_id,})
    }

    componentDidMount() {
        this.modifyGoalListen= DeviceEventEmitter.addListener('modifygoal',(value) => {
            this.firstProduce();
        });
        this.firstProduce();
    }
    componentWillUnmount() {
        this.modifyGoalListen.remove();
    }
    firstProduce(){
        var url=config.api.base + config.api.aimDetail;
        if(this.props.navigation.state.params.role) {
            request.post(url,{
                company_id: this.props.navigation.state.params.company_id,
                target_id:this.props.navigation.state.params.target_id,
                detail:1,
                role:this.props.navigation.state.params.role,
            }).then((responseJson) => {
                this.setState({
                    aim_money:responseJson.data.aim_money,
                    aim_examine:responseJson.data.aim_examine,
                    aim_sellnum:responseJson.data.aim_sellnum,
                    aim_sellexnum:responseJson.data.aim_sellexnum,
                    sum:responseJson.data.sum,
                    number:responseJson.data.number,
                    resolve:responseJson.data.resolve,
                })
            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            })
        }else{
            request.post(url,{
                company_id: this.props.navigation.state.params.company_id,
                resolve_target_id:this.props.navigation.state.params.target_id,
                detail:1,
                role:this.props.navigation.state.params.role,
            }).then((responseJson) => {
                this.setState({
                    aim_money:responseJson.data.aim_money,
                    aim_examine:responseJson.data.aim_examine,
                    aim_sellnum:responseJson.data.aim_sellnum,
                    aim_sellexnum:responseJson.data.aim_sellexnum,
                    sum:responseJson.data.sum,
                    number:responseJson.data.number,
                    resolve:responseJson.data.resolve,
                })
            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            })
        }

    }
    AimDetail(id,num){
        this.props.navigation.navigate('ResolveAimDetail',{
            target_id:id,company_id:this.props.navigation.state.params.company_id,
            confirm:num,
        });
    }
    resolve(id){
        if(this.state.resolve=='') {
            this.props.navigation.navigate('AimResolve',{
                target_id:id,company_id:this.props.navigation.state.params.company_id,
            });
        } else{
            this.props.navigation.navigate('EditResolve',{
                target_id:id,company_id:this.props.navigation.state.params.company_id,
            });
        }
    }
    render(){
        var role=this.props.navigation.state.params.role;
        var money0 = this.state.aim_examine,sell0=this.state.aim_sellexnum;//考核量
        var money = this.state.aim_money,sell=this.state.aim_sellnum;//总目标量
        var money1 = this.state.sum,sell1=this.state.number;//完成量
        var jindu01=money0/money,jindu03=sell0/sell;//完成度
        var jindu1=money1/money,jindu3=sell1/sell;//完成度

        var resolveData=this.state.resolve;
        if(resolveData){
            var resolvelist=[];
            for(var i in resolveData){
                var money_percent=resolveData[i].sum1/resolveData[i].total_money;
                var sell_percent= resolveData[i].num1/resolveData[i].sell_number;
                resolvelist.push(
                    <TouchableHighlight  key={i}
                                         onPress={this.AimDetail.bind(this,resolveData[i].id,resolveData[i].confirm)}
                                         underlayColor="#d5d5d5"
                        >
                        <View key={i} style={[styles.place,styles.borderBottom,{height:60}]}>
                            <Text style={{marginLeft:20,width:screenW*0.25}}>{resolveData[i].name}</Text>
                            <View style={{paddingLeft:5,width:screenW*0.35}}>
                                <Text style={{color:'#333'}}>金额：{resolveData[i].total_money}元</Text>
                                <Text style={{color:'#333'}}>销量：{resolveData[i].sell_number}单</Text>
                            </View>
                            <View style={[styles.place,{justifyContent:'space-between',width:screenW*0.3}]}>
                                <View>
                                    <Text>达成：{(money_percent*100).toFixed(2)+'%'}</Text>
                                    <Text>达成：{(sell_percent*100).toFixed(2)+'%'}</Text>
                                </View>
                                <Image style={{width:16,height:16,}}
                                       source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
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
                    <Text style={styles.fSelf}>目标详情</Text>
                    <View>
                        <TouchableHighlight
                            onPress={()=>this.edit(this.state.target_id)}
                            underlayColor="#d5d5d5"
                            style={role ?{}:{display:'none'}}
                            >
                            <View >
                                <Text style={[styles.fSelf,styles.navltyszt]}>编辑</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <ScrollView>
                    <View style={{height:60,backgroundColor:'#fff',flexDirection: 'column',justifyContent:'center',marginBottom:10}}>
                        <View style={{flexDirection: 'row',alignItems: 'center',marginLeft:screenW*0.05,marginBottom:6}}>
                            <Text style={{fontSize:13,color:'#999'}}>部门：</Text>
                            <Text style={{marginLeft:screenW*0.1,color:'#555'}}>{this.state.company_name}</Text>
                        </View>
                        <View style={{flexDirection: 'row',alignItems: 'center',marginLeft:screenW*0.05}}>
                            <Text style={{fontSize:13,color:'#999'}}>时间：</Text>
                            <Text style={{marginLeft:screenW*0.1,color:'#555'}}>{this.state.date}</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#fff',flexDirection: 'column',marginBottom:10,paddingBottom:10}}>
                        <View style={{flexDirection: 'row',justifyContent:'space-between',alignItems:'center',marginTop:15,marginLeft:20,marginBottom:20,height:15}}>
                            <View style={{flexDirection: 'row'}}>
                                <Image style={{width:16,height:16,marginTop:1}} source={require('../imgs/customer/business/add_5.png')}/>
                                <Text style={{fontSize:13,color:'#333',marginLeft:10,marginRight:10}}>金额目标</Text>
                            </View>
                            <View style={{flexDirection: 'row',alignItems:'center',marginRight:20}}>
                                <View style={{flexDirection: 'row',alignItems:'center'}}>
                                    <View style={{flexDirection: 'row',alignItems:'center',marginRight:5}}>
                                        <Text style={{width:8,height:2,backgroundColor:'#ccc',borderRadius:1}}></Text>
                                        <Text style={{width:2,height:10,backgroundColor:'#e15151',borderRadius:1}}></Text>
                                    </View>
                                    <Text style={{fontSize:13,color:'#888',}}>考核值</Text>
                                </View>
                                <View style={{flexDirection: 'row',alignItems:'center',marginLeft:10}}>
                                    <View style={{flexDirection: 'row',alignItems:'center',marginRight:5}}>
                                        <Text style={{width:8,height:2,backgroundColor:'#ccc',borderRadius:1}}></Text>
                                        <Text style={{width:2,height:10,backgroundColor:'#53cd37',borderRadius:1}}></Text>
                                    </View>
                                    <Text style={{fontSize:13,color:'#888',}}>目标值</Text>
                                </View>
                            </View>
                        </View>
                        <View  style={{marginBottom:15}}>
                            <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems:'flex-start',marginLeft:20,height:10}}>
                                <Text style={{color:'#333'}}>总金额</Text>
                                <Text style={{marginRight:20,fontSize:24,color:'#ee842f',marginTop:-10}}>{(jindu1*100).toFixed(2)+'%'}</Text>
                            </View>
                            <View style={{width:screenW-40,marginLeft:20,marginBottom:10,marginTop:15,marginRight:20}}>
                                <View style={{flexDirection:'row',height:2,backgroundColor:'#ccc'}}>
                                    <Text style={{width:(screenW-40)*jindu1,height:2,backgroundColor:'#ee7310'}}></Text>
                                </View>
                                <View style={{width:8,height:8,backgroundColor:'#f76616',borderRadius:8,alignItems:'center',justifyContent:'center',top:-3,position:'absolute',left:(screenW-40)*jindu1-8}}>
                                    <Text style={{width:4,height:4,backgroundColor:'#fff',borderRadius:4,}}></Text>
                                </View>

                                <Text style={{width:2,height:10,backgroundColor:'#53cd37',borderRadius:1,top:-4,position:'absolute',left:screenW-40}}></Text>
                                <Text style={{width:2,height:10,backgroundColor:'#e15151',borderRadius:1,top:-4,position:'absolute',left:(screenW-40)*jindu01}}></Text>
                            </View>
                            <View style={{flexDirection: 'row',alignItems:'flex-start',marginLeft:20,}}>
                                <Text style={{color:'#666'}}>{money1}元/{money}元</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{backgroundColor:'#fff',flexDirection: 'column',marginBottom:10}}>
                        <View style={{flexDirection: 'row',justifyContent:'space-between',alignItems:'center',marginTop:15,marginLeft:20,marginBottom:20,height:15}}>
                            <View style={{flexDirection: 'row',}}>
                                <Image style={{width:16,height:16,marginTop:1}} source={require('../imgs/aim.png')}/>
                                <Text style={{fontSize:13,color:'#333',marginLeft:10,marginRight:10}}>销售目标</Text>
                            </View>
                            <View style={{flexDirection: 'row',alignItems:'center',marginRight:20}}>
                                <View style={{flexDirection: 'row',alignItems:'center'}}>
                                    <View style={{flexDirection: 'row',alignItems:'center',marginRight:5}}>
                                        <Text style={{width:8,height:2,backgroundColor:'#ccc',borderRadius:1}}></Text>
                                        <Text style={{width:2,height:10,backgroundColor:'#e15151',borderRadius:1}}></Text>
                                    </View>
                                    <Text style={{fontSize:13,color:'#888',}}>考核值</Text>
                                </View>
                                <View style={{flexDirection: 'row',alignItems:'center',marginLeft:10}}>
                                    <View style={{flexDirection: 'row',alignItems:'center',marginRight:5}}>
                                        <Text style={{width:8,height:2,backgroundColor:'#ccc',borderRadius:1}}></Text>
                                        <Text style={{width:2,height:10,backgroundColor:'#53cd37',borderRadius:1}}></Text>
                                    </View>
                                    <Text style={{fontSize:13,color:'#888',}}>目标值</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginBottom:20}}>
                            <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems:'flex-start',marginTop:20,marginLeft:20,height:10}}>
                                <Text style={{color:'#333'}}>总销量</Text>
                                <Text style={{marginRight:20,fontSize:24,color:'#ee842f',marginTop:-10}}>{(jindu3*100).toFixed(2)+'%'}</Text>
                            </View>
                            <View style={{width:screenW-40,marginLeft:20,marginBottom:10,marginTop:15,marginRight:20}}>
                                <View style={{height:2,backgroundColor:'#ccc'}}>
                                    <Text style={{width:(screenW-40)*jindu3,height:2,backgroundColor:'#ee7310'}}></Text>
                                </View>
                                <View style={{width:8,height:8,backgroundColor:'#f76616',borderRadius:8,alignItems:'center',justifyContent:'center',top:-3,position:'absolute',left:screenW*jindu3-8}}>
                                    <Text style={{width:4,height:4,backgroundColor:'#fff',borderRadius:4,}}></Text>
                                </View>

                                <Text style={{width:2,height:10,backgroundColor:'#53cd37',borderRadius:1,top:-4,position:'absolute',left:screenW-40}}></Text>
                                <Text style={{width:2,height:10,backgroundColor:'#e15151',borderRadius:1,top:-4,position:'absolute',left:(screenW-40)*jindu03}}></Text>
                            </View>
                            <View style={{flexDirection: 'row',alignItems:'flex-start',marginLeft:20}}>
                                <Text style={{color:'#666'}}>{sell1}单/{sell}单</Text>
                            </View>
                        </View>

                    </View>
                    {this.state.resolve=='' ? <View></View>:
                    <View style={role ?{backgroundColor:'#fff',marginBottom:10}:{display:'none'}}>
                        <View style={[{flexDirection: 'row',height:35,alignItems:'center'},styles.borderBottom]}>
                            <Image style={{width:16,height:16,marginLeft:20}}
                                   source={require('../imgs/fenjie.png')}/>
                            <Text style={{fontSize:13,color:'#333',marginLeft:10}}>分解目标</Text>
                        </View>
                        {resolvelist}
                    </View> }
                </ScrollView>
                {this.state.resolve=='' ? <View style={role ?{backgroundColor:'#e15151',alignItems:'center',justifyContent:'center',height:40}:{display:'none'}}>
                    <Text style={role ?{color:'#fff'}:{display:'none'}}>该目标没有被分解，请继续分解目标</Text>
                </View>:<View></View>}

                <TouchableHighlight underlayColor={'transparent'}
                     onPress={()=>this.resolve(this.state.target_id)}
                     style={role ?{}:{display:'none'}}
                     >
                    <View style={[styles.border_top,styles.border_colorBottom,{flexDirection:'row'}]}>
                        <Image style={{width:16,height:16,marginRight:10}} tintColor={'#e15151'}
                               source={require('../imgs/two.png')}/>
                        <Text style={{color:'#e15151'}}>分解目标</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
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
    border_top:{
        borderTopWidth:1,
    },
    border_colorBottom :{
        borderColor:'#ddd',
        borderBottomWidth:1,
        alignItems:'center',
        height:50,
        borderColor:'#ccc',
        justifyContent:'center',
        paddingLeft:15,
        backgroundColor:'#fff',
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
})
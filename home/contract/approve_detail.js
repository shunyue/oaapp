/*
* 合同审批详情
* */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    TouchableHighlight,
    } from 'react-native';

const screenH = Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

export default class approve_detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
                 launch_time:'',//发起的时间  带时分  签订日期没有时分
                 approve_img:'',//审批状态的图片
                 approve_people:'',//审批人
                 avatar:'',//当前人员的的头像

        };
    }

    componentDidMount() {

        if(this.props.navigation.state.params.approve_status ==1){
            this.setState({
                approve_img:'http://118.178.241.223/oa/approve_status/shenpizhong.png',
            })
        }else if(this.props.navigation.state.params.approve_status ==2){
            this.setState({
                approve_img:'http://118.178.241.223/oa/approve_status/sucss.png',
            })
        }else if(this.props.navigation.state.params.approve_status ==3){
            this.setState({
                approve_img:'http://118.178.241.223/oa/approve_status/error.png',
            })
        }else if(this.props.navigation.state.params.approve_status ==4){
            this.setState({
                approve_img:'http://118.178.241.223/oa/approve_status/cancel.png',
            })
        }
        this.getNet()
    }

    getNet(){
        //通过合同id  查对应的流程 和对应的审批人  其他的合同基本信息是都是通过导航传递过来的
      var url = config.api.base + config.api.contract_emample_processway_detail;
        request.post(url,{
            contract_id: this.props.navigation.state.params.contract_id,//合同id
        }).then((responseText) => {

            if(responseText.sing==1){

                //alert
                this.setState({
                    launch_time:responseText.launch_time,//发起的时间  带时分  签订日期没有时分
                    avatar:responseText.launch_avatar,//登录者的头像
                    approve_people:responseText.approve_people,//审批人
                })
            }else{
                toast.bottom('网络连接失败，请检查网络后重试');
            }

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }


    OpBack() {
        this.props.navigation.goBack(null)
    }


    render() {

           var  list=[];
            if(this.state.approve_people) {
                var approve_status;
                for (var i in this.state.approve_people) {
                   if(this.state.approve_people[i]['time']==null){
                       approve_status='正在审批';
                   }else{
                      if(this.state.approve_people[i]['result']==1){
                          approve_status='拒绝';
                      }else if(this.state.approve_people[i]['result']==2){
                          approve_status='通过';
                      }
                   }

                    list.push(
                        <View key={i}>
                            <View style={[{flexDirection:'row',alignItems:'center',paddingLeft:15}]}>
                                <View
                                    style={{position:'absolute',top:0,width:1,height:15,left:50,backgroundColor:'#bbb'}}></View>
                                <View
                                    style={[{flexDirection:'row',alignItems:'center',paddingLeft:15},styles.padding,]}>
                                    <Image style={{width:40,height:40,marginRight:10,borderRadius:25}}
                                           source={{uri:this.state.approve_people[i]['avatar']}}/>
                                    <View
                                        style={{backgroundColor:'#fff',width:screenW-100,height:45,paddingLeft:15,paddingRight:15,paddingTop:5,borderRadius:5,justifyContent:'space-between',flexDirection:'row',}}>
                                        <View>
                                            <Text style={{color:'#333'}}>{this.state.approve_people[i]['name']}</Text>
                                            <Text style={{marginTop:2,fontSize:12,}}>{approve_status}</Text>
                                        </View>
                                        <Text
                                            style={{marginTop:2,fontSize:12,}}>{this.state.approve_people[i]['time']}</Text>
                                    </View>

                                </View>
                                <View
                                    style={{position:'absolute',bottom:0,width:1,height:15,left:50,backgroundColor:'#bbb',zIndex:0}}></View>
                            </View>
                        </View>
                    )

                }

            }

        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:16}}>{this.props.navigation.state.params.signman_name}的合同</Text>
                </View>


                        <View style={[{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',paddingLeft:15,marginTop:10},styles.padding,styles.borderBottom,styles.borderTop]}>
                            <Image  style={{width:40,height:40,marginRight:5,borderRadius:25}}  source={{uri:this.state.avatar}}/>
                            <View>
                                <Text style={{color:'#333'}}>{this.props.navigation.state.params.signman_name}</Text>
                                <Text style={{marginTop:2,fontSize:12,}}>{this.state.launch_time}</Text>
                            </View>
                        </View>
                        <View style={{position:'absolute',right:20,top:10,zIndex:1000}}>


                            <Image source={{uri:this.state.approve_img}}  style={{width: 100, height: 100}} tintColor={'#37915f'}/>
                        </View>

                <ScrollView>

                        <View  style={[styles.padding,styles.borderBottom,styles.borderTop,{backgroundColor:'#fff',paddingLeft:15,marginTop:10}]}>
                            <Text style={{fontSize:13}}>合同名称</Text>
                            <Text style={{color:'#333'}}>{this.props.navigation.state.params.contract_name}</Text>
                        </View>
                        <View  style={[styles.padding,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,}]}>
                            <Text style={{fontSize:13}}>客户名称</Text>
                            <Text style={{color:'#333'}}>{this.props.navigation.state.params.customer_name}</Text>
                        </View>
                        <View  style={[styles.padding,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,}]}>
                            <Text style={{fontSize:13}}>客户联系人</Text>
                            <Text style={{color:'#333'}}>{this.props.navigation.state.params.customer_linkman_name}</Text>
                        </View>
                        <View  style={[styles.padding,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,}]}>
                            <Text style={{fontSize:13}}>签订日期</Text>
                            <Text style={{color:'#333'}}>{this.props.navigation.state.params.signtime}</Text>
                        </View>
                        <View  style={[styles.padding,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,}]}>
                            <Text style={{fontSize:13}}>签单人</Text>
                            <Text style={{color:'#333'}}>{this.props.navigation.state.params.signman_name}</Text>
                        </View>

                        <View  style={[styles.padding,styles.borderBottom,{backgroundColor:'#fff',paddingLeft:15,}]}>
                            <Text style={{fontSize:13}}>合同金额</Text>
                            <Text style={{color:'#333'}}>{this.props.navigation.state.params.contract_jine}</Text>
                        </View>







                        <View style={[{flexDirection:'row',alignItems:'center',paddingLeft:15}]}>
                            <View style={{position:'absolute',top:0,width:1,height:15,left:50,backgroundColor:'#bbb'}}></View>
                            <View style={[{flexDirection:'row',alignItems:'center',paddingLeft:15},styles.padding,]}>
                                <Image  style={{width:40,height:40,marginRight:10,borderRadius:25}}  source={{uri:this.state.avatar}}/>
                                <View style={{backgroundColor:'#fff',width:screenW-100,height:45,paddingLeft:15,paddingRight:15,paddingTop:5,borderRadius:5,justifyContent:'space-between',flexDirection:'row',}}>
                                    <View>
                                        <Text style={{color:'#333'}}>{this.props.navigation.state.params.signman_name}</Text>
                                        <Text style={{marginTop:2,fontSize:12,}}>发起申请</Text>
                                    </View>
                                    <Text style={{marginTop:2,fontSize:12,}}>{this.state.launch_time}</Text>
                                </View>

                            </View>
                            <View style={{position:'absolute',bottom:0,width:1,height:15,left:50,backgroundColor:'#bbb',zIndex:0}}></View>
                        </View>

                    {list}

                        </ScrollView>


            </View>





        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#ebebeb',
    },
    container: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'center',

    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:15,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },

    back_icon:{
       width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    place:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'

    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    padding:{
        paddingTop:10,
        paddingBottom:10
    },
    padding2:{
        paddingLeft:15,
        paddingRight:15
    },
    flex_row:{
        flexDirection:'row',
        alignItems:'center',
    },
});
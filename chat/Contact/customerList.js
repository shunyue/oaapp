/**
 * Created by Administrator on 2017/6/7.
 * 选择客户
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
    TouchableHighlight,
    DeviceEventEmitter,
    Linking
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';
import com from '../../public/css/css-com';
const screenW = Dimensions.get('window').width;
export default class CustomerList extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            load:true,
            contactInfo:[]
        };
      }
    componentDidMount() {
        this.searchCustomerContact();
        //新建客户联系人之后,接收到接听
      /*  this.customerListener= DeviceEventEmitter.addListener('Customer', (a)=> {
            this.setState({
                load: true
            })
            this.searchCustomerContact();
        });*/
        this.contactListener=DeviceEventEmitter.addListener('cusContact', (a)=> {
             this.setState({
             load: true
             })
         this.searchCustomerContact();
         });
    }
    componentWillUnmount() {
        // 移除监听
      //  this.customerListener.remove();
        this.contactListener.remove();
    }
    OpBack() {
        this.props.navigation.goBack(null)
    }
    //新建客户联系人
    goPage_addContact(){
        alert('新建客户联系人界面');
        let {params}=this.props.navigation.state;
      /*  this.props.navigation.navigate('新建客户联系人',{
            user_id:params.user_id,
            company_id:params.company_id
        })*/
    }
    //客户联系人详情界面
    goPage_ContactInfo(contact){
         let {params}=this.props.navigation.state;
          this.props.navigation.navigate('CusContactDetail',{
            user_id:params.user_id,
            company_id:params.company_id,
            contact:contact
         })
    }
    //搜索客户联系人页面
    goPage_ContactSearch(){
        let {params}=this.props.navigation.state;
        this.props.navigation.navigate('ContactSearch',{
            user_id:params.user_id,
            company_id:params.company_id
        })
    }
    //查询所有的客户联系人
    searchCustomerContact(){
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.searchMyCustomerContacts;
        request.post(url,{
            company_id:params.company_id,
            user_id:params.user_id,
        }).then((res)=>{
            this.setState({
                contactInfo:res.data,
                load: false,
            })
        })
        .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
        });
    }
    //调用打电话接口
    callPhone(number){
        return Linking.openURL('tel:' + number)
    }
    render() {
        if(this.state.load){
            return(
                <View style={[com.hh9,com.jcc,com.aic]}>
                    <Loading/>
                </View>
            )
        }
        //如果查到数据
        var contactArr=[];
        var contactList=[];
        if(this.state.contactInfo!="" && this.state.contactInfo !=null){//输入查询客户
            var  contact=this.state.contactInfo;
            for (var i in contact) {
                var contactArr = [];
                for(var j in contact[i]) {
                    //alert(JSON.stringify(contact[i][j]))
                    contactArr.push(
                        <View  key={j}>
                            <View style={[{width:screenW,height:60,backgroundColor:'#fff',},
                            styles.flex_row,]}>
                                <TouchableHighlight
                                    underlayColor={'#ccc'}
                                    onPress={this.goPage_ContactInfo.bind(this,contact[i][j])}>
                                    <View style={[styles.borderBottom,styles.borderTop,{width:screenW,height:60,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',paddingLeft:15}]}>
                                        <View>
                                            <Text style={{color:'#333'}}>{contact[i][j].con_name}</Text>
                                            <Text style={{marginTop:2,fontSize:12}}>{contact[i][j].cus_name}</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <View style={{position:'absolute',top:20,right:15}}>
                                    <TouchableHighlight underlayColor={'#fff'}
                                                        onPress={this.callPhone.bind(this,contact[i][j].tel)}>
                                        <Image style={{width:20,height:20,tintColor:'#e15151'}}
                                               source={require('../../imgs/customer/phone.png')}/>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    );
                }
                contactList.push(
                    <View key={i}>
                        <View style={styles.departLevel}>
                            <Text style={styles.departText}>{contact[i][0].first_char}</Text>
                        </View>
                        {contactArr}
                    </View>
                )
            }
        }else{//输入查询数据
            contactList.push(
                <View key={0}>
                    <Text style={{fontSize: 16,textAlign:'center'}}>没有记录</Text>
                </View>
            );
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>客户联系人</Text>
                    <TouchableOpacity style={[styles.goRight,styles.go]} onPress={()=>this.goPage_addContact()}>
                        <Image  style={{width:24,height:24}}
                                source={require('../../imgs/customer/add_contact.png')}/>
                    </TouchableOpacity>
                </View>

                     <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.goPage_ContactSearch()}}>
                     <View style={[styles.search,styles.margin,styles.flex_row]}>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                        <Text>搜索</Text>
                    </View>
                     </TouchableHighlight>
                    {/*  <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.goPage_UserSearch()}}>
                        <View style={[styles.search,styles.margin,styles.flex_row]}>
                            <Image style={{width:15,height:15,marginRight:7}} source={require('../imgs/customer/search.png')}/>
                            <Text>搜索</Text>
                        </View>
                    </TouchableHighlight>*/}
                <ScrollView>
                    {contactList}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
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
        left:20,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },
    back_icon:{
        width:10,
        height:17,
        marginLeft:5,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    sure:{
        fontSize:16
    },
    search:{
        width:screenW*0.95,
        height:30,
        backgroundColor:'#fff',
        justifyContent:'center',
        margin:screenW*0.02,
        borderRadius:7,
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:25,
        height:25,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.7,
        height:28,
        padding:0,
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'
    },
    flex_row :{
        flexDirection:'row',
        alignItems:'center',
    },
    departLevel: {
        flexDirection: 'row',
        alignItems: 'center',
        padding:3,
        paddingLeft: 6,

    },

});
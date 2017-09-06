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
export default class ContactSearch extends Component {
    back() {
        this.props.navigation.goBack(null);
    }
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            value: false,
            text: '',
            search: "",
            contactInfo: []
        };
    }
    //搜索人员
    searchPerson(search){//由姓名搜索人员
        let {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchContact;
        request.post(url, {
            user_id:params.user_id,
            company_id:params.company_id,//(人员的id,从缓存文件中获取)
            search: search
        }).then((res)=> {
            this.setState({
                contactInfo: res.data
            })
        })
         .catch((error)=> {
             toast.bottom('网络连接失败,请检查网络后重试')
         });
    }
    goPage_PersonalInfo(contact){
        let {params}=this.props.navigation.state;
        this.props.navigation.navigate('CusContactDetail',{
            user_id:params.user_id,
            company_id:params.company_id,
            contact:contact
        })
    }
    render() {
        {/*  <TouchableHighlight
         underlayColor={'#F3F3F3'}
         onPress={this.goPage_PersonalInfo.bind(this,user[i])}
         key={i}>
         <View style={[com.bgcfff,com.row,com.mg5,com.pdb5,com.bbweb]}>
         {(user[i].avatar == "" || user[i].avatar == null) ? (
         <Image style={[com.wh32,com.mgr10,com.tcp]}
         source={require('../../imgs/tx.png')}/>
         ) : (<Image style={[com.wh32,com.br200,com.mgr10]} source={{uri:user[i].avatar}}/>)}
         <View>
         <Text style={[com.cr]}>{user[i].name}</Text>
         <Text style={[com.fs10,com.ceb]}>{user[i].depart_name}</Text>
         </View>
         </View>
         </TouchableHighlight>*/}
        //如果查到数据
        var contactArr = [];
        if (this.state.contactInfo != "" && this.state.contactInfo != null) {
            var contact = this.state.contactInfo;
            for (var i = 0; i < contact.length; i++) {
                contactArr.push(
                    <TouchableHighlight
                        underlayColor={'#ccc'}
                        onPress={this.goPage_PersonalInfo.bind(this,contact[i])}
                        key={i}>
                        <View style={[{width:screenW,flexDirection:'row',padding:5,marginLeft:10,marginRight:10, borderBottomWidth:0.5,
        borderColor:'#ccc'}]}>
                            {/*<Image  style={{width:40,height:40,marginLeft:10,marginRight:10}}
                             source={require('../imgs/customer/headPortrait.png')}/>*/}
                            <View>
                                <Text style={{color:'#333'}}>{contact[i].con_name}</Text>
                                <Text style={{marginTop:2,fontSize:12}}>{contact[i].cus_name}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
            }
        }else{
            contactArr.push(
                <View key={0}><Text>没有记录</Text></View>
            );
        }
        return (
            <View style={[com.flex]}>
                <View style={[com.bckfff,com.row,com.aic,com.pdt5l10,com.bbwe9,]}>
                   <View style={[com.ROW,com.AIC,com.bcke6,com.PD5,com.BR,com.mgr10]}>
                        <Image
                            style={[com.wh16,]} source={require('../../imgs/search.png')}/>
                        <TextInput
                            style={[com.FS12,com.PDB0,com.PDT0,{height: 19,width:screenW*0.75,}]}
                            underlineColorAndroid={'transparent'}
                            placeholder='搜索客户联系人'
                            placeholderTextColor='#bebebe'
                            secureTextEntry={false}
                            onChangeText={(search) =>{this.setState({search});this.searchPerson(search)}}
                            value={this.state.search}
                            />
                    </View>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#fff"
                        >
                        <Text style={[com.cbe]}>取消</Text>
                    </TouchableHighlight>
                </View>
                {/*内容主题*/}
                {this.state.search == "" ? (
                    <View style={[com.aic,com.hh9]}>
                        <View style={[com.row,com.mgb15,{marginTop:50}]}>
                            <Text style={[com.cbe,com.ft5]}>______</Text>
                            <Text style={[com.cbe,com.mglr15]}>搜索内容</Text>
                            <Text style={[com.cbe,com.ft5]}>______</Text>
                        </View>
                        <View style={[com.row,com.ww5,com.aic,com.jcc]}>
                            <View style={[com.aic,com.mglr15]}>
                                <Image style={[com.wh32,com.tcccc]} source={require('../../imgs/yg.png')}/>
                                <Text>联系人</Text>
                            </View>
                            <View style={[com.aic,com.mglr10]}>
                                <Image style={[com.wh32,com.tcccc]} source={require('../../imgs/telephone.png')}/>
                                <Text>电话</Text>
                            </View>
                        </View>
                    </View>) : ( <View style={[com.ww]}>
                        <View style={[com.bbwc,com.pdb10]}>
                            <View style={[com.bgcfff]}>
                                    {contactArr}
                            </View>
                      </View>
                </View>)}
            </View>
        );
    }
}



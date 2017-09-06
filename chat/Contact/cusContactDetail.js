/**
 * Created by Administrator on 2017/6/7.
 * 商机列表信息详情页
 * 子页面在customer/addContent 中
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Modal,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    DeviceEventEmitter,
    Linking
    } from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import com from '../../public/css/css-com';
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
export default class CusContactDetail extends Component {
    OpBack() {
        DeviceEventEmitter.emit('cusContact',{
            cusContact:1
        });
        this.props.navigation.goBack(null)
    }
    constructor(props) {
        super(props);
        let {params}=this.props.navigation.state;
        this.state = {
            handle:false,
            con_name:params.contact.con_name,
            cus_name:params.contact.cus_name,
            tel: params.contact.tel,
            email: params.contact.email,
            department: params.contact.department,
            position: params.contact.position
        };
    }
    componentDidMount() {
        this._listenter = DeviceEventEmitter.addListener('editCusContact',(data)=>{
            this.setState({
                con_name: data.contact.con_name,
                tel: data.contact.tel,
                email: data.contact.email,
                department:data.contact.department,
                position: data.contact.position
            })
        })
    }
    componentWillUnmount() {
        this._listenter.remove();
    }

    delCusContact(){
        let {params}=this.props.navigation.state;
        this.setState({handle:!this.state.handle});
        Alert.alert(
            '温馨提示',
            '确认删除该客户?',
            [
                {text: '取消', onPress: () =>{}},
                {text: '确定', onPress: () => {
                    this.delContact()
                }},
            ]
        )
    }
    //删除客户联系人
    delContact(){
        this.setState({
            handle:false,
            load: true
        })
        let {params}=this.props.navigation.state;
        var url = config.api.base + config.api.delMyCustomerContact;
        request.post(url, {
          id:params.contact.id
        }).then((res)=> {
           if(res.status==1){//如果删除成功
               this.setState({
                   load: false
               })
              toast.center(res.message);
               DeviceEventEmitter.emit('cusContact',{
                   cusContact:1
               }); //发监听
               this.OpBack();
           }else{
               toast.bottom(res.message);
               return false;
           }
        })
        .catch((error)=> {
                toast.bottom('网络连接失败,请检查网络后重试')
        });
    }
    //修改客户联系人信息
    editCusContact(){
        let {params}=this.props.navigation.state;
        this.setState({
            handle:false,
        })
        this.props.navigation.navigate('EditCusContact',{
            contact:params.contact,
            user_id:params.user_id,
            company_id:params.company_id})
    }
    //调用打电话接口
    callPhone(number){
        return Linking.openURL('tel:' + number)
    }
    render() {
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <View style={[styles.header,{justifyContent:'space-between',backgroundColor:'#e15151',paddingLeft:15,paddingRight:15}]}>
                        <TouchableHighlight underlayColor={'transparent'} style={styles.goback} onPress={()=>this.OpBack()}>
                            <View style={{ flexDirection :'row',alignItems:'center'}}>
                                <Image  style={styles.back_icon} tintColor={'#fff'} source={require('../../imgs/customer/back.png')}/>
                                <Text style={styles.back_text}>返回</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={styles.back_text}>个人资料</Text>
                        <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.setState({handle:!this.state.handle})}}>
                            <Text style={styles.back_text}>更多</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{paddingLeft:15,marginTop:10}}>
                        <Text style={{fontSize:17,color:'#fff'}}>{this.state.con_name}</Text>
                        <Text style={{marginTop:2,color:'#fff'}}>{this.state.cus_name}</Text>
                    </View>
                </View>
                <ScrollView>
                        <View style={[styles.place2, styles.borderBottom,{backgroundColor:'#fff',height:50,paddingLeft:15,paddingRight:15}]}>
                            <View style={[styles.place]}>
                                <Text>移动电话</Text>
                                <Text style={{color:'#000',}}>{this.state.tel}</Text>
                            </View>
                            <TouchableWithoutFeedback
                                           onPress={()=>{this.callPhone(this.state.tel)}}>
                                <Image style={{width:20,height:20}} tintColor={'#e15151'} source={require('../../imgs/customer/phone.png')}/>
                            </TouchableWithoutFeedback>
                        </View>
                    {this.state.email==null?(null):(<View style={[styles.place2, styles.borderBottom,{backgroundColor:'#fff',height:50,paddingLeft:15,paddingRight:15}]}>
                        <View style={[styles.place]}>
                            <Text>邮箱</Text>
                            <Text style={{color:'#000',}}>{this.state.email}</Text>
                        </View>
                    </View>)}
                    {this.state.department==null?(null):(<View style={[styles.place2, styles.borderBottom,{backgroundColor:'#fff',height:50,paddingLeft:15,paddingRight:15}]}>
                        <View style={[styles.place]}>
                            <Text>部门</Text>
                            <Text style={{color:'#000',}}>{this.state.department}</Text>
                        </View>
                    </View>)}
                    {this.state.position==null?(null):(<View style={[styles.place2, styles.borderBottom,{backgroundColor:'#fff',height:50,paddingLeft:15,paddingRight:15}]}>
                        <View style={[styles.place]}>
                            <Text>职位</Text>
                            <Text style={{color:'#000',}}>{this.state.position}</Text>
                        </View>
                    </View>)}
                </ScrollView>

                {/* 添加模型 头部右侧 商机调整  */}
                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.handle}
                        onRequestClose={() => {this.setState({handle: !this.state.handle})}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setState({handle: !this.state.handle})
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer2}>
                            <View style={[styles.addCustomer_card22,{height:120}]}>
                                <View style={styles.customerCard_content22}>
                                    <TouchableHighlight underlayColor={'transparent'} onPress={() =>{this.editCusContact()}}>
                                        <Text style={{color:'#333'}}>编辑</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.customerCard_content22}>
                                    <TouchableHighlight underlayColor={'transparent'} onPress={() => {this.delCusContact()}}>
                                        <Text style={{color:'#333'}}>删除</Text>
                                    </TouchableHighlight>
                                </View>
                                <View  style={[styles.customerCard_content22,styles.customerCard_content23]}>
                                    <TouchableHighlight underlayColor={'transparent'} onPress={() => {this.setState({handle:false})}}>
                                        <Text  style={{color:'#333'}}>取消</Text>
                                    </TouchableHighlight>
                                </View>
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
        backgroundColor: '#eaeaea',
    },
    container: {
        height: 115,
        backgroundColor:'#e15151',
    },
    header:{
        width:screenW,
        height:40,
        flexDirection :'row',
        alignItems:'center',
    },
    goback:{
        flexDirection :'row',
        alignItems:'center',
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 1
    },
    back_text:{
        color:'#fff',
        fontSize: 16,
        marginLeft:6
    },
    place:{
        justifyContent:'center',
    },
    place2:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    addCustomer2:{
        flex:1,
        position:'absolute',
        top:screenH*0.5-120,
    },
    addCustomer_card22:{
        width:screenW*0.8,
        height:120,
        backgroundColor:'#fff',
        marginLeft:screenW*0.1,
        borderRadius:4
    },
    customerCard_content22:{
        justifyContent:'center',
        alignItems:'center',
        height:40,
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
    },
    customerCard_content23:{
        borderBottomWidth:0,
    },
});
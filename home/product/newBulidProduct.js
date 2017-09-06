/*
* 新增产品
* */

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
    ListView,
    Alert,
    TextInput,
    DeviceEventEmitter,
    Picker,
} from 'react-native';
const screenW = Dimensions.get('window').width;

import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import CustomPicker from '../../common/customPicker';

export default class newBulidProduct extends Component {


    constructor(props) {
        super(props);
        this.state = { name: '' };
        this.state = { price: '' };
        this.state = { standard: '' };
        this.state = { descrpt: '' };
        this.state = { type_text: '' };//单选框的text值   类型
        this.state = { type_value: '' };//单选框的value值 类型
        this.state = { selectedValue: '' };// 状态
    }



    //接收产品类型列表选择的 类型
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('producttype',(value) => {
                 //接收的类型的id查类型的名称
            this.setState({
                type_value:value
            })
            var url = config.api.base + config.api.producttypebyid;
            request.post(url,{
                id: value,
            }).then((responseJson) => {
               // Alert.alert(JSON. stringify(responseJson));
                this.setState({
                    type_text:responseJson
                })
            }).catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            })
        })
    }
    componentWillUnmount() {
        // 移除
        this.subscription.remove();
    }
    //接收产品类型列表选择的 类型



    back() {
        this.props.navigation.goBack(null);
    }
    typelist() {
        this.props.navigation.navigate('Producttypelist',{company_id:this.props.navigation.state.params.company_id});
    }


    //点击确认按钮
    addproduct() {

        //默认状态是已启用 piker不操作是 selectedValue为空
        if(this.state.selectedValue==''){
            var status_value=1;
        }else{
            var status_value=this.state.selectedValue;
        }
        var url = config.api.base + config.api.productadd;
        request.post(url,{
                    name: this.state.name,//名称
                    price: this.state.price,//价格
                    standard: this.state.standard,//规格
                    descrpt: this.state.descrpt,//描述
                    type: this.state.type_value,//类型
                    status: status_value,//状态
                    company_id:this.props.navigation.state.params.company_id,//公司id
        }).then((responseJson) => {

            if(responseJson.sing==3){
                toast.center('产品名称重复');
            }
            if(responseJson.sing==0){
                toast.center('请填写完整的产品信息');
            }
            if(responseJson.sing==1){
                toast.center('添加成功');
                DeviceEventEmitter.emit('company_id', this.props.navigation.state.params.company_id);
                this.props.navigation.goBack(null);
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    };
    //点击确认按钮

    render() {
        return (
            <View style={styles.body}>
                {/*导航栏*/}
                <View style={styles.nav}>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Image source={require('../../imgs/navxy.png')}/>
                            <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
                        </View>

                    </TouchableHighlight>
                    <Text style={styles.fSelf}>新增产品</Text>
                    <TouchableHighlight
                        onPress={()=>this.addproduct()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Text  onPress={this.addproduct.bind(this)} style={styles.navFont}>确定</Text>
                        </View>

                    </TouchableHighlight>
                </View>
                {/*内容主题*/}
                <ScrollView style={styles.childContent}>
                    <View style={[styles.ancestorCon]}>

                        <View style={[styles.divCom]}>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>产品名称</Text>


                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(name) => this.setState({name})}
                                    placeholder="请填写产品名称"
                                />


                            </View>



                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>产品规格</Text>


                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(standard) => this.setState({standard})}
                                    placeholder="请填写产品规格"
                                />


                            </View>


                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>产品价格</Text>


                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(price) => this.setState({price})}
                                    placeholder="请填写产品价格"
                                />


                            </View>



                            <TouchableHighlight
                                onPress={()=>this.typelist()}
                                underlayColor="#d5d5d5"
                            >

                            <View style={[styles.divRowCom,styles.divRowSelfBottomBorder]}>
                                <Text style={[styles.divFontCom]}>产品分类</Text>
                                <View>
                                    <TextInput
                                        style={styles.inputStyle}
                                        underlineColorAndroid={'transparent'}
                                        editable={false}

                                        onChangeText={(type) => this.setState({type})}
                                        placeholder="请选择产品分类"
                                        value={this.state.type_text}
                                    />
                                </View>

                                <Image style={styles.imgStyle} source={require('../../imgs/customer/arrow_r.png')}/>
                            </View>

                            </TouchableHighlight>




                            <View style={[styles.divRowCom]}>
                                <Text style={[styles.divFontCom]}>状         态</Text>
                            <CustomPicker isVisible={false}
                                          title="请选择"
                                          tipValue="已启用"
                                          pickerData={[{name: '已启用',value: '1'},

                                              {name: '未启用',value: '0'},]}
                                          onClick={(e)=>this.setState({selectedValue: e})}/>
                            </View>




                            <View style={[styles.divRowSelf,styles.divRowSelfBottomBorder]}>
                                <Text style={[styles.divFontCom]}>产品描述</Text>
                                <TextInput
                                    style={styles.inputStyle}
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(descrpt) => this.setState({descrpt})}
                                    placeholder="请填写产品描述"
                                />
                            </View>


                        </View>
                    </View>
                </ScrollView>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    //nav
    navltys: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: (Platform.OS === 'ios') ? 50 : 30,
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
    body: {//祖先级容器
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    nav: {//头部导航
        height: 40,
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
    navltysImg: {
        width: 24,
        height: 24,
    },
//    主题内容
    childContent: {//子容器页面级
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#F8F8F8',
    },

    //页签切换
    ancestorCon: {//祖先级
        //flex: 1,
    },
    divTit: {//祖级--区域-主题内容title部分
        flexDirection: 'row',
        //justifyContent: 'space-around',
        height: 30,
        paddingTop: 5,
        marginBottom: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleCon: {//父级-块
        width: screenW * 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#a4a4a4',
    },
    eleFontCon: {//子级-字体
        fontSize: 12,
    },
    eleSelf: {//私有级
        borderRightWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleImgCon: {//子级-图片
        marginRight: 5,
    },

    //内容模块
    divCom: {//祖先级-区域
        flex:1,
    },
    rowCom: {//祖级-行
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#F1F2F3',
    },

    eleTopCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:5
    },
    comLeft:{//次父级-次级块

    },
    comRight:{//次父级-次级块

    },
    elefontCom:{//子级-E
        fontSize:10,
        color:'#969696',
    },


    eleBottomCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },
    navltysImgSelf:{//子级-E-图片-文件夹
        width:14,
        height:14,
    },


//    内容区域
    divRowCom:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 40,
        flex:1,
        flexDirection:'row',
        alignItems: 'center'
    },
    divFontCom:{//子级-E
        color:'#939393',
    },
    divRowSelf:{//私有级
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
    },
    divFontSelf:{//私有级
        marginTop:10
    },
    divRowSelfBottomBorder:{
        borderBottomWidth:1,
        borderBottomColor:'#E9E9E9',
    },
    inputStyle: {
        width:screenW*0.6,
        fontSize:12,
        color:"#eee",
        marginLeft:screenW*0.05,
    },

    imgStyle: {
        height: 16,
        width: 16,
        marginLeft:20,
        tintColor: '#A8A8A8'
    },
});

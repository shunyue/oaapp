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
    DeviceEventEmitter,

} from 'react-native';
const screenW = Dimensions.get('window').width;

import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'


export default class Producttypelist extends Component {


    //查询产品类型列表
    constructor(props) {
        super(props);
        this.state = { select_value: '' };
        this.state = {
            load:false,
        };
    }

    //耗时操作放在这里面
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('company_id',(value) => {


                var url = config.api.base + config.api.producttypelist;
                request.post(url,{
                    company_id: value,//公司id
                }).then((responseText) => {

                    if(responseText.sing==1){
                        this.setState({
                            load: true,
                            productType: responseText.list,
                        })
                    }

                }).catch((error)=>{
                    toast.bottom('网络连接失败，请检查网络后重试');
                })




        })

        this.getNet();

    }

    getNet(){
        var url = config.api.base + config.api.producttypelist;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
        }).then((responseText) => {
            if(responseText.sing==1){
                this.setState({
                    load: true,
                    productType: responseText.list,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    //查询产品类型列表


    back() {
        this.props.navigation.goBack(null);
    }

    //选中时设置属性
    onSelect(index, value){
       this.setState({
           select_value:`${value}`
       });
    }

    //点击确认 将类型传递上一页面
    back1() {
        DeviceEventEmitter.emit('producttype', this.state.select_value);
        this.props.navigation.goBack(null);
    }

    //新增类型
    typeadd() {
        this.props.navigation.navigate('NewBulidProducttype',{company_id:this.props.navigation.state.params.company_id});
    }

    render() {

        //for 遍历
        var productType = this.state.productType;
        var list =[];
        for(var i in productType) {
            list.push(
            <RadioButton value={productType[i].id} key={i}>
                <Text>{productType[i].type_name}</Text>
            </RadioButton>
            )
        }
        //for 遍历


        //有数据
        if(this.state.load){

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
                        <Text style={styles.fSelf}>选择分类</Text>
                        <TouchableHighlight
                            onPress={()=>this.typeadd()}
                            underlayColor="#d5d5d5"
                        >
                            <View style={styles.navltys}>
                                <Text>添加分类 </Text>
                            </View>

                        </TouchableHighlight>
                    </View>
                    {/*内容主题*/}
                    <ScrollView style={styles.childContent}>
                        <View style={[styles.ancestorCon]}>

                            {/*内容主题*/}
                            <View style={[styles.divCom]}>


                            <View>

                             <TouchableHighlight >
                            <View  style={[styles.rowCom]}>
                                <View style={[styles.eleTopCom]}>

                                    <View style={[styles.comRight]}>

                                       <RadioGroup onSelect = {(index, value) => this.onSelect(index, value)}>
                                           {list}
                                      </RadioGroup>

                                    </View>
                                </View>
                            </View>
                           </TouchableHighlight>


                            </View>



                            </View>
                        </View>
                    </ScrollView>

                    <View style={[styles.ancestorCon]}>
                        <View  style={[styles.submit]}>
                            <Text>选择一个分类</Text>
                            <TouchableHighlight style={{
                            width:50,
                            height:30,
                            backgroundColor:'#e15151',
                            borderRadius:4,
                            justifyContent:'center',
                            alignItems:'center',
                            }}
                            onPress={() =>this.back1()}>
                                <Text style={{color:"#fff"}}>确定</Text>
                            </TouchableHighlight>

                        </View>
                    </View>

                </View>
            )


            //没有数据
        } else{
            return(

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
                        <Text style={styles.fSelf}>选择分类</Text>
                        <TouchableHighlight
                            onPress={()=>this.typeadd()}
                            underlayColor="#d5d5d5"
                        >
                            <View style={styles.navltys}>
                                <Image style={[styles.navltysImg]} source={require('../../imgs/navtx.png')}/>
                            </View>

                        </TouchableHighlight>
                    </View>
                    {/*内容主题*/}
                    <ScrollView style={styles.childContent}>
                        <View style={[styles.ancestorCon]}>


                            <View style={[styles.divCom]}>

                                <Text>暂无数据</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }

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

    submit:{
        flexDirection:'row',
        backgroundColor:'#fff',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingLeft:20,
        paddingRight:20,
        height:50,
    },

});

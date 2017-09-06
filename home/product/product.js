/*
* 产品列表
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
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native';

import Modal from 'react-native-modal'
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';
const screenW = Dimensions.get('window').width;

export default class Product extends Component {
    //查询产品列表
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {r1 !== r2}});
        this.state = {
            dataSource: ds,
            load:false,

        };
    }



    //耗时操作放在这里面
    componentDidMount(){

        this.subscription = DeviceEventEmitter.addListener('company_id',(value) => {

                var url = config.api.base + config.api.productlist;
                request.post(url,{
                    company_id: value,//公司id
                }).then((responseText) => {
                    if(responseText.sing==1){
                        this.setState({
                            load: true,
                            dataSource: this.state.dataSource.cloneWithRows(responseText.list),
                        })
                    }
                }).catch((error)=>{
                    toast.bottom('网络连接失败，请检查网络后重试');
                })
        })

        this.getNet();

    }

    getNet(){

        var url = config.api.base + config.api.productlist;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
        }).then((responseText) => {

            if(responseText.sing==1){
                this.setState({
                    load: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseText.list),
                })
            }


        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }
    //查询产品列表



    back() {
        this.props.navigation.goBack(null);
    }

    //添加产品
    newBulidBusiness() {
        this.props.navigation.navigate('NewBulidProduct',{company_id:this.props.navigation.state.params.company_id})
    }
     //搜索
    leftSliderDown() {
        this.props.navigation.navigate('Productsearch')
    }


    render() {
        const { navigate } = this.props.navigation;


        //有数据
        if(!this.state.load){
            return (<Loading/>);
        }


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
                    <Text style={styles.fSelf}>产品列表</Text>
                    <TouchableHighlight
                        onPress={()=>this.newBulidBusiness()}
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
                        {/*页签区域*/}
                        <View style={[styles.divTit,styles.divCon]}>

                            <TouchableHighlight
                                onPress={()=>this.leftSliderDown()}
                                underlayColor="#d5d5d5"
                            >
                                <View style={[styles.eleCon]}>
                                    <View style={[styles.eleCon]}>
                                        <Image style={[styles.eleImgCon]} source={require('../../imgs/product/ss16.png')}/>
                                        <Text style={[styles.eleFontCon]}>搜索</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                        {/*内容主题*/}
                        <View style={[styles.divCom]}>




                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={(rowData)=>
                            <View>

                             <TouchableHighlight  onPress={() => navigate('ProductDetail', { id: rowData.id,company_id:this.props.navigation.state.params.company_id})}>
                            <View  style={[styles.rowCom]}>
                                <View style={[styles.eleTopCom]}>
                                    <View style={[styles.comLeft]}>
                                        <Text>{rowData.product_name}</Text>
                                    </View>
                                    <View style={[styles.comRight]}>
                                        <Text style={[styles.elefontCom]}>{rowData.type_name}</Text>
                                          <Text style={[styles.elefontCom1]}>{rowData.product_status==1?'已启用':'未启用'}</Text>
                                    </View>


                                </View>
                            </View>
                           </TouchableHighlight>


                            </View>}
                            />

                        </View>
                    </View>
                </ScrollView>


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
                        <Text style={styles.fSelf}>产品列表</Text>
                        <TouchableHighlight
                            onPress={()=>this.newBulidBusiness()}
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
                            {/*页签区域*/}
                            <View style={[styles.divTit,styles.divCon]}>
                                <TouchableHighlight
                                    onPress={() => { this.setState({isModalVisible: !this.state.isModalVisible})}}
                                    underlayColor="#d5d5d5"
                                >
                                    <View style={[styles.eleCon,styles.eleSelf]}>
                                        <View style={[styles.eleCon]}>
                                            <Image style={[styles.eleImgCon]} source={require('../../imgs/product/fl16.png')}/>
                                            <Text style={[styles.eleFontCon]}>分类</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={()=>this.leftSliderDown()}
                                    underlayColor="#d5d5d5"
                                >
                                    <View style={[styles.eleCon]}>
                                        <View style={[styles.eleCon]}>
                                            <Image style={[styles.eleImgCon]} source={require('../../imgs/product/ss16.png')}/>
                                            <Text style={[styles.eleFontCon]}>搜索</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            {/*内容主题*/}
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
        width: screenW * 0.9,
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

    elefontCom1:{//子级-E
        fontSize:10,
        color:'#969696',
        marginTop:10,
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

    //分类模型下拉
    model_up:{
        width:screenW,
        height:130,
        position: 'absolute',
        left:0,
        top:75,
        backgroundColor:'#fff'
    },

});

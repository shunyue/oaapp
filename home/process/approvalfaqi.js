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
    TouchableOpacity,
} from 'react-native';



import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

const screenW = Dimensions.get('window').width;
export default class Approvalfaqi extends Component {



    //查询所有表单
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {r1 !== r2}});
        this.state = {
            dataSource: ds,
            load:false,
            isModalVisible: false//下拉选择分类

        };
    }

    //下拉选择分类
    _showModal(visible) {
        this.setState({isModalVisible: visible});
    }


    //耗时操作放在这里面
    componentDidMount(){
        this.getNet();
    }

    getNet(){
        var url = config.api.base + config.api.selectform;
        request.get(url)
            .then((responseText)=>{
                //Alert.alert(JSON. stringify(responseText));
                this.setState({
                    load: true,
                    dataSource: this.state.dataSource.cloneWithRows(responseText),
                                })

            }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        }).done();
    }




    back() {
        this.props.navigation.goBack(null);
    }

    //添加模板
    newBulidForm() {
        this.props.navigation.navigate('NewBulidForm')
    }



    render() {

        const { navigate } = this.props.navigation;

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
                    <Text style={styles.fSelf}>选择模板</Text>
                    <TouchableHighlight
                        onPress={()=>this.newBulidForm()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                           <Text>添加模板</Text>
                        </View>

                    </TouchableHighlight>
                </View>
                {/*内容主题*/}
                <ScrollView style={styles.childContent}>
                    <View style={[styles.ancestorCon]}>

                        {/*内容主题*/}
                        <View style={[styles.divCom]}>




                            <ListView
                                enableEmptySections={true}
                                dataSource={this.state.dataSource}
                                renderRow={(rowData)=>
                            <View>

                             <TouchableHighlight  onPress={() => navigate('formDetail', { id: rowData.id,formname:rowData.name})}>
                            <View  style={[styles.rowCom]}>
                                <View style={[styles.eleTopCom]}>

                                   <View>
                                      <Image style={{width:40,height:40}}  source={{uri:rowData.icon}}/>
                                    </View>

                                    <View  style={{marginLeft:10}}>
                                        <Text>{rowData.name}</Text>
                                        <Text style={[styles.elefontCom]}>{rowData.describe}</Text>
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
                        <Text style={styles.fSelf}>选择模板</Text>
                        <TouchableHighlight
                            onPress={()=>this.newBulidForm()}
                            underlayColor="#d5d5d5"
                        >
                            <View style={styles.navltys}>
                                <Text>添加模板</Text>
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
        paddingTop:6,
        paddingBottom:6,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#F1F2F3',
    },

    eleTopCom: {//父级-块
        flexDirection: 'row',
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

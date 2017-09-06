/*
* 产品搜索
* */
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    ListView,
    TouchableHighlight,
    ScrollView,
} from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";

import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import Loading from '../../common/loading';


const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {
    OpBack() {
        this.props.navigation.goBack(null)
    }
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {r1 !== r2}});
        this.state = { text: '搜索产品',
                        dataSource: ds,
                        load:false,
                        load1:true,

        };
    }


    //查询产品列表

    //耗时操作放在这里面
    submmit(){

        this.setState({
            load1:false
        });

        var url = config.api.base + config.api.product_search;
        request.post(url,{
            search:this.state.text,
        }).then((responseText)=>{

                 if(responseText.sing==1){

                     this.setState({
                         load: true,
                         load1: true,
                         dataSource: this.state.dataSource.cloneWithRows(responseText.list),
                     })


                 }else{
                     toast.center('没有搜到产品');
                 }
            }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        }).done();
    }
    //查询产品列表




    render(){
        const { navigate } = this.props.navigation;

        if(!this.state.load1){
            return(<Loading/>)
        }

        if(this.state.load){
            return (
                <View style={styles.container}>
                    <View style={styles.search_bj}>
                        <TouchableOpacity onPress={()=>this.OpBack()}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        </TouchableOpacity>
                        <View style={styles.search_border}>
                            <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(text) => this.setState({text})}
                                placeholder ={this.state.text}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <TouchableOpacity style={styles.sure}>
                            <Text style={{color:'#fff'}} onPress={()=>this.submmit()}>确定</Text>
                        </TouchableOpacity>

                    </View>


                    <ScrollView style={styles.childContent}>
                        <View style={[styles.ancestorCon]}>
                            {/*页签区域*/}
                            <View style={[styles.divTit,styles.divCon]}>


                            </View>
                            {/*内容主题*/}
                            <View style={[styles.divCom]}>




                                <ListView
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData)=>
                            <View>

                             <TouchableHighlight  onPress={() => navigate('ProductDetail', { id: rowData.id})}>
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
            );

        }else{

            return (
                <View style={styles.container}>
                    <View style={styles.search_bj}>
                        <TouchableOpacity onPress={()=>this.OpBack()}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        </TouchableOpacity>
                        <View style={styles.search_border}>
                            <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(text) => this.setState({text})}
                                placeholder ={this.state.text}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <TouchableOpacity style={styles.sure}>
                            <Text style={{color:'#fff'}} onPress={()=>this.submmit()}>确定</Text>
                        </TouchableOpacity>

                    </View>
                    <View>

                    </View>
                    <View style={styles.product_foot}>
                        <View style={{flexDirection:'row',}}>
                            <Text style={styles.line}></Text>
                            <Text style={{marginLeft:10,marginRight:10,color:'#aaa'}}>搜索更多内容</Text>
                            <Text style={styles.line}></Text>
                        </View>
                        <View style={{marginTop:10}}>
                            <Image style={styles.subNav_img2} source={require('../../imgs/product/chanpin.png')}/>
                        </View>
                    </View>
                </View>
            );
        }


    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    search_bj:{
        height:40,
        backgroundColor:'#fff',
        width:screenW,
        flexDirection:'row',
        alignItems:'center',
        borderColor:'#a5a5a5',
        borderBottomWidth:1
    },
    search_border:{
        width:screenW*0.68,
        height:28,
        backgroundColor:'#eee',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
    },
    subNav_img:{
        width:15,
        height:15,
        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:30,
        height:30,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.59,
        height:24,
        padding:0
    },

    back_icon:{
        width:10,
        height:17,
        marginLeft:15,
        marginRight:15
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    sure: {
        width:50,
        height:26,
        justifyContent:'center',
        marginLeft:16,
        backgroundColor:'#e15151',
        borderRadius:4,
        alignItems:'center',
    },
    product_foot:{
        width:screenW,
        justifyContent:'center',
        alignItems:'center',
        marginTop:40,
    },
    line:{
      height:1,
        width:40,
        borderWidth:0.5,
        borderColor:'#aaa',
        marginTop:10,
    },


    rowCom: {//祖级-行
        marginTop:4,
        marginBottom:4,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
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

    elefontCom:{//子级-E
        fontSize:10,
        color:'#969696',
    },

    elefontCom1:{//子级-E
        fontSize:10,
        color:'#969696',
        marginTop:10,
    },




});

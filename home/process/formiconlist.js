import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import Swiper from 'react-native-swiper';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {
    OpBack() {
        this.props.navigation.goBack(null)
    }



    constructor(props) {
        super(props);
        this.state = {
            img_url:'http://118.178.241.223/oa/icon_shenpi/ling.png',
        };
    }


   //将选中的替换
    select_img(img_url){
        this.setState({img_url:img_url});
    }


    //点击确定
    queding(){

        DeviceEventEmitter.emit('formicon', this.state.img_url);
        this.props.navigation.goBack(null);


    }

    _renderSwiper(){
        return (
            <Swiper
                height={screenH*0.5}
                horizontal={true}
                autolay={true}
                loop={true}
                paginationStyle={{bottom:10}}
                dotStyle={{backgroundColor:'rgba(0,0,0,.2)', width: 6, height: 6}}
                activeDotStyle={{backgroundColor:'rgba(236,29,29,.5)', width: 6, height: 6}}>
                <View style={styles.swiperItem}>
                    <View style={styles.row_list}>


                        <TouchableHighlight  underlayColor={'#eee'}  style={styles.icon_}  onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/ling.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/ling.png'}}
                                   style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight  underlayColor={'#eee'}  style={styles.icon_}  onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/jiao.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/jiao.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wendang.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wendang.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight   underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wen_xuan.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wen_xuan.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                    </View>
                    <View style={styles.row_list}>


                        <TouchableHighlight   underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/tanlun.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/tanlun.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/non.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/non.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>



                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/computer.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/computer.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/computer-2.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/computer-2.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                    </View>
                    <View style={styles.row_list}>


                        <TouchableHighlight  underlayColor={'#eee'}  style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/zhang.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/zhang.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wen_dang.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wen_dang.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/yuyin-ribao.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/yuyin-ribao.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/lei.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/lei.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                    </View>
                </View>
                <View style={styles.swiperItem}>
                    <View style={styles.row_list}>


                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wen_dang2.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wen_dang2.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/plane.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/plane.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wen_dang_30.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wen_dang_30.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wen_dang_7.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wen_dang_7.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                    </View>
                    <View style={styles.row_list}>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/gouwuche.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/gouwuche.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wen-m.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wen-m.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight   underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/up-wen.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/up-wen.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/down.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/down.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                    </View>
                    <View style={styles.row_list}>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/time.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/time.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/wen-time.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/wen-time.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/xinglixiang.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/xinglixiang.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/gongwenbao.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/gongwenbao.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>

                    </View>
                </View>
                <View style={styles.swiperItem}>
                    <View style={styles.row_list}>

                        <TouchableHighlight  underlayColor={'#eee'} underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/shalou.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/shalou.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <TouchableHighlight  underlayColor={'#eee'} style={styles.icon_} onPress={()=>this.select_img('http://118.178.241.223/oa/icon_shenpi/car.png')}>
                            <Image source={{uri: 'http://118.178.241.223/oa/icon_shenpi/car.png'}}  style={{width: 48, height: 48}} />
                        </TouchableHighlight>


                        <View style={styles.icon_}></View>
                        <View style={styles.icon_}></View>
                    </View>
                    <View style={styles.row_list}>
                        <View style={styles.icon_}></View>
                        <View style={styles.icon_}></View>
                        <View style={styles.icon_}></View>
                        <View style={styles.icon_}></View>
                    </View>
                    <View style={styles.row_list}>
                        <View style={styles.icon_}></View>
                        <View style={styles.icon_}></View>
                        <View style={styles.icon_}></View>
                        <View style={styles.icon_}></View>
                    </View>
                </View>

            </Swiper>
        )
    }

    render() {
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>模板图标</Text>
                    <TouchableOpacity style={[styles.goRight,styles.go]} onPress={()=>this.queding()}>
                        <Text style={[styles.back_text]} >确定</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.iconScroll}>


                    <View style={{height:screenH}}>
                        <View  style={{height:screenH*0.34,justifyContent:'center',alignItems:'center'}}>

                            <Image style={{width:60,height:60}}  source={{uri:this.state.img_url}}/>
                        </View>
                        {this._renderSwiper()}
                    </View>



                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#eee',
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
        width:14,
        height:14,
        marginTop:5
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    swiperStyle:{
        position:'absolute',
        bottom:0
    },
    iconScroll:{
        width:screenW,
        height:screenH*0.8,
    },
    swiperItem:{
        backgroundColor:'#f2efed' ,
        borderColor:'#e2e2e2',
        borderBottomWidth:1,
        height:screenH*0.45
    },
    icon_:{
        borderColor:'#e2e2e2',
        borderTopWidth:1,
        borderLeftWidth:1,
        width:screenW*0.25,
        height:screenH*0.15,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    row_list:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    }
});
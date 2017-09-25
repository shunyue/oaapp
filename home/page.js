/*
* 首页报表列表
* */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    Dimensions,
    TouchableHighlight,
    Image,
    ScrollView
} from 'react-native';
import Header from '../common/header';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class Page extends Component {




    //最新业绩展开
    newer_performance(){
        this.props.navigation.navigate('newer_performance',{user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id})
    }

    //业绩对比展开
    performance_constrast(){
        this.props.navigation.navigate('performance_constrast',{user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id})
    }




    render() {
        return (
            <View style={styles.container}>
                <Header title="报表"
                        navigation={this.props.navigation}
                        />

                <ScrollView style={{height:Platform.OS==='ios'?screenH-60:screenH-40}}>
                    <View style={{flex:1}}>
                        <View style={[{width:screenW,height:50,backgroundColor:'#fff'},styles.flex_row,styles.border_Bottom]}>
                            <TouchableHighlight underlayColor={'#ccc'} onPress={()=>{this.newer_performance()}}>
                                <View style={[{width:screenW,height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}]}>
                                    <Image  style={{width:35,height:35,marginLeft:15,marginRight:20}}  source={require('../imgs/chat/baobiao1.png')}/>
                                    <Text style={{color:'#333',fontSize:16}}>销售区域排行</Text>
                                </View>
                            </TouchableHighlight>
                            <View style={{position:'absolute',top:20,right:15}}>
                                <Image  style={{width:15,height:15,tintColor:'#666'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                        <View style={[{width:screenW,height:50,backgroundColor:'#fff'},styles.flex_row,styles.border_Bottom]}>
                            <TouchableHighlight underlayColor={'#ccc'} onPress={()=>{this.performance_constrast()}}>
                                <View style={[{width:screenW,height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}]}>
                                    <Image  style={{width:35,height:35,marginLeft:15,marginRight:20}}  source={require('../imgs/chat/baobiao2.png')}/>
                                    <Text style={{color:'#333',fontSize:16}}>销售业绩对比</Text>
                                </View>
                            </TouchableHighlight>
                            <View style={{position:'absolute',top:20,right:15}}>
                                <Image  style={{width:15,height:15,tintColor:'#666'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                        <View style={[{width:screenW,height:50,backgroundColor:'#fff'},styles.flex_row,styles.border_Bottom]}>
                            <TouchableHighlight underlayColor={'#ccc'} onPress={()=>{}}>
                                <View style={[{width:screenW,height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}]}>
                                    <Image  style={{width:35,height:35,marginLeft:15,marginRight:20}}  source={require('../imgs/chat/baobiao3.png')}/>
                                    <Text style={{color:'#333',fontSize:16}}>销售目标达成</Text>
                                </View>
                            </TouchableHighlight>
                            <View style={{position:'absolute',top:20,right:15}}>
                                <Image  style={{width:15,height:15,tintColor:'#666'}} source={require('../imgs/customer/arrow_r.png')}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    flex_row :{
        flexDirection:'row',
        alignItems:'center',
    },
    border_Bottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    border_Top:{
        borderTopWidth:1,
        borderColor:'#ccc'
    },
});

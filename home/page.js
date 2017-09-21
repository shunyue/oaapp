/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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

} from 'react-native';
import Header from '../common/header';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class Page extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Header title="报表"
                        navigation={this.props.navigation}
                        />
                <View style={{flex:1,marginTop:0.1}}>
                    <View style={[{width:screenW,height:50,backgroundColor:'#fff'},styles.flex_row,styles.border_Bottom]}>
                        <TouchableHighlight underlayColor={'#ccc'} onPress={()=>{}}>
                            <View style={[{width:screenW,height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}]}>
                                <Image  style={{width:35,height:35,marginLeft:15,marginRight:20}}  source={require('../imgs/chat/company.png')}/>
                                <Text style={{color:'#333',fontSize:16}}>合同报表</Text>
                            </View>
                        </TouchableHighlight>
                        <View style={{position:'absolute',top:20,right:15}}>
                            <Image  style={{width:15,height:15,tintColor:'#666'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>
                    <View style={[{width:screenW,height:50,backgroundColor:'#fff'},styles.flex_row,styles.border_Bottom]}>
                        <TouchableHighlight underlayColor={'#ccc'} onPress={()=>{}}>
                            <View style={[{width:screenW,height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}]}>
                                <Image  style={{width:35,height:35,marginLeft:15,marginRight:20}}  source={require('../imgs/chat/company.png')}/>
                                <Text style={{color:'#333',fontSize:16}}>合同报表</Text>
                            </View>
                        </TouchableHighlight>
                        <View style={{position:'absolute',top:20,right:15}}>
                            <Image  style={{width:15,height:15,tintColor:'#666'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>
                    <View style={[{width:screenW,height:50,backgroundColor:'#fff'},styles.flex_row,styles.border_Bottom]}>
                        <TouchableHighlight underlayColor={'#ccc'} onPress={()=>{}}>
                            <View style={[{width:screenW,height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}]}>
                                <Image  style={{width:35,height:35,marginLeft:15,marginRight:20}}  source={require('../imgs/chat/company.png')}/>
                                <Text style={{color:'#333',fontSize:16}}>合同报表</Text>
                            </View>
                        </TouchableHighlight>
                        <View style={{position:'absolute',top:20,right:15}}>
                            <Image  style={{width:15,height:15,tintColor:'#666'}} source={require('../imgs/customer/arrow_r.png')}/>
                        </View>
                    </View>
                </View>
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

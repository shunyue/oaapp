/**
 * Created by Administrator on 2017/6/7.
 * 跟进记录
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableHighlight,
    } from 'react-native';
import Header from '../../common/header';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {

    render() {
        const {params} = this.props.navigation.state;
        return (
            <View style={styles.ancestorCon}>
                <Header navigation = {this.props.navigation}
                        title = "跟进记录"
                        onPress={()=>{}}/>

                <View style={styles.follow}>
                    <View style={{ paddingLeft:10,paddingRight:10}}>
                       <View style={[styles.border,{paddingTop:5,paddingBottom:5}]}>
                            <Text style={{color:'#333'}}>{params.thread_name}</Text>
                           <View style={[styles.follow_p]}>
                               <Text style={{marginRight:10}}>{params.user_name}</Text>
                               <Text>{params.datetime}</Text>
                           </View>
                       </View>
                        <View style={{paddingTop:5,paddingBottom:5}}>
                            <Text>{params.description}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F8F8F8',
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
        width:10,
        height:17,
        marginTop: 1
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    follow:{
        marginTop:8,
        backgroundColor:'#fff',
        borderColor:'#d5d5d5',
        borderWidth:1,
    },
    border:{
        borderColor:'#d5d5d5',
        borderBottomWidth:1,
    },
    follow_p:{
        flexDirection:'row',
        alignItems:'center',
    },

});
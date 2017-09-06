/**
 * Created by Administrator on 2017/6/19.
 * 搜索页
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';

const screenW = Dimensions.get('window').width;

export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thread_name: '',
            threadData: []
        };
    }
    _searchThread() {
        if(!this.state.thread_name) {
            return ;
        }
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchThread;
        request.post(url, {
            thread_name: this.state.thread_name,
            user_id:params.user_id
        }).then((result) => {
            if (result.status == 1) {
                this.setState({
                    threadData: result.data
                })
            }else {
                this.setState({
                    threadData: null
                })
            }
        }).catch((error) => {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }


    goPage_xiansuoDetail(threadData) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('XianSuoDetail',{thread: threadData,user_id: params.user_id,company_id: params.company_id})
    }

    render(){

        var threadList = [];
        var threadData = this.state.threadData;
        if(!threadData) {
            threadList.push (
                <View style={styles.emptyContent} key="1">
                    <Image source={require('../../imgs/customer/empty-content.png')}/>
                    <Text>暂无相关内容</Text>
                </View>
            )
        }

        for(var i in threadData) {
            threadList.push(
                <TouchableHighlight underlayColor={'#eee'} onPress={this.goPage_xiansuoDetail.bind(this,threadData[i])} key={i}>
                    <View style={[styles.newMessage_content,{backgroundColor: '#fff'}]}>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <Text style={{fontSize:14,color:'#000'}}>{threadData[i].thread_name}</Text>
                        </View>
                        <View style={[styles.newMessage_customer]}>
                            <Image style={{width:16,height:16,marginRight:5}} source={require('../../imgs/customer/customer.png')}/>
                            <Text>{threadData[i].address?threadData[i].address: "未填写地址"}</Text>
                        </View>
                        <View style={[styles.newMessage_customer]}>
                            <Image style={{width:15,height:15,marginRight:5}} source={require('../../imgs/customer/person.png')}/>
                            <Text numberOfLines={1} style={{fontSize:12,width: screenW*0.7}}>{threadData[i].user_name}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }

        return (
            <View style={styles.container}>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(thread_name) => this.setState({thread_name})}
                            placeholder ={'搜索线索'}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            returnKeyType="search"
                            onSubmitEditing={() => this._searchThread()}
                            />
                    </View>
                    <TouchableOpacity
                        style={{height:40,justifyContent:'center',marginLeft:15}}
                        onPress={()=>this.props.navigation.goBack(null)}
                        >
                        <Text>取消</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {threadList}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F8F8F8'
    },
    search_bj:{
        backgroundColor:'#fff',
        height:44,
        width:screenW,
        flexDirection:'row',
        alignContent:'center',
        borderColor: '#ECECEC',
        borderBottomWidth: 1
    },
    search_border:{
        width:screenW*0.82,
        backgroundColor:'#fff',
        marginLeft:8,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    subNav_img:{
        position: 'absolute',
        zIndex:99,
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    subNav_img2:{
        width:25,
        height:25,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 25,
        width:screenW*0.8,
        height:28,
        backgroundColor: '#ddd',
        borderRadius: 6
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
    newMessage_content:{
        width:screenW,
        borderColor:'#ECECEC',
        borderBottomWidth:1,
        height:100,
        justifyContent: 'center',
        paddingLeft: 10
    },
    newMessage_customer:{
        flexDirection:'row',
        alignItems:'center',
        height:22,
    },
    newMessage_customer_sty:{
        justifyContent:'space-between',
    },
    emptyContent: {
        flex: 1,
        marginTop: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
/**
 * Created by Administrator on 2017/6/19.
 * 搜索页 搜索客户名称 企业名
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    TouchableHighlight,
} from 'react-native';
import config from '../../common/config';
import toast from '../../common/toast';
import request from '../../common/request';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerData: []
        };
    }

    _searchCustomer() {
        if(!this.state.cus_name) {
            return ;
        }
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchGonghai;
        request.post(url, {
            cus_name: this.state.cus_name,
            user_id:params.user_id
        }).then((result) => {
            if (result.status == 1) {
                this.setState({
                    customerData: result.data
                })
            }else {
                this.setState({
                    customerData: null
                })
            }
        }).catch((error) => {
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }

    _customerDetail(data) {
        const {params} = this.props.navigation.state;
        this.props.navigation.navigate('GongHaiDetail',{customer:data,user_id: params.user_id,company_id: params.company_id});
    }

    render(){

        var customerList = [];
        var customerData = this.state.customerData;
        if(!customerData) {
            customerList.push (
                <View style={styles.emptyContent} key="1">
                    <Image source={require('../../imgs/customer/empty-content.png')}/>
                    <Text>暂无相关内容</Text>
                </View>
            )
        }

        for(var i in customerData) {
            customerList.push(
                <TouchableHighlight key={i} underlayColor={'#F3F3F3'}
                                    onPress={this._customerDetail.bind(this,customerData[i]) }  >
                    <View style={styles.newMessage_content}>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <Text style={{fontSize:14,color:'#000'}}>{customerData[i].cus_name}</Text>
                            <Text style={{color:'#e15151'}}>{customerData[i].classify?customerData[i].classify+"级":"未分类"}</Text>
                        </View>
                        <View style={[styles.newMessage_customer,styles.newMessage_customer_sty]}>
                            <View style={[styles.newMessage_customer,]}>
                                <Image style={{width:16,height:16,marginRight:5}} source={require('../../imgs/customer/customer.png')}/>
                                <Text>{customerData[i].provice?customerData[i].provice+customerData[i].city+customerData[i].district: "未填写地址"}</Text>
                            </View>
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
                            onChangeText={(cus_name) => this.setState({cus_name})}
                            placeholder ={'搜索客户名称、企业名'}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            returnKeyType="search"
                            onSubmitEditing={() => this._searchCustomer()}
                            />
                    </View>
                    <TouchableOpacity
                        style={{height:40,justifyContent:'center',marginLeft:15}}
                        onPress={()=>this.props.navigation.goBack(null)}>
                        <Text>取消</Text>
                    </TouchableOpacity>

                </View>

                <ScrollView>
                    {customerList}
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

    line:{
        height:1,
        width:40,
        borderWidth:0.5,
        borderColor:'#aaa',
        marginTop:10,
    },
    newMessage_content:{
        width:screenW,
        borderColor:'#e3e3e3',
        borderBottomWidth:1,
        height:100,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        backgroundColor: '#fff'
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
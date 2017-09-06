/**
 * Created by Administrator on 2017/7/26.
 * 周飞飞
 *目标中添加产品
 */
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
    Modal,
    TouchableOpacity ,
    DeviceEventEmitter,
    TextInput,
    } from 'react-native';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
const screenH =Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;

export default class AimAddProduct extends Component {
    back() {
        this.props.navigation.goBack('AimAddProduct');
    }
    constructor(props) {
        super(props);
        this.state = {
            productData:[],
            id:'',
        }
    }
    componentDidMount() {
        var url = config.api.base + config.api.productlist;
        request.post(url,{
            company_id:this.props.navigation.state.params.company_id,
        }).then((result)=> {
            if(result.sing == 1) {
                this.setState({
                    productData: result.list,
                })

            }else{
                return Alert.alert(
                    '提示',
                    result.message,
                    [{text: '确定'}]
                )
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }
    onSelect(index, value){
        this.setState({
            id:value
        })
    }
    selectpid(pid){

    }
    _confirm(){
       for(var i in this.state.productData){
         if(this.state.productData[i].id==this.state.id){
             var pname= this.state.productData[i].product_name;
         }
       }
        var pnumber = this.props.navigation.state.params.pnumber;
        if(this.props.navigation.state.params.biaoshi==1){
            DeviceEventEmitter.emit('product_id',
                {'pid':this.state.id,'pname': pname,'pnumber':pnumber,
                    'select_product_sing':this.props.navigation.state.params.select_product_sing}
            );
        }
        if(this.props.navigation.state.params.biaoshi==2){
            DeviceEventEmitter.emit('product_id1',
                {'pid':this.state.id,'pname': pname,'pnumber':pnumber,
                    'select_product_sing':this.props.navigation.state.params.select_product_sellsing}
            );
        }

        this.props.navigation.goBack('AimAddProduct');
    }
    render(){
        var productData = this.state.productData;
        var dataList = [];
        var radioButton = [];

        for(var i in productData) {
            radioButton.push(

                <RadioButton
                    value={productData[i].id} color='red' style={styles.radioStyle} key={i}></RadioButton>

            );
            dataList.push(
                <TouchableHighlight key={i}
                                    underlayColor={'#F3F3F3'}
                                    onPress={this.selectpid.bind(this,productData[i].id)}>
                    <View style={styles.listRowContent}>
                        <Text style={styles.listRowText} ref={productData[i].id}>{productData[i].product_name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.back()}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:17}}>选择产品</Text>
                </View>
                <ScrollView>
                    {dataList[0]&&<View style={styles.contentContainer}>

                        <RadioGroup
                            style={styles.groupStyle}
                            color='#9575b2'
                            onSelect = {(index, value) => this.onSelect(index, value)}>

                            {radioButton}

                        </RadioGroup>
                        {dataList}
                        </View>}
                </ScrollView>
                <View style={styles.bottomContent}>
                    <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={()=>this._confirm()}>
                        <Text style={styles.btnText}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    container: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'center',
        marginBottom:5
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
        right:15
    },
    back_icon:{
        width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    place:{
        flexDirection:'row',
        alignItems:'center',
    },
    contentContainer: {
           backgroundColor: '#fff',
    },
    listRowContent: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#F7F8F9'
    },
    listRowText: {
        marginLeft:50
    },
    //单选框的样式
    groupStyle: {
        position: 'absolute',
        width: 40,
        zIndex: 99
    },
    radioStyle: {
        height: 50,
        alignItems: 'center'
    },
    //下面的按钮
    bottomContent: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#CFCFCF',
        borderTopWidth: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    btnStyle: {
        width: 70,
        padding: 2,
        backgroundColor: '#e4393c',
        alignItems: 'center',
        borderRadius: 2
    },
    btnText: {
        color: '#fff'
    },
});
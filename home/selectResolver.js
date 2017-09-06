/**
 * Created by Administrator on 2017/8/17.
 * 周飞飞
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

export default class SelectResolver extends Component {
    back() {
        this.props.navigation.goBack('SelectResolver');
    }
    constructor(props) {
        super(props);
        this.state = {
            dataInfo:this.props.navigation.state.params.dataInfo,
            id:'',
        }
    }
    onSelect(index, value){
        this.setState({
            id:value
        })
    }
    selectpid(pid){

    }
    _confirm(){
        for(var i in this.state.dataInfo){
            if(this.state.dataInfo[i].did==this.state.id){
                var pname= this.state.dataInfo[i].name;
                var confirm= this.state.dataInfo[i].confirm;
                var info= this.state.dataInfo[i];
            }
        }
        if(this.props.navigation.state.params.modify==1){
            DeviceEventEmitter.emit('resolve_modify',
                {'pid':this.state.id,'pname': pname,
                    'info':info, 'confirm':confirm,
                    'select_product_sing':this.props.navigation.state.params.select_product_sing}
            );
        } else{
            DeviceEventEmitter.emit('resolve_id',
                {'pid':this.state.id,'pname': pname,
                    'info':info, 'confirm':confirm,
                    'select_product_sing':this.props.navigation.state.params.select_product_sing}
            );
        }


        this.props.navigation.goBack('SelectResolver');
    }
    render(){
        var dataInfo = this.state.dataInfo;
        var dataList = [];
        var radioButton = [];

        for(var i in dataInfo) {
            radioButton.push(

                <RadioButton
                    value={dataInfo[i].did}
                    color='red'
                    style={styles.radioStyle}
                    key={i}
                    >
                </RadioButton>

            );
            dataList.push(
                <TouchableHighlight key={i}
                                    underlayColor={'#F3F3F3'}
                                    onPress={this.selectpid.bind(this,dataInfo[i].did)}>
                    <View style={styles.listRowContent}>
                        <Text style={styles.listRowText} ref={dataInfo[i].did}>{dataInfo[i].name}</Text>
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
                    <Text style={{color:'#333',fontSize:17}}>选择被分解目标</Text>
                </View>
                <ScrollView  keyboardShouldPersistTaps={'always'}>
                    {dataList[0]&&<View style={styles.contentContainer}>

                        <RadioGroup
                            style={styles.groupStyle}
                            color='#aaa'
                            activeColor='#e15151'
                            size={15}
                            onSelect = {(index, value) => this.onSelect(index, value)}>

                            {radioButton}

                        </RadioGroup>
                        {dataList}
                    </View>}
                </ScrollView>
                <View style={styles.bottomContent}>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={styles.btnStyle}
                        onPress={()=>this._confirm()}>
                        <Text style={styles.btnText}>确定</Text>
                    </TouchableHighlight>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#eee'
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
        height: 40,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
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
        height:30,
        backgroundColor: '#e4393c',
        alignItems: 'center',
        justifyContent:'center' ,
        borderRadius: 2
    },
    btnText: {
        color: '#fff'
    },
});
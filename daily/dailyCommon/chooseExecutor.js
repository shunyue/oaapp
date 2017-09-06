/**
 * Created by Administrator on 2017/6/7.
 * 选择客户
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput,
    DeviceEventEmitter,
    TouchableHighlight,
    ScrollView
    }from 'react-native';
import {StackNavigator,TabNavigator } from "react-navigation";
import CheckBox from 'react-native-check-box';
import Loading from '../../common/loading';
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
import moment from 'moment';
import com from '../../public/css/css-com'
const screenW = Dimensions.get('window').width;
export default class ChooseExecutor extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            load:true,
            text:'',
            name:'',
            executorInfo:[],
            checkBoxData:[],
            checkedData: [],
            user_id:params.user_id,
            selectInfo:[],
            executor:params.executor,
            title:""
        };
    }
    componentDidMount() {
        this._searchExecutor(1);
        //this.getSelected();//查询选中的人员
    }
    initCheckBoxData(checkbox){
      //  alert(JSON.stringify(checkbox))
        if(checkbox!=null){
            this.state.checkBoxData.push(checkbox);
        }
    }
    OpBack() {//回到上一页面
        //准备一个值
        this.props.navigation.goBack(null);
    }
    submit(){
        this.setState({checkedData:[]})
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if(this.state.checkBoxData[i]!=null && this.state.checkBoxData[i].state.isChecked == true){
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }
        DeviceEventEmitter.emit('Executor',this.state.checkedData);
        this.props.navigation.goBack(null);
    }
    cancel(){
        this.setState({
            executor:"",
            load:true
        });
        this._searchExecutor(1);
    }

    //搜索人员
    _searchExecutor(title,executor=""){
        this.setState({
            title: title
        })
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.searchExecutor;
            request.post(url,{
                name: executor,
                title: title,
                company_id:params.company_id,
                user_id:params.user_id
            }).then((res)=>{
                this.setState({
                    load: false,
                    executorInfo:res.data
                })
            })
            .catch((error)=>{
                toast.bottom('网络连接失败,请检查网络后重试')
            });
    }
    _selectAll() {
        if (this.selectAll.state.isChecked == false) {
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == false) {
                    this.state.checkBoxData[i].onClick();
                }
            }
        } else {
            for (var i = 0; i < this.state.checkBoxData.length; i++) {
                if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == true) {
                    this.state.checkBoxData[i].onClick();
                }
            }
        }
    }
    contains(arr,id) {
        var i = arr.length;
        while (i --) {
            if(arr[i] === id) {
                return true;
            }
        }
        return false;
    }
    render() {
        //加载过程
        if(this.state.load) {
            return (
                <Loading/>
            )
        }
      let {params} = this.props.navigation.state;
        //如果查到数据
        var executorArr=[];
        var isChecked = false;
        if(this.state.executorInfo!="" && this.state.executorInfo !=null){//输入查询客户
            var  executor=this.state.executorInfo;
            for (var i = 0; i <executor.length; i++) {
                    var data = this.props.navigation.state.params.executorIds;
                    if (this.contains(data,executor[i].id)) {
                        isChecked = true;
                    } else {
                        isChecked = false;
                    }
                    executorArr.push(
                            <TouchableHighlight
                                underlayColor={'#F3F3F3'}
                                key={i}>
                                <View style={styles.listRowContent}>
                                    <View style={styles.listRowSide}>
                                        <CheckBox
                                            ref={(c)=>this.initCheckBoxData(c)}
                                            style={styles.checkStyle}
                                            onClick={()=>{}}
                                            value={executor[i]}
                                            isChecked={isChecked}
                                            checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                            unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                            />
                                        {(executor[i].avatar==""||executor[i].avatar==null)?(
                                            <Image style={[com.tcp,com.wh32,com.mgr5,com.br200]} source={require('../../imgs/tx.png')}/>
                                        ):(<Image style={[com.wh32,com.br200,com.mgr5]} source={{uri:executor[i].avatar}}/>)}
                                        <Text>{executor[i].name}</Text>
                                    </View>
                                    <View style={styles.listRowSide}>
                                        <Text>{executor[i].depart_name}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                    );
            }
        }else{//输入查询数据
            executorArr.push(
                <View key={0}><Text style={{fontSize: 16,textAlign:'center'}}>没有记录</Text></View>
            );
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack(this.state.selectInfo)}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>选择人员</Text>

                </View>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(name) =>{this.setState({name:name});this._searchExecutor(2,name)}}
                            placeholder ={'搜索'}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            autoFocus={false}
                            value={this.state.name}
                            />
                    </View>
                    <TouchableOpacity
                        style={{height:40,justifyContent:'center',marginLeft:10}}
                        onPress={()=>this.cancel()}
                        >
                        <Text>取消</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {this.state.title==1 && this.state.executorInfo!=null?(
                        <View style={[styles.contentContainer]}>
                            <View style={styles.listRowContent}>
                                <View style={styles.listRowSide}>
                                    <CheckBox
                                        ref={(c)=>this.selectAll = c}
                                        style={styles.checkStyle}
                                        onClick={()=>{this._selectAll()}}
                                        isChecked={false}
                                        checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                        unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                        />
                                    <Text>全选</Text>
                                </View>
                            </View>
                        </View>
                    ):(null)}
                    {executorArr}
                </ScrollView>

                <View style={styles.bottomContent}>
                    <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={()=>{this.submit()}}>
                        <Text style={styles.btnText}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
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

    },
    go:{
        position:'absolute',
        top:8
    },
    goback:{
        left:20,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },
    back_icon:{
        width:10,
        height:17,
        marginLeft:5,
        marginTop: 3
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    sure:{
        fontSize:16
    },
    search_bj:{
        backgroundColor:'#ddd',
        height:50,
        width:screenW,
        flexDirection :'row',
    },
    search_border:{
        width:screenW*0.85,
        height:28,
        backgroundColor:'#fff',
        marginLeft:9,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    subNav_img:{
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
        width:screenW*0.6,
        height:30,
        padding:0,
    },
    linerow: {
        height: 40,
        flexDirection :'row',
        alignItems:'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor:'#bbb',
        justifyContent:'space-between',
        paddingLeft:screenW*0.03,
        paddingRight:screenW*0.05
    },
    name:{
        marginLeft:10,
    },
    topbottom:{
        borderTopWidth: 1,
        borderTopColor:'#bbb'
    },
    row_img:{
        width:15,
        height:15,
    },
    listRowContent: {
        marginLeft: 10,
        marginRight: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F7F8F9'
    },
    listRowSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkStyle: {
        width: 50,
        height: 50,
        padding: 14
    },
    rightIcon: {
        height: 16,
        width: 16,
        margin: 4
    },
    bottomContent: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ECECEC',
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    btnStyle: {
        width: 70,
        padding: 2,
        backgroundColor: '#e4393c',
        alignItems: 'center',
        borderRadius: 2,
        justifyContent: 'flex-end',
    },
    btnText: {
        color: '#fff'
    },
  contentContainer: {
         backgroundColor: '#fff',
         borderWidth: 1,
         borderColor: '#ECECEC',
   },

});
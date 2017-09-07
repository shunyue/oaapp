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
export default class ChooseSubordinate extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            load:true,
            text:'',
            name:'',
            subordinateInfo:[],
            checkBoxData:[],
            checkedData: [],
            user_id:params.user_id,
            selectInfo:[],
            subordinate:params.subordinate,
            title:""
        };
    }
    componentDidMount() {
        this._searchSubordinate(1);
      // this.getSelected();//查询选中的人员
    }
    initCheckBoxData(checkbox){
        if(checkbox!=null){
            this.state.checkBoxData.push(checkbox);
        }
    }
    OpBack() {//回到上一页面
        //准备一个值
     //  DeviceEventEmitter.emit('Subordinate',this.state.selectInfo); //发监听
        this.props.navigation.goBack(null);
    }
    reback(){
        this.props.navigation.goBack(null);
    }
    submit(){
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if(this.state.checkBoxData[i]!=null && this.state.checkBoxData[i].state.isChecked == true){
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }
        DeviceEventEmitter.emit('Subordinate',this.state.checkedData);
        this.props.navigation.goBack(null);
    }
    //搜索人员
    _searchSubordinate(title,subordinate=""){
        this.setState({
            title: title
        })
        let {params} = this.props.navigation.state;
        var url=config.api.base+config.api.searchSubordinate;
            request.post(url,{
                name: subordinate,
                title: title,
                company_id:params.company_id,
                user_id:params.user_id
            }).then((res)=>{
                this.setState({
                    load: false,
                    checkBoxData:[],
                    subordinateInfo:res.data
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
        var subordinateArr=[];
        var isChecked = false;
        if(this.state.subordinateInfo!="" && this.state.subordinateInfo !=null){//输入查询客户
            var  subordinate=this.state.subordinateInfo;
            for (var i = 0; i <subordinate.length; i++) {
                    var data = this.props.navigation.state.params.subordinateIds;
                    if (this.contains(data,subordinate[i].id)){
                        isChecked = true;
                    }else{
                        isChecked = false;
                    }
                    subordinateArr.push(
                            <TouchableHighlight
                                underlayColor={'#F3F3F3'}
                                key={i}>
                                <View style={styles.listRowContent}>
                                    <View style={styles.listRowSide}>
                                        <CheckBox
                                            ref={(c)=>this.initCheckBoxData(c)}
                                            style={styles.checkStyle}
                                            onClick={()=>{}}
                                            value={subordinate[i]}
                                            isChecked={isChecked}
                                            checkedImage={<Image source={require('../../imgs/selectnone.png')}/>}
                                            unCheckedImage={<Image source={require('../../imgs/select.png')}/>}
                                            />
                                        {(subordinate[i].avatar==""||subordinate[i].avatar==null)?(
                                            <Image style={[com.tcp,com.wh32,com.mgr5,com.br20]} source={require('../../imgs/tx.png')}/>
                                        ):(<Image style={[com.wh32,com.br20,com.mgr5]} source={{uri:subordinate[i].avatar}}/>)}
                                        <Text>{subordinate[i].name}</Text>
                                    </View>
                                    <View style={styles.listRowSide}>
                                        <Text>{subordinate[i].depart_name}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                    );
            }
        }else{//输入查询数据
            subordinateArr.push(
                <View style={[com.jcc,com.aic]} key={0}>
                    <View style={[com.jcc,com.aic]}>
                        <Image style={[com.wh64]} source={require('../../imgs/noContent.png')}/>
                        <Text style={{fontSize: 16,textAlign:'center'}}>暂无内容</Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.reback()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>选择下属</Text>
                </View>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(name) =>{this.setState({name:name});this._searchSubordinate(2,name)}}
                            placeholder ={'搜索'}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            autoFocus={false}
                            value={this.state.name}
                            />
                    </View>
                    <TouchableOpacity
                        style={{height:40,justifyContent:'center',marginLeft:10}}
                        onPress={()=>this.setState({subordinate:""})}
                        >
                        <Text>取消</Text>
                    </TouchableOpacity>
                </View>
                 <ScrollView>
                    {this.state.title==1 && this.state.subordinateInfo!=null?(
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
                   {subordinateArr}
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
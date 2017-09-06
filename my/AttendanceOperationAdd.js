/**
 * Created by Administrator on 2017/7/5.
 * 考勤白名单 添加
 */
import React ,{Component} from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    TextInput,
    DeviceEventEmitter,
    TouchableOpacity,
    Alert,
    } from 'react-native';
var PropTypes = React.PropTypes;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import CheckBox from 'react-native-check-box';

const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;

export default class AttendanceOperationAdd extends Component {
    OpBack() {
        this.props.navigation.goBack('AttendanceOperationAdd')
    }
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state
        this.state = {
            checkBoxData: [],
            checkedData: [],
            type: 'sousuo',
            status:0,
            text: '搜索',
            modalVisible:false
        }
    }
    componentDidMount() {
        this._firstWhiteUser() ;

    }

    //页面一加载进来，就获取数据
    _firstWhiteUser(){
        var url = config.api.base + config.api.myselfInfomation;
        var id=this.props.navigation.state.params.companyid;
        request.post(url,{
            company: id,
            all:1,
        }).then((responseJson) => {
            this.setState({
                userData: responseJson,
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    _pressUser(id) {
        this.state.checkBoxData[id].onClick()
    }
    initCheckBoxData(checkbox){
        if(checkbox!=null){
            this.state.checkBoxData.push(checkbox);
        }
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

    _confirm() {
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].state.isChecked == true) {
                this.state.checkedData.push(this.state.checkBoxData[i].props.value);
            }
        }
        var url = config.api.base + config.api.changeAttendance;
        if(this.state.checkedData==''){
            return toast.center('请选择要添加的员工！');
        }
        request.post(url,{
            checked_data: this.state.checkedData
        }).then((result)=> {
            if(result.status == 1) {
                return toast.center(result.message);
            }else if(result.status ==0){
                return toast.center(result.message);
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });


        //监听事件
        DeviceEventEmitter.emit('firstWhiteUser');
         //重新加载页面
        this._firstWhiteUser();
        //this.props.navigation.goBack('attendanceWhiteDetail',this.props.navigation.state.params.companyid);
    }
    //搜索员工
    _onChangeText = (t) => {
        if(!t) {
            return this.setState({
                userData: null,
                text: null
            })
        }
        this.setState({
            text: t
        })
        this._searchPeople(t);

    }
    _searchPeople(t) {
        if(!t && !this.state.text) {
            return this.setState({
                userData: null
            })
        }
        const {params} = this.props.navigation.state;
        var url = config.api.base + config.api.searchEmployee;
        request.post(url,{
            type: this.state.type,
            company_id: this.props.navigation.state.params.companyid,
            text: t? t: this.state.text
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    userData: result.data
                })
            }else{
                return this.setState({
                    userData: null
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
    }

    searchStatus(status){
        if(status==0){
            this. _firstWhiteUser();
        }
    }


    render() {
        var userData = this.state.userData;//人员信息
        var userList = [];
        for(var i in userData) {
            userList.push(
                <TouchableHighlight key={i}
                                    onPress={this._pressUser.bind(this,i)}
                                    underlayColor={'transparent'}>
                    <View  key={i} style={styles.listRowContent}>
                        <View style={styles.listRowSide}>
                            <CheckBox
                                ref={(c)=>this.initCheckBoxData(c)}
                                style={styles.checkStyle}
                                onClick={()=>{}}
                                value={userData[i].id}
                                isChecked={false}
                                checkedImage={<Image source={require('../imgs/selectnone.png')}/>}
                                unCheckedImage={<Image source={require('../imgs/select.png')}/>}
                                />
                            <Image source={ userData[i].avatar? {uri: userData[i].avatar} : require('../imgs/avatar.png')}
                                   style={styles.avatarStyle}/>
                            <View style={{flexDirection :'column',
                                alignItems:'flex-start',}}>
                                <Text style={styles.positionText}>{userData[i].name}</Text>
                                <Text style={styles.positionText}>{userData[i].department}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }

        return(
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.formHeader}>选择白名单</Text>
                </View>
                <View style={styles.search_bj}>
                    <View style={styles.search_border}>
                        <Image style={styles.subNav_img} source={require('../imgs/customer/search.png')}/>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={this._onChangeText}
                            placeholder ={this.state.text}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            />
                    </View>
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={{height:40,justifyContent:'center',alignItems:'center',marginLeft:3}}
                        onPress={()=>{this.searchStatus(0)}}
                        >
                        <Text>取消</Text>
                    </TouchableHighlight>
                </View>
                <ScrollView>
                    <View style={styles.peopleList}>
                        {userList}
                    </View>
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
    container:{
        flex: 1,
        backgroundColor: '#eee',
    },
    header: {
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
        right:15
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
        fontSize:16,
        color:'#333'
    },
    search_bj:{
        backgroundColor:'#ddd',
        height:44,
        width:screenW,
        flexDirection:'row',
        alignContent:'center',
    },
    search_border:{
        width:screenW*0.82,
        height:28,
        backgroundColor:'#fff',
        marginLeft:9,
        marginRight:9,
        marginTop:8,
        borderRadius:5,
        flexDirection:'row',
        alignContent:'center',
    },
    search_border2:{
        width:screenW*0.95,
    },
    subNav_img:{
        width:15,
        height:15,
        marginTop:7,
        marginLeft:6,
        marginRight:4
    },
    input_text:{
        width:screenW*0.8,
        height:30,
        padding:0,
    },
    peopleList: {
        backgroundColor: '#eee',
    },
    checkbox: {
        width: 26,
        height: 26
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    listRowContent: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#F7F8F9',
        borderBottomWidth: 1,
        width:screenW,
        borderColor:'#ddd',
        borderWidth:1 ,
        backgroundColor: '#fff',
        marginBottom:10,
    },
    checkStyle: {
        width: 50,
        height: 50,
        padding: 14
    },
    listRowSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarStyle: {
        width:34,
        height:34,
        marginRight:10,
        borderRadius: 20,
    },
    bottomContent: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#CFCFCF',
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
        borderRadius: 2
    },
    btnText: {
        color: '#fff'
    },
    positionText: {
        fontSize: 12,
    }
});


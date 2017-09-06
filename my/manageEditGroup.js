/**
 * Created by Administrator on 2017/7/4.
 * 新建分组   (考勤管理中的新建）
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    TextInput,
    ScrollView ,
    Modal,
    TouchableOpacity,
    DeviceEventEmitter,
    Alert,
    } from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Picker from 'react-native-picker' ;
import moment from 'moment';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class ManageEditGroup extends Component {
    OpBack() {
        this.props.navigation.goBack('ManageEditGroup')
    }
    constructor(props) {
        super(props);
        const {params}=this.props.navigation.state;
        if(params.attendance.companyData !==''){
            var saveDate=params.attendance.companyData;
        }
        if(params.attendance.departData !==''){
            var saveDate=params.attendance.departData;
        }
        if(params.attendance.departData==''&& params.attendance.companyData==''){
            var saveDate='';
        }
        var xingqi= params.attendance.week;
        var list=[false,false,false,false,false,false,false];
        for(var i in xingqi){
            if(xingqi[i]=='日'){
                list[0]=true;
            }else if(xingqi[i]=='一'){
                list[1]=true;
            }else if(xingqi[i]=='二'){
                list[2]=true;
            }else if(xingqi[i]=='三'){
                list[3]=true;
            }else if(xingqi[i]=='四'){
                list[4]=true;
            }else if(xingqi[i]=='五'){
                list[5]=true;
            }else if(xingqi[i]=='六'){
                list[6]=true;
            }
        }
        this.state = {
            text: '',
            groupid:params.attendance.id,
            groupname:params.attendance.groupname,
            timename:params.attendance.timename,
            week:params.attendance.week,
            signIn:params.attendance.start,
            signOut:params.attendance.stop,
            weekChose:list,
            listView:[],
            handle:false,
            companyname:'',
            departData:saveDate,
            staffsData:params.attendance.userData,
            photo:'',
            position:params.attendance.position,
            cancel:false,
        };

    }
    setCancelModal(visible){
        this.setState({cancel: visible});
    }
    setHandleModal(visible){
        this.setState({handle: visible});
    }
    //选择添加部门
    chooseDepart(){
        this.setHandleModal(!this.state.handle);
        var url = config.api.base + config.api.getCompany;
        request.post(url,{
            company_id: this.props.navigation.state.params.companyid,
        }).then((result)=> {
            if(result.status == 1) {
                var company=eval(result.data);
                for(var i in company){
                    var name= company[i]['company_name']  ;
                }
                this.setState({
                    companyname: name
                });
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
        this.props.navigation.navigate('ChooseDepart',{
            companyid:this.props.navigation.state.params.companyid,
            company_name:this.state.companyname,
            findCompany: true});
    }
    //选择添加员工
    chooseStaffs(){
        this.setHandleModal(!this.state.handle);
        var url = config.api.base + config.api.getCompany;
        request.post(url,{
            company_id: this.props.navigation.state.params.companyid,
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    company_name: result.data.company_name,
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
        var url = config.api.base + config.api.getCompany;
        request.post(url,{
            company_id: this.props.navigation.state.params.companyid,
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    company_name: result.data.company_name,
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

        this.props.navigation.navigate('ChooseStaffs', {
            companyid:this.props.navigation.state.params.companyid,
            company_name:this.state.company_name,
        });
    }
    //获取签到时间
    _showYearPicker() {
        var pickerData=[]
        var minute=[]
        for(var i=0;i<61;i++){
            if(i<10){
                minute.push('0'+i)
            }else{
                minute.push(i)
            }
        }
        for(var i=0;i<24;i++){
            if(i<10){
                pickerData.push({['0'+i]:minute})
            }else{
                pickerData.push({[i]:minute})
            }
        }
        // alert(JSON.stringify(pickerData));
        Picker.init({
            pickerData:pickerData ,
            pickerTitleText: '选择时间',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            selectedValue:['09','00'],
            onPickerConfirm: data => {
                this.setState({signIn:data[0]+':'+data[1]});
            },
        });
        Picker.show();
    }
    _hide(){
        Picker.hide();
    }
    _showYearPicker2() {
        var pickerData=[]
        var minute=[]
        for(var i=0;i<61;i++){
            if(i<10){
                minute.push('0'+i)
            }else{
                minute.push(i)
            }
        }
        for(var i=0;i<24;i++){
            if(i<10){
                pickerData.push({['0'+i]:minute})
            }else{
                pickerData.push({[i]:minute})
            }
        }

        Picker.init({
            pickerData:pickerData ,
            pickerTitleText: '选择时间',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            selectedValue:['18','00'],
            onPickerConfirm: data => {
                this.setState({signOut:data[0]+':'+data[1]});
            },
        });
        Picker.show();
    }
    //获取时间（根据选择星期按钮）
    weekChose(postion){
        var weekChoseList = [];
        var weekList=[];
        var weekListData=['日','一','二','三','四','五','六',];
        for(var i in this.state.weekChose){
            if(i==postion){
                weekChoseList.push(!this.state.weekChose[i]) ;
            }else{
                weekChoseList.push(this.state.weekChose[i]) ;
            }
        }
        for(var j in weekChoseList) {
            if(weekChoseList[j]==true){
                weekList.push(weekListData[j]);
            }  else{
                weekList.push('');
            }
        }
        this.setState({weekChose:weekChoseList});
        this.setState({week:weekList});
    }

    weekly(){
        var weekListData=['日','一','二','三','四','五','六',];
        var weekList=[];
        for(var j=0;j<weekListData.length;j++){
            if(this.state.weekChose[j]==true){
                weekList.push(weekListData[j]);
            } else{
                weekList.push('');
            }
        }
        this.setState({week:weekList});
    }
    goonAdd(){
        //alert('这是继续添加按钮')
        this.state.arr.push(
            <View style={[styles.border_colorBottom,{height:40,justifyContent:'center',alignItems:'space-between'}]}>
                <Text>请搜索</Text>
                <Image  style={{width:15,height:15}} source={require('../imgs/customer/delete.png')}/>
            </View>
        );
        this.setState({//放到这里只是为了渲染页面

        })
    }

    componentDidMount() {
        //获取星期
        this.weekly();
        //根据选择部门监听
        this.selectDepart = DeviceEventEmitter.addListener('depart',
            (paramsd)=>{
                var depart=eval(paramsd);
                this.changeDepart(depart) ;

            });
        //根据选择员工监听
        this.selectStaffs = DeviceEventEmitter.addListener('staffs',
            (paramse)=>{
                var staffs=eval(paramse);
                this.changeStaffs(staffs) ;
            });

    }
    //根据选择部门监听传过来的数据获取部门信息
    changeDepart(depart){
        var did=[];
        //如果传过来的部门不是是公司，company=2，
        var company=2;
        for(var i in depart){
            did.push(depart[i].id);
            //如果传过来的部门是公司，company=1，
            if(depart[i].company_name){
                company=1;
            }
        }
        var url = config.api.base + config.api.getDepartInfo;
        request.post(url,{
            cordid: did,
            company:company,
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    departData: result.data,
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
    //根据选择员工监听传过来的数据获取人员信息
    changeStaffs(staffs){
        var staffsList=[];
        for(var i in staffs){
            if(staffs[i].depart_name){
                var url = config.api.base + config.api.getDepartInfo;
                request.post(url,{
                    staffsdid: staffs[i].id,
                }).then((result)=> {
                    if(result.status == 1) {
                        var user2=result.data;
                        for(var j in user2){
                            staffsList.push( user2[j]);
                            this.setState({})
                        }
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
            } else{
                staffsList.push(staffs[i]);
            }
        }
        this.setState({
            staffsData: staffsList,
        })
    }
    //根据部门的头像删除
    deletPhoto(depart){
        var departdelete=this.state.departData;
        for(var i in departdelete){
            if(departdelete[i].id == depart){
                departdelete.splice(i,1) ;
            }
        }
        this.setState({
            departData: departdelete,
        })
    }
    //根据人员的头像删除
    deletSPhoto(sid){
        var staffsList=[];
        var staffs=this.state.staffsData;
        for(var i in staffs){
            if(sid==staffs[i]['id']){
                staffs.splice(i,1) ;
            }
        }
        for(var i in staffs){
            staffsList.push(staffs[i]);
        }
        this.setState({
            staffsData: staffsList,
        })

    }

    //移除监听
    componentWillUnmount() {
        this.selectDepart.remove();
        this.selectStaffs.remove();
    }
    //保存数据，提交
    save(){
        if(this.state.groupname==''){
            Alert.alert(
                '温馨提示：',
                '请输入分组名称' ,
                [{text: '确定'}]
            )
            return false;
        }
        if(this.state.week==''){
            Alert.alert(
                '温馨提示：',
                '请至少选择一天' ,
                [{text: '确定'}]
            )
            return false;
        }

        if(this.state.timename==''){
            Alert.alert(
                '温馨提示：',
                '请输入时段名称' ,
                [{text: '确定'}]
            )
            return false;
        }
        var url = config.api.base + config.api.modifyAttendanceData;
        request.post(url,{
            groupid:this.state.groupid,
            groupname: this.state.groupname,
            departData: this.state.departData,
            staffsData: this.state.staffsData,
            week: this.state.week,
            timename: this.state.timename,
            signIn: this.state.signIn,
            signOut: this.state.signOut,
            avatar:this.state.photo,
            position:this.state.position,
            companyid:this.props.navigation.state.params.companyid ,
        }).then((result)=> {
            if(result.status == 1) {
                toast.center('保存成功！') ;
            }else  if(result.status == 0){
                return Alert.alert(
                    '提示',
                    result.message,
                    [{text: '确定'}]
                )
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
        DeviceEventEmitter.emit('editgroup',this.props.navigation.state.params.companyid);
        this.props.navigation.goBack('ManageEditGroup');
    }
    confirmCancel(){
        var url = config.api.base + config.api.deleteAttendanceData;
        request.post(url,{
            groupid:this.state.groupid,
            companyid:this.props.navigation.state.params.companyid ,
        }).then((result)=> {
            if(result.status == 1) {
                toast.center('保存成功！') ;
            }else if(result.status == 0){
                return Alert.alert(
                    '提示',
                    result.message,
                    [{text: '确定'}]
                )
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        });
        DeviceEventEmitter.emit('deletegroup',this.props.navigation.state.params.companyid);
        this.props.navigation.goBack('ManageEditGroup');
    }
    add_listView(){
        this.state.listView.push( <View style={[{height:40,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingRight:15},styles.border_colorBottom]}>
            <Text>请搜索</Text>
            <Image  style={{width:15,height:15}} tintColor={'#555'} source={require('../imgs/customer/delete.png')}/>
        </View>)
        this.setState({

        })
    }
    delete_listView(){
        this.setState({
            position:""
        })
    }
    render(){
        const {navigate} = this.props.navigation;
        const {state} = this.props.navigation;
        var listView=[];
        var arr=this.state.listView
        for(var i = 0; i <arr.length; i++){
            listView.push( <View key={i} style={[{height:40,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingRight:15},styles.border_colorBottom]}>
                <Text>请搜索</Text>
                <Image  style={{width:15,height:15}} tintColor={'#555'} source={require('../imgs/customer/delete.png')}/>
            </View>)

        }
        var departData=this.state.departData;
        var departList=[];
        if(departData){
            for (var i in departData) {
                departList.push(
                    <View key={i}>
                        <View style={{width:50,alignItems:'center',paddingBottom:5}}>
                            <TouchableOpacity   onPress={this.deletPhoto.bind(this,departData[i].id)}>
                                <Image  style={{width:30,height:30}}  source={require('../imgs/depart.png')}/>
                            </TouchableOpacity>
                            <Text style={{color:'#666',fontSize:10}}>{departData[i].depart_name}</Text>
                        </View>
                    </View>
                )
            }
        }


        var staffsData=this.state.staffsData;
        var staffList=[];
        if(staffsData){
            for (var i in staffsData) {
                staffList.push(
                    <View key={i}>
                        <View style={{width:50,alignItems:'center',paddingBottom:5}}>
                            <TouchableOpacity   onPress={this.deletSPhoto.bind(this,staffsData[i].id)}>
                                <Image source={ staffsData[i].avatar? {uri: staffsData[i].avatar} : require('../imgs/avatar.png')}
                                       style={{width:30,height:30}}/>
                            </TouchableOpacity>
                            <Text style={{color:'#666',fontSize:10}}>{staffsData[i].name}</Text>
                        </View>
                    </View>
                )
            }
        }
        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{ flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>编辑分组</Text>
                    <TouchableOpacity style={[styles.goRight,styles.go]}
                                      onPress={()=>{this.save();}}
                        >
                        <Text style={[styles.back_text,{color:'#e15151'}]}>保存</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView keyboardShouldPersistTaps ={'always'}>
                    <View style={{marginTop:10,backgroundColor:'#fefefe'}}>
                        <View style={{
                            borderBottomColor:'#ddd',
                            borderBottomWidth:1,
                            flexDirection:'row',
                            height:40,
                            alignItems:'center',
                            backgroundColor:'#fefefe',
                            }}>
                            <Text style={{marginRight:15,marginLeft:15,color:'#010',fontSize:14}}>分组名称</Text>
                            <TextInput
                                style={{fontSize:14,color:'#cbb',width:screenW*0.6,padding:0}}
                                onChangeText={(groupname) => this.setState({groupname})}
                                placeholder='请输入'
                                underlineColorAndroid="transparent"
                                value={this.state.groupname}
                                />
                        </View>
                        <View style={{
                            borderBottomColor:'#ddd',
                            borderBottomWidth:1,
                            paddingLeft:15,
                            backgroundColor:'#fefefe',
                            justifyContent:'center',
                            marginTop:5
                            }}>
                            <View style={{ flexDirection:'row',alignItems:'center',height:30}}>
                                <Text style={{color:'#333'}}>使用范围</Text>
                                <Text style={{fontSize:12,marginLeft:5}}>轻点头像删除</Text>
                            </View>
                            <View style={{flexDirection:'row',marginBottom:10,flexWrap:'wrap'}}>
                                {departList}
                                {staffList}
                                <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.setState({handle: !this.state.handle})}}>
                                    <Image  style={{width:30,height:30}} tintColor={'#dedede'} source={require('../imgs/customer/add_c.png')}/>
                                </TouchableHighlight>
                            </View>

                        </View>
                    </View>
                    <View style={{
                            borderBottomColor:'#ddd',
                            borderBottomWidth:1,
                            flexDirection:'row',
                            alignItems:'center',
                            height:50,
                            backgroundColor:'#fefefe',
                            justifyContent: 'center',
                            marginBottom:10,
                            marginTop:10
                            }}>
                        <TouchableHighlight underlayColor={'#fff'} style={this.state.weekChose[0]?styles.weekChose2:styles.weekChose}
                                            onPress={()=>{this.weekChose(0);}}>
                            <Text style={this.state.weekChose[0]?{color:'#fff'}:null}>日</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'} style={this.state.weekChose[1]?styles.weekChose2:styles.weekChose}
                                            onPress={()=>{this.weekChose(1);}}>
                            <Text style={this.state.weekChose[1]?{color:'#fff'}:null}>一</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'} style={this.state.weekChose[2]?styles.weekChose2:styles.weekChose}
                                            onPress={()=>{this.weekChose(2);}}>
                            <Text style={this.state.weekChose[2]?{color:'#fff'}:null}>二</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'} style={this.state.weekChose[3]?styles.weekChose2:styles.weekChose}
                                            onPress={()=>{this.weekChose(3);}}>
                            <Text style={this.state.weekChose[3]?{color:'#fff'}:null}>三</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'} style={this.state.weekChose[4]?styles.weekChose2:styles.weekChose}
                                            onPress={()=>{this.weekChose(4);}}>
                            <Text style={this.state.weekChose[4]?{color:'#fff'}:null}>四</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'} style={this.state.weekChose[5]?styles.weekChose2:styles.weekChose}
                                            onPress={()=>{this.weekChose(5);}}>
                            <Text style={this.state.weekChose[5]?{color:'#fff'}:null}>五</Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'} style={this.state.weekChose[6]?styles.weekChose2:styles.weekChose}
                                            onPress={()=>{this.weekChose(6);}}>
                            <Text style={this.state.weekChose[6]?{color:'#fff'}:null}>六</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.contentContainer,styles.border_colorBottom,styles.border_top]}>
                        <View style={[{flexDirection:'row',alignItems:'center',height:40,},styles.border_colorBottom]}>
                            <Text style={{marginRight:15,marginLeft:15,color:'#010',fontSize:14}}>时段名称</Text>
                            <TextInput
                                style={{fontSize:14,color:'#cbb',width:screenW*0.6,padding:0}}
                                onChangeText={(timename) => this.setState({timename})}
                                placeholder='请输入'
                                underlineColorAndroid="transparent"
                                value={this.state.timename}
                                />
                        </View>
                        <View style={styles.topContent}>
                            <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this._showYearPicker()}}>
                                <View style={[styles.addContent,{borderRightWidth:1,borderColor:'#ddd'}]} >
                                    <Text>签到时间</Text>
                                    <Text>{this.state.signIn}</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this._showYearPicker2()}}>
                                <View style={styles.addContent}>
                                    <Text>签退时间</Text>
                                    <Text>{this.state.signOut}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={[styles.border_colorBottom,styles.border_top,{paddingLeft:15,backgroundColor:'#fff',marginTop:10}]}>
                        <View style={[styles.border_colorBottom,{height:40,justifyContent:'center'}]}>
                            <Text style={{color:'#000'}}>考勤位置</Text>
                        </View>
                        <View style={[{height:40,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingRight:15},styles.border_colorBottom]}>
                            <TextInput
                                style={{fontSize:14,color:'#cbb',width:screenW*0.6,padding:0}}
                                onChangeText={(position) => this.setState({position})}
                                placeholder='请输入考勤位置'
                                underlineColorAndroid="transparent"
                                value={this.state.position}
                                />
                            <TouchableHighlight underlayColor={'#fff'}
                                                onPress={()=>{this.delete_listView()}} >
                                <Image  style={{width:15,height:15}} tintColor={'#555'} source={require('../imgs/customer/delete.png')}/>
                            </TouchableHighlight>
                        </View>
                        <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.add_listView()}} >
                            <View style={[{height:40,justifyContent:'center',alignItems:'center'}]}>
                                <Text style={{color:'#e15151'}}>+ 添加考勤位置</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                </ScrollView>
                <TouchableHighlight underlayColor={'transparent'}
                                    onPress={()=>{this.setState({cancel:!this.state.cancel})}}
                    style={[styles.border_top,styles.border_colorBottom,
                    {alignItems:'center',height:40,borderColor:'#ccc',justifyContent:'center',paddingLeft:15,backgroundColor:'#fff',marginTop:10}]}>
                    <View>
                        <Text style={{color:'#e15151'}}>删除分组</Text>
                    </View>
                </TouchableHighlight>
                <View>
                </View>
                {/* 添加模型 头部右侧 客户调整  */}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.handle}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setHandleModal(!this.state.handle)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer2}>
                            <View style={[styles.addCustomer_card22]}>
                                <View style={styles.customerCard_content22}>
                                    <Text style={{color:'#333'}}>请选择</Text>
                                </View>
                                <View style={styles.customerCard_content22}>
                                    <TouchableHighlight underlayColor={'#eee'}
                                                        style={styles.customerCard_content22}
                                                        onPress={() => { this.chooseDepart()}}
                                        >
                                        <Text style={{color:'#333',marginLeft:30}}>添加部门</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.customerCard_content22}>
                                    <TouchableHighlight underlayColor={'#eee'}
                                                        style={styles.customerCard_content22}
                                                        onPress={() => { this.chooseStaffs()}}
                                        >
                                        <Text style={{color:'#333',marginLeft:30}}>添加员工</Text>
                                    </TouchableHighlight>
                                </View>
                                <View  style={[styles.customerCard_content22,styles.customerCard_content23,{marginLeft:screenW*0.65}]}>
                                    <TouchableHighlight underlayColor={'#eee'} style={styles.customerCard_content22} onPress={() => { this.setHandleModal(!this.state.handle)}}>
                                        <Text  style={{color:'green'}}>取消</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* 删除分组*/}
                <View>
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.cancel}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6,position:'absolute',zIndex:1}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setCancelModal(!this.state.cancel)
                    }}></TouchableOpacity>
                        </View>
                        <View  style={{width:screenW*0.8,height:120,position:'absolute',top:screenH*0.5-80,zIndex:100,backgroundColor:'#fff',marginLeft:screenW*0.1,borderRadius:5}}>
                            <View style={[{height:80,justifyContent:'center',alignItems:'center',}]}>
                                <Text>您确认要删除该考勤分组吗？</Text>
                            </View>
                            <View style={[styles.flex_row,styles.border_top,{borderColor:'#ddd'}]}>
                                <TouchableHighlight underlayColor={'transparent'}
                                     style={{width:screenW*0.4,height:40,justifyContent:'center',alignItems:'center',borderRightWidth:1,borderColor:"#ddd"}}
                                     onPress={()=>{this.setState({cancel:!this.state.cancel})}}>
                                    <Text  style={{color:'#e15151'}}>取消</Text>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'transparent'}
                                    style={{width:screenW*0.4,height:40,justifyContent:'center',alignItems:'center'}}
                                    onPress={()=>this.confirmCancel()}>
                                    <Text  style={{color:'#e15151'}}>确定</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#eee',
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
        top:8,
    },
    goback:{
        left:1,
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
        marginLeft:3
    },
    formHeader:{
        fontSize:16,
        color:'#333'
    },
    contentContainer: {
        backgroundColor: '#fff',
    },
    topContent: {
        flexDirection: 'row',
        paddingTop: 6,
        paddingBottom: 6
    },
    addContent: {
        width: screenW*0.5,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ECECEC',
        borderRightWidth: 1,
    },
    border_colorBottom :{
        borderColor:'#ddd',
        borderBottomWidth:1,
    },
    border_top:{
        borderTopWidth:1,
    },
    weekChose:{
        flexDirection:'row',
        width:30,
        height:30,
        margin:5,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center'
    },
    weekChose2:{
        flexDirection:'row',
        width:30,
        height:30,
        margin:5,
        borderRadius:20,
        backgroundColor:'#e15151',
        justifyContent:'center',
        alignItems:'center'
    },
    addCustomer:{
        flex:1,
        position:'absolute',
        top:screenH*0.2,
        left:screenW*0.05
    },
    addCustomer_2:{
        flex:1,
        position:'absolute',
        bottom:0
    },
    addCustomer_bm:{
        width:screenW,
        position:'absolute',
        bottom:0,
        height:screenH*0.52,
        backgroundColor:'#ddd'
    },

    addCustomer_c:{
        flex:1,
        position:'absolute',
        bottom:screenH*0.015,
    },
    addCustomer_card2:{
        width:screenW*0.9,
        height:screenH*0.55,
        backgroundColor:'#fff',
        paddingLeft:10,
        paddingRight:10,
    },
    addCustomer_card:{
        width:screenW,
        height:screenH*0.25,
        backgroundColor:'#fff',
    },

    addCustomer2:{
        flex:1,
        position:'absolute',
        top:screenH*0.3
    },
    addCustomer_card22:{
        width:screenW*0.9,
        height:130,
        backgroundColor:'#fff',
        borderRadius:3,
        marginLeft:screenW*0.05,
    },
    customerCard_content22:{
        justifyContent:'center',
        height:30,
        width:screenW,
        paddingLeft:20
    },
    customerCard_content23:{
        borderBottomWidth:0,
    },
    flex_row:{
        flexDirection:'row',
    }
});

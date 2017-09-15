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
    ListView,
    Alert,
    TextInput,
    TouchableOpacity,
    DeviceEventEmitter,

} from 'react-native';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

import ImagePicker from 'react-native-image-picker';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import ProcessModal from '../../common/processModal';
import Picker from 'react-native-picker';
export default class formDetail extends Component {


    constructor(props,context) {
        super(props,context);
        this.state = {
            forminfo:'',  //表单的数据
            checkBoxData: [], //多选框所有选项值
            checkedData: [], //多选框 选中的选项的值
            imgs:[],

            form_id:'',//表单id
            approver_people:[],//审批人
            modalVisible: false,//模态场景是否可见


        };
    }

    //时间插件
    pass_sing(e){
        global .time_sing=e;
    }
    //时间插件


    //选择图片 打开相机
    pic(){
        var options = {
            title: '',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = {uri: response.uri};
                this.state.imgs.push(response.uri);
                this.setState({})
            }
        })
    }


  //选择图片 打开相机

    //piker 时间
    _showTimePicker(e) {

        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for(let i=1;i<51;i++){
            years.push(i+1980);
        }
        for(let i=1;i<13;i++){
            months.push(i);
        }
        for(let i=1;i<32;i++){
            days.push(i);
        }
        for(let i=1;i<25;i++){
            hours.push(i);
        }
        for(let i=1;i<61;i++){
            minutes.push(i);
        }
        let pickerData = [years, months, days, hours, minutes];
        let date = new Date();
        let selectedValue = [
            [date.getFullYear()],
            [date.getMonth()+1],
            [date.getDate()],
            [date.getHours() ],
            [date.getHours() === 12 ? 12 : date.getHours()%12],
            [date.getMinutes()]
        ];
        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            pickerTitleText: '选择日期和时间',
            wheelFlex: [2, 1, 1, 1, 1, 1],
            onPickerConfirm: pickedValue => {

                this.setState({
                    [e]:pickedValue[0]+'年'+pickedValue[1]+'月'+pickedValue[2]+'日'+pickedValue[3]+'时'+pickedValue[4]+'分',
                })
            },
            onPickerCancel: pickedValue => {
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if(parseInt(targetValue[1]) === 2){
                    if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                        targetValue[2] = 29;
                    }
                    else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                        targetValue[2] = 28;
                    }
                }
                else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                    targetValue[2] = 30;
                }
                if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    targetValue.map((v, k) => {
                        if(k !== 3){
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
    }
//piker 时间



    //接收表单id  查出表单的的详情
    componentDidMount() {
        var url = config.api.base + config.api.formDeatail;
        request.post(url,{
            id: this.props.navigation.state.params.id,
        }).then((responseJson) => {
            //Alert.alert(JSON. stringify(responseJson));
            this.setState({
                forminfo:responseJson,
                form_id:responseJson[0].form_id,
            })
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })



        //接收审批人
        this.subscription = DeviceEventEmitter.addListener('choosePeople',(value) => {
            //接收的类型的id查类型的名称
            this.setState({
                approver_people:value
            })
        })
        //接收审批人


        //多选框的选项
        this.subscription = DeviceEventEmitter.addListener('checkbox_value',(value) => {
            //接收的类型的id查类型的名称
            var checkbox_inputsin=value['sing'];
            if(value['data'].length>1){
                this.setState({
                    [checkbox_inputsin]:value['data'].join(",")
                })
            }else{

                this.setState({
                    [checkbox_inputsin]:value['data']
                })
            }

        })
        //多选框的选项
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    back() {
        this.props.navigation.goBack(null);
    }


    //选择审批人
    select_approve_peopel(){
        this.props.navigation.navigate('select_approve_peopel',{selected_peopel:this.state.approver_people,company_id: this.props.navigation.state.params.company_id});
    }

    //多选框 跳转选择
    checkbox_select(e){
        this.props.navigation.navigate('checkbox_select',{sing:e,optionvaue:this.state[e]});

    }

    //点击确认按钮
    addproduct() {
        //判断是否选择了审批人
        if(this.state.approver_people.length==0){
            return toast.center('请选择审批人');
        }

        //排除照片 的标识
        var inputsing=[];  //['sing15','sing16','sing17']
        for(var i in this.state.forminfo) {
            if (this.state.forminfo[i]['field_type'] == '照片') {
            } else {
                inputsing.push(this.state.forminfo[i]['sing']);
            }
        }

        //将图片放入 formdata
        let formData = new FormData();
        for(var imgi in this.state.imgs){
            let file = {uri: this.state.imgs[imgi], type: 'multipart/form-data',name:this.state.imgs[imgi]};
            formData.append(this.state.imgs[imgi],file);
        }

        //将照片之外的 放入formdata  {['sing15',cheer]，['sing20',男]}
        for(var i in inputsing){
            formData.append(inputsing[i],this.state[inputsing[i]]);
        }


        //将表单的id 放入formdata 给PHP使用
        formData.append('form_id',this.state.form_id);
        formData.append('user_id',this.props.navigation.state.params.user_id);
        formData.append('company_id',this.props.navigation.state.params.company_id);

        //将审批人放入 formdata  只能传递字符串
        var appprover_people_info=[];
        for(var i in this.state.approver_people){
            appprover_people_info.push(this.state.approver_people[i].id+','+this.state.approver_people[i].depart_id+','+this.state.approver_people[i].company_id);
        }
        formData.append('approver_peopel',appprover_people_info.join("--"));


        var url=config.api.base + config.api.sava_form;
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data'
            },
            body:formData
        })
            .then((response) => response.json() )
            .then((res)=>{

                if(res.sing==0){
                    toast.center(res.msg);
                }else if(res.sing==1){
                    toast.center(res.msg);
                }
            })
            .catch((error)=>{
                toast.bottom('网络连接失败，请检查网络后重试');
            });
    };
    //点击确认按钮


    //将多选的 生成二维数组 就可以存储多个多选框了
    initCheckBoxData(t,a){
        if(t!=null){
            this.state.checkBoxData.push({checkboxsing:a,checkvalue:t});
        }
    }

    render() {

        //图片
        var imglist=[];
        for(var i in this.state.imgs){
            imglist.push(
                <View style={{paddingLeft:screenW*0.025,paddingTop:screenW*0.02,}}>
                    <Image style={{width:screenW*0.22,height:screenW*0.22,borderColor:'#d3d3d3',borderWidth:1}} source={{uri: this.state.imgs[i]}}/>
                </View>
            )
        }
        //图片



        //审批人
        var approverlist=[];
        for(var i in this.state.approver_people){
            approverlist.push(
                <View style={{flexDirection: 'row',alignItems: 'center'}} key={i}>
                    <View style={{paddingLeft:screenW*0.025,paddingTop:screenW*0.02,}}>
                        <Image style={{width:screenW*0.1,height:screenW*0.1,borderColor:'#d3d3d3',borderWidth:1,borderRadius:screenW*0.05}} source={{uri: this.state.approver_people[i]['avatar']}}/>
                        <Text style={{fontSize:12}}>{this.state.approver_people[i]['name']}</Text>
                    </View>
                    {this.state.approver_people[i-(-1)] &&<Image style={{height:16,width: 16}}
                                                                 source={require('../../imgs/rjt.png')}/>}
                </View>
            )
        }
        //审批人


        var forminfo=this.state.forminfo; //表单数据
        var list=[];
        var forminfo_length=forminfo.length; //form表单字段的格式

        for(var i in forminfo){
            let textName = forminfo[i].sing;
            if(forminfo[i].field_type=='单行文本'){
                list.push(
                    <View style={[styles.divCom]} key={i}>
                        <View style={[styles.divRowCom]}>
                            <Text style={[styles.divFontCom]}>{forminfo[i].field_name}</Text>
                            <TextInput
                                style={styles.inputStyle}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(t) => this.setState({[textName]:t})}
                            />
                        </View>
                    </View>
                )
            }

            else if(forminfo[i].field_type=='多行文本'){
                list.push(
                    <View style={[styles.divCom]} key={i}>
                        <View style={[styles.divRowCom1]}>
                            <Text style={[styles.divFontCom]}>{forminfo[i].field_name}</Text>
                            <TextInput
                                multiline={true}
                                style={{ height: 50, width:280}}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(t) => this.setState({[textName]:t})}
                            />
                        </View>
                    </View>
                )

            }else if(forminfo[i].field_type=='单选'){
                var optionvalue=[];//单选的选项值
                for (var j=1;j<=5;j++){
                    var optionkey='data'+'_'+j;
                    if(forminfo[i][optionkey]!=null){
                        optionvalue.push(forminfo[i][optionkey])
                    }
                }

                var radio_props = [];//赋值给 单选框的组件数组
                for(var  n in optionvalue){
                    radio_props.push({label:optionvalue[n],value:optionvalue[n]});
                }

                list.push(


                    <View style={[styles.divCom]} key={i}>
                        <View style={[styles.divRowCom1]}>
                            <Text style={[styles.divFontCom]}>{forminfo[i].field_name}</Text>
                            <Text style={[styles.divFontCom]}>{this.state[textName]}</Text>
                            <ScrollView>


                                <ProcessModal
                                    processModal={false}
                                    radio_data={radio_props}
                                    onPress={(value) => {this.setState({[textName]:value})}}
                                />

                            </ScrollView>
                        </View>
                    </View>
                )
            }else if(forminfo[i].field_type=='多选'){

                list.push(
                    <View style={[styles.divCom]} key={i}>
                        <View style={[styles.divRowCom2]}>
                            <Text style={[styles.divFontCom,{width:50}]}>{forminfo[i].field_name}</Text>
                            <Text style={[styles.divFontCom]}>{this.state[textName]}</Text>
                            <View style={{flexWrap:'wrap',width:screenW-70,flexDirection:'row'}}>

                                <TouchableOpacity   onPress={()=>this.checkbox_select(textName)}>

                                    <Image style={styles.imgStyle} source={require('../../imgs/customer/arrow_r.png')}/>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                )
            }else if(forminfo[i].field_type=='日期'){
                let isPickerVisible=forminfo[i].datesing;
                list.push(
                    <View style={[styles.divCom]} key={i}>
                        <View style={[styles.divRowCom1]}>
                            <Text style={[styles.divFontCom]}>{forminfo[i].field_name}</Text>
                            <Text>{this.state[textName]}</Text>
                            <TouchableOpacity  onPress= { () => {this.setState({ [isPickerVisible]:true });this.pass_sing(textName)}}>
                                <Image style={{marginLeft:30,width:20,height:20}} source={require('../../imgs/icon_shenpi/rili.png')}/>
                            </TouchableOpacity>



                            <DateTimePicker
                                cancelTextIOS = "取消"
                                confirmTextIOS = "确定"
                                titleIOS = "选择日期"
                                mode="date"
                                datePickerModeAndroid="spinner"
                                isVisible={this.state[isPickerVisible]}
                                onConfirm={(date) => {this.setState({[textName]: moment(date).format('YYYY-MM-DD'),[isPickerVisible]: false })}}
                                onCancel={() => this.setState({ [isPickerVisible]: false })}
                            />
                        </View>
                    </View>
                )
            }else if(forminfo[i].field_type=='日期和时间'){

                list.push(
                    <View style={[styles.divCom]} key={i}>
                        <View style={[styles.divRowCom1]}>
                            <Text style={[styles.divFontCom]}>{forminfo[i].field_name}</Text>
                            <Text>{this.state[textName]}</Text>
                            <TouchableOpacity style={{marginTop: 10, marginLeft: 20}} onPress={this._showTimePicker.bind(this,textName)}>
                                <Image style={{marginLeft:30,width:20,height:20}} source={require('../../imgs/icon_shenpi/rili.png')}/>
                            </TouchableOpacity>

                        </View>
                    </View>
                )
            }else if(forminfo[i].field_type=='照片'){
                list.push(
                    <View style={[styles.divCom]} key={i}>
                        <View style={[styles.divRowCom]}>
                            <Text style={[styles.divFontCom]}>{forminfo[i].field_name}</Text>
                            <TouchableOpacity  onPress={()=>{this.pic()}} >
                                <Image style={{marginLeft:30,width:20,height:20}} source={require('../../imgs/icon_shenpi/xiangji.png')}/>
                            </TouchableOpacity>

                        </View>
                        <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:screenW*0.02}}>
                            {imglist}
                        </View>
                    </View>
                )
            }
        }



        for( var j in list){
            list.push(
                <View style={[styles.divCom]} key={forminfo_length}>
                    <View style={[styles.divRowCom1]}>
                        <Text style={[styles.divFontCom]}>审批人</Text>
                        <TouchableOpacity   onPress={()=>this.select_approve_peopel()}>
                            <Image style={{marginLeft:30,width:20,height:20}} source={require('../../imgs/icon_shenpi/jiahao.png')}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:screenW*0.02}}>
                        {approverlist}
                    </View>
                </View>

            )
        }




        return (
            <View style={styles.body}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                {/*导航栏*/}
                <View style={styles.nav}>
                    <TouchableHighlight
                        onPress={()=>this.back()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Image source={require('../../imgs/navxy.png')}/>
                            <Text style={[styles.fSelf,styles.navltyszt]}>返回</Text>
                        </View>

                    </TouchableHighlight>
                    <Text style={styles.fSelf}>{this.props.navigation.state.params.formname}</Text>
                    <TouchableHighlight
                        onPress={()=>this.addproduct()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={styles.navltys}>
                            <Text  onPress={this.addproduct.bind(this)} style={styles.navFont}>提交</Text>
                        </View>
                    </TouchableHighlight>
                </View>

                {/*内容主题*/}
                <ScrollView style={styles.childContent}>
                    <View style={[styles.ancestorCon]}>
                        {list}
                    </View>
                </ScrollView>


            </View>
        )

    }
}

const styles = StyleSheet.create({
    //nav
    navltys: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: (Platform.OS === 'ios') ? 50 : 30,
        alignItems: 'center',
    },
    navltyszt: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#e4393c',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    body: {//祖先级容器
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    nav: {//头部导航
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    sz: {//导航图标
        width: 30,
        height: 30
    },
    fSelf: {//导航字体相关
        color: '#000',
        //height: 30,
        fontSize: 16
    },
    navltysImg: {
        width: 24,
        height: 24,
    },
//    主题内容
    childContent: {//子容器页面级
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#F8F8F8',
    },

    //页签切换
    ancestorCon: {//祖先级
        //flex: 1,
    },
    divTit: {//祖级--区域-主题内容title部分
        flexDirection: 'row',
        //justifyContent: 'space-around',
        height: 30,
        paddingTop: 5,
        marginBottom: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleCon: {//父级-块
        width: screenW * 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#a4a4a4',
    },
    eleFontCon: {//子级-字体
        fontSize: 12,
    },
    eleSelf: {//私有级
        borderRightWidth: 1,
        borderColor: '#e3e3e3',
    },
    eleImgCon: {//子级-图片
        marginRight: 5,
    },

    //内容模块
    divCom: {//祖先级-区域
        flex:1,
    },
    rowCom: {//祖级-行
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:'#F1F2F3',
    },

    eleTopCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:5
    },
    comLeft:{//次父级-次级块

    },
    comRight:{//次父级-次级块

    },
    elefontCom:{//子级-E
        fontSize:10,
        color:'#969696',
    },


    eleBottomCom: {//父级-块
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },
    navltysImgSelf:{//子级-E-图片-文件夹
        width:14,
        height:14,
    },


//    内容区域
    divRowCom:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 40,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },

    divRowCom1:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 60,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },

    divRowCom2:{//父级-行
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
        height: 60,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center'
    },
    divFontCom:{//子级-E
        color:'#939393',
    },
    divRowSelf:{//私有级
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#F3F3F3',
    },
    divFontSelf:{//私有级
        marginTop:10
    },
    divRowSelfBottomBorder:{
        borderBottomWidth:1,
        borderBottomColor:'#E9E9E9',
    },
    inputStyle: {
        height: 40,
        width:280
    },

    addCustomer_c:{
        flex:1,
        position:'absolute',
        bottom:screenH*0.02,
    },
    addCustomer_card:{
        width:screenW*0.9,
        height:screenH*0.3,
        backgroundColor:'#fff',
        marginLeft:screenW*0.05,

    },
    addCustomer_card_1:{
        height:screenH*0.15,
        borderRadius:4
    },
    addCustomer_card_2:{
        marginTop:10,
        height:screenH*0.07,
        borderRadius:4
    },
    addCustomer_card_3:{
        paddingLeft:screenW*0.02,
        paddingRight:screenW*0.02,
    },
    customerCard_content:{
        justifyContent:'center',
        alignItems:'flex-start',
        height:screenH*0.075,
        borderBottomColor:'#ddd',
    },
    customerCard_content_2:{
        alignItems:'center',
    },
    customerCard_content_3:{
        paddingLeft:10,
    },
    customerCard_content2:{
        borderBottomWidth:1,
    },
});

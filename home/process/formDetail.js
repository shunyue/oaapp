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
    Picker,
} from 'react-native';
const screenW = Dimensions.get('window').width;

import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

import ImagePicker from 'react-native-image-crop-picker';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CheckBox from 'react-native-check-box'
export default class formDetail extends Component {


    constructor(props) {
        super(props);
        this.state = {
            forminfo:'',  //表单的数据
            checkBoxData: [], //多选框所有选项值
            checkedData: [], //多选框 选中的选项的值
            imgs:[],

            form_id:'',//表单id
            approver_people:[],//审批人


        };
    }

    //时间插件
    pass_sing(e){
        global .time_sing=e;
    }
    //时间插件


    //选择图片
    pic(){
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
         this.state.imgs.push(image.path);
            this.setState({
            })
        });
    }
    //选择图片


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
    }

    componentWillUnmount() {
        this.subscription.remove();
    }




    back() {
        this.props.navigation.goBack(null);
    }


    //选择审批人
    select_approve_peopel(){
        this.props.navigation.navigate('select_approve_peopel',{selected_peopel:this.state.approver_people});
    }

    //点击确认按钮
    addproduct() {


         //判断是否选择了审批人
         if(this.state.approver_people.length==0){
            return toast.center('请选择审批人');
         }



        //排除 多选和照片 的标识
        var inputsing=[];
        for(var i in this.state.forminfo) {
            if (this.state.forminfo[i]['field_type'] == '多选' || this.state.forminfo[i]['field_type'] == '照片') {
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

       //将除多选 照片之外的 放入formdata
        for(var i in inputsing){
            formData.append(inputsing[i],this.state[inputsing[i]]);
        }


        //获取多选的值 处理多个多选框
        for (var i = 0; i < this.state.checkBoxData.length; i++) {
            if (this.state.checkBoxData[i] != null && this.state.checkBoxData[i].checkvalue.state.isChecked == true) {
                this.state.checkedData.push({checkboxsing:this.state.checkBoxData[i].checkboxsing,checkboxselected:this.state.checkBoxData[i].checkvalue.props.value});
            }
        }
        var checkbox_manage1=[];
        for(var i in this.state.checkedData){
            checkbox_manage1.push(this.state.checkedData[i].checkboxsing[0]+','+this.state.checkedData[i].checkboxselected);
        }
        var checkbox_manage2=[]
        for(var i in checkbox_manage1){
            checkbox_manage2.push(checkbox_manage1[i].split(','));
        }
        var checkbox_manage3=[];
        for(var i in checkbox_manage2) {
            checkbox_manage3[checkbox_manage2[i][0]]+=','+checkbox_manage2[i][1];
        }
        var checkbox_manage4=[];
        for(var i in checkbox_manage3){
           var checkboxvaluenew=checkbox_manage3[i].replace('undefined',"");
            checkbox_manage4[i]=checkboxvaluenew;
        }
        //获取多选的值 处理多个多选框

        //将多选框 放入formdata
        for(var i in checkbox_manage4){
            formData.append(i,checkbox_manage4[i]);
        }
        //将多选框 放入formdata

        //将表单的id 放入formdata 给PHP使用
        formData.append('form_id',this.state.form_id);

        //将审批人放入 formdata  只能传递字符串
        var appprover_people_info=[];
        for(var i in this.state.approver_people){
            appprover_people_info.push(this.state.approver_people[i].id+','+this.state.approver_people[i].depart_id+','+this.state.approver_people[i].company_id);
        }
        formData.append('approver_peopel',appprover_people_info.join("--"));


        //console.log(formData);
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
               // Alert.alert(JSON.stringify(res));
               // console.log(JSON.stringify(res));
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
                             <ScrollView>
                             <RadioForm style={{marginLeft:40,flexWrap:'wrap',}}
                                 radio_props={radio_props}
                                 buttonSize={10}
                                 formHorizontal={true}
                                 onPress={(t) => {this.setState({[textName]:t})}}
                             />
                             </ScrollView>
                         </View>
                         </View>
                     )
                   }else if(forminfo[i].field_type=='多选'){
                       var optionvalue=[];//多选选项值
                       for (var j=1;j<=5;j++){
                           var optionkey='data'+'_'+j;
                           if(forminfo[i][optionkey]!==''){
                               optionvalue.push(forminfo[i][optionkey])
                           }
                       }
                       var listcheck=[];
                       for(var j in optionvalue){


                           listcheck.push(
                                <View key={j} style={{flexDirection:'row',padding:3}}>
                                    <Text>&nbsp;&nbsp;&nbsp;{optionvalue[j]}&nbsp;</Text>
                                    <CheckBox
                                        ref={(t,a)=>this.initCheckBoxData(t,[textName])}
                                        onClick={()=>{}}
                                        value={optionvalue[j]}
                                        isChecked={false}
                                        style={[styles.checkBox]}
                                        checkedImage={<Image source={require('../../imgs/icon_shenpi/xuanzhong.png')}/>}
                                        unCheckedImage={<Image source={require('../../imgs/icon_shenpi/weixuanzhong.png')}/>}
                                    />
                                </View>

                           )


                       }
                       list.push(
                           <View style={[styles.divCom]} key={i}>
                               <View style={[styles.divRowCom2]}>
                                   <Text style={[styles.divFontCom,{width:50}]}>{forminfo[i].field_name}</Text>
                                   <View style={{flexWrap:'wrap',width:screenW-70,flexDirection:'row'}}>
                                       {listcheck}
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
                                       mode="datetime"
                                       is24Hour="true"
                                       datePickerModeAndroid="spinner"
                                       isVisible={this.state[isPickerVisible]}
                                       onConfirm={(date) => {this.setState({[textName]: moment(date).format('YYYY-MM-DD HH:mm'),[isPickerVisible]: false })}}
                                       onCancel={() => this.setState({ [isPickerVisible]: false })}
                                   />

                               </View>
                           </View>
                       )
                   }else if(forminfo[i].field_type=='照片'){
                       list.push(
                           <View style={[styles.divCom]} key={i}>
                               <View style={[styles.divRowCom]}>
                                   <Text style={[styles.divFontCom]}>{forminfo[i].field_name}</Text>
                                   <TouchableOpacity onPress={()=>this.pic()} >
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
    }
});

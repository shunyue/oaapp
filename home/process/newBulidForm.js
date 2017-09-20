/*
* 新建表单模板
* */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    PixelRatio,
    Modal,
    Dimensions,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //添加拦位
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            //添加拦位
            form_name:'', //表单名称
            form_icon:'http://118.178.241.223/oa/icon_shenpi/ling.png', //表单图标
            form_dec:'',  //表单描述
            form_fanwei_id:'',//表单使用范围 部门id
            form_fanwei_name:'',//表单使用范围 部门名称
            form_field:[],//表单字段
            sing_array:[],//字段标识
            sing_array_new:[]
        };
    }

    OpBack() {
        this.props.navigation.goBack(null)
    }
    //预览
    goPage_yulan() {
        var form_field_array=[];
        for(var i in this.state.sing_array_new){
            for(var j in this.state.form_field){
                if(this.state.sing_array_new[i]==this.state.form_field[j].sing){
                    form_field_array.push(this.state.form_field[j]);
                }
            }
        }
        this.props.navigation.navigate('Formyulan',{form_field:form_field_array})
    };
    //表单图标
    formiconlist() {
        this.props.navigation.navigate('Formiconlist')
    };
    //选择部门
    select_dp(){
        this.props.navigation.navigate('select_dp',{company_id:this.props.navigation.state.params.company_id,selected_dp:this.state.form_fanwei_id});
    }

    //表单字段编辑
    formfieldedit(id){
        this.props.navigation.navigate('Formfieldedit',{field_type:id})
    };
    //设置栏位显示
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    //接收监听返回的字段名 字段类型 是否必填
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('field_info',(value) => {
            var field_name=value['field_name'];
            var field_type=value['field_type'];
            var bitian=value['bitian'];
            var option1=value['option1'];
            var option2=value['option2'];
            var option3=value['option3'];
            var option4=value['option4'];
            var option5=value['option5'];
            //给表单字段赋值 二维数组添加一组数据
            //第一次添加 sing=1
            if(this.state.form_field.length==0){
                this.state.form_field.push({sing:1,field_name: field_name,field_type:field_type,bitian:bitian,option1:option1,option2:option2,option3:option3,option4:option4,option5:option5});
                this.state.sing_array_new.push(1);
            }else{
                //第一次后 sing值最大的加1 赋值
                for(var i in  this.state.form_field){
                    this.state.sing_array.push(this.state.form_field[i]['sing']);
                }
                var sing_max= Math.max.apply(null, this.state.sing_array)-(-1);
                this.state.form_field.push({sing:sing_max,field_name: field_name,field_type:field_type,bitian:bitian,option1:option1,option2:option2,option3:option3,option4:option4,option5:option5});
                this.state.sing_array_new.push(sing_max);
            }
            //必须有  重新渲染页面
            this.setState({
            });
        })
        //接收图标
        this.subscription = DeviceEventEmitter.addListener('formicon',(value) => {
            this.setState({
                form_icon:value,
            });
        })

        //接收部门
        this.subscription = DeviceEventEmitter.addListener('dp',(value) => {
            var dp_id=[];
            var dp_name=[];
            for(var i in value ){
                dp_id.push(value[i].id);
                dp_name.push(value[i].depart_name);
            }
            this.setState({
                form_fanwei_id:dp_id.join(","),
                form_fanwei_name:dp_name.join(","),
            });
        })
    }
    componentWillUnmount() {
        this.subscription.remove();
        this.subscription.remove();
    }

    //删除字符
    del_field(e){
        this.state.sing_array_new.splice( this.state.sing_array_new.indexOf(e), 1);
        this.setState({
        });
    }
    //判断字段是否有效
    if_isset(e){
        for(var i  in this.state.sing_array_new){
            if(this.state.sing_array_new[i]==e){
                return true;
            }
        }
        return false;
    }

    //保存表单
    save(){
        if(this.state.form_name==''){
            return toast.center('表单名称不能为空');
        }
        if(this.state.form_dec==''){
            return toast.center('表单描述不能为空');
        }
        if(this.state.form_fanwei==''){
            return toast.center('表单使用范围不能为空');
        }
        if(this.state.sing_array_new==''){
            return toast.center('表单字段不能为空');
        }
        var form_field_array=[];
        for(var i in this.state.sing_array_new){
            for(var j in this.state.form_field){
                if(this.state.sing_array_new[i]==this.state.form_field[j].sing){
                    form_field_array.push(this.state.form_field[j]);
                }
            }
        }
        //照片字段只能保留一个
        var img_field_num=[]
        for(var i in form_field_array){
            if(form_field_array[i].field_type=='照片'){
                img_field_num.push(form_field_array[i])
            }
        }
         if(img_field_num.length>1){
             return toast.center('照片字段只能有一个');
         };

        var url = config.api.base + config.api.addform;
        request.post(url,{
            company_id:this.props.navigation.state.params.company_id,
            name: this.state.form_name,//表单名称
            icon: this.state.form_icon,//表单图标
            dec: this.state.form_dec,//表单描述
            fanwei: this.state.form_fanwei_id,//表单范围
            field: form_field_array,//表单字段
        }).then((responseJson) => {
            if(responseJson.sing==0){
                toast.center('添加失败');
            }
            if(responseJson.sing==1){
                toast.center('添加成功');
                this.props.navigation.navigate('Approvalfaqi')
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    render() {
        var list=[];
        var form_field =this.state.form_field;
        for (var i in form_field) {
            if(this.if_isset(form_field[i].sing)==false){
                list.push(
                    <View style={[styles.module_name,styles.module_]} key={i} style={{display:'none'}}>
                        <TouchableHighlight onPress={this.del_field.bind(this,form_field[i].sing)} underlayColor={'#F3F3F3'}>
                            <Image  style={styles.back_icon} source={require('../../imgs/shenpi/shanchu .png')}/>
                        </TouchableHighlight>
                        <Text style={{marginLeft:25,width:80,}}>{form_field[i].field_name}</Text>
                        <Image  style={{marginLeft:70,width:14, height:14}} source={require('../../imgs/shenpi/chilun.png')}/>
                        <Text style={{marginLeft:10,width:80,}}>{form_field[i].field_type}</Text>
                        <Text style={{marginLeft:10}}>{form_field[i].bitian}</Text>
                    </View>
                )
            }else{
                list.push(
                    <View style={[styles.module_name,styles.module_]} key={i} >
                        <TouchableHighlight onPress={this.del_field.bind(this,form_field[i].sing)} underlayColor={'#F3F3F3'}>
                            <Image  style={styles.back_icon} source={require('../../imgs/shenpi/shanchu .png')}/>
                        </TouchableHighlight>
                        <Text style={{marginLeft:25,width:80,}}>{form_field[i].field_name}</Text>
                        <Image  style={{marginLeft:70,width:14, height:14}} source={require('../../imgs/shenpi/chilun.png')}/>
                        <Text style={{marginLeft:10,width:80,}}>{form_field[i].field_type}</Text>
                        <Text style={{marginLeft:10}}>{form_field[i].bitian}</Text>
                    </View>
                )
            }
        }

        //添加拦位
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 20 }
            : null
        //添加拦位
        return (
            <View style={styles.ancestorCon}>
                {Platform.OS === 'ios'? <View style={{height: 20,backgroundColor: '#fff'}}></View>:null}
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.formHeader}>创建审批模板</Text>
                    <TouchableOpacity style={[styles.goRight,styles.go]}  onPress={()=>this.save()}>
                        <Text style={[styles.back_text]} >保存</Text>
                    </TouchableOpacity>
                </View>


                <ScrollView style={{height:screenH*0.7}} key={'ScrollView'}>
                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>模板名称</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(form_name) => this.setState({form_name})}
                            placeholder ={this.state.form_name}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <TouchableHighlight
                        onPress={()=>this.formiconlist()}
                        underlayColor="#d5d5d5"
                    >
                        <View style={[styles.module_name,styles.module_]}>
                            <Text style={{marginRight:15}}>模板图标</Text>
                            <TextInput
                                style={styles.input_text}
                                placeholderTextColor={"#aaaaaa"}
                                underlineColorAndroid="transparent"
                                editable={false}
                            />
                            <View>
                                <Image style={{width:30,height:30}}  source={{uri:this.state.form_icon}}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>描述</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(form_dec) => this.setState({form_dec})}
                            placeholder ={this.state.form_dec}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <TouchableHighlight
                        onPress={()=>this.select_dp()}
                        underlayColor="#d5d5d5"
                    >
                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>使用范围</Text>
                        <TextInput
                            style={styles.input_text}
                            placeholder ={this.state.form_fanwei_name}
                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            editable={false}
                        />
                        <Image style={styles.imgStyle} style={{width:12,height:12}} source={require('../../imgs/customer/arrow_r.png')}/>
                    </View>
                    </TouchableHighlight>

                    <View style={[styles.module_handle,styles.module_]}>
                        <Text style={{marginRight:10}}>删除</Text>
                        <View style={{flexDirection :'row',alignItems:'center',backgroundColor: '#fff',}}>
                            <Text style={{marginRight:4}}>栏目名称</Text>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/bianji.png')}/>
                        </View>
                        <View style={{width:screenW*0.47,flexDirection :'row',alignItems:'center',justifyContent:'center'}}>
                            <Text>设置类型</Text>
                        </View>
                        <Text>是否必填</Text>
                    </View>

                    <View>
                        {list}
                    </View>
                </ScrollView>


                <View style={styles.module_foot}>
                    <TouchableOpacity style={styles.Nav_p} onPress={() => {
          this.setModalVisible(true)
        }}>
                        <Image style={[styles.icon_nav2]} source={require('../../imgs/customer/lanwei.png')}/>
                        <Text style={styles.custom_sub}>添加栏位</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Nav_p} onPress={() => this.goPage_yulan()}>
                        <Image style={styles.icon_nav3} source={require('../../imgs/customer/yulan.png')}/>
                        <Text style={styles.custom_sub}>预览</Text>
                    </TouchableOpacity>
                </View>

                {/*模态框*/}
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Modal
                        animationType={'none'}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this._setModalVisible(false) } }

                    >

                        <TouchableOpacity  style={{width:screenW,height:screenH,backgroundColor:'#000',opacity:0.6,}}  onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>

                        </TouchableOpacity >
                        <View style={{backgroundColor:'#fff',width:screenW*0.7,height:screenH*0.8,position:'absolute',top:screenH*0.1,left:screenW*0.15}}>
                            <Text style={{fontSize:16,marginTop:20,marginLeft:10}}>请选择</Text>
                            <TouchableHighlight onPress={() => {this.formfieldedit('单行文本');this.setModalVisible(!this.state.modalVisible)}}>
                                <View    style={[styles.field]}>
                                    <Text style={{marginLeft:25}}>单行文本</Text>
                                    <Image  style={{marginLeft:80,width:14, height:14}} source={require('../../imgs/shenpi/yuanquan.png')}/>
                                </View>
                            </TouchableHighlight>


                            <TouchableHighlight onPress={() => {this.formfieldedit('多行文本');this.setModalVisible(!this.state.modalVisible)}}>
                                <View style={[styles.field]}>
                                    <Text style={{marginLeft:25}}>多行文本</Text>
                                    <Image  style={{marginLeft:80,width:14, height:14}} source={require('../../imgs/shenpi/yuanquan.png')}/>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={() => {this.formfieldedit('单选');this.setModalVisible(!this.state.modalVisible)}}>
                                <View style={[styles.field]}>
                                    <Text style={{marginLeft:25}}>单选</Text>
                                    <Image  style={{marginLeft:110,width:14, height:14}} source={require('../../imgs/shenpi/yuanquan.png')}/>
                                </View>
                            </TouchableHighlight>


                            <TouchableHighlight onPress={() => {this.formfieldedit('多选');this.setModalVisible(!this.state.modalVisible)}}>
                                <View style={[styles.field]}>
                                    <Text style={{marginLeft:25}}>多选</Text>
                                    <Image  style={{marginLeft:110,width:14, height:14}} source={require('../../imgs/shenpi/yuanquan.png')}/>
                                </View>
                            </TouchableHighlight>


                            <TouchableHighlight onPress={() => {this.formfieldedit('日期');this.setModalVisible(!this.state.modalVisible)}}>
                                <View style={[styles.field]}>
                                    <Text style={{marginLeft:25}}>日期</Text>
                                    <Image  style={{marginLeft:110,width:14, height:14}} source={require('../../imgs/shenpi/yuanquan.png')}/>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={() => {this.formfieldedit('日期和时间');this.setModalVisible(!this.state.modalVisible)}}>
                                <View style={[styles.field]}>
                                    <Text style={{marginLeft:25}}>日期和时间</Text>
                                    <Image  style={{marginLeft:69,width:14, height:14}} source={require('../../imgs/shenpi/yuanquan.png')}/>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight onPress={() => {this.formfieldedit('照片');this.setModalVisible(!this.state.modalVisible)}}>
                                <View style={[styles.field]}>
                                    <Text style={{marginLeft:25}}>照片</Text>
                                    <Image  style={{marginLeft:110,width:14, height:14}} source={require('../../imgs/shenpi/yuanquan.png')}/>
                                </View>
                            </TouchableHighlight>

                            <Text onPress={() => {this.setModalVisible(!this.state.modalVisible)}} style={{fontSize:16,marginLeft:200,marginTop:20,color:'#387FFF'}}>取消</Text>

                        </View>
                    </Modal>
                    {/*模态框*/}
                </View>
            </View>
        );
    }
    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
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
        top:8
    },
    goback:{
        left:15,
        flexDirection :'row',
    },
    goRight:{
        right:20
    },
    back_icon:{
        width:14,
        height:14,
    },
    back_text:{
        color:'#e15151',
        fontSize: 16,
        marginLeft:6
    },
    formHeader:{
        fontSize:16
    },
    module_name:{
        height:40,
    },
    module_:{
        width:screenW,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor:'#ddd',

        paddingLeft:15,
        flexDirection:'row',
        alignItems:'center'
    },
    module_handle:{
        height:32,
    },
    input_text:{
        width:screenW*0.64,
        height:40
    },
    module_foot: {
        height:66,
        flexDirection :'row',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        bottom:0,
        backgroundColor:'#fff',
        width: screenW,
        borderTopColor:'#ddd',
        borderTopWidth: 1,
    },
    Nav_p:{
        justifyContent:'center',
        paddingLeft: screenW*0.1,
        paddingRight: screenW*0.1,
    },
    custom_sub: {
        fontSize: 14,
        color: '#e15151',
    },
    subNav: {
        height:40,
        justifyContent:'center',
        flexDirection:'row',
        marginTop:95,
        paddingTop:9,
        paddingBottom:8,
        borderTopColor:'#ccc',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor:'#ccc',
    },
    subNav_sub:{
        flexDirection:'row',
        justifyContent:'center',
        paddingLeft: 17,
        paddingRight: 17,
    },
    subNav_sub_border:{
        borderLeftWidth: 1,
        borderColor:'#ccc',
    },
    subNav_subColor:{
        color:'#e15151',
    },
    subNav_img:{
        width:20,
        height:20
    },
    icon_nav2:{
        width: 22,
        height: 22,
        marginLeft:18,
    },
    icon_nav3:{
        width: 21,
        height: 21,
        marginLeft:3
    },

    field:{
        height:40,
        width:screenW,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor:'white',
        marginTop:10,
        paddingLeft:15,
        flexDirection:'row',
        alignItems:'center'
    },

    //模态框
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
    },
    row: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
        flex: 1,
        fontWeight: 'bold',
    },
    button: {
        borderRadius: 5,
        flex: 1,
        height: 44,
        alignSelf: 'stretch',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center',
    },
    page: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    },
    zhifu: {
        height: 150,
    },
    flex: {
        flex: 1,
    },
    at: {
        borderWidth: 1 / PixelRatio.get(),
        width: 80,
        marginLeft:10,
        marginRight:10,
        borderColor: '#18B7FF',
        height: 1,
        marginTop: 10
    },
    date: {
        textAlign: 'center',
        marginBottom: 5
    },
    station: {
        fontSize: 20
    },
    mp10: {
        marginTop: 5,
    },
    btn: {
        width: 60,
        height: 30,
        borderRadius: 3,
        backgroundColor: '#FFBA27',
        padding: 5,
    },
    btn_text: {
        lineHeight: 18,
        textAlign: 'center',
        color: '#fff',
    },
    //模态框
});

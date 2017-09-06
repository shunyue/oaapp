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
    Switch,
    DeviceEventEmitter,
} from 'react-native';
import { StackNavigator,TabNavigator } from "react-navigation";



import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';



const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class app extends Component {
    OpBack() {
        this.props.navigation.goBack(null)

    }





    constructor(props) {
        super(props);
        this.state = {
                   name:'',
                   type:'',
                   trueSwitchIsOn: true, //必填项   必填是true 反之是FALSE


                   option1:'',//默认的两个选项
                   option2:'',//默认的两个选项
                   option3:'',//默认的两个选项
                   option4:'',//默认的两个选项
                   option5:'',//默认的两个选项
        };


    }

    //赋值类型
    componentWillMount (){
        this.getNet();
    }



    //获得字段的类型
    getNet(){
        this.setState({
            type:this.props.navigation.state.params.field_type,
        })
    }
    //赋值类型

    //确定提交
    addfield(){



        if(this.state.name==''){
           return toast.center('字段名称不能为空');
    }

        if(this.props.navigation.state.params.field_type=='单选'||this.props.navigation.state.params.field_type=='多选'){
            if(this.state.option1==''&&this.state.option2==''&&this.state.option3==''&&this.state.option4==''&&this.state.option5==''){

                return toast.center('选项不能为空');
            }
        }



        var field_name=this.state.name;
        var field_type=this.state.type;

        var bitian=this.state.trueSwitchIsOn==true ? '是':'否';

        //发送监听
        var field_info=new Array()
        field_info['field_name']=field_name;//字段名称
        field_info['field_type']=field_type;//字段类型
        field_info['bitian']=bitian;//字段是否必填
        field_info['option1']=this.state.option1;// 单选 和多选的选项值
        field_info['option2']=this.state.option2;// 单选 和多选的选项值
        field_info['option3']=this.state.option3;// 单选 和多选的选项值
        field_info['option4']=this.state.option4;// 单选 和多选的选项值
        field_info['option5']=this.state.option5;// 单选 和多选的选项值

        DeviceEventEmitter.emit('field_info', field_info);
        this.props.navigation.goBack(null);


}


    render() {



        //input 中无法使用for的变量
        //var list=[];
        //for (var i=1;i<=this.state.num;i++)
        //{
        //
        //  list.push( //单选和多选的选项
        //      <View style={[styles.module_name,styles.module_]} key={i}>
        //          <Text style={{marginRight:15}}>选项{i}</Text>
        //          <TextInput
        //              style={styles.input_text}
        //              onChangeText={(option1) => this.setState({option1})}
        //
        //              placeholderTextColor={"#aaaaaa"}
        //              underlineColorAndroid="transparent"
        //
        //          />
        //      </View>)
        //}




        if(this.props.navigation.state.params.field_type=='单选'||this.props.navigation.state.params.field_type=='多选'){


            return (

                <View style={styles.ancestorCon}>
                    <View style={styles.container}>
                        <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </TouchableOpacity>
                        <Text style={styles.formHeader}>编辑拦位</Text>
                        <TouchableOpacity style={[styles.goRight,styles.go]} onPress={()=>this.addfield()}>
                            <Text style={[styles.back_text]} >确定</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>模板名称</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(name) => this.setState({name})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>模板类型</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(type) => this.setState({type})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            value={this.state.type}
                        />
                    </View>


                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>必填项</Text>
                        <Switch style={{marginLeft:20}}
                                onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
                                value={this.state.trueSwitchIsOn} />
                    </View>



                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>选项1</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(option1) => this.setState({option1})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"

                        />
                    </View>


                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>选项2</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(option2) => this.setState({option2})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"

                        />
                    </View>

                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>选项3</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(option3) => this.setState({option3})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"

                        />
                    </View>


                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>选项4</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(option4) => this.setState({option4})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"

                        />
                    </View>

                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>选项5</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(option5) => this.setState({option5})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"

                        />
                    </View>




                </View>

            );
        }else{

            return (

                <View style={styles.ancestorCon}>
                    <View style={styles.container}>
                        <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </TouchableOpacity>
                        <Text style={styles.formHeader}>编辑拦位</Text>
                        <TouchableOpacity style={[styles.goRight,styles.go]} onPress={()=>this.addfield()}>
                            <Text style={[styles.back_text]} >确定</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>模板名称</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(name) => this.setState({name})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>模板类型</Text>
                        <TextInput
                            style={styles.input_text}
                            onChangeText={(type) => this.setState({type})}

                            placeholderTextColor={"#aaaaaa"}
                            underlineColorAndroid="transparent"
                            value={this.state.type}
                        />
                    </View>


                    <View style={[styles.module_name,styles.module_]}>
                        <Text style={{marginRight:15}}>必填项</Text>
                        <Switch style={{marginLeft:20}}
                                onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
                                value={this.state.trueSwitchIsOn} />
                    </View>



                </View>

            );


        }





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
        marginTop:10,
        paddingLeft:15,
        flexDirection:'row',
        alignItems:'center'
    },
    module_handle:{
        height:32,
    },
    input_text:{
        width:screenW*0.7,
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







});
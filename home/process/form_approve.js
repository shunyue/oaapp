//表单审批
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    TouchableHighlight,
    DeviceEventEmitter,
} from 'react-native';

const screenH = Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

export default class form_approve extends Component {

    constructor(props) {
        super(props);
        this.state = {
            launch_time:'',//发起的时间  带时分  签订日期没有时分
            avatar:'',//实例人员的的头像
            example_people_name:'',//实例人员的 的姓名
            example_form_name:'',//实例对应的表单名称

            approve_img:'',//审批状态的图片
            approve_people:'',//审批人
            form_info:[],//表单信息
            approve_idea:''//审批意见

        };
    }

    componentDidMount() {
        this.getNet1()
        this.getNet()
    }

    //判断实例状态 修改状态图标
    getNet1(){
        var url = config.api.base + config.api.example_status_byid;
        request.post(url,{
            example_id: this.props.navigation.state.params.example_id,//实例id
        }).then((responseText) => {
            if(responseText.sing==1){
                if(responseText.status==1){
                    this.setState({
                        approve_img:'http://118.178.241.223/oa/approve_status/sucss.png',
                    })
                }else if(responseText.status==2){
                    this.setState({
                        approve_img:'http://118.178.241.223/oa/approve_status/error.png',
                    })
                }else if(responseText.status==3){
                    this.setState({
                        approve_img:'http://118.178.241.223/oa/approve_status/shenpizhong.png',
                    })
                }

            }else{
                toast.bottom('网络连接失败，请检查网络后重试');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }


    getNet(){
        var url = config.api.base + config.api.form_approve;
        request.post(url,{
            example_id: this.props.navigation.state.params.example_id,//实例id
            user_id: this.props.navigation.state.params.user_id,//用户id
            company_id: this.props.navigation.state.params.company_id,//合同id
        }).then((responseText) => {

            //alert(JSON.stringify(responseText));
            if(responseText.sing==1){
                this.setState({
                    launch_time:responseText['example_info']['time'],//发起的时间  带时分  签订日期没有时分
                    avatar:responseText['example_info']['avatar'],//实例人员的的头像
                    example_people_name:responseText['example_info']['name'],//实例人员的 的姓名
                    example_form_name:responseText['example_info']['form_name'],//实例对应的表单名称
                    approve_people:responseText.approve_people,//审批人
                    form_info:responseText.form_info,//表单信息
                })
            }else{
                toast.bottom('网络连接失败，请检查网络后重试');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }


    OpBack() {
        this.props.navigation.goBack(null)
    }


    //同意
    agreement(){
        var url = config.api.base + config.api.approve_agreement;
        request.post(url,{
            example_id: this.props.navigation.state.params.example_id,//实例id
            user_id: this.props.navigation.state.params.user_id,//用户id
            company_id: this.props.navigation.state.params.company_id,//公司id
            approve_idea:this.state.approve_idea//审批意见
        }).then((responseText) => {
             alert(JSON.stringify(responseText));

            if(responseText.sing==1){
                var com_user_id=new Array()
                com_user_id['company_id']=this.props.navigation.state.params.company_id;
                com_user_id['user_id']= this.props.navigation.state.params.user_id;
                DeviceEventEmitter.emit('com_user_id',com_user_id);

                this.props.navigation.goBack(null);
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    //拒绝
    refuse(){
        var url = config.api.base + config.api.approve_refuse;
        request.post(url,{
            example_id: this.props.navigation.state.params.example_id,//实例id
            user_id: this.props.navigation.state.params.user_id,//用户id
            company_id: this.props.navigation.state.params.company_id,//公司id
            approve_idea:this.state.approve_idea//审批意见
        }).then((responseText) => {
            alert(JSON.stringify(responseText));

            if(responseText.sing==1){
                var com_user_id=new Array()
                com_user_id['company_id']=this.props.navigation.state.params.company_id;
                com_user_id['user_id']= this.props.navigation.state.params.user_id;
                DeviceEventEmitter.emit('com_user_id',com_user_id);

                this.props.navigation.goBack(null);
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    //转交
    pass_on_to(){
        this.props.navigation.navigate('pass_on_to',{user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id,example_id: this.props.navigation.state.params.example_id})
    }


    render() {
      /*  审批人*/
        var  list=[];
        if(this.state.approve_people) {
            var approve_status;
            for (var i in this.state.approve_people) {
                if(this.state.approve_people[i]['time']==null){
                    approve_status='正在审批';
                }else{
                    if(this.state.approve_people[i]['result']==1){
                        approve_status='拒绝';
                    }else if(this.state.approve_people[i]['result']==2){
                        approve_status='通过';
                    }
                }
                list.push(
                    <View key={i}>
                        <View style={[{flexDirection:'row',alignItems:'center',paddingLeft:15}]}>
                            <View
                                style={{position:'absolute',top:0,width:1,height:15,left:50,backgroundColor:'#bbb'}}></View>
                            <View
                                style={[{flexDirection:'row',alignItems:'center',paddingLeft:15},styles.padding,]}>
                                <Image style={{width:40,height:40,marginRight:10,borderRadius:25}}
                                       source={{uri:this.state.approve_people[i]['avatar']}}/>
                                <View
                                    style={{backgroundColor:'#fff',width:screenW-100,height:45,paddingLeft:15,paddingRight:15,paddingTop:5,borderRadius:5,justifyContent:'space-between',flexDirection:'row',}}>
                                    <View>
                                        <Text style={{color:'#333'}}>{this.state.approve_people[i]['name']}</Text>
                                        <Text style={{marginTop:2,fontSize:12,}}>{approve_status}</Text>
                                    </View>
                                    <Text
                                        style={{marginTop:2,fontSize:12,}}>{this.state.approve_people[i]['time']}</Text>
                                </View>

                            </View>
                            <View
                                style={{position:'absolute',bottom:0,width:1,height:15,left:50,backgroundColor:'#bbb',zIndex:0}}></View>
                        </View>
                    </View>
                )
            }
        }

        /*  审批人*/


        /*表单信息*/
        var formlist=[];
        for(var j in this.state.form_info){
            if(this.state.form_info[j]['field_type']=='照片'){
                var imglist=[];
                var imglist_value=this.state.form_info[j]['field_value'].split(",");
                for(var i in imglist_value){
                    imglist.push(
                        <View style={{paddingLeft:screenW*0.025,paddingTop:screenW*0.02,}}>
                            <Image style={{width:screenW*0.22,height:screenW*0.22,borderColor:'#d3d3d3',borderWidth:1}} source={{uri: imglist_value[i]}}/>
                        </View>
                    )
                }

                formlist.push(
                    <View key={j}>
                        <View  style={[styles.padding,styles.borderBottom,styles.borderTop,{backgroundColor:'#fff',paddingLeft:15,marginTop:10}]}>
                            <Text style={{fontSize:13}}>{this.state.form_info[j]['field_name']}</Text>
                            <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:screenW*0.02}}>
                                {imglist}
                            </View>
                        </View>
                    </View>
                )
            }else{
                formlist.push(
                    <View key={j}>
                        <View  style={[styles.padding,styles.borderBottom,styles.borderTop,{backgroundColor:'#fff',paddingLeft:15,marginTop:10}]}>
                            <Text style={{fontSize:13}}>{this.state.form_info[j]['field_name']}</Text>
                            <Text style={{color:'#333'}}>{this.state.form_info[j]['field_value']}</Text>
                        </View>
                    </View>
                )
            }

        }



        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'#fff'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:16}}>{this.state.example_people_name}的{this.state.example_form_name}</Text>
                </View>


                <View style={[{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',paddingLeft:15,marginTop:10},styles.padding,styles.borderBottom,styles.borderTop]}>
                    <Image  style={{width:40,height:40,marginRight:5,borderRadius:25}}  source={{uri:this.state.avatar}}/>
                    <View>
                        <Text style={{color:'#333'}}>{this.state.example_people_name}</Text>
                        <Text style={{marginTop:2,fontSize:12,}}>{this.state.launch_time}</Text>
                    </View>
                </View>
                <View style={{position:'absolute',right:20,top:10,zIndex:1000}}>
                    <Image source={{uri:this.state.approve_img}}  style={{width: 100, height: 100}} tintColor={'#37915f'}/>
                </View>

                <ScrollView>
                    {formlist}

                    <View style={[{flexDirection:'row',alignItems:'center',paddingLeft:15}]}>
                        <View style={{position:'absolute',top:0,width:1,height:15,left:50,backgroundColor:'#bbb'}}></View>
                        <View style={[{flexDirection:'row',alignItems:'center',paddingLeft:15},styles.padding,]}>
                            <Image  style={{width:40,height:40,marginRight:10,borderRadius:25}}  source={{uri:this.state.avatar}}/>
                            <View style={{backgroundColor:'#fff',width:screenW-100,height:45,paddingLeft:15,paddingRight:15,paddingTop:5,borderRadius:5,justifyContent:'space-between',flexDirection:'row',}}>
                                <View>
                                    <Text style={{color:'#333'}}>{this.state.example_people_name}</Text>
                                    <Text style={{marginTop:2,fontSize:12,}}>发起申请</Text>
                                </View>
                                <Text style={{marginTop:2,fontSize:12,}}>{this.state.launch_time}</Text>
                            </View>

                        </View>
                        <View style={{position:'absolute',bottom:0,width:1,height:15,left:50,backgroundColor:'#bbb',zIndex:0}}></View>
                    </View>
                    {list}


                    <View style={this.props.navigation.state.params.approve_condition != '等待我审批'?{display: 'none'}: null}>
                        <View  style={[styles.padding,styles.borderBottom,styles.borderTop,{backgroundColor:'#fff',paddingLeft:15,marginTop:10}]}>
                            <Text style={{fontSize:13}}>审批意见</Text>

                            <TextInput
                                style={{ height: 30,width:280}}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(approve_idea) => this.setState({approve_idea})}
                            />
                        </View>
                    </View>

                </ScrollView>





                <View style={[styles.rowCom,styles.rowCom_foot,this.props.navigation.state.params.approve_condition != '等待我审批'?{display: 'none'}: null]}>

                    <TouchableOpacity  onPress={() => {this.agreement()}}>
                    <View style={{marginLeft:70}} >
                    <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/icon_shenpi/duihao.png')}/>
                    <Text style={[styles.eleFontCon]}>同意</Text>
                    </View>
                    </TouchableOpacity >

                    <TouchableOpacity  onPress={() => {this.refuse()}}>
                    <View style={{marginLeft:70}}>
                    <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/icon_shenpi/x.png')}/>
                    <Text style={[styles.eleFontCon]}>拒绝</Text>
                    </View>
                    </TouchableOpacity >

                        <TouchableOpacity  onPress={() => {this.pass_on_to()}}>
                    <View style={{marginLeft:70}}>
                        <Image style={{width:15,height:15,marginRight:6}} source={require('../../imgs/icon_shenpi/zhuanjiao.png')}/>
                        <Text style={[styles.eleFontCon]}>转交</Text>
                    </View>
                        </TouchableOpacity >
                </View>


                </View>
        );
    }
}

const styles = StyleSheet.create({
    ancestorCon:{
        flex: 1,
        backgroundColor: '#ebebeb',
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
        justifyContent:'space-between',
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'

    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    padding:{
        paddingTop:10,
        paddingBottom:10
    },
    padding2:{
        paddingLeft:15,
        paddingRight:15
    },
    flex_row:{
        flexDirection:'row',
        alignItems:'center',
    },

    rowCom: {//祖级-行
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 7,
        paddingBottom: 7,
        borderColor:'white',
        flexDirection:'row',
        alignItems:'center',
    },
    rowCom_padd:{
        marginLeft:25,
        borderTopWidth:1,
    },
});
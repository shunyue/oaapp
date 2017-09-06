/**
 * 审批筛选
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
    TouchableHighlight,
    DeviceEventEmitter,
    TextInput,
} from 'react-native';
const screenW = Dimensions.get('window').width;
import config from '../../common/config';
import request from '../../common/request';
import toast from '../../common/toast';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class app extends Component {
    OpBack() {
        this.props.navigation.goBack(null)
    }
    constructor(props) {
        super(props);
        this.state = {
            classify: [true,false,false,false], //审批状态
            _classify: [true,false,false,false,false],//发起时间
            classify1: [true,false,false], //回款状态

            custom_name:'',//客户 名称
            custom_id:'',//客户  id
            custom_array:[],//客户 集合


            ks_time:'',//开始时间
            js_time:'',//结束时间

            fq_peopel_id:[],//发起人员id
            fq_peopel_name:[],//发起人员姓名
            fq_peopel_array:[],//发起人员集合

            role_id:'',//登录者的id
            isPickerVisible: false,
            isPickerVisible1: false
        }
    }

    //审批状态
    classify(position) {
        var list = []
        for(var i in this.state.classify) {
            if(i == position) {
                list.push(!this.state.classify[i])
            }else{
                list.push(this.state.classify[i])
            }
        }
        this.setState({
            classify: list
        })
    }

    //发起时间
    _classify(index){
        var list2 = []
        for(var i in this.state._classify) {
            if(i == index) {
                list2.push(!this.state._classify[i])
            }else {
                list2.push(false)
            }
        }
        this.setState({
            _classify: list2
        })
    }



    //回款状态
    classify1(position) {
        var list = []
        for(var i in this.state.classify1) {
            if(i == position) {
                list.push(!this.state.classify1[i])
            }else{
                list.push(this.state.classify1[i])
            }
        }
        this.setState({
            classify1: list
        })
    }

    componentDidMount(){


        //接收发起人
        this.subscription = DeviceEventEmitter.addListener('faqi_people',(value) => {
            var user_id_array=[];
            var user_name_array=[];
            for(var i in value ){
                user_id_array.push(value[i]['id']);
                user_name_array.push(value[i]['name'])
            }
            this.setState({
                fq_peopel_array:value,
                fq_peopel_id:user_id_array,
                fq_peopel_name:user_name_array
            })

        })
        //接收发起人


        //接收客户
        this.subscription = DeviceEventEmitter.addListener('custom',(value) => {

          //  alert(JSON.stringify(value));
            var custom_id_array=[];
            var custom_name_array=[];
            for(var i in value ){
                custom_id_array.push(value[i]['id']);
                custom_name_array.push(value[i]['cus_name'])
            }
            this.setState({
                custom_array:value,
                custom_id:custom_id_array,
                custom_name:custom_name_array
            })
        })
        //接收客户



        this.getNet();
    }


    //登录者的角色  判断是有 选择发起人员的 选项
    getNet(){
        var url = config.api.base + config.api.judge_role;
        request.post(url,{
            user_id:this.props.navigation.state.params.user_id,//人员id
        }).then((responseText) => {
            if(responseText.sing==1){
                this.setState({
                    role_id:responseText.role_id,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }


    //选择客户
    approve_type(){
        this.props.navigation.navigate('order_select_costom',{company_id:this.props.navigation.state.params.company_id,user_id:this.props.navigation.state.params.user_id,selected_custom:this.state.custom_array})
    }


  //创建人员
    faqi_people(){
        this.props.navigation.navigate('order_select_people',{company_id:this.props.navigation.state.params.company_id,selected_peopel:this.state.fq_peopel_array})
    }






    //点击查询
    query(){



       // 客户名称
        if(this.state.custom_id==''){
          return  toast.center('客户不能为空');
        }
        //自定义时时间
        if(this.state._classify[4]){
            if(this.state.ks_time==''||this.state.js_time==''){
                return   toast.center('自定义的时间不能为空');
            }
        }


        //审批状态 回款状态 时间不能为空

       if(this.state.classify.indexOf(true)==-1) {
           return   toast.center('审批状态不能为空');
       };
        if(this.state.classify1.indexOf(true)==-1) {
            return   toast.center('回款状态不能为空');
        };
        if(this.state._classify.indexOf(true)==-1) {
            return   toast.center('时间不能为空');
        };










        //审批状态
        var approve_state_key=[];
         for(var i in this.state.classify){
             if(this.state.classify[i]==true){
                 approve_state_key.push(i);
             }
         }

        var approve_state_value=[];
        for(var j in approve_state_key){
            if(approve_state_key[j]==0){
                approve_state_value.push('已通过');
            }else if(approve_state_key[j]==1){
                approve_state_value.push('已拒绝');
            }else if(approve_state_key[j]==2){
                approve_state_value.push('待审批');
            }else if(approve_state_key[j]==3){
                approve_state_value.push('已撤销');
            }
        }


        //回款状态
        var returnmoney_state_key=[];
        for(var i in this.state.classify1){
            if(this.state.classify1[i]==true){
                returnmoney_state_key.push(i);
            }
        }

        var returnmoney_state_value=[];
        for(var j in returnmoney_state_key){
            if(returnmoney_state_key[j]==0){
                returnmoney_state_value.push('未回款');
            }else if(returnmoney_state_key[j]==1){
                returnmoney_state_value.push('部分回款');
            }else if(returnmoney_state_key[j]==2){
                returnmoney_state_value.push('全部回款');
            }
        }

        //回款状态



        //审批发起时间
        var approve_time_key='';
          for(var i in this.state._classify){
              if(this.state._classify[i]==true){
                  approve_time_key=i;
              }
          }
          var approve_time_value='';
          if(approve_time_key==0){
              approve_time_value='今日';
          }else if(approve_time_key==1){
              approve_time_value='本周';
          }else if(approve_time_key==2){
              approve_time_value='本月';
          }else if(approve_time_key==3){
              approve_time_value='上月';
          }else if(approve_time_key==4){
              approve_time_value='自定义';
          }

        //说明不是普通员工
        if(this.state.role_id!=1){
            if(this.state.fq_peopel_id.length==0){
                return   toast.center('创建人不能为空');
            }
        }


        var url = config.api.base + config.api.order_filtrate_query;
        request.post(url,{
            user_id:this.props.navigation.state.params.user_id,//登录者的id
            company_id:this.props.navigation.state.params.company_id,//公司的id
            custome_id:this.state.custom_id,//客户的id
            approve_status:approve_state_value,//审批状态
            returnmoney_status:returnmoney_state_value,//回款状态
            approve_time:approve_time_value,//审批时间
            approve_ks_time:this.state.ks_time,//自定义的开始时间
            approve_js_time:this.state.js_time,//自定义的结束时间
            faqi_people:this.state.fq_peopel_id,//发起人员id
        }).then((responseText) => {


            if(responseText.sing==1){

                var order_condition=new Array()
                order_condition['data']=responseText.data
                order_condition['custome_id']=this.state.custom_id
                order_condition['approve_status']=approve_state_value
                order_condition['returnmoney_status']=returnmoney_state_value
                order_condition['approve_time']=approve_time_value
                order_condition['approve_ks_time']=this.state.ks_time
                order_condition['approve_js_time']=this.state.js_time
                order_condition['faqi_people']=this.state.fq_peopel_id



                DeviceEventEmitter.emit('order_data', order_condition);
                this.props.navigation.goBack(null);
            }else{
                toast.center('没有符合的数据');
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }






    render() {

        var faqi_people;
        if(this.state.fq_peopel_name){
            for(var i in this.state.fq_peopel_name){
                faqi_people=this.state.fq_peopel_name.join(",")
            }
        }


        //选择客户
        var custom_name_string;
        if(this.state.custom_name){
            for(var i in this.state.custom_name){
                custom_name_string=this.state.custom_name.join(",")
            }
        }




        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <Image  style={styles.back_icon} source={require('../../imgs/customer/back.png')}/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={{color:'#333',fontSize:16}}>筛选订单</Text>
                </View>



                <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.approve_type()}>
                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"space-between",height:40}]}>
                    <Text style={{color:'#333'}} >选择客户</Text>

                    <TextInput
                        style={{width:screenW*0.5,padding:0,color:'#666'}}
                        underlineColorAndroid={'transparent'}
                        editable={false}
                         value={custom_name_string}
                        placeholder='请选择'
                    />

                    <Image  style={{width:12,height:12}} source={require('../../imgs/customer/arrow_r.png')}/>
                </View>
                </TouchableHighlight>



                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"space-between",height:40}]}>
                    <Text style={{color:'#333'}}>审批状态</Text>
                </View>
                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"center",height:50}]}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state.classify[0]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this.classify(0)}>
                        <Text style={this.state.classify[0]?{color:'#e15151'}:{}}>已通过</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state.classify[1]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this.classify(1)}>
                        <Text style={this.state.classify[1]?{color:'#e15151'}:{}}>已拒绝</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state.classify[2]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this.classify(2)}>
                        <Text style={this.state.classify[2]?{color:'#e15151'}:{}}>待审批</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state.classify[3]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this.classify(3)}>
                        <Text style={this.state.classify[3]?{color:'#e15151'}:{}}>已撤销</Text>
                    </TouchableHighlight>
                </View>


                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"space-between",height:40}]}>
                    <Text style={{color:'#333'}}>回款状态</Text>
                </View>
                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{height:50}]}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state.classify1[0]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this.classify1(0)}>
                        <Text style={this.state.classify1[0]?{color:'#e15151'}:{}}>未回款</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state.classify1[1]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this.classify1(1)}>
                        <Text style={this.state.classify1[1]?{color:'#e15151'}:{}}>部分回款</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state.classify1[2]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this.classify1(2)}>
                        <Text style={this.state.classify1[2]?{color:'#e15151'}:{}}>全部回款</Text>
                    </TouchableHighlight>
                </View>




                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"space-between",minHeight:40}]}>
                    <Text style={{color:'#333'}}>创建时间</Text>
                </View>
                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{flexWrap:'wrap'}]}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state._classify[0]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this._classify(0)}>
                        <Text style={this.state._classify[0]?{color:'#e15151'}:{}}>今日</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state._classify[1]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this._classify(1)}>
                        <Text style={this.state._classify[1]?{color:'#e15151'}:{}}>本周</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state._classify[2]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this._classify(2)}>
                        <Text style={this.state._classify[2]?{color:'#e15151'}:{}}>本月</Text>
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor={'transparent'} style={[styles.buttonStyle,styles.marginLR,this.state._classify[4]?{backgroundColor:'#fcd4d8',borderColor:"#e15151",borderWidth:1}:{backgroundColor:'#ccc'}]} onPress={()=>this._classify(4)}>
                        <Text style={this.state._classify[4]?{color:'#e15151'}:{}}>自定义</Text>
                    </TouchableHighlight>
                </View>


                <View style={[styles.flexRow,styles.borderBottom,this.state._classify[4]?{}:{display:'none'}]}>
                    <View style={{width:100,height:80,alignItems:'center',justifyContent:'center',borderColor:'#ccc',borderRightWidth:1}}>
                        <Text>起止时间</Text>
                        <Text>查询范围</Text>
                    </View>


                    <View style={{width:screenW-100}}>
                        <View>
                        <TouchableOpacity  onPress= { () => {this.setState({ isPickerVisible:true });}}>
                        <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"space-between",height:40}]}>
                                <TextInput
                                    style={{width:screenW*0.5,padding:0,color:'#666'}}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    placeholder="开始时间(必填)"
                                    editable={false}
                                    value={this.state.ks_time}
                                />

                           <Image  style={{width:12,height:12}} source={require('../../imgs/customer/arrow_r.png')}/>

                                <DateTimePicker
                                    cancelTextIOS = "取消"
                                    confirmTextIOS = "确定"
                                    titleIOS = "选择日期"
                                    mode="date"
                                    is24Hour={true}
                                    datePickerModeAndroid="spinner"
                                    isVisible={this.state.isPickerVisible}
                                    onConfirm={(date) => {this.setState({ks_time: moment(date).format('YYYY-MM-DD'),isPickerVisible: false })}}
                                    onCancel={() => this.setState({ isPickerVisible: false })}
                                />

                        </View>
                        </TouchableOpacity>
                        </View>




                        <View>
                        <TouchableOpacity  onPress= { () => {this.setState({ isPickerVisible1:true });}}>
                            <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"space-between",height:40}]}>
                                <TextInput
                                    style={{width:screenW*0.5,padding:0,color:'#666'}}
                                    underlineColorAndroid={'transparent'}
                                    placeholderTextColor="#A2A2A2"
                                    placeholder="结束时间(必填)"
                                    editable={false}
                                    value={this.state.js_time}
                                />

                                <Image  style={{width:12,height:12}} source={require('../../imgs/customer/arrow_r.png')}/>

                                <DateTimePicker
                                    cancelTextIOS = "取消"
                                    confirmTextIOS = "确定"
                                    titleIOS = "选择日期"
                                    mode="date"
                                    is24Hour={true}
                                    datePickerModeAndroid="spinner"
                                    isVisible={this.state.isPickerVisible1}
                                    onConfirm={(date) => {this.setState({js_time: moment(date).format('YYYY-MM-DD'),isPickerVisible1: false })}}
                                    onCancel={() => this.setState({ isPickerVisible1: false })}
                                />

                            </View>
                        </TouchableOpacity>
                        </View>


                    </View>




                </View>




                <TouchableOpacity  onPress= { () => {this.faqi_people()}}>
                <View style={[styles.flexRow,styles.paddingLR,styles.borderBottom,{justifyContent:"space-between",height:40},this.state.role_id==1?{display:'none'}:null]}>
                    <Text style={{color:'#333'}}>创建人员</Text>

                    <Text style={{width:screenW*0.6}}>{faqi_people}</Text>
                    <Image  style={{width:12,height:12}} source={require('../../imgs/customer/arrow_r.png')}/>
                </View>
                    </TouchableOpacity>

                <TouchableOpacity  onPress= { () => {this.query()}}>
                <View style={{width:screenW*0.8,height:40,backgroundColor:'#e15151',alignItems:'center',justifyContent:'center',marginTop:50,marginLeft:screenW*0.1,borderRadius:4}}>
                    <Text style={{color:'#fff',fontSize:16}}>查询</Text>
                </View>
                    </TouchableOpacity>


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
    flexRow:{
        flexDirection:'row',
        alignItems:"center"
    },
    paddingLR:{
        paddingLeft:15,
        paddingRight:15
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    buttonStyle:{
        width:screenW*0.25-20,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:4
    },
    marginLR:{
        margin:10,
        marginLeft:0,
        marginRight:12
    }
});
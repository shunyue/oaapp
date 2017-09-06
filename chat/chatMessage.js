/**
 * 小秘书
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
    ScrollView,
    TextInput,
    Modal,
} from 'react-native';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import Loading from '../common/loading';

export default class app extends Component {
    OpBack() {
        this.props.navigation.goBack(null)
    }


    constructor(props) {
        super(props);
        this.state = {
            listview:[],//审批
            listview1:[],//日程
            listview2:[],//审批+日程
            phone:false,
            example_id_when_refuse:'',//拒绝时需要传递的实例id
            load:false,
        };
    }
    componentDidMount(){
        this.getNet();//审批
        this.getNet1();//日程
        this.getNet2();//审批+日程
    }

    //审批
    //自己发起 待审批 和 待我审批
    getNet(){
        var url = config.api.base + config.api.secretary_select_approve;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//登录者id
        }).then((responseText) => {
           //alert(JSON.stringify (responseText.data))
            if(responseText.sing==1){
                this.setState({
                    listview:responseText.data,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    //审批

    //日程
    getNet1(){
        var url = config.api.base + config.api.secretary_select_schedule;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//登录者id
        }).then((responseText) => {
            //alert(JSON.stringify (responseText.data))
            if(responseText.status==1){
                this.setState({
                    listview1:responseText.data,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }
    //日程

    //审批+日程
    getNet2(){

        var url = config.api.base + config.api.secretary_select_schedule_approve;
        request.post(url,{
            company_id: this.props.navigation.state.params.company_id,//公司id
            user_id:this.props.navigation.state.params.user_id,//登录者id
        }).then((responseText) => {
            //alert(JSON.stringify (responseText.data))
            if(responseText.sing==1){
                this.setState({
                    listview2:responseText.data,
                    load:true,
                })
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }


    //日程中标记为已读
    schedule_mark_to_yidu(id){
        var url = config.api.base + config.api.mark_to_yidu;
        request.post(url,{
            id:id,//daily表主键ID
        }).then((responseText) => {
            if(responseText.sing==1){
                this.getNet1();
                this.getNet2();
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }

    //审批中标记已读
    approve_mark_to_yidu(id){

        var url = config.api.base + config.api.mark_to_yidu_approve;
        request.post(url,{
            id:id,//process_way表主键ID
        }).then((responseText) => {
            if(responseText.sing==1){
                this.getNet();
                this.getNet2();
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })
    }



    //日程的详情
    schedule_detail(){

    }

    //审批通过
    approve_pass(e){

        var url = config.api.base + config.api.approve_agreement;
        request.post(url,{
            example_id: e,//实例id
            user_id: this.props.navigation.state.params.user_id,//用户id
            company_id: this.props.navigation.state.params.company_id,//公司id
        }).then((responseText) => {

            if(responseText.sing==1){
                this.getNet();
                this.getNet2();
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })


    }


    //点击拒绝时
    approve_refuse_setid(e){
        this.setState({
            example_id_when_refuse:e,
            phone:!this.state.phone
        })
    }

    //审批拒绝
    approve_refuse(){




        var url = config.api.base + config.api.approve_refuse;
        request.post(url,{
            example_id: this.state.example_id_when_refuse,//实例id
            user_id: this.props.navigation.state.params.user_id,//用户id
            company_id: this.props.navigation.state.params.company_id,//公司id
            approve_idea:this.state.text//审批意见
        }).then((responseText) => {

            if(responseText.sing==1){
                this.getNet();
                this.getNet2();
            }
        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }

    //判断是 表单  合同 还是合同回款  g是msg值 当时等于我审批时 页面出现 同意还是拒绝
    //区分 我发起的 我已经审批完成 与我正要审批的 正要审批的
    //approve_condition 1是否出现 同意 拒绝 转交的选项 2 是详情页状态图标的显示
  approve_detail(e,j){
        //正在审批的
         if(j==1){
             var g='等待我审批';
         }else{
             var g='随意';
         }
        var url = config.api.base + config.api.judge_approve_type;
        request.post(url,{
            example_id:e,
        }).then((responseText) => {
            //表单
            if(responseText==1){
                this.props.navigation.navigate('form_approve',{example_id:e,user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id,approve_condition:g});
                //合同
            }else if(responseText==2){
                this.props.navigation.navigate('contract_approve',{example_id:e,user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id,approve_condition:g});
                //合同回款
            }else if(responseText==3){
                this.props.navigation.navigate('return_money_approve',{example_id:e,user_id:this.props.navigation.state.params.user_id,company_id:this.props.navigation.state.params.company_id,approve_condition:g});
            }

        }).catch((error)=>{
            toast.bottom('网络连接失败，请检查网络后重试');
        })

    }












    render() {
        const {navigate} = this.props.navigation;
        const {state} = this.props.navigation;



        //审批
        var approve_list=[];
        for(var i in this.state.listview){
            //自己发起
            if(this.state.listview[i]['approve_type']==1){
                approve_list.push(
                    <View key={i}>
                        <View style={{marginTop:10}}>
                            <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                    <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview[i]['alert_time']}</Text>
                                </View>
                                <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                    <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview[i]['example_id'],2)}>
                                        <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                            <View style={[styles.place]}>
                                                <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview[i]['icon']}}/>
                                                <Text style={{color:'#333'}}>{this.state.listview[i]['title']}</Text>
                                            </View>
                                            <View style={[styles.place,{paddingTop:5}]}>
                                                <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                <Text style={{fontSize:12}}>{this.state.listview[i]['msg']}</Text>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>

                                        {this.state.listview[i]['if_yidu']=='标记为已读'?
                                            <Text onPress={this.approve_mark_to_yidu.bind(this,this.state.listview[i]['process_way'])}>{this.state.listview[i]['if_yidu']}</Text>
                                            : <Text>{this.state.listview[i]['if_yidu']}</Text>
                                        }

                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )
                //正在审批
            }else if(this.state.listview[i]['approve_type']==2){
                //合同 合同回款
                if(this.state.listview[i]['form_info'].length==0){
                    approve_list.push(
                        <View key={i}>
                            <View style={{marginTop:10}}>
                                <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                    <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                        <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview[i]['alert_time']}</Text>
                                    </View>
                                    <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                        <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview[i]['example_id'],1)}>
                                            <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                <View style={[styles.place]}>
                                                    <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview[i]['icon']}}/>
                                                    <Text style={{color:'#333'}}>{this.state.listview[i]['title']}</Text>
                                                </View>

                                            </View>
                                        </TouchableHighlight>
                                        <View style={[styles.place,{justifyContent:'space-between',marginTop:10}]}>

                                            <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_pass.bind(this,this.state.listview[i]['example_id'])}>
                                            <View style={{width:screenW*0.45-10,alignItems:'center',borderColor:'#ccc',borderRightWidth:1}}>
                                                <Text style={{color:'#666',}}>同意</Text>
                                            </View>
                                             </TouchableHighlight>

                                            <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_refuse_setid.bind(this,this.state.listview[i]['example_id'])}>
                                                <View style={{width:screenW*0.45-10,alignItems:'center'}}>
                                                    <Text style={{color:'#666'}}>拒绝</Text>
                                                </View>
                                            </TouchableHighlight>

                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )

                //表单
                }else{
                    var form_data=[];
                    var form_info=this.state.listview[i]['form_info'];
                    for(var j in form_info){
                          if(form_info[j]['field_type']!='照片'){
                              form_data.push(
                                  <View key={j}>
                                  <View style={[styles.place,{paddingTop:5}]}>
                                      <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                      <Text style={{fontSize:12}}>{this.state.listview[i]['form_info'][j]['field_name']}：{this.state.listview[i]['form_info'][j]['field_value']}</Text>
                                  </View>
                                   </View>
                              )
                          }
                   }
                   approve_list.push(
                       <View key={i}>
                           <View style={{marginTop:10}}>
                               <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                   <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                       <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview[i]['alert_time']}</Text>
                                   </View>


                                   <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>

                                           <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                               <View style={[styles.place]}>
                                                   <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview[i]['icon']}}/>
                                                   <Text style={{color:'#333'}}>{this.state.listview[i]['title']}</Text>
                                               </View>

                                           </View>

                                       <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview[i]['example_id'],1)}>
                                       <View style={[styles.borderBottom]}>
                                       {form_data}
                                        </View>
                                       </TouchableHighlight>
                                       <View style={[styles.place,{justifyContent:'space-between',marginTop:10}]}>

                                           <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_pass.bind(this,this.state.listview[i]['example_id'])}>
                                           <View style={{width:screenW*0.45-10,alignItems:'center',borderColor:'#ccc',borderRightWidth:1}}>
                                               <Text style={{color:'#666',}}>同意</Text>
                                           </View>
                                            </TouchableHighlight>

                                           <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_refuse_setid.bind(this,this.state.listview[i]['example_id'])}>
                                               <View style={{width:screenW*0.45-10,alignItems:'center'}}>
                                                   <Text style={{color:'#666'}}>拒绝</Text>
                                               </View>
                                           </TouchableHighlight>
                                       </View>
                                   </View>

                               </View>
                           </View>
                       </View>
                   )
                }
                //审批完成
            }else if(this.state.listview[i]['approve_type']==3){
                //合同 合同回款
                if(this.state.listview[i]['form_info'].length==0){
                    approve_list.push(
                        <View key={i}>
                            <View style={{marginTop:10}}>
                                <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                    <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                        <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview[i]['alert_time']}</Text>
                                    </View>
                                    <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                        <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview[i]['example_id'],2)}>
                                            <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                <View style={[styles.place]}>
                                                    <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview[i]['icon']}}/>
                                                    <Text style={{color:'#333'}}>{this.state.listview[i]['title']}</Text>
                                                </View>

                                            </View>
                                        </TouchableHighlight>
                                        <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>
                                            <Text>{this.state.listview[i]['approve_result']}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )

                    //表单
                }else{
                    var form_data=[];
                    var form_info=this.state.listview[i]['form_info'];
                    for(var j in form_info){
                        if(form_info[j]['field_type']!='照片'){
                            form_data.push(
                                <View key={j}>
                                    <View style={[styles.place,{paddingTop:5}]}>
                                        <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                        <Text style={{fontSize:12}}>{this.state.listview[i]['form_info'][j]['field_name']}：{this.state.listview[i]['form_info'][j]['field_value']}</Text>
                                    </View>
                                </View>
                            )
                        }
                    }
                    approve_list.push(
                        <View key={i}>
                            <View style={{marginTop:10}}>
                                <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                    <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                        <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview[i]['alert_time']}</Text>
                                    </View>
                                    <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>

                                            <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                <View style={[styles.place]}>
                                                    <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview[i]['icon']}}/>
                                                    <Text style={{color:'#333'}}>{this.state.listview[i]['title']}</Text>
                                                </View>

                                            </View>


                                    <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview[i]['example_id'],2)}>
                                        <View style={[styles.borderBottom]}>
                                            {form_data}
                                         </View>
                                    </TouchableHighlight>
                                        <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>
                                            <Text>{this.state.listview[i]['approve_result']}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }

            }

        }
        //审批


        //日程
            var schedule_list=[]
            var title_schedule='';
            for(var i in this.state.listview1){
                var if_yidu=this.state.listview1[i]['haveread']==1?'已读':'标记为已读'

                if(this.state.listview1[i]['daily_type']==1){
                    title_schedule= this.state.listview1[i]['createName']+'新建拜访'+'--'+this.state.listview1[i]['customerName']
                }else if(this.state.listview1[i]['daily_type']==2){
                    title_schedule= this.state.listview1[i]['createName']+'新建任务'+'--'+this.state.listview1[i]['title']

                }else if(this.state.listview1[i]['daily_type']==3){
                    title_schedule= this.state.listview1[i]['createName']+'新建会议'+'--'+this.state.listview1[i]['title']
                }else if(this.state.listview1[i]['daily_type']==4){
                    title_schedule= this.state.listview1[i]['createName']+'新建培训'+'--'+this.state.listview1[i]['title']

                }

                schedule_list.push(

                     <View key={i}>
                         <View style={{marginTop:10}}>
                             <View style={{marginTop:15,alignItems:'center'}}>
                                 <View style={{width:140,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                     <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview1[i]['create_time']}</Text>
                                 </View>
                                 <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                     <TouchableHighlight underlayColor={'transparent'} onPress={()=>{navigate('DailyDetail')}}>
                                         <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                             <View style={[styles.place]}>
                                                 <Image  style={{width:15,height:15,marginRight:6}} source={require('../imgs/cal.png')}/>
                                                 <Text style={{color:'#333'}}>{title_schedule}</Text>
                                             </View>
                                             <View style={[styles.place,{paddingTop:5}]}>
                                                 <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                 <Text style={{fontSize:12}}>执行人：{this.state.listview1[i]['executorName']}</Text>
                                             </View>
                                             <View style={[styles.place,{paddingTop:5}]}>
                                                 <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                 <Text style={{fontSize:12}}>开始：{this.state.listview1[i]['start_time']}</Text>
                                             </View>
                                             <View style={[styles.place,{paddingTop:5}]}>
                                                 <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                 <Text style={{fontSize:12}}>结束：{this.state.listview1[i]['stop_time']}</Text>
                                             </View>


                                             <View style={[styles.place,{paddingTop:5},this.state.listview1[i]['description']==null?{display:'none'}:null]}>
                                                 <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                 <Text style={{fontSize:12}}>{this.state.listview1[i]['description']}</Text>
                                             </View>


                                         </View>
                                     </TouchableHighlight>
                                     <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>
                                         {if_yidu=='标记为已读'?
                                             <Text onPress={this.schedule_mark_to_yidu.bind(this,this.state.listview1[i]['id'])}>{if_yidu}</Text>
                                         : <Text>{if_yidu}</Text>
                                         }


                                     </View>
                                 </View>
                             </View>
                         </View>
                     </View>
                )
            }
        //日程




         //日程加审批
        var approve_schedule_list=[];
        var title_schedule;
        for(var i in this.state.listview2){

            //日程
            if(this.state.listview2[i]['secretary']==1){

                var if_yidu=this.state.listview2[i]['haveread']==1?'已读':'标记为已读'
                if(this.state.listview2[i]['daily_type']==1){
                    title_schedule= this.state.listview2[i]['createName']+'新建拜访'+'--'+this.state.listview2[i]['customerName']
                }else if(this.state.listview2[i]['daily_type']==2){
                    title_schedule= this.state.listview2[i]['createName']+'新建任务'+'--'+this.state.listview2[i]['title']

                }else if(this.state.listview2[i]['daily_type']==3){
                    title_schedule= this.state.listview2[i]['createName']+'新建会议'+'--'+this.state.listview2[i]['title']
                }else if(this.state.listview2[i]['daily_type']==4){
                    title_schedule= this.state.listview2[i]['createName']+'新建培训'+'--'+this.state.listview2[i]['title']

                }

                approve_schedule_list.push(

                    <View key={i}>
                        <View style={{marginTop:10}}>
                            <View style={{marginTop:15,alignItems:'center'}}>
                                <View style={{width:140,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                    <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview2[i]['alert_time']}</Text>
                                </View>
                                <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>{navigate('DailyDetail')}}>
                                        <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                            <View style={[styles.place]}>
                                                <Image  style={{width:15,height:15,marginRight:6}} source={require('../imgs/cal.png')}/>
                                                <Text style={{color:'#333'}}>{title_schedule}</Text>
                                            </View>
                                            <View style={[styles.place,{paddingTop:5}]}>
                                                <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                <Text style={{fontSize:12}}>执行人：{this.state.listview2[i]['executorName']}</Text>
                                            </View>
                                            <View style={[styles.place,{paddingTop:5}]}>
                                                <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                <Text style={{fontSize:12}}>开始：{this.state.listview2[i]['start_time']}</Text>
                                            </View>
                                            <View style={[styles.place,{paddingTop:5}]}>
                                                <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                <Text style={{fontSize:12}}>结束：{this.state.listview2[i]['stop_time']}</Text>
                                            </View>


                                            <View style={[styles.place,{paddingTop:5},this.state.listview2[i]['description']==null?{display:'none'}:null]}>
                                                <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                <Text style={{fontSize:12}}>{this.state.listview2[i]['description']}</Text>
                                            </View>


                                        </View>
                                    </TouchableHighlight>
                                    <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>
                                        {if_yidu=='标记为已读'?
                                            <Text onPress={this.schedule_mark_to_yidu.bind(this,this.state.listview2[i]['id'])}>{if_yidu}</Text>
                                            : <Text>{if_yidu}</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            //审批
            }else{

                //自己发起
                if(this.state.listview2[i]['approve_type']==1){
                    approve_schedule_list.push(
                        <View key={i}>
                            <View style={{marginTop:10}}>
                                <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                    <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                        <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview2[i]['alert_time']}</Text>
                                    </View>
                                    <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                        <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview2[i]['example_id'],2)}>
                                            <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                <View style={[styles.place]}>
                                                    <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview2[i]['icon']}}/>
                                                    <Text style={{color:'#333'}}>{this.state.listview2[i]['title']}</Text>
                                                </View>
                                                <View style={[styles.place,{paddingTop:5}]}>
                                                    <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                                    <Text style={{fontSize:12}}>{this.state.listview2[i]['msg']}</Text>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                        <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>
                                            {this.state.listview2[i]['if_yidu']=='标记为已读'?
                                                <Text onPress={this.approve_mark_to_yidu.bind(this,this.state.listview2[i]['process_way'])}>{this.state.listview2[i]['if_yidu']}</Text>
                                                : <Text>{this.state.listview2[i]['if_yidu']}</Text>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                    //正在审批
                }else if(this.state.listview2[i]['approve_type']==2){
                    //合同 合同回款
                    if(this.state.listview2[i]['form_info'].length==0){
                        approve_schedule_list.push(
                            <View key={i}>
                                <View style={{marginTop:10}}>
                                    <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                        <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview2[i]['alert_time']}</Text>
                                        </View>
                                        <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                            <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview2[i]['example_id'],1)}>
                                                <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                    <View style={[styles.place]}>
                                                        <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview2[i]['icon']}}/>
                                                        <Text style={{color:'#333'}}>{this.state.listview2[i]['title']}</Text>
                                                    </View>

                                                </View>
                                            </TouchableHighlight>
                                            <View style={[styles.place,{justifyContent:'space-between',marginTop:10}]}>

                                                <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_pass.bind(this,this.state.listview2[i]['example_id'])}>
                                                <View style={{width:screenW*0.45-10,alignItems:'center',borderColor:'#ccc',borderRightWidth:1}}>
                                                    <Text style={{color:'#666',}}>同意</Text>
                                                </View>
                                                 </TouchableHighlight>
                                                <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_refuse_setid.bind(this,this.state.listview2[i]['example_id'])}>

                                                <View style={{width:screenW*0.45-10,alignItems:'center'}}>
                                                        <Text style={{color:'#666'}}>拒绝</Text>
                                                    </View>
                                                </TouchableHighlight>

                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )

                        //表单
                    }else{
                        var form_data=[];
                        var form_info=this.state.listview2[i]['form_info'];
                        for(var j in form_info){
                            if(form_info[j]['field_type']!='照片'){
                                form_data.push(
                                    <View key={j}>
                                        <View style={[styles.place,{paddingTop:5}]}>
                                            <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                            <Text style={{fontSize:12}}>{this.state.listview2[i]['form_info'][j]['field_name']}：{this.state.listview2[i]['form_info'][j]['field_value']}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        }
                        approve_schedule_list.push(
                            <View key={i}>
                                <View style={{marginTop:10}}>
                                    <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                        <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview2[i]['alert_time']}</Text>
                                        </View>
                                        <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>

                                                <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                    <View style={[styles.place]}>
                                                        <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview2[i]['icon']}}/>
                                                        <Text style={{color:'#333'}}>{this.state.listview2[i]['title']}</Text>
                                                    </View>

                                                </View>

                                        <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview2[i]['example_id'],1)}>
                                            <View style={[styles.borderBottom]}>
                                                {form_data}
                                            </View>
                                        </TouchableHighlight>
                                            <View style={[styles.place,{justifyContent:'space-between',marginTop:10}]}>

                                                <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_pass.bind(this,this.state.listview2[i]['example_id'])}>
                                                <View style={{width:screenW*0.45-10,alignItems:'center',borderColor:'#ccc',borderRightWidth:1}}>
                                                    <Text style={{color:'#666',}}>同意</Text>
                                                </View>
                                                 </TouchableHighlight>

                                                <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_refuse_setid.bind(this,this.state.listview2[i]['example_id'])}>

                                                <View style={{width:screenW*0.45-10,alignItems:'center'}}>
                                                        <Text style={{color:'#666'}}>拒绝</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                    //审批完成
                }else if(this.state.listview2[i]['approve_type']==3){
                    //合同 合同回款
                    if(this.state.listview2[i]['form_info'].length==0){
                        approve_schedule_list.push(
                            <View key={i}>
                                <View style={{marginTop:10}}>
                                    <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                        <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview2[i]['alert_time']}</Text>
                                        </View>
                                        <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>
                                            <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview2[i]['example_id'],2)}>
                                                <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                    <View style={[styles.place]}>
                                                        <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview2[i]['icon']}}/>
                                                        <Text style={{color:'#333'}}>{this.state.listview2[i]['title']}</Text>
                                                    </View>

                                                </View>
                                            </TouchableHighlight>
                                            <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>
                                                <Text>{this.state.listview2[i]['approve_result']}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )

                        //表单
                    }else{
                        var form_data=[];
                        var form_info=this.state.listview2[i]['form_info'];
                        for(var j in form_info){
                            if(form_info[j]['field_type']!='照片'){
                                form_data.push(
                                    <View key={j}>
                                        <View style={[styles.place,{paddingTop:5}]}>
                                            <Text style={{width:5,height:5,marginLeft:5,marginRight:10,backgroundColor:'#ccc',borderRadius:2}}></Text>
                                            <Text style={{fontSize:12}}>{this.state.listview2[i]['form_info'][j]['field_name']}：{this.state.listview2[i]['form_info'][j]['field_value']}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        }
                        approve_schedule_list.push(
                            <View key={i}>
                                <View style={{marginTop:10}}>
                                    <View style={{marginTop:15,marginBottom:10,alignItems:'center'}}>
                                        <View style={{width:120,height:20,alignItems:'center',justifyContent:'center',marginBottom:10,backgroundColor:'#bbb',borderRadius:2}}>
                                            <Text style={{fontSize:13,color:'#fff'}}>{this.state.listview2[i]['alert_time']}</Text>
                                        </View>
                                        <View style={{backgroundColor:'#fff',padding:10,width:screenW*0.9,borderColor:'#ccc',borderWidth:1,borderRadius:3}}>

                                                <View style={[styles.borderBottom,{paddingBottom:10}]}>
                                                    <View style={[styles.place]}>
                                                        <Image  style={{width:15,height:15,marginRight:6}} source={{uri: this.state.listview2[i]['icon']}}/>
                                                        <Text style={{color:'#333'}}>{this.state.listview2[i]['title']}</Text>
                                                    </View>
                                                </View>

                                        <TouchableHighlight underlayColor={'transparent'} onPress={this.approve_detail.bind(this,this.state.listview2[i]['example_id'],2)}>
                                            <View style={[styles.borderBottom]}>
                                                {form_data}
                                            </View>
                                        </TouchableHighlight>
                                            <View style={[styles.place,{justifyContent:'center',marginTop:10}]}>
                                                <Text>{this.state.listview2[i]['approve_result']}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }
            }
        }



        if(!this.state.load){
            return (<Loading />)
        }


        return(
                <View style={styles.ancestorCon}>
                    <View style={[styles.container,{backgroundColor:'#e15151'}]}>
                        <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                            <View style={{flexDirection:'row'}}>
                                <Image  style={styles.back_icon} tintColor={'#fff'} source={require('../imgs/customer/back.png')}/>
                                <Text style={styles.back_text}>返回</Text>
                            </View>
                        </TouchableHighlight>
                        <Text style={{fontSize:17,color:'#fff'}}>{state.params.title}</Text>
                        <TouchableHighlight underlayColor={'transparent'} style={[styles.goRight,styles.go]} onPress={()=>{navigate('ChatMessageSet',{title:state.params.title})}}>
                            <Image  style={{width:25,height:25}} tintColor={'#fff'} source={require('../imgs/chat/set.png')}/>
                        </TouchableHighlight>
                    </View>
                    <ScrollableTabView
                        initialPage = {0}
                        renderTabBar={() => <DefaultTabBar/>}
                        tabBarUnderlineStyle={{height:1,backgroundColor: '#e15151',}}
                        tabBarBackgroundColor='#FFFFFF'
                        tabBarActiveTextColor='#e15151'
                        tabBarInactiveTextColor='#333'
                        locked ={ false}
                    >
                        {/*日程加审批*/}
                        <View tabLabel='全部'>
                            <ScrollView>
                                {approve_schedule_list}
                            </ScrollView>
                        </View >
                        {/*日程加审批*/}

                        {/*日程*/}
                        <View tabLabel='日程'>
                            <ScrollView>
                                {schedule_list}
                            </ScrollView>
                        </View>
                        {/*日程*/}

                        {/*审批*/}
                        <View tabLabel='审批'>
                            <ScrollView>
                                {approve_list}
                            </ScrollView>
                        </View>
                        {/*审批*/}

                    </ScrollableTabView>


                    {/*拒绝的弹框*/}
                    <View>
                        <Modal
                            animationType={"slide"}
                            transparent={true}
                            visible={this.state.phone}
                            onRequestClose={() => {this.setState({phone:!this.state.phone})}}
                        >
                            <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                                <TouchableOpacity style={{width:screenW,height:screenH}} onPress={() => {
                      this.setState({phone:!this.state.phone})
                    }}></TouchableOpacity>
                            </View>
                            <View style={styles.addCustomer}>
                                <View style={[styles.addCustomer_card,{alignItems:'center'}]}>
                                    <View style={{height:30,justifyContent:'center',marginTop:10}}>
                                        <Text style={{color:'#333'}}>请填写拒绝理由</Text>
                                    </View>

                                    <View style={{width:screenW*0.7,backgroundColor:'#ddd',marginBottom:10,borderRadius:5}}>
                                        <TextInput
                                            style={{width:screenW*0.6,padding:0,marginLeft:10}}
                                            onChangeText={(text) => {this.setState({text:text})}}
                                            placeholder ={'拒绝原因'}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            autoFocus={true}
                                            selectTextOnFocus={true}
                                        />
                                    </View>
                                    <View style={[styles.borderTop,{width:screenW*0.8,height:50,flexDirection:'row'}]}>
                                        <TouchableHighlight underlayColor={'#eee'} onPress={() => {
                                        this.setState({phone:!this.state.phone})
                                    }}>
                                            <View style={{width:screenW*0.4,alignItems:'center',borderColor:'#ccc',borderRightWidth:1,height:50,justifyContent:'center'}}>
                                                <Text style={{color:'#333'}}>取消</Text>
                                            </View>
                                        </TouchableHighlight>

                                        <TouchableHighlight underlayColor={'#eee'} onPress={() => {
                                        this.setState({phone:!this.state.phone})
                                    ,this.approve_refuse()}}>
                                            <View style={{width:screenW*0.4,alignItems:'center',borderColor:'#ccc',borderRightWidth:1,height:50,justifyContent:'center'}}>
                                                <Text style={{color:'#333'}}>确定</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    {/*拒绝的弹框*/}


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
        right:15
    },

    back_icon:{
        width:10,
        height:17,
        marginTop: 3
    },
    back_text:{
        color:'#fff',
        fontSize: 16,
        marginLeft:6
    },
    place:{
        flexDirection:'row',
        alignItems:'center',
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'
    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    addCustomer:{
        flex:1,
        position:'absolute',
        top:screenH*0.5-75,
        alignItems:'center',
        justifyContent:'center',
    },
    addCustomer_card:{
        width:screenW*0.8,
        marginLeft:screenW*0.1,
        height:160,
        backgroundColor:'#fff',
    },
    customerCard_content:{
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:screenW*0.8,
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
    },
    customerCard_content2:{
        borderBottomWidth:0,
    },
});
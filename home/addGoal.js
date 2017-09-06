/**
 * Created by Administrator on 2017/7/24.
 * 新增企业目标
 * 周飞飞
 */
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
    Modal,
    TouchableOpacity ,
    TextInput,
    DeviceEventEmitter,
    } from 'react-native';
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Picker from 'react-native-picker';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
import moment from 'moment';
const year = moment().format("YYYY")
const year1 = Number(year) + Number(1)
const years=[year,year1]
const screenH =Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;
export default class AddGoal extends Component {
    back() {
        this.props.navigation.goBack('AddGoal');
    }
    constructor(props) {
        super(props);
        this.state = {
            textInputValue: '',
            addproductsing:[],
            addproductsing1:[],
            content:'添加产品金额目标',
            content2:'添加产品销量目标',
            show:false,
            plan:'月度目标',
            planNode:[false,false,true],
            yearMonth:moment().format("YYYY年M月"),
            month:[{2017:[1,2,3,4,5,6,7,8,9,10,11,12]},{2018:[1,2,3,4,5,6,7,8,9,10,11,12]}],
            jidu:[{2017:[1,2,3,4]},{2018:[1,2,3,4]}],
            isDateTimePickerVisible: false,
            productData:[],
            pname:[false],
            pids:[],
            pids1:[],
            pname1:[false],
            productNode:[] ,
            total_money:'',
            total_examine:'',
            sell_total:0,
            sell_examine:0,
            product_name_0:'',//金额目标中  固有的商品名称
            product_id_0:'',//金额目标中  固有的商品id
            product_num_0:'',//金额目标中  商品目标金额
            product_exnum_0:'',//金额目标中  固有考核金额
            product_sellname_0:'',//考核目标中  固有的商品名称
            product_sellid_0:'',//考核目标中  固有的商品id
            product_sellnum_0:'',//考核目标中  商品目标金额
            product_sellexnum_0:'',//考核目标中  固有考核金额
        }
    }
    timeChange(){
        if(this.state.plan=='年度目标'){
            return(
                <TouchableHighlight underlayColor={'transparent'} onPress={this._showYearPicker.bind(this)}>
                    <View style={[styles.place]}>
                        <Text style={{color:'#333'}} >{this.state.yearMonth}</Text>
                        <Image  style={{width:12,height:12,marginLeft:15}} source={require('../imgs/customer/arrowU.png')}/>
                    </View>
                </TouchableHighlight>
            )
        }else if(this.state.plan=='月度目标'){
            return(
                <TouchableHighlight underlayColor={'transparent'} onPress={this._showMonthPicker.bind(this)}>
                    <View style={[styles.place]}>
                        <Text style={{color:'#333'}} >{this.state.yearMonth}</Text>
                        <Image  style={{width:12,height:12,marginLeft:15}} source={require('../imgs/customer/arrowU.png')}/>
                    </View>
                </TouchableHighlight>
            )
        }else if(this.state.plan=='季度目标'){
            return(
                <TouchableHighlight underlayColor={'transparent'} onPress={this._showJiduPicker.bind(this)}>
                    <View style={[styles.place]}>
                        <Text style={{color:'#333'}} >{this.state.yearMonth}</Text>
                        <Image  style={{width:12,height:12,marginLeft:15}} source={require('../imgs/customer/arrowU.png')}/>
                    </View>
                </TouchableHighlight>
            )
        }
    }
    _showMonthPicker() {
        Picker.init({
            pickerData:this.state.month ,
            pickerTitleText: '选择月度',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            onPickerConfirm: data => {
                this.setState({yearMonth:data[0]+'年'+data[1]+'月'});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }
    _showYearPicker() {
        Picker.init({
            pickerData:years ,
            pickerTitleText: '选择年度',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            onPickerConfirm: data => {
                this.setState({yearMonth:data+'年'});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }
    _showJiduPicker() {
        Picker.init({
            pickerData:this.state.jidu ,
            pickerTitleText: '选择季度',
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            onPickerConfirm: data => {
                this.setState({yearMonth:data[0]+'年'+data[1]+'季度'});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }
    //添加产品
    add_product(biaoshi,position,e){
        //biaoshi=1 表示金额目标目标中添加产品
        if(biaoshi==1){
            var productidsing='product_id_'+e;//把已经选中的产品选中的
            this.props.navigation.navigate('AimAddProduct',{company_id:this.props.navigation.state.params.company_id,pnumber:position,select_product_sing:e ,biaoshi:1,product_id:this.state[productidsing],biaoshi:biaoshi})

            //biaoshi=2 表示销售目标目标中添加产品
        }else if(biaoshi==2){
            var productsellidsing='product_sellid_'+e;//把已经选中的产品选中的
            this.props.navigation.navigate('AimAddProduct',{company_id:this.props.navigation.state.params.company_id,pnumber:position,select_product_sellsing:e ,biaoshi:2,product_id:this.state[productsellidsing],biaoshi:biaoshi})
        }

    }
    componentDidMount() {
        this.getProductId= DeviceEventEmitter.addListener('product_id', (value)=>{
            //判断是固有产品还是新增的产品
            if(value.select_product_sing==0){
                this.setState({
                    product_name_0:value.pname,//固有的商品名称
                    product_id_0:value.pid,//固有的商品id
                })
            }else{
                var productidsing='product_id_'+value.select_product_sing;
                var productnamesing='product_name_'+value.select_product_sing;
                this.setState({
                    [productnamesing]:value.pname,//新增的商品名称
                    [productidsing]:value.pid,//新增的商品id
                })
            }
            var arr=this.state.pname;
            for(var i in arr){
                if(arr[i]==value.pname) {
                    toast.center('该产品已存在，不可重复添加');
                    return false;
                }else{
                    if (value.pnumber == i) {
                        arr[i] = value.pname;
                    }
                }
            }
            this.setState({
                pname: arr,
            });
        }  )
        this.getProductId1= DeviceEventEmitter.addListener('product_id1', (value)=>{
            //判断是固有产品还是新增的产品
            if(value.select_product_sing==0){
                this.setState({
                    product_sellname_0:value.pname,//固有的商品名称
                    product_sellid_0:value.pid,//固有的商品id
                })
            }else{
                var productsellidsing='product_sellid_'+value.select_product_sing;
                var productsellnamesing='product_sellname_'+value.select_product_sing;
                this.setState({
                    [productsellnamesing]:value.pname,//新增的商品名称
                    [productsellidsing]:value.pid,//新增的商品id
                })
            }
            var arr1=this.state.pname1;
            for(var i in arr1){
                if(arr1[i]==value.pname) {
                    toast.center('该产品已存在，不可重复添加');
                    return false;
                }else{
                    if (value.pnumber == i) {
                        arr1[i] = value.pname;
                    }
                }
            }
            this.setState({
                pname1: arr1,
            });
        }  )
    }

    componentWillUnmount() {
        this.getProductId.remove();
        this.getProductId1.remove();
    }
    setPlanVisible (visible){
        this.setState({
            show:visible,
        })
    }

    setTimeVisible (visible){
        this.setState({
            time:visible,
        })
    }
    getInitialState() {
        return {
            date: new Date(),
        }
    }
    showDatePicker() {
        var date = this.state.date;
        this.picker.showDatePicker(date, (d)=>{
            this.setState({date:d});
        });
    }
    showTimePicker() {
        var date = this.state.date;
        this.picker.showTimePicker(date, (d)=>{
            this.setState({date:d});
        });
    }
    showDateTimePicker() {
        var date = this.state.date;
        this.picker.showDateTimePicker(date, (d)=>{
            this.setState({date:d});
        });
    }

    planChose(chose){
        var jidu;
        if(moment().format("M")>=1&&moment().format("M")<=3 ){
            jidu=1;
        }else if(moment().format("M")>=4 && moment().format("M")<=6 ){
            jidu=2;
        }else if(moment().format("M")>=7 && moment().format("M")<=9 ){
            jidu=3;
        }else if(moment().format("M")>=10 && moment().format("M")<=12 ){
            jidu=4;
        }

        if(chose==1){
            this.setState({
                plan:'年度目标',
                yearMonth:moment().format("YYYY年")
            });
        }else if(chose==2){
            this.setState({
                plan:'季度目标',
                yearMonth:moment().format("YYYY年")+jidu+'季度'
            })
        }else if(chose==3){
            this.setState({
                plan:'月度目标',
                yearMonth:moment().format("YYYY年M月")
            })
        }

    }

    planNode(position) {
        var lit = [] ;
        if(this.state.planNode[position]){
            return;
        }
        for(var i in this.state.planNode) {
            if(i == position) {
                lit.push(!this.state.planNode[i])
            }else if(!this.state.planNode[!i]){
                lit.push(this.state.planNode[!i])
            }
        }
        this.setState({
            planNode: lit
        })
    }

    //删除产品
    //金额目标
    //当你 删除完  标识的数组值已经发生改变
    if_isset(e){
        for(var i  in this.state.addproductsing){
            if(this.state.addproductsing[i]==e){
                return true;
            }else{
                return false;
            }
        }
    }
    //销售目标
    //当你 删除完  标识的数组值已经发生改变
    if_isset1(e){
        for(var i  in this.state.addproductsing1){
            if(this.state.addproductsing1[i]==e){
                return true;
            }else{
                return false;
            }
        }
    }

    //金额目标 添加 产品列
    add_listView(){
        if(this.state.product_name_0==''){
            return toast.center('请完善产品信息');
        }
        if(this.state.product_num_0==''){
            return toast.center('请完善产品信息');
        }
        if(this.state.product_exnum_0==''){
            return toast.center('请完善产品信息');
        }
        //如果添加产品标识的数 没有值 就设置初始值1  如果有 取当前最大的值 加一在 push 到标识数组中
        // 这样就保证了 标识的数字没有重复值
        if (this.state.addproductsing.length == 0) {
            maxnumber = 1
        } else {
            for(var i in this.state.addproductsing){
                var productnamesing1='product_name_'+this.state.addproductsing[i];
                var productnumsing1='product_num_'+this.state.addproductsing[i];
                var productexnumsing1='product_exnum_'+this.state.addproductsing[i];

                if(this.state[productnamesing1]==undefined  || this.state[productnamesing1]==''){
                    return toast.center('请完善产品信息');
                }else if(this.state[productnumsing1]==undefined || this.state[productnumsing1]==''){
                    return toast.center('请完善产品信息');
                }else if(this.state[productexnumsing1]==undefined || this.state[productexnumsing1]==''){
                    return toast.center('请完善产品信息');
                }else{
                    var maxnumber = Math.max.apply(null, this.state.addproductsing) - (-1);
                }
            }

        }

        this.state.addproductsing.push(maxnumber);
        this.setState({
            content:'继续添加',
        })
    }

    //销售目标 添加 产品列
    add_listView2(){
        if(this.state.product_sellname_0==''){
            return toast.center('请完善产品信息');
        }
        if(this.state.product_sellnum_0==''){
            return toast.center('请完善产品信息');
        }
        if( this.state.product_sellexnum_0==''){
            return toast.center('请完善产品信息');
        }
        //如果添加产品标识的数 没有值 就设置初始值1  如果有 取当前最大的值 加一在 push 到标识数组中
        // 这样就保证了 标识的数字没有重复值
        if (this.state.addproductsing1.length == 0) {
            maxnumber = 1
        } else {
            for(var i in this.state.addproductsing1){
                var productsellnamesing1='product_sellname_'+this.state.addproductsing1[i];
                var productsellnumsing1='product_sellnum_'+this.state.addproductsing1[i];
                var productsellexnumsing1='product_sellexnum_'+this.state.addproductsing1[i];
                if(this.state[productsellnamesing1]==undefined  || this.state[productsellnamesing1]==''){
                    return toast.center('请完善产品信息');
                }else if(this.state[productsellnumsing1]==undefined || this.state[productsellnumsing1]==''){
                    return toast.center('请完善产品信息');
                }else if(this.state[productsellexnumsing1]==undefined || this.state[productsellexnumsing1]==''){
                    return toast.center('请完善产品信息');
                }else{
                    var maxnumber = Math.max.apply(null, this.state.addproductsing1) - (-1);
                }
            }

        }

        this.state.addproductsing1.push(maxnumber);
        this.setState({
            content2:'继续添加',
        })
    }

    confirm(){
        //金额目标
        var money= parseInt(this.state.total_money);
        if(money=='' || money==0){
            toast.center('总目标金额不能为空');
            return false;
        }
        var exminemoney= parseInt(this.state.total_examine);
        if(exminemoney>money){
            toast.center('总目标考核不能大于总目标金额');
            return false;
        }
        //产品信息 id
        var product_info=[];
        product_info.push({product_id:this.state.product_id_0});
        product_info.push({product_num:this.state.product_num_0});
        product_info.push({product_exnum:this.state.product_exnum_0});
        var num1=parseInt(this.state.product_num_0);
        var examine1= parseInt(this.state.product_exnum_0);
        if(num1<examine1){
            toast.center('产品考核目标不能大于产品金额目标');
            return false;
        }
        var num_sum=  parseInt(this.state.product_num_0);
        var exnum_sum= parseInt(this.state.product_exnum_0);
        if(this.state.addproductsing.length!=0){
            for(var i in this.state.addproductsing){
                var productidmark='product_id_'+this.state.addproductsing[i];
                var productmoneynum='product_num_'+this.state.addproductsing[i];
                var productmoneyexnum='product_exnum_'+this.state.addproductsing[i];
                var num1=parseInt(this.state[productmoneynum]);
                var examine1= parseInt(this.state[productmoneyexnum]);
                if(num1 <examine1){
                    toast.center('产品考核目标不能大于产品金额目标');
                    return false;
                }
                product_info.push({product_id:this.state[productidmark]});
                product_info.push({product_num:this.state[productmoneynum]});
                product_info.push({product_exnum:this.state[productmoneyexnum]});
                num_sum= parseInt(num_sum*1 + this.state[productmoneynum]*1);
                exnum_sum= parseInt(exnum_sum*1 + this.state[productmoneyexnum]*1);
            }
        }
        if(num_sum>money) {
            toast.center('产品目标金额不能大于总目标金额');
            return false;
        }

        if(exnum_sum>exminemoney) {
            toast.center('产品考核金额不能大于总考核金额');
            return false;
        }
        //销售目标
        var sell_num= parseInt(this.state.sell_total);
        var sell_examine= parseInt(this.state.sell_examine);
        if(sell_num<sell_examine){
            toast.center('总考核销量不能大于总目标销量');
            return false;
        }
        //产品信息 id

        var product_info1=[];
        product_info1.push({product_sellid:this.state.product_sellid_0})
        product_info1.push({product_sellnum:this.state.product_sellnum_0})
        product_info1.push({product_sellexnum:this.state.product_sellexnum_0})
        var sellnum= parseInt(this.state.product_sellnum_0);
        var sellexamine= parseInt(this.state.product_sellexnum_0)
        if(sellnum < sellexamine){
            toast.center('产品考核目标不能大于产品销售目标');
            return false;
        }
        var sum1=parseInt(this.state.product_sellnum_0);
        var sum2=parseInt(this.state.product_sellexnum_0);
        if(this.state.addproductsing1.length!=0){
            for(var i in this.state.addproductsing1){
                var productsellidmark1='product_sellid_'+this.state.addproductsing1[i];
                var productsellnum='product_sellnum_'+this.state.addproductsing1[i];
                var productsellexnum='product_sellexnum_'+this.state.addproductsing1[i];
                var sell1=  parseInt(this.state[productsellnum]);
                var sell2=  parseInt(this.state[productsellexnum]);
                if(sell1<sell2){
                    toast.center('产品考核目标不能大于产品销售目标');
                    return false;
                }
                product_info1.push({product_sellid:this.state[productsellidmark1]});
                product_info1.push({product_sellnum:this.state[productsellnum]});
                product_info1.push({product_sellexnum:this.state[productsellexnum]});
                sum1= parseInt(sum1*1 + this.state[productsellnum]*1);
                sum2=  parseInt(sum2*1 + this.state[productsellexnum]*1);
            }
        }
        if(sum1>sell_num) {
            toast.center('产品销售目标不能大于总目标销量');
            return false;
        }
        if(sum2>sell_examine) {
            toast.center('产品考核目标不能大于总考核销量');
            return false;
        }
        var url = config.api.base + config.api.addGoal;
        request.post(url,{
            company_id:this.props.navigation.state.params.company_id,
            user_id:this.props.navigation.state.params.user_id,
            plan:this.state.plan,
            yearMonth:this.state.yearMonth,
            total_money:this.state.total_money,
            total_examine:this.state.total_examine,
            money_product:product_info,
            sell_total:this.state.sell_total,
            sell_examine:this.state.sell_examine,
            sell_product:product_info1,
        }).then((result)=> {
            if(result.status == 1) {
                toast.center('添加成功');
                DeviceEventEmitter.emit('addgoal',
                    {'company_id':this.props.navigation.state.params.company_id,
                     'user_id':this.props.navigation.state.params.user_id});
                this.props.navigation.goBack('AddGoal');
            } else if(result.status == 2) {
                toast.center('添加目标已经存在，不可重复添加');
                return false;
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
    //删除产品
    //金额目标
    //删除产品
    //金额目标
    del_product(e){
        var length= this.state.addproductsing.length;
        if(e==0 && length==0){
            var productsellidsing1 = 'product_id_' + 0;
            var productsellnamesing1 = 'product_name_' + 0;
            var productsellnumsing1 = 'product_num_' + 0;
            var productsellexnumsing1 = 'product_exnum_' + 0;
            this.setState({
                [productsellidsing1] :'',
                [productsellnamesing1]:'',
                [productsellnumsing1]:'' ,
                [productsellexnumsing1]:'',
                pname:[],
            })
        }else if(e==0 && length!=0){
            toast.center("请从最后一行产品删除")
        }else{
            var k=parseInt(e)-1;
            for(var i in this.state.addproductsing) {
                if(i==k){
                    var productsellidsing1 = 'product_id_' + this.state.addproductsing[i];
                    var productsellnamesing1 = 'product_name_' + this.state.addproductsing[i];
                    var productsellnumsing1 = 'product_num_' + this.state.addproductsing[i];
                    var productsellexnumsing1 = 'product_exnum_' + this.state.addproductsing[i];
                    var arr1=this.state.pname;
                    for(var j in arr1){
                        if(arr1[j]==this.state[productsellnamesing1]){
                            arr1[j]=false;
                        }
                    }
                    this.state.addproductsing.splice(i,1);
                    this.setState({
                        [productsellidsing1] :'',
                        [productsellnamesing1]:'',
                        [productsellnumsing1]:'' ,
                        [productsellexnumsing1]:'',
                        pname:arr1,
                    })
                }
            }
        }
        //this.state.addproductsing.splice(e,1); // e 索引值 1 是删除的长度

        if(this.state.addproductsing.length==0){
            this.setState({
                content:'添加产品金额目标'
            })
        }
    }

    //删除产品
    //销售目标
    del_product1(e){
        var length= this.state.addproductsing1.length;
        if(e==0 && length){
           toast.center("请从最后一行产品删除")
        }else{
            var k=parseInt(e)-1;
            for(var i in this.state.addproductsing1) {
                if(i==k){
                    var productsellidsing1 = 'product_sellid_' + this.state.addproductsing1[i];
                    var productsellnamesing1 = 'product_sellname_' + this.state.addproductsing1[i];
                    var productsellnumsing1 = 'product_sellnum_' + this.state.addproductsing1[i];
                    var productsellexnumsing1 = 'product_sellexnum_' + this.state.addproductsing1[i];
                    var arr1=this.state.pname1;
                    for(var j in arr1){
                        if(arr1[j]==this.state[productsellnamesing1]){
                            arr1[j]=false;
                        }
                    }
                    this.state.addproductsing1.splice(i,1);
                    this.setState({
                        [productsellidsing1] :'',
                        [productsellnamesing1]:'',
                        [productsellnumsing1]:'' ,
                        [productsellexnumsing1]:'',
                        pname1:arr1,
                    })
                }
            }
        }
        //this.state.addproductsing1.splice(e,1); // e 索引值 1 是删除的长度
        if(this.state.addproductsing1.length==0){
            this.setState({
                content2:'添加产品销售目标'
            })
        }

    }

    render() {
        var myDate = new Date();
        var yearing=myDate.getFullYear();
        var nextyearing= 0;
        nextyearing= yearing+1;
        //金额目标
        // 产品名称的长度
        var pname=[];
        var arr=this.state.addproductsing  ;
        for(var i in arr){
            this.state.pname.push(false);
        }
        //金额目标 继续添加产品
        var addproduct=[];
        var productsinglist=this.state.addproductsing;
        if(this.state.addproductsing.length>=1){
            //当标识不在 标识数组中  就让其隐藏
            for(var i in productsinglist) {
                var k=parseInt(i)-(-1);
                if(this.if_isset(productsinglist[i]==false)){
                    addproduct.push(
                        <View key= {productsinglist[i]}  style={{display:'none'}}>
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>

                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                    <Text style={{color:'#333'}}>产品</Text>
                                    {this.state.pname[i]==false ? <Text style={{color:'#333',marginRight:screenW*0.35}}></Text>:
                                        <Text style={{color:'#333',marginRight:screenW*0.35}}>{this.state.pname[i]}</Text>}
                                    <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                </View>

                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>金额目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(name) =>{this.setState({name})} }
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>考核目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(name) => this.setState(name)}
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>

                                <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}} onPress={this.del_product.bind(this,k)}>删除</Text>
                                </View>

                            </View>
                        </View>
                    )
                }else{
                    var productnamesing='product_name_'+productsinglist[i];
                    var productnumsing='product_num_'+productsinglist[i];
                    var productexnumsing='product_exnum_'+productsinglist[i];
                    addproduct.push(
                        <View key= {productsinglist[i]} >
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>
                                <TouchableHighlight underlayColor={'transparent'}
                                                    onPress={this.add_product.bind(this,1,i,productsinglist[i])}
                                    >
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                        <Text style={{color:'#333'}}>产品</Text>
                                        {this.state.pname[i]==false ? <Text style={{color:'#333',marginRight:screenW*0.35}}></Text>:
                                            <Text style={{color:'#333',marginRight:screenW*0.35}}>{this.state[productnamesing]}</Text>}
                                        <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableHighlight>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>金额目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(t) => this.setState({[productnumsing]:t})}
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>考核目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(t) => this.setState({[productexnumsing]:t})}
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>

                                <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}}  onPress={this.del_product.bind(this,k)}>删除</Text>
                                </View>

                            </View>
                        </View>

                    )
                }
            }
        }

        //销售目标
        // 产品名称的长度
        var arr1=this.state.addproductsing1;
        var pname1=[];
        for(var i in arr1){
            this.state.pname1.push(false);
        }
        //销售目标 继续添加产品
        var addproduct1=[];
        var productsinglist1=this.state.addproductsing1;
        if(this.state.addproductsing1.length>=1){
            //当标识不在 标识数组中  就让其隐藏
            for(var i in productsinglist1) {
                var k=parseInt(i)-(-1);
                if(this.if_isset1(productsinglist1[i]==false)){
                    addproduct1.push(
                        <View key= {productsinglist1[i]}  style={{display:'none'}}>
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>

                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                    <Text style={{color:'#333'}}>产品</Text>
                                    {this.state.pname[i]==false ? <Text style={{color:'#333',marginRight:screenW*0.35}}></Text>:
                                        <Text style={{color:'#333',marginRight:screenW*0.35}}>{this.state.pname[i]}</Text>}
                                    <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                </View>

                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>销售目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(name) =>{this.setState({name})} }
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>考核目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(name) => this.setState(name)}
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>
                                <TouchableHighlight underlayColor={'transparent'}
                                                    onPress={this.del_product1.bind(this,i)}
                                    >
                                    <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                        <Text style={{color:"#e15151"}}>删除</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    )
                }else{
                    var productsellnamesing='product_sellname_'+productsinglist1[i];
                    var productsellnumsing='product_sellnum_'+productsinglist1[i];
                    var productsellexnumsing='product_sellexnum_'+productsinglist1[i];
                    addproduct1.push(
                        <View key= {productsinglist1[i]} >
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>
                                <TouchableHighlight underlayColor={'transparent'}
                                                    onPress={this.add_product.bind(this,2,i,productsinglist1[i])}
                                    >
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                        <Text style={{color:'#333'}}>产品</Text>
                                        {this.state.pname[i]==false ? <Text style={{color:'#333',marginRight:screenW*0.35}}></Text>:
                                            <Text style={{color:'#333',marginRight:screenW*0.35}}>{this.state[productsellnamesing]}</Text>}
                                        <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableHighlight>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>销售目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(t) => this.setState({[productsellnumsing]:t})}
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>考核目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(t) => this.setState({[productsellexnumsing]:t})}
                                        placeholder ={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>元</Text>
                                </View>

                                <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}}  onPress={this.del_product1.bind(this,k)}>删除</Text>
                                </View>

                            </View>
                        </View>

                    )
                }
            }
        }

        return (
            <View style={styles.ancestorCon}>
                <View style={styles.container}>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.back()}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:17}}>新增企业目标</Text>
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goRight,styles.go]} onPress={()=>this.confirm()}>
                        <Text style={styles.back_text}>确定</Text>
                    </TouchableHighlight>
                </View>
                <ScrollableTabView
                    renderTabBar={() => <ScrollableTabBar
                              style={styles.tabar_scroll}
             />}
                    tabBarUnderlineStyle={{height:2,backgroundColor: '#e15151',}}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#e15151'
                    tabBarInactiveTextColor='#333'
                    >
                    <View  tabLabel=' 金额目标 '>
                        <ScrollView keyboardShouldPersistTaps={'always'}>
                            <View style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.setState({show:!this.state.show})}}>
                                        <View style={[styles.place,{height:35,paddingRight:15,borderColor:'#ccc',borderRightWidth:1}]}>
                                            <Text style={{color:'#333'}}>{this.state.plan}</Text>
                                            <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </TouchableHighlight>
                                    {this.timeChange()}

                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>总目标金额</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(total_money) => this.setState({total_money})}
                                        placeholder ={"请输入目标金额"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={this.state.total_money}
                                        />
                                    <Text>元</Text>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>总目标考核</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(total_examine) => this.setState({total_examine})}
                                        placeholder ={"请输入目标金额"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={this.state.total_examine}
                                        />
                                    <Text>元</Text>
                                </View>
                            </View>
                            <View>
                                <View style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>
                                    <TouchableHighlight underlayColor={'transparent'}
                                                        onPress={ () => {this.add_product(1,0,0)}}
                                        >
                                        <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                            <Text style={{color:'#333'}}>产品</Text>
                                            <Text style={{color:'#333',marginRight:screenW*0.35}}>{this.state.product_name_0}</Text>
                                            <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>金额目标</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(product_num_0) => this.setState({product_num_0})}
                                            placeholder ={"请输入目标金额"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            value={this.state.product_num_0}
                                            />
                                        <Text>元</Text>
                                    </View>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>考核目标</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(product_exnum_0) => this.setState({product_exnum_0})}
                                            placeholder ={"请输入目标金额"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            value={this.state.product_exnum_0}
                                            />
                                        <Text>元</Text>
                                    </View>
                                    <TouchableHighlight underlayColor={'transparent'}
                                                        onPress={this.del_product.bind(this,0)}
                                        >
                                        <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                            <Text style={{color:"#e15151"}}>删除</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                {addproduct}
                                <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.add_listView(this.state.content)}} >
                                    <View style={[styles.place,styles.borderBottom,{justifyContent:'center',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                        <Text style={{color:"#e15151"}}>+ {this.state.content}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </ScrollView>
                    </View >
                    <View  tabLabel=' 销量目标 '>
                        <ScrollView keyboardShouldPersistTaps={'always'}>
                            <View style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                    <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.setState({show:!this.state.show})}}>
                                        <View style={[styles.place,{height:35,paddingRight:15,borderColor:'#ccc',borderRightWidth:1}]}>
                                            <Text style={{color:'#333'}}>{this.state.plan}</Text>
                                            <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </TouchableHighlight>
                                    {this.timeChange()}
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>总目标销量</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(sell_total) => this.setState({sell_total})}
                                        placeholder ={"请输入目标销量"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"

                                        />
                                    <Text>个</Text>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>总考核销量</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(sell_examine) => this.setState({sell_examine})}
                                        placeholder ={"请输入考核销量"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        />
                                    <Text>个</Text>
                                </View>
                            </View>
                            <View>
                                <View style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>
                                    <TouchableHighlight underlayColor={'transparent'}
                                                        onPress={()=>this.add_product(2,0,0)}
                                        >
                                        <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                            <Text style={{color:'#333'}}>产品</Text>
                                            <Text style={{color:'#333',marginRight:screenW*0.35}}>{this.state.product_sellname_0}</Text>
                                            <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>销售目标</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(product_sellnum_0) => this.setState({product_sellnum_0})}
                                            placeholder ={"请输入目标金额"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            value={this.state.product_sellnum_0}
                                            />
                                        <Text>元</Text>
                                    </View>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>考核目标</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(product_sellexnum_0) => this.setState({product_sellexnum_0})}
                                            placeholder ={"请输入目标金额"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            value={this.state.product_sellexnum_0}
                                            />
                                        <Text>元</Text>
                                    </View>
                                    <TouchableHighlight underlayColor={'transparent'}
                                                        onPress={this.del_product1.bind(this,0)}
                                        >
                                        <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                            <Text style={{color:"#e15151"}}>删除</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                {addproduct1}
                                <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.add_listView2(this.state.content2)}} >
                                    <View style={[styles.place,styles.borderBottom,{justifyContent:'center',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                        <Text style={{color:"#e15151"}}>+ {this.state.content2}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </ScrollView>
                    </View >
                </ScrollableTabView>

                <View>
                    <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.show}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                        <View style={{width:screenW,height:screenH,backgroundColor:'#555',opacity:0.6}}>
                            <TouchableOpacity style={{flex:1,height:screenH}} onPress={() => {
                      this.setPlanVisible(!this.state.show)
                    }}></TouchableOpacity>
                        </View>
                        <View style={styles.addCustomer}>
                            <View style={styles.addCustomer_card}>
                                <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.setPlanVisible(!this.state.show);this.planChose(1);this.planNode(0)}}>
                                    <View  style={[styles.padding_lR,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:40}]}>
                                        <View>
                                            <Text  style={{color:'#555'}}>年度目标</Text>
                                        </View>
                                        <View style={{width:10,height:10,borderWidth:1,borderColor:'#aaa',borderRadius:10,justifyContent:'center',alignItems:'center',}}>
                                            <Text style={[this.state.planNode[0]?{backgroundColor: '#429bf7'}:{backgroundColor: '#fff'},styles.yuan]}></Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.setPlanVisible(!this.state.show);this.planChose(2);this.planNode(1)}}>
                                    <View  style={[styles.padding_lR,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:40}]}>
                                        <View>
                                            <Text  style={{color:'#555'}}>季度目标</Text>
                                        </View>
                                        <View style={{width:10,height:10,borderWidth:1,borderColor:'#aaa',borderRadius:10,justifyContent:'center',alignItems:'center',}}>
                                            <Text style={[this.state.planNode[1]?{backgroundColor: '#429bf7'}:{backgroundColor: '#fff'},styles.yuan]}></Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.setPlanVisible(!this.state.show);this.planChose(3);this.planNode(2)}}>
                                    <View  style={[styles.padding_lR,{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:40}]}>
                                        <View>
                                            <Text  style={{color:'#555'}}>月度目标</Text>
                                        </View>
                                        <View style={{width:10,height:10,borderWidth:1,borderColor:'#aaa',borderRadius:10,justifyContent:'center',alignItems:'center',}}>
                                            <Text style={[this.state.planNode[2]?{backgroundColor: '#429bf7'}:{backgroundColor: '#fff'},styles.yuan]}></Text>
                                        </View>
                                    </View>
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
    tabar_scroll:{
        height:44,
        justifyContent:'center',
        borderColor:'#fff'
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
    },
    borderTop:{
        borderTopWidth:1,
        borderColor:'#ccc'

    },
    borderBottom:{
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    padding_lR:{
        paddingLeft:15,
        paddingRight:15
    },
    addCustomer:{
        flex:1,
        position:'absolute',
        top:screenH*0.5-60,
        left:screenW*0.05
    },
    addCustomer_card:{
        width:screenW*0.9,
        height:120,
        backgroundColor:'#fff',
    },
    yuan:{
        width:6,
        height:6,
        borderRadius:10
    },
});
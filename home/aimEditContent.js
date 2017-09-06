/**
 * Created by Administrator on 2017/8/3.
 */
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableHighlight,
    ScrollView,
    TextInput,
    Modal,
    TouchableOpacity,
    Picker,
    DeviceEventEmitter,
    } from 'react-native';
import ScrollableTabView, {ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import moment from 'moment';
import config from '../common/config';
import request from '../common/request';
import toast from '../common/toast';
const screenH =Dimensions.get('window').height;
const screenW = Dimensions.get('window').width;
export default class AimEditContent extends Component {
    OpBack() {
        this.props.navigation.goBack('AimEditContent')
    }
    constructor(props) {
        super(props);
        this.state = {
            listView:[],
            content:'添加产品金额目标',
            content2:'添加产品销量目标',
            addproductsing:[],
            moneylist:[],
            addproductsing1:[],
            selllist:[],
            productData:[],
            pname:[false],
            pids:[],
            pids1:[],
            pname1:[false],
            productNode:[] ,
            product_name_1:'',//金额目标中  固有的商品名称
            product_id_1:'',//金额目标中  固有的商品id
            product_num_1:'',//金额目标中  商品目标金额
            product_exnum_1:'',//金额目标中  固有考核金额
            product_sellname_1:'',//考核目标中  固有的商品名称
            product_sellid_1:'',//考核目标中  固有的商品id
            product_sellnum_1:'',//考核目标中  商品目标金额
            product_sellexnum_1:'',//考核目标中  固有考核金额
        }
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
            var productidsing='product_id_'+value.select_product_sing;
            var productnamesing='product_name_'+value.select_product_sing;
            //alert(productnamesing)
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
                [productnamesing]:value.pname,//新增的商品名称
                [productidsing]:value.pid,//新增的商品id
            })

            this.setState({
                pname: arr,
            });

        }  )
        this.getProductId1= DeviceEventEmitter.addListener('product_id1', (value)=>{
            //判断是固有产品还是新增的产品
            var productsellidsing='product_sellid_'+value.select_product_sing;
            var productsellnamesing='product_sellname_'+value.select_product_sing;
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
                [productsellnamesing]:value.pname,//新增的商品名称
                [productsellidsing]:value.pid,//新增的商品id
            })

            this.setState({
                pname1: arr1,
            });
        }  )
        this.firstProduce();
    }

    firstProduce(){
        var url = config.api.base + config.api.modifyGoal;
        request.post(url,{
            targetid:this.props.navigation.state.params.target_id,
            state:1
        }).then((result)=> {
            if(result.status == 1) {
                this.setState({
                    plan: result.data.plan,
                    yearMonth: result.data.yearMonth,
                    money_total: result.data.total_money,
                    money_examine: result.data.total_examine,
                    sell_total: result.data.sell_total,
                    sell_examine: result.data.sell_examine,
                    product_money: result.data.product_money,
                    product_sell: result.data.product_sell,
                    change1: result.data.state1,
                    change2: result.data.state2,
                });

                if (this.state.change1 && this.state.product_money) {
                    this.setState({
                        content: '继续添加'
                    })
                    var money= this.state.product_money;
                    var brr=[];
                    for(var i in money){
                        var  k= 1*1+i*1;
                        brr.push(k);
                    }
                    this.setState({
                        moneylist:brr,
                    });
                    var brr = [];
                    for (var i in money) {
                        brr.push(money[i]['product_name']);
                        var  k= 1*1+i*1;
                        var productidsing1 = 'product_id_' + k;
                        var productnamesing1 = 'product_name_' + k;
                        var productnumsing1 = 'product_num_' + k;
                        var productexnumsing1 = 'product_exnum_' + k;
                        var idsing= 'id_' + k;
                        this.setState({
                            [idsing]: money[i]['id'],
                            [productidsing1]: money[i]['productid'],
                            [productnamesing1]: money[i]['product_name'],
                            [productnumsing1]: money[i]['product_money'],
                            [productexnumsing1]: money[i]['product_examine'],
                        });
                    }
                    this.setState({
                        pname: brr
                    })

                }
                if (this.state.change2 && this.state.product_sell) {
                    this.setState({
                        content2: '继续添加'
                    });
                    var sell= this.state.product_sell;
                    var brr=[];
                    for(var i in sell){
                        var  k= 1*1+i*1;
                        brr.push(k);
                    }
                    this.setState({
                        selllist:brr,
                    });
                    var brr = [];
                    for (var i in sell) {
                        brr.push(sell[i]['product_name']);
                        var  k= 1*1+i*1;
                        var productsellidsing1 = 'product_sellid_' + k;
                        var productsellnamesing1 = 'product_sellname_' + k;
                        var productsellnumsing1 = 'product_sellnum_' + k;
                        var productsellexnumsing1 = 'product_sellexnum_' + k;
                        var idsing1= 'sellid_' + k;
                        this.setState({
                            [idsing1]: sell[i]['id'],
                            [productsellidsing1]: sell[i]['productid'],
                            [productsellnamesing1]: sell[i]['product_name'],
                            [productsellnumsing1]: sell[i]['sell_num'],
                            [productsellexnumsing1]: sell[i]['sell_examine'],
                        });
                    }
                    this.setState({
                        pname1: brr
                    })

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

    }
    componentWillUnmount() {
        this.getProductId.remove();
        this.getProductId1.remove();
    }
    //删除产品
    //金额目标
    //当你 删除完  标识的数组值已经发生改变
    if_isset(e){
        for(var i in this.state.addproductsing){
            if(this.state.addproductsing[i]==e){
                return true;
            }else{
                return false;
            }
        }
    }
    if_isset_ed(e){
        for(var i in this.state.moneylist){
            if(this.state.moneylist[i]==e){
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
    if_isset1_ed(e){
        for(var i  in this.state.selllist){
            if(this.state.selllist[i]==e){
                return true;
            }else{
                return false;
            }
        }
    }

    //金额目标 添加 产品列
    add_listView(){
        //如果添加产品标识的数 没有值 就设置初始值1  如果有 取当前最大的值 加一在 push 到标识数组中
        // 这样就保证了 标识的数字没有重复值
        if (this.state.addproductsing.length == 0) {
            if(this.state.moneylist.length==0){
                maxnumber = 1;
            } else{
                maxnumber = (this.state.moneylist.length)*1+1*1;
            }
        } else {
            //var  k=(this.state.moneylist.length)*1+1*1;
            for(var i in this.state.addproductsing){
                //k=k*1+i*1;
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
        if (this.state.addproductsing1.length == 0) {
            if(this.state.selllist.length==0){
                maxnumber = 1;
            } else{
                maxnumber = (this.state.selllist.length)*1+1*1;
            }
        } else {
            //var  k=(this.state.selllist.length)*1+1*1;
            for(var i in this.state.addproductsing1){
                //k=k*1+i*1;
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
        var exminemoney= parseInt(this.state.total_examine);
        if(exminemoney>money){
            toast.center('总目标考核不能大于总目标金额');
            return false;
        }
        //已有的产品信息 id
        var product_info=[];
        var num_sum=0;
        var exnum_sum=0;
        if(this.state.moneylist.length!=0){
            for(var i in this.state.moneylist){
                var idsingmark= 'id_'+this.state.moneylist[i];
                var productidmark='product_id_'+this.state.moneylist[i];
                var productmoneynum='product_num_'+this.state.moneylist[i];
                var productmoneyexnum='product_exnum_'+this.state.moneylist[i];
                var num1=parseInt(this.state[productmoneynum]);
                var examine1= parseInt(this.state[productmoneyexnum]);
                if(num1 <examine1){
                    toast.center('产品考核目标不能大于产品金额目标');
                    return false;
                }
                product_info.push({id:this.state[idsingmark]});
                product_info.push({product_id:this.state[productidmark]});
                product_info.push({product_num:this.state[productmoneynum]});
                product_info.push({product_exnum:this.state[productmoneyexnum]});
                num_sum= parseInt(num_sum*1 + this.state[productmoneynum]*1);
                exnum_sum= parseInt(exnum_sum*1 + this.state[productmoneyexnum]*1);
            }
        }
        //新增的产品信息
        var addproduct_info=[];
        var num_sum2=0;
        var exnum_sum2=0;
        if(this.state.addproductsing.length!=0){
            for(var i in this.state.addproductsing){
                var productidmark='product_id_'+this.state.addproductsing[i];
                var productmoneynum='product_num_'+this.state.addproductsing[i];
                var productmoneyexnum='product_exnum_'+this.state.addproductsing[i];
                var num11=parseInt(this.state[productmoneynum]);
                var examine11= parseInt(this.state[productmoneyexnum]);
                if(num11 <examine11){
                    toast.center('产品考核目标不能大于产品金额目标');
                    return false;
                }
                addproduct_info.push({product_id:this.state[productidmark]});
                addproduct_info.push({product_num:this.state[productmoneynum]});
                addproduct_info.push({product_exnum:this.state[productmoneyexnum]});
                num_sum2= parseInt(num_sum2*1 + this.state[productmoneynum]*1);
                exnum_sum2= parseInt(exnum_sum2*1 + this.state[productmoneyexnum]*1);
            }
        }
        num_sum=parseInt(num_sum*1+num_sum2*1);
        if(num_sum>money) {
            toast.center('产品目标金额不能大于总目标金额');
            return false;
        }
        exnum_sum=parseInt(exnum_sum*1+exnum_sum2*1);
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

        //已有的产品信息 id销量
        var product_info1=[];
        var sell_sum=0;
        var sell_exsum=0;
        if(this.state.selllist.length!=0){
            for(var i in this.state.selllist){
                var idsingmark= 'sellid_'+this.state.selllist[i];
                var productidmark='product_id_'+this.state.selllist[i];
                var productmoneynum='product_num_'+this.state.selllist[i];
                var productmoneyexnum='product_exnum_'+this.state.selllist[i];
                var sellnum1=parseInt(this.state[productmoneynum]);
                var sellexamine1= parseInt(this.state[productmoneyexnum]);
                if(sellnum1 < sellexamine1){
                    toast.center('产品考核目标不能大于产品金额目标');
                    return false;
                }
                product_info1.push({sellid:this.state[idsingmark]});
                product_info1.push({product_id:this.state[productidmark]});
                product_info1.push({product_num:this.state[productmoneynum]});
                product_info1.push({product_exnum:this.state[productmoneyexnum]});
                sell_sum= parseInt(sell_sum*1 + this.state[productmoneynum]*1);
                sell_exsum= parseInt(sell_exsum*1 + this.state[productmoneyexnum]*1);
            }
        }
        var addproduct_info1=[];
        var sum1=0;
        var sum2=0;
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
                addproduct_info1.push({product_sellid:this.state[productsellidmark1]});
                addproduct_info1.push({product_sellnum:this.state[productsellnum]});
                addproduct_info1.push({product_sellexnum:this.state[productsellexnum]});
                sum1= parseInt(sum1*1 + this.state[productsellnum]*1);
                sum2=  parseInt(sum2*1 + this.state[productsellexnum]*1);
            }
        }
        sum1= parseInt(sum1*1 + sell_sum*1);
        sum2= parseInt(sum2*1 + sell_exsum*1);
        if(sum1>sell_num) {
            toast.center('产品销售目标不能大于总目标销量');
            return false;
        }
        if(sum2>sell_examine) {
            toast.center('产品考核目标不能大于总考核销量');
            return false;
        }
        var url = config.api.base + config.api.modifyGoal;
        request.post(url,{
            modify:1,
            company_id:this.props.navigation.state.params.company_id,
            user_id:this.props.navigation.state.params.user_id,
            target_id:this.props.navigation.state.params.target_id,
            //plan:this.state.plan,
            //yearMonth:this.state.yearMonth,
            total_money:this.state.money_total,
            total_examine:this.state.money_examine,
            moneyproduct:product_info,
            addproduct:addproduct_info,
            sell_total:this.state.sell_total,
            sell_examine:this.state.sell_examine,
            sellproduct:product_info1,
            addsellproduct:addproduct_info1,
        }).then((result)=> {
            if(result.status == 1) {
                toast.center('编辑成功！');
                DeviceEventEmitter.emit('modifygoal',
                    {'company_id':this.props.navigation.state.params.company_id,
                        'user_id':this.props.navigation.state.params.user_id});
                this.props.navigation.goBack('AimEditContent');
            } else if(result.status ==0) {
                toast.center('编辑失败！');
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
    del_product(position,e){
        if(position==1){
            var money= this.state.product_money;
            var arr=this.state.pname;
            var k=1*1+e*1;
            var idsing='id_'+k;
            var namesing = 'product_name_' + k;
            var id=this.state[idsing];
            for(var i in money){
                if(id==money[i]['id']){
                    money.splice(i,1);
                    var productidsing1 = 'product_id_' + k;
                    var productnamesing1 = 'product_name_' + k;
                    var productnumsing1 = 'product_num_' + k;
                    var productexnumsing1 = 'product_exnum_' + k;
                    var idsing= 'id_' + k;
                    this.setState({
                        [idsing]: '',
                        [productidsing1]: '',
                        [namesing]:'',
                        [productnumsing1]: '',
                        [productexnumsing1]: '',
                    });
                }
            }
            for(var j in arr){
                if(arr[j]==this.state[namesing]){
                    arr[j]=false;
                }
            }
            var brr=[];
            for(var i in money){
                if(money[i]){
                    var  j= 1*1+i*1;
                    brr.push(j);
                }
            }
            this.setState({
                product_money:money,
                moneylist:brr,
                pname:arr,
            });
            for (var i in money) {
                var  t= 1*1+i*1;
                var productidsing1 = 'product_id_' + t;
                var productnamesing1 = 'product_name_' + t;
                var productnumsing1 = 'product_num_' + t;
                var productexnumsing1 = 'product_exnum_' + t;
                var idsing= 'id_' + t;
                this.setState({
                    [idsing]: money[i]['id'],
                    [productidsing1]: money[i]['productid'],
                    [productnamesing1]: money[i]['product_name'],
                    [productnumsing1]: money[i]['product_money'],
                    [productexnumsing1]: money[i]['product_examine'],
                });
            }
        } else if(position==2){
            for(var i in this.state.addproductsing) {
                if(i==e){
                    var productidsing1 = 'product_id_' + this.state.addproductsing[i];
                    var productnamesing1 = 'product_name_' + this.state.addproductsing[i];
                    var productnumsing1 = 'product_num_' + this.state.addproductsing[i];
                    var productexnumsing1 = 'product_exnum_' + this.state.addproductsing[i];
                    var arr1=this.state.pname;
                    for(var j in arr1){
                        if(arr1[j]==this.state[productnamesing1]){
                            arr1[j]=false;
                        }
                    }
                    this.setState({
                        [productidsing1] :'',
                        [productnamesing1]:'',
                        [productnumsing1]:'' ,
                        [productexnumsing1]:'',
                        pname:arr1,
                    })
                }
            }
            this.state.addproductsing.splice(e,1); // e 索引值 1 是删除的长度
        }
        if(this.state.moneylist.length==0 && this.state.addproductsing.length==0){
            this.setState({
                change1:'',
                content:'添加产品金额目标'
            })
        }
    }

    //删除产品
    //销售目标
    del_product1(position,e){
        if(position==1){
            var sell= this.state.product_sell;
            var arr=this.state.pname1;
            var k=1*1+e*1;
            var sellidsing='sellid_'+k;
            var namesing1 = 'product_sellname_' + k;
            var id=this.state[sellidsing];
            for(var i in sell){
                if(id==sell[i]['id']){
                    sell.splice(i,1);
                }
            }
            for(var j in arr){
                if(arr[j]==this.state[namesing1]){
                    arr[j]=false;
                }
            }
            var brr=[];
            if(sell){
                for(var i in sell){
                    var  k= 1*1+i*1;
                    brr.push(k);
                }
                this.setState({
                    selllist:brr,
                    pname1:arr,
                });
            }else{
                this.setState({
                    selllist:[],
                    product_sell:sell,
                    pname1:arr,
                });
            }
            for (var i in sell) {
                var productsellidsing1 = 'product_sellid_' + this.state.selllist[i];
                var productsellnamesing1 = 'product_sellname_' + this.state.selllist[i];
                var productsellnumsing1 = 'product_sellnum_' + this.state.selllist[i];
                var productsellexnumsing1 = 'product_sellexnum_' + this.state.selllist[i];
                var idsing1= 'sellid_' + this.state.selllist[i];
                this.setState({
                    [idsing1]: sell[i]['id'],
                    [productsellidsing1]: sell[i]['productid'],
                    [productsellnamesing1]: sell[i]['product_name'],
                    [productsellnumsing1]: sell[i]['sell_num'],
                    [productsellexnumsing1]: sell[i]['sell_examine'],
                });
            }
            if(this.state.selllist.length==0 && this.state.addproductsing1.length==0){
                this.setState({
                    change2:'',
                    content2:'添加产品销量目标'
                })
            }
        } else if(position==2){
            for(var i in this.state.addproductsing1) {
                if(i==e){
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
                    this.setState({
                        [productsellidsing1] :'',
                        [productsellnamesing1]:'',
                        [productsellnumsing1]:'' ,
                        [productsellexnumsing1]:'',
                        pname1:arr1,
                    })
                }
            }
            this.state.addproductsing1.splice(e,1); // e 索引值 1 是删除的长度
            if(this.state.selllist.length==0 && this.state.addproductsing1.length==0){
                this.setState({
                    change2:'',
                    content2:'添加产品销量目标'
                })
            }
        }
    }

    //删除目标
    deleteaim(tid){
        var url = config.api.base + config.api.deleteGoal;
        request.post(url,{
            delete:1,
            company_id:this.props.navigation.state.params.company_id,
            target_id:tid,
        }).then((result)=> {
            if(result.status == 1) {
                toast.center('删除成功！');
                this.props.navigation.navigate('Aim',{'company_id':this.props.navigation.state.params.company_id,
                    'user_id':this.props.navigation.state.params.user_id,});
            } else if(result.status ==0) {
                toast.center('删除失败！');
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
    render() {
        //金额目标
        // 从后天获取的产品列表信息
        if(this.state.product_money) {
            var moneylist=this.state.moneylist;
            var moneyData=[];
            for(var i in moneylist){
                if(this.if_isset_ed(moneylist[i]==false)){
                    moneyData.push(
                        <View key= {moneylist[i]}  style={{display:'none'}}>
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
                                    <Text style={{color:"#e15151"}} onPress={this.del_product.bind(this,1,i)}>删除</Text>
                                </View>

                            </View>
                        </View>
                    )
                }else{
                    var k=1*1+i*1;
                    var productnamesing1='product_name_'+k;
                    var productnumsing1='product_num_'+k;
                    var productexnumsing1='product_exnum_'+k;
                    if(this.state[productnamesing1]) {
                        moneyData.push(
                            <View key= {moneylist[i]} >
                                <View style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>
                                    <TouchableHighlight underlayColor={'transparent'}
                                                        onPress={this.add_product.bind(this,1,k,moneylist[i])}
                                        >
                                        <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                            <Text style={{color:'#333'}}>产品</Text>
                                            {this.state.pname[i]==false ? <Text style={{color:'#333',marginRight:screenW*0.35}}></Text>:
                                                <Text style={{color:'#333',marginRight:screenW*0.35}}>{this.state[productnamesing1]}</Text>}
                                            <Image  style={{width:12,height:12,marginLeft:5}} source={require('../imgs/customer/arrow_r.png')}/>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>金额目标</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(t) => this.setState({[productnumsing1]:t})}
                                            placeholder ={"必填"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            keyboardType="number-pad"
                                            value={this.state[productnumsing1]}
                                            />
                                        <Text>元</Text>
                                    </View>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>考核目标</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(t) => this.setState({[productexnumsing1]:t})}
                                            placeholder ={"必填"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            keyboardType="number-pad"
                                            value={this.state[productexnumsing1]}
                                            />
                                        <Text>元</Text>
                                    </View>

                                    <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                        <Text style={{color:"#e15151"}}  onPress={this.del_product.bind(this,1,i)}>删除</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                }
            }
        }
        //继续添加新的产品信息
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
                                    <Text style={{color:"#e15151"}} onPress={this.del_product.bind(this,2,i)}>删除</Text>
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
                                                    onPress={this.add_product.bind(this,1,k,productsinglist[i])}
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
                                    <Text style={{color:"#e15151"}}  onPress={this.del_product.bind(this,2,i)}>删除</Text>
                                </View>

                            </View>
                        </View>

                    )
                }
            }
        }


        if(this.state.product_sell) {
            var selllist = this.state.selllist;
            var sellData = [];
            for (var i in selllist) {
                if (this.if_isset1_ed(selllist[i] == false)) {
                    sellData.push(
                        <View key={selllist[i]} style={{display:'none'}}>
                            <View key={i} style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>
                                <View
                                    style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                    <Text style={{color:'#333'}}>产品</Text>
                                    {this.state.pname[i] == false ?
                                        <Text style={{color:'#333',marginRight:screenW*0.35}}></Text> :
                                        <Text
                                            style={{color:'#333',marginRight:screenW*0.35}}>{this.state.pname[i]}</Text>}
                                    <Image style={{width:12,height:12,marginLeft:5}}
                                           source={require('../imgs/customer/arrow_r.png')}/>
                                </View>

                                <View
                                    style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>销售目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(name) =>{this.setState({name})} }
                                        placeholder={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>个</Text>
                                </View>
                                <View
                                    style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>考核目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(name) => this.setState(name)}
                                        placeholder={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        />
                                    <Text>个</Text>
                                </View>
                                <View
                                    style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}} onPress={this.del_product1.bind(this,i)}>删除</Text>
                                </View>

                            </View>
                        </View>
                    )
                } else {
                    var k = 1 * 1 + i * 1;
                    var productnamesing1 = 'product_sellname_' + k;
                    var productnumsing1 = 'product_sellnum_' + k;
                    var productexnumsing1 = 'product_sellexnum_' + k;
                    sellData.push(
                        <View key={selllist[i]}>
                            <View style={[styles.borderTop,{backgroundColor:"#fff",marginTop:8}]}>
                                <TouchableHighlight underlayColor={'transparent'}
                                                    onPress={this.add_product.bind(this,1,i,selllist[i])}
                                    >
                                    <View
                                        style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                        <Text style={{color:'#333'}}>产品</Text>
                                        {this.state.pname[i] == false ?
                                            <Text style={{color:'#333',marginRight:screenW*0.35}}></Text> :
                                            <Text
                                                style={{color:'#333',marginRight:screenW*0.35}}>{this.state[productnamesing1]}</Text>}
                                        <Image style={{width:12,height:12,marginLeft:5}}
                                               source={require('../imgs/customer/arrow_r.png')}/>
                                    </View>
                                </TouchableHighlight>
                                <View
                                    style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>销售目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(t) => this.setState({[productnumsing1]:t})}
                                        placeholder={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        value={this.state[productnumsing1]}
                                        />
                                    <Text>个</Text>
                                </View>
                                <View
                                    style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>考核目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(t) => this.setState({[productexnumsing1]:t})}
                                        placeholder={"必填"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        keyboardType="number-pad"
                                        value={this.state[productexnumsing1]}
                                        />
                                    <Text>个</Text>
                                </View>
                                <View
                                    style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}} onPress={this.del_product1.bind(this,1,i)}>删除</Text>
                                </View>
                            </View>
                        </View>
                    )
                }
            }
        }
        //销售目标
        var arr1=this.state.addproductsing1;
        for(var i in arr1){
            this.state.pname1.push(false);
        }
        //销售目标 继续添加产品
        var addproduct1=[];
        var productsinglist1=this.state.addproductsing1;
        if(this.state.addproductsing1.length>=1){
            //当标识不在 标识数组中  就让其隐藏
            for(var i in productsinglist1) {
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
                                    <Text>个</Text>
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
                                    <Text>个</Text>
                                </View>
                                <TouchableHighlight underlayColor={'transparent'}
                                                    onPress={this.del_product1.bind(this,2,i)}
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
                                    <Text>个</Text>
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
                                    <Text>个</Text>
                                </View>

                                <View style={[styles.place,styles.borderBottom,{justifyContent:'flex-end',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}}  onPress={this.del_product1.bind(this,2,i)}>删除</Text>
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
                    <TouchableHighlight underlayColor={'transparent'} style={[styles.goback,styles.go]} onPress={()=>this.OpBack()}>
                        <View style={{flexDirection:'row'}}>
                            <Image  style={styles.back_icon} source={require('../imgs/customer/back.png')}/>
                            <Text style={styles.back_text}>返回</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={{color:'#333',fontSize:17}}>编辑企业目标</Text>
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
                        <ScrollView  keyboardShouldPersistTaps={'always'}>
                            <View style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                    <View style={[styles.place,{height:35,paddingRight:15,borderColor:'#ccc',borderRightWidth:1}]}>
                                        <Text style={{color:'#333'}}> {this.state.plan} </Text>
                                    </View>
                                    <View style={[styles.place]}>
                                        <Text style={{color:'#333'}} >{this.state.yearMonth}</Text>
                                    </View>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>总金额目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(money_total) => this.setState({money_total})}
                                        placeholder ={"请输入目标金额"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={this.state.money_total}
                                        />
                                    <Text>元</Text>
                                </View>
                                <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                    <Text style={{color:'#333'}}>总考核目标</Text>
                                    <TextInput
                                        style={{width:screenW*0.5,padding:0,}}
                                        onChangeText={(money_examine) => this.setState({money_examine})}
                                        placeholder ={"请输入目标金额"}
                                        placeholderTextColor={"#888"}
                                        underlineColorAndroid="transparent"
                                        value={this.state.money_examine}
                                        />
                                    <Text>元</Text>
                                </View>
                            </View>
                            <View>
                                {moneyData}
                                {addproduct}
                            </View>
                            <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.add_listView()}} >
                                <View style={[styles.place,styles.borderBottom,{justifyContent:'center',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}}>+ {this.state.content}</Text>
                                </View>
                            </TouchableHighlight>
                        </ScrollView>
                    </View >
                    <View  tabLabel=' 销量目标 '>
                        <ScrollView  keyboardShouldPersistTaps={'always'}>
                            <View style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                <View style={[styles.borderTop,{backgroundColor:"#fff"}]}>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between',backgroundColor:'#fff',height:35}]}>
                                        <View style={[styles.place,{height:35,paddingRight:15,borderColor:'#ccc',borderRightWidth:1}]}>
                                            <Text style={{color:'#333'}}> {this.state.plan} </Text>
                                        </View>
                                        <View style={[styles.place]}>
                                            <Text style={{color:'#333'}} >{this.state.yearMonth}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>总销量目标</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(name) => this.setState({sell_total:name})}
                                            placeholder ={"请输入目标销量"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            value={this.state.sell_total}
                                            />
                                        <Text>个</Text>
                                    </View>
                                    <View style={[styles.place,styles.borderBottom,styles.padding_lR,{justifyContent:'space-between'}]}>
                                        <Text style={{color:'#333'}}>总考核销量</Text>
                                        <TextInput
                                            style={{width:screenW*0.5,padding:0,}}
                                            onChangeText={(sell_examine) => this.setState({sell_examine})}
                                            placeholder ={"请输入目标金额"}
                                            placeholderTextColor={"#888"}
                                            underlineColorAndroid="transparent"
                                            value={this.state.sell_examine}
                                            />
                                        <Text>个</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                {sellData}
                                {addproduct1}
                            </View>
                            <TouchableHighlight underlayColor={'#fff'} onPress={()=>{this.add_listView2()}} >
                                <View style={[styles.place,styles.borderBottom,{justifyContent:'center',paddingLeft: 15,paddingRight:15,backgroundColor:'#fff',height:30}]}>
                                    <Text style={{color:"#e15151"}}>+ {this.state.content2}</Text>
                                </View>
                            </TouchableHighlight>
                        </ScrollView>
                    </View >
                </ScrollableTabView>
                <TouchableHighlight underlayColor={'transparent'}
                                    onPress={()=>this.deleteaim(this.props.navigation.state.params.target_id)}
                    >
                    <View style={[styles.border_top,styles.border_colorBottom,]}>
                        <Text style={{color:'#e15151'}}>删除目标</Text>
                    </View>
                </TouchableHighlight>
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
    padding_lR2:{
        paddingLeft:30,
        paddingRight:30
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
    border_top:{
        borderTopWidth:1,
    },
    border_colorBottom :{
        borderColor:'#ddd',
        borderBottomWidth:1,
        alignItems:'center',
        height:40,
        borderColor:'#ccc',
        justifyContent:'center',
        paddingLeft:15,
        backgroundColor:'#fff',
        marginTop:10
    },
});
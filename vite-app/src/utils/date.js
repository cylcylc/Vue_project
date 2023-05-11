export const format=(date,fmt)=>{
    var o = { 
        "M+" : date.getMonth()+1,                 //月份 
        "d+" : date.getDate(),                    //日 
        "h+" : date.getHours(),                   //小时 
        "m+" : date.getMinutes(),                 //分 
        "s+" : date.getSeconds(),                 //秒 
        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
        "S"  : date.getMilliseconds()             //毫秒 
    }; 
    //(y+)匹配多个y，比如yyyy
    if(/(y+)/.test(fmt)) {
         // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
   }
   export function timestamp(timestamp,type) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D =
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes(): date.getMinutes());
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      if(type===1){
        return h + m;
      }else if(type===2){
        return M+D;
      }else{
       return  Y+M+D+h+m
      }
    
  }
  
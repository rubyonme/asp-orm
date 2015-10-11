Object.prototype.toJSON = function(){  
    var json = [];  
    for(var i in this){  
        if(!this.hasOwnProperty(i)) continue;
    if(typeof(this[i]) == 'date'){
      var date = new Date(this[i]);
      var month = (date.getMonth()+1)<10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
      var day = date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var hour = date.getHours()<10 ? "0"+date.getHours() : date.getHours();
      var minute = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      var dateStr = date.getFullYear() + "-" + month + "-" + day + " " +  hour + ":" + minute ;
      json.push(i.toJSON() + ':"' + ((this[i] != null) ? dateStr + '"' : "null")  );
    }else{
      json.push(
        i.toJSON() + ":" +  
        ((this[i] != null) ? this[i].toJSON() : "null")  
      );
    }
    }  
    return "{" + json.join(",") + "}";  
}
Boolean.prototype.toJSON = function(){
  return this;
}
Array.prototype.toJSON = function(){  
    for(var i=0,json=[];i<this.length;i++)  
        json[i] = (this[i] != null) ? this[i].toJSON() : "null";  
    return "["+json.join(",")+"]"  
}
String.prototype.toJSON = function(){  
    return '"' +  
        escape(this).replace(/%/g,"\\").toLowerCase()  
        .replace(/\n|\r|\t/g,function(){  
            var a = arguments[0];  
            return  (a == '\n') ? '\\n':  
                    (a == '\r') ? '\\r':  
                    (a == '\t') ? '\\t': ""  
        }) +  
        '"'  
}
String.prototype.flush = function(){  
    Response.Write(this); 
}
Number.prototype.toJSON = function(){
  return this;
}
Date.prototype.getDsFormat = function(){
  var Month = (this.getMonth() + 1) + "/";
  var Day = this.getDate() + "/";
  var Year = this.getFullYear();
  var JustTheDate =  Month + Day + Year;
  var minute=this.getMinutes();
  var second=this.getSeconds();
  var ampm=false;
  if (minute >=0 && minute < 10){ 
    minute=("0" + minute)
  }
  if (second >= 0 && second < 10 ){ 
    second=("0" + second)
  }
  var hours=this.getHours()
  if (hours > 12){ 
    ampm=true
    hours=hours-12
  }
  if (hours==12){ 
    ampm=true 
  }
  if (hours == 0){ 
    hours=hours+12
    ampm=false 
  }
  if (ampm){ 
    ampm=" PM" 
  }
  else{ 
    ampm=" AM" 
  }
  var myTime=hours + ":" + minute + ":" + second  + ampm
  return JustTheDate + " " + myTime;
}
var $ = function(selector){
  return selector.substring(0,2) == "T." ? new MCube(selector) : new jQuery(selector);
}
function MCube(selector){
  var rs = conn.Execute("select top 1 * from " + selector.substring(2));
  this.tableName = selector.substring(2);
  this.columns = [];
  for(var i=0;i<rs.fields.count;i++){
    this.columns.push(rs(i).name);
  }
}
MCube.prototype.add = function(o){
  var rs = Server.CreateObject("adodb.recordset");
  var sql = "select * from " + this.tableName ;
  rs.Open(sql,conn,1,3);
  rs.addnew;
    for (var prop in o){
      if(prop != "toJSON"){
        rs(prop)=o[prop];
      }
    }
  rs.update;
  return rs("id").Value;
}
MCube.prototype.add_by_sql = function(o){
  var rs = Server.CreateObject("adodb.recordset");
  var sql = "insert into " + this.tableName;
  var keyString = "";
  var valueString = "";
  for (var prop in o){
    if(prop != "id" && prop != "toJSON"){
      if(typeof(o[prop]) == "string"){
        valueString += "'"+o[prop] + "',";
      }else if(typeof(o[prop]) == "number"){
        valueString += o[prop] + ",";
      }else if(typeof(o[prop]) == "boolean"){
        valueString += o[prop] + ",";
      }else{
        valueString += "'"+o[prop] + "',";
      }
    
      keyString  += prop + ",";
    }
  }
  keyString = "(" + keyString.substring(0,keyString.length-1) + ")";
  valueString = "(" + valueString.substring(0,valueString.length-1) + ")";
  sql = sql + keyString + " values" +valueString;
  //sql.flush();
  conn.Execute(sql);
  rs = conn.Execute("select [@@IDENTITY] as ii");
  return rs("ii").Value;
}
MCube.prototype.del = function(o){
  if(typeof(o) == "number" || typeof(o) == "string" ){
    conn.execute("delete * from "+this.tableName+" where id = " + o);
  }else if(typeof(o) == "object"){
    if(o.conditions){
      var sql = "delete * from "+this.tableName+" where " + o.conditions;
      conn.execute(sql);
    }
  }
}
MCube.prototype.update = function(o){
  var rs = Server.CreateObject("adodb.recordset");
  var sql = "select * from " + this.tableName + " where id = " + o.id;
  //sql.flush();
  rs.Open(sql,conn,1,3);
    for (var prop in o){
      if(prop != "id" && prop != "toJSON"){
        rs(prop)=o[prop];
      }
    }
  rs.update; 
}
MCube.prototype.update_by_sql = function(o){
  var sql = "update " + this.tableName + " set ";
  for (var prop in o){
    if(prop != "id" && prop != "toJSON"){
      if(typeof(o[prop]) == "string"){
        sql += prop + " = '" + o[prop] + "',";
      }else if(typeof(o[prop]) == "number"){
        sql += prop + " = " + o[prop] + ",";
      }else if(typeof(o[prop]) == "boolean"){
        sql += prop + " = " + o[prop] + ",";
      }else{
        sql += prop + " = '" + o[prop] + "',";
      }
    }
  }
  sql = sql.substring(0,sql.length-1);
  sql += " where id = " + o.id;
  //sql.flush();
  conn.Execute(sql);
}
MCube.prototype.count = function(param){
  var r;
  var sql = "select count(id) from " + this.tableName;
  if(typeof(param) == "object" && param.conditions){
    sql += " where " + param.conditions;
  }
  var rs = conn.Execute(sql);
  //sql.flush();
  r = rs(0).Value;
  return r;
}
MCube.prototype.max = function(o){
  var sql = "select MAX("+o.column+") from " + this.tableName + " where " + o.conditions;
  var rs = conn.Execute(sql);
  r = rs(0).Value;
  return r;
}
MCube.prototype.find = function(param){
  var r;
  if(typeof(param) == "number"){
    r = {};
    var rs = conn.execute("select * from "+this.tableName+" where id = " + param);
    if(!rs.EOF){
      for(var i=0;i<this.columns.length;i++){
        r[this.columns[i]] = rs(this.columns[i]).Value;
      }
    }
    return r;
  }
  if(typeof(param) == "string"){
    if(param == "all"){
      r = [];
      var sql = "select * from "+this.tableName;
      Response.Write(sql);
      var rs = conn.execute(sql);
      if(!rs.EOF){
        while(!rs.EOF){
          var record = {};
          for(var i=0;i<this.columns.length;i++){
            record[this.columns[i]] = rs(this.columns[i]).Value
          }
          r.push(record);
          rs.MoveNext();
        }

      }
      return r;
    }else if(param == "first"){
      r = {};
      var sql = "select top 1 * from "+this.tableName;
      var rs = conn.execute(sql);
      if(!rs.EOF){
        for(var i=0;i<this.columns.length;i++){
          r[this.columns[i]] = rs(this.columns[i]).Value
        }
      }
      return r;
    }
  }
  if(typeof(param) == "object"){
    var sql = "select ";
    if(param.limit){
      sql += "top " + param.limit + " ";
    }
    if(param.only){
      if(param.rename){
        for(var i=0;i<param.rename.length;i++){
          sql += param.only[i] + " as " + param.rename[i] + ",";
        }
        this.columns = param.rename;
        sql = sql.substring(0, sql.length-1);
      }else{
        sql += param.only.join(" ,");
        this.columns = param.only;
      }
    }else{
      sql += "* "
    }
    sql += " from "+this.tableName+" ";
    sql += "where 1=1 "
    if(param.conditions){
      sql += "and " + param.conditions + " "; 
    }
    if(param.start && (param.start != "0" || param.start != 0)){
      sql += "and "+this.tableName+".id not in(select top " + param.start
          + " " + this.tableName + ".id from "+this.tableName+" where 1=1 ";
          
      if(param.conditions){
        sql += "and " + param.conditions + " "; 
      }
      if(param.order){
        sql += "order by " + param.order + " ";
      }
      sql += ") "
    }
    if(param.order){
      sql += "order by " + param.order + " ";
    }
    
    var rs = Server.CreateObject("Adodb.recordset");
    rs.Open(sql,conn,1,1);
    r = [];
    if(!rs.EOF){
      while(!rs.EOF){
        var record = {};
        for(var i=0;i<this.columns.length;i++){
          record[this.columns[i]] = rs(this.columns[i]).Value
        }
        r.push(record);
        rs.MoveNext();
      }
    }
    
    return r;
  }
}
MCube.prototype.getTree = function(o){
  var attSql = "";
  var joinAttSql = "";
  var joinSql = "";
  var tableName = this.tableName;
  if(o.attributes){
    for(var i=0;i<o.attributes.length;i++){
      attSql += tableName +"."+o.attributes[i] + ",";
    }
  }
  if(o.join){
    if(o.join.only){
      for(var i=0;i<o.join.only.length;i++){
        joinAttSql += o.join.table +"."+o.join.only[i] + ",";
      } 
    }
  }
  if(o.join){
    joinSql = " "+o.join.type+" "+ o.join.table+" on "+tableName+"."+o.join.on+"="+o.join.table+".id";
  }
  return getSubTree(0);
  function getSubTree(pid){
    var r = [];
    
    var sql = "select "+tableName+".id,"+attSql+joinAttSql+tableName +"."+o.pid+","+tableName +"."+o.text+","+tableName +"."+o.leaf+" from "+tableName+joinSql+" where "+tableName +"."+o.pid+"="+pid+" order by "+tableName +"."+"id asc" ;
    //sql.flush();
    var rs = conn.execute(sql);
    while (!rs.EOF){
      var c ={};
      c.id = rs("id").Value;
      if(o.textRename){
        c[o.textRename] = rs(o.text).Value;
      }else{
        c.text = rs(o.text).Value;
      }
      if(o.attributes){
        c.attributes = {};
        for(var i=0;i<o.attributes.length;i++){
          c.attributes[o.attributes[i]] = rs(o.attributes[i]).Value;
        }
      }
      if(o.join){
        if(o.join.only){
          var joinObj = {};
          for(var i=0;i<o.join.only.length;i++){
            joinObj[o.join.only[i]] = rs(o.join.only[i]).Value;
          }
          c[o.join.referName] = joinObj;
        }
      }
      if(rs(o.leaf).Value){
        r.push(c);
      }else{
        c.children = getSubTree(rs("id"));
        r.push(c);
      }
      rs.MoveNext();
    }
    return r;
  }
}
MCube.prototype.getGrid = function(o){
  
}
function jQuery(selector){
  this.selector = selector;
}
jQuery.prototype.appendTo = function(s){
  ("$('"+this.selector+"').appendTo('"+s+"')").flush();
}

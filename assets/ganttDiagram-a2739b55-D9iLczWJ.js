import{K as $t,a as te,s as ee,D as se,E as ie,b as ne,c as re,g as U,d as ut,L as ae,M as ce,N as oe,e as le,O as ue,P as de,Q as M,l as kt,R as fe,S as Ft,T as Wt,U as he,V as ke,W as me,X as ye,Y as ge,Z as pe,_ as be,$ as Mt,a0 as Vt,a1 as Ot,a2 as Pt,a3 as Rt,a4 as Te,k as xe,j as ve,F as _e,C as we,a5 as Ce,a6 as Ee}from"./index-BcywmiV3.js";var dt={exports:{}},De=dt.exports,Yt;function Se(){return Yt||(Yt=1,(function(t,s){(function(i,r){t.exports=r()})(De,(function(){var i="day";return function(r,a,h){var f=function(E){return E.add(4-E.isoWeekday(),i)},I=a.prototype;I.isoWeekYear=function(){return f(this).year()},I.isoWeek=function(E){if(!this.$utils().u(E))return this.add(7*(E-this.isoWeek()),i);var C,S,F,W,V=f(this),x=(C=this.isoWeekYear(),S=this.$u,F=(S?h.utc:h)().year(C).startOf("year"),W=4-F.isoWeekday(),F.isoWeekday()>4&&(W+=7),F.add(W,i));return V.diff(x,"week")+1},I.isoWeekday=function(E){return this.$utils().u(E)?this.day()||7:this.day(this.day()%7?E:E-7)};var P=I.startOf;I.startOf=function(E,C){var S=this.$utils(),F=!!S.u(C)||C;return S.p(E)==="isoweek"?F?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):P.bind(this)(E,C)}}}))})(dt)),dt.exports}var Ie=Se();const Ae=$t(Ie);var pt=(function(){var t=function(g,n,u,d){for(u=u||{},d=g.length;d--;u[g[d]]=n);return u},s=[6,8,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,30,32,33,35,37],i=[1,25],r=[1,26],a=[1,27],h=[1,28],f=[1,29],I=[1,30],P=[1,31],E=[1,9],C=[1,10],S=[1,11],F=[1,12],W=[1,13],V=[1,14],x=[1,15],tt=[1,16],et=[1,18],st=[1,19],it=[1,20],nt=[1,21],rt=[1,22],at=[1,24],ct=[1,32],k={trace:function(){},yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,dateFormat:19,inclusiveEndDates:20,topAxis:21,axisFormat:22,tickInterval:23,excludes:24,includes:25,todayMarker:26,title:27,acc_title:28,acc_title_value:29,acc_descr:30,acc_descr_value:31,acc_descr_multiline_value:32,section:33,clickStatement:34,taskTxt:35,taskData:36,click:37,callbackname:38,callbackargs:39,href:40,clickStatementDebug:41,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",19:"dateFormat",20:"inclusiveEndDates",21:"topAxis",22:"axisFormat",23:"tickInterval",24:"excludes",25:"includes",26:"todayMarker",27:"title",28:"acc_title",29:"acc_title_value",30:"acc_descr",31:"acc_descr_value",32:"acc_descr_multiline_value",33:"section",35:"taskTxt",36:"taskData",37:"click",38:"callbackname",39:"callbackargs",40:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[34,2],[34,3],[34,3],[34,4],[34,3],[34,4],[34,2],[41,2],[41,3],[41,3],[41,4],[41,3],[41,4],[41,2]],performAction:function(n,u,d,c,m,e,L){var l=e.length-1;switch(m){case 1:return e[l-1];case 2:this.$=[];break;case 3:e[l-1].push(e[l]),this.$=e[l-1];break;case 4:case 5:this.$=e[l];break;case 6:case 7:this.$=[];break;case 8:c.setWeekday("monday");break;case 9:c.setWeekday("tuesday");break;case 10:c.setWeekday("wednesday");break;case 11:c.setWeekday("thursday");break;case 12:c.setWeekday("friday");break;case 13:c.setWeekday("saturday");break;case 14:c.setWeekday("sunday");break;case 15:c.setDateFormat(e[l].substr(11)),this.$=e[l].substr(11);break;case 16:c.enableInclusiveEndDates(),this.$=e[l].substr(18);break;case 17:c.TopAxis(),this.$=e[l].substr(8);break;case 18:c.setAxisFormat(e[l].substr(11)),this.$=e[l].substr(11);break;case 19:c.setTickInterval(e[l].substr(13)),this.$=e[l].substr(13);break;case 20:c.setExcludes(e[l].substr(9)),this.$=e[l].substr(9);break;case 21:c.setIncludes(e[l].substr(9)),this.$=e[l].substr(9);break;case 22:c.setTodayMarker(e[l].substr(12)),this.$=e[l].substr(12);break;case 24:c.setDiagramTitle(e[l].substr(6)),this.$=e[l].substr(6);break;case 25:this.$=e[l].trim(),c.setAccTitle(this.$);break;case 26:case 27:this.$=e[l].trim(),c.setAccDescription(this.$);break;case 28:c.addSection(e[l].substr(8)),this.$=e[l].substr(8);break;case 30:c.addTask(e[l-1],e[l]),this.$="task";break;case 31:this.$=e[l-1],c.setClickEvent(e[l-1],e[l],null);break;case 32:this.$=e[l-2],c.setClickEvent(e[l-2],e[l-1],e[l]);break;case 33:this.$=e[l-2],c.setClickEvent(e[l-2],e[l-1],null),c.setLink(e[l-2],e[l]);break;case 34:this.$=e[l-3],c.setClickEvent(e[l-3],e[l-2],e[l-1]),c.setLink(e[l-3],e[l]);break;case 35:this.$=e[l-2],c.setClickEvent(e[l-2],e[l],null),c.setLink(e[l-2],e[l-1]);break;case 36:this.$=e[l-3],c.setClickEvent(e[l-3],e[l-1],e[l]),c.setLink(e[l-3],e[l-2]);break;case 37:this.$=e[l-1],c.setLink(e[l-1],e[l]);break;case 38:case 44:this.$=e[l-1]+" "+e[l];break;case 39:case 40:case 42:this.$=e[l-2]+" "+e[l-1]+" "+e[l];break;case 41:case 43:this.$=e[l-3]+" "+e[l-2]+" "+e[l-1]+" "+e[l];break}},table:[{3:1,4:[1,2]},{1:[3]},t(s,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:i,13:r,14:a,15:h,16:f,17:I,18:P,19:E,20:C,21:S,22:F,23:W,24:V,25:x,26:tt,27:et,28:st,30:it,32:nt,33:rt,34:23,35:at,37:ct},t(s,[2,7],{1:[2,1]}),t(s,[2,3]),{9:33,11:17,12:i,13:r,14:a,15:h,16:f,17:I,18:P,19:E,20:C,21:S,22:F,23:W,24:V,25:x,26:tt,27:et,28:st,30:it,32:nt,33:rt,34:23,35:at,37:ct},t(s,[2,5]),t(s,[2,6]),t(s,[2,15]),t(s,[2,16]),t(s,[2,17]),t(s,[2,18]),t(s,[2,19]),t(s,[2,20]),t(s,[2,21]),t(s,[2,22]),t(s,[2,23]),t(s,[2,24]),{29:[1,34]},{31:[1,35]},t(s,[2,27]),t(s,[2,28]),t(s,[2,29]),{36:[1,36]},t(s,[2,8]),t(s,[2,9]),t(s,[2,10]),t(s,[2,11]),t(s,[2,12]),t(s,[2,13]),t(s,[2,14]),{38:[1,37],40:[1,38]},t(s,[2,4]),t(s,[2,25]),t(s,[2,26]),t(s,[2,30]),t(s,[2,31],{39:[1,39],40:[1,40]}),t(s,[2,37],{38:[1,41]}),t(s,[2,32],{40:[1,42]}),t(s,[2,33]),t(s,[2,35],{39:[1,43]}),t(s,[2,34]),t(s,[2,36])],defaultActions:{},parseError:function(n,u){if(u.recoverable)this.trace(n);else{var d=new Error(n);throw d.hash=u,d}},parse:function(n){var u=this,d=[0],c=[],m=[null],e=[],L=this.table,l="",o=0,y=0,D=2,v=1,_=e.slice.call(arguments,1),T=Object.create(this.lexer),w={yy:{}};for(var K in this.yy)Object.prototype.hasOwnProperty.call(this.yy,K)&&(w.yy[K]=this.yy[K]);T.setInput(n,w.yy),w.yy.lexer=T,w.yy.parser=this,typeof T.yylloc>"u"&&(T.yylloc={});var Q=T.yylloc;e.push(Q);var Zt=T.options&&T.options.ranges;typeof w.yy.parseError=="function"?this.parseError=w.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Jt(){var N;return N=c.pop()||T.lex()||v,typeof N!="number"&&(N instanceof Array&&(c=N,N=c.pop()),N=u.symbols_[N]||N),N}for(var O,q,R,yt,X={},ot,B,Lt,lt;;){if(q=d[d.length-1],this.defaultActions[q]?R=this.defaultActions[q]:((O===null||typeof O>"u")&&(O=Jt()),R=L[q]&&L[q][O]),typeof R>"u"||!R.length||!R[0]){var gt="";lt=[];for(ot in L[q])this.terminals_[ot]&&ot>D&&lt.push("'"+this.terminals_[ot]+"'");T.showPosition?gt="Parse error on line "+(o+1)+`:
`+T.showPosition()+`
Expecting `+lt.join(", ")+", got '"+(this.terminals_[O]||O)+"'":gt="Parse error on line "+(o+1)+": Unexpected "+(O==v?"end of input":"'"+(this.terminals_[O]||O)+"'"),this.parseError(gt,{text:T.match,token:this.terminals_[O]||O,line:T.yylineno,loc:Q,expected:lt})}if(R[0]instanceof Array&&R.length>1)throw new Error("Parse Error: multiple actions possible at state: "+q+", token: "+O);switch(R[0]){case 1:d.push(O),m.push(T.yytext),e.push(T.yylloc),d.push(R[1]),O=null,y=T.yyleng,l=T.yytext,o=T.yylineno,Q=T.yylloc;break;case 2:if(B=this.productions_[R[1]][1],X.$=m[m.length-B],X._$={first_line:e[e.length-(B||1)].first_line,last_line:e[e.length-1].last_line,first_column:e[e.length-(B||1)].first_column,last_column:e[e.length-1].last_column},Zt&&(X._$.range=[e[e.length-(B||1)].range[0],e[e.length-1].range[1]]),yt=this.performAction.apply(X,[l,y,o,w.yy,R[1],m,e].concat(_)),typeof yt<"u")return yt;B&&(d=d.slice(0,-1*B*2),m=m.slice(0,-1*B),e=e.slice(0,-1*B)),d.push(this.productions_[R[1]][0]),m.push(X.$),e.push(X._$),Lt=L[d[d.length-2]][d[d.length-1]],d.push(Lt);break;case 3:return!0}}return!0}},b=(function(){var g={EOF:1,parseError:function(u,d){if(this.yy.parser)this.yy.parser.parseError(u,d);else throw new Error(u)},setInput:function(n,u){return this.yy=u||this.yy||{},this._input=n,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var n=this._input[0];this.yytext+=n,this.yyleng++,this.offset++,this.match+=n,this.matched+=n;var u=n.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),n},unput:function(n){var u=n.length,d=n.split(/(?:\r\n?|\n)/g);this._input=n+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var c=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===c.length?this.yylloc.first_column:0)+c[c.length-d.length].length-d[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(n){this.unput(this.match.slice(n))},pastInput:function(){var n=this.matched.substr(0,this.matched.length-this.match.length);return(n.length>20?"...":"")+n.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var n=this.match;return n.length<20&&(n+=this._input.substr(0,20-n.length)),(n.substr(0,20)+(n.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var n=this.pastInput(),u=new Array(n.length+1).join("-");return n+this.upcomingInput()+`
`+u+"^"},test_match:function(n,u){var d,c,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),c=n[0].match(/(?:\r\n?|\n).*/g),c&&(this.yylineno+=c.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:c?c[c.length-1].length-c[c.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+n[0].length},this.yytext+=n[0],this.match+=n[0],this.matches=n,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(n[0].length),this.matched+=n[0],d=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var e in m)this[e]=m[e];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var n,u,d,c;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),e=0;e<m.length;e++)if(d=this._input.match(this.rules[m[e]]),d&&(!u||d[0].length>u[0].length)){if(u=d,c=e,this.options.backtrack_lexer){if(n=this.test_match(d,m[e]),n!==!1)return n;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(n=this.test_match(u,m[c]),n!==!1?n:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var u=this.next();return u||this.lex()},begin:function(u){this.conditionStack.push(u)},popState:function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},pushState:function(u){this.begin(u)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(u,d,c,m){switch(c){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),28;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),30;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 40;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 38;case 21:this.popState();break;case 22:return 39;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 37;case 26:return 4;case 27:return 19;case 28:return 20;case 29:return 21;case 30:return 22;case 31:return 23;case 32:return 25;case 33:return 24;case 34:return 26;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return"date";case 43:return 27;case 44:return"accDescription";case 45:return 33;case 46:return 35;case 47:return 36;case 48:return":";case 49:return 6;case 50:return"INVALID"}},rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],inclusive:!0}}};return g})();k.lexer=b;function p(){this.yy={}}return p.prototype=k,k.Parser=p,new p})();pt.parser=pt;const Le=pt;M.extend(Ae);M.extend(Ce);M.extend(Ee);let Y="",vt="",_t,wt="",Z=[],J=[],Ct={},Et=[],mt=[],H="",Dt="";const zt=["active","done","crit","milestone"];let St=[],$=!1,It=!1,At="sunday",bt=0;const Fe=function(){Et=[],mt=[],H="",St=[],ft=0,xt=void 0,ht=void 0,A=[],Y="",vt="",Dt="",_t=void 0,wt="",Z=[],J=[],$=!1,It=!1,bt=0,Ct={},_e(),At="sunday"},We=function(t){vt=t},Me=function(){return vt},Ve=function(t){_t=t},Oe=function(){return _t},Pe=function(t){wt=t},Re=function(){return wt},Ye=function(t){Y=t},Be=function(){$=!0},Ne=function(){return $},ze=function(){It=!0},qe=function(){return It},je=function(t){Dt=t},Xe=function(){return Dt},Ue=function(){return Y},Ge=function(t){Z=t.toLowerCase().split(/[\s,]+/)},He=function(){return Z},Ke=function(t){J=t.toLowerCase().split(/[\s,]+/)},Qe=function(){return J},Ze=function(){return Ct},Je=function(t){H=t,Et.push(t)},$e=function(){return Et},ts=function(){let t=Bt();const s=10;let i=0;for(;!t&&i<s;)t=Bt(),i++;return mt=A,mt},qt=function(t,s,i,r){return r.includes(t.format(s.trim()))?!1:t.isoWeekday()>=6&&i.includes("weekends")||i.includes(t.format("dddd").toLowerCase())?!0:i.includes(t.format(s.trim()))},es=function(t){At=t},ss=function(){return At},jt=function(t,s,i,r){if(!i.length||t.manualEndTime)return;let a;t.startTime instanceof Date?a=M(t.startTime):a=M(t.startTime,s,!0),a=a.add(1,"d");let h;t.endTime instanceof Date?h=M(t.endTime):h=M(t.endTime,s,!0);const[f,I]=is(a,h,s,i,r);t.endTime=f.toDate(),t.renderEndTime=I},is=function(t,s,i,r,a){let h=!1,f=null;for(;t<=s;)h||(f=s.toDate()),h=qt(t,i,r,a),h&&(s=s.add(1,"d")),t=t.add(1,"d");return[s,f]},Tt=function(t,s,i){i=i.trim();const a=/^after\s+(?<ids>[\d\w- ]+)/.exec(i);if(a!==null){let f=null;for(const P of a.groups.ids.split(" ")){let E=j(P);E!==void 0&&(!f||E.endTime>f.endTime)&&(f=E)}if(f)return f.endTime;const I=new Date;return I.setHours(0,0,0,0),I}let h=M(i,s.trim(),!0);if(h.isValid())return h.toDate();{kt.debug("Invalid date:"+i),kt.debug("With date format:"+s.trim());const f=new Date(i);if(f===void 0||isNaN(f.getTime())||f.getFullYear()<-1e4||f.getFullYear()>1e4)throw new Error("Invalid date:"+i);return f}},Xt=function(t){const s=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return s!==null?[Number.parseFloat(s[1]),s[2]]:[NaN,"ms"]},Ut=function(t,s,i,r=!1){i=i.trim();const h=/^until\s+(?<ids>[\d\w- ]+)/.exec(i);if(h!==null){let C=null;for(const F of h.groups.ids.split(" ")){let W=j(F);W!==void 0&&(!C||W.startTime<C.startTime)&&(C=W)}if(C)return C.startTime;const S=new Date;return S.setHours(0,0,0,0),S}let f=M(i,s.trim(),!0);if(f.isValid())return r&&(f=f.add(1,"d")),f.toDate();let I=M(t);const[P,E]=Xt(i);if(!Number.isNaN(P)){const C=I.add(P,E);C.isValid()&&(I=C)}return I.toDate()};let ft=0;const G=function(t){return t===void 0?(ft=ft+1,"task"+ft):t},ns=function(t,s){let i;s.substr(0,1)===":"?i=s.substr(1,s.length):i=s;const r=i.split(","),a={};Qt(r,a,zt);for(let f=0;f<r.length;f++)r[f]=r[f].trim();let h="";switch(r.length){case 1:a.id=G(),a.startTime=t.endTime,h=r[0];break;case 2:a.id=G(),a.startTime=Tt(void 0,Y,r[0]),h=r[1];break;case 3:a.id=G(r[0]),a.startTime=Tt(void 0,Y,r[1]),h=r[2];break}return h&&(a.endTime=Ut(a.startTime,Y,h,$),a.manualEndTime=M(h,"YYYY-MM-DD",!0).isValid(),jt(a,Y,J,Z)),a},rs=function(t,s){let i;s.substr(0,1)===":"?i=s.substr(1,s.length):i=s;const r=i.split(","),a={};Qt(r,a,zt);for(let h=0;h<r.length;h++)r[h]=r[h].trim();switch(r.length){case 1:a.id=G(),a.startTime={type:"prevTaskEnd",id:t},a.endTime={data:r[0]};break;case 2:a.id=G(),a.startTime={type:"getStartDate",startData:r[0]},a.endTime={data:r[1]};break;case 3:a.id=G(r[0]),a.startTime={type:"getStartDate",startData:r[1]},a.endTime={data:r[2]};break}return a};let xt,ht,A=[];const Gt={},as=function(t,s){const i={section:H,type:H,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:s},task:t,classes:[]},r=rs(ht,s);i.raw.startTime=r.startTime,i.raw.endTime=r.endTime,i.id=r.id,i.prevTaskId=ht,i.active=r.active,i.done=r.done,i.crit=r.crit,i.milestone=r.milestone,i.order=bt,bt++;const a=A.push(i);ht=i.id,Gt[i.id]=a-1},j=function(t){const s=Gt[t];return A[s]},cs=function(t,s){const i={section:H,type:H,description:t,task:t,classes:[]},r=ns(xt,s);i.startTime=r.startTime,i.endTime=r.endTime,i.id=r.id,i.active=r.active,i.done=r.done,i.crit=r.crit,i.milestone=r.milestone,xt=i,mt.push(i)},Bt=function(){const t=function(i){const r=A[i];let a="";switch(A[i].raw.startTime.type){case"prevTaskEnd":{const h=j(r.prevTaskId);r.startTime=h.endTime;break}case"getStartDate":a=Tt(void 0,Y,A[i].raw.startTime.startData),a&&(A[i].startTime=a);break}return A[i].startTime&&(A[i].endTime=Ut(A[i].startTime,Y,A[i].raw.endTime.data,$),A[i].endTime&&(A[i].processed=!0,A[i].manualEndTime=M(A[i].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),jt(A[i],Y,J,Z))),A[i].processed};let s=!0;for(const[i,r]of A.entries())t(i),s=s&&r.processed;return s},os=function(t,s){let i=s;U().securityLevel!=="loose"&&(i=ve.sanitizeUrl(s)),t.split(",").forEach(function(r){j(r)!==void 0&&(Kt(r,()=>{window.open(i,"_self")}),Ct[r]=i)}),Ht(t,"clickable")},Ht=function(t,s){t.split(",").forEach(function(i){let r=j(i);r!==void 0&&r.classes.push(s)})},ls=function(t,s,i){if(U().securityLevel!=="loose"||s===void 0)return;let r=[];if(typeof i=="string"){r=i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let h=0;h<r.length;h++){let f=r[h].trim();f.charAt(0)==='"'&&f.charAt(f.length-1)==='"'&&(f=f.substr(1,f.length-2)),r[h]=f}}r.length===0&&r.push(t),j(t)!==void 0&&Kt(t,()=>{we.runFunc(s,...r)})},Kt=function(t,s){St.push(function(){const i=document.querySelector(`[id="${t}"]`);i!==null&&i.addEventListener("click",function(){s()})},function(){const i=document.querySelector(`[id="${t}-text"]`);i!==null&&i.addEventListener("click",function(){s()})})},us=function(t,s,i){t.split(",").forEach(function(r){ls(r,s,i)}),Ht(t,"clickable")},ds=function(t){St.forEach(function(s){s(t)})},fs={getConfig:()=>U().gantt,clear:Fe,setDateFormat:Ye,getDateFormat:Ue,enableInclusiveEndDates:Be,endDatesAreInclusive:Ne,enableTopAxis:ze,topAxisEnabled:qe,setAxisFormat:We,getAxisFormat:Me,setTickInterval:Ve,getTickInterval:Oe,setTodayMarker:Pe,getTodayMarker:Re,setAccTitle:re,getAccTitle:ne,setDiagramTitle:ie,getDiagramTitle:se,setDisplayMode:je,getDisplayMode:Xe,setAccDescription:ee,getAccDescription:te,addSection:Je,getSections:$e,getTasks:ts,addTask:as,findTaskById:j,addTaskOrg:cs,setIncludes:Ge,getIncludes:He,setExcludes:Ke,getExcludes:Qe,setClickEvent:us,setLink:os,getLinks:Ze,bindFunctions:ds,parseDuration:Xt,isInvalidDate:qt,setWeekday:es,getWeekday:ss};function Qt(t,s,i){let r=!0;for(;r;)r=!1,i.forEach(function(a){const h="^\\s*"+a+"\\s*$",f=new RegExp(h);t[0].match(f)&&(s[a]=!0,t.shift(1),r=!0)})}const hs=function(){kt.debug("Something is calling, setConf, remove the call")},Nt={monday:be,tuesday:pe,wednesday:ge,thursday:ye,friday:me,saturday:ke,sunday:he},ks=(t,s)=>{let i=[...t].map(()=>-1/0),r=[...t].sort((h,f)=>h.startTime-f.startTime||h.order-f.order),a=0;for(const h of r)for(let f=0;f<i.length;f++)if(h.startTime>=i[f]){i[f]=h.endTime,h.order=f+s,f>a&&(a=f);break}return a};let z;const ms=function(t,s,i,r){const a=U().gantt,h=U().securityLevel;let f;h==="sandbox"&&(f=ut("#i"+s));const I=h==="sandbox"?ut(f.nodes()[0].contentDocument.body):ut("body"),P=h==="sandbox"?f.nodes()[0].contentDocument:document,E=P.getElementById(s);z=E.parentElement.offsetWidth,z===void 0&&(z=1200),a.useWidth!==void 0&&(z=a.useWidth);const C=r.db.getTasks();let S=[];for(const k of C)S.push(k.type);S=ct(S);const F={};let W=2*a.topPadding;if(r.db.getDisplayMode()==="compact"||a.displayMode==="compact"){const k={};for(const p of C)k[p.section]===void 0?k[p.section]=[p]:k[p.section].push(p);let b=0;for(const p of Object.keys(k)){const g=ks(k[p],b)+1;b+=g,W+=g*(a.barHeight+a.barGap),F[p]=g}}else{W+=C.length*(a.barHeight+a.barGap);for(const k of S)F[k]=C.filter(b=>b.type===k).length}E.setAttribute("viewBox","0 0 "+z+" "+W);const V=I.select(`[id="${s}"]`),x=ae().domain([ce(C,function(k){return k.startTime}),oe(C,function(k){return k.endTime})]).rangeRound([0,z-a.leftPadding-a.rightPadding]);function tt(k,b){const p=k.startTime,g=b.startTime;let n=0;return p>g?n=1:p<g&&(n=-1),n}C.sort(tt),et(C,z,W),le(V,W,z,a.useMaxWidth),V.append("text").text(r.db.getDiagramTitle()).attr("x",z/2).attr("y",a.titleTopMargin).attr("class","titleText");function et(k,b,p){const g=a.barHeight,n=g+a.barGap,u=a.topPadding,d=a.leftPadding,c=ue().domain([0,S.length]).range(["#00B9FA","#F95002"]).interpolate(de);it(n,u,d,b,p,k,r.db.getExcludes(),r.db.getIncludes()),nt(d,u,b,p),st(k,n,u,d,g,c,b),rt(n,u),at(d,u,b,p)}function st(k,b,p,g,n,u,d){const m=[...new Set(k.map(o=>o.order))].map(o=>k.find(y=>y.order===o));V.append("g").selectAll("rect").data(m).enter().append("rect").attr("x",0).attr("y",function(o,y){return y=o.order,y*b+p-2}).attr("width",function(){return d-a.rightPadding/2}).attr("height",b).attr("class",function(o){for(const[y,D]of S.entries())if(o.type===D)return"section section"+y%a.numberSectionStyles;return"section section0"});const e=V.append("g").selectAll("rect").data(k).enter(),L=r.db.getLinks();if(e.append("rect").attr("id",function(o){return o.id}).attr("rx",3).attr("ry",3).attr("x",function(o){return o.milestone?x(o.startTime)+g+.5*(x(o.endTime)-x(o.startTime))-.5*n:x(o.startTime)+g}).attr("y",function(o,y){return y=o.order,y*b+p}).attr("width",function(o){return o.milestone?n:x(o.renderEndTime||o.endTime)-x(o.startTime)}).attr("height",n).attr("transform-origin",function(o,y){return y=o.order,(x(o.startTime)+g+.5*(x(o.endTime)-x(o.startTime))).toString()+"px "+(y*b+p+.5*n).toString()+"px"}).attr("class",function(o){const y="task";let D="";o.classes.length>0&&(D=o.classes.join(" "));let v=0;for(const[T,w]of S.entries())o.type===w&&(v=T%a.numberSectionStyles);let _="";return o.active?o.crit?_+=" activeCrit":_=" active":o.done?o.crit?_=" doneCrit":_=" done":o.crit&&(_+=" crit"),_.length===0&&(_=" task"),o.milestone&&(_=" milestone "+_),_+=v,_+=" "+D,y+_}),e.append("text").attr("id",function(o){return o.id+"-text"}).text(function(o){return o.task}).attr("font-size",a.fontSize).attr("x",function(o){let y=x(o.startTime),D=x(o.renderEndTime||o.endTime);o.milestone&&(y+=.5*(x(o.endTime)-x(o.startTime))-.5*n),o.milestone&&(D=y+n);const v=this.getBBox().width;return v>D-y?D+v+1.5*a.leftPadding>d?y+g-5:D+g+5:(D-y)/2+y+g}).attr("y",function(o,y){return y=o.order,y*b+a.barHeight/2+(a.fontSize/2-2)+p}).attr("text-height",n).attr("class",function(o){const y=x(o.startTime);let D=x(o.endTime);o.milestone&&(D=y+n);const v=this.getBBox().width;let _="";o.classes.length>0&&(_=o.classes.join(" "));let T=0;for(const[K,Q]of S.entries())o.type===Q&&(T=K%a.numberSectionStyles);let w="";return o.active&&(o.crit?w="activeCritText"+T:w="activeText"+T),o.done?o.crit?w=w+" doneCritText"+T:w=w+" doneText"+T:o.crit&&(w=w+" critText"+T),o.milestone&&(w+=" milestoneText"),v>D-y?D+v+1.5*a.leftPadding>d?_+" taskTextOutsideLeft taskTextOutside"+T+" "+w:_+" taskTextOutsideRight taskTextOutside"+T+" "+w+" width-"+v:_+" taskText taskText"+T+" "+w+" width-"+v}),U().securityLevel==="sandbox"){let o;o=ut("#i"+s);const y=o.nodes()[0].contentDocument;e.filter(function(D){return L[D.id]!==void 0}).each(function(D){var v=y.querySelector("#"+D.id),_=y.querySelector("#"+D.id+"-text");const T=v.parentNode;var w=y.createElement("a");w.setAttribute("xlink:href",L[D.id]),w.setAttribute("target","_top"),T.appendChild(w),w.appendChild(v),w.appendChild(_)})}}function it(k,b,p,g,n,u,d,c){if(d.length===0&&c.length===0)return;let m,e;for(const{startTime:v,endTime:_}of u)(m===void 0||v<m)&&(m=v),(e===void 0||_>e)&&(e=_);if(!m||!e)return;if(M(e).diff(M(m),"year")>5){kt.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const L=r.db.getDateFormat(),l=[];let o=null,y=M(m);for(;y.valueOf()<=e;)r.db.isInvalidDate(y,L,d,c)?o?o.end=y:o={start:y,end:y}:o&&(l.push(o),o=null),y=y.add(1,"d");V.append("g").selectAll("rect").data(l).enter().append("rect").attr("id",function(v){return"exclude-"+v.start.format("YYYY-MM-DD")}).attr("x",function(v){return x(v.start)+p}).attr("y",a.gridLineStartPadding).attr("width",function(v){const _=v.end.add(1,"day");return x(_)-x(v.start)}).attr("height",n-b-a.gridLineStartPadding).attr("transform-origin",function(v,_){return(x(v.start)+p+.5*(x(v.end)-x(v.start))).toString()+"px "+(_*k+.5*n).toString()+"px"}).attr("class","exclude-range")}function nt(k,b,p,g){let n=fe(x).tickSize(-g+b+a.gridLineStartPadding).tickFormat(Ft(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d"));const d=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||a.tickInterval);if(d!==null){const c=d[1],m=d[2],e=r.db.getWeekday()||a.weekday;switch(m){case"millisecond":n.ticks(Rt.every(c));break;case"second":n.ticks(Pt.every(c));break;case"minute":n.ticks(Ot.every(c));break;case"hour":n.ticks(Vt.every(c));break;case"day":n.ticks(Mt.every(c));break;case"week":n.ticks(Nt[e].every(c));break;case"month":n.ticks(Wt.every(c));break}}if(V.append("g").attr("class","grid").attr("transform","translate("+k+", "+(g-50)+")").call(n).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||a.topAxis){let c=Te(x).tickSize(-g+b+a.gridLineStartPadding).tickFormat(Ft(r.db.getAxisFormat()||a.axisFormat||"%Y-%m-%d"));if(d!==null){const m=d[1],e=d[2],L=r.db.getWeekday()||a.weekday;switch(e){case"millisecond":c.ticks(Rt.every(m));break;case"second":c.ticks(Pt.every(m));break;case"minute":c.ticks(Ot.every(m));break;case"hour":c.ticks(Vt.every(m));break;case"day":c.ticks(Mt.every(m));break;case"week":c.ticks(Nt[L].every(m));break;case"month":c.ticks(Wt.every(m));break}}V.append("g").attr("class","grid").attr("transform","translate("+k+", "+b+")").call(c).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function rt(k,b){let p=0;const g=Object.keys(F).map(n=>[n,F[n]]);V.append("g").selectAll("text").data(g).enter().append(function(n){const u=n[0].split(xe.lineBreakRegex),d=-(u.length-1)/2,c=P.createElementNS("http://www.w3.org/2000/svg","text");c.setAttribute("dy",d+"em");for(const[m,e]of u.entries()){const L=P.createElementNS("http://www.w3.org/2000/svg","tspan");L.setAttribute("alignment-baseline","central"),L.setAttribute("x","10"),m>0&&L.setAttribute("dy","1em"),L.textContent=e,c.appendChild(L)}return c}).attr("x",10).attr("y",function(n,u){if(u>0)for(let d=0;d<u;d++)return p+=g[u-1][1],n[1]*k/2+p*k+b;else return n[1]*k/2+b}).attr("font-size",a.sectionFontSize).attr("class",function(n){for(const[u,d]of S.entries())if(n[0]===d)return"sectionTitle sectionTitle"+u%a.numberSectionStyles;return"sectionTitle"})}function at(k,b,p,g){const n=r.db.getTodayMarker();if(n==="off")return;const u=V.append("g").attr("class","today"),d=new Date,c=u.append("line");c.attr("x1",x(d)+k).attr("x2",x(d)+k).attr("y1",a.titleTopMargin).attr("y2",g-a.titleTopMargin).attr("class","today"),n!==""&&c.attr("style",n.replace(/,/g,";"))}function ct(k){const b={},p=[];for(let g=0,n=k.length;g<n;++g)Object.prototype.hasOwnProperty.call(b,k[g])||(b[k[g]]=!0,p.push(k[g]));return p}},ys={setConf:hs,draw:ms},gs=t=>`
  .mermaid-main-font {
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }
`,ps=gs,Ts={parser:Le,db:fs,renderer:ys,styles:ps};export{Ts as diagram};

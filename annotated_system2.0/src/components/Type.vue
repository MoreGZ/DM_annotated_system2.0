<template>
	<div id="type">
		<section class="text">
			<div class="labelBox">
                <label>context1</label>
                <p id="p1">{{sourceData[currentPage-1].context[0]}}</p>
            </div>
			<div class="labelBox">
                <label>context2</label>
                <p id="p2">{{sourceData[currentPage-1].context[0]}}</p>
            </div>
			<div class="labelBox">
                <label>context3</label>
                <p id="p3">{{sourceData[currentPage-1].context[0]}}</p>
            </div>
		</section>
		<section class="input">
			<div class="words">
				<p>
					<span class="arrowleft" @click="lastWord">&lsaquo;</span>
					{{currentWord}}
					<img src="../assets/f00d.png" height="12" width="12" 
						v-if="pages[currentPage-1]!=1"
						@click="deleteAddAnnotated2">
					<span class="arrowright" @click="nextWord">&rsaquo;</span>
				</p>
			</div>
			<div class="selectBox">
                <label id="type_label" v-bind:style="{transform:typePosition}">type</label>
                <select
                	v-model="editData[currentPage-1][pages[currentPage-1]-1]['type']"
                	@change="addAnnotated1();bindType()">
                    <option 
                    	v-for="(value,key) in types" 
                    	:value="value"
                    	@focus="focusAnimate(0)" 
                    	@blur="blurAnimate(0)">
                    	{{key}}
                    </option>
                </select>
                <div class="line"></div>
                <div class="strongLine" :style="{width:lineWidth[0]+'%',transition: 'width 0.2s linear'}"></div>
            </div>
            <div class="supplement">
                <label for="">{{SupplementTitle}}</label>
                <input type="text" 
                	v-model="editData[currentPage-1][pages[currentPage-1]-1]['addition']"
                	:readonly="ifHasSupplement"
                	@change="addAnnotated1"
                	@focus="focusAnimate(1)" 
                	@blur="blurAnimate(1)"
                	>
                </input>
                <div class="line"></div>
                <div class="strongLine" :style="{width:lineWidth[1]+'%',transition: 'width 0.2s linear'}"></div>
            </div>
            <div class="textBox">
                <label>备注</label>
                <textarea 
                	v-model="editData[currentPage-1][pages[currentPage-1]-1]['note']"
                	:readonly="ifIsElse"
                	@change="addAnnotated1"
                	@focus="focusAnimate(2)" 
                	@blur="blurAnimate(2)"
                	>
                </textarea>
                <div class="line"></div>
                <div class="strongLine" :style="{width:lineWidth[2]+'%',transition: 'width 0.2s linear'}"></div>
            </div>
            <div class="addText">
                <label for="">顺便标注</label>
                <input type="text" 
                	v-model="inputData"
                	@keyup.enter="addAnnotated2"
                	@keyup.esc="escAddAnnotated2"
                	@focus="focusAnimate(3)" 
                	@blur="blurAnimate(3)"
                ></input>
                <div class="line"></div>
                <div class="strongLine" :style="{width:lineWidth[3]+'%',transition: 'width 0.2s linear'}"></div>
            </div>
            <div class="Hyphen">
				<label for="Hyphen">连字符不可去掉</label>
				<input type="checkbox" name="" id="Hyphen"  
					v-model="editData[currentPage-1][pages[currentPage-1]-1]['hyphen']"
					@change="addAnnotated1"
				>
			</div>
		</section>
		<div class="buttons">
            <button @click="lastPage">上一个</button>
            <button @click="sendDataHandle">提交</button>
            <button @click="nextPage">下一个</button>
        </div>
        <span class="page">{{currentPage}}/{{editData.length}}</span>
        <span class="count">你总共已标注<span>{{count}}</span>个词</span>
	</div>
</template>

<script>
import store from '../store/index.js';
import {mapState} from "vuex";
import $ from 'jquery';

export default {
	data:function(){
		//初始化原始数据
		var sourceData = [];
		for(var i=0;i<25;i++){
			var obj = {};
			obj.context = [];
			obj.id = "";
			obj.word = "";
			sourceData.push(obj);
		}

		//初始化编辑记录数据
		var editData = [];
		for(var i = 0;i < 25;i++){
			var arr = []
			arr[0] = {};
			arr[0]["id"] = "";
			arr[0]["word"] = "";
			arr[0]["type"] = "";
			arr[0]["note"] = "";
			arr[0]["addition"] = "";
			arr[0]["hyphen"] = false;
			arr[0]["annotator"] = this.userName;
			editData.push(arr);
		}
		// console.log(editData);

		////初始化pages
		var pages = [];
		for(var i=0;i<25;i++){
			pages.push(1);
		}
		return {
			//原始数据
			sourceData:sourceData,
			//编辑记录数据
			editData:editData,
			//要发送的已经标注好的数据集（已有数据集和顺便标注）
			sendData:[],
			//当前页面
			currentPage:1,
			//每个页面的上当前标注词的索引
			pages:pages,
			//总标注数
			count:0,
			//顺便标注的输入框的内容
			inputData:"",
			//补齐输入框的标题
			titleObject:{
				"name":"补齐完整",
            	"organization":"补齐完整",
            	"local":"补齐完整",
            	"abbr":"请给出完整词组",
            	"error":"请给出拼写正确的词",
            	"entity":"请给出补充说明",
            	"foreign":"null",
            	"plural":"null",
            	"phrase":"null",
            	"emphasis":"null",
            	"other":"null",
            	"pessive":"null",
            	"":"null"
			},
			// 动画横线的长度
			lineWidth:['0','0','0','0'],
			//标注类型和对应的值
			types:{
				'':'',
				'人名':'name',
				'组织、机构名':'organization',
				'地方名':'local',
				'其他实体':'entity',
				'缩略语':'abbr',
				'文本错误':'error',
				'外来语':'foreign',
				'复数名词':'plural',
				'固定词组':'phrase',
				'表强调':'emphasis',
				'动词被动式':'pessive',
				'其他':'other',
			}
		}
	},
	store,
	computed:{
		//是否可以进行备注
		ifIsElse:function(){
			return this.currentType=="other" ? false : true;
		},
		//是否可以进行补充
		ifHasSupplement:function(){
			return this.SupplementTitle=="null" ? true : false;
		},
		currentType:function(){
			return this.editData[this.currentPage-1][this.pages[this.currentPage-1]-1]['type'];
		},
		//补充标注的title
		SupplementTitle:function(){
			return this.titleObject[this.currentType];
		},
        typePosition:function () {
        	return this.editData[this.currentPage-1][this.pages[this.currentPage-1]-1]['type']=="" ? 'translate(0,25px)': 'translate(0,1px)'
        },
        currentWord:function(){
        	var l = this.editData[this.currentPage-1][this.pages[this.currentPage-1]-1]['word'];
        	return l.length>11 ? l.slice(0, 11)+"..." : l
        },
        textColor:function(){
        	// console.log(this.pages[this.currentPage-1]==1);
        	return this.pages[this.currentPage-1]==1 ? "black" : "red";
        },
        ...mapState([
        	"userName"
        ])
	},
	watch:{
		sourceData:function(newSourceData){
			this.resetPage();
			this.resetEditData();
			this.markWord();
		},
		currentPage:function(){
			this.markWord();
		},
		pages:function(){
			this.markWord();
		}
	},
	methods:{
		showData:function(){
			
		},
		//向服务器发送数据
		sendDataHandle:function(){
			var vm = this;
			$.post("/api/sendData",{
                data:this.sendData,
            },function(data,status){
            	var res = JSON.parse(data);
				if(res.status==0){
					alert("提交失败");
					return;
				}

				vm.count = res.count;
				vm.sendData = [];
            })
			// this.$http.post("/api/sendData",{'data':vm.sendData}).then((response)=>{
			// 	console.log(vm.sendData);
			// 	var res = response.body;
			// 	if(res.status==0){
			// 		alert("提交失败");
			// 		return;
			// 	}

			// 	this.count = res.count;
			// 	this.sendData = [];
			// },(response)=>{
			// 	alert(response.status);
			// })
		},
		//下一页
		nextPage:function(){
			var vm = this;
			//判断是否最后一页
			var np = this.currentPage == this.editData.length ? "nextDatas" : "nextPage";
			var functionObj = {
				nextPage:function(){
					vm.currentPage++;
				},
				nextDatas:function(){
					var l = vm.sendData.length;
					if(l>0){
						alert('当前数据组有数据未提交,请先提交');
						return;
					}
					vm.apiHandler();
					vm.resetPage();
				}
			}
			functionObj[np]();
		},
		//上一页
		lastPage:function(){
			//判断是否为第一页
			var lp = this.currentPage == 1 ? true : false;
			if(!lp) this.currentPage--;
		},
		//添加标注
		addAnnotated1:function(){
			var vm = this;
			var checkObj = vm.check1();
			var obj = vm.editData[vm.currentPage - 1][vm.pages[vm.currentPage - 1] - 1]

			var functionObj = [
				function(){
					// console.log("xxx");
					vm.sendData.push(obj);
				},
				function(){
					// console.log(checkObj.index);
					vm.sendData[checkObj.index] = obj;
				}
			]

			functionObj[checkObj.status]();
			// console.log(this.editData);
			// console.log(this.sendData);
		},
		//添加顺便标注
		addAnnotated2:function(){
			if(this.inputData=="") return;
			var inputData = this.inputData;
			this.inputData = "";

			var obj = {};
			obj["id"] = "";
			obj["word"] = inputData;
			obj["type"] = this.editData[this.currentPage-1][this.pages[this.currentPage-1]-1].type;
			obj["note"] = "";
			obj["addition"] = "";
			obj["hyphen"] = false;
			obj["annotator"] = this.userName;
			
			var vm = this;
			var checkResult = this.check2(inputData);
			var checkResult2 = this.check1(inputData);

			var functionObj1 = [
				function(){
					vm.sendData.push(obj);
				},
				function(){
					vm.sendData[checkResult2.index] = obj;
				}
			]

			var functionObj2 = [
				function(){
					vm.editData[vm.currentPage-1].push(obj);
				},
				function(){
					vm.editData[checkResult.index1][0] = obj;
					vm.editData[vm.currentPage-1].push(obj);
				},
				function(){
					vm.editData[checkResult.index2].splice(checkResult.index3, 1);
					vm.editData[vm.currentPage-1].push(obj);	
				},
				function(){
					vm.editData[checkResult.index1][0] = obj;
					vm.editData[checkResult.index2].splice(checkResult.index3, 1);
					vm.editData[vm.currentPage-1].push(obj);
				}
			]

			
			functionObj1[checkResult2.status]();
			functionObj2[checkResult.status]();

			// console.log(this.editData[vm.currentPage-1]);
		},
		//撤销顺便标注
		escAddAnnotated2:function(){
			this.inputData = "";
			this.blurAnimate(3);
		},
		deleteAddAnnotated2:function(){
			this.$set(this.pages,this.currentPage-1,this.pages[this.currentPage-1]-1);
			this.editData[this.currentPage-1].splice(this.pages[this.currentPage-1], 1);
			for(var i=0;i<this.sendData.length;i++){
				// console.log(this.sendData[i].word);
				if(this.currentWord==this.sendData[i].word){
					this.sendData.splice(i, 1);
				}
			}
		},
		//检测当前标注的词是否已经标注过
		check1:function(){
			if(arguments.length==0){
				var thisWord = this.editData[this.currentPage - 1][this.pages[this.currentPage - 1] - 1]['word'];
			}

			if(arguments.length==1){
				var thisWord = arguments[0];
			}

			var obj = {
				status:0,
				index:0
			};

			for(var i = 0;i < this.sendData.length;i++){
				if(thisWord == this.sendData[i]['word']) {
					obj.index = i;
					obj.status = 1;
					return obj;
				}
			}

			obj.status = 0;
			return obj;
		},
		//检测当前添加的顺便标注的词是否已经在原数据里面
		check2:function(word){
			var obj = {
				status:0,
				index1:-1,
				index2:-1,
				index3:-1
			}

			//判断是否在sourceData里面
			for(var i = 0;i < this.sourceData.length;i ++){
				if(word == this.sourceData[i].word){
					obj.index1 = i;
					obj.status += 1;
					break;
				}
			}
			//判断是否在之前添加的顺便标注里面
			for(var i=0;i<this.editData.length;i++){
				var x = false;
				for(var j=1;j<this.editData[i].length;j++){
					if(word == this.editData[i][j]){
						obj.index2 = i;
						obj.index3 = j;
						obj.status += 2;
						x = true;
						break
					}
				}

				if(x) break;
			}
			
			return obj;
		},
		//绑定当前标注下所有标注饿类型
		bindType:function(){
			var type = this.editData[this.currentPage-1][this.pages[this.currentPage-1]-1].type;

			for(var x = 0;x<this.editData[this.currentPage-1].length;x++){
				this.editData[this.currentPage-1][x].type = type;
			}
		},
		//标红当前标注的词
		markWord:function(){
            var a = this.editData[this.currentPage-1][this.pages[this.currentPage-1]-1]['word'];
            var p1 = this.sourceData[this.currentPage-1]['context'][0];
            var p2 = this.sourceData[this.currentPage-1]['context'][1];
            var p3 = this.sourceData[this.currentPage-1]['context'][2];
            document.getElementById("p1").innerHTML = p1.replace(a, "<span style='color: #3399CC;font-weight: 800;font-size: 15px;'>"+" "+a+""+"</span>");
            document.getElementById("p2").innerHTML = p2.replace(a, "<span style='color: #3399CC;font-weight: 800;font-size: 15px;'>"+" "+a+""+"</span>");
            document.getElementById("p3").innerHTML = p3.replace(a, "<span style='color: #3399CC;font-weight: 800;font-size: 15px;'>"+" "+a+""+"</span>");
		},
		//下一个词
		nextWord:function(){
			var ifNext = this.pages[this.currentPage-1] == this.editData[this.currentPage-1].length ? false : true;
			if(ifNext) {
				var c = this.pages[this.currentPage-1]
				this.$set(this.pages,this.currentPage-1,c+1)
			}
			// console.log(this.pages[this.currentPage-1]);
		},
		//上一个词
		lastWord:function(){
			var ifNext = this.pages[this.currentPage-1] == 1 ? false : true;
			if(ifNext) {
				var c = this.pages[this.currentPage-1]
				this.$set(this.pages,this.currentPage-1,c-1)
			}
			// console.log(this.pages[this.currentPage-1]);
		},
		//调用接口获取后台数据
		apiHandler:function(){
			this.$http.get("/api/data").then((response)=>{
				var data = response.body;
				this.sourceData = data.data;
				this.count = data.count;
				this.currentPage = 1;
				// console.log(this.count)
				// console.log(this.sourceData);
			}, (response)=>{
				alert(response.status);
			})
		},
		//重设pages数据
		resetPage:function(){
			for(var i=0;i<this.editData.length;i++){
				this.pages.push(1);
			}
		},
		//设置editData
		resetEditData:function(){
			this.editData = [];
			//设置editData
			for(var i = 0;i < this.sourceData.length;i++){
				var arr = []
				arr[0] = {};
				arr[0]["id"] = this.sourceData[i]["id"] || 0;
				arr[0]["word"] = this.sourceData[i]["word"] || "";
				arr[0]["type"] = "";
				arr[0]["note"] = "";
				arr[0]["addition"] = "";
				arr[0]["hyphen"] = false;
				arr[0]["annotator"] = this.userName;
				this.editData.push(arr);
			}
		},
		blurAnimate:function(n){
			this.$set(this.lineWidth,n,0);
			// this.lineWidth[n] = 0;
		},
		focusAnimate:function(n){
			if(n==2&&this.currentType!="other") return;

			if(n==1&&this.ifHasSupplement==true) return;

			this.$set(this.lineWidth,n,100);
			// this.lineWidth[n] = 100;
		}
	},
	created:function(){
		this.apiHandler();	
	}	
}
</script>

<style scoped lang="less">
@color3:#3399CC;
.myLine(@top:-8px,@height:0.1em,@width:100%,@backgroudColor:#D2D2D2){
  position: relative;
  width: @width;
  height: @height;
  background-color: @backgroudColor;
  top: @top;
  margin:auto;
}
@media only screen and (min-width: 860px){
	.input{
		width:30%;
		height: 360px;
	}
	.text{
		width: 70%;
		height: 360px;
	}
}

@media only screen and (min-width: 650px) and (max-width: 859px){
	.input{
		width:35%;
		height: 477px;
	}
	.text{
		width:65%;
		height: 477px
	}
}

//pc端的样式
@media only screen and (min-width: 650px){
	.input{
		float: right;
		.words{
			p{
				span{
					font-size: 25px;
				}
				font-size: 20px;
			    font-weight: 700;
			    text-align: center;
			}
		}
		.Hyphen{
			margin-bottom: 3%;
			width:95%;
			height: 10%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.5em;
				position: relative;
				top: 30%;
			}
			input{
				width: 16px;
				height: 16px;
				position: relative;
				top: 33%;
				float: right;
			}
		}
		.selectBox{
			height: 14%;
			margin-bottom: 3%;
			width:95%;
			label{
				display: inline-block;
	            color: #999999;
	            font-size:14px;
                transform: translate(0,25px);
            	transition: all 0.2s ease-out;
			}
			select{
	            color: #555;
	            display: block;
	            height: 36px;
	            padding: 7px 0;
	            font-size: 14px;
	            line-height: 1.42857;
	            font-weight: 400;
	            background-color: transparent;
	            border: 0;
	            width:100%;
	            outline:none;
				option{

				}
			}
		}
		.supplement{
			height: 14%;
			margin-bottom: 3%;
			width:95%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.2em;
			}
			input{
	            width:100%;
	            height:40px;
	            border:none;
	            outline:none;
			}
		}
		.textBox{
			margin-bottom: 3%;
			height: 30%;
			width: 95%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.2em;
			}
			textarea{
	            width:100%;
	            height:82%;
	            border:none;
	            outline:none;
			}
		}
		.addText{
			margin-bottom: 3%;
			height: 14%;
			width: 95%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.2em;
			}
			input{
	            width:100%;
	            height:82%;
	            border:none;
	            outline:none;
			}
		}
      	.line{
        	.myLine(-5px);

      	}
	}
	.text{
		float: right;
		.labelBox{
          	p{
            	width: 100%;
            	height:85%;
          	}
			p::-webkit-scrollbar{
				width:8px;
			}
			p::-webkit-scrollbar-thumb{
				width: 8px;
				-webkit-border-radius:;
				-moz-border-radius:;
				border-radius:10px;
				background-color: @color3;
			}
		}
	}
	.buttons{
		clear: both;
		width:100%;
		height: 60px;
		text-align: center;
		button{
            width:18%;
            height:40px;
            background-color: @color3;
            text-align: center;
            line-height:40px;
            font-size: 17px;
            color: #FFFFFF;
            border:none;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            top: 10px;
		}
		button:hover{
        	box-shadow: 0 4px 4px 0 rgba(51, 153, 204, 0.14), 0 3px 1px -2px rgba(244, 67, 54, 0.2), 0 1px 5px 0 rgba(244, 67, 54, 0.12);
	    }
	}
	.page{
		height: 40px;
		line-height: 40px;
		position: absolute;
		bottom: 34px;
		right: 20px;
		font-size: 2em;
		span{
			color:@color3;
			font-weight: 800;
			font-size: 2em;
		}
	}
	.count{
		height: 40px;
		line-height: 40px;
		position: absolute;
		bottom: 30px;
		left: 20px;
		font-size: 1.4em;
		span{
			color:@color3;
			font-weight: 800;
			font-size: 1.4em;
		}
	}
}

//移动端的样式
@media only screen and (max-width: 649px){
	.input{
		// width: 95%;
		// padding: auto 2.5% auto 2.5%;
		.words{
			position: relative;
			top:-364.5px;
			p{
				position: relative;
				span{
					display: block;
					width: 20px;
					position: absolute;
					transform:scale(2.3);
					top:-4px;
					left: 50%;
				}
				.arrowleft{
					margin-left: -95px;
					// margin-: -70px;
				}
				.arrowright{
					margin-left: 75px;
				}
				font-size: 20px;
			    font-weight: 700;
			    text-align: center;
			}
		}
		.Hyphen{
			float: left;
			width:45%;
			height: 30px;
			margin-bottom: 5px;
			margin-right: 2%;
			margin-left: 3%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.5em;
				position: relative;
				top: 30%;
			}
			input{
				width: 16px;
				height: 16px;
				position: relative;
				top: 33%;
				float: right;
			}
		}
		.selectBox{
			float: left;
			width:45%;
			height: 50px;
			margin-bottom: 5px;
			margin-right: 3%;
			margin-left: 2%;
			label{
				display: inline-block;
	            color: #999999;
	            font-size:1.2em;
	        	transition: all 0.2s ease-out;
			}
			select{
	            color: #555;
	            display: block;
	            height:82%;
	            padding: 7px 0;
	            font-size: 14px;
	            line-height: 1.42857;
	            font-weight: 400;
	            background-color: transparent;
	            border: 0;
	            width:100%;
	            outline:none;
				option{

				}
			}
		}
		.supplement{
			float: left;
			width:45%;
			height: 50px;
			margin-bottom: 5px;
			margin-right: 2%;
			margin-left: 3%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.2em;
			}
			input{
	            width:100%;
	            height:40px;
	            border:none;
	            outline:none;
			}
		}
		.textBox{
			float: left;
			width:45%;
			height: 80px;
			margin-bottom: 5px;
			margin-right: 3%;
			margin-left: 2%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.2em;
			}
			textarea{
	            width:100%;
	            height:82%;
	            border:none;
	            outline:none;
			}
		}
		.addText{
			float: left;
			width:45%;
			height: 50px;
			margin-bottom: 5px;
			margin-right: 2%;
			margin-left: 3%;
			label{
	            display: inline-block;
	            color: #999999;
	            font-size:1.2em;
			}
			input{
	            width:100%;
	            height:82%;
	            border:none;
	            outline:none;
			}
		}
	}
	.text{
		position: relative;
		top:27px;
		.labelBox{
			margin-bottom: 3px;
		}
		label{
			display: block;
			text-align: center
		}
      	p{
        	width: 96%;
        	padding:1% 2%;
        	height:95px;
        	font-size:14px;
        	overflow:auto;
      	}
	}
	.buttons{
		button{
			height: 30px;
			width:32.7%;
			display: inline-block;
			border:none;
		}
	}
	.page{
		height: 26px;
		line-height: 26px;
		position: absolute;
		top: 73px;
		right: 20px;
		font-size: 1.5em;
	}
	.count{
		height: 40px;
		line-height: 40px;
		position: absolute;
		top: 0px;
		right: 20px;
		font-size: 1em;
		span{
			color:@color3;
			font-weight: 800;
			font-size: 1.2em;
		}
	}
}
//公共的样式
#type{
	width: 100%;
	overflow: auto;
}
.input{
	.words{
		span{

		}
		p{
			img{
				position: relative;
				top: -3px;
				left: -4px;
				cursor: pointer;
			}
			font-size: 20px;
		    font-weight: 700;
		    text-align: center;
		    span{
		    	cursor: pointer;
		    }
		}
		span{

		}
	}
	.Hyphen{
		margin-bottom: 3%;
		label{
            display: inline-block;
            color: #999999;
            font-size:1.5em;
			position: relative;
			top: 30%;
		}
		input{
			width: 16px;
			height: 16px;
			position: relative;
			top: 33%;
			float: right;
		}
	}
	.selectBox{
		label{
			display: inline-block;
            color: #999999;
        	transition: all 0.2s ease-out;
		}
		select{
            color: #555;
            display: block;
            height:82%;
            padding: 7px 0;
            font-size: 14px;
            line-height: 1.42857;
            font-weight: 400;
            background-color: transparent;
            border: 0;
            width:100%;
            outline:none;
			option{

			}
		}
	}
	.supplement{
		label{
            display: inline-block;
            color: #999999;
            font-size:1.2em;
		}
		input{
            width:100%;
            height:40px;
            border:none;
            outline:none;
		}
	}
	.textBox{
		label{
            display: inline-block;
            color: #999999;
            font-size:1.2em;
		}
		textarea{
            width:100%;
            height:82%;
            border:none;
            outline:none;
		}
	}
	.addText{
		label{
            display: inline-block;
            color: #999999;
            font-size:1.2em;
		}
		input{
            width:100%;
            height:82%;
            border:none;
            outline:none;
		}
	}
  	.line{
    	.myLine(-5px);
  	}
	.strongLine{
		.myLine(-7px,2px,100%,@color3);
		transition:all 0.2 ease-out;
	}		
}
.text{
	.labelBox{
		height: 30%;
		label{
			height:15%;
            color:#999999;
            font-size:13px;
        }
      	p{
        	font-size:14px;
        	overflow:auto;
      	}
	}
}
</style>
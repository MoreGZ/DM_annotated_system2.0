<template>
	<div id="navbar">
		<ul>
			<li :class="{active:tabStatus=='type'}" @click="changeTabToType">类型标注</li>
			<li :class="{active:tabStatus=='abbr'}" @click="changeTabToAbbr">缩略语标注</li>
		</ul>
		<div class="slider" :style="{left:sliderPosition+'%'}">{{sliderTitle[tabStatus]}}</div>
	</div>
</template>

<script>
import store from '../store/index.js'
import {mapMutations} from 'vuex'

export default {
	data:function(){
		return {
			sliderTitle:{
				"abbr":"缩略语标注",
				"type":"类型标注"
			}
		}
	},
	computed:{
		tabStatus:function(){
			return this.$store.state.tabStatus
		},
		sliderPosition:{
			get:function(){
				return this.tabStatus == "type" ? "-1" : "49";
	 		}
		}
	},
	methods:{
		...mapMutations([
			'changeTabToAbbr',
			'changeTabToType'
		]),
	},
	store,
}
</script>

<style scoped lang="less">
@color3:#3399CC;
//pc端的样式
@media only screen and (min-width: 650px){
	#navbar{
		position: relative;
		ul{
			background-color: rgba(200, 200, 200, 0.2);
			overflow: auto;
			height: 37.6px;
			li{
				list-style: none;
				width: 50%;
				line-height: 37.6px;
				text-align: center;
				float: left;
				font-size: 1.6em;
				cursor: pointer;
			}
		}
		.slider{
			width: 52%;
			height: 45px;
			line-height: 45px;
			font-size: 1.8em;
			text-align: center;
			font-weight: 800;
			color: #fff;
			background-color: @color3;
			border-radius: 4px;
			box-shadow: 0 16px 26px -10px #3399CC, 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(244, 67, 54, 0.2);
			position: absolute;
			top: -3.9px;
			cursor: pointer;
			transition: left 0.2s linear;
		}
	}
}
//移动端的样式
@media only screen and (max-width: 649px){
	#navbar{
		position: relative;
		ul{
			background-color: rgba(200, 200, 200, 0.2);
			overflow: auto;
			height: 30px;
			li{
				list-style: none;
				width: 50%;
				line-height: 30px;;
				text-align: center;
				float: left;
				font-size: 1.8em;
			}
			.active{
				background-color: @color3;
				color: #fff;
			}
		}
		.slider{
			display: none;
		}
	}
}


</style>
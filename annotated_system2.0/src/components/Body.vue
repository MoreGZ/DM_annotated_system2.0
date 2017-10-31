<template>
	<div id="body">
		<h1 class="title">标注系统</h1>
		<v-navbar></v-navbar>
		<div class="main">
			<v-abbr v-show="tabStatus=='abbr'"></v-abbr>
			<v-type v-show="tabStatus=='type'"></v-type>
		</div>

	</div>
</template>

<script>
import vType from './Type.vue';
import vAbbr from './Abbr.vue';
import vNavbar from './Navbar.vue';
import store from '../store/index.js'

export default {
  name: 'body',
  store,
  computed:{
  	tabStatus:function(){
  		return this.$store.state.tabStatus;
  	}
  },
  components: {
    vType,vAbbr,vNavbar
  }
}
</script>

<style scoped lang="less">
@media only screen and (min-width: 860px){
	#body{
		width:810px;
		height: 583px;
		border-radius: 6px;
		box-shadow:  0px 0px 20px rgba(0,0,0,0.2);
	}
}

@media only screen and (min-width: 650px) and (max-width: 859px){
	#body{
		width:610px;
		height:700px;
		border-radius: 6px;
		box-shadow:  0px 0px 20px rgba(0,0,0,0.2);
	}
}

//pc端的样式
@media only screen and(min-height: 1000px) and (min-width: 650px){
	#body{
		margin-top: 160px;
	}
}
@media only screen and (max-height: 999px) and (min-width: 650px){
	#body{
		margin-top: 110px;
	}
}
@media only screen and (min-width: 650px){
	#body{
		padding-top: 6px;
		padding-bottom: 10px;
		.title{
			width: 100%;
			height: 90px;
			line-height: 90px;
			text-align: center;
			color: #3C4858;
			font-size: 2.8em;
		}
		.main{
			padding: 20px 15px;
			position: relative;
			overflow: auto;
		}
		#type{
		}
		#abbr{
		}
	}
}
//移动端的样式
@media only screen and (max-width: 649px){
	#body{
		.title{
			width: 100%;
			height: 40;
			line-height: 40px;
			text-align: center;
			color: #3C4858;
			font-size: 2em;
		}
	}
}


//公共样式
#body{
	background-color: white;
}
</style>
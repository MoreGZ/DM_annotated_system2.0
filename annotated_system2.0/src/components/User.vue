<template>
	<div id="user">
		<div class="img">
          <img src="../assets/new_logo.png">
          <a href="http://www.baidu.com">退出</a>
      </div>
      <p class="name">{{userName}}</p>
	</div>
</template>

<script>
import Vue from "vue";
import store from "../store/index.js"
import {mapState,mapMutations} from "vuex"

export default {
	computed:{
		...mapState([
			"userName"
		])
	},
	store:store,
	methods:{
		...mapMutations([
			"setUserName"
		])
	},
	created:function(){
		var un = document.getElementById("userName").innerHTML;
		console.log(un);
		this.setUserName(un);
	}
}
</script>

<style scoped lang="less">
	@color1:#fff;
	@color2:#99CCCC;
	@color3:#3399CC;
	//移动端样式
	@media only screen and (max-width: 649px) {
		#user{
	      top:5px;
	      left:10px;
	      .img{
	        width: 25px;
	        height:25px;
	        a{
	          opacity: 0;
	          line-height: 25px;
	          font-size: 1em;
	        }
	      }
	      p{
	        font-size: 13px;
	        margin-left: 5px;
	        margin-top: 0px;
	        height: 25px;
	        line-height: 25px;
	      }
	    }
	}
	//pc端样式
	@media only screen and(min-width:650px){
		#user{
	      position: absolute;
	      top:20px;
	      left:50px;
	      z-index: 3;
	      .img{
	        width: 50px;
	        height:50px;
	        a{
	          opacity: 0;
	          line-height: 50px;
	          font-size: 12px;
	        }
	        a:hover{
	        	opacity: 0.8;
	        }
	      }
	      p{
	        font-size: 20px;
	        line-height: 40px;
	        margin-left: 10px;
	        margin-top: 7px;
	        width: 70px;
	        height: 40px;
	      }
	    }
	}
	
	#user{
      position: absolute;
      z-index: 3;
      .img{
        overflow: hidden;
        position: relative;
        border-radius: 50%;
        border: 1px solid @color3;
        float: left;
        img{
          width:100%;
          height:100%;
        }
        a{
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0px;
          left: 0px;
          background-color: @color3;
          display: block;
          text-align: center;
          color: white;
          font-weight: 800;
          font-size: 12px;
          text-decoration: none;
          transition: all 0.3s linear;
          cursor: pointer;
        }
      }
      p{
        float: left;
        width: 70px;
        text-align: left;
        color: @color3;
      }
    }
    
</style>
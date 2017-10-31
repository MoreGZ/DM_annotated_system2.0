import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from "vue-resource";

Vue.use(VueResource)
Vue.use(Vuex);

var vAjax = new Vue();

const state = {
	tabStatus:'type',
	userName:''
	// sourceDataType:{},
	// sourceDataAbbr:{},
	// countTpye:""
};

const getters = {

};

const mutations = {
	changeTabToType:function(state){
		state.tabStatus = "type";
	},
	changeTabToAbbr:function(state){
		state.tabStatus = "abbr";
	},
	setUserName:function(state,name){
		state.userName = name;
	}
	// setSourceData:function(state,xxx){
	// 	console.log(state.countTpye);
	// 	state.sourceDataType = xxx.data;
	// 	state.countTpye = xxx.count;
	// 	console.log(state.countTpye);
	// }
};

const actions = {
	// getSourceData:function(context){
	// 	vAjax.$http.get("/api/data").then((response)=>{
	// 		var data = response.body;
	// 		console.log(data);
	// 		context.commit('setSourceData',data);
	// 	}, (response)=>{
	// 		console.log(response.status);
	// 	})
	// }
};

export default new Vuex.Store({
    state,mutations,getters,actions
});
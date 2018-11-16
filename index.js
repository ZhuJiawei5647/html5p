const zjw = {
	install (Vue, options) {

	}
}

if (typeof exports == "object") {
  module.exports = zjw
// 支持 AMD
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return zjw })
// Vue 是全局变量时，自动调用 Vue.use()
} else if (window.Vue) {
  window.zjw = zjw
  Vue.use(zjw)
}
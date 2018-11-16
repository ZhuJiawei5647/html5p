import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Video from '@/components/Video'
import ImageV from '@/components/Image'
import Upload from '@/components/Upload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
    	path: '/video',
    	name: 'video',
    	component: Video
    },
    {
    	path: '/Image',
    	name: 'image',
    	component: ImageV
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    }
  ]
})

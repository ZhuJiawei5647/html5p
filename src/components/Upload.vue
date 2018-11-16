<template>
	<div>
		<h3>上传图片</h3>
		<div>
			<div class="clearfix">
				<div class="img-box">
			    	<img :src="imageUrl">
					<input type="file" @change="changeImage" name="image">
				</div>
			</div>
			<button @click="uploadImage">上传</button>
		</div>
		<h3>上传视频</h3>
		<div>
			<input type="file" @change="changeVideo" name="image">
			<button @click="uploadVideo">上传</button>
		</div>
	</div>
</template>
<script>
	import imageUrl from '@/assets/logo.png'
	import md5 from 'md5'
	export default {
		data () {
			return {
				imageUrl,
				file: null,
				chunks: [],
				dataLenth: 2 * 1024 * 1024,
				index: 0,
				md5code: '',
				filetype: '',
				filesize: 0
			}
		},
		methods: {
			changeImage (e) {
				var file = e.target.files[0] || e.dataTransfer.files[0];
                if (file && file.type.indexOf('image') !== -1) {
                	var reader = new FileReader()
                	reader.onload = (e) => {
                		this.file = file
                		this.imageUrl = e.target.result
                	}
                	reader.readAsDataURL(file)
                } else {
                	alert('该文件不是图片')
                }
			},
			uploadImage() {
				if (this.file) {
					var formData = new FormData()
					formData.append('name', 'image')
					formData.append('file', this.file)
					$.ajax({
						type: 'post',
						url: '/image/upload',
						data: formData,
						processData: false, // tell jQuery not to process the data  ，这个是必须的，否则会报错
						contentType: false, // tell jQuery not to set contentType
						cache: false,
						dataType: 'json',
						xhr: function() { //这个是重点，获取到原始的xhr对象，进而绑定upload.onprogress
							var xhr = jQuery.ajaxSettings.xhr();
							xhr.upload.onprogress = function(ev) {
								//这边开始计算百分比
								var percent = 0;
								if (ev.lengthComputable) {
									percent = 100 * ev.loaded / ev.total;
									percent = parseFloat(percent).toFixed(2);
									console.log(percent + '%')
								}
							};
							return xhr;
						},
						success: (data) => {
							this.imageUrl = data.data
							alert('上传成功: '+data.data)
						}
					});
				}
			},
			changeVideo (e) {
				var file = e.target.files[0] || (e.dataTransfer && e.dataTransfer.files[0]) || null;
				if (file && file.type.indexOf('video') !== -1) {
					console.log(file)
					this.index = 0;
					this.chunks = []
					this.md5code = md5(file.name)
					console.log(this.md5code)
					this.filetype = file.type.replace('video/', '')
					this.filesize = file.size
					console.log(this.filetype)
					console.log(this.filesize)
					var slice = '', 
						start = 0
					do{
						slice = file.slice(start, start + this.dataLenth);
						start = start + this.dataLenth;
						console.log(slice)
						this.chunks.push(slice)
					} while (start < file.size);
				}
			},
			uploadVideo () {
				console.log(this.index)
				console.log(this.chunks.length)
				if (this.index < this.chunks.length) {
					var formData = new FormData()
					formData.append('name', this.md5code + '.' + this.filetype)
					formData.append('index', this.index)
					formData.append('file', this.chunks[this.index])
					if (this.index + 1 == this.chunks.length) {
						formData.append('islast', true)
					} else {
						formData.append('islast', false)
					}
					$.ajax({
						type: 'post',
						url: '/video/upload?code=' + this.md5code,
						data: formData,
						processData: false, // tell jQuery not to process the data  ，这个是必须的，否则会报错
						contentType: false, // tell jQuery not to set contentType
						cache: false,
						dataType: 'text',
						xhr: () => { //这个是重点，获取到原始的xhr对象，进而绑定upload.onprogress
							var xhr = jQuery.ajaxSettings.xhr();
							xhr.upload.onprogress = (ev) => {
								//这边开始计算百分比
								var percent = 0;
								if (ev.lengthComputable) {
									percent = 100 * (this.index * this.dataLenth + ev.loaded / ev.total * this.chunks[this.index].size) / this.filesize;
									percent = parseFloat(percent).toFixed(2);
									console.log(percent + '%')
								}
							};
							return xhr;
						},
						success: (data) => {
							console.log(this.index)
							this.index++
							this.uploadVideo()
						},
						fail (err) {
							this.index = 0;
							console.log(err)
							alert('上传失败')
						}
					});
				} else {
					alert('上传成功')
				}
			}
		}
	}
</script>
<style lang="less">
	.img-box {
		float: left;
		margin: auto;
		position: relative;
		cursor: pointer;

		img {
			display: block;
			height: 150px;
		}
		input {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
			z-index: 1;
		}
	}
	
</style>
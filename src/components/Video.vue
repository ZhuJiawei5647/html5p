<template>
	<div>
		<input type="file" @change="change" name="image">
		<button @click="upload">上传</button>
		<video src="/videos/0b867e53c1d233ce9fe49d54549a2323.mp4" controls></video>
	</div>
</template>
<script>
	import md5 from 'md5'
	export default {
		data () {
			return {
				chunks: [],
				dataLenth: 2 * 1024 * 1024,
				index: 0,
				md5code: '',
				filetype: '',
				filesize: 0
			}
		}, 
		methods: {
			change (e) {
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
			upload () {
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
							this.upload()
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
<style>
	
</style>
<template>
	<div>
		<div class="clearfix">
			<div class="img-box">
		    	<img :src="imageUrl">
				<input type="file" @change="change" name="image">
			</div>
		</div>
		<button @click="upload">上传</button>
	</div>
	
</template>
<script>
	import imageUrl from '@/assets/logo.png'
	export default {
		data () {
			return {
				imageUrl,
				file: null
			}
		},
		methods: {
			change (e) {
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
			upload() {
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
			}
		}
	}
</script>
<style scoped>
	.img-box {
		float: left;
		margin: auto;
		position: relative;
		cursor: pointer;
	}
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
</style>
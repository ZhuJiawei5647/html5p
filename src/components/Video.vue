<template>
	<div class="video-box">
		<div class="video">
			<video src="/videos/0b867e53c1d233ce9fe49d54549a2323.mp4"
				height="100%"
				width="100%" 
				@loadstart="loadstart" 
				@durationchange="durationchange"
				@loadeddata="loadeddata"
				@progress="progress"
				@ended="ended"
				@pause="pause"
				@play="play"
				@waiting="waiting"
				@timeupdate="timeupdate"
			></video>
		</div>
		<div class="controls">
			<div class="controls-left">
				<span v-if="paused" class="iconfont icon-bofang1" @click="playVideo"></span>
				<span v-else class="iconfont icon-zanting1" @click="pauseVideo"></span>
			</div>
			<div class="controls-center">
				<my-progress :rate="rate" :cache="cache" length="100%" @rateChange="rateChange"></my-progress>
			</div>
			<div class="controls-right">
				<div class="controls-time">{{currentTime | currentTimeFilter}} / {{duration | durationFilter}}</div>
				<div class="controls-yinliang">
					<span class="iconfont icon-yinliang" @click="voiceClick"></span>
					<div class="controls-yinliang-progress" v-show="voiceShow">
						<my-progress :rate="voice" type="vertical" length="100%" @rateChange="voiceChange"></my-progress>
						<div class="tringle"></div>
					</div>
				</div>
				<div class="iconfont icon-quanpin controls-quanpin"></div>
			</div>
		</div>
	</div>
</template>
<script>
	import md5 from 'md5'
	import MyProgress from './Progress'
	export default {
		data () {
			return {
				vedio: null,
				duration: 0,
				currentTime: 0,
				paused: true,
				rate: 0,
				cache: 0,
				voice: 0,
				voiceShow: false
			}
		},
		components: {MyProgress},
		filters: {
			durationFilter (t) {
				var minutes = parseInt(t / 60);
				var seconds = parseInt(t % 60)
				if (minutes == 0) {
					minutes = '00'
				} else if (minutes < 10) {
					minutes = '0' + minutes
				} else {
					minutes += ''
				}

				if (seconds == 0) {
					seconds = '00'
				} else if (seconds < 10) {
					seconds = '0' + seconds
				} else {
					seconds += ''
				}

				return minutes + ':' + seconds
			},
			currentTimeFilter (t) {
				var minutes = parseInt(t / 60);
				var seconds = parseInt(t % 60)
				if (minutes == 0) {
					minutes = '00'
				} else if (minutes < 10) {
					minutes = '0' + minutes
				} else {
					minutes += ''
				}

				if (seconds == 0) {
					seconds = '00'
				} else if (seconds < 10) {
					seconds = '0' + seconds
				} else {
					seconds += ''
				}

				return minutes + ':' + seconds
			}
		},
		methods: {
			playVideo () {
				this.video.play()
			},
			pauseVideo () {
				this.video.pause()
			},
			rateChange (rate) {
				this.video.currentTime = this.currentTime = this.duration * rate
			},
			voiceClick () {
				if (this.voiceShow) {
					this.voiceShow = false
				} else {
					this.voiceShow = true
					this.voice = this.video.volume
				}
			},
			voiceChange (value) {
				this.video.volume = this.voice = value
				localStorage.setItem('voice', value)
			},
			loadstart () {
				// console.log('loadstart')
				// console.log('autoplay', this.video.autoplay)
				// console.log('controller', this.video.controller)
				// console.log('ended', this.video.ended)
				// console.log('currentTime', this.video.currentTime)
				// console.log('loop', this.video.loop)
				// console.log('paused', this.video.paused)
				// console.log('played', this.video.played)
				// console.log('playbackRate', this.video.playbackRate)
				// console.log('duration', this.video.duration)
			},

			loadeddata () {
				if (this.video.buffered.length != 0) {
					this.cache = this.video.buffered.end(0) / this.duration
				}
			},

			progress () {
				if (this.video.buffered.length != 0) {
					this.cache = this.video.buffered.end(0) / this.duration
				}
			},

			durationchange (e) {
				console.log('durationchange')
				this.duration = this.video.duration
			},

			ended () {
				console.log('ended')
			},
			pause () {
				this.paused = true;
				console.log('pause')
			},
			play () {
				console.log('play')
				console.log('duration', this.video.duration)
			},
			waiting () {
				console.log('waiting')
			},
			timeupdate () {
				if (this.video.buffered.length != 0) {
					this.cache = this.video.buffered.end(0) / this.duration
				}
				if (this.video.paused) return
				this.paused = false;
				this.currentTime = this.video.currentTime;
				this.rate = this.currentTime / this.duration
			}
		},
		mounted () {
			this.video = this.$el.querySelector('video')
			this.video.volume = Number(localStorage.getItem('voice'))
			console.log(this.video.volume)
		}
	}
</script>
<style lang="less" scoped>
	@import '../assets/css/shipin.css';
	.video-box {
		width: 100%;
		height: 100%;
		overflow: hidden;

		@controlsHeight: 40px;
		@controlsLeftWidth: 80px;
		@controlsRightWidth: 180px;
		@fontColor: #9D9D9D;
		@backgroundColor: #272727;

		.video {
			width: 100%;
			height: calc(~"100% - @{controlsHeight}")
		}

		.controls {
			position: relative;
			height: @controlsHeight;
			line-height: @controlsHeight;
			vertical-align: middle;
			background-color: @backgroundColor;

			.iconfont {
				font-size: 20px;
				color: @fontColor;
			}

			.controls-left {
				position: absolute;
				left: 0;
				top: 0;
				width: @controlsLeftWidth;
				height: @controlsHeight;
				text-align: center;
			}

			.controls-center {
				margin: 0 @controlsRightWidth 0 @controlsLeftWidth;
				height: @controlsHeight;
				padding-top: 17px;
				box-sizing: border-box;
			}

			.controls-right {
				position: absolute;
				right: 0;
				top: 0;
				width: @controlsRightWidth;
				height: @controlsHeight;
				text-align: center;

				&>div {
					float: left;
				}

				.controls-time {
					color: @fontColor;
					width: 120px;
				}

				.controls-yinliang {
					width: 30px;
					position: relative;

					.controls-yinliang-progress {
						position: absolute;
						left: 50%;
						bottom: 120%;
						transform: translateX(-50%);
						height: 80px;
						padding: 10px 15px;
						background-color: @backgroundColor;
						border-radius: 2px;

						.tringle {
							position: absolute;
							top: 100%;
							left: 50%;
							transform: translateX(-50%);
							border-top: 7px solid @backgroundColor;
							border-left: 7px solid transparent;
							border-right: 7px solid transparent;
						}
					}
				}

				.controls-quanpin {
					width: 30px;
				}
			}
		}
	}
</style>
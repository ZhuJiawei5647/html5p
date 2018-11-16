<template>
	<div :class="['progress', type]" :style="progressStyle" @click="processClick">
		<div class="wrap" :style="{backgroundColor: wrapColor}">
			<div class="inner" ondragstart="return false"></div>
		</div>
		<div class="shallow" :style="{backgroundColor: shallowColor}"></div>
		<div class="deep" :style="{backgroundColor: deepColor}"></div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				wrapColor: '#666',
				shallowColor: '#999',
				deepColor: 'deepPink',
			}
		},
		computed: {
			progressStyle () {
				if (this.type === 'vertical') {
					return {height: this.length}
				} else {
					return {width: this.length}
				} 
			}
		},
		props: {
			rate: {
				type: Number,
				default: 0
			},
			cache: {
				type: Number,
				default: 0
			},
			type: {
				type: String,
				default: 'align'
			},
			length: {
				type: String,
				default: '400px'
			}
		},
		methods: {
			processClick (e) {
				if (this.type === 'vertical') {
					var totalLength = $(this.$el).find('.wrap').height(),
						L = $(this.$el).find('.wrap').offset().top + totalLength - e.y;
					$(this.$el).find('.inner').css('bottom', L).end().find('.deep').css('height', L)
					this.$emit('rateChange', L / totalLength)
				} else {
					var totalLength = $(this.$el).find('.wrap').width(),
						L = e.x - $(this.$el).find('.wrap').offset().left
					$(this.$el).find('.inner').css('left', L).end().find('.deep').css('width', L)
					this.$emit('rateChange', L / totalLength)
				}
			}
		},
		watch: {
			rate (rate) {
				console.log(rate)
				if (this.type === 'vertical') {
					var totalLength = $(this.$el).find('.wrap').height(),
						L = totalLength * rate + 'px';
						console.log(totalLength)
					$(this.$el).find('.inner').css('bottom', L).end().find('.deep').css('height', L)
				} else {
					var totalLength = $(this.$el).find('.wrap').width(),
						L = totalLength * rate + 'px';
					$(this.$el).find('.inner').css('left', L).end().find('.deep').css('width', L)
				}
			},
			cache (rate) {
				if (this.type === 'vertical') {
					var totalLength = $(this.$el).find('.wrap').height(),
						L = totalLength * rate + 'px';
					$(this.$el).find('.shallow').css('height', L)
				} else {
					var totalLength = $(this.$el).find('.wrap').width(),
						L = totalLength * rate + 'px';
					$(this.$el).find('.shallow').css('width', L)
				}
			}
		},
		mounted () {
			var $el = $(this.$el)
			$el.find('.inner').on('mousedown', (e) => {
				e.preventDefault()
				e.stopPropagation()
				var innerNode = e.target,
					elementPoint = {
						x: innerNode.offsetLeft,
						y: innerNode.offsetTop
					},
					startPoint = {
						x: e.clientX,
						y: e.clientY
					}
				if (innerNode.setCapture) {
					innerNode.setCapture()
				}
				$(document).on('mousemove', (e) => {
					if (this.type === 'vertical') {
						var totalLength = innerNode.offsetParent.offsetHeight,
							L = totalLength - elementPoint.y + startPoint.y - e.clientY;
						if (L < 0) {
							L = 0
						} else if (L > totalLength) {
							L = totalLength
						}
						var rate = L / totalLength
						$(this.$el).find('.inner').css('bottom', L).end().find('.deep').css('height', L)
						this.$emit('rateChange', rate)
					} else {
						var totalLength = innerNode.offsetParent.offsetWidth,
							L = elementPoint.x + e.clientX - startPoint.x;
						if (L < 0) {
							L = 0
						} else if (L > totalLength) {
							L = totalLength
						}
						var rate = L / totalLength
						$(this.$el).find('.inner').css('left', L).end().find('.deep').css('width', L)
						this.$emit('rateChange', rate)
					}
				})
				$(document).on('mouseup', (e) => {
					$(document).unbind('mousemove mouseup')
					if (innerNode.releaseCapture) {
						innerNode.releaseCapture()
					}
				})
			})
		}
	}
</script>
<style lang="less" scoped>
	.progress {
		position: relative;
		cursor: pointer;

		.positionTopLeft {
			position: absolute;
			top: 0;
			left: 0;
		}

		.positionBottomLeft {
			position: absolute;
			bottom: 0;
			left: 0;
		}

		&.align {
			height: 4px;

			.wrap {
				.positionTopLeft();
				width: 100%;
				height: 100%;

				.inner {
					position: absolute;
					top: -2px;
					left: 0;
					height: 8px;
					width: 4px;
					transform: translateX(-2px);
					background-color: #fff;
					border-radius: 1px;
					z-index: 100;
				}
			}

			.shallow {
				.positionTopLeft();
				width: 0;
				height: 100%;
			}

			.deep {
				.positionTopLeft();
				width: 0;
				height: 100%;
			}
		}

		&.vertical {
			width: 4px;

			.wrap {
				.positionBottomLeft();
				width: 100%;
				height: 100%;

				.inner {
					position: absolute;
					bottom: 0;
					left: -2px;
					height: 4px;
					width: 8px;
					transform: translateY(2px);
					background-color: #fff;
					border-radius: 1px;
					z-index: 100;
				}
			}

			.shallow {
				.positionBottomLeft();
				width: 100%;
				height: 0;
			}

			.deep {
				.positionBottomLeft();
				width: 100%;
				height: 0;
			}
		}


	}
</style>
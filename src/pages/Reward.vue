<template>
    <div class="reward-wrapper">
        <div class="title">
            <span>恭喜您!</span>
            <p>获得了{{rewardCount}}次抽奖机会！</p>
        </div>

        <div class="lucky">
            <img :style="{transform: rotateDeg}"
                :src="turntableImage" alt="幸运大转盘" class="turntable" />
            <img src="../assets/images/point.png" alt="指针" class="pointer" @click="luckyHandle" />
        </div>

        <div class="bottom-back">
            <a href="javascript:;" class="link back" @click="backHandle"></a>
        </div>

        <!-- 奖品 -->
        <div class="van-overlay" v-show="prizeShow">
            <div class="dialog-wrap flex-center">
                <div class="content">
                    <img :src="prizeImage" />
                </div>
                <van-icon name="clear" class="dialog-close" @click="prizeShow = false" />
            </div>
        </div>

        <div class="bg"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            prizeShow: false,
            prizeImage: '',
            flag: false, // 是否执行完了转盘
            isAllowClick: true, // 是否能够点击
            count: 3, // 旋转圈数
            rotateDeg: 0, // 将要旋转的角度
            deg: 0, // 度数
            rewardCount: 1,
            turntableImage: require('../assets/images/turntable.png'),
            luckAudio: require('../assets/audio/luck.mp3'),
            turnAudio: require('../assets/audio/turn.mp3')
        }
    },
    methods: {
        getLottery() {
            return new Promise((resolve, reject) => {
                this.$request.get(this.$host + 'lottery').then((res) => {
                    if (res.code == "011502") {
                        this.$toast.fail('请分享赢得更多答题机会');
                        return;
                    } else {
                        resolve(res);
                    }
                }).catch((error) => {
                    reject(error);
                });
            })
        },
        async luckyHandle() {
            if (!this.isAllowClick) return;
            this.isAllowClick = false;
            
            this.rewardCount = 0;
            this.playAudio(this.turnAudio);

            let result = await this.getLottery();
            let data = result.data;

            this.deg += 360 * this.count;
            this.rotateDeg = "rotate(" + this.deg + "deg)";

            if(data && data.name) {
                switch (data.name) {
                    case '口罩基金':
                        // 如果执行了转盘
                        if (this.flag) {
                            this.deg = this.deg + 90;
                        }
                        this.deg = this.deg + 270;
                        this.prizeImage = require('../assets/images/kz.png');
                        break;
                    case '少出门':
                        // 如果执行了转盘
                        if (this.flag) {
                            this.deg = this.deg + 150;
                        }
                        this.deg = this.deg + 210;
                        this.prizeImage = require('../assets/images/scm.png');
                        break;
                    case '多通风':
                        // 如果执行了转盘
                        if (this.flag) {
                            this.deg = this.deg + 210;
                        }
                        this.deg = this.deg + 150;
                        this.prizeImage = require('../assets/images/tf.png');
                        break;
                    case '保持锻炼':
                        // 如果执行了转盘
                        if (this.flag) {
                            this.deg = this.deg + 270;
                        }
                        this.deg = this.deg + 90;
                        this.prizeImage = require('../assets/images/dl.png');
                        break;
                    case '学习基金':
                        // 如果执行了转盘
                        if (this.flag) {
                            this.deg = this.deg + 330;
                        }
                        this.deg = this.deg + 30;
                        this.prizeImage = require('../assets/images/xx.png');
                        break;
                    case '洗手基金':
                        // 如果执行了转盘
                        if (this.flag) {
                            this.deg = this.deg + 30;
                        }
                        this.deg = this.deg + 330;
                        this.prizeImage = require('../assets/images/xs.png');
                        break;
                    default:
                        break;
                }
                this.rotateDeg = "rotate(" + (this.deg) + "deg)";
                this.isAllowClick = true;
                this.flag = true;

                setTimeout(() => {
                    this.playAudio(this.luckAudio);
                    this.prizeShow = true;
                }, 3600);
            }
        },
        backHandle() {
            this.$router.push('/index');
        },
    },
}
</script>

<style lang="scss">
.reward-wrapper {
    padding: 2rem 0;

    .bg {
        background: url('../assets/images/bg2.jpeg');
        height: 100vh;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: top center;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -1;
    }

    .title {
        margin-top: 2rem;
        font-size: 1.8rem;
        text-align: center;
        font-family: fontstyle1;
        color: #972D23;
        letter-spacing: 1px;

        span {
            font-size: 3rem;
        }

        p {
            margin: 0.5rem 0;
            font-size: 2.4rem;
        }
    }

    .lucky {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        text-align: center;
    }

    .turntable {
        width: 80%;
        transition: transform 3s linear;
    }

    .pointer {
        width: 20%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }

    .dialog-wrap {
        height: 100%;
        flex-direction: column;

        .content {
            width: 78%;
            min-height: 15rem;
            padding: 4rem 2rem;
            background-color: #fff;
            text-align: center;
            border-radius: 4px;
            color: #E6D9C6;
            background: url('../assets/images/popup1.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            font-family: fontstyle1;

            img {
                width: 70%;
            }
        }

        .dialog-close {
            font-size: 5rem;
            margin-top: 1.5rem;
            color: #962E21;
            position: relative;

            &::after {
                content: "";
                position: absolute;
                top: 1.3rem;
                left: 1.3rem;
                z-index: -1;
                width: 2.5rem;
                height: 2.5rem;
                background-color: #fff;
            }
        }
    }

    .bottom-back {
        position: absolute;
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 1;
    }
}
</style>

<template>
    <div>
        <div class="index-wrapper" v-show="showPage">
            <div class="visit">
                <a v-if="luckNum > 0" href="javascript:;" class="link answer" @click="toAnswer">
                    <span style="padding-left: 1rem;">进入答题</span>
                </a>

                <a v-else href="javascript:;" class="link answer" @click="getShareGains">
                    <span>分享赢答题机会</span>
                    <!-- <van-icon name="plus" size="2rem" class="add-num" /> -->
                </a>

                <div>
                    <a href="javascript:;" class="link rule" @click="rulesShow = true"></a>
                    <a href="javascript:;" class="link prize" @click="prizeHandle"></a>
                </div>

                <div v-if="luckNum > 0" class="answer-num">今日剩余{{luckNum}}次答题机会</div>
            </div>

            <!-- 互动规则 -->
            <van-overlay :show="rulesShow">
                <div class="dialog-wrap flex-center">
                    <div class="content rules-wrap popup2">
                        <h2>互动规则</h2>
                        <div class="rules-info">
                            <p>1、本次活动仅限GTMC员工参与；</p>
                            <p>2、每人每天有2次答题机会，分享朋友圈可额外获得1次机会，每天上限3次；</p>
                            <p>3、每次答题需要回答8道题，全部答对后可以参与抽奖； </p>
                            <p>4、为避免接触，防疫激励金将在活动结束后统一以微信红包形式发放；</p>
                            <p>5、活动时间：2020年2月17~23日；</p>
                            <p>*解释权归GTMCfamily所有</p>
                        </div>
                        <a href="javascript:;" class="link to-answer" @click="toAnswer"></a>
                    </div>
                    <van-icon name="clear" class="dialog-close" @click="rulesShow = false" />
                </div>
            </van-overlay>

            <!-- 奖品 -->
            <div class="van-overlay" v-show="prizeShow">
                <div class="dialog-wrap flex-center">
                    <div class="content" :class="(myPrize.data && myPrize.data.length == 0) ? 'popup2' : ''">
                        <h2>我的奖品</h2>
                        <div v-if="myPrize.data && myPrize.data.length > 0">
                            <div class="money">总奖金：{{myPrize.total}}元</div> 
                            <div class="product-show">
                                <van-row type="flex" justify="space-between" align="center"
                                    v-for="(item, index) in myPrize.data" :key="index">
                                    <van-col>
                                        <van-image width="6rem" height="6rem" fit="cover" 
                                            :src="imageUrl + item.image"/>
                                        <span>{{item.name}}</span>
                                    </van-col>
                                    <van-col>
                                        {{item.price}}元
                                    </van-col>
                                </van-row>
                            </div>
                        </div>
                        <div v-else class="not-prize">
                            暂未获得奖品<br />
                            快去答题吧
                        </div>
                    </div>
                    <van-icon name="clear" class="dialog-close" @click="prizeShow = false" />
                </div>
            </div>
        </div>
        <Loading />
    </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
    data() {
        return {
            showPage: false,
            rulesShow: false,
            prizeShow: false,
            luckNum: 0,
            imageUrl: this.$fileUrl,
            myPrize: {
                data: [],
                total: 0
            }
        }
    },
    created() {
        this.$eventHub.$emit('loading', true);
        setTimeout(() => {
            this.$eventHub.$emit('loading', false);
            this.$store.dispatch('saveUser', true);
            this.showPage = true;
        }, 3000);
        this.getLuckNum();
    },
    methods: {
        // async initWelcome() {
        //     return this.$request.get(this.$host + 'welcome').then((res) => {
        //         return res.data;
        //     })
        // },
        // async getLuckNum() {
        //     let result = await this.initWelcome();
        //     if (result) {
        //         this.$request.get(this.$host + 'getLuckDrawNum').then((res) => {
        //             this.luckNum = res.data;
        //             // if (res.data > 0) {
        //             //     this.$router.push('/answer');
        //             // } else {
        //             //     this.$toast.fail('您今日的答题机会已达到上限');
        //             // }
        //         }).catch((error) => {
        //             console.log(error);
        //         });
        //     }
        // },
        getLuckNum() {
            // this.$eventHub.$emit('loading', false);
            this.$request.get(this.$host + 'getLuckDrawNum').then((res) => {
                this.luckNum = res.data;
            }).catch((error) => {
                console.log(error);
            });
        },
        prizeHandle() {
            this.prizeShow = true;
            this.$request.get(this.$host + 'myPrize').then((res) => {
                if(res.data) {
                    this.myPrize = res.data;
                }
            }).catch((error) => {
                console.log(error);
            });
        },
        // 分享
        sharePage() {
            return new Promise((resolve, reject) => {
                let url = 'http://gfwp.gac-toyota.com.cn/GTMCfamily/index.php/campaign/api2/getjssdk?url=' + window.location.href;
                this.$request.get(url).then((res) => {
                    if (res.status == 100) {
                        this.$toast('请点击右上角去分享');

                        wx.config({
                            debug: false,
                            appId: res.appId,
                            timestamp: res.timeStamp, 
                            nonceStr: res.nonceStr,
                            signature: res.signature,
                            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] 
                        });　

                        wx.ready(() => {
                            let shareInfo = {
                                title: 'G司返岗小测试',
                                desc: '抵抗疫情, 我们都是第一责任人',
                                // dataUrl: '',
                                // type: 'link',
                                imgUrl: 'http://gfwp.gac-toyota.com.cn/GTMCfamily/camp/demo/img/share.jpg',
                                link: location.href.split('#')[0]
                            };

                            console.log(shareInfo);

                            // 分享到朋友圈
                            wx.onMenuShareTimeline({
                                title: shareInfo.title,
                                link: shareInfo.link,
                                imgUrl: shareInfo.imgUrl,
                                success: ()=> { 
                                    resolve(100);
                                },
                                cancel: ()=> { 
                                    console.log('分享失败')
                                }
                            });
                            // 分享给朋友
                            wx.onMenuShareAppMessage({
                                title: shareInfo.title,
                                link: shareInfo.link,
                                imgUrl: shareInfo.imgUrl,
                                desc: shareInfo.desc,
                                success: ()=> { 
                                    resolve(100);
                                },
                                cancel: ()=> { 
                                    console.log('分享失败')
                                }
                            });
                        }); 
                    } else {
                        this.$toast.fail('服务器繁忙，请稍后再试');
                    }
                }).catch((error) => {
                        reject(error);
                });
            })
        },
        // 获取分享机会
        async getShareGains() {
            let result = await this.sharePage();
            if(result == 100) {
                this.$request.get(this.$host + 'shareGains').then((res) => {
                    console.log(res);
                })
            }
        },
        toAnswer() {
            if (this.luckNum > 0) {
                this.$request.get(this.$host + 'beginAnswer').then((res) => {
                    this.$router.push('/answer');
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                this.$toast.fail('请分享赢得更多答题机会');
            }
        }
    },
}
</script>

<style lang="scss">
.index-wrapper {
    background: url('../assets/images/indexBg.jpeg');
    height: 100vh;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: top center;
    position: relative;
    .visit {
        position: absolute;
        top: 72%;
        width: 100%;
        text-align: center;
        z-index: 1;

        .answer {
            width: 18rem;
            height: 6.3rem;
            background-image: url('../assets/images/answer.png');
            font-family: fontstyle1;
            color: #E6CCB5;
            font-size: 2rem;
            display: flex;
            margin: 0 auto;
            justify-content: center;
            align-items: center;

            i {
                font-size: 1.4rem;
            }

            .add-num {
                font-weight: bold;
                margin-left: 0.5rem;
            }
        }

        .rule {
            width: 8.7rem;
            height: 4rem;
            background-image: url('../assets/images/rule.png');
        }
        .prize {
            margin-left: 0.6rem;
            width: 8.7rem;
            height: 4rem;
            background-image: url('../assets/images/prize.png');
        }
    }

    .answer-num {
        font-size: 1.4rem;
        font-family: fontstyle1;
        color: #962e21;
        width: 18rem;
        text-align: right;
        margin: 0 auto;
    }

    .to-answer {
        margin-top: 2rem;
        width: 20rem;
        height: 6.8rem;
        background-image: url('../assets/images/to_answer.png');
    }

    .dialog-wrap {
        height: 100%;
        flex-direction: column;

        .content {
            width: 80%;
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

            h2 {
                font-size: 2.5rem;
                text-align: center;
                line-height: 1;
                margin-bottom: 3.5rem;
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

    .money {
        text-align: left;
        font-size: 2rem;
    }

    .product-show {
        height: 30rem;
        margin: 2rem 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        font-size: 1.6rem;
        color: #852619;
        font-family: fontstyle1;

        .van-row {
            padding: 0.5rem 1.2rem 0.5rem 0.5rem;
            margin-bottom: 1.5rem;
            background-color: #E6D9C6;
            .van-image {
                vertical-align: middle;
                margin-right: 2.5rem;
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .rules-wrap {
        h2 {
            margin-top: 1rem;
        }
        .rules-info {
            text-align: left;
            position: relative;
            p {
                margin: 1rem 0;
                line-height: 1.6;
                font-size: 1.4rem;
                font-family: 'Avenir,Helvetica,Arial,sans-serif';
            }

            &::before{
                content: "";
                position: absolute;
                top: -8.3rem;
                left: 6rem;
                z-index: 1;
                width: 6rem;
                height: 7rem;
                background: url('../assets/images/icon_rule.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
        }
    }

    .popup2 {
        background-image: url('../assets/images/popup2.png')!important;
    }

    .not-prize {
        padding: 25rem 0 3rem 0;
        background: url('../assets/images/icon_empty.png');
        background-size: 60%;
        background-repeat: no-repeat;
        background-position: center 6rem;
        font-size: 2rem;
        line-height: 1.6;
    }

}
</style>
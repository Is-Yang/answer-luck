<template>
    <div class="answer-wrapper">
        <div class="question" v-if="questionList.length > 0 && questionList[current]">
            <p class="title">{{current + 1}}.{{questionList[current].title}}</p>
            <ol class="options">
                <li v-for="(option, index) in questionList[current].options" 
                    :key="index" 
                    @click="selectOption(option.value, questionList[current].id)"
                    :class="{'error': errorValue == option.value, 'correct': correctValue == option.value }">
                        <i>{{option.value}}</i>
                        <span>
                            {{option.label}}
                        </span>
                </li>
            </ol>
        </div>

        <div class="text-center" v-if="questionList.length > 0">
            <a :class="{'no': !correctValue}" 
                href="javascript:;" class="link next" 
                @click="nextHandle">
                    下一题
            </a>
        </div>

        <!-- 失败 -->
        <van-overlay :show="failShow">
            <div class="dialog-wrap flex-center">
                <div class="content">
                    <p>恭喜你答对了{{qNum}}题!</p>
                    <p>还要继续努力</p>
                    <p>答对全部题目才能参与抽奖</p>
                    <a href="javascript:;" class="link again" @click="aginHandle"></a>
                    <a href="javascript:;" class="link back" @click="backHandle"></a>
                </div>
            </div>
        </van-overlay>

        <!-- 成功 -->
        <van-overlay :show="successShow">
            <div class="dialog-wrap flex-center">
                <div class="content">
                    <p>恭喜你答对了{{qNum}}题!</p>
                    <p>成为防疫新卫士</p>
                    <a href="javascript:;" class="link draw" @click="drawHandle"></a>
                </div>
            </div>
        </van-overlay>

        <div class="bg"></div>
    </div>
</template>

<script>
import qs from 'qs'
export default {
    inject: ['reload'],
    data() {
        return {
            isClick: true,  // 题目是否可以点击
            successShow: false,
            failShow: false,
            current: 0, // 当前题
            correctValue: '',  // 正确答案
            errorValue: '',  // 错误答案
            // 问题列表
            questionList: [
                {
                    value: 'A',
                    options: ['a', '2']
                }, {
                    value: 'B'
                }
            ],
            // 用户选择的答案
            answerArr: [],
            qNum: 0 ,// 题目数量
            errorAudio: 'media/error.mp3',
            correctAudio: 'media/correct.mp3',
        }
    },
    created() {
        this.queryData();
    },
    methods: {
        queryData() {
            this.$request.get(this.$host + 'getQuestions').then((res) => {
                if (res.data) {
                    this.questionList = res.data;
                }
            }).catch((error) => {
                console.log(error);
            });
        },
        // 选中选项
        selectOption(value, id) {
            if(!this.isClick) return;
            this.isClick = false;
            let answer = this.questionList[this.current].answer;
            if (value == answer) {
                this.playAudio(this.correctAudio, true);
                this.errorValue = '';
                this.correctValue = answer;
            } else {
                this.playAudio(this.errorAudio, true);
                this.correctValue = answer;
                this.errorValue = value;
            }
            this.$forceUpdate();

            this.answerArr[this.current] = {
                id,
                value
            }
        },
        // 开始答题
        beginAnswer() {
            this.$request.get(this.$host + 'beginAnswer').then((res) => {
                this.reload();
            }).catch((error) => {
                console.log(error);
            });
        },
        // 获取答题机会
        aginHandle() {
            this.$request.get(this.$host + 'getLuckDrawNum').then((res) => {
                if(res.data) {
                    const { num, shared } = res.data;
                    if (num > 0) {
                        this.beginAnswer();
                    } else {
                        if (shared == 0) {
                            this.$toast.fail('请分享赢得更多答题机会');
                        } else {
                            this.$toast.fail('今天答题次数已用完');
                        }
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        },
        backHandle() {
            this.$router.push('/index');
        },
        drawHandle() {
            this.$router.push('/reward');
        },
        // 下一题
        nextHandle() {
            this.isClick = true;
            this.correctValue = '';
            this.errorValue = '';

            if (this.current < this.questionList.length - 1) {
                this.current += 1;
            } else {
                this.completeHandle();
            }
        },
        // 完成
        completeHandle() {
            // 如果答案全部正确，则抽奖
            this.answerArr.forEach((item, index) => {
                if(item.value == this.questionList[index].answer) {
                    this.qNum++;
                }
            });
            if (this.qNum == this.questionList.length) {
                this.successShow = true;
            } else {
                this.failShow = true;
            }

            this.submitAnswer();
        },
        // 提交答案
        submitAnswer() {
            let params = {
                jsonData: JSON.stringify(this.answerArr)
            }
            this.$request.post(
                this.$host + 'completeAnswer', 
                qs.stringify(params)
            ).then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error);
            });
        }
    },
}
</script>

<style lang="scss">
.answer-wrapper{
    padding: 3.5rem;
    font-size: 1.5rem;

    .bg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -1;
        background: url('../assets/images/bg.jpeg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: top center;
    }

    .question {
        margin-bottom: 5rem;

        .title {
            font-family: fontstyle1;
            font-size: 1.8rem;
            line-height: 1.6;
            color: #152147;
            margin: 2rem 0 5rem;
            letter-spacing: 1px;
        }

        .options {
            li {
                height: 6.5rem;
                padding: 0 5rem 0 7rem;
                margin-bottom: 1.5rem;
                border: 2px solid #152147;
                display: flex;
                align-items: center;
                border-radius: 2rem;
                position: relative;

                >i{
                    position: absolute;
                    top: -2px;
                    bottom: -2px;
                    left: -2px;
                    width: 5.4rem;
                    z-index: 1;
                    line-height: 7rem;
                    background-color: #7E7C7B;
                    border-top-left-radius: 2rem;
                    border-bottom-left-radius: 2rem;
                    text-align: center;
                    color: #E5DBC7;
                    font-size: 2.6rem;
                    font-weight: bold;
                }

                span {
                    flex: 1;
                    color: #152147;
                    font-weight: 500;
                    font-size: 1.6rem;
                    line-height: 1.2;
                    letter-spacing: 1px;
                }

                &.correct {
                    >i{
                        background-color: #152147;
                    }

                    &::after {
                        position: absolute;
                        right: 1rem;
                        content: "\F0C8";
                        font: normal normal normal 4rem/1 "vant-icon";
                        color: #152147;
                    }
                }

                &.error {
                    >i{
                        background-color: #972D23;
                    }

                    &::after {
                        position: absolute;
                        right: 1rem;
                        content: "\F042";
                        font: normal normal normal 4rem/1 "vant-icon";
                        color: #94301F;
                    }
                }
            }
        }
    }

    .next {
        width: 18rem;
        height: 6.3rem;
        line-height: 6.3rem;
        background-image: url('../assets/images/answer.png');
        font-family: fontstyle1;
        color: #E6CCB5;
        font-size: 2.4rem;

        &.no {
            opacity: 0.5;
            pointer-events: none;
        }
    }

    .again {
        width: 17.5rem;
        height: 5rem;
        background-image: url('../assets/images/again.png');
        margin: 1.5rem 0 0.6rem;
    }
    .draw {
        margin-top: 1.5rem;
        width: 17.5rem;
        height: 5rem;
        background-image: url('../assets/images/draw.png');
    }

    .dialog-wrap {
        height: 100%;

        .content {
            width: 80%;
            min-height: 15rem;
            padding: 2rem;
            background: url('../assets/images/popup.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            text-align: center;
            border-radius: 4px;
            font-family: fontstyle1;
            box-sizing: border-box;

            p {
                margin: 1rem 0;
                font-size: 2rem;
                color: #fff;
            }
        }
    }
}
</style>
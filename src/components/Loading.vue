<template>
    <div class="loading-wraper" v-if="loading">
        <div class="loader">
            <i class="before"></i>
            <i class="after"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    data() {
        return {
            loading: true
        }
    },
    created() {
        this.$eventHub.$on('loading', (data)=> {
            this.loading = !!data;
        })
    },
    beforeDestroy () {
        this.$eventHub.$off('loading');
    }
}
</script>

<style lang="scss">
.loading-wraper {
    position: fixed;
    width: 100%;
    max-width: 750px;
    top: 50%;
    bottom: 50%;
    transform: translateY(-50%);
    z-index: 11;
    text-align: center;

    .loader {
        display: inline-block;
        position: relative;
        width: 3rem;
        font-size: 2rem;
        height: 1rem;

        &>i {
            content: "";
            display: block;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            position: absolute;
            z-index: 9;
        }

        .before {
            animation: loadingB 1s ease-in-out infinite;
            background: #ed174c;
        }

        .after {
            animation: loadingA 1s ease-in-out infinite;
            background: #38539a;
        }
    }

    @keyframes loadingB {
        0% {
            left: 0;
            z-index: 0
        }

        50% {
            left: 100%;
            z-index: 1
        }

        100% {
            left: 0;
            z-index: 0
        }
    }

    @keyframes loadingA {
        0% {
            left: 100%;
            z-index: 1
        }

        50% {
            left: 0;
            z-index: 0
        }

        100% {
            left: 100%;
            z-index: 1
        }
    }
}
</style>
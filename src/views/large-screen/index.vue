<template>
  <div>
    <el-form
      v-loading="loading"
      v-loading.fullscreen.lock="true"
      :rows="1"
      element-loading-text="Loading......"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    />
  </div>
</template>

<script>
export default {
  name: 'LargeScreen',
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.$router.go(-1)
    window.open("http://25.11.5.1/#/aj/kZMtOzJc", "_black")

    // window.location.replace("http://25.11.5.1/#/aj/kZMtOzJc")
    // window.location.replace("https://www.baidu.com/")
  },

  beforeDestroy() {
    this.loading = false
  },
}
</script>

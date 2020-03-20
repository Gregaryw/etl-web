<template>
  <div class="container">
    <div class="title">{{title}}</div>
    <div class="main">
      <div class="bg-block">
        <img class="bg-img" src="../../assets/images/login/bg.jpg" />
      </div>
    </div>
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入帐号"
            name="username"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="passwordType"
            v-model="loginForm.password"
            placeholder="请输入密码"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          round
          type="primary"
          size="medium"
          style="width:100%;margin-bottom:20px;"
          @click.native.prevent="handleLogin"
        >登陆</el-button>
      </el-form>
    </div>
    <div class="footer">© 2020 - 广州东方电科</div>
  </div>
</template>

<script type="text/ecmascript-6">
// import { isvalidUsername } from '@/utils/validate'
import LangSelect from "@/components/LangSelect";
import SocialSign from "./socialsignin";

export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      title: "东方电科数据采集系统",
      imageCode: "",
      deviceId: "",
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      },
      // bgImagePath:require('./assets/images/login/bg.jpg'),
      loginForm: {
        username: "",
        password: "",
        captchaCode: "",
        client_id: "520AiZhiJiaWap",
        client_secret: "520",
        scope: "fenxiao",
        grant_type: "password",
        sys: "2",
        code: null,
        accessToken: null,
        signState: false
      },
      // loginRules: {
      //   username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      //   password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      // },
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      let loginName = this.loginForm.username;
      let loginPwd = this.loginForm.password;
      let client_id = this.loginForm.client_id;
      let scope = this.loginForm.scope;
      let client_secret = this.loginForm.client_secret;
      let grant_type = this.loginForm.grant_type;
      let sys = this.loginForm.sys;
      /*  this.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            //'deviceId': this.deviceId
          },
          url: '/login',
          // auth: {
          //   username: 'paascloud-client-uac',
          //   password: 'paascloudClientSecret'
          // },
          data:{
            username: loginName,
            password: loginPwd,
            client_id:client_id,
            scope:scope,
            client_secret:client_secret,
            grant_type:grant_type,
            sys:sys
          },
          transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]

        }).then((res) => {
          //this.getImage();
          if (res.data.access_token) {
            //this.$store.dispatch('update_auth_token', res.result);
            //window.location.href = 'this.redirect';
            // this.$cookie.set('accessToken', this.accessToken, 30)
             this.loading = true
             this.loginForm.accessToken = res.data.access_token
             this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              }).catch(() => {
                this.loading = false
              })
          }
        }).catch((err) => {
          console.log(err);
        }); */

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          //  this.$cookie.set('accessToken', "asdfdsafsad", 30)
           this.loginForm.accessToken = "asdfdsafsad";
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #a9a9a9;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #a9a9a9;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.container {
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-flex: 1;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
}

.title {
  position: fixed;
  top: 15%;
  left: 10%;
  font-family: FZZYJW;
  font-size: 39px;
  color: #3c92ff;
}
.bg-block {
  width: 100%;
  height: 560px !important;
}

.bg-img {
  width: 100%;
  height: 100%;
}

.login-container {
  width: 25%;
  height: 52%;
  position: fixed;
  right: 18%;
  z-index: 99999999;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}

.footer {
  text-align: center;
  font-size: 14px;
}
</style>

<template>
  <!--    用户信息，包含：头像、粉丝数据、关注按钮、用户名、简介-->
  <div class = "info">
    <div class = "top">
      <!--      <div class = "avatar">-->
      <!--        <img src = "@/assets/img/cat.jpeg" alt = "avatar">-->
      <!--      </div>-->
      <a-avatar class = "avatar" :size = "88" icon = "user" :src = "avatarImg"/>
      <!--      <div class="invisible"></div>-->
      <div class = "right">
        <div class = "data">
          <div class = "fans">
            <span class = "title">粉丝</span>
            <span class = "data">{{ fans }}</span>
          </div>
          <div class = "follow">
            <span class = "title">关注</span>
            <span class = "data">{{ follow }}</span>
          </div>
          <div class = "likes">
            <span class = "title">获赞</span>
            <span class = "data">{{ likes }}</span>
          </div>
        </div>
        <CusButton
            id = "follow"
            class = "button"
            @click = "onFollow()"
            :style = "{ backgroundColor: followColor }"
        >{{ followed ? "已关注" : "关注" }}
        </CusButton>
      </div>
    </div>
    <div class = "detail">
      <div class = "name">{{ name }}</div>
      <div class = "desc">{{ desc }}</div>
    </div>
  </div>
</template>

<script setup lang = "ts">
import {ref} from "vue";
import avatarImg from "@/assets/img/cat.jpeg";
import colors from "@/assets/variables.module.scss";

const props = defineProps<{
  avatar: string;
  fans: number;
  follow: number;
  likes: number;
  name: string;
  desc: string;
  followed: boolean;
}>();

let followColor = ref(props.followed ? colors.colorSuccess : colors.colorPrimary);
let followed = ref(props.followed);
let fans = ref(props.fans);

// 点击关注
let onFollow = (): void => {
  followed.value = !followed.value;
  followColor.value = followed.value ? colors.colorSuccess : colors.colorPrimary;
  if (followed.value) {
    fans.value++;
    console.log("关注成功" + fans.value);
  } else {
    fans.value--;
    console.log("取消关注" + fans.value);
  }
};
</script>

<style scoped lang = "scss">
@import 'main';

.info {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: auto;
  z-index: 0;
  background-color: #fff;
  border-bottom: rgba(0, 0, 0, 0.2) 1px solid;
  
  .top {
    z-index: 1;
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    box-shadow: white 0 0 0.5rem 0;
    position: relative;
    
    .avatar {
      width: 5.5rem;
      height: 5.5rem;
      border-radius: 50%;
      box-shadow: white 0 0 0.5rem 0;
      overflow: hidden;
      margin: 1rem;
      top: -2rem;
      position: relative;
      
      img {
        width: 5.5rem;
        height: 5.5rem;
        object-fit: cover;
      }
    }
    
    .invisible {
      z-index: -1;
      width: 5.5rem;
      height: 5.5rem;
      border-radius: 50%;
      background-color: #fff;
      margin: 1rem;
      top: -2rem;
      position: relative;
      box-shadow: white 0 -0.2rem 0.2rem;
    }
    
    .right {
      width: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .data {
        display: flex;
        flex: 1;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 0.2rem;
        
        .fans {
          display: flex;
          flex-direction: column;
          margin-right: 1.3rem;
          align-items: center;
        }
        
        .follow {
          display: flex;
          flex-direction: column;
          padding: 0 1.3rem 0 1.3rem;
          align-items: center;
          border-left: rgba(0, 0, 0, 0.2) 1px solid;
          border-right: rgba(0, 0, 0, 0.2) 1px solid;
        }
        
        .likes {
          display: flex;
          flex-direction: column;
          padding-left: 1.3rem;
          align-items: center;
        }
        
        .title {
          font-size: 0.6rem;
          margin-bottom: 0.1rem;
        }
        
        .data {
          font-size: 1.2rem;
        }
      }
      
      .button {
        width: 90%;
        position: relative;
        color: black;
      }
    }
  }
  
  .detail {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin: 0 0 0.8rem 1rem;
    
    .name {
      font-size: 1.3rem;
      font-weight: normal;
      color: $color-makka-500;
      margin-bottom: 1rem;
    }
    
    .desc {
      font-size: 0.8rem;
    }
  }
}
</style>

<template>
  <div class="content-layout">
    <div class="header">
      <div class="back" @click="backPage"></div>
      <div class="title">
        <div class="title-text">直播详情</div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="left">直播标题：</div>
        <div class="right">
          <input type="text" v-model="inputTitle" placeholder="填写你的直播标题" />
        </div>
      </div>
      <div class="cover">
        <div class="left">直播封面：</div>
        <div class="right">
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="fileInput"
            @change="handleFileChange"
          />
          <div class="file-input" @click="handleFileClick">
            <span v-if="!selectedImage" class="plus-icon"></span>
            <img v-else :src="selectedImage" alt="cover" class="selected-image" />
          </div>
        </div>
      </div>
      <div class="bottom-btn">
        <button class="btn" @click="handleSubmit">开始直播</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createRequest } from '@/api/base';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'vue-router';

const inputTitle = ref('');
const fileInput = ref(null);
const selectedImage = ref('');

const userStore = useUserStore();
const router = useRouter();

function backPage() {
  router.back();
}
const handleFileClick = () => {
  fileInput.value.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

async function handleSubmit() {
  try {
    const formData = new FormData();
    formData.append('file', fileInput.value.files?.[0]);
    //upload cover
    const coveres = await createRequest('/upload/cover', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    //wait for use
    const coverUrl = coveres.data.cover_url;
    userStore.coverUrl = coverUrl;
    userStore.title = inputTitle.value;
    await router.replace('/broadcast/BroadcastPage?coverUrl=' + coverUrl);
  } catch (e) {
    console.error(e);
  }
}
</script>

<style scoped lang="scss">
.content-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 44px;
    background-color: #ec5708;
    .back {
      width: 36px;
      height: 36px;
      background: url('../../assets/back_arrow.ico') no-repeat center center;
    }
    .title {
      flex: 1;
      padding-left: 8px;
      display: flex;
      align-items: center;
      .title-text {
        font-size: 18px;
        font-weight: bold;
        color: white;
      }
    }
  }
  .content {
    flex: 1;
    padding: 20px;
    .title {
      display: flex;
      margin-bottom: 20px;
      .left {
        width: 100px;
        text-align: right;
        line-height: 32px;
        color: #ec5708;
      }
      .right {
        flex: 1;
        input {
          width: 100%;
          height: 32px;
          padding: 0 10px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
      }
    }
    .cover {
      display: flex;
      .left {
        width: 100px;
        text-align: right;
        line-height: 32px;
        color: #ec5708;
      }
      .right {
        flex: 1;
        .file-input {
          width: 100%;
          height: auto;
          min-height: 200px;
          border: 1px dashed #f0f0f0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          .plus-icon {
            width: 40px;
            height: 40px;
            background: url('../../assets/add.ico') no-repeat center center;
          }
          .selected-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
  .bottom-btn {
    display: flex;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    .btn {
      width: 100%;
      background-color: #ec5708;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 20px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn:hover {
      background-color: #ff5900;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
```

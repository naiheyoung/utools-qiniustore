<template>
  <div class="wfull h80% mxauto rounded-b flex flex-col px-4">
    <div class="tools_nav py1 text-right">
      <div
        class="global_info float-left pl2 w80% truncate text-left"
        :class="isSuccess ? 'text-green-500' : 'text-red-500'">
        {{ getErrorInfo() || getSuccessInfo() }}
      </div>
      <i class="bx bx-loader-alt bx-spin" style="color: #4f46e5" v-if="uploading"></i>
      <div icon-btn i-carbon:cloud-upload text-xl @click="uploadHandler" v-else></div>
      <div ml-2 i-carbon:settings icon-btn text-xl @click="settingHandler()"></div>
    </div>
    <div class="active_area w-full flex-1 border border-dashed border-gray text-gray-300">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import CowStore from '~/components/CowStore.vue'
import CowStoreSetting from '~/components/CowStoreSetting.vue'
import { UploadResult } from '~/composables/useAPI'

let currentComponent = $shallowRef<Component>(CowStore)

const { getFiles, removeFile } = useUploadFiles()
const { setSuccessInfo, setErrorInfo, getErrorInfo, getSuccessInfo } = useOther()
let isSuccess = $ref<boolean>(false)
let uploading = $ref<boolean>(false)
let uploadTasks: Promise<UploadResult>[] = []

const settingHandler = () => {
  currentComponent === CowStoreSetting
    ? (currentComponent = CowStore)
    : (currentComponent = CowStoreSetting)
}

const uploadHandler = async () => {
  // todo: upload to qiniuStore
  const files = getFiles()
  if (files.length <= 0) {
    setErrorInfo('Please select the file to upload.')
    return
  }
  // begin
  uploading = true
  uploadTasks = files.map(file => upload(file.instance))
  const results = await Promise.all(uploadTasks)
  uploading = false
  results.forEach(r => {
    if (r.code !== 200) {
      isSuccess = false
      setErrorInfo(r.m)
      return
    } else {
      isSuccess = true
      setSuccessInfo(r.link!)
      removeFile(r.m)
    }
  })
}
</script>

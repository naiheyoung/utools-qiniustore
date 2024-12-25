<template>
  <div
    class="cow_store wfull hfull flex"
    @dragover.prevent
    @drop.prevent="dropHandler($event)">
    <div
      class="placeholder opacity80 text-gray-300 m-auto select-none pointer-events-none font-chewy text-2xl">
      Drag here to upload
    </div>
  </div>
  <div class="upload_list mt-2">
    <ul v-if="getFiles().length > 0">
      <li v-for="item in getFiles()" class="flex mb-2 leading-15">
        <div class="item_preview overflow-hidden w15 h15">
          <img :src="item.base64" class="wfull hfull object-fill" />
        </div>
        <span class="ml4 w-1/3 truncate">{{ item.name }}</span>
        <span class="mxauto">{{ item.type }}</span>
        <span class="mxauto">{{ item.size }}MB</span>
        <span
          icon-btn
          i-carbon:close
          class="my-auto text-xl"
          @click="removeFile(item.name)"></span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { getFiles, addFile, removeFile } = useUploadFiles()

const dropHandler = (evt: DragEvent) => {
  let files = Array.from(evt.dataTransfer?.files as FileList)
  files.forEach((file) => {
    let fr: FileReader | null = new FileReader()
    fr.onload = (event) => {
      addFile({
        name: file.name,
        type: file.type,
        size: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        base64: event.target?.result as string,
        instance: file
      })
      fr = null
    }
    fr.readAsDataURL(file)
  })
}
</script>

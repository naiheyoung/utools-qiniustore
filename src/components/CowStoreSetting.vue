<template>
  <div class="wfull hfull flex flex-col px-8">
    <div text-2xl>Upload Config</div>
    <div mt4>
      <label for="accessKey" inline-block w22 text-right mr4>AccessKey</label>
      <input
        type="text"
        name="accessKey"
        id="accessKey"
        autocomplete="off"
        outline-none
        border-none
        bg-transparent
        b-b-1
        b-b-dashed
        indent-xs
        class="w80% transition-all duration-250"
        :disabled="!isEdit"
        :class="isEdit ? 'opacity100' : 'opacity50'"
        placeholder="Please enter your accessKey."
        v-model="config.accessKey" />
    </div>
    <div mt6>
      <label for="secretKey" inline-block w22 text-right mr4>SecretKey</label>
      <input
        type="text"
        name="secretKey"
        id="secretKey"
        autocomplete="off"
        outline-none
        border-none
        bg-transparent
        b-b-1
        b-b-dashed
        indent-xs
        class="w80% transition-all duration-250"
        :disabled="!isEdit"
        :class="isEdit ? 'opacity100' : 'opacity50'"
        placeholder="Please enter your secretKey."
        v-model="config.secretKey" />
    </div>
    <div mt6>
      <label for="bucket" inline-block w22 text-right mr4>Bucket</label>
      <select
        name="bucket"
        id="bucket"
        outline-none
        border-none
        bg-transparent
        b-b-1
        b-b-dashed
        indent-xs
        class="w80% transition-all duration-250"
        :disabled="!isEdit"
        :class="isEdit ? 'opacity100' : 'opacity50'"
        v-model="config.bucket">
        <option value="" disabled>select your bucket</option>
        <option :value="b" v-for="b in getBuckets()" :key="b">{{ b }}</option>
      </select>
    </div>
    <div mt6>
      <label for="dir" inline-block w22 text-right mr4>Dir</label>
      <input
        type="text"
        name="dir"
        id="dir"
        autocomplete="off"
        outline-none
        border-none
        bg-transparent
        b-b-1
        b-b-dashed
        indent-xs
        class="w80% transition-all duration-250"
        :disabled="!isEdit"
        :class="isEdit ? 'opacity100' : 'opacity50'"
        placeholder="relative to bucket. /<bucket>/<dir>, if it does not exist, it will be created."
        v-model="config.dir" />
    </div>
    <div mt6>
      <label for="beian" inline-block w22 text-right mr4>HTTP(S)</label>
      <Switch
        id="beian"
        v-model="config.beian"
        tabindex="-1"
        class="bg-gray-800 transform-translate-y-5px relative inline-flex h28px w56px shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        :class="config.beian ? 'bg-[rgba(79,70,229,.65)]!' : 'bg-gray-800'">
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="config.beian ? 'translate-x-7.8' : 'translate-x-0'"
          class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-[rgb(79,70,229)] shadow-lg ring-0 transition duration-200 ease-in-out" />
      </Switch>
      <span ml4 text-gray opacity80>(域 名 是 否 备 案)</span>
    </div>
    <div mt6>
      <label for="tinifyKey" inline-block w22 text-right mr4>TinifyKey</label>
      <input
        type="text"
        name="tinifyKey"
        id="tinifyKey"
        autocomplete="off"
        outline-none
        border-none
        bg-transparent
        b-b-1
        b-b-dashed
        indent-xs
        class="w80% transition-all duration-250"
        :disabled="!isEdit"
        :class="isEdit ? 'opacity100' : 'opacity50'"
        placeholder="如果有就填(请查看自己的额度是否足够, 超额导致的付费概不负责.)"
        v-model="config.tinifyKey" />
    </div>
    <div mt-8>
      <div btn mr4 @click="isEdit = !isEdit">Edit</div>
      <div btn mr4 @click="saveConfig">Save</div>
      <div
        btn
        @click="refresh"
        :class="!allowRefresh ? ['opacity60', 'pointer-events-none', ''] : ''">
        RefreshBuckets
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { refreshBuckets } from '~/composables/useAPI'
import { Switch } from '@headlessui/vue'
const {
  setAccessKey,
  setSecretKey,
  setBucket,
  setDir,
  getAccessKey,
  getSecretKey,
  getBucket,
  getDir,
  getBuckets,
  isBeian,
  setBeian,
  getTinifyKey,
  setTinifyKey
} = useUploadInfo()

let config = $ref({
  accessKey: getAccessKey(),
  secretKey: getSecretKey(),
  bucket: getBucket(),
  dir: getDir(),
  beian: isBeian(),
  tinifyKey: getTinifyKey()
})

let isEdit = $ref(false)
let allowRefresh = $ref(true)

watch(
  () => config.beian,
  v => {
    setBeian(v)
  }
)

const saveConfig = () => {
  // todo: verify
  setAccessKey(config.accessKey)
  setSecretKey(config.secretKey)
  setBucket(config.bucket)
  setDir(config.dir)
  isEdit = false
  setTinifyKey(config.tinifyKey)
}

const refresh = () => {
  if (!allowRefresh) return
  allowRefresh = false
  refreshBuckets()
  useTimeoutFn(() => {
    allowRefresh = true
  }, 3000)
}

onMounted(async () => {
  if (getBuckets().length <= 0) {
    await refreshBuckets()
  }
})
</script>

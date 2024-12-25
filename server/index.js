import qiniu from 'qiniu'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import md5 from 'md5'
import tinify from 'tinify'

const port = 9191
const app = express()

app.use(cors())
app.use(express.json())

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

qiniu.conf.ACCESS_KEY = ''
qiniu.conf.SECRET_KEY = ''
const bucketManager = new qiniu.rs.BucketManager()
const mac = new qiniu.auth.digest.Mac()
const config = new qiniu.conf.Config()
config.regionsProvider = qiniu.httpc.Region.fromRegionId('as0')
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

app.get('/api/buckets', async (from, to) => {
  const res = await bucketManager.listBucket()
  if (res.resp.statusCode === 200) {
    to.setHeader('content-type', 'application/json')
    to.status(200).json(res.data)
  } else {
    to.status(500).end()
  }
})

app.get('/api/bucket/:bucketName', async (from, to) => {
  const bucketName = from.params.bucketName
  if (!bucketName) {
    to.status(500).json('/api/bucket/<bucket_name>')
    return
  }
  try {
    const fileInfo = await bucketManager.listPrefix(bucketName)
    if (fileInfo.resp.statusCode === 200) {
      const fileNames = fileInfo.data.items
        .map(f => f.key)
        .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
        .map(f => '<domain>' + f)
      return to.status(200).json(fileNames)
    } else {
      return to.status(500).json('server is bad.')
    }
  } catch (err) {
    return to.status(500).json(JSON.stringify(err))
  }
})

app.get('/api/bucket-domains', async (from, to) => {
  const { bucket } = from.query
  const res = await bucketManager.listBucketDomains(bucket)
  const domins = res.data.map(d => d.domain)
  to.status(200).json(domins)
})

app.post('/api/upload', upload.single('file'), async (from, to) => {
  const { originalname, buffer, size } = from.file
  const { bucket, beian, dir, type, tinifyKey } = from.body
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    expires: 3600 // one hour
  })
  const uploadToken = putPolicy.uploadToken(mac)
  try {
    const suffix = originalname.split('.').at(-1)
    let key = [md5(buffer), suffix].join('.')
    if (dir) {
      key = `${dir}/${key}`
    }
    let mainBuffer = buffer
    // compress
    try {
      tinify.key = tinifyKey
      await tinify.validate()
      const _size = parseFloat((size / 1024 / 1024).toFixed(2))
      if (tinifyKey && tinify.compressionCount <= 400 && _size < 5) {
        const source = tinify.fromBuffer(buffer)
        const _buffer = await source.toBuffer()
        mainBuffer = Buffer.from(_buffer)
      }
    } catch (err) {
      console.log(err)
      return to.status(500).json('TinifyKey is invalid.')
    }
    const res = await formUploader.put(uploadToken, key, mainBuffer, putExtra)
    if (res.resp.statusCode === 200) {
      // todo: get bucket domains
      const bucketRes = await bucketManager.listBucketDomains(bucket)
      const dominas = bucketRes.data.map(b => b.domain)
      // todo: http or https
      let prefix = ''
      if (beian === 'true') {
        prefix = 'https://'
      } else {
        prefix = 'http://'
      }
      return to.status(200).json({
        link: `${prefix}${dominas[0]}/${res.data.key}`,
        source: originalname
      })
    } else {
      return to.status(500).json(JSON.stringify(res.resp.statusMessage))
    }
  } catch (err) {
    return to.status(500).json(JSON.stringify(err))
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

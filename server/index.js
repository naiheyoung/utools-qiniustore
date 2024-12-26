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

app.get('/api/buckets', async (from, to) => {
  const { accesskey, secretkey } = from.headers
  try {
    const mac = new qiniu.auth.digest.Mac(accesskey, secretkey)
    const bucketManager = new qiniu.rs.BucketManager(mac)
    const res = await bucketManager.listBucket()
    if (res.resp.statusCode === 200) {
      to.setHeader('content-type', 'application/json')
      return to.status(200).json(res.data)
    } else {
      return to.status(500).json(res.resp.statusMessage)
    }
  } catch (err) {
    return to.status(500).json(JSON.stringify(err))
  }
})

app.get('/api/bucket-domains', async (from, to) => {
  const { accesskey, secretkey } = from.headers
  const { bucket } = from.query
  try {
    const mac = new qiniu.auth.digest.Mac(accesskey, secretkey)
    const bucketManager = new qiniu.rs.BucketManager(mac)
    const res = await bucketManager.listBucketDomains(bucket)
    if (res.resp.statusCode !== 200) {
      return to.status(500).json(res.resp.statusMessage)
    }
    const domins = res.data.map(d => d.domain)
    to.status(200).json(domins)
  } catch (err) {
    to.status(500).json(JSON.stringify(err))
  }
})

app.post('/api/upload', upload.single('file'), async (from, to) => {
  const { accesskey, secretkey, tinifykey } = from.headers
  const { originalname, buffer, size } = from.file
  const { bucket, beian, dir, type } = from.body
  const mac = new qiniu.auth.digest.Mac(accesskey, secretkey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    expires: 3600 // one hour
  })
  const bucketManager = new qiniu.rs.BucketManager(mac)
  const config = new qiniu.conf.Config()
  config.regionsProvider = qiniu.httpc.Region.fromRegionId('as0')
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  const uploadToken = putPolicy.uploadToken(mac)
  try {
    const suffix = originalname.split('.').at(-1)
    let key = [md5(buffer), suffix].join('.')
    if (dir) {
      key = `${dir}/${key}`
    }
    let mainBuffer = buffer
    // compress
    tinify.key = tinifykey
    await tinify.validate()
    const _size = parseFloat((size / 1024 / 1024).toFixed(2))
    if (tinifykey && tinify.compressionCount <= 400 && _size < 5) {
      const source = tinify.fromBuffer(buffer)
      const _buffer = await source.toBuffer()
      mainBuffer = Buffer.from(_buffer)
    }
    const res = await formUploader.put(uploadToken, key, mainBuffer, putExtra)
    if (res.resp.statusCode === 200) {
      // todo: get bucket domains
      const bucketRes = await bucketManager.listBucketDomains(bucket)
      const domains = bucketRes.data.map(b => b.domain)
      // todo: http or https
      let prefix = ''
      if (beian === 'true') {
        prefix = 'https://'
      } else {
        prefix = 'http://'
      }
      to.status(200).json({
        link: `${prefix}${domains[0]}/${res.data.key}`,
        source: originalname
      })
    } else {
      to.status(500).json(res.resp.statusMessage)
    }
  } catch (err) {
    if (err instanceof tinify.AccountError) {
      to.status(500).json('TinifyKey is invalid.')
    } else {
      to.status(500).json(err)
    }
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

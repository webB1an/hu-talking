# The Backend Of Auto-Answer

- [express-validator](https://express-validator.github.io/docs/index.html)
- [multer](https://www.npmjs.com/package/multer)
- [postimages](https://postimages.org/)

```js
await airConditionerModel.aggregate([
  { $match: { ...options }},
  { $project: { _id: 0, __v: 0, createTime: 0, updateTime: 0 }},
  { $sort: { price: 1 }},
  { $sample: { size: 3 }}
])
```

<!-- https://www.youtube.com/watch?v=p868I9I7UVM&list=PLcCp4mjO-z9_HmJ5rSonmiEGfP-kyRMlI&index=3 -->

# 通过 sh build.sh 传参数

通过 shell 脚本，截取 prod、数据库密码导入到容器

```bash
sh build.sh prod root123456 admin123456
```

pm2 start pm2.conf.json
# The Backend Of Auto-Answer

- [express-validator](https://express-validator.github.io/docs/index.html)
- [multer](https://www.npmjs.com/package/multer)

```js
await airConditionerModel.aggregate([
  { $match: { ...options }},
  { $project: { _id: 0, __v: 0, createTime: 0, updateTime: 0 }},
  { $sort: { price: 1 }},
  { $sample: { size: 3 }}
])
```
// ✏️ 旅行和美食的内容都在这个文件里，改这里就行，不用碰 HTML。
//
// 加照片的方法：
//   1. 把照片放进 images/travel/ 或 images/food/ 文件夹（建议先压缩到 1600 像素宽以内）
//   2. 在下面对应的列表里加一行，src 写照片路径
//
// 注意：每一项后面要有英文逗号，文字要放在英文引号 "" 里。

// ---------- 旅行 ----------
// lat / lng 是地图上的经纬度（在 Google 地图上右键某个地点就能复制）
// lived: true 表示住过的地方（地图上是实心点），false 表示去旅行过（空心点）
window.SITE_TRAVEL = [
  {
    place: "Manchester", country: "UK", lat: 53.4808, lng: -2.2426, lived: true,
    note: "Where I'm doing my PhD.",
    photos: [
      // { src: "images/travel/manchester-1.jpg", caption: "Description of the photo" },
    ]
  },
  {
    place: "Edinburgh", country: "UK", lat: 55.9533, lng: -3.1883, lived: true,
    note: "Where I did my MSc.",
    photos: [
      { src: "images/travel/sample-1.jpg", caption: "示例照片，换成你自己的" },
      { src: "images/travel/sample-2.jpg", caption: "示例照片，换成你自己的" }
    ]
  },
  {
    place: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, lived: true,
    note: "Where I did my BSc.",
    photos: []
  }
  // 旅行过的地方，例如：
  // ,{ place: "Lake District", country: "UK", lat: 54.4609, lng: -3.0886, lived: false,
  //    note: "A weekend of hiking.", photos: [ { src: "images/travel/lakes-1.jpg", caption: "Catbells" } ] }
];

// ---------- 美食 ----------
window.SITE_FOOD = [
  { src: "images/food/sample-1.jpg", dish: "示例：菜名", where: "Restaurant, City", note: "一句话评价，可以不写" },
  { src: "images/food/sample-2.jpg", dish: "示例：菜名", where: "Home-cooked", note: "" },
  { src: "images/food/sample-3.jpg", dish: "示例：菜名", where: "Restaurant, City", note: "" }
];

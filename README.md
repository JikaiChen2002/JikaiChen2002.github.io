# 个人学术网站

纯静态 HTML，可直接部署到 GitHub Pages，也可以原样复制到任何服务器。

## 文件结构

```
index.html          首页（About + 最近新闻 + 代表论文）
news.html           全部新闻
publications.html   全部论文
learning.html       深度学习资料（PDF 在线阅读、Notebook 在线查看与下载）
travel.html         旅行（地图 + 照片）
food.html           美食
css/style.css       样式（颜色、字体都在文件最上面）
js/main.js          深色模式切换、页脚年份
js/anatomy.js       首页阑尾位置图解的交互
js/life-data.js     ✏️ 旅行地点、旅行照片、美食照片都在这里改
js/gallery.js       生成旅行/美食页面和照片查看器
images/photo.jpg    头像
images/travel/      旅行照片
images/food/        美食照片
resources/deep-learning/  Deep Learning in 100 Hours 的 PDF、Notebook 和 HTML 阅读版
scripts/render-notebooks.mjs  重新生成 Notebook HTML 阅读版
```

## 更新深度学习资料

1. 把新版 PDF 覆盖到 `resources/deep-learning/Deep_Learning_in_100_Hours.pdf`
2. 把新版 Notebook 放进 `resources/deep-learning/notebooks/`
3. 在网站根目录运行 `node scripts/render-notebooks.mjs`
4. 打开 `learning.html` 检查 PDF、在线阅读和下载链接

## 第一步：检查内容

个人信息和照片都已放好，双击 `index.html` 预览。以后要改内容，用 VS Code 打开 HTML 文件搜索 `✏️`，标记处就是常改的地方（新闻、论文、导师链接）。

## 加旅行和美食照片

1. 照片放进 `images/travel/` 或 `images/food/`（手机照片很大，建议先压缩到 1600 像素宽以内）
2. 打开 `js/life-data.js`，照着里面的格式加一行
3. 删掉 `sample-*.jpg` 示例照片和对应的示例条目

## 第二步：上传到 GitHub Pages

1. 登录 GitHub，点右上角 **+ → New repository**
2. 仓库名**必须**填 `JikaiChen2002.github.io`，选 **Public**，点 Create
3. 在新仓库页面点 **uploading an existing file**，把本文件夹里的**所有内容**（不是文件夹本身）拖进去，点 **Commit changes**
4. 进入仓库 **Settings → Pages**，Source 选 **Deploy from a branch**，Branch 选 `main`、文件夹选 `/ (root)`，点 Save
5. 等一两分钟，访问 `https://jikaichen2002.github.io` 就能看到网站

## 以后怎么更新

- 简单修改：在 GitHub 网页上点开文件，点铅笔图标编辑，保存即可
- 熟悉之后：用 GitHub Desktop 或 git 把仓库克隆到本地，改完再推送

## 加新页面

复制 `news.html` 改名（比如 `teaching.html`），改掉中间 `<main>` 里的内容，然后在**每个** HTML 文件的导航 `<nav>` 里加一行链接。

## 以后迁移到自己的服务器

整个文件夹复制到服务器，用 Nginx 或 Caddy 指向它即可，代码不用改（所有链接都是相对路径）。

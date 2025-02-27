const fs = require("fs");
const path = require("path");

function copyFolderSync(src, dist) {
  fs.mkdirSync(dist, { recursive: true }); // 确保目标文件夹存在
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const distPath = path.join(dist, entry.name);

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyFolderSync(srcPath, distPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, distPath);
    }
  }
}

// 修改为复制目录
const srcDir = path.resolve(__dirname, "./src/assets");
const distDir = path.resolve(__dirname, "./dist/assets");

copyFolderSync(srcDir, distDir);

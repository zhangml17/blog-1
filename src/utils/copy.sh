#! /bin/sh
# 查分日志的脚本
# 利用crontab命令执行该脚本即可
# crontab -e 进入编辑模式
# 添加： * 0 * * * sh /Users/meilozhang/Documents/node/BLOG-1/src/utils/copy.sh 
cd /Users/meilozhang/Documents/node/BLOG-1/logs
cp access.log $(date +%Y-%m/-%d).access.log
echo '' > access.log
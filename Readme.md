# nodejs file upload and download sample.

# development

## mongo

```bash
~# mongod --dbpath=d:/nodejs/db --port 27017
~# show dbs
~# use xxx
~# show collections
~# db.collections.drop()
~# db.collections.find()
~# db.collections.deleteMany({})
```

## nginx

> nginx for windows: http://nginx.org/en/docs/windows.html
> download nginx for windows: http://nginx.org/en/download.html

```bash
~# cd c:\
~# unzip nginx-1.13.4.zip
~# cd nginx-1.13.4
~# start nginx

C:\nginx-1.13.4>tasklist /fi "imagename eq nginx.exe"

Image Name           PID Session Name     Session#    Mem Usage
=============== ======== ============== ========== ============
nginx.exe            652 Console                 0      2 780 K
nginx.exe           1332 Console                 0      3 112 K

~# nginx -s stop	fast shutdown
~# nginx -s quit	graceful shutdown
~# nginx -s reload	changing configuration, starting new worker processes with a new configuration, graceful shutdown of old worker processes
~# nginx -s reopen	re-opening log files
```

## git

```bash
~# git init
~# git remote add origin xxxxxx
~# git push -u origin master
```

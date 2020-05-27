# nodejs file upload and download sample.

# development

## mongo

```bash
C:\>mongod --dbpath=d:/nodejs/db --port 27017
C:\>show dbs
C:\>use xxx
C:\>show collections
C:\>db.collections.drop()
C:\>db.collections.find()
C:\>db.collections.deleteMany({})
```

## nginx

> nginx for windows: http://nginx.org/en/docs/windows.html  
> download nginx for windows: http://nginx.org/en/download.html  

```bash
~# cd c:\
C:\> unzip nginx-1.13.4.zip
C:\> cd nginx-1.13.4
C:\nginx-1.13.4> start nginx

C:\nginx-1.13.4>tasklist /fi "imagename eq nginx.exe"

Image Name           PID Session Name     Session#    Mem Usage
=============== ======== ============== ========== ============
nginx.exe            652 Console                 0      2 780 K
nginx.exe           1332 Console                 0      3 112 K

C:\nginx-1.13.4> nginx -s stop	fast shutdown
C:\nginx-1.13.4> nginx -s quit	graceful shutdown
C:\nginx-1.13.4> nginx -s reload	changing configuration, starting new worker processes with a new configuration, graceful shutdown of old worker processes
C:\nginx-1.13.4> nginx -s reopen	re-opening log files
```

## git

```bash
C:\>git init
C:\>git remote add origin xxxxxx
C:\>git push -u origin master
```

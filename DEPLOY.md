# Инструкция по деплою на VPS сервер (Reg.ru)

## Подготовка VPS сервера

### 1. Подключение к серверу

```bash
ssh root@ваш-ip-адрес
# или
ssh root@ваш-домен.ru
```

### 2. Обновление системы

```bash
# Для Ubuntu/Debian
apt update && apt upgrade -y

# Для CentOS/RHEL
yum update -y
```

### 3. Установка необходимого ПО

#### Установка Node.js (версия 18+)

```bash
# Для Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Альтернативный способ через nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

Проверка установки:
```bash
node --version  # должно быть >= 18.0.0
npm --version
```

#### Установка Nginx

```bash
# Ubuntu/Debian
apt install -y nginx

# CentOS/RHEL
yum install -y nginx

# Запуск и автозапуск
systemctl start nginx
systemctl enable nginx
```

#### Установка Git (если нужно клонировать репозиторий)

```bash
# Ubuntu/Debian
apt install -y git

# CentOS/RHEL
yum install -y git
```

## Деплой приложения

### Вариант 1: Клонирование репозитория с Git

```bash
# Создание пользователя для приложения (опционально, но рекомендуется)
adduser appuser
usermod -aG sudo appuser

# Переход в домашнюю директорию
cd /home/appuser

# Клонирование репозитория
git clone https://github.com/ваш-username/ваш-репозиторий.git
cd ваш-репозиторий/landing-page

# Или если проект уже есть локально - загрузить через scp
```

### Вариант 2: Загрузка файлов через SCP (с локальной машины)

```bash
# На локальной машине перейти в директорию проекта
cd /Users/ap/Projects/Farm/landing-page

# Загрузить файлы на сервер
scp -r . root@ваш-ip:/opt/landing-page
# или
scp -r . appuser@ваш-ip:/home/appuser/landing-page
```

### 3. Установка зависимостей и сборка проекта

```bash
# Переход в директорию проекта
cd /opt/landing-page
# или
cd /home/appuser/landing-page

# Установка зависимостей
npm install

# Сборка проекта
npm run build
```

После сборки проект будет в папке `dist/`.

### 4. Настройка Nginx

Создайте конфигурационный файл для вашего сайта:

```bash
nano /etc/nginx/sites-available/landing-page
```

Вставьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;
    
    # Если нет домена, используйте IP:
    # server_name ваш-ip-адрес;

    root /opt/landing-page/dist;
    # или
    # root /home/appuser/landing-page/dist;
    
    index index.html;

    # Сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Кеширование статических файлов
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|mp4|webp|woff|woff2|ttf|otf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Основная конфигурация для SPA
    location / {
        try_files $uri $uri/ /index.html;
        
        # Заголовки безопасности
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # Логи
    access_log /var/log/nginx/landing-page-access.log;
    error_log /var/log/nginx/landing-page-error.log;
}
```

Активируйте конфигурацию:

```bash
# Создание символической ссылки
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Проверка конфигурации
nginx -t

# Перезагрузка Nginx
systemctl reload nginx
```

### 5. Настройка прав доступа

```bash
# Если используете Nginx с пользователем www-data (Ubuntu/Debian)
chown -R www-data:www-data /home/appuser/Farm/dist
chmod -R 755 /home/appuser/Farm/dist

# Или для nginx (CentOS/RHEL)
chown -R nginx:nginx /opt/landing-page/dist
chmod -R 755 /opt/landing-page/dist
```

## Настройка SSL (HTTPS)

### Установка Certbot (Let's Encrypt)

```bash
# Ubuntu/Debian
apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
yum install -y certbot python3-certbot-nginx
```

### Получение SSL сертификата

```bash
certbot --nginx -d romanovy-prostory.ru -d www.romanovy-prostory.ru
```

Certbot автоматически обновит конфигурацию Nginx и настроит автоматическое обновление сертификата.

## Обновление конфигурации Nginx для HTTPS

После установки SSL Certbot автоматически обновит конфигурацию, но вы можете отредактировать её вручную:

```bash
nano /etc/nginx/sites-available/landing-page
```

Пример конфигурации с HTTPS:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ваш-домен.ru www.ваш-домен.ru;

    ssl_certificate /etc/letsencrypt/live/ваш-домен.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ваш-домен.ru/privkey.pem;
    
    # Настройки SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /opt/landing-page/dist;
    index index.html;

    # Сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Кеширование статических файлов
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|mp4|webp|woff|woff2|ttf|otf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Основная конфигурация для SPA
    location / {
        try_files $uri $uri/ /index.html;
        
        # Заголовки безопасности
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    }

    # Логи
    access_log /var/log/nginx/landing-page-access.log;
    error_log /var/log/nginx/landing-page-error.log;
}
```

После изменений:
```bash
nginx -t
systemctl reload nginx
```

## Настройка файрвола

```bash
# Ubuntu/Debian (ufw)
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Или для CentOS/RHEL (firewalld)
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

## Автоматизация обновлений

### Скрипт для автоматического деплоя

Создайте скрипт `/opt/landing-page/deploy.sh`:

```bash
#!/bin/bash
cd /opt/landing-page
git pull origin main  # если используете git
npm install
npm run build
chown -R www-data:www-data dist
systemctl reload nginx
echo "Deploy completed!"
```

Сделайте его исполняемым:
```bash
chmod +x /home/appuser/deploy.sh
```

## Проверка работы

1. Откройте браузер и перейдите на ваш домен или IP адрес
2. Проверьте логи Nginx:
   ```bash
   tail -f /var/log/nginx/landing-page-access.log
   tail -f /var/log/nginx/landing-page-error.log
   ```

## Частые проблемы

### 403 Forbidden
```bash
# Проверьте права доступа
ls -la /opt/landing-page/dist
chown -R www-data:www-data /opt/landing-page/dist
chmod -R 755 /opt/landing-page/dist
```

### 502 Bad Gateway
```bash
# Проверьте статус Nginx
systemctl status nginx
# Проверьте конфигурацию
nginx -t
```

### Порт 80/443 занят
```bash
# Найдите процесс, использующий порт
netstat -tulpn | grep :80
# Остановите конфликтующий сервис или измените порт в конфигурации
```

## Диагностика и исправление ошибки 403 Forbidden

**403 Forbidden** означает, что Nginx нашел файлы, но не может их прочитать из-за прав доступа.

### Быстрое решение ошибки 403:

```bash
# На сервере выполните:

# 1. Установите правильные права на ВСЮ цепочку директорий
sudo chmod 755 /home
sudo chmod 755 /home/appuser
sudo chmod 755 /home/appuser/Farm
sudo chmod 755 /home/appuser/Farm/dist

# 2. Установите права на файлы и директории внутри dist
sudo chmod -R 755 /home/appuser/Farm/dist
sudo find /home/appuser/Farm/dist -type f -exec chmod 644 {} \;
sudo find /home/appuser/Farm/dist -type d -exec chmod 755 {} \;

# 3. Установите правильного владельца (www-data - пользователь Nginx)
sudo chown -R www-data:www-data /home/appuser/Farm/dist

# 4. Или дайте группе www-data доступ через группу
sudo chgrp -R www-data /home/appuser/Farm/dist
sudo chmod -R g+r /home/appuser/Farm/dist
sudo chmod -R g+X /home/appuser/Farm/dist  # заглавная X - только для директорий

# 5. Проверьте что www-data может прочитать файл
sudo -u www-data cat /home/appuser/Farm/dist/index.html | head -5

# 6. Перезагрузите Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Проверка прав доступа:

```bash
# Проверьте права на каждый уровень пути
ls -ld /home
ls -ld /home/appuser
ls -ld /home/appuser/Farm
ls -ld /home/appuser/Farm/dist
ls -la /home/appuser/Farm/dist/ | head -10

# Должно быть примерно так:
# drwxr-xr-x для директорий
# -rw-r--r-- для файлов
```

### Альтернативное решение (переместить в /var/www):

Если проблемы с правами в `/home` продолжаются:

```bash
# Переместите проект в стандартную директорию
sudo mkdir -p /var/www/landing-page
sudo cp -r /home/appuser/Farm/dist/* /var/www/landing-page/
sudo chown -R www-data:www-data /var/www/landing-page
sudo chmod -R 755 /var/www/landing-page

# Обновите конфигурацию Nginx
sudo nano /etc/nginx/sites-available/default
# Измените: root /var/www/landing-page;

sudo nginx -t
sudo systemctl reload nginx
```

## Диагностика ошибки 500

### Шаг 1: Проверка логов Nginx (самое важное!)

```bash
# Просмотр последних ошибок
tail -n 50 /var/log/nginx/landing-page-error.log

# Или общий лог ошибок
tail -n 50 /var/log/nginx/error.log

# Отслеживание ошибок в реальном времени
tail -f /var/log/nginx/error.log
```

Логи покажут точную причину ошибки. Типичные сообщения:
- `Permission denied` - проблема с правами доступа
- `No such file or directory` - файлы не найдены
- `FastCGI sent in stderr` - проблемы с PHP (если используется)
- `Directory index is forbidden` - проблема с индексом

### Шаг 2: Проверка существования файлов

```bash
# Проверьте, существует ли директория dist
ls -la /home/appuser/Farm/dist

# Проверьте наличие index.html
ls -la /home/appuser/Farm/dist/index.html

# Проверьте полный путь
stat /home/appuser/Farm/dist/index.html
```

### Шаг 3: Проверка прав доступа

```bash
# Проверьте права на директорию и файлы
ls -la /home/appuser/Farm/
ls -la /home/appuser/Farm/dist/

# Установите правильные права (Nginx должен читать файлы)
# Если Nginx работает от www-data (Ubuntu/Debian):
chown -R appuser:www-data /home/appuser/Farm/dist
chmod -R 755 /home/appuser/Farm/dist

# Или дайте Nginx доступ через группу
chmod 755 /home/appuser/Farm
chmod 755 /home/appuser/Farm/dist
chmod 644 /home/appuser/Farm/dist/index.html
```

### Шаг 4: Проверка конфигурации Nginx

```bash
# Проверка синтаксиса конфигурации
nginx -t

# Если ошибки - проверьте конфигурацию
nano /etc/nginx/sites-available/default
```

Убедитесь, что в конфигурации:
- Правильный путь `root /home/appuser/Farm/dist;`
- Нет опечаток в путях
- Nginx имеет права на чтение директории

### Шаг 5: Проверка SELinux (если CentOS/RHEL)

```bash
# Проверьте статус SELinux
getenforce

# Если Enforcing, нужно разрешить доступ:
setsebool -P httpd_read_user_content 1
chcon -R -t httpd_sys_content_t /home/appuser/Farm/dist

# Или временно отключить для теста (не рекомендуется для production)
setenforce 0
```

### Шаг 6: Проверка процесса Nginx

```bash
# Проверьте, под каким пользователем работает Nginx
ps aux | grep nginx

# Проверьте конфигурацию пользователя в главном файле
grep "user" /etc/nginx/nginx.conf
```

### Шаг 7: Тест доступа Nginx к файлам

```bash
# Попробуйте открыть файл от имени пользователя Nginx
# Для Ubuntu/Debian (пользователь www-data):
sudo -u www-data cat /home/appuser/Farm/dist/index.html

# Если ошибка - проблема с правами доступа
```

### Типичные решения

**Решение 1: Исправить права доступа (самое частое)**
```bash
# Настройте права правильно
chmod 755 /home/appuser/Farm
chmod 755 /home/appuser/Farm/dist
chown -R appuser:www-data /home/appuser/Farm/dist
chmod -R 755 /home/appuser/Farm/dist
```

**Решение 2: Переместить проект в стандартную директорию**
```bash
# Если проблемы с правами в /home, переместите в /var/www
sudo mkdir -p /var/www/landing-page
sudo cp -r /home/appuser/Farm/dist/* /var/www/landing-page/
sudo chown -R www-data:www-data /var/www/landing-page
sudo chmod -R 755 /var/www/landing-page

# Обновите конфигурацию Nginx:
# root /var/www/landing-page;
```

**Решение 3: Проверить структуру проекта**
```bash
# Убедитесь, что сборка прошла успешно
cd /home/appuser/Farm/landing-page
npm run build

# Проверьте, что dist/ содержит все файлы
ls -la dist/
```

**Решение 4: Временно упростить конфигурацию для теста**
```nginx
server {
    listen 80;
    server_name romanovy-prostory.ru www.romanovy-prostory.ru;
    
    root /home/appuser/Farm/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

После изменений:
```bash
nginx -t
systemctl reload nginx
```

## Расширенная диагностика (когда основные проблемы решены)

Если права доступа, файлы и конфигурация в порядке, но ошибка 500 остаётся:

### Шаг 8: Проверка SELinux (если CentOS/RHEL)

```bash
# Проверьте статус SELinux
getenforce

# Если статус Enforcing, это может блокировать доступ
# Разрешите доступ к файлам:
setsebool -P httpd_read_user_content 1
setsebool -P httpd_enable_homedirs 1
chcon -R -t httpd_sys_content_t /home/appuser/Farm/dist
chcon -R -t httpd_sys_content_t /home/appuser/Farm

# Или временно отключите для диагностики (НЕ для production!):
setenforce 0

# После этого проверьте сайт снова
```

### Шаг 9: Проверка AppArmor (если Ubuntu)

```bash
# Проверьте статус AppArmor
sudo aa-status

# Проверьте логи AppArmor на блокировки
sudo tail -f /var/log/kern.log | grep apparmor

# Если есть блокировки, добавьте правило или временно отключите профиль
sudo aa-complain /usr/sbin/nginx
```

### Шаг 10: Проверка содержимого файлов

```bash
# Убедитесь, что index.html не пустой и не повреждён
head -20 /home/appuser/Farm/dist/index.html
file /home/appuser/Farm/dist/index.html

# Проверьте размер файла
ls -lh /home/appuser/Farm/dist/index.html

# Проверьте, что файл читается Nginx
sudo -u www-data head -20 /home/appuser/Farm/dist/index.html
```

### Шаг 11: Проверка структуры директории dist

```bash
# Проверьте всю структуру
find /home/appuser/Farm/dist -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -20

# Проверьте, что assets/ существует
ls -la /home/appuser/Farm/dist/assets/

# Проверьте символические ссылки (если есть)
find /home/appuser/Farm/dist -type l -ls
```

### Шаг 12: Проверка путей в приложении

```bash
# Проверьте index.html на наличие абсолютных путей
grep -i "src=\|href=" /home/appuser/Farm/dist/index.html | head -10

# Если есть абсолютные пути, убедитесь, что они правильные
```

### Шаг 13: Тест прямого доступа к файлам

```bash
# Попробуйте открыть файл через curl от root
curl -I http://localhost/index.html

# Попробуйте от пользователя Nginx
sudo -u www-data curl -I http://localhost/index.html

# Проверьте, что порт слушается
sudo netstat -tulpn | grep :80
```

### Шаг 14: Проверка конфигурации Nginx подробнее

```bash
# Проверьте, какая конфигурация активна
ls -la /etc/nginx/sites-enabled/

# Проверьте, нет ли конфликтующих блоков server
grep -r "server_name.*romanovy" /etc/nginx/

# Проверьте главный конфигурационный файл
cat /etc/nginx/nginx.conf | grep -A 5 "include"

# Убедитесь, что нет ошибок при старте
sudo systemctl status nginx -l
```

### Шаг 15: Проверка файловой системы

```bash
# Проверьте, как смонтирована файловая система
df -h /home/appuser/Farm/dist
mount | grep $(df /home/appuser/Farm/dist | tail -1 | awk '{print $1}')

# Проверьте опции монтирования (не должно быть noexec, nosuid)
```

### Шаг 16: Временная замена index.html для теста

```bash
# Создайте простой тестовый файл
echo "<html><body><h1>Test</h1></body></html>" | sudo tee /home/appuser/Farm/dist/index.html.test

# Временно измените index в конфигурации Nginx:
# index index.html.test;

# Перезагрузите и проверьте
sudo nginx -t
sudo systemctl reload nginx

# Если работает - проблема в самом index.html или его зависимостях
```

### Шаг 17: Проверка через strace (продвинутая диагностика)

```bash
# Если ничего не помогает, отследите системные вызовы
sudo strace -f -e trace=open,openat,stat -p $(pgrep -f "nginx: worker") 2>&1 | grep -i farm

# Это покажет, к каким файлам Nginx пытается получить доступ
```

### Шаг 18: Проверка путей в коде сборки

Возможно, в собранных файлах есть абсолютные пути или неправильные ссылки:

```bash
# Проверьте JS файлы на наличие путей
grep -r "http://\|https://\|//" /home/appuser/Farm/dist/assets/*.js | head -5

# Проверьте базовый путь в index.html
grep -i "base href" /home/appuser/Farm/dist/index.html
```

### Шаг 19: Альтернативный root путь

Попробуйте временно изменить root на абсолютный путь:

```nginx
# В конфигурации Nginx попробуйте:
root /home/appuser/Farm/dist/;
# вместо
root /home/appuser/Farm/dist;
```

### Шаг 20: Проверка логов в реальном времени

Откройте два терминала:
```bash
# Терминал 1 - следите за ошибками
sudo tail -f /var/log/nginx/error.log

# Терминал 2 - делайте запрос
curl -v http://romanovy-prostory.ru/

# Смотрите, что появляется в терминале 1
```

### Шаг 21: Диагностика 500 ошибки (когда curl возвращает 500)

**Важно: Все команды ниже нужно выполнять НА СЕРВЕРЕ (подключившись через SSH), а не с локальной машины!**

Если `curl` возвращает точно 500, выполните на сервере:

**A. Проверка на самом сервере:**

```bash
# Подключитесь к серверу
ssh appuser@89.104.67.232

# 1. Проверьте локальный запрос ОТ СЕРВЕРА
curl -v http://127.0.0.1/ 2>&1 | head -30

# 2. Попробуйте открыть файл от имени www-data
sudo -u www-data cat /home/appuser/Farm/dist/index.html | head -30

# Если ошибка "Permission denied" - проблема с правами
# Если ошибка "No such file" - файла нет
```

**B. Проверка логов НА СЕРВЕРЕ (критически важно!):**

```bash
# На сервере проверьте логи подробнее
sudo tail -100 /var/log/nginx/error.log

# Ищите строки с "denied", "Permission", "failed", "open()"
sudo grep -i "denied\|permission\|failed\|open()" /var/log/nginx/error.log | tail -20

# Проверьте системные логи
sudo journalctl -u nginx --since "30 minutes ago" --no-pager | tail -50
```

**C. Проверка структуры файлов:**

```bash
# Проверьте существование всех нужных файлов
ls -la /home/appuser/Farm/dist/
ls -la /home/appuser/Farm/dist/index.html
ls -la /home/appuser/Farm/dist/assets/

# Проверьте путь в конфигурации
sudo nginx -T 2>&1 | grep -A 5 "root.*Farm"
```

**D. Тест доступа к файлам:**

```bash
# Попробуйте прочитать файл как www-data
sudo -u www-data ls -la /home/appuser/Farm/dist/
sudo -u www-data cat /home/appuser/Farm/dist/index.html > /tmp/test.html 2>&1
cat /tmp/test.html | head -20

# Если команда выше вернула ошибку - проблема с доступом
```

**E. Проверка конфигурации:**

```bash
# Убедитесь что правильная конфигурация активна
sudo ls -la /etc/nginx/sites-enabled/
sudo cat /etc/nginx/sites-available/default | grep -A 10 "server_name.*89.104"

# Проверьте что нет конфликтов
sudo nginx -T 2>&1 | grep -B 5 -A 15 "89.104.67.232"
```

**F. Временный тест с простым файлом:**

```bash
# Создайте простой тестовый файл
echo "TEST OK" | sudo tee /home/appuser/Farm/dist/test.html
sudo chown www-data:www-data /home/appuser/Farm/dist/test.html

# Временно измените index в конфигурации
sudo nano /etc/nginx/sites-available/default
# Измените: index test.html index.html;

sudo nginx -t
sudo systemctl reload nginx

# Проверьте
curl http://89.104.67.232/test.html

# Если работает - проблема в index.html или его зависимостях
```

### Шаг 22: Если ошибок в логе нет, но 500 остаётся

Если `error.log` пустой, но ошибка 500 есть:

**1. Проверьте что именно возвращает curl:**

```bash
# По IP адресу (89.104.67.232):
curl -v http://89.104.67.232/ 2>&1 | head -30

# Посмотрите только HTTP код по IP
curl -o /dev/null -s -w "HTTP код: %{http_code}\n" http://89.104.67.232/

# По домену (если уже настроен):
curl -v http://romanovy-prostory.ru/ 2>&1 | head -30

# Посмотрите только HTTP код по домену
curl -o /dev/null -s -w "HTTP код: %{http_code}\n" http://romanovy-prostory.ru/

# Если curl возвращает 200, а браузер показывает 500 - проблема в кэше браузера
```

**2. Проверьте access лог:**

```bash
# Посмотрите запросы в access логе
sudo tail -20 /var/log/nginx/landing-page-access.log

# Или общий лог
sudo tail -20 /var/log/nginx/access.log
```

**3. Проверьте что именно читает Nginx:**

```bash
# Проверьте содержимое ответа через Nginx
curl http://localhost/ 2>&1 | head -50

# Проверьте что index.html действительно читается
sudo -u www-data cat /home/appuser/Farm/dist/index.html | head -50
```

**4. Проверьте кэш браузера:**

Ошибка 500 может быть закэширована в браузере:
- Откройте сайт в режиме инкогнито
- Очистите кэш браузера (Ctrl+Shift+Delete)
- Или добавьте параметр: `http://romanovy-prostory.ru/?nocache=1`

**5. Проверьте все логи Nginx:**

```bash
# Проверьте все возможные логи
sudo ls -la /var/log/nginx/
sudo cat /var/log/nginx/error.log | tail -50
sudo cat /var/log/nginx/access.log | tail -50
sudo cat /var/log/nginx/landing-page-error.log | tail -50
sudo cat /var/log/nginx/landing-page-access.log | tail -50
```

**6. Проверьте системные логи:**

```bash
# Проверьте системные логи на проблемы с Nginx
sudo journalctl -u nginx -n 50 --no-pager

# Или за последние 10 минут
sudo journalctl -u nginx --since "10 minutes ago"
```

**7. Проверьте конфигурацию подробнее:**

```bash
# Убедитесь что правильная конфигурация активна
sudo nginx -T | grep -A 20 "server_name.*romanovy"

# Проверьте root директорию в активной конфигурации
sudo nginx -T | grep -B 5 -A 5 "root"
```

**8. Тест с минимальной конфигурацией:**

Временно упростите конфигурацию до минимума:
```nginx
server {
    listen 80;
    server_name romanovy-prostory.ru;

    root /home/appuser/Farm/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

**9. Проверьте что это не проблема с SSL редиректом:**

```bash
# По IP адресу:
curl -I http://89.104.67.232/

# По домену (если настроен):
curl -I http://romanovy-prostory.ru/
curl -I https://romanovy-prostory.ru/

# Если HTTPS работает, а HTTP нет - проблема с редиректом
```

### Дополнительные решения

**Решение 5: Переместить в /var/www (рекомендуется)**
```bash
# Часто проблемы в /home связаны с системными ограничениями
sudo mkdir -p /var/www/landing-page
sudo cp -r /home/appuser/Farm/dist/* /var/www/landing-page/
sudo chown -R www-data:www-data /var/www/landing-page
sudo chmod -R 755 /var/www/landing-page

# Обновите Nginx:
sudo nano /etc/nginx/sites-available/default
# Измените root на: root /var/www/landing-page;

sudo nginx -t
sudo systemctl reload nginx
```

**Решение 6: Полная пересборка проекта**
```bash
cd /home/appuser/Farm/landing-page
rm -rf dist node_modules
npm install
npm run build

# Проверьте, что dist создался правильно
ls -la dist/
```

**Решение 7: Проверка кодировки файлов**
```bash
# Убедитесь, что файлы в правильной кодировке
file -i /home/appuser/Farm/dist/index.html
# Должно быть: text/html; charset=utf-8
```

## Полезные команды

```bash
# Проверка статуса Nginx
systemctl status nginx

# Перезапуск Nginx
systemctl restart nginx

# Проверка конфигурации Nginx
nginx -t

# Просмотр активных конфигураций
ls -la /etc/nginx/sites-enabled/

# Проверка портов
netstat -tulpn
```

## Резервное копирование

Рекомендуется настроить автоматическое резервное копирование:

```bash
# Создание бэкапа директории dist
tar -czf /backup/landing-page-$(date +%Y%m%d).tar.gz /opt/landing-page/dist
```

ssh root@ip
certbot --nginx -d romanovy-prostory.ru -d www.romanovy-prostory.ru
ввести почту
nginx -t
systemctl reload nginx
```
Для деплоя:
ssh appuser@ip
password: 
./deploy.sh


# bear-s-tool
Bear's tool include site scraber and name generator right now
- sudo apt-get update
- sudo apt-get install nodejs
- sudo apt-get install npm
- sudo apt-get install ruby
- sudo gem install sass 
- git clone https://github.com/bear2029/bear-s-tool.git
- sudo apt-get install openjdk-7-jre-headless -y
- wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.5.2.deb
- sudo dpkg -i elasticsearch-1.5.2.deb
 
ElasticSearch setting
for cross domain
- sudo vi /etc/elasticsearch/elasticsearch.yml
add
```
http.cors.enabled : true
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length
```
Reference:
http://www.noip.com/support/knowledgebase/installing-the-linux-dynamic-update-client-on-ubuntu/
https://gist.github.com/ricardo-rossi/8265589463915837429d
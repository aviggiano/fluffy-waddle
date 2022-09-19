#!/usr/bin/env bash
# * * * * * /root/crontab.sh  >> /root/crontab.log 2>&1

set -eux

echo $(date)
cd fluffy-waddle
git remote update
BEHIND=$(git status | grep behind)
if [ "$BEHIND" != "" ]; then
	docker ps | grep -v CONTAINER | awk '{print $1}' | xargs -I{} docker kill {}
	git pull
	docker build . -t fluffy
	docker run -d fluffy -c "yarn docker"
fi

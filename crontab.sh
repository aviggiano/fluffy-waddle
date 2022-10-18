#!/usr/bin/env bash
# * * * * * /root/crontab.sh  >> /root/crontab.log 2>&1

set -eux

echo $(date)
cd fluffy-waddle
git remote update
BEHIND=$(git status | grep behind)
if [ "$BEHIND" != "" ]; then
	git pull
	# cleanup
	sudo docker system prune -a -f

	# run new version
	docker ps | grep -v CONTAINER | awk '{print $1}' | xargs -I{} docker kill {}
	docker build . -t fluffy
	docker run -d fluffy -c "yarn docker"
	cp crontab.sh > /root/crontab.sh
fi

# Install rsync and openssh. Fail if unknown package manager
# Future plans: nixOS?
install_rsync(){
	echo Checking for rsync...
if ! command -v rsync &> /dev/null
then
	if [ -d "/etc/apt" ]; then
		echo apt is installed. apt will be used to install rsync
		sudo apt install -y rsync openssh-client
	elif  [ -d "/etc/apk" ]; then
		echo apk is installed. apk will be used to install rsync
		sudo apk add rsync openssh-client
	elif  [ -d "/etc/yum" ]; then
		echo yum is installed. yum will be used to install rsync
		sudo yum -y install rsync openssh-client
	else
		echo rsync is not installed and not supported package manager could be found.
		exit 1
	fi
fi
}


export PGDATABASE=$1
export PGUSER=$2
export PGPASSWORD=$3

# This has to be localhost. This script is only meant for local usage
export PGHOST=localhost

TIMESTAMP=$(date +%s)

echo Running setup..

install_rsync

echo Running postgres backup...
mkdir --parent backup/pg

echo $PGUSER
echo $PGDATABASE
echo $PGPASSWORD

# Dump the db in a format that is able to replace an existing db if need be
pg_dump --create --disable-triggers --clean --if-exists --format t --file backup/pg/$TIMESTAMP.tar


echo 'Running eventstore backup...'

mkdir --parent backup/es
mkdir --parent backup/tmp

ESFOLDER=$4

# Prefer rsync as it supports exclude
# Copy index checkpoint files
rsync -aIR $ESFOLDER/./index/**/*.chk backup/tmp
# Copy index files
rsync -aI --exclude '*.chk' $ESFOLDER/index backup/tmp
# Copy base checkpoint files
rsync -aI $ESFOLDER/*.chk backup/tmp
# Copy data
rsync -a $ESFOLDER/*.0* backup/tmp

# tar that bad boy up
tar -zcvf backup/es/$TIMESTAMP.tar backup/tmp


echo Running cleanup...

# Remove tmp
rm -R backup/tmp

# Remove all files but the newest 10 from pg backups
(cd backup/pg && ls -tp | grep -v '/$' | tail -n +11 | xargs -I {} rm -- {})

# Remove all files but the newest 10 from es backups
(cd backup/es && ls -tp | grep -v '/$' | tail -n +11 | xargs -I {} rm -- {})


echo Syncing...

RSUSER=$5
RSHOST=$6

# This requires the ssh setup to be done beforehand...the script will not tamper with ssh config
rsync -r --delete ./backup $RSUSER@$RSHOST:/home/wwweights/

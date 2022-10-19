#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]
then
  echo "Need input with build env('prod' or 'staging'), exit!"
  exit 1
else 
  echo $1
  echo $2
  echo $1
  env MACHINE_ENV=$1 MONGO_INITDB_ROOT_PASSWORD=$2 MONGO_PASSWORD=$3 docker-compose -p auto-answer-backend-hub up -d 
fi

# sh build.sh prod root123456 test123456
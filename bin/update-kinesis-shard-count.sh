if [ $# -ne 2 ]; then
  echo
  echo "usage: $0 <stream_name> <shard_count> <scaling_type>"
  echo "<scaling_type> possible values UNIFORM_SCALING"
  echo
  exit 1
fi

# update stream
STREAM_NAME=$1
SHARD_COUNT=$2
SCALING_TYPE=$3

aws kinesis update-shard-count --stream-name $STREAM_NAME --scaling-type $SCALING_TYPE --target-shard-count $SHARD_COUNT

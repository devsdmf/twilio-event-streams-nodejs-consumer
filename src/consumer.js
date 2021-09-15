const kcl = require('aws-kcl');
const Logger = require('./logger');

const recordProcessor = () => {
  const logger = Logger().getLogger('default');

  return {
    initialize: (initializeInput, completeCallback) => {
      this.shardId = initializeInput.shardId;
      completeCallback();
    },

    processRecords: (processRecordsInput, completeCallback) => {
      if (!processRecordsInput || !processRecordsInput.records) {
        completeCallback();
        return;
      }

      const processedRecords = processRecordsInput.records.map(r => {
        logger.info(`Processing record on Shard ${this.shardId}`);
        const data = new Buffer(r.data, 'base64').toString();
        logger.info(data);
        logger.debug(`Processed data on sequence ${r.sequenceNumber} on partition ${r.partitionKey}`);
        return r;
      });

      const lastRecord = processedRecords.pop();
      if (!lastRecord) {
        completeCallback();
        return;
      }

      const sequenceNumber = lastRecord.sequenceNumber;

      // If checkpointing, completeCallback should only be called once checkpoint is complete.
      processRecordsInput.checkpointer.checkpoint(sequenceNumber, function(err, sequenceNumber) {
        logger.info(`Checkpoint successful. ShardID: ${this.shardId}, SeqenceNumber: ${sequenceNumber}`);
        completeCallback();
      });
    },

    leaseLost: (leaseLostInput, completeCallback) => {
      logger.info(`Lease was lost for ShardId: ${this.shardId}`);
      completeCallback();
    },

    shardEnded: (shardEndedInput, completeCallback) => {
      logger.info(`ShardId: ${this.shardId} has ended. Will checkpoint now.`);
      shardEndedInput.checkpointer.checkpoint((err) => {
        completeCallback();
      });
    },

    shutdownRequested: (shutdownRequestedInput, completeCallback) => {
      shutdownRequestedInput.checkpointer.checkpoint((err) => {
        completeCallback();
      });
    }
  };
};

kcl(recordProcessor()).run();
